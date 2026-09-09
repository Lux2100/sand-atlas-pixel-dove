import { createServerFn } from "@tanstack/react-start";
import type { FaceAnalysis } from "./types";

export type AnalyzeFaceInput = {
  images: string[];
  houseNames: string[];
  catalog: string;
  protocols: string;
  note?: string;
};

export type AnalyzeFaceResult = {
  ok: boolean;
  analysis: FaceAnalysis;
  error?: string;
};

const EMPTY_ANALYSIS: FaceAnalysis = {
  findings: [],
  recommendations: [],
  plan: [],
};

function fallbackAnalysis(input: AnalyzeFaceInput): FaceAnalysis {
  const house = input.houseNames.length ? input.houseNames : ["큐레이저", "리쥬란", "엘라비에 필러"];
  const note = (input.note ?? "").trim();
  return {
    findings: [
      { area: "전반", concern: "피부결·톤", detail: note || "사진 기반 자동 분석 없이 원내 시술 우선 초안입니다." },
      { area: "중안면", concern: "탄력·볼륨", detail: "처짐·팔자는 상담 시 촉진으로 재확인." },
      { area: "볼·광대", concern: "색소", detail: "기미/잡티 구분은 우드등·히스토리 필요." },
    ],
    recommendations: house.slice(0, 4).map((name) => ({
      name,
      reason: "원내 시술 우선. AI 키 없이 기본 추천.",
      protocol: "프로토콜 카탈로그 참고",
    })),
    plan: [
      { order: 1, timing: "1회차 · 당일", title: "평가·저자극", treatments: house.slice(0, 1), note: "테스트 후 풀페이스." },
      { order: 2, timing: "2회차 · 2–4주", title: "핵심 시술", treatments: house.slice(1, 3), note: "반응 보고 에너지 조절." },
      { order: 3, timing: "3회차 · 6–8주", title: "유지", treatments: house.slice(0, 2), note: "홈케어·차단 교육." },
    ],
  };
}

function parseAnalysis(raw: string): FaceAnalysis | undefined {
  const trimmed = raw.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
  const jsonText = fenced?.[1] ?? trimmed;
  try {
    const parsed = JSON.parse(jsonText) as Partial<FaceAnalysis>;
    const findings = Array.isArray(parsed.findings) ? parsed.findings : [];
    const recommendations = Array.isArray(parsed.recommendations) ? parsed.recommendations : [];
    const plan = Array.isArray(parsed.plan) ? parsed.plan : [];
    if (!findings.length && !recommendations.length) return undefined;
    return {
      findings: findings.map((f) => ({
        area: String(f?.area ?? ""),
        concern: String(f?.concern ?? ""),
        detail: String(f?.detail ?? ""),
      })),
      recommendations: recommendations.map((r) => ({
        name: String(r?.name ?? ""),
        reason: String(r?.reason ?? ""),
        protocol: r?.protocol ? String(r.protocol) : undefined,
      })),
      plan: plan.map((p, i) => ({
        order: Number(p?.order ?? i + 1),
        timing: String(p?.timing ?? ""),
        title: String(p?.title ?? ""),
        treatments: Array.isArray(p?.treatments) ? p.treatments.map(String) : [],
        note: String(p?.note ?? ""),
      })),
    };
  } catch {
    return undefined;
  }
}

const SYSTEM_PROMPT = `당신은 한국 피부·쁘띠 의원 AURA의 시술 설계 보조입니다.
반드시 JSON 객체만 반환하세요. 키: findings, recommendations, plan.

규칙:
- 한국어로 간결하게. 의료 확진처럼 단정하지 말고 상담 소견 톤.
- 원내(house) 시술을 최우선 추천. 원내로 목적을 달성할 수 있으면 외부 시술은 넣지 마세요.
- findings: [{area, concern, detail}] 3–6개. area는 얼굴 부위.
- recommendations: [{name, reason, protocol}] 3–6개. name은 카탈로그에 있는 시술명. protocol은 간격·횟수·에너지 요약.
- plan: 순차 시술 설계 [{order, timing, title, treatments, note}] 3–5단계.
  timing 예: "1회차 · 당일", "2회차 · 2주 후". 같은 날 병행 가능한 것은 묶고, 시차가 필요한 것(써마지↔필러, 강한 레이저 후 재생)은 순서를 지키세요.
- 기미는 과치료·고에너지 금지. 임신/수유/활성 염증은 주의.
- 사진이 부족하면 단정을 피하고 추가 촬영(정면·사위·우드등)을 플랜 노트에 적으세요.`;

export const analyzeFace = createServerFn({ method: "POST" })
  .validator((input: AnalyzeFaceInput) => input)
  .handler(async ({ data }): Promise<AnalyzeFaceResult> => {
    const fallback = fallbackAnalysis(data);
    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) {
      return {
        ok: false,
        analysis: fallback,
        error: "AI 분석을 이 환경에서 사용할 수 없습니다. 원내 시술 기준 초안을 표시합니다.",
      };
    }

    const houseLine = data.houseNames.length
      ? `원내 시술(최우선): ${data.houseNames.join(", ")}`
      : "원내 시술 목록이 비어 있습니다.";
    const userText = [
      houseLine,
      data.note?.trim() ? `상담 메모: ${data.note.trim()}` : "",
      "",
      "시술 카탈로그:",
      data.catalog || "(없음)",
      "",
      "프로토콜:",
      data.protocols || "(없음)",
      "",
      "위 사진과 메모를 보고 findings / recommendations / plan JSON을 작성하세요.",
    ]
      .filter(Boolean)
      .join("\n");

    const content: Array<Record<string, unknown>> = [{ type: "text", text: userText }];
    for (const url of data.images.slice(0, 6)) {
      if (!url) continue;
      content.push({ type: "image_url", image_url: { url } });
    }

    try {
      const res = await fetch("https://api.x.ai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "grok-4.5",
          temperature: 0.3,
          max_tokens: 1800,
          response_format: { type: "json_object" },
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content },
          ],
        }),
      });
      if (!res.ok) {
        const errText = await res.text().catch(() => "");
        return {
          ok: false,
          analysis: fallback,
          error: `분석 서버 오류 (${res.status})${errText ? `: ${errText.slice(0, 180)}` : ""}`,
        };
      }
      const body = (await res.json()) as {
        choices?: { message?: { content?: string } }[];
      };
      const text = body.choices?.[0]?.message?.content ?? "";
      const analysis = parseAnalysis(text);
      if (!analysis) {
        return { ok: false, analysis: fallback, error: "분석 결과를 해석하지 못했습니다." };
      }
      return { ok: true, analysis };
    } catch (e) {
      const message = e instanceof Error ? e.message : "네트워크 오류";
      return { ok: false, analysis: fallback, error: message };
    }
  });

export { EMPTY_ANALYSIS };
