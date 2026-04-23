import { getOverviewScoreFromState } from "./chapterData.js";

const listeners = new Set();

const state = {
  main: "input",
  cf: "home",
  ch: null,
  isPaid: false,
  theme: "light",
  seoLoading: false,
  seoData: null,
  seoUrl: "http://mamri.co.kr/",
  daMode: "manual",
  daConnected: false,
  daUploaded: false,
  daFileName: "",
  adUploaded: false,
  adFileName: "",
  adPlatform: "naver",
  inputBrand: "마케팅MRI",
  inputUrl: "http://mamri.co.kr/",
  inputType: "homepage",

  ga4PropertyId: "",
  ga4Loading: false,
  ga4Error: "",
  ga4Snapshot: null,

  adsSnapshot: null,
  adsParseError: "",

  competeBrand: "",
  competeUrl: "",
  competeLoading: false,
  competeError: "",
  competeSnapshot: null,

  historyTick: 0,
  autoDiagnoseEnabled: false,

  // ContentFlow Phase 1
  kwSeed: "",
  calSeed: "",
  calData: null,
  draftType: "blog",
  draftTopic: "",
  draftKeyword: "",
  draftTone: "friendly",
  draftResult: null,
  tplActiveId: "AIDA",
  tplViewAll: false,
  tplVars: {
    product: "",
    audience: "",
    problem: "",
    benefit: "",
    outcome: "",
    cta: "",
  },
};

export const getState = () => ({
  ...state,
  overviewScore: getOverviewScoreFromState(state),
  ga4Connected: Boolean(state.ga4Snapshot),
  adsDataConnected: Boolean(state.adsSnapshot),
});

export const setState = (partial) => {
  let changed = false;
  Object.keys(partial).forEach((key) => {
    if (state[key] !== partial[key]) {
      state[key] = partial[key];
      changed = true;
    }
  });
  if (changed) {
    listeners.forEach((fn) => fn(getState()));
  }
};

export const subscribe = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export const resetToInput = () => {
  setState({ main: "input", ch: null });
};
