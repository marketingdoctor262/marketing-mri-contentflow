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

/** 채널별 세션·사용자·이탈률 */
export async function fetchGa4Channels(accessToken, propertyId) {
  const pid = String(propertyId).replace(/\D/g, "");
  const url = `https://analyticsdata.googleapis.com/v1beta/properties/${pid}:runReport`;
  const body = {
    dateRanges: [{ startDate: "28daysAgo", endDate: "yesterday" }],
    dimensions: [{ name: "sessionDefaultChannelGroup" }],
    metrics: [{ name: "sessions" }, { name: "activeUsers" }, { name: "bounceRate" }, { name: "conversions" }],
    orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
    limit: 10,
  };
  const res = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error?.message || "GA4 채널 조회 실패");
  return (data.rows || []).map((r) => ({
    name: r.dimensionValues[0].value || "(Other)",
    sessions: parseFloat(r.metricValues[0].value) || 0,
    users: parseFloat(r.metricValues[1].value) || 0,
    bounceRate: parseFloat(r.metricValues[2].value) || 0,
    conversions: parseFloat(r.metricValues[3].value) || 0,
  }));
}

/** 페이지별 조회수·이탈률 TOP */
export async function fetchGa4TopPages(accessToken, propertyId) {
  const pid = String(propertyId).replace(/\D/g, "");
  const url = `https://analyticsdata.googleapis.com/v1beta/properties/${pid}:runReport`;
  const body = {
    dateRanges: [{ startDate: "28daysAgo", endDate: "yesterday" }],
    dimensions: [{ name: "pagePath" }],
    metrics: [{ name: "screenPageViews" }, { name: "bounceRate" }, { name: "averageSessionDuration" }],
    orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
    limit: 10,
  };
  const res = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error?.message || "GA4 페이지 조회 실패");
  return (data.rows || []).map((r) => ({
    path: r.dimensionValues[0].value || "/",
    views: parseFloat(r.metricValues[0].value) || 0,
    bounceRate: parseFloat(r.metricValues[1].value) || 0,
    avgDuration: parseFloat(r.metricValues[2].value) || 0,
  }));
}

/** 국가·도시 */
export async function fetchGa4Geo(accessToken, propertyId) {
  const pid = String(propertyId).replace(/\D/g, "");
  const url = `https://analyticsdata.googleapis.com/v1beta/properties/${pid}:runReport`;
  const body = {
    dateRanges: [{ startDate: "28daysAgo", endDate: "yesterday" }],
    dimensions: [{ name: "country" }, { name: "city" }],
    metrics: [{ name: "sessions" }, { name: "activeUsers" }],
    orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
    limit: 20,
  };
  const res = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error?.message || "GA4 지역 조회 실패");
  return (data.rows || []).map((r) => ({
    country: r.dimensionValues[0].value || "(not set)",
    city: r.dimensionValues[1].value || "(not set)",
    sessions: parseFloat(r.metricValues[0].value) || 0,
    users: parseFloat(r.metricValues[1].value) || 0,
  }));
}

/** 연령·성별 인구통계 */
export async function fetchGa4Demographics(accessToken, propertyId) {
  const pid = String(propertyId).replace(/\D/g, "");
  const url = `https://analyticsdata.googleapis.com/v1beta/properties/${pid}:runReport`;
  const [ageRes, genderRes] = await Promise.all([
    fetch(url, {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        dateRanges: [{ startDate: "28daysAgo", endDate: "yesterday" }],
        dimensions: [{ name: "userAgeBracket" }],
        metrics: [{ name: "activeUsers" }],
      }),
    }),
    fetch(url, {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        dateRanges: [{ startDate: "28daysAgo", endDate: "yesterday" }],
        dimensions: [{ name: "userGender" }],
        metrics: [{ name: "activeUsers" }],
      }),
    }),
  ]);
  const ageData = await ageRes.json().catch(() => ({}));
  const genderData = await genderRes.json().catch(() => ({}));
  const parse = (data) =>
    (data.rows || []).map((r) => ({
      key: r.dimensionValues[0].value || "(unknown)",
      users: parseFloat(r.metricValues[0].value) || 0,
    }));
  return { age: parse(ageData), gender: parse(genderData) };
}

/** 이벤트별 발생 수 */
export async function fetchGa4Events(accessToken, propertyId) {
  const pid = String(propertyId).replace(/\D/g, "");
  const url = `https://analyticsdata.googleapis.com/v1beta/properties/${pid}:runReport`;
  const body = {
    dateRanges: [{ startDate: "28daysAgo", endDate: "yesterday" }],
    dimensions: [{ name: "eventName" }],
    metrics: [{ name: "eventCount" }, { name: "totalUsers" }],
    orderBys: [{ metric: { metricName: "eventCount" }, desc: true }],
    limit: 15,
  };
  const res = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error?.message || "GA4 이벤트 조회 실패");
  return (data.rows || []).map((r) => ({
    name: r.dimensionValues[0].value || "(unnamed)",
    count: parseFloat(r.metricValues[0].value) || 0,
    users: parseFloat(r.metricValues[1].value) || 0,
  }));
}

