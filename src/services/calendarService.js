// Content Calendar auto-generator
// - 입력: 시드 키워드 + 챕터 점수(약점 우선) + 한 달 시작일
// - 출력: 4주 × 7일 발행 일정 (채널 믹스 포함)

import { CHAPTERS } from "../data/chapters.js";

const CHANNELS = [
  { id: "blog",      lb: "블로그",     ic: "✍",  co: "#22c55e", weekdays: [1, 4] },
  { id: "instagram", lb: "인스타",     ic: "📸", co: "#E1306C", weekdays: [2, 5, 6] },
  { id: "shortform", lb: "숏폼",       ic: "🎬", co: "#FF4444", weekdays: [3, 6] },
  { id: "newsletter",lb: "뉴스레터",   ic: "📧", co: "#0ea5e9", weekdays: [4] },
  { id: "thread",    lb: "스레드/X",   ic: "🧵", co: "#64748b", weekdays: [1, 3, 5] },
];

const FORMAT_BY_CHANNEL = {
  blog:       ["SEO 가이드 블로그", "비교 분석 블로그", "케이스 스터디", "Q&A 정리글"],
  instagram:  ["10장 캐러셀", "1장 정보 카드", "비포/애프터", "고객 후기 리포스트"],
  shortform:  ["15초 훅 영상", "30초 핵심 팁", "60초 사용법", "고객 인터뷰"],
  newsletter: ["주간 인사이트", "신상품 소개", "재구매 유도 쿠폰", "VIP 전용 정보"],
  thread:     ["3줄 인사이트", "토론 질문", "산업 뉴스 코멘트", "실전 팁"],
};

const TONE = ["친근체", "전문가체", "스토리텔링", "데이터 중심", "유머러스"];

function pickWeak(chapterMap) {
  if (!chapterMap) return CHAPTERS.slice(0, 5);
  return CHAPTERS
    .map((c) => ({ ...c, s: chapterMap[c.id]?.s || 50 }))
    .sort((a, b) => a.s - b.s)
    .slice(0, 5);
}

function hash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = ((h << 5) - h + str.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function pick(arr, seed) {
  return arr[hash(String(seed)) % arr.length];
}

export function generateCalendar({ seeds = [], brand = "", chapterMap = null, startDate = null } = {}) {
  const seedList = (Array.isArray(seeds) ? seeds : String(seeds).split(/[\n,;]/))
    .map((s) => String(s).trim())
    .filter(Boolean);
  const fallbackSeeds = seedList.length ? seedList : [brand || "우리 브랜드", "마케팅", "고객 후기"];

  const weak = pickWeak(chapterMap);
  const start = startDate ? new Date(startDate) : new Date();
  start.setHours(0, 0, 0, 0);
  // 이번 주 월요일로 정렬
  const day = start.getDay();
  const offset = day === 0 ? -6 : 1 - day;
  start.setDate(start.getDate() + offset);

  const weeks = [];
  for (let w = 0; w < 4; w++) {
    const days = [];
    for (let d = 0; d < 7; d++) {
      const date = new Date(start);
      date.setDate(start.getDate() + w * 7 + d);
      const weekday = ((d) % 7) + 1; // 1(월)~7(일)
      const channels = CHANNELS.filter((c) => c.weekdays.includes(weekday));
      const items = channels.map((ch) => {
        const seedIdx = (w * 7 + d + ch.id.length) % fallbackSeeds.length;
        const seed = fallbackSeeds[seedIdx];
        const chap = weak[(w + d + ch.id.length) % weak.length];
        const fmt = pick(FORMAT_BY_CHANNEL[ch.id], `${seed}-${ch.id}-${w}-${d}`);
        const tone = pick(TONE, `${seed}-${ch.id}-tone`);
        return {
          channel: ch,
          format: fmt,
          tone,
          topic: `${seed} — ${chap.lb} 강화`,
          chapterId: chap.id,
          chapterLabel: chap.lb,
          status: "draft",
        };
      });
      days.push({ date: new Date(date), weekday, items });
    }
    weeks.push({ weekIndex: w + 1, days });
  }

  const totals = { blog: 0, instagram: 0, shortform: 0, newsletter: 0, thread: 0 };
  weeks.forEach((wk) => wk.days.forEach((dy) => dy.items.forEach((it) => { totals[it.channel.id] = (totals[it.channel.id] || 0) + 1; })));

  return {
    brand,
    start,
    weeks,
    totals,
    weakChapters: weak,
    seeds: fallbackSeeds,
    generatedAt: new Date().toISOString(),
  };
}

export const CALENDAR_CHANNELS = CHANNELS;
