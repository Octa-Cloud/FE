/**
 * 2025년 10월 수면 기록 테스트 데이터
 */

import { DailySleepRecord, UserSleepData, BrainwavePoint } from './types/sleepData';
import { additionalSleepData } from './DummyData';
import {
  formatTimeFromHours,
  calculateSleepStages,
  generateBrainwaveAnalysis,
  calculateSleepScore,
  calculateSleepEfficiency,
  validateSleepData,
  formatClockTime
} from './utils/sleepDataCalculations';

// 2025년 10월 한 달치 수면 데이터 생성 함수
const generateOctoberSleepData = (): DailySleepRecord[] => {
  const records: DailySleepRecord[] = [];
  
  // 10월 1일부터 31일까지
  for (let day = 1; day <= 31; day++) {
    const dateStr = `2025-10-${day.toString().padStart(2, '0')}`;
    
    // 다양한 수면 패턴 생성 (랜덤하지만 자연스러운 변화)
    const baseScore = 75 + Math.sin(day / 5) * 15 + (Math.random() - 0.5) * 10;
    const sleepScore = Math.round(Math.max(60, Math.min(95, baseScore)));
    
    const baseSleepHours = 7 + Math.sin(day / 7) * 1.5 + (Math.random() - 0.5) * 0.5;
    const sleepTimeHours = Math.max(5.5, Math.min(9, baseSleepHours));
    
    const sleepTime = formatTimeFromHours(sleepTimeHours);
    
    // 취침/기상 시간 (주말에는 늦게 자고 늦게 일어남)
    const dayOfWeek = new Date(dateStr).getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    
    const bedtimeHour = isWeekend ? 23 + Math.floor(Math.random() * 2) : 22 + Math.floor(Math.random() * 2);
    const bedtimeMinute = Math.floor(Math.random() * 60);
    const bedtime = formatClockTime(bedtimeHour, bedtimeMinute);
    
    const sleepMinutes = Math.round((sleepTimeHours - Math.floor(sleepTimeHours)) * 60);
    const wakeHour = Math.floor((bedtimeHour + sleepTimeHours) % 24);
    const wakeMinute = (bedtimeMinute + sleepMinutes) % 60;
    const wakeTime = formatClockTime(wakeHour, wakeMinute);
    
    // 뇌파 데이터 생성 (취침부터 기상까지 - 5분 간격)
    const brainwaveData: BrainwavePoint[] = [];
    let currentHour = bedtimeHour;
    let currentMinute = bedtimeMinute;
    
    // 5분 간격으로 뇌파 데이터 생성
    const totalMinutes = Math.floor(sleepTimeHours * 60);
    const intervals = Math.floor(totalMinutes / 5);
    
    for (let i = 0; i < intervals; i++) {
      const time = formatClockTime(currentHour, currentMinute);
      
      // 수면 단계별 뇌파 패턴 (자연스러운 수면 사이클)
      let level: 'A' | 'B' | 'C' | 'D' | 'E';
      let intensity: number;
      
      const progress = i / intervals; // 수면 진행도 (0-1)
      
      if (progress < 0.1 || progress > 0.9) {
        // 수면 초기/말기: 얕은 수면 (B, C)
        level = Math.random() > 0.3 ? 'B' : 'C';
        intensity = 30 + Math.random() * 40;
      } else if (progress >= 0.2 && progress <= 0.6) {
        // 수면 중기: 깊은 수면 (D, A)
        level = Math.random() > 0.2 ? 'D' : 'A';
        intensity = 60 + Math.random() * 30;
      } else if (Math.random() > 0.7) {
        // REM 수면 (C, D)
        level = Math.random() > 0.5 ? 'C' : 'D';
        intensity = 40 + Math.random() * 40;
      } else {
        // 일반적인 얕은 수면
        level = 'B';
        intensity = 35 + Math.random() * 35;
      }
      
      // 각성 상태 (E) - 가끔 발생
      if (Math.random() < 0.05) {
        level = 'E';
        intensity = 70 + Math.random() * 20;
      }
      
      brainwaveData.push({ time, level, intensity });
      
      // 다음 5분 계산
      currentMinute += 5;
      currentHour += Math.floor(currentMinute / 60);
      currentMinute = currentMinute % 60;
      currentHour = currentHour % 24;
    }
    
    // 뇌파 분석 데이터 자동 생성 (일관성 보장)
    const brainwaveAnalysis = generateBrainwaveAnalysis(brainwaveData, sleepTime, intervals);
    
    // 소음 이벤트 생성 (상세한 정보 포함)
    const noiseEvents = [];
    
    // 헬퍼 함수: 소음 시간 계산
    const generateNoiseTimestamp = (offsetMinutes: number) => {
      const totalOffset = bedtimeHour * 60 + bedtimeMinute + offsetMinutes;
      const hour = Math.floor(totalOffset / 60) % 24;
      const minute = totalOffset % 60;
      return formatClockTime(hour, minute);
    };
    
    // 코골이 (40% 확률)
    if (Math.random() > 0.6) {
      noiseEvents.push({
        type: '코골이',
        icon: 'user',
        timestamp: generateNoiseTimestamp(Math.floor(Math.random() * totalMinutes)),
        duration: 120 + Math.random() * 300,
        intensity: 60 + Math.random() * 30
      });
    }
    
    // 에어컨 소음 (30% 확률)
    if (Math.random() > 0.7) {
      noiseEvents.push({
        type: '에어컨 소음',
        icon: 'air-vent',
        timestamp: generateNoiseTimestamp(Math.floor(Math.random() * totalMinutes)),
        duration: 60 + Math.random() * 180,
        intensity: 40 + Math.random() * 25
      });
    }
    
    // 외부 소음 (20% 확률)
    if (Math.random() > 0.8) {
      noiseEvents.push({
        type: '외부 소음',
        icon: 'car',
        timestamp: generateNoiseTimestamp(Math.floor(Math.random() * totalMinutes)),
        duration: 30 + Math.random() * 120,
        intensity: 50 + Math.random() * 40
      });
    }
    
    // 새벽 새소리 (15% 확률, 수면 후반부)
    if (Math.random() > 0.85) {
      const lateNightOffset = Math.floor(0.8 * totalMinutes + Math.random() * 0.2 * totalMinutes);
      noiseEvents.push({
        type: '새벽 새소리',
        icon: 'bird',
        timestamp: generateNoiseTimestamp(lateNightOffset),
        duration: 60 + Math.random() * 240,
        intensity: 35 + Math.random() * 20
      });
    }
    
    // 수면 메모 (일부 날짜만)
    const memos = [
      '"오늘은 일찍 자서 개운했어요."',
      '"스트레스가 많아서 잠들기까지 오래 걸렸어요."',
      '"편안하게 잘 잤습니다."',
      '"중간에 깨서 다시 잠들기 힘들었어요."',
      '"운동 후 피곤해서 금방 잠들었어요."',
      '"걱정이 많아서 깊게 못 잔 것 같아요."',
      '"주말이라 여유롭게 잤습니다."',
      '"새벽에 소음 때문에 깼어요."'
    ];
    
    const sleepMemo = Math.random() > 0.5 ? memos[Math.floor(Math.random() * memos.length)] : undefined;
    
    // 수면 효율 자동 계산
    const sleepEfficiency = calculateSleepEfficiency(sleepTimeHours, bedtime, wakeTime);
    
    // 수면 단계 비율 (뇌파 분석 데이터와 동기화)
    const sleepRatios = {
      deep: brainwaveAnalysis.deepSleepRatio,
      light: brainwaveAnalysis.lightSleepRatio,
      rem: brainwaveAnalysis.remSleepRatio
    };
    
    // 수면 단계별 시간 자동 계산
    const sleepStages = calculateSleepStages(sleepTimeHours, sleepRatios);
    
    // 수면 점수 자동 계산 (여러 요소 종합)
    const calculatedScore = calculateSleepScore(
      sleepTimeHours,
      sleepEfficiency,
      brainwaveAnalysis.deepSleepRatio,
      brainwaveAnalysis.remSleepRatio,
      brainwaveAnalysis.awakeRatio,
      noiseEvents.length
    );
    
    // 레코드 생성
    const record = {
      date: dateStr,
      sleepScore: calculatedScore,
      sleepTime,
      sleepTimeHours,
      bedtime,
      wakeTime,
      sleepEfficiency,
      sleepStages,
      sleepRatios,
      brainwaveData,
      brainwaveAnalysis,
      noiseEvents,
      sleepMemo
    };
    
    // 데이터 검증
    const validation = validateSleepData({
      sleepTimeHours: record.sleepTimeHours,
      sleepRatios: record.sleepRatios,
      sleepScore: record.sleepScore
    });
    
    if (!validation.isValid && import.meta.env.DEV) {
      console.warn(`날짜 ${dateStr} 데이터 검증 오류:`, validation.errors);
    }
    
    records.push(record);
  }
  
  return records;
};

