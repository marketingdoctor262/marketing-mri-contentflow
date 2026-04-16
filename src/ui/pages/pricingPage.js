export function renderPricingPage(state) {
  return `
    <section class="pricing-wrap">
      <header class="pricing-header">
        <h2>멤버십 플랜 선택</h2>
        <p>마케팅MRI 정밀진단의 모든 기능을 활용하세요</p>
      </header>

      <div class="pricing-grid">
        <section class="pricing-card">
          <div class="pricing-card-hd">
            <h3>FREE</h3>
            <div class="pricing-price">₩0<small>/월</small></div>
          </div>
          <ul class="pricing-features">
            <li>✓ 15개 챕터 진단 점수</li>
            <li>✓ 챕터별 요약 분석</li>
            <li>✓ 강점/약점 분석</li>
            <li>✓ 실행 권고 제공</li>
            <li>✓ 종합 보고서</li>
            <li class="disabled">✕ 상세 진단항목 점수</li>
            <li class="disabled">✕ 항목별 개선 팁</li>
            <li class="disabled">✕ ContentFlow 전체 기능</li>
          </ul>
          <button class="pricing-btn free" ${state.isPaid ? 'data-action="toggle-paid"' : "disabled"}>
            ${state.isPaid ? "FREE로 전환" : "현재 플랜"}
          </button>
        </section>

        <section class="pricing-card pro">
          <div class="pricing-popular">MOST POPULAR</div>
          <div class="pricing-card-hd">
            <h3>PRO</h3>
            <div class="pricing-price">₩29,000<small>/월</small></div>
          </div>
          <ul class="pricing-features">
            <li>✓ FREE 플랜의 모든 기능</li>
            <li class="highlight">✓ ${bold("상세 진단항목별 개별 점수")}</li>
            <li class="highlight">✓ ${bold("항목별 상태 및 구체적 개선 팁")}</li>
            <li class="highlight">✓ ${bold("그룹별 세부 분석 리포트")}</li>
            <li>✓ ContentFlow 전체 기능</li>
            <li>✓ 월간 재진단 (변화 추적)</li>
            <li>✓ PDF 보고서 다운로드</li>
            <li>✓ 우선 고객 지원</li>
          </ul>
          <button class="pricing-btn pro-btn" data-action="${state.isPaid ? "toggle-paid" : "toggle-paid"}">
            ${state.isPaid ? "현재 플랜 ✓" : "PRO 시작하기 →"}
          </button>
        </section>

        <section class="pricing-card">
          <div class="pricing-card-hd">
            <h3>ENTERPRISE</h3>
            <div class="pricing-price">문의<small></small></div>
          </div>
          <ul class="pricing-features">
            <li>✓ PRO 플랜의 모든 기능</li>
            <li>✓ 다중 브랜드 진단</li>
            <li>✓ 팀 계정 (최대 10명)</li>
            <li>✓ API 연동</li>
            <li>✓ 맞춤 보고서 템플릿</li>
            <li>✓ 전담 컨설턴트 배정</li>
            <li>✓ 경쟁사 비교 분석</li>
            <li>✓ 화이트라벨 보고서</li>
          </ul>
          <button class="pricing-btn enterprise">문의하기</button>
        </section>
      </div>

      <section class="pricing-faq">
        <h4>자주 묻는 질문</h4>
        <div class="pricing-faq-item">
          <strong>PRO에서 볼 수 있는 상세 진단항목이 뭔가요?</strong>
          <p>각 챕터의 세부 진단 항목(예: 브랜드 인지도, 키워드 다양성 등)별 개별 점수, 상태(양호/보통/취약/위험), 그리고 구체적인 개선 팁을 확인할 수 있습니다.</p>
        </div>
        <div class="pricing-faq-item">
          <strong>언제든 해지할 수 있나요?</strong>
          <p>네, 월 구독 방식으로 언제든 해지 가능합니다. 해지 시 남은 기간까지는 PRO 기능을 이용할 수 있습니다.</p>
        </div>
        <div class="pricing-faq-item">
          <strong>재진단은 어떻게 하나요?</strong>
          <p>PRO 회원은 매월 1회 자동으로 재진단이 실행되며, 이전 결과와 변화 추이를 비교할 수 있습니다.</p>
        </div>
      </section>
    </section>
  `;
}

function bold(text) {
  return `<strong>${text}</strong>`;
}
