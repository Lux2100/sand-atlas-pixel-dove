export type BotoxRegion = "KR" | "CN" | "GLOBAL";

export type BotoxBrand = {
  id: string;
  name: string;
  region: BotoxRegion;
  maker: string;
  type: string;
  onset: string;
  duration: string;
  bestFor: string;
  traits: string[];
  diff: string;
  aliases?: string[];
};

export const BOTOX_REGION_LABEL: Record<BotoxRegion, string> = {
  KR: "국내",
  CN: "중국",
  GLOBAL: "글로벌",
};

export const BOTOX_BRANDS: BotoxBrand[] = [
  {
    id: "botox",
    name: "보톡스",
    region: "GLOBAL",
    maker: "Allergan",
    type: "오나보툴리눔톡신A",
    onset: "3–5일",
    duration: "3–4개월",
    bestFor: "미간 · 이마 · 눈가 · 사각턱 기준점",
    traits: ["오리지널", "예측 가능", "고가"],
    diff: "용량·확산의 기준. 가격이 높다. 사각턱은 국산도 충분.",
    aliases: ["Botox", "알러간", "Allergan"],
  },
  {
    id: "xeomin",
    name: "제오민",
    region: "GLOBAL",
    maker: "Merz",
    type: "인코보툴리눔톡신A (순수)",
    onset: "3–7일",
    duration: "3–4개월",
    bestFor: "내성 고려 · 잔주름",
    traits: ["복합단백 없음", "내성", "순수"],
    diff: "복합단백을 제거. 반복 시술·내성 병력에 먼저 권한다.",
    aliases: ["Xeomin"],
  },
  {
    id: "nabota",
    name: "나보타",
    region: "KR",
    maker: "대웅",
    type: "프라보툴리눔톡신A",
    onset: "2–4일",
    duration: "3–4개월",
    bestFor: "주름 · 사각턱 (빠른 발현)",
    traits: ["빠른 발현", "FDA", "국내"],
    diff: "발현이 빠르다. 미간·사각턱에 많이 쓴다.",
    aliases: ["Nabota", "Jeuveau"],
  },
  {
    id: "botulax",
    name: "보툴렉스",
    region: "KR",
    maker: "휴젤",
    type: "클로스트리디움 톡신A",
    onset: "3–5일",
    duration: "3–4개월",
    bestFor: "사각턱 · 승모근 · 주름",
    traits: ["대용량", "승모근", "국내 널리"],
    diff: "사각턱·승모근 대용량에 익숙. 원내 윤곽 세트와 잘 맞는다.",
    aliases: ["Botulax"],
  },
  {
    id: "hutox",
    name: "휴톡스",
    region: "KR",
    maker: "휴온스",
    type: "톡신A",
    onset: "3–5일",
    duration: "3–4개월",
    bestFor: "주름 · 사각턱",
    traits: ["국내", "가성비"],
    diff: "보툴렉스와 자리가 겹친다. 용량 습관을 통일할 것.",
    aliases: ["Hutox"],
  },
  {
    id: "innotox",
    name: "내보톡",
    region: "KR",
    maker: "메디톡스",
    type: "액상 톡신A",
    onset: "2–4일",
    duration: "3–4개월",
    bestFor: "잔주름 · 스킨보톡스 · 물광보톡",
    traits: ["액상", "희석 오차 적음", "표층"],
    diff: "액상이라 희석 실수가 적다. 물광보톡스·잔주름에 유리.",
    aliases: ["Innotox", "내보톡스"],
  },
  {
    id: "coretox",
    name: "코어톡스",
    region: "KR",
    maker: "메디톡스",
    type: "순수 톡신A",
    onset: "3–5일",
    duration: "3–4개월",
    bestFor: "내성 고려 · 반복 시술",
    traits: ["복합단백 제거", "내성"],
    diff: "제오민과 같은 자리의 국내 옵션.",
    aliases: ["Coretox"],
  },
  {
    id: "meditoxin",
    name: "메디톡신",
    region: "KR",
    maker: "메디톡스",
    type: "톡신A",
    onset: "3–5일",
    duration: "3–4개월",
    bestFor: "주름 · 사각턱",
    traits: ["국내 대표", "익숙한 용량"],
    diff: "오래 쓴 국산. 뉴로녹스와 계열.",
    aliases: ["Meditoxin", "뉴로녹스"],
  },
  {
    id: "letybo",
    name: "렛이보",
    region: "KR",
    maker: "종근당",
    type: "톡신A",
    onset: "3–5일",
    duration: "3–4개월",
    bestFor: "주름 · 사각턱",
    traits: ["국내", "주름"],
    diff: "유럽 허가 라인. 나보타와 비슷한 자리.",
    aliases: ["Letybo", "렛보", "보투올"],
  },
  {
    id: "hengli",
    name: "헝리",
    region: "CN",
    maker: "Lanzhou (衡力)",
    type: "톡신A",
    onset: "3–7일",
    duration: "3–4개월",
    bestFor: "주름 · 사각턱 · 승모근 (중국 의원)",
    traits: ["중국 대표", "대용량", "가성비"],
    diff: "중국 의원 기본 톡신. 용량 단위가 다를 수 있어 환산 기록을 남긴다.",
    aliases: ["Hengli", "란저우", "Lanzhou", "衡力"],
  },
];

export function getBotoxBrand(idOrName: string): BotoxBrand | undefined {
  const n = idOrName.trim().toLowerCase();
  return BOTOX_BRANDS.find(
    (b) =>
      b.id === idOrName ||
      b.name === idOrName ||
      b.name.toLowerCase() === n ||
      b.aliases?.some((a) => a.toLowerCase() === n),
  );
}