// 테스트 사용자별 수면 데이터
export const testSleepData: UserSleepData[] = [
  {
    userId: 'test-user-001', // 추민기
    records: generateOctoberSleepData()
  },
  {
    userId: 'test-user-002', // 김수면
    records: generateOctoberSleepData()
  },
  {
    userId: 'test-user-003', // 박불면
    records: generateOctoberSleepData()
  },
  ...additionalSleepData
];

// 특정 날짜의 수면 기록 가져오기
export const getSleepRecordByDate = (userId: string, date: string): DailySleepRecord | null => {
  // localStorage에서 수면 데이터 가져오기
  const storedSleepData = JSON.parse(localStorage.getItem('sleepData') || '[]');
  const userData = storedSleepData.find((data: UserSleepData) => data.userId === userId);
  
  if (userData) {
    const record = userData.records.find((r: DailySleepRecord) => r.date === date);
    return record || null;
  }
  
  // localStorage에 데이터가 없으면 기본 더미 사용자로 폴백
  const fallbackData = testSleepData.find(data => data.userId === userId) || testSleepData[0];
  const record = fallbackData.records.find(r => r.date === date);
  return record || null;
};

// 특정 기간의 수면 기록 가져오기
export const getSleepRecordsByDateRange = (
  userId: string,
  startDate: string,
  endDate: string
): DailySleepRecord[] => {
  const userData = testSleepData.find(data => data.userId === userId) || testSleepData[0];
  return userData.records.filter(r => r.date >= startDate && r.date <= endDate);
};

