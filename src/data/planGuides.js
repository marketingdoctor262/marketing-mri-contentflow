// 마케팅 실행 플랜 상세 가이드 데이터
// - 페이즈별 리소스 템플릿 (즉시/단기/중장기)
// - 챕터별 KPI·도구 매핑
// 액션 텍스트 + 챕터 약점(wk)과 조합해 자동 조립

export const PHASE_RESOURCES = {
  now: {
    time: "주 2~4시간 × 1~2주",
    cost: "0 ~ 10만원",
    people: "담당자 1명 (직접 실행 가능)",
    difficulty: "쉬움 — 무료 도구·기본 설정 중심",
  },
  short: {
    time: "주 4~8시간 × 4주",
    cost: "월 10 ~ 80만원",
    people: "담당자 1명 + 외주 파트너 1~2곳",
    difficulty: "보통 — 구조 설계·콘텐츠 제작 병행",
  },
  mid: {
    time: "월 40~80시간 × 12주",
    cost: "총 200만원 ~ 1,000만원",
    people: "담당자 1명 + 전문 인력 2~3명 (내/외부)",
    difficulty: "어려움 — 시스템 투자·운영 체계 구축",
  },
};

export const CHAPTER_GUIDES = {
  brand: {
    kpis: [
      "브랜드 검색량 월 +30% (네이버 검색광고 시스템)",
      "About·브랜드스토리 페이지 체류시간 2분 이상 (GA4)",
      "직접 유입(Direct Traffic) 비중 +15%p",
    ],
    tools: ["네이버 검색광고 시스템", "Figma (브랜드 가이드)", "Notion (브랜드북)", "Canva (굿즈 목업)"],
  },
  competition: {
    kpis: [
      "주요 경쟁사 3곳 광고·콘텐츠 주간 모니터링 체계 구축",
      "점유율(SOV) 경쟁사 대비 70% 이상",
      "차별화 USP 1문장 매월 리뉴얼",
    ],
    tools: ["Meta Ad Library", "SimilarWeb", "구글 알리미(Alerts)", "네이버 데이터랩"],
  },
  keywords: {
    kpis: [
      "타겟 키워드 10개 상위 10위 진입 3개 이상",
      "오가닉 트래픽 월 +50%",
      "Core Web Vitals 모바일 LCP 2.5초 이하",
    ],
    tools: ["구글 Search Console", "블랙키위", "Ahrefs / SE Ranking", "PageSpeed Insights"],
  },
  trust_buy: {
    kpis: [
      "장바구니 → 결제 전환율 +10%p",
      "환불·AS 정책 페이지 전환 기여도 (GA4 이벤트)",
      "제3자 인증·리뷰 노출 항목 5개 이상",
    ],
    tools: ["카페24/아임웹 어드민", "트러스트사인", "구매후기 위젯(포토리뷰)", "GA4 결제 퍼널"],
  },
  homepage: {
    kpis: [
      "모바일 PageSpeed 점수 70점 이상",
      "바운스율 -10%p, 평균 체류시간 +30초",
      "모바일 결제 전환율 +15%",
    ],
    tools: ["PageSpeed Insights", "GTmetrix", "구글 태그매니저", "Hotjar (히트맵)"],
  },
  trust: {
    kpis: [
      "리뷰·UGC 월 10건 이상 수집",
      "커뮤니티/팬 채널 월 방문자 +30%",
      "브랜드 감성 키워드 소셜 언급 +20%",
    ],
    tools: ["네이버 리뷰 플러그인", "포토 후기 위젯", "카카오톡 채널", "Brand24 (소셜 모니터링)"],
  },
  detail: {
    kpis: [
      "상세페이지 스크롤 완독률 60% 이상",
      "상세 → 장바구니 전환율 +8%p",
      "FAQ·영상 섹션 클릭률 측정",
    ],
    tools: ["카페24 상세페이지 에디터", "Canva Pro", "영상 제작 (Vrew, CapCut)", "3D 뷰어 (Sketchfab)"],
  },
  content: {
    kpis: [
      "블로그 월 발행 8건 + SEO 유입 월 500 → 2,000",
      "콘텐츠 1건당 평균 체류 2분 이상",
      "타겟 키워드 상위 10위 3개 확보",
    ],
    tools: ["네이버 블로그/티스토리", "워드프레스 + Yoast SEO", "블랙키위", "ContentFlow (본 서비스)"],
  },
  sem: {
    kpis: [
      "브랜드·비브랜드 검색어 CTR 5% 이상",
      "전환당 비용(CPA) -20%",
      "Search Console 클릭수 월 +30%",
    ],
    tools: ["구글 Ads", "네이버 검색광고", "Search Console", "Looker Studio (리포트)"],
  },
  sns: {
    kpis: [
      "인스타그램 도달 주간 1만+",
      "팔로워 월 +300명 (정체 아닌 유효 증가)",
      "릴스·숏폼 평균 조회수 +50%",
    ],
    tools: ["메타 비즈니스 스위트", "Later (예약 발행)", "Canva (피드 템플릿)", "CapCut / VLLO"],
  },
  ads: {
    kpis: [
      "광고 ROAS 300% 이상",
      "iOS CAPI 이벤트 매칭률 70% 이상",
      "주간 크리에이티브 2회 리뉴얼 체계",
    ],
    tools: ["메타 광고 관리자", "구글 Ads", "CAPI Gateway (Stape)", "크리에이티브 테스트 (AdMaker)"],
  },
  viral: {
    kpis: [
      "체험단·서포터즈 월 +10명 모집",
      "UGC 해시태그 월 +30건",
      "공식 커뮤니티 활성 회원 월 +20%",
    ],
    tools: ["레뷰·디너의여왕 (체험단)", "공구 인플루언서 리스트업", "카카오톡 오픈채팅", "Discord 서버"],
  },
  info: {
    kpis: [
      "기사형 PR 월 1~2건 노출",
      "뉴스레터 구독자 500명 확보",
      "주요 매체 크레딧 3곳 이상",
    ],
    tools: ["보도자료 배포 (뉴스와이어)", "Stibee (뉴스레터)", "팟캐스트 (Spotify for Podcasters)"],
  },
  retention: {
    kpis: [
      "7일 리텐션 15%, 30일 리텐션 8% 이상",
      "재구매율 월 +10%p",
      "구독·멤버십 가입자 월 +50명",
    ],
    tools: ["카카오 알림톡 (솔라피)", "Stibee / 메일침프", "GA4 코호트 분석", "CRM (채널톡)"],
  },
  data_analytics: {
    kpis: [
      "GA4 전환 이벤트 10종 이상 세팅",
      "서버사이드 트래킹 이벤트 매칭률 90%+",
      "대시보드 주간 리포트 자동화",
    ],
    tools: ["GA4", "구글 태그매니저 (+ Server-side GTM)", "Looker Studio", "GTM Server (Stape)"],
  },
};

