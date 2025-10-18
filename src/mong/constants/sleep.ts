/**
 * 수면 관련 상수 정의
 */

// 수면 점수 임계값
export const SLEEP_SCORE_THRESHOLDS = {
  EXCELLENT: 85,
  GOOD: 70,
  POOR: 50
} as const;

// 수면 단계별 색상
export const SLEEP_STAGE_COLORS = {
  DEEP: '#2b7fff',
  LIGHT: '#00c950',
  REM: '#f0b100',
  AWAKE: '#fb2c36',
  AWAKE_LIGHT: '#ff6b6b'
} as const;

// 뇌파 레벨 색상 매핑
export const BRAINWAVE_LEVEL_COLORS = {
  A: '#2b7fff', // 깊은 수면 - 파란색
  B: '#00c950', // 얕은 수면 - 초록색
  C: '#f0b100', // 얕은 수면 - 노란색
  D: '#fb2c36', // 각성 - 빨간색
  E: '#ff6b6b'  // 각성 - 밝은 빨간색
} as const;

// 뇌파 레벨 → 숫자 매핑
export const BRAINWAVE_LEVEL_MAP = {
  A: 0,
  B: 1,
  C: 2,
  D: 3,
  E: 4
} as const;

// 뇌파 레벨 → 수면 단계 설명
export const BRAINWAVE_LEVEL_DESCRIPTIONS = {
  A: '깊은 수면',
  B: '얕은 수면',
  C: '얕은 수면',
  D: '각성',
  E: '각성'
} as const;

// 요일 한글
export const WEEKDAYS_KR = ['일', '월', '화', '수', '목', '금', '토'] as const;

// 요일 영문
export const WEEKDAYS_EN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;

// 수면 시간 권장값
export const RECOMMENDED_SLEEP = {
  MIN_HOURS: 7,
  MAX_HOURS: 9,
  IDEAL_MIN: 7,
  IDEAL_MAX: 8
} as const;

// 수면 효율 권장값
export const RECOMMENDED_EFFICIENCY = {
  EXCELLENT: 90,
  GOOD: 85,
  FAIR: 80
} as const;

// 수면 단계 이상적 비율 (%)
export const IDEAL_SLEEP_RATIOS = {
  DEEP: { MIN: 20, MAX: 30 },
  LIGHT: { MIN: 45, MAX: 55 },
  REM: { MIN: 15, MAX: 25 }
} as const;

// 차트 설정
export const CHART_CONFIG = {
  BRAINWAVE_HEIGHT: 350,
  BAR_CHART_HEIGHT: 200,
  LINE_CHART_HEIGHT: 200,
  MARGIN: { top: 20, right: 30, left: 20, bottom: 5 },
  GRID_STROKE: '#2a2a2a',
  AXIS_COLOR: '#a1a1aa'
} as const;

// 뇌파 데이터 생성 설정
export const BRAINWAVE_GENERATION = {
  INTERVAL_MINUTES: 5, // 5분 간격
  AWAKE_PROBABILITY: 0.05 // 각성 발생 확률 5%
} as const;

// 소음 이벤트 확률
export const NOISE_EVENT_PROBABILITIES = {
  SNORING: 0.4,        // 코골이 40%
  AIR_CONDITIONER: 0.3, // 에어컨 30%
  EXTERNAL: 0.2,       // 외부 소음 20%
  BIRD: 0.15           // 새소리 15%
} as const;

// 소음 아이콘 매핑
export const NOISE_ICONS = {
  SNORING: 'user',
  AIR_CONDITIONER: 'air-vent',
  EXTERNAL: 'car',
  BIRD: 'bird'
} as const;

// 캘린더 설정
export const CALENDAR_CONFIG = {
  INDICATOR_GOOD: '#00d4aa',
  INDICATOR_NORMAL: '#f0b100',
  SELECTED_RING_COLOR: '#00d4aa'
} as const;

// 권장사항 난이도
export const RECOMMENDATION_DIFFICULTY = {
  EASY: 'easy',
  NORMAL: 'normal',
  HARD: 'hard'
} as const;

// 권장사항 효과
export const RECOMMENDATION_EFFECT = {
  HIGH: 'high-effect',
  NORMAL: 'normal-effect',
  LOW: 'low-effect'
} as const;

// 개발 환경 설정
export const DEV_CONFIG = {
  ENABLE_CONSOLE_TOOLS: import.meta.env.DEV,
  SHOW_VALIDATION_WARNINGS: import.meta.env.DEV
} as const;

