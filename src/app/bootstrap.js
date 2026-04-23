import { MRI_DATA } from "../data/chapters.js";
import { getState, setState, subscribe } from "../state/store.js";
import { getEnrichedChapterMap } from "../state/chapterData.js";
import { fetchSeoScore } from "../services/seoService.js";
import { requestGa4AccessToken, hasGoogleClientConfigured } from "../services/googleAuth.js";
import { fetchGa4Summary, createDemoGa4Snapshot } from "../services/ga4Service.js";
import { parseAdsCsv } from "../services/adsParser.js";
import { renderInputPage } from "../ui/pages/inputPage.js";
import { renderDashboardPage } from "../ui/pages/dashboardPage.js";
import { renderChapterPage } from "../ui/pages/chapterPage.js";
import { renderReportPage } from "../ui/pages/reportPage.js";
import { renderPlanPage } from "../ui/pages/planPage.js";
import { renderGa4AnalysisPage } from "../ui/pages/ga4AnalysisPage.js";
import { renderCompetePage } from "../ui/pages/competePage.js";
import { analyzeCompetitor } from "../services/competitorService.js";
import { renderHistoryComparePage } from "../ui/pages/historyComparePage.js";
import { captureSnapshot, seedDemoHistory, clearHistory } from "../services/historyService.js";
import { exportPlanToPdf, exportPlanToHtml } from "../services/planExport.js";
import { renderPricingPage } from "../ui/pages/pricingPage.js";
import { renderContentFlowPage } from "../ui/contentFlow/index.js";
import { buildDraftFromState } from "../ui/contentFlow/generate.js";
import { generateCalendar } from "../services/calendarService.js";
import { generateImageUrl, generatePlaceholderImage, composeSlideBlob, downloadBlob } from "../services/contentDraftService.js";
import { renderAppShell } from "../ui/layout/appShell.js";

const root = document.getElementById("mri-app");

function renderApp() {
  const state = getState();
  const chapterMap = getEnrichedChapterMap(state);
  if (!root) return;

  if (state.main === "input") {
    root.innerHTML = renderInputPage(state);
    return;
  }

  let body = renderDashboardPage(state, chapterMap);
  if (state.main === "mri" && state.ch) {
    body = renderChapterPage(state, chapterMap);
  }
  if (state.main === "report") {
    body = renderReportPage(state, chapterMap);
  }
  if (state.main === "plan") {
    body = renderPlanPage(state, chapterMap);
  }
  if (state.main === "ga4") {
    body = renderGa4AnalysisPage(state);
  }
  if (state.main === "compete") {
    body = renderCompetePage(state);
  }
  if (state.main === "history") {
    body = renderHistoryComparePage(state);
  }
  if (state.main === "pricing") {
    body = renderPricingPage(state);
  }
  if (state.main === "cf") {
    body = renderContentFlowPage(state);
  }
  root.innerHTML = renderAppShell(state, chapterMap, body);
}

async function measureSeo() {
  const state = getState();
  setState({ seoLoading: true, seoData: null });
  const result = await fetchSeoScore(state.seoUrl || state.inputUrl);
  setState({ seoLoading: false, seoData: result });
}

function readInputValues() {
  const brandInput = document.getElementById("brandInput");
  const urlInput = document.getElementById("urlInput");
  const ga4Prop = document.getElementById("ga4PropertyInput");
  return {
    inputBrand: brandInput ? brandInput.value : getState().inputBrand,
    inputUrl: urlInput ? urlInput.value : getState().inputUrl,
    seoUrl: urlInput ? urlInput.value : getState().seoUrl,
    ga4PropertyId: ga4Prop ? ga4Prop.value.trim() : getState().ga4PropertyId,
  };
}

