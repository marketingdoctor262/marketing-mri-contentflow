/**
 * Google Ads / 네이버 광고 등에서 내보낸 CSV 간단 파싱
 * 인식 컬럼(대소문자 무시): Campaign, Impressions, Clicks, Cost, CTR, Conversions
 */

function normalizeHeader(h) {
  return String(h || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "");
}

function parseNumber(v) {
  if (v == null || v === "") return 0;
  const s = String(v).replace(/[,%₩$]/g, "").replace(/"/g, "").trim();
  const n = parseFloat(s);
  return Number.isFinite(n) ? n : 0;
}

export function parseAdsCsv(text) {
  const lines = text.split(/\r?\n/).filter((l) => l.trim());
  if (lines.length < 2) {
    throw new Error("CSV에 데이터가 없습니다.");
  }

  const delim = lines[0].includes("\t") ? "\t" : ",";
  const headers = lines[0].split(delim).map((h) => h.replace(/^"|"$/g, "").trim());

  const colMap = {};
  headers.forEach((h, i) => {
    const key = normalizeHeader(h);
    if (key.includes("campaign") || key === "캠페인") colMap.campaign = i;
    if (key.includes("impression")) colMap.impressions = i;
    if (key === "clicks" || key.includes("클릭")) colMap.clicks = i;
    if (key.includes("cost") || key.includes("비용") || key.includes("금액")) colMap.cost = i;
    if (key === "ctr" || key.includes("클릭률")) colMap.ctr = i;
    if (key.includes("conversion") || key.includes("전환")) colMap.conversions = i;
  });

  let totalImpressions = 0;
  let totalClicks = 0;
  let totalCost = 0;
  let totalConversions = 0;
  let campaignCount = 0;
  const ctrSamples = [];

  for (let li = 1; li < lines.length; li++) {
    const cells = lines[li].split(delim).map((c) => c.replace(/^"|"$/g, "").trim());
    if (cells.every((c) => !c)) continue;

    if (colMap.campaign !== undefined && cells[colMap.campaign]) {
      campaignCount += 1;
    }

    if (colMap.impressions !== undefined) totalImpressions += parseNumber(cells[colMap.impressions]);
    if (colMap.clicks !== undefined) totalClicks += parseNumber(cells[colMap.clicks]);
    if (colMap.cost !== undefined) totalCost += parseNumber(cells[colMap.cost]);
    if (colMap.conversions !== undefined) totalConversions += parseNumber(cells[colMap.conversions]);
    if (colMap.ctr !== undefined) {
      const raw = cells[colMap.ctr];
      let ctr = parseNumber(raw);
      if (raw && String(raw).includes("%")) ctr = ctr / 100;
      if (ctr > 1) ctr = ctr / 100;
      if (ctr > 0) ctrSamples.push(ctr);
    }
  }

  const avgCtr =
    ctrSamples.length > 0 ? ctrSamples.reduce((a, b) => a + b, 0) / ctrSamples.length : totalImpressions > 0
      ? totalClicks / totalImpressions
      : 0;

  return {
    campaignCount,
    totalImpressions,
    totalClicks,
    totalCost,
    totalConversions,
    avgCtr,
    parsedAt: new Date().toISOString(),
  };
}
