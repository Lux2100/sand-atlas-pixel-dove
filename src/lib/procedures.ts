import type { Treatment, TreatmentCategory } from "./types";

export const CATEGORY_LABEL: Record<TreatmentCategory, string> = {
  injectable: "주사·필러",
  laser: "레이저",
  lifting: "리프팅",
  skin: "피부",
  surgery: "시술·수술",
};

export const CATEGORY_ORDER: TreatmentCategory[] = [
  "injectable",
  "laser",
  "lifting",
  "skin",
  "surgery",
];

function T(
  id: string,
  name: string,
  category: TreatmentCategory,
  summary: string,
  concerns: string[],
  extra?: { house?: boolean; aliases?: string[] },
): Treatment {
  return { id, name, category, summary, concerns, ...extra };
}

export const TREATMENTS: Treatment[] = [
  T("ellavie", "엘라비에 필러", "injectable", "원내 대표 HA 필러. 볼륨·윤곽·팔자에 자연스러운 유지력.", ["볼륨", "팔자", "윤곽", "입술", "이마"], {
    house: true,
    aliases: ["엘라비에", "Ellavie", "ellavie"],
  }),
  T("restylane", "레스틸렌 필러", "injectable", "Galderma Restylane. NASHA 입자로 지지력과 움직임 균형.", ["볼륨", "팔자", "입술", "눈밑"], {
    aliases: ["레스틸렌", "Restylane"],
  }),
  T("juvederm", "쥬비덤", "injectable", "Allergan Juvederm Vycross. 부드러운 볼륨과 리프팅.", ["볼륨", "팔자", "입술", "볼"], {
    aliases: ["Juvederm", "주비덤"],
  }),
  T("neuramis", "뉴라미스", "injectable", "국내 Medytox HA 필러. 잔주름·입술·잔볼륨.", ["잔주름", "입술", "볼륨"], {
    aliases: ["Neuramis"],
  }),
  T("yvoire", "이브아르", "injectable", "LG 이브아르 HA. 윤곽·볼륨에 탄탄한 지지.", ["윤곽", "볼륨", "턱", "코"], {
    aliases: ["Yvoire", "이브아르 필러"],
  }),
  T("botulinum", "보툴리눔 톡신", "injectable", "주름·사각턱·승모근 등 근육 이완 일반명.", ["주름", "사각턱", "승모근", "잔주름"], {
    aliases: ["톡신", "보툴리눔", "botulinum"],
  }),
  T("contour-inj", "윤곽주사", "injectable", "지방분해·윤곽 라인 주사. 이중턱·볼살·턱선.", ["윤곽", "이중턱", "턱선", "볼살"], {
    house: true,
    aliases: ["페이스라인주사", "팻디스솔빙"],
  }),
  T("filorga", "필로르가", "injectable", "NCTF 폴리레바이탈라이징. 물광·결·광채.", ["보습", "광채", "결", "안티에이징"], {
    house: true,
    aliases: ["Filorga", "NCTF", "필로가"],
  }),
  T("juvelook", "쥬베룩", "injectable", "PDLLA+HA 스킨부스터. 모공·흉터·탄력 리모델링.", ["모공", "흉터", "탄력", "결"], {
    house: true,
    aliases: ["Juvelook", "쥬브룩"],
  }),
  T("rejuran", "리쥬란", "injectable", "PN 연어주사. 재생·장벽·흉터·민감 피부.", ["재생", "장벽", "흉터", "민감"], {
    house: true,
    aliases: ["Rejuran", "리주란", "연어주사"],
  }),
  T("pdrn", "PDRN", "injectable", "폴리데옥시리보뉴클레오티드 재생주사. 회복·진정.", ["재생", "진정", "홍조", "회복"], {
    house: true,
    aliases: ["피디알엔", "폴리뉴클레오티드", "PN"],
  }),
  T("ultracol", "울트라콜", "injectable", "PDO 콜라겐 부스터. 탄력·리프팅 유도.", ["탄력", "리프팅", "볼륨"], {
    aliases: ["Ultracol", "울트라콜주사"],
  }),
  T("sculptra", "스컬트라", "injectable", "PLLA 콜라겐 stimulator. 볼륨·탄력 장기 유지.", ["볼륨", "탄력", "함몰"], {
    aliases: ["Sculptra", "스컬프타"],
  }),
  T("cellrederm", "셀르디엠", "injectable", "세포 재생 부스터. 얇은 피부·눈가 회복.", ["재생", "눈가", "얇은피부"], {
    aliases: ["Cellrederm", "셀레드엠"],
  }),
  T("skin-glow", "물광", "injectable", "HA 물광주. 즉각 보습·광채.", ["보습", "광채", "건조"], {
    aliases: ["물광주", "워터글로우"],
  }),
  T("exosome", "엑소좀", "injectable", "엑소좀 재생. 염증 후·시술 후 회복, 결 개선.", ["재생", "진정", "결", "안티에이징"], {
    aliases: ["Exosome", "엑소좀주사"],
  }),
  T("rejuran-glow", "리쥬란물광", "injectable", "리쥬란 HB/물광 타입. 재생+보습 한 번에.", ["보습", "재생", "광채"], {
    aliases: ["리쥬란 HB", "Rejuran HB"],
  }),
  T("glow-botox", "물광보톡스", "injectable", "진피 내 미세 톡신. 모공·잔주름·피지·광채.", ["모공", "잔주름", "피지", "광채"], {
    aliases: ["스킨보톡스", "더마톡신", "물광보톡"],
  }),
  T("pigment-inj", "색소주사", "injectable", "국소 미백·색소 병변 주사.", ["색소", "기미", "잡티"], {
    aliases: ["미백주사(국소)"],
  }),
  T("inflam-inj", "염증주사", "injectable", "여드름·낭종 염증 진정 주사.", ["여드름", "염증", "낭종"], {
    aliases: ["여드름주사", "스테로이드주사"],
  }),
  T("baby-inj", "아기주사", "injectable", "동안·결 개선 연광 칵테일.", ["동안", "광채", "결"], {
    aliases: ["베이비주사", "소녀주사"],
  }),
  T("panda-inj", "팬더주사", "injectable", "눈밑 다크서클·얇은 피부 특화 주사.", ["다크서클", "눈밑", "팬더"], {
    aliases: ["팬더아이", "눈밑주사"],
  }),
  T("mermaid-inj", "인어주사", "injectable", "광채·톤업 특화 칵테일 주사.", ["광채", "미백", "톤업"], {
    aliases: ["머메이드주사"],
  }),
  T("skinbooster", "스킨부스터", "injectable", "진피 보습·재생 부스터 통칭.", ["보습", "결", "광채"], {
    aliases: ["Skinbooster"],
  }),
  T("scar-inj", "흉터주사", "injectable", "함몰·비대 흉터 내 약물 주사.", ["흉터", "함몰", "여드름흉터"], {
    aliases: ["켈로이드주사"],
  }),
  T("glutathione", "글루타치온", "injectable", "전신 미백·항산화 주사.", ["미백", "톤업", "피로"], {
    aliases: ["글루타치온주사", "Glutathione"],
  }),
  T("vitc-inj", "비타민C주사", "injectable", "항산화·피로회복·톤 케어.", ["피로", "항산화", "광채"], {
    aliases: ["비타민주사", "비타민C"],
  }),
  T("tranexamic", "트라넥삼산", "injectable", "기미·홍조 경로 억제 주사/메조.", ["기미", "색소", "홍조"], {
    aliases: ["트라넥사믹", "TXA"],
  }),
  T("growth-inj", "성장인자주사", "injectable", "EGF/FGF 등 성장인자 재생.", ["재생", "흉터", "탄력"], {
    aliases: ["EGF", "성장인자"],
  }),
  T("collagen-inj", "콜라겐주사", "injectable", "콜라겐 보충·유도 주사.", ["탄력", "잔주름", "볼륨"], {
    aliases: ["콜라겐부스터"],
  }),
  T("cinderella-inj", "신데렐라주사", "injectable", "글루타치온 기반 미백·피로 주사.", ["미백", "피로", "톤업"], {
    aliases: ["신데렐라", "백옥주사"],
  }),
  T("chanel-inj", "샤넬주사", "injectable", "PN+HA+비타민 광채 칵테일. 결·윤기·보습을 한 번에.", ["광채", "보습", "결", "동안"], {
    aliases: ["샤넬", "Chanel injection", "샤넬 인젝션"],
  }),
  T("restylane-sb", "레스틸렌 물광", "injectable", "Restylane Skinbooster. 진피 내 HA로 지속 보습·광채.", ["보습", "광채", "잔주름", "결"], {
    aliases: ["Restylane Skinbooster", "레스틸렌 스킨부스터", "레스틸렌물광"],
  }),
  T("haiti", "하이티", "injectable", "Imeik 嗨体. 눈밑 다크서클·목주름·잔주름용 표층 HA. 볼륨보다 결·주름 라인.", ["눈밑", "목주름", "잔주름", "다크서클"], {
    aliases: ["嗨体", "Haiti", "하이바디", "하이티주사", "하이티 필러"],
  }),
  T("botox", "보톡스", "injectable", "Allergan Botox. 주름·사각턱 기준 톡신.", ["주름", "사각턱", "승모근"], {
    aliases: ["Botox", "알러간"],
  }),
  T("nabota", "나보타", "injectable", "대웅 나보타. 빠른 발현, 사각턱·주름.", ["주름", "사각턱"], {
    aliases: ["Nabota", "Jeuveau"],
  }),
  T("hutox", "휴톡스", "injectable", "휴온스 휴톡스.", ["주름", "사각턱"], { aliases: ["Hutox"] }),
  T("botulax", "보툴렉스", "injectable", "휴젤 보툴렉스. 사각턱·주름 널리 사용.", ["주름", "사각턱", "승모근"], {
    aliases: ["Botulax"],
  }),
  T("innotox", "내보톡", "injectable", "메디톡스 내보톡스(액상).", ["주름", "잔주름"], {
    aliases: ["Innotox", "내보톡스"],
  }),
  T("coretox", "코어톡스", "injectable", "메디톡스 코어톡스. 내성 고려 시.", ["주름", "사각턱"], { aliases: ["Coretox"] }),
  T("meditoxin", "메디톡신", "injectable", "메디톡스 메디톡신.", ["주름", "사각턱"], {
    aliases: ["Meditoxin", "뉴로녹스"],
  }),
  T("xeomin", "제오민", "injectable", "Merz Xeomin. 순수 톡신, 내성 부담 적음.", ["주름", "잔주름"], {
    aliases: ["Xeomin", "제오민톡신"],
  }),
  T("hengli", "헝리", "injectable", "중국 헝리(Lanzhou) 톡신.", ["주름", "사각턱"], {
    aliases: ["Hengli", "란저우"],
  }),

  T("lituo", "리투오", "laser", "원내 토닝·색소 레이저. 기미·잡티·톤 균일.", ["기미", "잡티", "톤", "색소"], {
    house: true,
    aliases: ["Lituo", "리투오레이저"],
  }),
  T("curejet", "큐어제트", "laser", "니들프리 제트 인젝터. 부스터를 균일 주입.", ["모공", "재생", "부스터", "흉터"], {
    house: true,
    aliases: ["CureJet", "큐어젯", "제트인젝터"],
  }),
  T("qlaser", "큐레이저", "laser", "Q-switched 토닝. 기미·잡티·문신·톤업.", ["기미", "잡티", "톤", "문신"], {
    house: true,
    aliases: ["Q레이저", "Q-switch", "큐스위치"],
  }),
  T("m22", "M22", "laser", "Lumenis M22 IPL. 홍조·색소·광노화.", ["홍조", "색소", "광노화", "혈관"], {
    house: true,
    aliases: ["IPL", "엠22"],
  }),
  T("fraxel", "프락셀", "laser", "분획 레이저. 모공·흉터·결·탄력.", ["모공", "흉터", "결", "탄력"], {
    house: true,
    aliases: ["Fraxel", "프락셔널"],
  }),
  T("erbium", "어븀야그", "laser", "Er:YAG 박피. 흉터·주름·각질.", ["흉터", "주름", "박피"], {
    aliases: ["Er:YAG", "어븀", "어븀야그레이저"],
  }),
  T("fotona", "포토나", "laser", "Fotona 멀티모드. 리프팅·홍조·타이트닝.", ["리프팅", "홍조", "탄력"], {
    aliases: ["Fotona", "포토나레이저"],
  }),
  T("vbeam", "브이빔", "laser", "Vbeam 혈관 레이저. 홍조·혈관·붉은 흉터.", ["홍조", "혈관", "붉은흉터"], {
    aliases: ["Vbeam", "브이빔퍼펙타"],
  }),
  T("potenza", "포텐자", "laser", "RF 마이크로니들. 모공·흉터·탄력.", ["모공", "흉터", "탄력"], {
    aliases: ["Potenza", "포텐자리프팅"],
  }),
  T("clarity", "클라리티", "laser", "Clarity 알렉산드라이트/야그. 제모·색소.", ["제모", "색소", "잡티"], {
    aliases: ["Clarity", "클라리티Ⅱ"],
  }),
  T("co2", "CO2", "laser", "CO2 프락셔널/절제. 깊은 흉터·종양·주름.", ["흉터", "점", "주름"], {
    aliases: ["CO2레이저", "탄산가스"],
  }),
  T("pico", "피코레이저", "laser", "피코초 레이저. 기미·톤·문신·모공.", ["기미", "톤", "문신", "모공"], {
    aliases: ["Pico", "피코토닝", "피코웨이", "피코슈어"],
  }),

  T("vro", "브이로", "lifting", "원내 HIFU. 근막·진피 리프팅, 이중턱.", ["리프팅", "처짐", "이중턱", "탄력"], {
    house: true,
    aliases: ["VRO", "V-RO", "브이알오"],
  }),
  T("ulthera", "울쎄라", "lifting", "Ultherapy 초음파. SMAS 리프팅 골드스탠다드.", ["리프팅", "처짐", "탄력", "턱선"], {
    house: true,
    aliases: ["Ulthera", "Ultherapy", "울세라"],
  }),
  T("thermage", "써마지", "lifting", "Thermage FLX 모노폴라 RF. 타이트닝·윤곽.", ["탄력", "타이트닝", "윤곽", "모공"], {
    house: true,
    aliases: ["Thermage", "써마지FLX", "써마지 FLX"],
  }),
  T("volnewmer", "볼뉴머", "lifting", "Volnewmer 모노폴라 RF. 볼륨 유지형 타이트닝.", ["탄력", "볼륨", "타이트닝"], {
    aliases: ["Volnewmer", "볼뉴머RF"],
  }),
  T("density", "덴서티", "lifting", "덴서티 RF. 진피 밀도·탄력.", ["탄력", "밀도", "처짐"], {
    aliases: ["Density", "덴시티"],
  }),
  T("onda", "온다", "lifting", "Onda Coolwaves. 지방·타이트닝.", ["이중턱", "지방", "타이트닝"], {
    aliases: ["Onda", "온다쿨웨이브"],
  }),
  T("shurink", "슈링크", "lifting", "슈링크 HIFU. 라인·처짐 일상 리프팅.", ["리프팅", "처짐", "턱선"], {
    aliases: ["Shurink", "슈링크유니버스"],
  }),

  T("dermapen", "더마펜", "skin", "자동 마이크로니들. 약물 침투·흉터·모공.", ["모공", "흉터", "침투"], {
    aliases: ["Dermapen", "더마스탬프"],
  }),
  T("mts", "MTS", "skin", "마이크로니들/더마롤러. 더마펜과 별도 수기·롤러 방식.", ["모공", "침투", "흉터", "결"], {
    aliases: ["마이크로니들", "더마롤러", "Microneedling"],
  }),
  T("tca-cross", "TCA크로스", "skin", "함몰 흉터에 TCA 점적. 핀홀과 병행.", ["흉터", "아이스픽", "함몰"], {
    aliases: ["TCA CROSS", "TCA"],
  }),
  T("facial-care", "피부관리", "skin", "클렌징·수분·진정·각질 기본 페이셜.", ["보습", "진정", "결", "관리"], {
    aliases: ["페이셜", "기본관리", "페이셜케어"],
  }),
  T("acne-care", "여드름관리", "skin", "압출·진정·재생·홈케어 코칭을 포함한 여드름 케어.", ["여드름", "피지", "염증", "모공"], {
    aliases: ["여드름케어", "아크네케어"],
  }),
  T("cosmelan", "코스멜란", "skin", "코스멜란 집중 미백 필. 기미·색소 집중.", ["기미", "색소", "미백"], {
    aliases: ["Cosmelan", "코스멜란필"],
  }),
  T("chemical-peel", "케미컬 필", "skin", "AHA/BHA/TCA 필. 각질·색소·결.", ["각질", "색소", "결", "여드름"], {
    aliases: ["케미컬필", "화학박피", "필링"],
  }),
  T("aquapeel", "아쿠아필", "skin", "아쿠아필 수분 박피. 모공·피지·즉각 광채.", ["모공", "피지", "광채"], {
    aliases: ["Aqua Peel", "아쿠아필링"],
  }),
  T("hydrafacial", "하이드라페이셜", "skin", "Hydrafacial 흡입+용액. 클렌징·보습·광채.", ["모공", "보습", "광채"], {
    aliases: ["Hydrafacial", "하이드라"],
  }),
  T("ldm", "LDM", "skin", "LDM 초음파. 장벽·진정·시술 후 회복.", ["진정", "장벽", "부종", "홍조"], {
    aliases: ["LDM초음파", "엘디엠"],
  }),
  T("vitamin-care", "비타민 관리", "skin", "비타민 이온/특수 관리. 톤·피로·광채.", ["광채", "톤", "피로"], {
    aliases: ["비타민주수", "비타민케어"],
  }),
  T("violet", "브이올렛", "skin", "V-iolet 여드름 광열. 피지선 억제.", ["여드름", "피지", "모공"], {
    aliases: ["V-iolet", "Violet", "브이올렛아크네"],
  }),

  T("subcision", "서브시전", "surgery", "섬유대 절단으로 함몰 흉터를 띄우는 시술.", ["흉터", "함몰", "여드름흉터"], {
    aliases: ["Subcision", "서브시젼"],
  }),
  T("pinhole", "핀홀법", "surgery", "핀홀 박피로 깊은 흉터·공함몰 개선.", ["흉터", "아이스픽", "모공"], {
    aliases: ["핀홀", "Pinhole"],
  }),
];

