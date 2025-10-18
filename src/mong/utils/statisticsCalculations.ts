/**
 * 수면 통계 계산 유틸리티 함수들
 */

import { DailySleepRecord } from '../types/sleepData';

// 날짜 관련 유틸리티
export const getWeekDates = (date: Date): Date[] => {
  const weekDates: Date[] = [];
  const dayOfWeek = date.getDay(); // 0=일요일, 1=월요일, ..., 6=토요일
  
  // 한국식 주간: 월요일을 주의 시작으로 설정
  // 일요일(0)이면 -6, 월요일(1)이면 0, 화요일(2)이면 -1, ...
  const daysFromMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  
  const startOfWeek = new Date(date);
  startOfWeek.setDate(date.getDate() - dayOfWeek);
  
  for (let i = 0; i < 7; i++) {
    const weekDate = new Date(startOfWeek);
    weekDate.setDate(startOfWeek.getDate() + i);
    weekDates.push(weekDate);
  }
  
  return weekDates;
};

export const getWeekNumber = (date: Date): number => {
  const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const dayOfMonth = date.getDate();
  const startDayOfWeek = startOfMonth.getDay();
  
  return Math.ceil((dayOfMonth + startDayOfWeek) / 7);
};

export const getMonthWeeks = (year: number, month: number): { week: number; startDate: Date; endDate: Date }[] => {
  const weeks: { week: number; startDate: Date; endDate: Date }[] = [];
  const firstDay = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 0);
  
  let currentWeek = 1;
  let currentDate = new Date(firstDay);
  
  while (currentDate <= lastDay) {
    const weekStart = new Date(currentDate);
    const weekEnd = new Date(currentDate);
    weekEnd.setDate(currentDate.getDate() + 6);
    
    // 월을 넘어가지 않도록 조정
    if (weekEnd > lastDay) {
      weekEnd.setTime(lastDay.getTime());
    }
    
    weeks.push({
      week: currentWeek,
      startDate: weekStart,
      endDate: weekEnd
    });
    
    currentDate.setDate(currentDate.getDate() + 7);
    currentWeek++;
  }
  
  return weeks;
};

// 기본 통계 계산
export const calculateAverage = (values: number[]): number => {
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
};

export const calculateMedian = (values: number[]): number => {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  
  if (sorted.length % 2 === 0) {
    return (sorted[middle - 1] + sorted[middle]) / 2;
  } else {
    return sorted[middle];
  }
};

// 시간 관련 계산
export const parseTime = (timeStr: string): number => {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours + minutes / 60;
};

export const formatTime = (hours: number): string => {
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  return `${h}:${m.toString().padStart(2, '0')}`;
};

export const calculateTimeDifference = (time1: string, time2: string): number => {
  const t1 = parseTime(time1);
  const t2 = parseTime(time2);
  
  let diff = t2 - t1;
  if (diff < 0) diff += 24; // 다음날로 넘어가는 경우
  
  return diff;
};

// 수면 데이터 분석
export const analyzeSleepRecords = (records: DailySleepRecord[]) => {
  if (records.length === 0) {
    return {
      avgScore: 0,
      avgHours: 0,
      avgBedtime: '00:00',
      avgWakeTime: '00:00',
      avgEfficiency: 0,
      deepSleepRatio: 0,
      lightSleepRatio: 0,
      remSleepRatio: 0,
      totalRecords: 0,
      goodSleepDays: 0,
      normalSleepDays: 0,
      poorSleepDays: 0
    };
  }

  const scores = records.map(r => r.sleepScore);
  const hours = records.map(r => r.sleepTimeHours);
  const bedtimes = records.map(r => parseTime(r.bedtime));
  const wakeTimes = records.map(r => parseTime(r.wakeTime));
  const efficiencies = records.map(r => r.sleepEfficiency);
  
  const deepSleepRatios = records.map(r => r.sleepRatios.deep);
  const lightSleepRatios = records.map(r => r.sleepRatios.light);
  const remSleepRatios = records.map(r => r.sleepRatios.rem);

  // 평균 취침/기상 시간 계산 (24시간 넘어가는 경우 고려)
  const avgBedtime = formatTime(calculateAverage(bedtimes));
  const avgWakeTime = formatTime(calculateAverage(wakeTimes));

  // 수면 품질 분류
  const goodSleepDays = records.filter(r => r.sleepScore >= 85).length;
  const normalSleepDays = records.filter(r => r.sleepScore >= 70 && r.sleepScore < 85).length;
  const poorSleepDays = records.filter(r => r.sleepScore < 70).length;

  return {
    avgScore: Math.round(calculateAverage(scores)),
    avgHours: Math.round(calculateAverage(hours) * 10) / 10,
    avgBedtime,
    avgWakeTime,
    avgEfficiency: Math.round(calculateAverage(efficiencies)),
    deepSleepRatio: Math.round(calculateAverage(deepSleepRatios)),
    lightSleepRatio: Math.round(calculateAverage(lightSleepRatios)),
    remSleepRatio: Math.round(calculateAverage(remSleepRatios)),
    totalRecords: records.length,
    goodSleepDays,
    normalSleepDays,
    poorSleepDays
  };
};

