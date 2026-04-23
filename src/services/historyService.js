import { CHAPTERS } from "../data/chapters.js";
import { getEnrichedChapterMap } from "../state/chapterData.js";
import { averageScore } from "../utils/score.js";

const STORAGE_KEY = "mri_history_v1";
const MAX_SNAPSHOTS = 52; // 1년치

function safeRead() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

function safeWrite(arr) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
    return true;
  } catch (e) {
    console.warn("히스토리 저장 실패:", e);
    return false;
  }
}

export function getHistory() {
  return safeRead().sort((a, b) => a.id - b.id);
}

export function getHistoryCount() {
  return safeRead().length;
}

export function captureSnapshot(state) {
  const map = getEnrichedChapterMap(state);
  const chapterScores = {};
  CHAPTERS.forEach((ch) => {
    chapterScores[ch.id] = map[ch.id]?.s || 0;
  });
  const total = averageScore(map);

  const snap = {
    id: Date.now(),
    date: new Date().toISOString(),
    brand: state.inputBrand || "",
    url: state.inputUrl || "",
    totalScore: total,
    chapterScores,
    ga4Connected: !!state.ga4Snapshot,
    adsConnected: !!state.adsSnapshot,
  };

  const arr = safeRead();
  // 5분 이내 중복 저장 방지
  const last = arr[arr.length - 1];
  if (last && Date.now() - last.id < 5 * 60 * 1000) {
    arr[arr.length - 1] = snap;
  } else {
    arr.push(snap);
  }
  // 최대 보관 수 초과 시 오래된 것부터 제거
  while (arr.length > MAX_SNAPSHOTS) arr.shift();
  safeWrite(arr);
  return snap;
}

export function clearHistory() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {}
}

/**
 * 데모 히스토리 시드: 6주간의 가상 스냅샷 생성
 * - 일부 챕터는 꾸준히 향상, 일부는 하락, 일부는 정체
 * - 사용자가 빈 상태에서 화면을 미리 볼 수 있도록
 */
export function seedDemoHistory() {
  const now = Date.now();
  const week = 7 * 24 * 60 * 60 * 1000;

  // 챕터별 시작 점수 + 주간 변화량 정의
  const profile = {
    brand:          { start: 42, delta: [+2, +5, +3, +2, +6, +4] },   // 향상 큼
    competition:    { start: 38, delta: [+1, +2, -1, +3, +2, +1] },   // 완만 향상
    keywords:       { start: 35, delta: [+3, +4, +5, +4, +6, +5] },   // 큰 향상
    trust_buy:      { start: 55, delta: [+1, +1, 0, +2, +1, +1] },    // 정체+
    homepage:       { start: 48, delta: [+2, +3, -1, +1, +2, +3] },   // 잔진동 후 상승
    trust:          { start: 40, delta: [-2, -1, -1, +0, -1, -2] },   // 꾸준 하락 ⚠
    detail:         { start: 52, delta: [0, +1, +1, +2, +1, +2] },    // 완만 향상
    content:        { start: 30, delta: [+5, +6, +4, +3, +5, +4] },   // 급상승 🚀
    sem:            { start: 45, delta: [-1, +0, -2, -1, -1, +0] },   // 미세 하락
    sns:            { start: 38, delta: [+2, +1, +3, +2, +1, +2] },   // 향상
    ads:            { start: 50, delta: [+1, -1, -2, -1, -2, -3] },   // 후반 하락 ⚠
    viral:          { start: 28, delta: [+1, +2, +1, +1, +2, +1] },   // 미세 향상
    info:           { start: 32, delta: [0, +1, 0, +1, 0, +1] },      // 정체
    retention:      { start: 34, delta: [+3, +4, +2, +3, +4, +3] },   // 꾸준 향상
    data_analytics: { start: 25, delta: [+2, +3, +5, +4, +6, +5] },   // GA4 연결 후 급상승
  };

  const arr = [];
  for (let w = 0; w < 6; w++) {
    const date = now - week * (5 - w);
    const chapterScores = {};
    let totalSum = 0;
    let totalN = 0;
    Object.keys(profile).forEach((chId) => {
      const p = profile[chId];
      let s = p.start;
      for (let k = 0; k <= w; k++) s += p.delta[k];
      s = Math.max(0, Math.min(100, s));
      chapterScores[chId] = s;
      totalSum += s;
      totalN++;
    });
    arr.push({
      id: date,
      date: new Date(date).toISOString(),
      brand: "데모 브랜드",
      url: "https://demo.example.com",
      totalScore: Math.round(totalSum / totalN),
      chapterScores,
      ga4Connected: w >= 2, // 3주차부터 GA4 연결됨
      adsConnected: w >= 4, // 5주차부터 광고 연결
      _demo: true,
    });
  }
  safeWrite(arr);
  return arr;
}

export function getLatestPair() {
  const arr = getHistory();
  if (arr.length < 2) return null;
  return { previous: arr[arr.length - 2], current: arr[arr.length - 1] };
}

export function formatDate(iso) {
  try {
    const d = new Date(iso);
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
  } catch {
    return iso;
  }
}

export function daysBetween(isoA, isoB) {
  try {
    const a = new Date(isoA).getTime();
    const b = new Date(isoB).getTime();
    return Math.round(Math.abs(b - a) / (1000 * 60 * 60 * 24));
  } catch {
    return 0;
  }
}
