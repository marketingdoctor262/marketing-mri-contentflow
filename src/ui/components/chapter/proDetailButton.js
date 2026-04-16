export function renderProDetailButton(isPaid = false, totalItems = 0) {
  if (isPaid) {
    return `
      <section class="pro-detail-section open">
        <div class="pro-detail-divider">
          <span>🔓 PRO 상세 진단 항목 (${totalItems}개)</span>
        </div>
      </section>
    `;
  }

  return `
    <section class="pro-detail-section">
      <button class="pro-detail-btn" data-action="go-pricing">
        <div class="pro-detail-btn-inner">
          <div class="pro-detail-btn-left">
            <span class="pro-detail-icon">🔒</span>
            <div>
              <strong>진단항목별 상세점수 보기</strong>
              <p>${totalItems}개 세부 항목의 개별 점수·상태·구체적 개선 팁</p>
            </div>
          </div>
          <span class="pro-badge">PRO</span>
        </div>
      </button>
    </section>
  `;
}