async function handleConnectGa4() {
  const { ga4PropertyId } = readInputValues();
  setState({ ga4PropertyId, ga4Error: "", ga4Loading: true });

  try {
    if (!hasGoogleClientConfigured()) {
      setState({
        ga4Loading: false,
        ga4Error: "Google OAuth 클라이언트 ID가 설정되지 않았습니다. src/config/google.js 를 확인하거나 데모 데이터를 사용하세요.",
      });
      return;
    }

    const token = await requestGa4AccessToken();
    if (!token) {
      setState({ ga4Loading: false, ga4Error: "로그인이 취소되었거나 토큰을 받지 못했습니다." });
      return;
    }

    const summary = await fetchGa4Summary(token, ga4PropertyId);
    setState({
      ga4Loading: false,
      ga4Snapshot: summary,
      daConnected: true,
      ga4Error: "",
    });
  } catch (e) {
    setState({
      ga4Loading: false,
      ga4Error: e instanceof Error ? e.message : String(e),
    });
  }
}

function handleDemoGa4() {
  setState({
    ga4Snapshot: createDemoGa4Snapshot(),
    daConnected: true,
    ga4Error: "",
    ga4Loading: false,
  });
}

function handleDisconnectGa4() {
  setState({
    ga4Snapshot: null,
    daConnected: false,
    ga4Error: "",
  });
}

async function handleRunCompete() {
  const brandEl = document.getElementById("competeBrandInput");
  const urlEl = document.getElementById("competeUrlInput");
  const brand = brandEl ? brandEl.value.trim() : getState().competeBrand;
  const url = urlEl ? urlEl.value.trim() : getState().competeUrl;
  if (!url) {
    setState({ competeError: "경쟁사 URL을 입력해주세요." });
    return;
  }
  setState({ competeBrand: brand, competeUrl: url, competeLoading: true, competeError: "" });
  try {
    const snap = await analyzeCompetitor(brand, url);
    setState({ competeSnapshot: snap, competeLoading: false, competeError: "" });
  } catch (e) {
    setState({
      competeLoading: false,
      competeError: e instanceof Error ? e.message : String(e),
    });
  }
}

function handleClearAdsData() {
  setState({
    adsSnapshot: null,
    adsParseError: "",
    adUploaded: false,
    adFileName: "",
  });
}