export const HOUSE_TREATMENTS = TREATMENTS.filter((t) => t.house);

const FOLD_RE = /[\s\-_/·•]+/g;

function fold(s: string) {
  return s.trim().toLowerCase().replace(FOLD_RE, "");
}

export function getTreatment(id: string): Treatment | undefined {
  if (!id) return undefined;
  const key = id.trim();
  return TREATMENTS.find((t) => t.id === key) ?? TREATMENTS.find((t) => fold(t.id) === fold(key));
}

export function getTreatmentByName(name: string): Treatment | undefined {
  const n = fold(name);
  if (!n) return undefined;
  const exact = TREATMENTS.find((t) => {
    if (fold(t.id) === n || fold(t.name) === n) return true;
    return t.aliases?.some((a) => fold(a) === n) ?? false;
  });
  if (exact) return exact;
  return TREATMENTS.find((t) => {
    if (fold(t.name).includes(n) || n.includes(fold(t.name))) return true;
    return t.aliases?.some((a) => fold(a).includes(n) || n.includes(fold(a))) ?? false;
  });
}

export function matchesTreatment(t: Treatment, q: string): boolean {
  const n = fold(q);
  if (!n) return true;
  if (fold(t.id).includes(n) || fold(t.name).includes(n)) return true;
  if (t.aliases?.some((a) => fold(a).includes(n))) return true;
  if (t.concerns.some((c) => fold(c).includes(n))) return true;
  if (fold(t.summary).includes(n)) return true;
  if (fold(CATEGORY_LABEL[t.category]).includes(n)) return true;
  return false;
}

export function sortHouseFirst<T extends Treatment | string>(items: T[], houseIds?: string[]): T[] {
  const house = new Set(houseIds ?? HOUSE_TREATMENTS.map((t) => t.id));
  const isHouse = (item: T) => {
    if (typeof item === "string") {
      const t = getTreatment(item) ?? getTreatmentByName(item);
      return t ? house.has(t.id) : false;
    }
    return house.has(item.id) || !!item.house;
  };
  return [...items].sort((a, b) => {
    const ha = isHouse(a) ? 0 : 1;
    const hb = isHouse(b) ? 0 : 1;
    if (ha !== hb) return ha - hb;
    const na = typeof a === "string" ? a : a.name;
    const nb = typeof b === "string" ? b : b.name;
    return na.localeCompare(nb, "ko");
  });
}
