// 카피 템플릿 라이브러리 — 검증된 카피라이팅 프레임
// 각 템플릿: 프레임 설명 + 단계별 가이드 + 실전 예시 + 변수 채움 함수

export const COPY_FRAMES = [
  {
    id: "AIDA",
    name: "AIDA",
    fullName: "Attention - Interest - Desire - Action",
    desc: "광고 카피의 고전. 주의 → 흥미 → 욕망 → 행동 4단계로 자연스럽게 전환을 유도",
    bestFor: ["광고 카피", "랜딩페이지 헤드라인", "이메일 제목 + 본문"],
    steps: [
      { k: "Attention", lb: "주목",   guide: "충격적 사실, 질문, 숫자로 시선 멈추기" },
      { k: "Interest",  lb: "흥미",   guide: "독자의 문제와 연결된 스토리/통계 제시" },
      { k: "Desire",    lb: "욕망",   guide: "베네핏을 구체적 결과로 시각화" },
      { k: "Action",    lb: "행동",   guide: "명확한 다음 행동 + 긴급성/혜택" },
    ],
    fill: ({ product = "제품", problem = "문제", benefit = "결과" }) => ({
      Attention: `🚨 ${problem}, 매달 반복되고 있나요?`,
      Interest:  `대부분 사장님이 같은 ${problem}로 매달 광고비를 잃습니다.`,
      Desire:    `${product}로 ${benefit}를 단 30일 안에 경험하세요.`,
      Action:    `👉 지금 무료 진단 받기 (선착순 100명)`,
    }),
  },
  {
    id: "PAS",
    name: "PAS",
    fullName: "Problem - Agitate - Solution",
    desc: "고통을 키운 뒤 해결책을 제시해 강한 행동 동기 부여",
    bestFor: ["SNS 짧은 카피", "DM 콜드아웃리치", "리타겟팅 광고"],
    steps: [
      { k: "Problem",  lb: "문제",     guide: "독자가 겪는 구체적 문제 한 문장" },
      { k: "Agitate",  lb: "고통 증폭", guide: "방치하면 어떻게 더 나빠지는지 시각화" },
      { k: "Solution", lb: "해결",     guide: "당신의 솔루션이 어떻게 그것을 끝내는지" },
    ],
    fill: ({ problem = "매출 정체", consequence = "경쟁사에 밀려남", solution = "AI 진단" }) => ({
      Problem:  `${problem}가 6개월째 계속되고 있나요?`,
      Agitate:  `방치하면 ${consequence}이 현실이 됩니다. 매달 새는 광고비는 덤이고요.`,
      Solution: `${solution} 한 번이면 원인이 보입니다. 무료로 시작하세요.`,
    }),
  },
  {
    id: "FAB",
    name: "FAB",
    fullName: "Features - Advantages - Benefits",
    desc: "기능 → 장점 → 혜택 순으로 '왜 사야 하는지'를 명확히",
    bestFor: ["상세페이지 본문", "제품 소개 슬라이드", "B2B 영업 자료"],
    steps: [
      { k: "Features",   lb: "기능",   guide: "객관적 스펙 / 기술" },
      { k: "Advantages", lb: "장점",   guide: "그 기능이 왜 우월한가" },
      { k: "Benefits",   lb: "혜택",   guide: "고객 삶에 어떤 변화가 일어나는가" },
    ],
    fill: ({ feature = "AI 자동 진단", advantage = "전문가 상담 대비 100배 빠름", benefit = "당장 오늘 마케팅 실행 가능" }) => ({
      Features:   feature,
      Advantages: advantage,
      Benefits:   benefit,
    }),
  },
  {
    id: "BAB",
    name: "BAB",
    fullName: "Before - After - Bridge",
    desc: "현재의 문제 상태와 이상적 미래를 대비시켜 솔루션을 다리로 제시",
    bestFor: ["스토리텔링 광고", "후기 콘텐츠", "런칭 발표"],
    steps: [
      { k: "Before", lb: "이전",  guide: "독자의 현재 답답한 상황" },
      { k: "After",  lb: "이후",  guide: "솔루션 사용 후 이상적 모습" },
      { k: "Bridge", lb: "다리",  guide: "어떻게 거기로 가는가 = 우리 제품" },
    ],
    fill: ({ before = "광고비만 쓰고 매출은 그대로", after = "데이터로 매주 개선", bridge = "마케팅MRI 진단" }) => ({
      Before: `🤯 ${before}`,
      After:  `🚀 ${after}`,
      Bridge: `🌉 ${bridge}로 5분 안에 시작`,
    }),
  },
  {
    id: "QUEST",
    name: "QUEST",
    fullName: "Qualify - Understand - Educate - Stimulate - Transition",
    desc: "장문 세일즈 페이지/이메일에 적합한 5단계 깊이 있는 설득 구조",
    bestFor: ["장문 세일즈 페이지", "웨비나 세일즈 이메일", "고가 상품 LP"],
    steps: [
      { k: "Qualify",    lb: "자격",   guide: "이 글이 누구를 위한 것인지 명시" },
      { k: "Understand", lb: "공감",   guide: "독자 상황을 깊이 이해하고 있음을 보여줌" },
      { k: "Educate",    lb: "교육",   guide: "왜 이 솔루션이 필요한지 가르침" },
      { k: "Stimulate",  lb: "자극",   guide: "결과가 가져올 변화를 생생하게" },
      { k: "Transition", lb: "전환",   guide: "구매/문의로 자연스럽게 이동" },
    ],
    fill: ({ audience = "월 매출 1억 이하 사장님", problem = "마케팅 막막함", education = "데이터 진단의 힘", outcome = "월 매출 2배", cta = "무료 진단 신청" }) => ({
      Qualify:    `만약 당신이 ${audience}라면, 이 글은 당신을 위한 것입니다.`,
      Understand: `${problem} — 저도 그랬습니다. 그 답답함, 충분히 이해합니다.`,
      Educate:    `해법은 단순합니다. ${education}을 이해하면 모든 게 바뀝니다.`,
      Stimulate:  `상상해보세요 — ${outcome}이 일상이 되는 6개월 후의 당신을.`,
      Transition: `👉 지금 ${cta} (5분이면 충분합니다)`,
    }),
  },
  {
    id: "4U",
    name: "4U Headline",
    fullName: "Useful - Urgent - Unique - Ultra-specific",
    desc: "헤드라인 한 줄을 강력하게 만드는 4가지 체크",
    bestFor: ["블로그 제목", "광고 헤드라인", "이메일 제목 줄"],
    steps: [
      { k: "Useful",        lb: "유용",   guide: "독자에게 실질 가치가 있는가" },
      { k: "Urgent",        lb: "긴급",   guide: "지금 읽어야 할 이유가 있는가" },
      { k: "Unique",        lb: "독특",   guide: "다른 곳에 없는 메시지인가" },
      { k: "UltraSpecific", lb: "초구체", guide: "숫자/이름/장소가 들어갔는가" },
    ],
    fill: ({ topic = "마케팅 진단" }) => ({
      Useful:        `${topic}로 매출 2배 — 실전 가이드`,
      Urgent:        `이번 달 안에 ${topic} 시작해야 하는 이유`,
      Unique:        `대형 마케팅사가 알려주지 않는 ${topic} 진실`,
      UltraSpecific: `47개 브랜드가 ${topic}으로 평균 +37% 매출 성장`,
    }),
  },
  {
    id: "STAR",
    name: "STAR Story",
    fullName: "Situation - Task - Action - Result",
    desc: "케이스 스터디 / 후기 콘텐츠를 설득력 있게 구성",
    bestFor: ["고객 후기 콘텐츠", "케이스 스터디", "브랜드 스토리"],
    steps: [
      { k: "Situation", lb: "상황", guide: "고객이 처한 초기 상황" },
      { k: "Task",      lb: "과제", guide: "해결해야 했던 구체 목표" },
      { k: "Action",    lb: "행동", guide: "우리와 함께 한 실행 단계" },
      { k: "Result",    lb: "결과", guide: "측정 가능한 변화" },
    ],
    fill: ({ customer = "한 카페 사장님", task = "월 매출 30% 증대", action = "MRI 진단 + 콘텐츠 자동화", result = "3개월만에 매출 +52%" }) => ({
      Situation: `${customer}는 광고비 대비 효과가 없어 고민이었습니다.`,
      Task:      `목표는 ${task}.`,
      Action:    `해결책은 ${action}.`,
      Result:    `결과는? ${result}.`,
    }),
  },
];

export function getFrame(id) {
  return COPY_FRAMES.find((f) => f.id === id) || COPY_FRAMES[0];
}
