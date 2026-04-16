import { MRI_DATA } from "../data/chapters.js";
import { averageScore } from "../utils/score.js";
import { computeEnrichmentDeltas } from "../services/dataEnricher.js";

/**
 * GA4·광고 스냅샷을 반영한 챕터 맵 (원본 불변)
 */
export function getEnrichedChapterMap(state) {
  const deltas = computeEnrichmentDeltas(state.ga4Snapshot, state.adsSnapshot);
  const out = {};

  for (const id of Object.keys(MRI_DATA)) {
    const base = MRI_DATA[id];
    const delta = deltas[id] || 0;
    const newScore = Math.max(0, Math.min(100, Math.round(base.s + delta)));
    out[id] = {
      ...base,
      s: newScore,
      _scoreDelta: delta,
      _enriched: delta !== 0,
    };
  }

  return out;
}

export function getOverviewScoreFromState(state) {
  return averageScore(getEnrichedChapterMap(state));
}
