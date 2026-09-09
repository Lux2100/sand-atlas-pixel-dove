import { dayOffset, todayISO } from "./format";
import { HOUSE_TREATMENTS } from "./procedures";
import type { Consult, Patient, Photo, Reservation, Showcase, Visit } from "./types";

export type ClinicSeed = {
  patients: Patient[];
  visits: Visit[];
  photos: Photo[];
  showcases: Showcase[];
  reservations: Reservation[];
  consults: Consult[];
  houseIds: string[];
};

export function makeSeed(): ClinicSeed {
  const today = todayISO();
  const tomorrow = dayOffset(1);
  const weekAgo = dayOffset(-7);
  const twoWeeksAgo = dayOffset(-14);
  const monthAgo = dayOffset(-28);
  const sixWeeksAgo = dayOffset(-42);

  const patients: Patient[] = [
    {
      id: "p-sujin",
      chartNo: "C-2024-0188",
      name: "배수진",
      phone: "010-5621-8840",
      birth: "1992-04-18",
      age: 34,
      gender: "F",
      memo: "★ 기미·모공. 원내 토닝 잘 받음. 차단 철저.",
      createdAt: "2024-03-12T09:10:00.000Z",
    },
    {
      id: "p-daeun",
      chartNo: "C-2025-0041",
      name: "윤다은",
      phone: "010-4412-3391",
      birth: "1998-11-02",
      age: 27,
      gender: "F",
      memo: "여드름 자국. 브이올렛 코스 중.",
      createdAt: "2025-01-20T11:00:00.000Z",
    },
    {
      id: "p-yujin",
      chartNo: "C-2025-0088",
      name: "최유진",
      phone: "010-3188-2290",
      birth: "1990-07-09",
      age: 36,
      gender: "F",
      memo: "웨딩 12월. 울쎄라+필러 계획.",
      createdAt: "2025-04-03T02:20:00.000Z",
    },
    {
      id: "p-junho",
      chartNo: "C-2024-0312",
      name: "이준호",
      phone: "010-7764-1022",
      birth: "1988-01-25",
      age: 38,
      gender: "M",
      memo: "사각턱·이중턱. 윤곽 3회차.",
      createdAt: "2024-08-16T07:40:00.000Z",
    },
    {
      id: "p-seoyeon",
      chartNo: "C-2025-0110",
      name: "한서연",
      phone: "010-8901-5566",
      birth: "1995-09-30",
      age: 30,
      gender: "F",
      memo: "홍조. 브이빔 유지. → 오늘 재내원.",
      createdAt: "2025-05-14T04:15:00.000Z",
    },
    {
      id: "p-minji",
      chartNo: "C-2025-0155",
      name: "김민지",
      phone: "010-2250-7788",
      birth: "2001-02-14",
      age: 25,
      gender: "F",
      memo: "물광·샤넬 관심. 내일 리터치.",
      createdAt: "2025-07-01T08:00:00.000Z",
    },
  ];

  const visits: Visit[] = [
    {
      id: "v-sujin-1",
      patientId: "p-sujin",
      date: sixWeeksAgo,
      time: "11:00",
      treatments: ["리쥬란", "피부관리"],
      memo: "장벽 재생 1회. 구진 안내.",
      paidAmount: 280000,
      rechargeAmount: 1000000,
      redeemAmount: 280000,
      nextVisit: monthAgo,
    },
    {
      id: "v-sujin-2",
      patientId: "p-sujin",
      date: monthAgo,
      time: "14:15",
      treatments: ["프락셀", "엑소좀"],
      memo: "모공 프락셀. 다운타임 4일.",
      paidAmount: 450000,
      redeemAmount: 200000,
      nextVisit: twoWeeksAgo,
    },
    {
      id: "v-sujin-3",
      patientId: "p-sujin",
      date: twoWeeksAgo,
      time: "10:30",
      treatments: ["큐레이저"],
      memo: "토닝 저출력. 기미 안정.",
      paidAmount: 120000,
      nextVisit: today,
    },
    {
      id: "v-sujin-today",
      patientId: "p-sujin",
      date: today,
      time: "10:20",
      treatments: ["큐레이저", "리투오"],
      memo: "★ 원내 토닝+리투오. 선크림 재교육.",
      paidAmount: 220000,
      nextVisit: dayOffset(14),
    },
    {
      id: "v-daeun-1",
      patientId: "p-daeun",
      date: monthAgo,
      time: "16:00",
      treatments: ["여드름관리", "염증주사"],
      memo: "낭종 1점.",
      paidAmount: 80000,
    },
    {
      id: "v-daeun-2",
      patientId: "p-daeun",
      date: weekAgo,
      time: "15:15",
      treatments: ["브이올렛", "아쿠아필"],
      memo: "피지 감소 중.",
      paidAmount: 180000,
      nextVisit: dayOffset(7),
    },
    {
      id: "v-yujin-1",
      patientId: "p-yujin",
      date: sixWeeksAgo,
      time: "13:00",
      treatments: ["울쎄라"],
      memo: "얼굴 600샷. 붓기 2일.",
      paidAmount: 1800000,
      rechargeAmount: 500000,
    },
    {
      id: "v-yujin-2",
      patientId: "p-yujin",
      date: twoWeeksAgo,
      time: "11:30",
      treatments: ["엘라비에 필러"],
      memo: "팔자 1cc, 볼 0.5cc.",
      paidAmount: 450000,
      nextVisit: dayOffset(30),
    },
    {
      id: "v-junho-1",
      patientId: "p-junho",
      date: monthAgo,
      time: "18:00",
      treatments: ["보톡스"],
      memo: "사각턱 양측.",
      paidAmount: 120000,
    },
    {
      id: "v-junho-2",
      patientId: "p-junho",
      date: twoWeeksAgo,
      time: "13:30",
      treatments: ["윤곽주사"],
      memo: "이중턱 1회차.",
      paidAmount: 90000,
      nextVisit: today,
    },
    {
      id: "v-junho-today",
      patientId: "p-junho",
      date: today,
      time: "13:45",
      treatments: ["윤곽주사"],
      memo: "이중턱 2회차. 라인 개선.",
      paidAmount: 90000,
      nextVisit: dayOffset(14),
    },
    {
      id: "v-seoyeon-1",
      patientId: "p-seoyeon",
      date: weekAgo,
      time: "09:30",
      treatments: ["브이빔", "LDM"],
      memo: "홍조 3회차. 자반 소량.",
      paidAmount: 250000,
      nextVisit: today,
    },
    {
      id: "v-minji-1",
      patientId: "p-minji",
      date: twoWeeksAgo,
      time: "17:00",
      treatments: ["샤넬주사", "피부관리"],
      memo: "광채 칵테일 1회. 만족.",
      paidAmount: 180000,
      nextVisit: tomorrow,
    },
    {
      id: "v-sujin-sep1",
      patientId: "p-sujin",
      date: "2026-09-01",
      time: "11:00",
      treatments: ["큐레이저", "MTS"],
      memo: "토닝 후 얕은 MTS.",
      paidAmount: 180000,
    },
    {
      id: "v-daeun-sep1",
      patientId: "p-daeun",
      date: "2026-09-01",
      time: "14:15",
      treatments: ["여드름관리", "피부관리"],
      memo: "압출 후 진정 관리.",
      paidAmount: 90000,
    },
    {
      id: "v-seoyeon-sep1",
      patientId: "p-seoyeon",
      date: "2026-09-01",
      time: "16:30",
      treatments: ["레스틸렌 물광"],
      memo: "볼 스킨부스터.",
      paidAmount: 250000,
    },
  ];

  const photos: Photo[] = [
    {
      id: "ph-sujin-b",
      patientId: "p-sujin",
      visitId: "v-sujin-2",
      kind: "before",
      url: "/gallery/sujin-before.svg",
      takenAt: monthAgo,
      note: "프락셀 전 정면",
    },
    {
      id: "ph-sujin-a",
      patientId: "p-sujin",
      visitId: "v-sujin-today",
      kind: "after",
      url: "/gallery/sujin-after.svg",
      takenAt: today,
      note: "토닝 후 6주",
    },
    {
      id: "ph-sujin-ob",
      patientId: "p-sujin",
      visitId: "v-sujin-1",
      kind: "other",
      url: "/gallery/sujin-oblique.svg",
      takenAt: sixWeeksAgo,
      note: "사위",
    },
    {
      id: "ph-yujin-b",
      patientId: "p-yujin",
      visitId: "v-yujin-1",
      kind: "before",
      url: "/gallery/yujin-before.svg",
      takenAt: sixWeeksAgo,
      note: "울쎄라 전",
    },
    {
      id: "ph-yujin-a",
      patientId: "p-yujin",
      visitId: "v-yujin-2",
      kind: "after",
      url: "/gallery/yujin-after.svg",
      takenAt: twoWeeksAgo,
      note: "리프팅+필러 후",
    },
    {
      id: "ph-daeun-b",
      patientId: "p-daeun",
      visitId: "v-daeun-1",
      kind: "before",
      url: "/gallery/daeun-before.svg",
      takenAt: monthAgo,
    },
    {
      id: "ph-daeun-a",
      patientId: "p-daeun",
      visitId: "v-daeun-2",
      kind: "after",
      url: "/gallery/daeun-after.svg",
      takenAt: weekAgo,
    },
  ];

  const showcases: Showcase[] = [
    {
      id: "sc-sujin-pore",
      patientId: "p-sujin",
      title: "모공·기미 6주",
      treatments: ["프락셀", "큐레이저", "리투오"],
      beforePhotoId: "ph-sujin-b",
      afterPhotoId: "ph-sujin-a",
      note: "원내 레이저 위주. 차단 잘 지킨 케이스.",
    },
    {
      id: "sc-yujin-lift",
      patientId: "p-yujin",
      title: "웨딩 리프팅",
      treatments: ["울쎄라", "엘라비에 필러"],
      beforePhotoId: "ph-yujin-b",
      afterPhotoId: "ph-yujin-a",
      note: "턱선·팔자. 본식 3개월 전 설계.",
    },
    {
      id: "sc-daeun-acne",
      patientId: "p-daeun",
      title: "여드름 진정",
      treatments: ["여드름관리", "브이올렛"],
      beforePhotoId: "ph-daeun-b",
      afterPhotoId: "ph-daeun-a",
    },
  ];

  const reservations: Reservation[] = [
    {
      id: "r-soyoung",
      date: today,
      time: "16:00",
      name: "박소영",
      phone: "010-6672-1010",
      treatments: ["상담"],
      note: "신규 상담. 차트 없음.",
    },
    {
      id: "r-seoyeon",
      date: today,
      time: "11:15",
      name: "한서연",
      phone: "010-8901-5566",
      patientId: "p-seoyeon",
      treatments: ["브이빔"],
      note: "재내원. nextVisit 오늘.",
    },
    {
      id: "r-minji",
      date: tomorrow,
      time: "14:00",
      name: "김민지",
      phone: "010-2250-7788",
      patientId: "p-minji",
      treatments: ["샤넬주사", "레스틸렌 물광"],
      note: "2회차 광채.",
    },
  ];

  const consults: Consult[] = [
    {
      id: "c-sujin-1",
      patientId: "p-sujin",
      date: monthAgo,
      note: "모공·기미 주호소. 원내 레이저 우선.",
      photoUrls: ["/gallery/sujin-before.jpg"],
      analysis: {
        findings: [
          { area: "양볼", concern: "기미", detail: "표피형 기미, 광대 중심." },
          { area: "코·볼", concern: "모공", detail: "피지광, 모공 확장." },
          { area: "눈밑", concern: "다크서클", detail: "얇은 피부+그림자." },
        ],
        recommendations: [
          { name: "큐레이저", reason: "원내 토닝으로 기미부터.", protocol: "1–2주 간격 5–10회 · 1064nm 저출력" },
          { name: "프락셀", reason: "모공·결.", protocol: "4–6주 3회 · 15–25mJ" },
          { name: "리쥬란", reason: "장벽·재생 병행.", protocol: "2–4주 3회" },
        ],
        plan: [
          { order: 1, timing: "당일", title: "토닝 시작", treatments: ["큐레이저"], note: "테스트 스팟 후 풀페이스." },
          { order: 2, timing: "2주 후", title: "프락셀", treatments: ["프락셀", "엑소좀"], note: "다운타임 고지." },
          { order: 3, timing: "6주 후", title: "유지 토닝", treatments: ["리투오", "큐레이저"], note: "원내  Dual." },
        ],
      },
    },
  ];

  return {
    patients,
    visits,
    photos,
    showcases,
    reservations,
    consults,
    houseIds: HOUSE_TREATMENTS.map((t) => t.id),
  };
}
