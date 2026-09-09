export type FillerRegion = "KR" | "CN" | "GLOBAL";

export type Filler = {
  id: string;
  name: string;
  region: FillerRegion;
  maker: string;
  material: string;
  duration: string;
  bestFor: string;
  traits: string[];
  diff: string;
  aliases?: string[];
};

export const FILLER_REGION_LABEL: Record<FillerRegion, string> = {
  KR: "국내",
  CN: "중국",
  GLOBAL: "글로벌",
};

export const FILLERS: Filler[] = [
  {
    id: "ellavie",
    name: "엘라비에",
    region: "KR",
    maker: "휴젤",
    material: "HA",
    duration: "9–12개월",
    bestFor: "팔자 · 볼륨 · 윤곽 (원내 대표)",
    traits: ["자연스러운 유지", "원내 주력", "과교정 적음"],
    diff: "티 나지 않는 볼륨. 중안면·팔자에 먼저 쓴다.",
    aliases: ["엘라비에 필러", "Ellavie"],
  },
  {
    id: "neuramis",
    name: "뉴라미스",
    region: "KR",
    maker: "메디톡스",
    material: "HA",
    duration: "6–12개월",
    bestFor: "잔주름 · 입술 · 라이트 볼륨",
    traits: ["부드러움", "입술", "가성비"],
    diff: "얕은 층·입술에 잘 맞는다. 윤곽 지지는 이브아르·엘라비에.",
    aliases: ["Neuramis"],
  },
  {
    id: "yvoire",
    name: "이브아르",
    region: "KR",
    maker: "LG화학",
    material: "HA",
    duration: "9–12개월",
    bestFor: "턱 · 코 · 윤곽 지지",
    traits: ["탄탄한 지지", "윤곽", "국내"],
    diff: "입자감이 탄탄해 라인·턱에 유리. 입술은 뉴라미스.",
    aliases: ["Yvoire"],
  },
  {
    id: "restylane",
    name: "레스틸렌",
    region: "GLOBAL",
    maker: "Galderma",
    material: "HA (NASHA)",
    duration: "9–12개월",
    bestFor: "팔자 · 눈밑 · 입술 · 스킨부스터",
    traits: ["지지력", "움직임 균형", "바이탈 물광"],
    diff: "리프트는 지지, 바이탈(물광)은 진피 보습. 레스틸렌 물광과 라인을 나눈다.",
    aliases: ["Restylane", "레스틸렌 필러"],
  },
  {
    id: "juvederm",
    name: "쥬비덤",
    region: "GLOBAL",
    maker: "Allergan",
    material: "HA (Vycross)",
    duration: "12–18개월",
    bestFor: "볼 · 입술 · 부드러운 리프팅",
    traits: ["부드러움", "장기 유지", "볼륨"],
    diff: "볼벨라·볼리프트가 중안면 대표. 유지가 길다.",
    aliases: ["Juvederm", "주비덤"],
  },
  {
    id: "belotero",
    name: "벨로테로",
    region: "GLOBAL",
    maker: "Merz",
    material: "HA (CPM)",
    duration: "6–12개월",
    bestFor: "눈밑 · 입가 · 얇은 피부",
    traits: ["티 안 남", "표층", "눈밑"],
    diff: "얇은 피부에 티어가 적다. 깊은 볼륨은 쥬비덤·엘라비에.",
    aliases: ["Belotero"],
  },
  {
    id: "runbaiyan",
    name: "룬바이옌",
    region: "CN",
    maker: "Bloomage (润百颜)",
    material: "HA",
    duration: "6–9개월",
    bestFor: "물광 · 잔주름 · 결",
    traits: ["물광", "중국 인기", "결"],
    diff: "중국 의원 물광 라인 대표. 볼륨보다 광채.",
    aliases: ["润百颜", "Runbaiyan", "윤백안"],
  },
  {
    id: "haiti",
    name: "하이티",
    region: "CN",
    maker: "Imeik (嗨体)",
    material: "HA",
    duration: "6–9개월",
    bestFor: "눈밑 · 목주름 · 잔주름",
    traits: ["눈밑 특화", "목", "표층"],
    diff: "嗨体는 눈밑·목에 많이 쓴다. 깊은 팔자는 비추천.",
    aliases: ["嗨体", "Haiti", "하이바디"],
  },
  {
    id: "runbaitensi",
    name: "루바이텐스",
    region: "CN",
    maker: "Imeik (濡白天使)",
    material: "HA + 리프팅",
    duration: "9–12개월",
    bestFor: "볼륨 · 리프팅형 중안면",
    traits: ["리프트", "볼륨", "중국"],
    diff: "중국 리프팅 필러. 엘라비에보다 들어 올리는 느낌이 강하다.",
    aliases: ["濡白天使", "Reborn Tens"],
  },
  {
    id: "shuangmei",
    name: "솽메이",
    region: "CN",
    maker: "쌍미 (双美)",
    material: "콜라겐",
    duration: "6–9개월",
    bestFor: "잔주름 · 입술 · 콜라겐 보충",
    traits: ["콜라겐", "잔주름", "입술"],
    diff: "HA가 아니라 콜라겐. 즉각 볼륨보다 결.",
    aliases: ["双美", "Shuangmei", "쌍메이"],
  },
  {
    id: "ifulai",
    name: "아이푸라이",
    region: "CN",
    maker: "Imeik (爱芙莱)",
    material: "HA",
    duration: "6–12개월",
    bestFor: "입술 · 잔볼륨",
    traits: ["라이트", "입술", "가성비"],
    diff: "중국 라이트 HA. 국내 뉴라미스와 비슷한 자리.",
    aliases: ["爱芙莱", "Ifulai", "아이푸레이"],
  },
];

export function getFiller(idOrName: string): Filler | undefined {
  const n = idOrName.trim().toLowerCase();
  return FILLERS.find(
    (f) =>
      f.id === idOrName ||
      f.name === idOrName ||
      f.name.toLowerCase() === n ||
      f.aliases?.some((a) => a.toLowerCase() === n),
  );
}
