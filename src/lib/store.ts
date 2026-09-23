import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { ageFromBirth, snapVisitTime, todayISO } from "./format";
import { HOUSE_TREATMENTS } from "./procedures";
import { clinicPersistStorage } from "./photo-storage";
import type { DayBooking } from "./reservations";
import { makeSeed } from "./seed";
import type { Consult, Patient, Photo, Reservation, Showcase, Visit, VisitStatus } from "./types";
import { uid } from "./utils";

const PERSIST_KEY = "aura-clinic-v6";

export type ClinicData = {
  patients: Patient[];
  visits: Visit[];
  photos: Photo[];
  showcases: Showcase[];
  reservations: Reservation[];
  consults: Consult[];
  houseIds: string[];
  scratchNote: string;
};

/** Additive patches for `aura-clinic-v6`. Never drops collections or changes the persist key. */
export function migrateClinicSnapshot(persisted: Partial<ClinicData> | undefined, current: ClinicData): ClinicData {
  const p = persisted ?? {};
  return {
    patients: p.patients ?? current.patients,
    visits: p.visits ?? current.visits,
    photos: p.photos ?? current.photos,
    showcases: p.showcases ?? current.showcases,
    reservations: p.reservations ?? current.reservations,
    consults: p.consults ?? current.consults,
    houseIds: p.houseIds?.length ? p.houseIds : current.houseIds,
    scratchNote: typeof p.scratchNote === "string" ? p.scratchNote : "",
  };
}

type PatientInput = Partial<Patient> & Pick<Patient, "name">;
type VisitInput = Partial<Visit> & Pick<Visit, "patientId" | "date" | "treatments">;
type PhotoInput = Omit<Photo, "id"> & { id?: string };
type ShowcaseInput = Omit<Showcase, "id"> & { id?: string };
type ReservationInput = Partial<Reservation> & Pick<Reservation, "date" | "name">;
type ConsultInput = Omit<Consult, "id"> & { id?: string };

export type ClinicState = ClinicData & {
  upsertPatient: (input: PatientInput) => Patient;
  removePatient: (id: string) => void;
  upsertVisit: (input: VisitInput) => Visit;
  removeVisit: (id: string) => void;
  addPhoto: (input: PhotoInput) => Photo;
  updatePhoto: (id: string, patch: Partial<Pick<Photo, "takenAt" | "kind" | "note">>) => void;
  removePhoto: (id: string) => void;
  addShowcase: (input: ShowcaseInput) => Showcase;
  removeShowcase: (id: string) => void;
  upsertReservation: (input: ReservationInput) => Reservation;
  removeReservation: (id: string) => void;
  toggleBookingCancel: (booking: DayBooking) => void;
  arriveBooking: (booking: DayBooking) => void;
  addConsult: (input: ConsultInput) => Consult;
  removeConsult: (id: string) => void;
  toggleHouse: (treatmentId: string) => void;
  isHouse: (treatmentId: string) => boolean;
  setVisitStatus: (id: string, status: VisitStatus) => void;
  setScratchNote: (note: string) => void;
};

export function paidOf(v: Visit) {
  return v.source === "cancel" ? 0 : (v.paidAmount ?? 0);
}

export function todaySales(visits: Visit[], date = todayISO()) {
  return visits.filter((v) => v.date === date).reduce((sum, v) => sum + paidOf(v), 0);
}

export function monthSales(visits: Visit[], isoOrPrefix?: string) {
  const prefix = (isoOrPrefix ?? todayISO()).slice(0, 7);
  return visits.filter((v) => v.date.startsWith(prefix)).reduce((sum, v) => sum + paidOf(v), 0);
}

export function cardBalance(visits: Visit[], patientId: string) {
  return visits
    .filter((v) => v.patientId === patientId && v.source !== "cancel")
    .reduce((sum, v) => sum + (v.rechargeAmount ?? 0) - (v.redeemAmount ?? 0), 0);
}

const seed = makeSeed();

