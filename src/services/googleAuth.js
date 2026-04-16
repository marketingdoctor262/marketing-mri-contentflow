import { GOOGLE_CLIENT_ID } from "../config/google.js";

const GIS_SRC = "https://accounts.google.com/gsi/client";
const SCOPE_ANALYTICS = "https://www.googleapis.com/auth/analytics.readonly";

let tokenClientPromise = null;

function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const s = document.createElement("script");
    s.src = src;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("Google 스크립트 로드 실패"));
    document.head.appendChild(s);
  });
}

/**
 * Google Identity Services OAuth2 — GA4 읽기 전용 토큰 요청
 * @returns {Promise<string|null>} access_token
 */
export async function requestGa4AccessToken() {
  if (!GOOGLE_CLIENT_ID?.trim()) {
    return null;
  }
  await loadScript(GIS_SRC);
  for (let i = 0; i < 50; i++) {
    if (window.google?.accounts?.oauth2) break;
    await new Promise((r) => setTimeout(r, 100));
  }
  if (!window.google?.accounts?.oauth2) {
    throw new Error("Google 로그인 라이브러리를 불러오지 못했습니다.");
  }

  return new Promise((resolve, reject) => {
    try {
      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: GOOGLE_CLIENT_ID.trim(),
        scope: SCOPE_ANALYTICS,
        callback: (resp) => {
          if (resp.error) {
            reject(new Error(resp.error));
            return;
          }
          resolve(resp.access_token || null);
        },
      });
      client.requestAccessToken({ prompt: "consent" });
    } catch (e) {
      reject(e);
    }
  });
}

export function hasGoogleClientConfigured() {
  return Boolean(GOOGLE_CLIENT_ID?.trim());
}