// 액션 텍스트 → 실행 단계 3~5개 자동 추출
// "+" 또는 "·"로 분리된 요소 + 일반 단계 템플릿 병합
export function extractSteps(actionText) {
  const stripped = actionText.replace(/\s*\(.*?\)\s*$/, "").trim();
  // "+", "·", "→" 로 묶인 것은 작업 단위로 분리
  const parts = stripped
    .split(/\s*[+·→]\s*/)
    .map((s) => s.trim())
    .filter((s) => s.length >= 3);

  if (parts.length >= 2) {
    return [
      "현재 상태 점검 및 목표치 설정",
      ...parts.map((p) => `${p} 실행`),
      "결과 측정 및 주간 리뷰",
    ].slice(0, 5);
  }

  // 단일 액션인 경우 일반 템플릿
  return [
    "현재 상태 점검 (기존 자산·데이터 확인)",
    "실행 계획서·체크리스트 작성",
    `${stripped} 실행`,
    "결과 측정 (KPI 확인)",
    "주간 리뷰 및 개선",
  ];
}

// 챕터 약점(wk) + 점수 → "왜 필요한가" 문단
export function buildWhyText(chapter, chapterData, actionText) {
  const wk = chapterData.wk || [];
  const score = chapterData.s;
  const lead = `현재 ${chapter.lb} 점수 ${score}점 — ${score < 40 ? "위험/취약 수준" : "개선 여지"}.`;
  const painPoints = wk.slice(0, 2).join(" / ");
  return `${lead} 주요 약점: ${painPoints}. 이 액션(${actionText.slice(0, 40)}${
    actionText.length > 40 ? "…" : ""
  })은 해당 약점을 직접 해소합니다.`;
}
