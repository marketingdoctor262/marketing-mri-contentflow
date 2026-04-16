export const CONTENT_FLOW_MENU = [
  { id: "home", lb: "브랜드 홈", ic: "🏠" },
  { id: "blog", lb: "블로그 연동", ic: "🔗" },
  { id: "generate", lb: "콘텐츠 생성", ic: "✍" },
  { id: "shortform", lb: "숏폼 자동생성", ic: "🎬" },
  { id: "calendar", lb: "콘텐츠 캘린더", ic: "📅" },
  { id: "archive", lb: "보관함", ic: "📦" },
];

export const PLATFORMS = {
  instagram: { lb: "인스타그램", ic: "📸", co: "#E1306C", bg: "rgba(225,48,108,.08)" },
  youtube: { lb: "유튜브 쇼츠", ic: "▶", co: "#FF4444", bg: "rgba(255,68,68,.08)" },
  tiktok: { lb: "틱톡", ic: "♪", co: "#69C9D0", bg: "rgba(105,201,208,.08)" },
  threads: { lb: "스레드", ic: "⊕", co: "#aaa", bg: "rgba(200,200,200,.07)" },
  pinterest: { lb: "핀터레스트", ic: "📌", co: "#E60023", bg: "rgba(230,0,35,.07)" },
  facebook: { lb: "페이스북", ic: "👥", co: "#1877F2", bg: "rgba(24,119,242,.08)" },
  blog: { lb: "블로그", ic: "✍", co: "#22c55e", bg: "rgba(34,197,94,.07)" },
};

export const IDEAS = [
  {
    id: "1",
    tp: "tip",
    tl: "소상공인이 모르는 마케팅 진단 5가지",
    hk: "매달 광고비 쓰는데 왜 매출이 안 오를까요?",
    pl: ["instagram", "youtube", "tiktok", "blog"],
    mb: "SEO + 콘텐츠 취약 보완",
  },
  {
    id: "2",
    tp: "story",
    tl: "마케팅MRI 탄생 스토리",
    hk: "저도 한때 광고비만 태웠습니다",
    pl: ["instagram", "facebook", "threads", "blog"],
    mb: "대표 스토리 기반 신뢰 보강",
  },
  {
    id: "3",
    tp: "trust",
    tl: "실제 고객 후기 사례",
    hk: "진단 후 3개월 만에 전환율 상승",
    pl: ["instagram", "facebook", "pinterest", "blog"],
    mb: "사회적 증거 확장",
  },
  {
    id: "4",
    tp: "product",
    tl: "AI 자동진단 작동 방식",
    hk: "URL 하나로 마케팅 전체를 진단",
    pl: ["youtube", "tiktok", "instagram", "facebook"],
    mb: "서비스 이해도 강화",
  },
];

export const CONTENT_TYPES = {
  tip: "팁",
  story: "스토리",
  trust: "신뢰",
  product: "제품",
  trending: "트렌드",
};
