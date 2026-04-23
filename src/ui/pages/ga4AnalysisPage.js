import { scoreColor } from "../../utils/score.js";

const escapeAttr = (v) => String(v ?? "").replace(/"/g, "&quot;");

const fmtNum = (n) => {
  if (n == null || !Number.isFinite(n)) return "-";
  if (Math.abs(n) >= 10000) return (n / 1000).toFixed(1) + "k";
  return new Intl.NumberFormat("ko-KR").format(Math.round(n));
};
const fmtPct = (n) => (n == null ? "-" : (n * 100).toFixed(1) + "%");
const fmtDelta = (n) => {
  if (n == null) return "";
  const sign = n >= 0 ? "+" : "";
  const color = n >= 0 ? "var(--ok)" : "var(--bad)";
  return `<span class="ga4-delta" style="color:${color}">${sign}${(n * 100).toFixed(1)}%</span>`;
};
const fmtDuration = (sec) => {
  if (!sec) return "0초";
  const m = Math.floor(sec / 60);
  const s = Math.round(sec % 60);
  return m > 0 ? `${m}분 ${s}초` : `${s}초`;
};

function renderConnectCard(state) {
  const connected = !!state.ga4Snapshot;
  const isDemo = !!state.ga4Snapshot?.demo;

  if (connected) {
    return `
      <section class="card ga4-connect-card ga4-connect-connected">
        <div class="ga4-connect-head">
          <span class="ga4-connect-ic" style="background:${isDemo ? "var(--neutral)" : "var(--ok)"}">
            ${isDemo ? "🧪" : "✅"}
          </span>
          <div class="ga4-connect-text">
            <h3>${isDemo ? "데모 데이터 연결됨" : "GA4 연동됨"}</h3>
            <p class="mri-page-sub">
              ${isDemo
                ? "샘플 데이터로 화면을 확인하고 있습니다. 실제 연동은 GA4 속성 ID 입력 후 Google 로그인."
                : `속성 ID: <strong>${escapeAttr(state.ga4PropertyId || "-")}</strong> · 최근 28일 데이터 · ${new Date(state.ga4Snapshot.fetchedAt).toLocaleString("ko-KR")}`}
            </p>
          </div>
          <button class="secondary" data-action="disconnect-ga4">연동 해제</button>
        </div>
      </section>
    `;
  }

  return `
    <section class="card ga4-connect-card">
      <div class="ga4-connect-head">
        <span class="ga4-connect-ic" style="background:var(--muted)">🔌</span>
        <div class="ga4-connect-text">
          <h3>GA4 계정을 연동하세요</h3>
          <p class="mri-page-sub">속성 ID를 입력하고 Google 계정으로 로그인하면, 최근 28일 지표를 자동 분석합니다.</p>
        </div>
      </div>
      <div class="ga4-connect-form">
        <label class="integration-label">GA4 속성 ID (숫자)</label>
        <input id="ga4PropertyInput" value="${escapeAttr(state.ga4PropertyId || "")}" placeholder="예: 123456789" />
        <div class="row gap-sm wrap" style="margin-top:10px">
          <button type="button" class="primary" data-action="connect-ga4" ${state.ga4Loading ? "disabled" : ""}>
            ${state.ga4Loading ? "연동 중…" : "Google 계정으로 연동"}
          </button>
          <button type="button" class="secondary" data-action="demo-ga4" ${state.ga4Loading ? "disabled" : ""}>
            데모 데이터로 미리보기
          </button>
        </div>
        ${state.ga4Error ? `<p class="integration-err">${escapeAttr(state.ga4Error)}</p>` : ""}
      </div>
    </section>
  `;
}

function renderKpiCards(snap) {
  const d = snap.delta || {};
  const kpis = [
    { label: "세션", value: fmtNum(snap.sessions), delta: d.sessions, icon: "👥" },
    { label: "활성 사용자", value: fmtNum(snap.activeUsers), delta: d.activeUsers, icon: "🧑" },
    { label: "이탈률", value: fmtPct(snap.bounceRate), delta: d.bounceRate, icon: "↩️", inverse: true },
    { label: "평균 세션 시간", value: fmtDuration(snap.averageSessionDuration), delta: d.averageSessionDuration, icon: "⏱" },
    { label: "참여율", value: fmtPct(snap.engagementRate), icon: "💬" },
    { label: "페이지/세션", value: (snap.screenPageViewsPerSession || 0).toFixed(1), icon: "📄" },
  ];
  return `
    <section class="ga4-kpi-grid">
      ${kpis
        .map(
          (k) => `
        <article class="ga4-kpi-card">
          <div class="ga4-kpi-top">
            <span class="ga4-kpi-ic">${k.icon}</span>
            <span class="ga4-kpi-lb">${k.label}</span>
          </div>
          <div class="ga4-kpi-value">${k.value}</div>
          ${k.delta != null ? `<div class="ga4-kpi-delta">${fmtDelta(k.inverse ? -k.delta : k.delta)} <span>vs 직전 28일</span></div>` : ""}
        </article>`
        )
        .join("")}
    </section>
  `;
}

function renderChannelAnalysis(snap) {
  const channels = snap.channels || [];
  if (!channels.length) return "";
  const total = channels.reduce((a, b) => a + b.sessions, 0) || 1;
  const sorted = [...channels].sort((a, b) => b.sessions - a.sessions);
  const maxSess = sorted[0]?.sessions || 1;

  return `
    <section class="card ga4-channels">
      <header class="report-section-head">
        <h3>🌐 트래픽 채널 분석</h3>
        <p class="mri-page-sub">채널별 세션 비중 · 품질(이탈률·전환)을 비교해 약한 채널을 찾아내세요.</p>
      </header>
      <div class="ga4-channel-list">
        ${sorted
          .map((c) => {
            const pct = (c.sessions / total) * 100;
            const width = (c.sessions / maxSess) * 100;
            const quality = c.bounceRate < 0.5 ? "양호" : c.bounceRate < 0.6 ? "보통" : "취약";
            const qColor = c.bounceRate < 0.5 ? "var(--ok)" : c.bounceRate < 0.6 ? "var(--neutral)" : "var(--warn)";
            return `
          <div class="ga4-channel-row">
            <div class="ga4-channel-hd">
              <span class="ga4-channel-name">${c.name}</span>
              <span class="ga4-channel-pct">${pct.toFixed(1)}%</span>
            </div>
            <div class="ga4-channel-bar">
              <div class="ga4-channel-fill" style="width:${width}%;background:var(--accent)"></div>
            </div>
            <div class="ga4-channel-meta">
              <span>세션 <strong>${fmtNum(c.sessions)}</strong></span>
              <span>이탈률 <strong style="color:${qColor}">${fmtPct(c.bounceRate)}</strong> · ${quality}</span>
              <span>전환 <strong>${fmtNum(c.conversions)}</strong></span>
            </div>
          </div>`;
          })
          .join("")}
      </div>
    </section>
  `;
}

function renderTopPages(snap) {
  const pages = snap.topPages || [];
  if (!pages.length) return "";
  const sorted = [...pages].sort((a, b) => b.views - a.views);
  const worst = [...pages].filter((p) => p.views >= 100).sort((a, b) => b.bounceRate - a.bounceRate).slice(0, 5);
  const engaged = [...pages].filter((p) => p.views >= 100).sort((a, b) => b.avgDuration - a.avgDuration).slice(0, 5);

  return `
    <section class="card ga4-pages">
      <header class="report-section-head">
        <h3>📄 페이지 성과</h3>
        <p class="mri-page-sub">조회수·체류시간·이탈률을 함께 보여 어느 페이지가 가치가 있고 어느 페이지를 개선해야 하는지 한눈에 파악할 수 있습니다.</p>
      </header>
      <div class="ga4-pages-grid-3">
        <div>
          <h4 class="ga4-pages-sub">🔝 조회수 TOP</h4>
          <table class="ga4-table">
            <thead><tr><th>페이지</th><th>조회수</th><th>이탈</th></tr></thead>
            <tbody>
              ${sorted
                .slice(0, 7)
                .map((p) => `<tr><td class="ga4-path">${p.path}</td><td>${fmtNum(p.views)}</td><td>${fmtPct(p.bounceRate)}</td></tr>`)
                .join("")}
            </tbody>
          </table>
        </div>
        <div>
          <h4 class="ga4-pages-sub" style="color:var(--ok)">⏱ 체류시간 TOP</h4>
          <table class="ga4-table">
            <thead><tr><th>페이지</th><th>조회수</th><th>체류</th></tr></thead>
            <tbody>
              ${engaged
                .map((p) => `<tr><td class="ga4-path">${p.path}</td><td>${fmtNum(p.views)}</td><td style="color:var(--ok);font-weight:800">${fmtDuration(p.avgDuration)}</td></tr>`)
                .join("")}
            </tbody>
          </table>
        </div>
        <div>
          <h4 class="ga4-pages-sub" style="color:var(--bad)">⚠️ 개선 필요</h4>
          <table class="ga4-table">
            <thead><tr><th>페이지</th><th>조회수</th><th>이탈</th></tr></thead>
            <tbody>
              ${worst
                .map((p) => `<tr><td class="ga4-path">${p.path}</td><td>${fmtNum(p.views)}</td><td style="color:var(--bad);font-weight:800">${fmtPct(p.bounceRate)}</td></tr>`)
                .join("")}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  `;
}

function renderGeo(snap) {
  const geo = snap.geo || [];
  if (!geo.length) return "";
  // 국가별 집계
  const byCountry = {};
  geo.forEach((r) => {
    const c = r.country || "(not set)";
    if (!byCountry[c]) byCountry[c] = { country: c, sessions: 0, users: 0, cities: [] };
    byCountry[c].sessions += r.sessions;
    byCountry[c].users += r.users;
    byCountry[c].cities.push(r);
  });
  const countries = Object.values(byCountry).sort((a, b) => b.sessions - a.sessions).slice(0, 6);
  const totalSess = countries.reduce((a, b) => a + b.sessions, 0) || 1;
  // 상위 도시
  const cities = [...geo].sort((a, b) => b.sessions - a.sessions).slice(0, 8);

  return `
    <section class="card ga4-geo">
      <header class="report-section-head">
        <h3>🌍 지역 분석</h3>
        <p class="mri-page-sub">국가·도시별 방문자 분포를 통해 타겟 시장과 잠재 확장 지역을 파악합니다.</p>
      </header>
      <div class="ga4-geo-grid">
        <div>
          <h4 class="ga4-pages-sub">🌐 국가별 세션 비중</h4>
          <div class="ga4-geo-list">
            ${countries
              .map((c) => {
                const pct = (c.sessions / totalSess) * 100;
                return `
              <div class="ga4-channel-row">
                <div class="ga4-channel-hd">
                  <span class="ga4-channel-name">${c.country}</span>
                  <span class="ga4-channel-pct">${pct.toFixed(1)}%</span>
                </div>
                <div class="ga4-channel-bar"><div class="ga4-channel-fill" style="width:${pct}%;background:var(--ok)"></div></div>
                <div class="ga4-channel-meta"><span>세션 <strong>${fmtNum(c.sessions)}</strong></span><span>사용자 <strong>${fmtNum(c.users)}</strong></span></div>
              </div>`;
              })
              .join("")}
          </div>
        </div>
        <div>
          <h4 class="ga4-pages-sub">🏙 도시 TOP 8</h4>
          <table class="ga4-table">
            <thead><tr><th>도시</th><th>국가</th><th>세션</th></tr></thead>
            <tbody>
              ${cities.map((r) => `<tr><td>${r.city}</td><td style="color:var(--muted)">${r.country}</td><td>${fmtNum(r.sessions)}</td></tr>`).join("")}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  `;
}

function renderDemographics(snap) {
  const d = snap.demographics;
  if (!d) return "";
  const ageTotal = (d.age || []).reduce((a, b) => a + b.users, 0) || 1;
  const genderTotal = (d.gender || []).reduce((a, b) => a + b.users, 0) || 1;
  const ageColors = ["#8b5cf6", "#ec4899", "#0d9488", "#f97316", "#3b82f6", "#eab308"];
  const genderColors = { female: "#ec4899", male: "#3b82f6" };
  const genderLabels = { female: "여성", male: "남성", unknown: "알수없음" };

  return `
    <section class="card ga4-demographics">
      <header class="report-section-head">
        <h3>👥 인구통계 · 잠재고객</h3>
        <p class="mri-page-sub">연령·성별 분포를 통해 실제 타겟 고객이 누구인지 검증하고, 마케팅 메시지·채널 전략에 반영하세요.</p>
      </header>
      <div class="ga4-demo-grid">
        <div>
          <h4 class="ga4-pages-sub">🎂 연령대</h4>
          <div class="ga4-demo-bars">
            ${(d.age || [])
              .map((row, i) => {
                const pct = (row.users / ageTotal) * 100;
                return `
              <div class="ga4-demo-bar">
                <span class="ga4-demo-lb">${row.key}</span>
                <div class="ga4-demo-track"><div class="ga4-demo-fill" style="width:${pct}%;background:${ageColors[i % ageColors.length]}"></div></div>
                <span class="ga4-demo-val">${fmtNum(row.users)} (${pct.toFixed(1)}%)</span>
              </div>`;
              })
              .join("")}
          </div>
        </div>
        <div>
          <h4 class="ga4-pages-sub">⚥ 성별</h4>
          <div class="ga4-demo-bars">
            ${(d.gender || [])
              .map((row) => {
                const pct = (row.users / genderTotal) * 100;
                return `
              <div class="ga4-demo-bar">
                <span class="ga4-demo-lb">${genderLabels[row.key] || row.key}</span>
                <div class="ga4-demo-track"><div class="ga4-demo-fill" style="width:${pct}%;background:${genderColors[row.key] || "#8b5cf6"}"></div></div>
                <span class="ga4-demo-val">${fmtNum(row.users)} (${pct.toFixed(1)}%)</span>
              </div>`;
              })
              .join("")}
          </div>
          <p class="ga4-demo-hint">
            💡 GA4 Data API에서 직접 제공되지 않는 "잠재고객(Audiences)" 데이터는 <strong>연령·성별 + 관심사 + 소스/매체 조합</strong>으로 대체합니다. GA4 관리자 화면에서 잠재고객을 먼저 구성하면 관심사 기반 분석까지 확장 가능합니다.
          </p>
        </div>
      </div>
    </section>
  `;
}

function renderEvents(snap) {
  const events = snap.events || [];
  if (!events.length) return "";
  const maxCount = events[0]?.count || 1;
  // 주요 이벤트 하이라이트 (전환·구매 관련)
  const conversionEvents = events.filter((e) => /purchase|lead|signup|form_submit|subscribe|generate_lead/i.test(e.name));

  return `
    <section class="card ga4-events">
      <header class="report-section-head">
        <h3>🎯 이벤트 데이터 <span class="ga4-pill-hint">총 ${events.length}종</span></h3>
        <p class="mri-page-sub">GA4에서 수집된 이벤트 발생 현황. 전환 관련 이벤트(purchase, generate_lead 등)는 강조 표시됩니다.</p>
      </header>
      <div class="ga4-events-list">
        ${events
          .map((e) => {
            const pct = (e.count / maxCount) * 100;
            const isConversion = /purchase|lead|signup|form_submit|subscribe|generate_lead/i.test(e.name);
            return `
          <div class="ga4-event-row ${isConversion ? "is-conversion" : ""}">
            <span class="ga4-event-name">${isConversion ? "💰" : "⚡"} ${e.name}</span>
            <div class="ga4-event-bar"><div class="ga4-event-fill" style="width:${pct}%;background:${isConversion ? "var(--ok)" : "var(--accent)"}"></div></div>
            <span class="ga4-event-count">${fmtNum(e.count)}<small> · ${fmtNum(e.users)}명</small></span>
          </div>`;
          })
          .join("")}
      </div>
      ${conversionEvents.length === 0
        ? `<p class="ga4-warn-box">⚠️ 전환 관련 이벤트가 감지되지 않았습니다. <strong>purchase / generate_lead / form_submit</strong> 등 핵심 전환 이벤트를 GA4에서 설정하세요.</p>`
        : ""}
    </section>
  `;
}

function renderSourceMedium(snap) {
  const rows = snap.sourceMedium || [];
  if (!rows.length) return "";
  const sorted = [...rows].sort((a, b) => b.sessions - a.sessions).slice(0, 12);

  return `
    <section class="card ga4-source-medium">
      <header class="report-section-head">
        <h3>🔗 세션 소스/매체 상세</h3>
        <p class="mri-page-sub">어디서 어떤 경로로 유입되었는지(예: google/organic, instagram/referral) 상세하게 분석합니다.</p>
      </header>
      <table class="ga4-table ga4-sm-table">
        <thead>
          <tr>
            <th>소스 / 매체</th>
            <th>세션</th>
            <th>사용자</th>
            <th>이탈률</th>
            <th>전환</th>
          </tr>
        </thead>
        <tbody>
          ${sorted
            .map((r) => {
              const bColor = r.bounceRate < 0.5 ? "var(--ok)" : r.bounceRate < 0.6 ? "var(--neutral)" : "var(--warn)";
              return `
            <tr>
              <td><strong>${r.source}</strong> / <span style="color:var(--muted)">${r.medium}</span></td>
              <td>${fmtNum(r.sessions)}</td>
              <td>${fmtNum(r.users)}</td>
              <td style="color:${bColor};font-weight:700">${fmtPct(r.bounceRate)}</td>
              <td><strong>${fmtNum(r.conversions)}</strong></td>
            </tr>`;
            })
            .join("")}
        </tbody>
      </table>
    </section>
  `;
}

function buildDiagnosis(snap) {
  const issues = [];
  // 이탈률 높음
  if (snap.bounceRate > 0.55) {
    issues.push({
      level: "위험",
      color: "var(--bad)",
      title: "전체 이탈률 높음",
      text: `이탈률 ${fmtPct(snap.bounceRate)} — 방문자 절반 이상이 첫 페이지에서 이탈하고 있습니다. 랜딩 페이지 개편·로딩 속도 개선이 시급합니다.`,
      chId: "homepage",
      chLb: "홈페이지·스토어 UX",
    });
  }
  // Direct 의존 과도
  const directPct = (snap.channels || []).find((c) => c.name === "Direct")?.sessions / (snap.sessions || 1);
  if (directPct > 0.5) {
    issues.push({
      level: "주의",
      color: "var(--warn)",
      title: "직접 유입(Direct) 의존 과도",
      text: `Direct 비중 ${fmtPct(directPct)} — 브랜드 인지 기반 유입이 강한 반면, 오가닉·소셜 유입 취약. 신규 고객 확보 채널 다변화 필요.`,
      chId: "keywords",
      chLb: "핵심 키워드·SEO",
    });
  }
  // Organic Search 비중 낮음
  const organicPct = (snap.channels || []).find((c) => c.name === "Organic Search")?.sessions / (snap.sessions || 1);
  if (organicPct < 0.3) {
    issues.push({
      level: "주의",
      color: "var(--warn)",
      title: "오가닉 검색 트래픽 비중 낮음",
      text: `Organic Search 비중 ${fmtPct(organicPct || 0)} — SEO 자산 부족. 콘텐츠 마케팅·검색 최적화 투자가 필요합니다.`,
      chId: "content",
      chLb: "콘텐츠 마케팅",
    });
  }
  // 평균 세션 시간 짧음
  if (snap.averageSessionDuration < 60) {
    issues.push({
      level: "주의",
      color: "var(--warn)",
      title: "평균 세션 시간 짧음",
      text: `평균 ${fmtDuration(snap.averageSessionDuration)} — 콘텐츠 몰입 부족. 페이지 간 내부 링크·CTA 강화가 필요합니다.`,
      chId: "detail",
      chLb: "상세페이지 분석",
    });
  }
  // 전환 이벤트 감지
  const totalConv = (snap.channels || []).reduce((a, b) => a + (b.conversions || 0), 0);
  if (totalConv === 0) {
    issues.push({
      level: "위험",
      color: "var(--bad)",
      title: "전환 이벤트 미세팅",
      text: `28일간 전환 이벤트 0건 — GA4 주요 이벤트(구매·가입·문의) 설정이 되어 있지 않습니다. 마케팅 성과 측정 불가 상태.`,
      chId: "data_analytics",
      chLb: "통계·데이터 분석",
    });
  }

  if (!issues.length) {
    issues.push({
      level: "양호",
      color: "var(--ok)",
      title: "현재 지표 양호",
      text: "주요 이슈가 감지되지 않았습니다. 현재 수준을 유지하면서 성장 실험에 투자하세요.",
      chId: null,
      chLb: "",
    });
  }
  return issues;
}

function renderDiagnosis(snap, isPaid) {
  if (!isPaid) {
    return `
      <section class="card ga4-diagnosis ga4-diagnosis-locked">
        <header class="report-section-head">
          <h3>🔍 MRI 진단 해석 <span class="ga4-pro-chip">PRO</span></h3>
          <p class="mri-page-sub">GA4 데이터를 15개 챕터 진단 프레임으로 해석합니다 — 어느 챕터에 문제가 있고, 어떤 액션을 먼저 해야 하는지.</p>
        </header>
        <div class="ga4-diag-locked-box">
          <span class="plan-locked-ic">🔒</span>
          <h4>PRO 전용 기능</h4>
          <p>자동 이슈 감지 · 관련 챕터 매핑 · 우선순위 추천을 제공합니다.</p>
          <button class="primary" data-action="go-pricing">PRO 멤버십 시작하기 →</button>
        </div>
      </section>
    `;
  }
  const issues = buildDiagnosis(snap);
  return `
    <section class="card ga4-diagnosis">
      <header class="report-section-head">
        <h3>🔍 MRI 진단 해석</h3>
        <p class="mri-page-sub">GA4 지표에서 감지된 이슈를 MRI 챕터 관점으로 해석했습니다. 관련 챕터로 이동해 실행 플랜을 확인하세요.</p>
      </header>
      <div class="ga4-diag-list">
        ${issues
          .map(
            (it) => `
          <article class="ga4-diag-item" style="border-left-color:${it.color}">
            <div class="ga4-diag-hd">
              <span class="ga4-diag-level" style="background:${it.color}">${it.level}</span>
              <strong>${it.title}</strong>
            </div>
            <p class="ga4-diag-text">${it.text}</p>
            ${it.chId
              ? `<button class="link-btn" data-action="open-chapter" data-id="${it.chId}">→ ${it.chLb} 챕터 상세보기</button>`
              : ""}
          </article>`
          )
          .join("")}
      </div>
    </section>
  `;
}

export function renderGa4AnalysisPage(state) {
  const snap = state.ga4Snapshot;
  const isPaid = !!state.isPaid;

  return `
    <section class="ga4-wrap mri-shell">
      <header class="card chapter-hero ga4-hero">
        <div class="chapter-hero-inner">
          <div class="chapter-hero-text">
            <p class="ga4-hero-kicker">📈 GA4 통계 데이터 분석</p>
            <h2>Google Analytics 4 전용 분석</h2>
            <p class="mri-page-sub">
              GA4 지표를 MRI 진단 프레임으로 해석해 "무엇이 왜 약한지 · 무엇을 먼저 해야 하는지"까지 연결합니다.
            </p>
          </div>
        </div>
      </header>

      ${renderConnectCard(state)}

      ${
        snap
          ? `
        ${renderKpiCards(snap)}
        ${renderChannelAnalysis(snap)}
        ${renderSourceMedium(snap)}
        ${renderTopPages(snap)}
        ${renderGeo(snap)}
        ${renderDemographics(snap)}
        ${renderEvents(snap)}
        ${renderDiagnosis(snap, isPaid)}
      `
          : `<section class="card ga4-empty">
              <p>📊 GA4 데이터가 아직 연결되지 않았습니다. 위에서 연동하거나 "데모 데이터로 미리보기"를 눌러주세요.</p>
            </section>`
      }
    </section>
  `;
}