// 주간 데이터 분석
export const analyzeWeeklyData = (records: DailySleepRecord[], startDate: Date) => {
  const weekDates = getWeekDates(startDate);
  
  const weekData = weekDates.map(date => {
    const dateStr = date.toISOString().split('T')[0];
    return records.find(r => r.date === dateStr);
  });

  const sleepTimeChart = weekDates.map((date, index) => ({
    day: ['일', '월', '화', '수', '목', '금', '토'][date.getDay()], // 일요일부터 시작
    hours: weekData[index]?.sleepTimeHours || 0
  }));

  const sleepScoreChart = weekDates.map((date, index) => ({
    day: ['일', '월', '화', '수', '목', '금', '토'][date.getDay()], // 일요일부터 시작
    score: weekData[index]?.sleepScore || 0
  }));

  const validRecords = weekData.filter(Boolean) as DailySleepRecord[];
  const analysis = analyzeSleepRecords(validRecords);

  return {
    period: `이번 주 ${weekDates[0].getMonth() + 1}/${weekDates[0].getDate()} - ${weekDates[6].getMonth() + 1}/${weekDates[6].getDate()}`,
    sleepTimeChart,
    sleepScoreChart,
    summary: {
      avgScore: analysis.avgScore,
      avgHours: analysis.avgHours,
      avgBedtime: analysis.avgBedtime,
      scoreChange: '+0점', // TODO: 이전 주와 비교
      hoursStatus: analysis.avgHours >= 7 ? '목표 달성' : '목표 미달',
      bedtimeStatus: '목표 달성' // TODO: 목표 시간과 비교
    },
    patterns: {
      deepSleep: `${analysis.deepSleepRatio}%`,
      lightSleep: `${analysis.lightSleepRatio}%`,
      remSleep: `${analysis.remSleepRatio}%`,
      avgBedtime: analysis.avgBedtime
    },
    analysis: generateWeeklyAnalysis(analysis, validRecords),
    goals: generateWeeklyGoals(analysis)
  };
};

// 월간 데이터 분석
export const analyzeMonthlyData = (records: DailySleepRecord[], year: number, month: number) => {
  const monthRecords = records.filter(r => {
    const recordDate = new Date(r.date);
    return recordDate.getFullYear() === year && recordDate.getMonth() + 1 === month;
  });

  // 월간 일별 데이터 생성 (한 달 전체 날짜)
  const daysInMonth = new Date(year, month, 0).getDate();
  const monthlyDailyChart = [];
  
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    const dayRecord = monthRecords.find(r => r.date === dateStr);
    
    monthlyDailyChart.push({
      date: `${day}일`,
      hours: dayRecord?.sleepTimeHours || 0,
      score: dayRecord ? dayRecord.sleepScore : 0
    });
  }

  // 주차별 평균 데이터도 유지 (요약용)
  const weeks = getMonthWeeks(year, month);
  const weeklyAvgChart = weeks.map(week => {
    const weekRecords = monthRecords.filter(r => {
      const recordDate = new Date(r.date);
      return recordDate >= week.startDate && recordDate <= week.endDate;
    });

    if (weekRecords.length === 0) {
      return {
        week: `${week.week}주차`,
        hours: 0,
        score: 0
      };
    }

    const avgHours = calculateAverage(weekRecords.map(r => r.sleepTimeHours));
    const avgScore = calculateAverage(weekRecords.map(r => r.sleepScore));

    return {
      week: `${week.week}주차`,
      hours: Math.round(avgHours * 10) / 10, // 소수점 1자리
      score: Math.round(avgScore)
    };
  });

  const analysis = analyzeSleepRecords(monthRecords);

  return {
    period: `${year}년 ${month}월`,
    monthlyDailyChart,
    weeklyAvgChart,
    summary: {
      avgScore: analysis.avgScore,
      avgHours: analysis.avgHours,
      avgBedtime: analysis.avgBedtime,
      scoreChange: '+0점', // TODO: 이전 달과 비교
      hoursStatus: analysis.avgHours >= 7 ? '목표 달성' : '목표 미달',
      bedtimeStatus: '목표 달성' // TODO: 목표 시간과 비교
    },
    patterns: {
      deepSleep: `${analysis.deepSleepRatio}%`,
      lightSleep: `${analysis.lightSleepRatio}%`,
      remSleep: `${analysis.remSleepRatio}%`,
      avgBedtime: analysis.avgBedtime
    },
    analysis: generateMonthlyAnalysis(analysis, monthRecords),
    goals: generateMonthlyGoals(analysis)
  };
};

