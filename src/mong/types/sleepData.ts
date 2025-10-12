/**
 * 수면 기록 데이터 타입 정의
 */

// 수면 단계별 시간
export interface SleepStages {
  deep: string;      // 깊은 수면 (예: "2시간 15분")
  light: string;     // 얕은 수면 (예: "3시간 45분")
  rem: string;       // REM 수면 (예: "1시간 30분")
}

// 수면 단계별 비율
export interface SleepRatios {
  deep: number;      // 깊은 수면 비율 (%)
  light: number;     // 얕은 수면 비율 (%)
  rem: number;       // REM 수면 비율 (%)
}

// 뇌파 데이터 포인트
export interface BrainwavePoint {
  time: string;      // 시간 (예: "23:15")
  level: 'A' | 'B' | 'C' | 'D' | 'E';  // 뇌파 등급
}

// 소음 이벤트
export interface NoiseEvent {
  type: string;      // 소음 유형 (예: "코골이", "에어컨 소음")
  icon: string;      // 아이콘 식별자
}

// 일별 수면 기록
export interface DailySleepRecord {
  date: string;                    // 날짜 (YYYY-MM-DD)
  sleepScore: number;              // 수면 점수 (0-100)
  sleepTime: string;               // 총 수면 시간 (예: "7시간 30분")
  sleepTimeHours: number;          // 총 수면 시간 (시간 단위)
  bedtime: string;                 // 취침 시간 (HH:mm)
  wakeTime: string;                // 기상 시간 (HH:mm)
  sleepEfficiency: number;         // 수면 효율 (%)
  sleepStages: SleepStages;        // 수면 단계별 시간
  sleepRatios: SleepRatios;        // 수면 단계별 비율
  brainwaveData: BrainwavePoint[]; // 뇌파 데이터
  noiseEvents: NoiseEvent[];       // 소음 이벤트
  sleepMemo?: string;              // 수면 메모 (선택)
}

// 사용자별 수면 데이터
export interface UserSleepData {
  userId: string;
  records: DailySleepRecord[];
}