document.addEventListener("click", (event) => {
  const target = event.target.closest("[data-action]");
  if (!target) return;
  const action = target.dataset.action;
  const id = target.dataset.id;

  if (action === "go-input") return setState({ main: "input", ch: null });
  if (action === "go-mri") return setState({ main: "mri", ch: null });
  if (action === "go-cf") return setState({ main: "cf", ch: null });
  if (action === "go-report") return setState({ main: "report", ch: null });
  if (action === "go-plan") return setState({ main: "plan", ch: null });
  if (action === "go-ga4") return setState({ main: "ga4", ch: null });
  if (action === "go-compete") return setState({ main: "compete", ch: null });
  if (action === "go-history") return setState({ main: "history", ch: null });
  if (action === "capture-snapshot") {
    captureSnapshot(getState());
    setState({ historyTick: getState().historyTick + 1, main: "history" });
    return;
  }
  if (action === "seed-demo-history") {
    seedDemoHistory();
    setState({ historyTick: getState().historyTick + 1, main: "history" });
    return;
  }
  if (action === "clear-demo-history") {
    clearHistory();
    setState({ historyTick: getState().historyTick + 1, main: "history" });
    return;
  }
  if (action === "toggle-auto-diagnose") {
    setState({ autoDiagnoseEnabled: !getState().autoDiagnoseEnabled });
    return;
  }
  if (action === "toggle-history-detail") {
    const chId = target.dataset.chId;
    const card = document.querySelector(`article.history-card[data-ch-id="${chId}"]`);
    if (card) {
      const detail = card.querySelector(".compete-card-detail");
      const chev = card.querySelector(".compete-card-chev");
      const open = !detail.hasAttribute("hidden");
      if (open) {
        detail.setAttribute("hidden", "");
        card.classList.remove("is-open");
        if (chev) chev.textContent = "▾";
      } else {
        detail.removeAttribute("hidden");
        card.classList.add("is-open");
        if (chev) chev.textContent = "▴";
      }
    }
    return;
  }
  if (action === "run-compete") {
    void handleRunCompete();
    return;
  }
  if (action === "clear-compete") {
    setState({ competeSnapshot: null, competeError: "" });
    return;
  }
  if (action === "toggle-compete-detail") {
    const chId = target.dataset.chId;
    const card = document.querySelector(`article.compete-card[data-ch-id="${chId}"]`);
    if (card) {
      const detail = card.querySelector(".compete-card-detail");
      const chev = card.querySelector(".compete-card-chev");
      const open = !detail.hasAttribute("hidden");
      if (open) {
        detail.setAttribute("hidden", "");
        card.classList.remove("is-open");
        if (chev) chev.textContent = "▾";
      } else {
        detail.removeAttribute("hidden");
        card.classList.add("is-open");
        if (chev) chev.textContent = "▴";
      }
    }
    return;
  }
  if (action === "download-plan-pdf") {
    if (!getState().isPaid) return;
    exportPlanToPdf();
    return;
  }
  if (action === "download-plan-html") {
    if (!getState().isPaid) return;
    exportPlanToHtml(getState().inputBrand || "브랜드");
    return;
  }
  if (action === "toggle-plan-detail") {
    const cardId = target.dataset.cardId;
    const card = document.querySelector(`article.plan-action[data-card-id="${cardId}"]`);
    if (card) {
      const detail = card.querySelector(".plan-action-detail");
      const chev = card.querySelector(".plan-action-chevron");
      const open = !detail.hasAttribute("hidden");
      if (open) {
        detail.setAttribute("hidden", "");
        card.classList.remove("is-open");
        if (chev) chev.textContent = "▾";
      } else {
        detail.removeAttribute("hidden");
        card.classList.add("is-open");
        if (chev) chev.textContent = "▴";
      }
    }
    return;
  }
  if (action === "go-pricing") return setState({ main: "pricing", ch: null });
  if (action === "open-chapter") return setState({ main: "mri", ch: id });
  if (action === "open-cf") return setState({ main: "cf", cf: id, ch: null });

  // ContentFlow Phase 1
  if (action === "run-keyword-lab") {
    const el = document.getElementById("kwSeedInput");
    const val = el ? el.value.trim() : "";
    if (!val) {
      return setState({ kwSeed: "마케팅 진단, 소상공인 광고, 브랜드 컨설팅" });
    }
    return setState({ kwSeed: val });
  }
  if (action === "seed-keyword-demo") {
    return setState({ kwSeed: "마케팅 진단, 소상공인 광고, 브랜드 컨설팅, 콘텐츠 마케팅, SNS 광고" });
  }
  if (action === "clear-keyword-lab") return setState({ kwSeed: "" });

  if (action === "generate-calendar") {
    const el = document.getElementById("calSeedInput");
    const val = el ? el.value.trim() : "";
    const cal = generateCalendar({
      seeds: val,
      brand: getState().inputBrand || "",
      chapterMap: getEnrichedChapterMap(getState()),
    });
    return setState({ calSeed: val, calData: cal });
  }
  if (action === "clear-calendar") return setState({ calSeed: "", calData: null });

  if (action === "set-draft-type") return setState({ draftType: id, draftResult: null });
  if (action === "run-draft") {
    const topic = document.getElementById("draftTopic")?.value.trim() || "";
    const keyword = document.getElementById("draftKeyword")?.value.trim() || "";
    const tone = document.getElementById("draftToneSelect")?.value || "friendly";
    setState({ draftTopic: topic, draftKeyword: keyword, draftTone: tone });
    const result = buildDraftFromState(getState());
    return setState({ draftResult: result });
  }
  if (action === "ig-regen-images") {
    const draft = getState().draftResult;
    if (draft && draft.type === "instagram") {
      const newSeed = Date.now() % 100000;
      const slides = draft.slides.map((s) => ({
        ...s,
        imageUrl: generateImageUrl(s.imagePrompt, newSeed + s.n),
        useAiImage: true,
        customImage: null,
      }));
      setState({ draftResult: { ...draft, slides } });
    }
    return;
  }
  if (action === "ig-toggle-ai") {
    const draft = getState().draftResult;
    if (draft && draft.type === "instagram") {
      const anyAi = draft.slides.some((s) => s.useAiImage);
      const slides = draft.slides.map((s) => ({ ...s, useAiImage: !anyAi }));
      setState({ draftResult: { ...draft, slides } });
    }
    return;
  }
  if (action === "ig-reset-image") {
    const n = Number(target.dataset.slideN);
    const draft = getState().draftResult;
    if (draft && draft.type === "instagram") {
      const slides = draft.slides.map((s) => s.n === n ? { ...s, customImage: null } : s);
      setState({ draftResult: { ...draft, slides } });
    }
    return;
  }
  if (action === "ig-download-image") {
    const n = Number(target.dataset.slideN);
    const draft = getState().draftResult;
    const slide = draft?.slides?.find((s) => s.n === n);
    if (slide) {
      (async () => {
        try {
          const blob = await composeSlideBlob(slide, draft.keyword || "");
          if (blob) downloadBlob(blob, `carousel-${n}-${slide.role}.png`);
        } catch (e) {
          console.error("슬라이드 다운로드 실패", e);
          alert("이미지 합성에 실패했습니다. 다시 시도해주세요.");
        }
      })();
    }
    return;
  }
  if (action === "ig-download-all") {
    const draft = getState().draftResult;
    if (!draft || draft.type !== "instagram") return;
    (async () => {
      const btn = target;
      const orig = btn.textContent;
      btn.disabled = true;
      try {
        for (const slide of draft.slides) {
          btn.textContent = `⬇ 다운로드 중... (${slide.n}/${draft.slides.length})`;
          const blob = await composeSlideBlob(slide, draft.keyword || "");
          if (blob) downloadBlob(blob, `carousel-${String(slide.n).padStart(2, "0")}-${slide.role}.png`);
          await new Promise((r) => setTimeout(r, 250)); // 브라우저 다운로드 연타 방지
        }
      } catch (e) {
        console.error("전체 다운로드 실패", e);
        alert("일부 이미지 합성에 실패했습니다.");
      } finally {
        btn.disabled = false;
        btn.textContent = orig;
      }
    })();
    return;
  }
  if (action === "copy-draft") {
    const draft = getState().draftResult;
    if (draft) {
      const text = JSON.stringify(draft, null, 2);
      navigator.clipboard?.writeText(text);
    }
    return;
  }
  if (action === "set-copy-template") return setState({ tplActiveId: id });
  if (action === "copy-template") {
    const out = document.querySelector(".tpl-col:last-child");
    if (out) navigator.clipboard?.writeText(out.innerText);
    return;
  }
  if (action === "apply-tpl-vars") {
    const vars = {};
    document.querySelectorAll("[data-tpl-field]").forEach((el) => {
      vars[el.dataset.tplField] = el.value;
    });
    return setState({ tplVars: vars });
  }
  if (action === "clear-tpl-vars") {
    return setState({ tplVars: { product: "", audience: "", problem: "", benefit: "", outcome: "", cta: "" } });
  }
  if (action === "seed-tpl-demo") {
    return setState({
      tplVars: {
        product: "유기농 종갓집 김치",
        audience: "건강 챙기는 30-40대 주부",
        problem: "마트 김치 화학첨가물 걱정",
        benefit: "3대째 종갓집 비법, 100% 무첨가",
        outcome: "온 가족이 안심하고 먹는 김치 식탁",
        cta: "첫 주문 20% 할인 받기",
      },
    });
  }
  if (action === "toggle-tpl-view-all") {
    return setState({ tplViewAll: !getState().tplViewAll });
  }
  if (action === "copy-frame-card") {
    const card = target.closest(".tpl-card");
    if (card) {
      const text = card.querySelector(".tpl-card-fills")?.innerText || "";
      navigator.clipboard?.writeText(text);
    }
    return;
  }
  if (action === "set-type") return setState({ inputType: id });
  if (action === "toggle-paid") return setState({ isPaid: !getState().isPaid });
  if (action === "toggle-theme") {
    const next = getState().theme === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", next === "dark" ? "dark" : "");
    return setState({ theme: next });
  }
  if (action === "connect-ga4") {
    void handleConnectGa4();
    return;
  }
  if (action === "demo-ga4") {
    handleDemoGa4();
    return;
  }
  if (action === "disconnect-ga4") {
    handleDisconnectGa4();
    return;
  }
  if (action === "clear-ads-data") {
    handleClearAdsData();
    return;
  }
  if (action === "start-diagnosis") {
    const vals = readInputValues();
    return setState({
      ...vals,
      main: "mri",
      ch: null,
    });
  }
  if (action === "measure-seo") {
    measureSeo();
  }
});

