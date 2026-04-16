/**
 * GA4 Data API v1 — runReport
 * propertyId: 숫자만 (예: 123456789)
 */

export async function fetchGa4Summary(accessToken, propertyId) {
  const pid = String(propertyId).replace(/\D/g, "");
  if (!pid) throw new Error("GA4 속성 ID를 입력하세요.");

  const url = `https://analyticsdata.googleapis.com/v1beta/properties/${pid}:runReport`;

  const body = {
    dateRanges: [{ startDate: "28daysAgo", endDate: "yesterday" }],
    metrics: [
      { name: "sessions" },
      { name: "activeUsers" },
      { name: "engagementRate" },
      { name: "bounceRate" },
      { name: "averageSessionDuration" },
      { name: "screenPageViewsPerSession" },
    ],
  };

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const msg = data?.error?.message || res.statusText || "GA4 API 오류";
    throw new Error(msg);
  }

  return parseRunReport(data);
}

function firstMetricRows(report) {
  const rows = report?.rows;
  if (!rows?.[0]?.metricValues) return {};
  const names = report.metricHeaders?.map((h) => h.name) || [];
  const vals = rows[0].metricValues;
  const out = {};
  names.forEach((name, i) => {
    const v = vals[i]?.value;
    const num = parseFloat(v);
    out[name] = Number.isFinite(num) ? num : v;
  });
  return out;
}

function parseRunReport(data) {
  const m = firstMetricRows(data);
  if (!data?.rows?.length) {
    return {
      sessions: 0,
      activeUsers: 0,
      engagementRate: 0,
      bounceRate: 0,
      averageSessionDuration: 0,
      screenPageViewsPerSession: 0,
      fetchedAt: new Date().toISOString(),
      empty: true,
    };
  }
  return {
    sessions: m.sessions ?? 0,
    activeUsers: m.activeUsers ?? 0,
    engagementRate: m.engagementRate ?? 0,
    bounceRate: m.bounceRate ?? 0,
    averageSessionDuration: m.averageSessionDuration ?? 0,
    screenPageViewsPerSession: m.screenPageViewsPerSession ?? 0,
    fetchedAt: new Date().toISOString(),
  };
}

/** 클라이언트 ID 없을 때 UI 확인용 */
export function createDemoGa4Snapshot() {
  return {
    sessions: 3200,
    activeUsers: 2100,
    engagementRate: 0.42,
    bounceRate: 0.48,
    averageSessionDuration: 95,
    screenPageViewsPerSession: 2.1,
    fetchedAt: new Date().toISOString(),
    demo: true,
  };
}
