import { IDEAS } from "../../data/contentFlow.js";

export function renderCfGenerate() {
  return `<h4>콘텐츠 생성</h4>
    ${IDEAS.map((idea) => `<article class="card soft"><strong>${idea.tl}</strong><p>${idea.hk}</p><small>${idea.mb}</small></article>`).join("")}`;
}
