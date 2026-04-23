// 마케팅 실행 플랜 PDF/HTML 내보내기

function expandAllPlanCards() {
  document.querySelectorAll(".plan-action").forEach((card) => {
    const detail = card.querySelector(".plan-action-detail");
    if (detail) detail.removeAttribute("hidden");
    card.classList.add("is-open");
    const chev = card.querySelector(".plan-action-chevron");
    if (chev) chev.textContent = "▴";
  });
}

export function exportPlanToPdf() {
  // 모든 카드 펼친 뒤 브라우저 인쇄 (사용자가 PDF로 저장 선택)
  expandAllPlanCards();
  document.body.classList.add("is-printing-plan");
  // 렌더 1프레임 대기 후 인쇄
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      window.print();
      // 인쇄 다이얼로그 닫힌 뒤 상태 복원
      const cleanup = () => {
        document.body.classList.remove("is-printing-plan");
        window.removeEventListener("afterprint", cleanup);
      };
      window.addEventListener("afterprint", cleanup);
    });
  });
}

async function fetchTextSafe(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) return "";
    return await res.text();
  } catch {
    return "";
  }
}

export async function exportPlanToHtml(brandName = "브랜드") {
  expandAllPlanCards();
  // 플랜 본문 가져오기
  const wrap = document.querySelector(".plan-wrap");
  if (!wrap) return;
  const bodyHtml = wrap.outerHTML;

  // 스타일 인라인 — 페이지에 로드된 stylesheet에서 텍스트 수집
  const cssUrls = [];
  document.querySelectorAll('link[rel="stylesheet"]').forEach((link) => {
    if (link.href) cssUrls.push(link.href);
  });
  const cssTexts = await Promise.all(cssUrls.map(fetchTextSafe));
  const combinedCss = cssTexts.join("\n\n");

  // 인라인 <style> 태그들도 포함
  let inlineStyles = "";
  document.querySelectorAll("style").forEach((s) => {
    inlineStyles += s.textContent + "\n";
  });

  // 현재 테마 속성 유지
  const theme = document.documentElement.getAttribute("data-theme") || "";

  const today = new Date().toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" });

  const html = `<!DOCTYPE html>
<html lang="ko" ${theme ? `data-theme="${theme}"` : ""}>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${brandName} · 마케팅 실행 플랜 · ${today}</title>
<style>
${combinedCss}
${inlineStyles}

/* HTML 내보내기 전용 */
body { background: var(--bg-page); padding: 24px; }
.plan-wrap { max-width: 960px; margin: 0 auto; }
.plan-download, .plan-cta, .plan-pro-banner, .plan-action-chevron, .plan-action-lock { display: none !important; }
.plan-action-detail[hidden] { display: block !important; }
.plan-print-cover { display: block !important; margin-bottom: 32px; }
.plan-action { cursor: default; }
</style>
</head>
<body>
${bodyHtml}
</body>
</html>`;

  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  const safeBrand = (brandName || "brand").replace(/[^\w가-힣-]/g, "_").slice(0, 30);
  a.download = `${safeBrand}_마케팅실행플랜_${new Date().toISOString().slice(0, 10)}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