document.addEventListener("change", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLInputElement)) return;

  if (target.id === "adFileInput" && target.files?.[0]) {
    const file = target.files[0];
    setState({ adUploaded: true, adFileName: file.name, adsParseError: "" });
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const text = String(reader.result || "");
        const snapshot = parseAdsCsv(text);
        setState({ adsSnapshot: snapshot, adsParseError: "" });
      } catch (e) {
        setState({
          adsSnapshot: null,
          adsParseError: e instanceof Error ? e.message : "CSV 파싱 실패",
        });
      }
    };
    reader.readAsText(file, "UTF-8");
    return;
  }

  if (target.id === "gaFileInput" && target.files?.[0]) {
    setState({ daUploaded: true, daFileName: target.files[0].name });
  }

  // Instagram carousel image upload
  if (target.dataset.igUpload && target.files?.[0]) {
    const n = Number(target.dataset.igUpload);
    const file = target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      const draft = getState().draftResult;
      if (draft && draft.type === "instagram") {
        const slides = draft.slides.map((s) => s.n === n ? { ...s, customImage: String(reader.result) } : s);
        setState({ draftResult: { ...draft, slides } });
      }
    };
    reader.readAsDataURL(file);
  }
});

document.addEventListener("input", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLInputElement)) return;
  if (target.id === "brandInput") setState({ inputBrand: target.value });
  if (target.id === "urlInput") setState({ inputUrl: target.value, seoUrl: target.value });
  if (target.id === "ga4PropertyInput") setState({ ga4PropertyId: target.value.trim() });
  if (target.id === "competeBrandInput") setState({ competeBrand: target.value });
  if (target.id === "competeUrlInput") setState({ competeUrl: target.value.trim() });
});

// Enter key shortcut for ContentFlow inputs
document.addEventListener("keydown", (event) => {
  if (event.key !== "Enter") return;
  const t = event.target;
  if (!(t instanceof HTMLInputElement)) return;
  if (t.id === "kwSeedInput") {
    event.preventDefault();
    setState({ kwSeed: t.value.trim() || "마케팅 진단, 소상공인 광고, 브랜드 컨설팅" });
  }
  if (t.id === "calSeedInput") {
    event.preventDefault();
    const cal = generateCalendar({
      seeds: t.value.trim(),
      brand: getState().inputBrand || "",
      chapterMap: getEnrichedChapterMap(getState()),
    });
    setState({ calSeed: t.value.trim(), calData: cal });
  }
});

subscribe(renderApp);
renderApp();