export const useClinicStore = create<ClinicState>()(
  persist(
    (set, get) => ({
      ...seed,

      upsertPatient: (input) => {
        const id = input.id ?? uid("p-");
        const existing = get().patients.find((p) => p.id === id);
        const birth = input.birth ?? existing?.birth;
        const age = input.age ?? existing?.age ?? ageFromBirth(birth);
        const next: Patient = {
          id,
          chartNo: input.chartNo !== undefined ? input.chartNo.trim() : (existing?.chartNo ?? ""),
          name: input.name ?? existing?.name ?? "",
          phone: input.phone ?? existing?.phone,
          birth,
          age,
          gender: input.gender ?? existing?.gender,
          memo: input.memo ?? existing?.memo,
          createdAt: existing?.createdAt ?? input.createdAt ?? new Date().toISOString(),
        };
        set({
          patients: existing
            ? get().patients.map((p) => (p.id === id ? next : p))
            : [...get().patients, next],
        });
        return next;
      },

      removePatient: (id) => {
        set({
          patients: get().patients.filter((p) => p.id !== id),
          visits: get().visits.filter((v) => v.patientId !== id),
          photos: get().photos.filter((p) => p.patientId !== id),
          showcases: get().showcases.filter((s) => s.patientId !== id),
          consults: get().consults.filter((c) => c.patientId !== id),
          reservations: get().reservations.filter((r) => r.patientId !== id),
        });
      },

      upsertVisit: (input) => {
        const id = input.id ?? uid("v-");
        const existing = get().visits.find((v) => v.id === id);
        const time = input.time !== undefined ? (input.time ? snapVisitTime(input.time) : input.time) : existing?.time;
        const next: Visit = {
          id,
          patientId: input.patientId,
          date: input.date,
          time,
          treatments: input.treatments,
          memo: input.memo ?? existing?.memo,
          nextVisit: input.nextVisit ?? existing?.nextVisit,
          paidAmount: input.paidAmount ?? existing?.paidAmount,
          rechargeAmount: input.rechargeAmount ?? existing?.rechargeAmount,
          redeemAmount: input.redeemAmount ?? existing?.redeemAmount,
          source: input.source ?? existing?.source,
          status: input.status ?? existing?.status,
        };
        set({
          visits: existing
            ? get().visits.map((v) => (v.id === id ? next : v))
            : [...get().visits, next],
        });
        return next;
      },

      removeVisit: (id) => {
        set({
          visits: get().visits.filter((v) => v.id !== id),
          photos: get().photos.map((p) => (p.visitId === id ? { ...p, visitId: undefined } : p)),
        });
      },

      addPhoto: (input) => {
        const photo: Photo = { ...input, id: input.id ?? uid("ph-") };
        set({ photos: [...get().photos, photo] });
        return photo;
      },

      updatePhoto: (id, patch) => {
        set({
          photos: get().photos.map((p) => (p.id === id ? { ...p, ...patch } : p)),
        });
      },

      removePhoto: (id) => {
        set({
          photos: get().photos.filter((p) => p.id !== id),
          showcases: get().showcases.filter((s) => s.beforePhotoId !== id && s.afterPhotoId !== id),
        });
      },

      addShowcase: (input) => {
        const row: Showcase = { ...input, id: input.id ?? uid("sc-") };
        set({ showcases: [...get().showcases, row] });
        return row;
      },

      removeShowcase: (id) => {
        set({ showcases: get().showcases.filter((s) => s.id !== id) });
      },

      upsertReservation: (input) => {
        const id = input.id ?? uid("r-");
        const existing = get().reservations.find((r) => r.id === id);
        const time = input.time !== undefined ? (input.time ? snapVisitTime(input.time) : input.time) : existing?.time;
        const next: Reservation = {
          id,
          date: input.date,
          time,
          name: input.name,
          phone: input.phone ?? existing?.phone,
          patientId: input.patientId ?? existing?.patientId,
          chartNo: input.chartNo !== undefined ? input.chartNo.trim() || undefined : existing?.chartNo,
          gender: input.gender !== undefined ? input.gender : existing?.gender,
          treatments: input.treatments ?? existing?.treatments,
          note: input.note !== undefined ? input.note.trim() || undefined : existing?.note,
          cancelled: input.cancelled ?? existing?.cancelled,
        };
        set({
          reservations: existing
            ? get().reservations.map((r) => (r.id === id ? next : r))
            : [...get().reservations, next],
        });
        return next;
      },

      removeReservation: (id) => {
        set({ reservations: get().reservations.filter((r) => r.id !== id) });
      },

      toggleBookingCancel: (booking) => {
        if (booking.source === "manual") {
          const r = get().reservations.find((x) => x.id === booking.id);
          if (!r) return;
          const cancelled = !r.cancelled;
          set({
            reservations: get().reservations.map((x) => (x.id === booking.id ? { ...x, cancelled } : x)),
          });
          if (cancelled && r.patientId) {
            const visit: Visit = {
              id: uid("v-"),
              patientId: r.patientId,
              date: r.date,
              time: r.time,
              treatments: r.treatments ?? [],
              memo: "예약 취소",
              source: "cancel",
            };
            set({ visits: [...get().visits, visit] });
          }
          return;
        }
        if (!booking.patientId) return;
        if (booking.cancelled) {
          set({
            visits: get().visits.filter(
              (v) =>
                !(
                  v.source === "cancel" &&
                  v.patientId === booking.patientId &&
                  v.date === booking.date &&
                  v.memo === "예약 취소"
                ),
            ),
          });
          return;
        }
        const visit: Visit = {
          id: uid("v-"),
          patientId: booking.patientId,
          date: booking.date,
          time: booking.time,
          treatments: booking.treatments ?? [],
          memo: "예약 취소",
          source: "cancel",
        };
        set({ visits: [...get().visits, visit] });
      },

      arriveBooking: (booking) => {
        if (booking.cancelled) return;
        let patient = booking.patientId
          ? get().patients.find((p) => p.id === booking.patientId)
          : undefined;
        if (!patient && booking.chartNo?.trim()) {
          const key = booking.chartNo.trim();
          patient = get().patients.find((p) => p.chartNo.trim() === key);
        }
        if (!patient) {
          patient = get().upsertPatient({
            name: booking.name,
            phone: booking.phone,
            chartNo: booking.chartNo ?? "",
            gender: booking.gender,
          });
        } else if ((!patient.gender && booking.gender) || (!patient.chartNo.trim() && booking.chartNo)) {
          patient = get().upsertPatient({
            id: patient.id,
            name: patient.name,
            gender: patient.gender ?? booking.gender,
            chartNo: patient.chartNo.trim() ? patient.chartNo : (booking.chartNo ?? ""),
          });
        }
        const arrived = get().visits.some(
          (v) => v.patientId === patient.id && v.date === booking.date && v.source !== "cancel",
        );
        if (!arrived) {
          get().upsertVisit({
            patientId: patient.id,
            date: booking.date,
            time: booking.time,
            treatments: booking.treatments ?? [],
            memo: booking.note && booking.note !== "다음 내원" ? booking.note : undefined,
            status: "consult",
          });
        }
        if (booking.source === "manual") {
          get().upsertReservation({
            id: booking.id,
            date: booking.date,
            time: booking.time,
            name: patient.name,
            phone: booking.phone ?? patient.phone,
            patientId: patient.id,
            chartNo: patient.chartNo || booking.chartNo,
            gender: patient.gender ?? booking.gender,
            treatments: booking.treatments,
            note: booking.note,
            cancelled: booking.cancelled,
          });
        }
      },

      addConsult: (input) => {
        const row: Consult = { ...input, id: input.id ?? uid("c-") };
        set({ consults: [...get().consults, row] });
        return row;
      },

      removeConsult: (id) => {
        set({ consults: get().consults.filter((c) => c.id !== id) });
      },

      toggleHouse: (treatmentId) => {
        const cur = get().houseIds;
        set({
          houseIds: cur.includes(treatmentId) ? cur.filter((id) => id !== treatmentId) : [...cur, treatmentId],
        });
      },

      isHouse: (treatmentId) => get().houseIds.includes(treatmentId),

      setVisitStatus: (id, status) => {
        set({
          visits: get().visits.map((v) => (v.id === id ? { ...v, status } : v)),
        });
      },

      setScratchNote: (note) => {
        set({ scratchNote: note });
      },
    }),
    {
      name: PERSIST_KEY,
      skipHydration: true,
      storage: createJSONStorage(() => clinicPersistStorage),
      partialize: (s) => ({
        patients: s.patients,
        visits: s.visits,
        photos: s.photos,
        showcases: s.showcases,
        reservations: s.reservations,
        consults: s.consults,
        houseIds: s.houseIds,
        scratchNote: s.scratchNote,
      }),
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<ClinicData>;
        return {
          ...current,
          ...migrateClinicSnapshot(p, current),
        };
      },
    },
  ),
);

export { PERSIST_KEY as CLINIC_PERSIST_KEY };

export function defaultHouseIds(): string[] {
  return HOUSE_TREATMENTS.map((t) => t.id);
}
