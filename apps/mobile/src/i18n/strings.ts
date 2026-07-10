import { useLanguageStore } from "@/store/languageStore";

// App-wide static UI copy. The analysis content itself (summary/description/
// tip/sentence text) already comes back from the backend in whichever
// language the user picked on Home before recording; this dictionary only
// covers fixed chrome (labels, buttons, alerts) that isn't part of that payload.
const STRINGS = {
  en: {
    // Tab bar
    tabHome: "Home",
    tabHistory: "History",
    tabSettings: "Settings",

    // Home screen
    homeGreeting: (name: string) => (name ? `Hello, ${name}` : "Hello there"),
    homeSubtitle: "Ready to refine your pitch today?",
    homeEmptySession: "No analyzed recordings yet. Start your first one!",
    todaysGoalLabel: "TODAY'S GOAL",
    todaysGoalMessage:
      "Aim for a 1-2 minute recording. Focus on maintaining high energy and minimizing filler words.",
    tapToBegin: "Tap to begin",
    startButton: "START",
    lastSessionLabel: "LAST SESSION",
    firstSessionBadge: "FIRST SESSION",
    noChangeBadge: "No Change",
    improvementBadge: (percent: number) => `+${percent}% Improvement`,
    declineBadge: (percent: number) => `${percent}% vs Last Time`,

    // Active recording
    recordingTime: "RECORDING TIME",
    tapToStop: "TAP TO STOP",
    hardLimitNote: (minutes: number) => `Auto-stops after ${minutes} minutes.`,
    milestoneRecommended: "RECOMMENDED LENGTH REACHED",
    milestoneOneMinute: "1 MINUTE REACHED",
    micPermissionTitle: "Microphone permission needed",
    micPermissionMessage: "Please allow microphone access in Settings and try again.",
    confirm: "OK",
    noRecordingTitle: "No recording found",
    noRecordingMessage: "Couldn't find the recorded audio. Please try again.",
    uploadFailedTitle: "Upload failed",
    uploadFailedMessage: "Please check your network connection and try again.",
    uploadingText: "Uploading...",

    // Analysis loading
    analyzingTitle: "Analyzing your speech",
    analyzingSubtitle: "Our AI is processing your tone and delivery.",
    stepExtracting: "Extracting audio...",
    stepGemini: "Gemini AI Analysis...",
    stepReport: "Generating report...",
    speakerProTipLabel: "SPEAKER'S PRO TIP",
    speakerProTip: "A steady pace builds trust. Rushing can signal anxiety to your interviewer.",
    analysisFailedTitle: "Analysis failed",

    // Feedback screen
    globalScore: "GLOBAL SCORE",
    viewDetails: "VIEW DETAILS",
    hideDetails: "HIDE DETAILS",
    practiceAgain: "Practice Again",
    pace: "PACE",
    energy: "ENERGY",
    fillerWords: "FILLER WORDS",
    contentLogic: "CONTENT LOGIC",
    energyLegend: "Speech Energy Analysis (Red: High / Blue: Low)",
    noSentenceData: "No sentence-level analysis available.",
    resultLoadError: "Failed to load result.",
    goHome: "Home",

    // History
    historyTitle: "History",
    historyEmpty: "No recordings yet.",
    historyProcessing: "Analyzing...",
    historyFailed: "Analysis failed or no data",

    // Onboarding — Step 1: Name
    onboardStepOf: (step: number, total: number) => `Step ${step} of ${total}`,
    onboardNameTitle: "What's your name?",
    onboardNameSubtitle: "We'll use this to personalize your SpeechAi experience.",
    onboardNameLabel: "Full Name",
    onboardNamePlaceholder: "Enter your name",
    onboardIdentityTitle: "Identity Verified",
    onboardIdentityDescription: "Your name helps us tailor voice models to your specific patterns and tone.",
    next: "Next",
    back: "Back",

    // Onboarding — Step 0: Language
    onboardLanguageTitle: "Choose your language",
    onboardLanguageSubtitle: "Select your preferred language to get started with SpeechAi's AI voice processing.",

    // Onboarding — Step 2: Purpose
    onboardPurposeTitle: "What brings you to SpeechAi?",
    onboardPurposeSubtitle: "We'll tailor your experience based on your communication goals.",
    getStarted: "Get Started",
    onboardFooterNote: "You can change this anytime in Settings.",

    // Purpose options (shared by onboarding + Settings)
    purposeStudentTitle: "Student",
    purposeStudentDescription: "Class presentations and debates",
    purposeJobInterviewTitle: "Job Interview Prep",
    purposeJobInterviewDescription: "Land your dream role with confidence",
    purposeThesisTitle: "Thesis Defense",
    purposeThesisDescription: "Academic excellence and clarity",
    purposeGeneralTitle: "General Speaking",
    purposeGeneralDescription: "Everyday conversation and fluency",

    // Settings
    settingsTitle: "Settings",
    settingsNameLabel: "Full Name",
    settingsLanguageLabel: "Language",
    settingsPurposeLabel: "Practice Focus",
    save: "Save",
    saved: "Saved",
  },
  ko: {
    tabHome: "홈",
    tabHistory: "기록",
    tabSettings: "설정",

    homeGreeting: (name: string) => (name ? `안녕하세요, ${name}님` : "안녕하세요"),
    homeSubtitle: "오늘도 발표 연습을 시작해볼까요?",
    homeEmptySession: "아직 분석된 녹음이 없어요. 첫 녹음을 시작해보세요!",
    todaysGoalLabel: "오늘의 목표",
    todaysGoalMessage: "1~2분 분량의 녹음을 목표로 해보세요. 높은 에너지를 유지하고 추임새를 줄이는 데 집중하세요.",
    tapToBegin: "탭하여 시작",
    startButton: "시작",
    lastSessionLabel: "최근 세션",
    firstSessionBadge: "첫 세션",
    noChangeBadge: "변화 없음",
    improvementBadge: (percent: number) => `+${percent}% 개선`,
    declineBadge: (percent: number) => `지난번보다 ${percent}%`,

    recordingTime: "녹음 시간",
    tapToStop: "탭하여 종료",
    hardLimitNote: (minutes: number) => `최대 ${minutes}분 도달 시 자동으로 종료됩니다.`,
    milestoneRecommended: "권장 길이 도달",
    milestoneOneMinute: "1분 경과",
    micPermissionTitle: "마이크 권한이 필요합니다",
    micPermissionMessage: "설정에서 마이크 접근을 허용한 뒤 다시 시도해주세요.",
    confirm: "확인",
    noRecordingTitle: "녹음 파일 없음",
    noRecordingMessage: "녹음된 오디오를 찾을 수 없습니다. 다시 시도해주세요.",
    uploadFailedTitle: "업로드 실패",
    uploadFailedMessage: "네트워크 상태를 확인하고 다시 시도해주세요.",
    uploadingText: "업로드 중...",

    analyzingTitle: "스피치 분석 중",
    analyzingSubtitle: "AI가 톤과 전달력을 분석하고 있어요.",
    stepExtracting: "오디오 추출 중...",
    stepGemini: "Gemini AI 분석 중...",
    stepReport: "리포트 생성 중...",
    speakerProTipLabel: "스피커 프로 팁",
    speakerProTip: "일정한 속도는 신뢰감을 줍니다. 서두르면 긴장한 것처럼 보일 수 있어요.",
    analysisFailedTitle: "분석에 실패했습니다",

    globalScore: "종합 점수",
    viewDetails: "상세보기",
    hideDetails: "숨기기",
    practiceAgain: "다시 연습하기",
    pace: "속도",
    energy: "에너지",
    fillerWords: "추임새",
    contentLogic: "내용 논리",
    energyLegend: "발화 에너지 분석 (빨강: 높음 / 파랑: 낮음)",
    noSentenceData: "문장 단위 분석 데이터가 없습니다.",
    resultLoadError: "결과를 불러오지 못했습니다.",
    goHome: "홈으로",

    historyTitle: "기록",
    historyEmpty: "아직 녹음 기록이 없어요.",
    historyProcessing: "분석 중...",
    historyFailed: "분석 실패 또는 데이터 없음",

    onboardStepOf: (step: number, total: number) => `${step} / ${total} 단계`,
    onboardNameTitle: "이름이 어떻게 되세요?",
    onboardNameSubtitle: "SpeechAi 경험을 개인화하는 데 사용됩니다.",
    onboardNameLabel: "이름",
    onboardNamePlaceholder: "이름을 입력하세요",
    onboardIdentityTitle: "본인 확인",
    onboardIdentityDescription: "이름은 사용자의 말하기 패턴과 톤에 맞춰 음성 모델을 조정하는 데 사용됩니다.",
    next: "다음",
    back: "뒤로",

    onboardLanguageTitle: "언어를 선택하세요",
    onboardLanguageSubtitle: "SpeechAi의 AI 음성 분석을 시작하기 위해 선호하는 언어를 선택해주세요.",

    onboardPurposeTitle: "SpeechAi를 어떤 목적으로 사용하시나요?",
    onboardPurposeSubtitle: "말하기 목표에 맞춰 경험을 맞춤화해드릴게요.",
    getStarted: "시작하기",
    onboardFooterNote: "설정에서 언제든지 변경할 수 있어요.",

    purposeStudentTitle: "학생",
    purposeStudentDescription: "수업 발표 및 토론",
    purposeJobInterviewTitle: "취업 면접 준비",
    purposeJobInterviewDescription: "자신감 있게 원하는 직무에 도전하기",
    purposeThesisTitle: "논문 심사",
    purposeThesisDescription: "학술적 완성도와 명료함",
    purposeGeneralTitle: "일상 스피치",
    purposeGeneralDescription: "일상 대화와 유창함",

    settingsTitle: "설정",
    settingsNameLabel: "이름",
    settingsLanguageLabel: "언어",
    settingsPurposeLabel: "연습 목적",
    save: "저장",
    saved: "저장됨",
  },
} as const;

export function useStrings() {
  const language = useLanguageStore((s) => s.language);
  return STRINGS[language];
}

// Non-hook accessor for call sites outside components (e.g. inside a
// callback that fires after the component may have unmounted).
export function getStrings() {
  return STRINGS[useLanguageStore.getState().language];
}
