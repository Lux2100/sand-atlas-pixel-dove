import { useEffect } from "react";
import { CLINIC_PERSIST_KEY, useClinicStore } from "@/lib/store";

export function StoreHydrator() {
  useEffect(() => {
    let cancelled = false;
    const had = typeof localStorage !== "undefined" ? localStorage.getItem(CLINIC_PERSIST_KEY) : null;
    void Promise.resolve(useClinicStore.persist.rehydrate()).then(() => {
      if (cancelled) return;
      if (!had) {
        try {
          useClinicStore.setState((s) => ({ patients: s.patients.slice() }));
        } catch {
          /* persist quota */
        }
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);
  return null;
}
