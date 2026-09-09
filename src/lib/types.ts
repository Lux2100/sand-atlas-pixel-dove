export type TreatmentCategory = "injectable" | "laser" | "lifting" | "skin" | "surgery";

export type Treatment = {
  id: string;
  name: string;
  category: TreatmentCategory;
  house?: boolean;
  aliases?: string[];
  summary: string;
  concerns: string[];
};

export type TreatmentProtocol = {
  treatmentId: string;
  energy?: string;
  tip?: string;
  interval: string;
  sessions: string;
  note?: string;
};

export type Patient = {
  id: string;
  chartNo: string;
  name: string;
  phone?: string;
  birth?: string;
  age?: number;
  gender?: "F" | "M";
  memo?: string;
  createdAt: string;
};

export type VisitStatus = "consult" | "prep" | "done";

export type Visit = {
  id: string;
  patientId: string;
  date: string;
  time?: string;
  treatments: string[];
  memo?: string;
  nextVisit?: string;
  paidAmount?: number;
  rechargeAmount?: number;
  redeemAmount?: number;
  source?: "cancel";
  status?: VisitStatus;
};

export type PhotoKind = "before" | "after" | "other";

export type Photo = {
  id: string;
  patientId: string;
  visitId?: string;
  kind: PhotoKind;
  url: string;
  takenAt: string;
  note?: string;
};

export type Showcase = {
  id: string;
  patientId: string;
  title: string;
  treatments: string[];
  beforePhotoId: string;
  afterPhotoId: string;
  note?: string;
};

export type Reservation = {
  id: string;
  date: string;
  time?: string;
  name: string;
  phone?: string;
  patientId?: string;
  treatments?: string[];
  note?: string;
  cancelled?: boolean;
};

export type PlanStep = {
  order: number;
  timing: string;
  title: string;
  treatments: string[];
  note: string;
};

export type FaceFinding = { area: string; concern: string; detail: string };
export type FaceRec = { name: string; reason: string; protocol?: string };
export type FaceAnalysis = { findings: FaceFinding[]; recommendations: FaceRec[]; plan: PlanStep[] };

export type Consult = {
  id: string;
  patientId: string;
  date: string;
  note?: string;
  analysis: FaceAnalysis;
  photoUrls: string[];
};

export type CourseStep = {
  timing: string;
  title: string;
  treatments: string[];
  note: string;
};
