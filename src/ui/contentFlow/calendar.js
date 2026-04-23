import { generateCalendar, CALENDAR_CHANNELS } from "../../services/calendarService.js";
import { getEnrichedChapterMap } from "../../state/chapterData.js";

export function renderCfCalendar(state) {
  const seed = state.calSeed || "";
  const cal = state.calData || (seed ? generateCalendar({
    seeds: seed,
    brand: state.inputBrand || "",
    chapterMap: getEnrichedChapterMap(state),
  }) : null);

  return `
    <div class="cal-wrap">
      <header class="cal-head">
        <div>
          <h4>📅 콘텐츠 캘린더 자동 생성</h4>
          <p class="muted">시드 키워드 + 진단 약점 챕터를 조합해 4주간 발행 일정을 자동으로 채웁니다.</p>
        </div>
      </header>

      <div class="cal-input-row">
        <input id="calSeedInput" type="text" placeholder="시드 키워드 (쉼표 구분) — 비우면 진단 데이터로 자동 생성" value="${escapeAttr(seed)}" />
        <button class="primary" data-action="generate-calendar">🚀 4주 일정 자동 생성</button>
        ${cal ? `<button class="ghost" data-action="clear-calendar">초기화</button>` : ""}
      </div>

      ${!cal ? renderEmpty() : `
        ${renderTotals(cal)}
        ${renderWeeks(cal)}
      `}
    </div>
  `;
}

function renderEmpty() {
  return `
    <div class="cal-empty">
      <div class="cal-empty-ic">📅</div>
      <h5>1초 만에 한 달 발행 계획 완성</h5>
      <p class="muted">월요일·블로그 / 화요일·인스타 / 수요일·숏폼 ... 채널별 최적 요일에 맞춰 자동 배치합니다.</p>
    </div>
  `;
}

function renderTotals(cal) {
  const cards = CALENDAR_CHANNELS.map((c) => `
    <div class="cal-total" style="border-color:${c.co}">
      <div class="cal-total-ic" style="background:${c.co}">${c.ic}</div>
      <div><div class="cal-total-n">${cal.totals[c.id] || 0}</div><div class="cal-total-l">${c.lb}</div></div>
    </div>
  `).join("");
  const weakStr = cal.weakChapters.map((w) => `${w.ic} ${w.lb}(${w.s})`).join(" · ");
  return `
    <section class="cal-summary">
      <div class="cal-totals">${cards}</div>
      <div class="cal-weak">⚠ <b>약점 챕터 우선 보강:</b> ${weakStr}</div>
    </section>
  `;
}

function renderWeeks(cal) {
  return cal.weeks.map((wk) => `
    <section class="cal-week">
      <h5>Week ${wk.weekIndex} · ${fmt(wk.days[0].date)} ~ ${fmt(wk.days[6].date)}</h5>
      <div class="cal-grid">
        ${wk.days.map((d) => renderDay(d)).join("")}
      </div>
    </section>
  `).join("");
}

function renderDay(d) {
  const today = isSameDay(d.date, new Date());
  const wk = ["월","화","수","목","금","토","일"];
  return `
    <div class="cal-day ${today ? "is-today" : ""}">
      <div class="cal-day-head">
        <span class="cal-day-date">${d.date.getDate()}</span>
        <span class="cal-day-wk">${wk[d.weekday - 1]}</span>
      </div>
      ${d.items.length ? d.items.map((it) => `
        <div class="cal-item" style="border-left-color:${it.channel.co}">
          <div class="cal-item-ch" style="color:${it.channel.co}">${it.channel.ic} ${it.channel.lb}</div>
          <div class="cal-item-tp"><b>${escapeText(it.format)}</b></div>
          <div class="cal-item-tx">${escapeText(it.topic)}</div>
          <small class="muted">톤: ${it.tone}</small>
        </div>
      `).join("") : `<div class="cal-empty-day">휴식</div>`}
    </div>
  `;
}

function fmt(d) { return `${d.getMonth() + 1}/${d.getDate()}`; }
function isSameDay(a, b) { return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate(); }
function escapeAttr(s) { return String(s).replace(/"/g, "&quot;"); }
function escapeText(s) { return String(s).replace(/[&<>]/g, (c) => ({ "&":"&amp;","<":"&lt;",">":"&gt;" }[c])); }