// 주간 분석 생성
const generateWeeklyAnalysis = (analysis: any, records: DailySleepRecord[]) => {
  const analyses = [];

  if (analysis.avgScore >= 85) {
    analyses.push({
      type: 'improvement',
      title: '우수한 수면 점수',
      description: '이번 주 평균 수면 점수가 매우 우수합니다. 현재 패턴을 유지하세요.'
    });
  } else if (analysis.avgScore < 70) {
    analyses.push({
      type: 'warning',
      title: '수면 점수 개선 필요',
      description: '이번 주 평균 수면 점수가 낮습니다. 수면 환경을 개선해보세요.'
    });
  }

  if (analysis.avgHours >= 8) {
    analyses.push({
      type: 'improvement',
      title: '충분한 수면 시간',
      description: '이번 주 평균 수면 시간이 충분합니다.'
    });
  } else if (analysis.avgHours < 7) {
    analyses.push({
      type: 'warning',
      title: '수면 시간 부족',
      description: '이번 주 평균 수면 시간이 부족합니다. 취침 시간을 앞당겨보세요.'
    });
  }

  // 취침 시간 일관성 분석
  const bedtimes = records.map(r => parseTime(r.bedtime));
  const bedtimeVariance = calculateVariance(bedtimes);
  if (bedtimeVariance < 1) {
    analyses.push({
      type: 'improvement',
      title: '취침 시간 일관성 우수',
      description: '이번 주 취침 시간이 매우 일관적입니다.'
    });
  }

  if (analyses.length === 0) {
    analyses.push({
      type: 'analysis',
      title: '안정적인 수면 패턴',
      description: '이번 주 수면 패턴이 안정적입니다.'
    });
  }

  return analyses;
};

// 월간 분석 생성
const generateMonthlyAnalysis = (analysis: any, records: DailySleepRecord[]) => {
  const analyses = [];

  if (analysis.avgScore >= 80) {
    analyses.push({
      type: 'improvement',
      title: '월간 수면 점수 우수',
      description: '이번 달 평균 수면 점수가 우수합니다.'
    });
  }

  // 주차별 변화 분석
  const weeks = getMonthWeeks(new Date().getFullYear(), new Date().getMonth() + 1);
  const weeklyScores = weeks.map(week => {
    const weekRecords = records.filter(r => {
      const recordDate = new Date(r.date);
      return recordDate >= week.startDate && recordDate <= week.endDate;
    });
    return weekRecords.length > 0 ? calculateAverage(weekRecords.map(r => r.sleepScore)) : 0;
  });

  const hasImprovement = weeklyScores.some((score, index) => 
    index > 0 && score > weeklyScores[index - 1]
  );

  if (hasImprovement) {
    analyses.push({
      type: 'improvement',
      title: '수면 품질 개선 추세',
      description: '이번 달 동안 수면 품질이 개선되고 있습니다.'
    });
  }

  analyses.push({
    type: 'analysis',
    title: '다음 달 목표',
    description: '현재 패턴을 유지하면서 수면 환경을 더욱 개선해보세요.'
  });

  return analyses;
};

// 목표 생성
const generateWeeklyGoals = (analysis: any) => [
  { 
    name: '수면 시간 목표 (8시간)', 
    progress: Math.min(100, Math.round((analysis.avgHours / 8) * 100)), 
    color: 'primary' 
  },
  { 
    name: '수면 점수 목표 (90점)', 
    progress: Math.min(100, Math.round((analysis.avgScore / 90) * 100)), 
    color: 'blue' 
  },
  { 
    name: '수면 효율 목표 (85%)', 
    progress: Math.min(100, Math.round((analysis.avgEfficiency / 85) * 100)), 
    color: 'green' 
  }
];

const generateMonthlyGoals = (analysis: any) => [
  { 
    name: '월간 수면 시간 목표 (8시간)', 
    progress: Math.min(100, Math.round((analysis.avgHours / 8) * 100)), 
    color: 'primary' 
  },
  { 
    name: '월간 수면 점수 목표 (85점)', 
    progress: Math.min(100, Math.round((analysis.avgScore / 85) * 100)), 
    color: 'blue' 
  },
  { 
    name: '수면 기록 일관성', 
    progress: Math.min(100, Math.round((analysis.totalRecords / 31) * 100)), 
    color: 'green' 
  }
];

// 분산 계산
const calculateVariance = (values: number[]): number => {
  if (values.length === 0) return 0;
  const mean = calculateAverage(values);
  const squaredDiffs = values.map(value => Math.pow(value - mean, 2));
  return calculateAverage(squaredDiffs);
};

// 개발 환경에서만 사용할 수 있도록 전역 객체에 추가
if (typeof window !== 'undefined' && import.meta.env.DEV) {
  (window as any).statisticsUtils = {
    calculateAverage,
    calculateMedian,
    analyzeSleepRecords,
    analyzeWeeklyData,
    analyzeMonthlyData,
    getWeekDates,
    getWeekNumber,
    getMonthWeeks,
    parseTime,
    formatTime,
    calculateTimeDifference
  };
}
