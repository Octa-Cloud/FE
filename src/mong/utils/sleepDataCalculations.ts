/**
 * 수면 데이터 계산 및 검증 유틸리티
 * 데이터 일관성을 보장하고 자동 계산을 수행합니다.
 */

import { BrainwavePoint, SleepStages, SleepRatios, BrainwaveAnalysis, NoiseEvent } from '../types/sleepData';

/**
 * 시간 포맷팅 유틸리티
 */
export const formatTimeFromHours = (hours: number): string => {
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  return `${h}시간 ${m}분`;
};

export const parseTimeString = (timeStr: string): number => {
  // "7시간 30분" 형식 파싱
  const hourMatch = timeStr.match(/(\d+)시간/);
  const minuteMatch = timeStr.match(/(\d+)분/);
  
  const hours = hourMatch ? parseInt(hourMatch[1]) : 0;
  const minutes = minuteMatch ? parseInt(minuteMatch[1]) : 0;
  
  return hours + minutes / 60;
};

export const parseClockTime = (timeStr: string): { hours: number; minutes: number } => {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return { hours, minutes };
};

export const formatClockTime = (hours: number, minutes: number): string => {
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

/**
 * 수면 단계 계산 (뇌파 레벨 기반)
 * A, D = 깊은 수면 (Deep Sleep)
 * B, C = 얕은 수면 (Light Sleep)  
 * REM은 별도 패턴으로 판단
 */
export const mapBrainwaveLevelToSleepStage = (
  level: 'A' | 'B' | 'C' | 'D' | 'E',
  progress: number // 0-1 사이의 수면 진행도
): 'deep' | 'light' | 'rem' | 'awake' => {
  if (level === 'E') return 'awake';
  
  // REM 수면은 주로 수면 후반부(70% 이후)에 발생하며 C, D 레벨
  if (progress > 0.7 && (level === 'C' || level === 'D')) {
    return Math.random() > 0.6 ? 'rem' : 'light';
  }
  
  // 깊은 수면: A, D 레벨
  if (level === 'A' || level === 'D') return 'deep';
  
  // 얕은 수면: B, C 레벨
  return 'light';
};

/**
 * 뇌파 데이터로부터 수면 단계 비율 자동 계산
 */
export const calculateSleepRatiosFromBrainwave = (
  brainwaveData: BrainwavePoint[],
  totalIntervals: number
): SleepRatios => {
  const stageCounts = {
    deep: 0,
    light: 0,
    rem: 0,
    awake: 0
  };
  
  brainwaveData.forEach((point, index) => {
    const progress = index / brainwaveData.length;
    const stage = mapBrainwaveLevelToSleepStage(point.level, progress);
    stageCounts[stage]++;
  });
  
  const total = brainwaveData.length;
  
  return {
    deep: Math.round((stageCounts.deep / total) * 100),
    light: Math.round((stageCounts.light / total) * 100),
    rem: Math.round((stageCounts.rem / total) * 100)
  };
};

/**
 * 수면 단계별 시간 계산
 */
export const calculateSleepStages = (
  sleepTimeHours: number,
  ratios: SleepRatios
): SleepStages => {
  const deepHours = (sleepTimeHours * ratios.deep) / 100;
  const lightHours = (sleepTimeHours * ratios.light) / 100;
  const remHours = (sleepTimeHours * ratios.rem) / 100;
  
  return {
    deep: formatTimeFromHours(deepHours),
    light: formatTimeFromHours(lightHours),
    rem: formatTimeFromHours(remHours)
  };
};

/**
 * 뇌파 분석 데이터 자동 생성
 */
export const generateBrainwaveAnalysis = (
  brainwaveData: BrainwavePoint[],
  sleepTime: string,
  totalIntervals: number
): BrainwaveAnalysis => {
  const stageCounts = {
    deep: 0,
    light: 0,
    rem: 0,
    awake: 0
  };
  
  brainwaveData.forEach((point, index) => {
    const progress = index / brainwaveData.length;
    const stage = mapBrainwaveLevelToSleepStage(point.level, progress);
    stageCounts[stage]++;
  });
  
  const totalPoints = brainwaveData.length;
  
  // 평균 뇌파 레벨 계산
  const levelScores = { 'A': 4, 'B': 3, 'C': 2, 'D': 1, 'E': 0 };
  const avgScore = brainwaveData.reduce((sum, point) => sum + levelScores[point.level], 0) / totalPoints;
  const avgLevel = avgScore >= 3.5 ? 'A' : avgScore >= 2.5 ? 'B' : avgScore >= 1.5 ? 'C' : avgScore >= 0.5 ? 'D' : 'E';
  
  return {
    totalDuration: sleepTime,
    averageLevel: avgLevel,
    deepSleepRatio: Math.round((stageCounts.deep / totalPoints) * 100),
    lightSleepRatio: Math.round((stageCounts.light / totalPoints) * 100),
    remSleepRatio: Math.round((stageCounts.rem / totalPoints) * 100),
    awakeRatio: Math.round((stageCounts.awake / totalPoints) * 100),
    dataPoints: brainwaveData
  };
};

/**
 * 수면 점수 계산
 * 여러 요소를 종합하여 0-100점 계산
 */
export const calculateSleepScore = (
  sleepTimeHours: number,
  sleepEfficiency: number,
  deepSleepRatio: number,
  remSleepRatio: number,
  awakeRatio: number,
  noiseEventCount: number
): number => {
  // 기본 점수 (50점)
  let score = 50;
  
  // 수면 시간 (최대 25점)
  // 7-8시간이 이상적
  if (sleepTimeHours >= 7 && sleepTimeHours <= 8) {
    score += 25;
  } else if (sleepTimeHours >= 6 && sleepTimeHours < 7) {
    score += 20;
  } else if (sleepTimeHours >= 5 && sleepTimeHours < 6) {
    score += 15;
  } else if (sleepTimeHours > 8 && sleepTimeHours <= 9) {
    score += 20;
  } else {
    score += 10;
  }
  
  // 수면 효율 (최대 15점)
  score += (sleepEfficiency / 100) * 15;
  
  // 깊은 수면 비율 (최대 20점)
  // 20-30%가 이상적
  if (deepSleepRatio >= 20 && deepSleepRatio <= 30) {
    score += 20;
  } else if (deepSleepRatio >= 15 && deepSleepRatio < 20) {
    score += 15;
  } else if (deepSleepRatio > 30 && deepSleepRatio <= 35) {
    score += 15;
  } else {
    score += 10;
  }
  
  // REM 수면 비율 (최대 15점)
  // 15-25%가 이상적
  if (remSleepRatio >= 15 && remSleepRatio <= 25) {
    score += 15;
  } else if (remSleepRatio >= 10 && remSleepRatio < 15) {
    score += 10;
  } else {
    score += 5;
  }
  
  // 각성 비율 감점 (최대 -10점)
  score -= awakeRatio * 2;
  
  // 소음 이벤트 감점 (최대 -5점)
  score -= Math.min(noiseEventCount * 1, 5);
  
  // 점수 범위 제한
  return Math.round(Math.max(0, Math.min(100, score)));
};

/**
 * 수면 효율 계산
 * (실제 수면 시간 / 침대에 누워있던 시간) * 100
 */
export const calculateSleepEfficiency = (
  sleepTimeHours: number,
  bedTime: string,
  wakeTime: string
): number => {
  const { hours: bedHour, minutes: bedMinute } = parseClockTime(bedTime);
  const { hours: wakeHour, minutes: wakeMinute } = parseClockTime(wakeTime);
  
  let totalTimeInBed = wakeHour + wakeMinute / 60 - (bedHour + bedMinute / 60);
  if (totalTimeInBed < 0) totalTimeInBed += 24;
  
  const efficiency = (sleepTimeHours / totalTimeInBed) * 100;
  return Math.round(Math.min(100, Math.max(0, efficiency)));
};

/**
 * 소음이 수면에 미치는 영향 계산
 */
export const calculateNoiseImpact = (noiseEvents: NoiseEvent[]): {
  totalDuration: number;
  avgIntensity: number;
  severeEventCount: number;
} => {
  if (noiseEvents.length === 0) {
    return { totalDuration: 0, avgIntensity: 0, severeEventCount: 0 };
  }
  
  const totalDuration = noiseEvents.reduce((sum, event) => sum + event.duration, 0);
  const avgIntensity = noiseEvents.reduce((sum, event) => sum + event.intensity, 0) / noiseEvents.length;
  const severeEventCount = noiseEvents.filter(event => event.intensity > 70).length;
  
  return {
    totalDuration: Math.round(totalDuration),
    avgIntensity: Math.round(avgIntensity),
    severeEventCount
  };
};

/**
 * 데이터 검증
 */
export const validateSleepData = (data: {
  sleepTimeHours: number;
  sleepRatios: SleepRatios;
  sleepScore: number;
}): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  // 수면 시간 검증
  if (data.sleepTimeHours < 0 || data.sleepTimeHours > 24) {
    errors.push('수면 시간이 유효하지 않습니다.');
  }
  
  // 비율 합계 검증
  const ratioSum = data.sleepRatios.deep + data.sleepRatios.light + data.sleepRatios.rem;
  if (Math.abs(ratioSum - 100) > 1) {
    errors.push(`수면 단계 비율의 합이 100%가 아닙니다. (현재: ${ratioSum}%)`);
  }
  
  // 수면 점수 검증
  if (data.sleepScore < 0 || data.sleepScore > 100) {
    errors.push('수면 점수가 유효 범위(0-100)를 벗어났습니다.');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * 개발 환경에서 사용할 수 있도록 전역 객체에 추가
 */
if (typeof window !== 'undefined' && import.meta.env.DEV) {
  (window as any).sleepCalculations = {
    formatTimeFromHours,
    parseTimeString,
    calculateSleepScore,
    calculateSleepEfficiency,
    calculateNoiseImpact,
    validateSleepData,
    mapBrainwaveLevelToSleepStage,
    generateBrainwaveAnalysis
  };
}

