export const scoreColor = (s) =>
  s >= 75 ? "#0d9488" : s >= 50 ? "#8b5cf6" : s >= 25 ? "#ec4899" : "#be123c";

export const scoreLabel = (s) =>
  s >= 75 ? "양호" : s >= 50 ? "보통" : s >= 25 ? "취약" : "위험";

export const statusColor = (status) =>
  ({ 양호: "#0d9488", 보통: "#8b5cf6", 취약: "#ec4899", 위험: "#be123c" }[status] || "#64748b");

export const metricColor = (status) =>
  ({ good: "#0d9488", needs: "#ec4899", poor: "#be123c" }[status] || "#64748b");

export const averageScore = (chapterMap) => {
  const values = Object.values(chapterMap).map((v) => v.s || 0);
  return values.length ? Math.round(values.reduce((a, b) => a + b, 0) / values.length) : 0;
};
