/**
 * GA4·광고 요약 지표 → 챕터별 점수 보정 (-12 ~ +12)
 */

export function computeEnrichmentDeltas(ga4, ads) {
  const d = {};

  if (ga4) {
    const er = ga4.engagementRate ?? 0;
    if (er >= 0.55) d.data_analytics = (d.data_analytics || 0) + 5;
    else if (er >= 0.4) d.data_analytics = (d.data_analytics || 0) + 2;
    else if (er < 0.28 && er > 0) d.data_analytics = (d.data_analytics || 0) - 4;

    const br = ga4.bounceRate ?? 0;
    if (br > 0.58) {
      d.homepage = (d.homepage || 0) - 4;
      d.detail = (d.detail || 0) - 3;
      d.trust_buy = (d.trust_buy || 0) - 2;
    } else if (br < 0.38 && br >= 0) {
      d.homepage = (d.homepage || 0) + 3;
      d.detail = (d.detail || 0) + 2;
    }

    const dur = ga4.averageSessionDuration ?? 0;
    if (dur >= 150) d.content = (d.content || 0) + 5;
    else if (dur >= 90) d.content = (d.content || 0) + 2;
    else if (dur > 0 && dur < 40) d.content = (d.content || 0) - 5;

    const pvs = ga4.screenPageViewsPerSession ?? 0;
    if (pvs >= 3) d.sem = (d.sem || 0) + 2;
    if (pvs < 1.2 && pvs > 0) d.sem = (d.sem || 0) - 2;

    const sess = ga4.sessions ?? 0;
    if (sess >= 10000) d.keywords = (d.keywords || 0) + 2;
    if (sess >= 5000) d.retention = (d.retention || 0) + 3;
    else if (sess > 0 && sess < 500) d.retention = (d.retention || 0) - 3;

    const users = ga4.activeUsers ?? 0;
    if (users >= 3000) d.sns = (d.sns || 0) + 2;
  }

  if (ads) {
    const cc = ads.campaignCount || 0;
    if (cc >= 8) d.ads = (d.ads || 0) + 6;
    else if (cc >= 3) d.ads = (d.ads || 0) + 4;
    else if (cc >= 1) d.ads = (d.ads || 0) + 2;

    const ctr = ads.avgCtr ?? 0;
    if (ctr >= 0.045) d.ads = (d.ads || 0) + 4;
    else if (ctr >= 0.025) d.ads = (d.ads || 0) + 2;
    else if (ctr > 0 && ctr < 0.012) d.ads = (d.ads || 0) - 5;

    const conv = ads.totalConversions ?? 0;
    if (conv >= 50) d.ads = (d.ads || 0) + 3;
    else if (conv >= 10) d.ads = (d.ads || 0) + 2;

    const imp = ads.totalImpressions ?? 0;
    if (imp >= 100000) d.sem = (d.sem || 0) + 2;

    if ((ads.totalClicks ?? 0) > 0 && (ads.totalCost ?? 0) > 0) {
      d.data_analytics = (d.data_analytics || 0) + 1;
    }
  }

  for (const k of Object.keys(d)) {
    d[k] = Math.max(-12, Math.min(12, Math.round(d[k])));
    if (d[k] === 0) delete d[k];
  }

  return d;
}
