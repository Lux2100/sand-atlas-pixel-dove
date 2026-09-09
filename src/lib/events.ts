export type CourseStep = {
  timing: string;
  title: string;
  treatments: string[];
  note: string;
};

export type ClinicSet = {
  id: string;
  kind: "season" | "concern";
  name: string;
  season?: string;
  period?: string;
  summary: string;
  treatments: string[];
  sessions: string;
  priceHint: string;
  course: CourseStep[];
};

function C(
  id: string,
  kind: ClinicSet["kind"],
  name: string,
  summary: string,
  treatments: string[],
  sessions: string,
  priceHint: string,
  course: CourseStep[],
  extra?: { season?: string; period?: string },
): ClinicSet {
  return { id, kind, name, summary, treatments, sessions, priceHint, course, ...extra };
}

export const CLINIC_SETS: ClinicSet[] = [
  C("spring-pigment", "season", "봄 색소 세트", "환절기 잡티·기미가 올라오기 전에 톤을 정리.", ["큐레이저", "M22", "리쥬란"], "2주 간격 4회", "토닝 + 재생", [
    { timing: "1회차 · 당일", title: "진단 토닝", treatments: ["큐레이저", "피부관리"], note: "저에너지로 시작하고 장벽을 먼저 본다." },
    { timing: "2회차 · 2주 후", title: "필터 토닝", treatments: ["M22", "PDRN"], note: "560 필터. 홍조가 있으면 에너지를 낮춘다." },
    { timing: "3회차 · 4주 후", title: "재생 병행", treatments: ["큐레이저", "리쥬란"], note: "기미 반등을 막기 위해 PN을 넣는다." },
    { timing: "4회차 · 6주 후", title: "유지", treatments: ["큐레이저"], note: "잡티만 스팟. 자외선 차단 재교육." },
  ], { season: "봄", period: "3–5월" }),
  C("summer-calm", "season", "여름 진정 세트", "자외선·냉방으로 예민해진 피부 진정과 장벽.", ["브이빔", "LDM", "PDRN"], "2주 간격 3회", "홍조 + 장벽", [
    { timing: "1회차", title: "혈관 진정", treatments: ["브이빔", "LDM"], note: "자반이 안 나게 파라미터부터." },
    { timing: "2회차 · 2주", title: "장벽", treatments: ["PDRN", "피부관리"], note: "냉방 건조를 같이 잡는다." },
    { timing: "3회차 · 4주", title: "유지 혈관", treatments: ["브이빔"], note: "야외 활동 많은 주는 스킵." },
  ], { season: "여름", period: "6–8월" }),
  C("autumn-renew", "season", "가을 재생 세트", "여름 손상에 재생을 열고 기미 프로그램 시작.", ["프락셀", "리쥬란", "코스멜란"], "4주 간격 3회", "재생 + 기미", [
    { timing: "1회차", title: "재생 오픈", treatments: ["프락셀", "엑소좀"], note: "3–5일 각질 안내." },
    { timing: "2회차 · 4주", title: "기미 프로그램", treatments: ["코스멜란", "리쥬란"], note: "홈케어 순응이 핵심." },
    { timing: "3회차 · 8주", title: "결 정리", treatments: ["프락셀", "PDRN"], note: "밀도는 낮게, 결만." },
  ], { season: "가을", period: "9–11월" }),
  C("winter-glow", "season", "겨울 보습광채 세트", "건조한 시즌 수분·광채와 탄력 유지.", ["필로르가", "큐어제트", "브이로"], "2주 간격 3회 + 리프팅 1회", "광채 + 탄력", [
    { timing: "1회차", title: "물광", treatments: ["필로르가", "큐어제트"], note: "건조 순위를 먼저." },
    { timing: "2회차 · 2주", title: "탄력", treatments: ["브이로"], note: "턱밑 패스 추가." },
    { timing: "3회차 · 4주", title: "광채 유지", treatments: ["레스틸렌 물광"], note: "스킨부스터로 결을 남긴다." },
  ], { season: "겨울", period: "12–2월" }),
  C("chuseok", "season", "명절 동안 세트", "모임 전에 부기 없이 얼굴만 또렷하게.", ["보툴리눔 톡신", "엘라비에 필러", "피부관리"], "1회 (시술 10일 전)", "즉전 + 볼륨", [
    { timing: "D-14", title: "상담·사진", treatments: ["피부관리"], note: "멍 여유를 본다." },
    { timing: "D-10", title: "톡신 + 필러", treatments: ["보툴렉스", "엘라비에 필러"], note: "과교정 없이." },
    { timing: "D-3", title: "결 관리", treatments: ["피부관리", "필로르가"], note: "부기 확인 후 터치업." },
  ], { season: "추석·설", period: "명절 2–3주 전" }),
  C("wedding", "season", "웨딩 준비 세트", "결·톤·볼륨을 나눠 올려 본식 주에 피크.", ["프락셀", "리쥬란", "엘라비에 필러", "브이로"], "8주 프로그램", "결 + 볼륨 + 리프팅", [
    { timing: "8주 전", title: "재생", treatments: ["프락셀", "리쥬란"], note: "다운타임이 있는 시술을 먼저." },
    { timing: "4주 전", title: "리프팅", treatments: ["브이로"], note: "본식 직전 에너지는 피한다." },
    { timing: "10일 전", title: "볼륨·광채", treatments: ["엘라비에 필러", "샤넬주사"], note: "멍 여유." },
  ], { season: "시즌리스", period: "본식 8–12주 전" }),
  C("acne", "concern", "여드름관리 세트", "염증을 줄이고 피지·흉터 씨앗을 같이 정리.", ["여드름관리", "포텐자", "PDRN"], "2주 간격 4회", "염증 + 모공", [
    { timing: "1회차", title: "염증 정리", treatments: ["여드름관리", "염증주사"], note: "낭종만 소량 주사." },
    { timing: "2회차 · 2주", title: "피지·모공", treatments: ["포텐자", "PDRN"], note: "홍조 있으면 얕게." },
    { timing: "3–4회차", title: "유지", treatments: ["여드름관리", "브이올렛"], note: "홈케어 각질 과하지 않게." },
  ]),
  C("scar", "concern", "흉터치료 세트", "패인 흉터는 재생, 붉은 흉터는 혈관을 나눠 접근.", ["프락셀", "서브시전", "쥬베룩"], "4주 간격 3–5회", "재생 + 박리", [
    { timing: "1회차", title: "유착 박리", treatments: ["서브시전", "쥬베룩"], note: "아이스피크는 TCA크로스." },
    { timing: "2회차 · 4주", title: "프락셔널", treatments: ["프락셀", "엑소좀"], note: "밀도는 흉터 깊이로." },
    { timing: "3회차 · 8주", title: "결 다듬기", treatments: ["MTS", "성장인자주사"], note: "얕은 롤링 흉터." },
  ]),
  C("pore", "concern", "모공치료 세트", "피지 정리 후 모공 수축과 콜라겐 자극.", ["아쿠아필", "포텐자", "쥬베룩"], "4주 간격 3회", "수축 + 재생", [
    { timing: "1회차", title: "피지 비우기", treatments: ["아쿠아필", "포텐자"], note: "코·볼 중심." },
    { timing: "2회차 · 4주", title: "콜라겐", treatments: ["쥬베룩"], note: "모공 벽에 얇게." },
    { timing: "3회차", title: "유지", treatments: ["물광보톡스"], note: "피지 많은 피부." },
  ]),
  C("pigment", "concern", "색소치료 세트", "잡티는 스팟, 기미는 토닝. 재생을 병행해 반등 방지.", ["큐레이저", "피코레이저", "리쥬란"], "1–2주 간격 5회", "토닝 + 장벽", [
    { timing: "1–2회차", title: "저에너지 토닝", treatments: ["큐레이저"], note: "기미는 과에너지를 피한다." },
    { timing: "3회차", title: "피코 보조", treatments: ["피코레이저", "트라넥삼산"], note: "잡티 스팟만 높게." },
    { timing: "4–5회차", title: "장벽", treatments: ["리쥬란"], note: "토닝 사이 주간에 재생." },
  ]),
  C("elastic", "concern", "탄력 세트", "피부 타이트닝 위주. 리프팅 전 단계 유지 코스.", ["써마지", "볼뉴머", "울트라콜"], "4–6주 1회 또는 3회", "RF + 콜라겐", [
    { timing: "1회차", title: "볼륨 리프팅", treatments: ["써마지"], note: "샷 수를 균일하게." },
    { timing: "유지", title: "콜라겐 주사", treatments: ["울트라콜"], note: "즉시 볼륨이 아니다." },
  ]),
  C("lifting", "concern", "리프팅 세트", "SMAS와 피부를 나눠 올린다.", ["울쎄라", "브이로", "보툴리눔 톡신"], "리프팅 1회 + 유지 1회", "HIFU + RF", [
    { timing: "1회차", title: "SMAS", treatments: ["울쎄라"], note: "벡터가 샷 수보다 중요." },
    { timing: "4주 후", title: "피부 타이트닝", treatments: ["브이로"], note: "턱밑 별도." },
    { timing: "필요 시", title: "광대 하강 방지", treatments: ["보툴렉스"], note: "소량 광대." },
  ]),
  C("contour", "concern", "얼굴 윤곽세트", "빼는 라인과 채우는 라인을 같이 잡는다.", ["윤곽주사", "엘라비에 필러", "보툴렉스"], "주사 3회 + 필러 1회", "분해 + 볼륨", [
    { timing: "1–3회차", title: "라인 빼기", treatments: ["윤곽주사"], note: "붓기 3일." },
    { timing: "필러 날", title: "채우기", treatments: ["엘라비에 필러"], note: "중안면부터." },
    { timing: "턱", title: "사각턱", treatments: ["보툴렉스"], note: "윤곽주사와 같은 날 가능." },
  ]),
  C("glow", "concern", "보습광채 세트", "건조·칙칙함을 수분과 광채로 빠르게.", ["필로르가", "샤넬주사", "레스틸렌 물광"], "1–2주 간격 3회", "부스터 + 관리", [
    { timing: "1회차", title: "물광", treatments: ["필로르가", "큐어제트"], note: "통증 낮게." },
    { timing: "2회차", title: "샤넬", treatments: ["샤넬주사"], note: "결·윤기." },
    { timing: "3회차", title: "스킨부스터", treatments: ["레스틸렌 물광"], note: "유지가 길다." },
  ]),
  C("redness", "concern", "홍조치료 세트", "혈관을 줄이고 장벽을 올리는 두 트랙.", ["브이빔", "M22", "리쥬란"], "3–4주 간격 4회", "혈관 + 장벽", [
    { timing: "1회차", title: "혈관", treatments: ["브이빔"], note: "자반 없는 파라미터." },
    { timing: "사이", title: "장벽", treatments: ["리쥬란"], note: "자극 관리." },
    { timing: "3회차", title: "IPL 보조", treatments: ["M22"], note: "590–640." },
  ]),
  C("melasma", "concern", "기미치료 세트", "과에너지를 피하고 토닝과 재생, 홈케어를 묶는다.", ["큐레이저", "코스멜란", "리쥬란"], "주 1회 토닝 8회 + 프로그램", "저에너지 다횟수", [
    { timing: "매주", title: "토닝", treatments: ["큐레이저"], note: "기미는 낮게 여러 번." },
    { timing: "중간", title: "프로그램", treatments: ["코스멜란"], note: "가을이 안전." },
    { timing: "병행", title: "재생", treatments: ["리쥬란"], note: "반등 방지." },
  ]),
  C("babyface", "concern", "동안 세트", "주름·볼륨·결을 조금씩.", ["보툴렉스", "엘라비에 필러", "아기주사"], "1회 기본 + 재생 3회", "톡신 + 볼륨 + 결", [
    { timing: "1회차", title: "표정·볼륨", treatments: ["보툴렉스", "엘라비에 필러"], note: "티 나지 않게." },
    { timing: "2–4회차", title: "결", treatments: ["아기주사"], note: "2–4주 간격." },
  ]),
  C("volume", "concern", "볼륨 세트", "즉시 볼륨과 콜라겐 재생 볼륨을 시기에 나눠 사용.", ["엘라비에 필러", "스컬트라", "울트라콜"], "필러 1회 + 재생 2–3회", "HA + PLLA", [
    { timing: "당일", title: "즉시 볼륨", treatments: ["엘라비에 필러"], note: "꺼진 곳만." },
    { timing: "2–3회", title: "재생 볼륨", treatments: ["스컬트라"], note: "마사지 프로토콜." },
  ]),
  C("whitening", "concern", "미백광채 세트", "한·중 의원에서 묶는 미백 코스.", ["글루타치온", "샤넬주사", "큐레이저"], "주 1회 4–8회", "미백 + 광채", [
    { timing: "매주", title: "미백 주사", treatments: ["글루타치온", "신데렐라주사"], note: "누적 효과." },
    { timing: "격주", title: "토닝", treatments: ["큐레이저"], note: "톤만 정리." },
    { timing: "3회차", title: "광채", treatments: ["샤넬주사"], note: "결을 남긴다." },
  ]),
  C("panda-set", "concern", "팬더눈밑 세트", "다크서클·그늘.", ["팬더주사", "레스틸렌 필러", "리쥬란"], "주사 1–2회 + 필요 시 필러", "눈밑 + 재생", [
    { timing: "1회차", title: "팬더", treatments: ["팬더주사", "리쥬란"], note: "눈밑은 소량." },
    { timing: "필요 시", title: "고랑", treatments: ["레스틸렌 필러"], note: "티어 주의." },
  ]),
  C("hydro-botox", "concern", "물광보톡 세트", "水光+肉毒. 한·중 즉전 세트.", ["스킨부스터", "물광보톡스", "보툴렉스"], "1회 (유지 3–4개월)", "광채 + 모공 + 주름", [
    { timing: "당일", title: "표정", treatments: ["보툴렉스"], note: "이마·미간·눈가." },
    { timing: "이어서", title: "피부층", treatments: ["물광보톡스", "레스틸렌 물광"], note: "모공·결." },
  ]),
  C("hydro-fill", "concern", "물광필러 세트", "결은 부스터로, 꺼진 곳만 필러.", ["레스틸렌 물광", "엘라비에 필러", "샤넬주사"], "1회 + 부스터 3회", "광채 + 볼륨", [
    { timing: "1회차", title: "채우기", treatments: ["엘라비에 필러"], note: "중안면." },
    { timing: "같은 날 또는 다음", title: "결", treatments: ["샤넬주사", "레스틸렌 물광"], note: "층을 나눈다." },
  ]),
  C("cinderella-set", "concern", "신데렐라미백 세트", "주사 미백과 토닝을 한 주에 묶는 코스.", ["신데렐라주사", "글루타치온", "큐레이저"], "주 1회 6회", "미백주사 + 토닝", [
    { timing: "매주", title: "주사", treatments: ["신데렐라주사", "글루타치온"], note: "누적." },
    { timing: "격주", title: "레이저", treatments: ["큐레이저"], note: "저에너지." },
  ]),
  C("trapezius", "concern", "승모근보톡 세트", "어깨 라인. 얼굴 보톡스와 용량을 나눈다.", ["휴톡스", "보툴렉스", "헝리"], "1회 (유지 4–6개월)", "승모근 + 라인", [
    { timing: "당일", title: "승모근", treatments: ["보툴렉스"], note: "대용량. 힘빠짐 안내." },
    { timing: "얼굴은 별도", title: "표정", treatments: ["나보타"], note: "같은 날이면 용량 기록." },
  ]),
  C("girl-collagen", "concern", "소녀주사 세트", "콜라겐 재생 볼륨으로 티 나지 않게.", ["스컬트라", "울트라콜", "아기주사"], "4주 간격 2–3회", "PLLA/PDO + 재생", [
    { timing: "1–2회차", title: "콜라겐", treatments: ["스컬트라"], note: "즉시 볼륨이 아니다." },
    { timing: "사이", title: "결", treatments: ["아기주사"], note: "동안 광채." },
  ]),
  C("scar-focus", "concern", "흉터집중 세트", "유착을 끊고 재생·레이저를 나눈다.", ["서브시전", "MTS", "쥬베룩", "프락셀"], "4주 간격 3–5회", "박리 + 재생", [
    { timing: "1회차", title: "박리", treatments: ["서브시전", "쥬베룩"], note: "함몰만." },
    { timing: "2회차", title: "니들", treatments: ["MTS", "성장인자주사"], note: "약물 침투." },
    { timing: "3회차", title: "레이저", treatments: ["프락셀"], note: "결." },
  ]),
  C("autumn-white", "season", "가을 미백 세트", "자외선이 꺾인 뒤 미백·기미를 열기 좋은 시기.", ["큐레이저", "글루타치온", "코스멜란"], "2주 간격 4회", "토닝 + 미백", [
    { timing: "1회차", title: "토닝", treatments: ["큐레이저", "글루타치온"], note: "가을이 안전." },
    { timing: "중간", title: "프로그램", treatments: ["코스멜란"], note: "홈케어." },
    { timing: "4회차", title: "마무리", treatments: ["샤넬주사"], note: "광채." },
  ], { season: "가을", period: "9–11월" }),
];

export function setsByKind(kind: ClinicSet["kind"]) {
  return CLINIC_SETS.filter((s) => s.kind === kind);
}

export function currentSeasonSets(month = new Date().getMonth() + 1) {
  const season =
    month >= 3 && month <= 5 ? "봄" : month >= 6 && month <= 8 ? "여름" : month >= 9 && month <= 11 ? "가을" : "겨울";
  return CLINIC_SETS.filter((s) => s.kind === "season" && (s.season === season || s.season === "추석·설" || s.season === "시즌리스"));
}

export function homeRecommendedSets(month = new Date().getMonth() + 1) {
  const season = currentSeasonSets(month);
  const extra = CLINIC_SETS.filter((s) => s.id === "hydro-botox" || s.id === "whitening" || s.id === "cinderella-set");
  const seen = new Set<string>();
  return [...season, ...extra]
    .filter((s) => {
      if (seen.has(s.id)) return false;
      seen.add(s.id);
      return true;
    })
    .slice(0, 4);
}
