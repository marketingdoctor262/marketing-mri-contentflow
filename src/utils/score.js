export const scoreColor = (s) =>
  s >= 75 ? "#16a34a" : s >= 50 ? "#d97706" : s >= 25 ? "#ea580c" : "#dc2626";

export const scoreLabel = (s) =>
  s >= 75 ? "양호" : s >= 50 ? "보통" : s >= 25 ? "취약" : "위험";

export const statusColor = (status) =>
  ({ 양호: "#16a34a", 보통: "#d97706", 취약: "#ea580c", 위험: "#dc2626" }[status] || "#6b7280");

export const metricColor = (status) =>
  ({ good: "#16a34a", needs: "#d97706", poor: "#dc2626" }[status] || "#6b7280");

export const averageScore = (chapterMap) => {
  const values = Object.values(chapterMap).map((v) => v.s || 0);
  return values.length ? Math.round(values.reduce((a, b) => a + b, 0) / values.length) : 0;
};
