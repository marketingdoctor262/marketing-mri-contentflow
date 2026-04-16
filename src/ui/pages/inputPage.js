import { hasGoogleClientConfigured } from "../../services/googleAuth.js";

export function renderInputPage(state) {
  const ga4Status = state.ga4Snapshot ? "연동됨 · 진단에 반영" : "미연동";
  const adsStatus = state.adsSnapshot ? "업로드됨 · 진단에 반영" : state.adUploaded ? "파일 선택됨" : "미연동";
  const clientOk = hasGoogleClientConfigured();

  return `
    <section class="input-wrap">
      <header>
        <h2>AI 마케팅 정밀진단 시작</h2>
        <p>브랜드/URL 입력 후 진단을 시작하세요. GA4·광고 데이터를 연동하면 진단 점수가 실제 지표에 맞게 보정됩니다.</p>
      </header>

      <div class="card">
        <label>브랜드명 / 상호명</label>
        <input id="brandInput" value="${escapeAttr(state.inputBrand)}" placeholder="예: 마케팅MRI" />

        <label>홈페이지 / 쇼핑몰 URL</label>
        <input id="urlInput" value="${escapeAttr(state.inputUrl)}" placeholder="https://yoursite.com" />

        <label>플랫폼 유형</label>
        <div class="row">
          <button class="tab ${state.inputType === "homepage" ? "active" : ""}" data-action="set-type" data-id="homepage">홈페이지</button>
          <button class="tab ${state.inputType === "shop" ? "active" : ""}" data-action="set-type" data-id="shop">쇼핑몰</button>
        </div>

        <div class="grid two integration-grid">
          <div class="card soft integration-card">
            <div class="integration-card-hd">
              <h4>광고 데이터</h4>
              <span class="integration-status ${state.adsSnapshot ? "on" : ""}">${adsStatus}</span>
            </div>
            <p class="integration-hint">Google Ads에서 캠페인 보고서를 CSV로 내보내 업로드하세요. (API 직접 연동은 서버 구축 후 지원 예정)</p>
            <input id="adFileInput" type="file" accept=".csv,.txt" />
            ${
              state.adsSnapshot
                ? `<button type="button" class="tab" data-action="clear-ads-data" style="margin-top:8px">광고 데이터 초기화</button>`
                : ""
            }
            ${state.adsParseError ? `<p class="integration-err">${escapeAttr(state.adsParseError)}</p>` : ""}
          </div>

          <div class="card soft integration-card">
            <div class="integration-card-hd">
              <h4>GA4 데이터</h4>
              <span class="integration-status ${state.ga4Snapshot ? "on" : ""}">${ga4Status}</span>
            </div>
            <label class="integration-label">GA4 속성 ID (숫자)</label>
            <input id="ga4PropertyInput" value="${escapeAttr(state.ga4PropertyId)}" placeholder="예: 123456789" />
            <div class="integration-actions">
              <button type="button" class="primary integration-btn" data-action="connect-ga4" ${state.ga4Loading ? "disabled" : ""}>
                ${state.ga4Loading ? "연동 중…" : "Google 계정으로 연동하기"}
              </button>
              <button type="button" class="tab integration-btn" data-action="demo-ga4" ${state.ga4Loading ? "disabled" : ""}>데모 데이터로 미리보기</button>
            </div>
            ${
              state.ga4Snapshot
                ? `<button type="button" class="tab" data-action="disconnect-ga4" style="margin-top:8px">GA4 연동 해제</button>`
                : ""
            }
            ${state.ga4Error ? `<p class="integration-err">${escapeAttr(state.ga4Error)}</p>` : ""}
            ${
              !clientOk
                ? `<p class="integration-warn">Google 클라이언트 ID가 없습니다. <code>src/config/google.js</code>에 OAuth 클라이언트 ID를 넣거나, 데모 데이터로 흐름을 확인하세요.</p>`
                : ""
            }
          </div>
        </div>

        ${
          state.ga4Snapshot || state.adsSnapshot
            ? `<div class="card success integration-banner">
                <strong>데이터 보정 적용 중</strong>
                <p>GA4·광고 지표에 따라 관련 챕터 점수가 자동 보정됩니다. 대시보드에서 변화를 확인하세요.</p>
              </div>`
            : ""
        }

        <button class="primary" data-action="start-diagnosis">진단 시작</button>
      </div>
    </section>
  `;
}

function escapeAttr(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}
