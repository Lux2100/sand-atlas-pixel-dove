export const MEMO_MARKS = ["★", "☆", "✓", "✗", "→"] as const;
export type MemoMark = (typeof MEMO_MARKS)[number];

function escapeAmp(s: string) {
  return s.replace(/&(?!(amp|lt|gt|quot|nbsp|#\d+|#x[0-9a-fA-F]+);)/g, "&");
}

function sanitizeColor(value: string): string | undefined {
  const v = value.trim().replace(/["']/g, "");
  if (!v || /expression|javascript|url\s*\(/i.test(v)) return undefined;
  if (/^#([0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(v)) return v;
  if (/^rgba?\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}(?:\s*,\s*(0|0?\.\d+|1))?\s*\)$/i.test(v)) return v;
  if (/^[a-z]{1,20}$/i.test(v)) return v.toLowerCase();
  return undefined;
}

/** Allow plain text, <br>, and <span style="color:..."> only. */
export function sanitizeMemo(raw: string | undefined | null): string {
  if (!raw) return "";
  let s = String(raw).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "");
  s = s.replace(/<br\s*\/?>/gi, "{{BR}}");
  const spans: string[] = [];
  s = s.replace(/<span\b([^>]*)>([\s\S]*?)<\/span>/gi, (_full, attrs: string, inner: string) => {
    const styleMatch = String(attrs).match(/style\s*=\s*(?:"([^"]*)"|'([^']*)')/i);
    const style = styleMatch?.[1] ?? styleMatch?.[2] ?? "";
    const colorMatch = style.match(/(?:^|;)\s*color\s*:\s*([^;]+)/i);
    const color = colorMatch ? sanitizeColor(colorMatch[1]) : undefined;
    const token = `{{SPAN${spans.length}}}`;
    const safeInner = inner.replace(/<[^>]+>/g, "");
    spans.push(color ? `<span style="color:${color}">${safeInner}</span>` : safeInner);
    return token;
  });
  s = s.replace(/<[^>]+>/g, "");
  s = escapeAmp(s);
  spans.forEach((html, i) => {
    s = s.replace(`{{SPAN${i}}}`, html);
  });
  s = s.replace(/\{\{BR\}\}/g, "<br/>");
  return s;
}

export function memoToPlain(html: string | undefined | null): string {
  if (!html) return "";
  const plain = html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/</g, "<")
    .replace(/>/g, ">")
    .replace(/"/g, '"')
    .replace(/&/g, "&")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  return displayCopy(plain);
}

/** Turn leftover code field names in generated notes into Korean labels. */
export function displayCopy(raw?: string | null): string {
  if (!raw) return "";
  return raw
    .replace(/재내원\.\s*nextVisit\s*오늘\.?/gi, "재내원 · 다음 내원: 오늘")
    .replace(/\bnextVisit\b/g, "다음 내원")
    .replace(/\bpatientId\b/g, "손님")
    .replace(/\bchartNo\b/g, "차트번호")
    .replace(/\bpaidAmount\b/g, "결제")
    .replace(/\brechargeAmount\b/g, "충전")
    .replace(/\bredeemAmount\b/g, "차감");
}