// 특정 월의 수면 기록 가져오기
export const getSleepRecordsByMonth = (
  userId: string,
  year: number,
  month: number
): DailySleepRecord[] => {
  // localStorage에서 수면 데이터 가져오기
  const storedSleepData = JSON.parse(localStorage.getItem('sleepData') || '[]');
  const userData = storedSleepData.find((data: UserSleepData) => data.userId === userId);
  
  if (userData) {
    const monthStr = month.toString().padStart(2, '0');
    return userData.records.filter((r: DailySleepRecord) => r.date.startsWith(`${year}-${monthStr}`));
  }
  
  // localStorage에 데이터가 없으면 기본 더미 사용자로 폴백
  const fallbackData = testSleepData.find(data => data.userId === userId) || testSleepData[0];
  const monthStr = month.toString().padStart(2, '0');
  return fallbackData.records.filter(r => r.date.startsWith(`${year}-${monthStr}`));
};

// 수면 점수 상태 가져오기 (캘린더 표시용)
export const getSleepStatus = (sleepScore: number): 'good' | 'normal' | null => {
  if (sleepScore >= 85) return 'good';
  if (sleepScore >= 70) return 'normal';
  return null;
};

// 개발 환경에서만 사용할 수 있도록 전역 객체에 추가
if (typeof window !== 'undefined' && import.meta.env.DEV) {
  (window as any).sleepData = {
    all: testSleepData,
    getByDate: getSleepRecordByDate,
    getByDateRange: getSleepRecordsByDateRange,
    getByMonth: getSleepRecordsByMonth,
    getStatus: getSleepStatus
  };
}

