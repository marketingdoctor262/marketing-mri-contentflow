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
import { renderPricingPage } from "../ui/pages/pricingPage.js";
import { renderContentFlowPage } from "../ui/contentFlow/index.js";
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
  if (action === "go-pricing") return setState({ main: "pricing", ch: null });
  if (action === "open-chapter") return setState({ main: "mri", ch: id });
  if (action === "open-cf") return setState({ main: "cf", cf: id, ch: null });
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
});

document.addEventListener("input", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLInputElement)) return;
  if (target.id === "brandInput") setState({ inputBrand: target.value });
  if (target.id === "urlInput") setState({ inputUrl: target.value, seoUrl: target.value });
  if (target.id === "ga4PropertyInput") setState({ ga4PropertyId: target.value.trim() });
});

subscribe(renderApp);
renderApp();