/** 세션 소스/매체 유입경로 상세 */
export async function fetchGa4SourceMedium(accessToken, propertyId) {
  const pid = String(propertyId).replace(/\D/g, "");
  const url = `https://analyticsdata.googleapis.com/v1beta/properties/${pid}:runReport`;
  const body = {
    dateRanges: [{ startDate: "28daysAgo", endDate: "yesterday" }],
    dimensions: [{ name: "sessionSource" }, { name: "sessionMedium" }],
    metrics: [{ name: "sessions" }, { name: "activeUsers" }, { name: "bounceRate" }, { name: "conversions" }],
    orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
    limit: 15,
  };
  const res = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error?.message || "GA4 소스/매체 조회 실패");
  return (data.rows || []).map((r) => ({
    source: r.dimensionValues[0].value || "(direct)",
    medium: r.dimensionValues[1].value || "(none)",
    sessions: parseFloat(r.metricValues[0].value) || 0,
    users: parseFloat(r.metricValues[1].value) || 0,
    bounceRate: parseFloat(r.metricValues[2].value) || 0,
    conversions: parseFloat(r.metricValues[3].value) || 0,
  }));
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
    // 지난 30일 대비 증감률(샘플)
    delta: {
      sessions: 0.18,
      activeUsers: 0.22,
      bounceRate: -0.05,
      averageSessionDuration: 0.08,
    },
    channels: [
      { name: "Organic Search", sessions: 980, users: 720, bounceRate: 0.42, conversions: 18 },
      { name: "Direct", sessions: 860, users: 640, bounceRate: 0.38, conversions: 22 },
      { name: "Organic Social", sessions: 540, users: 420, bounceRate: 0.55, conversions: 8 },
      { name: "Paid Search", sessions: 420, users: 360, bounceRate: 0.47, conversions: 25 },
      { name: "Referral", sessions: 260, users: 210, bounceRate: 0.51, conversions: 6 },
      { name: "Paid Social", sessions: 140, users: 115, bounceRate: 0.62, conversions: 3 },
    ],
    topPages: [
      { path: "/", views: 4200, bounceRate: 0.35, avgDuration: 110 },
      { path: "/pricing", views: 1800, bounceRate: 0.28, avgDuration: 150 },
      { path: "/blog/seo-guide", views: 1450, bounceRate: 0.72, avgDuration: 45 },
      { path: "/about", views: 980, bounceRate: 0.58, avgDuration: 70 },
      { path: "/products", views: 920, bounceRate: 0.40, avgDuration: 180 },
      { path: "/blog/content-tips", views: 780, bounceRate: 0.75, avgDuration: 35 },
      { path: "/contact", views: 520, bounceRate: 0.22, avgDuration: 95 },
      { path: "/case-study/brand-x", views: 310, bounceRate: 0.25, avgDuration: 240 },
      { path: "/guide/full-playbook", views: 280, bounceRate: 0.18, avgDuration: 360 },
    ],
    geo: [
      { country: "South Korea", city: "Seoul", sessions: 1420, users: 1080 },
      { country: "South Korea", city: "Busan", sessions: 320, users: 260 },
      { country: "South Korea", city: "Incheon", sessions: 280, users: 220 },
      { country: "South Korea", city: "Daegu", sessions: 190, users: 150 },
      { country: "South Korea", city: "Gwangju", sessions: 140, users: 110 },
      { country: "United States", city: "Los Angeles", sessions: 180, users: 150 },
      { country: "United States", city: "New York", sessions: 120, users: 100 },
      { country: "Japan", city: "Tokyo", sessions: 95, users: 80 },
      { country: "Vietnam", city: "Ho Chi Minh", sessions: 55, users: 45 },
      { country: "China", city: "Shanghai", sessions: 40, users: 32 },
    ],
    demographics: {
      age: [
        { key: "18-24", users: 210 },
        { key: "25-34", users: 720 },
        { key: "35-44", users: 640 },
        { key: "45-54", users: 320 },
        { key: "55-64", users: 140 },
        { key: "65+", users: 70 },
      ],
      gender: [
        { key: "female", users: 1080 },
        { key: "male", users: 1020 },
      ],
    },
    events: [
      { name: "page_view", count: 8400, users: 2100 },
      { name: "session_start", count: 3200, users: 2100 },
      { name: "scroll", count: 2100, users: 1650 },
      { name: "click", count: 1450, users: 980 },
      { name: "form_submit", count: 82, users: 76 },
      { name: "file_download", count: 48, users: 42 },
      { name: "purchase", count: 22, users: 20 },
      { name: "generate_lead", count: 18, users: 17 },
      { name: "video_start", count: 12, users: 11 },
    ],
    sourceMedium: [
      { source: "google", medium: "organic", sessions: 780, users: 580, bounceRate: 0.40, conversions: 16 },
      { source: "(direct)", medium: "(none)", sessions: 860, users: 640, bounceRate: 0.38, conversions: 22 },
      { source: "naver", medium: "organic", sessions: 200, users: 140, bounceRate: 0.48, conversions: 2 },
      { source: "instagram.com", medium: "referral", sessions: 320, users: 260, bounceRate: 0.52, conversions: 5 },
      { source: "google", medium: "cpc", sessions: 420, users: 360, bounceRate: 0.47, conversions: 25 },
      { source: "facebook", medium: "cpc", sessions: 140, users: 115, bounceRate: 0.62, conversions: 3 },
      { source: "youtube.com", medium: "referral", sessions: 180, users: 140, bounceRate: 0.58, conversions: 2 },
      { source: "newsletter", medium: "email", sessions: 90, users: 78, bounceRate: 0.30, conversions: 6 },
      { source: "kakao", medium: "social", sessions: 60, users: 52, bounceRate: 0.55, conversions: 1 },
    ],
  };
}
