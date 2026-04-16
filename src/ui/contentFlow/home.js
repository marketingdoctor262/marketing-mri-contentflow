import { PLATFORMS } from "../../data/contentFlow.js";

export function renderCfHome() {
  return `<h4>브랜드 홈</h4>
    <p>연결 플랫폼: ${Object.values(PLATFORMS)
      .map((p) => p.lb)
      .join(", ")}</p>`;
}
