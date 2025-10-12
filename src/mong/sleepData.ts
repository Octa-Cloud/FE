/**
 * 2025년 10월 수면 기록 테스트 데이터
 */

import { DailySleepRecord, UserSleepData } from './types/sleepData';

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
    
    const sleepHours = Math.floor(sleepTimeHours);
    const sleepMinutes = Math.round((sleepTimeHours - sleepHours) * 60);
    const sleepTime = `${sleepHours}시간 ${sleepMinutes}분`;
    
    // 취침/기상 시간 (주말에는 늦게 자고 늦게 일어남)
    const dayOfWeek = new Date(dateStr).getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    
    const bedtimeHour = isWeekend ? 23 + Math.floor(Math.random() * 2) : 22 + Math.floor(Math.random() * 2);
    const bedtimeMinute = Math.floor(Math.random() * 60);
    const bedtime = `${bedtimeHour.toString().padStart(2, '0')}:${bedtimeMinute.toString().padStart(2, '0')}`;
    
    const wakeHour = Math.floor((bedtimeHour + sleepTimeHours) % 24);
    const wakeMinute = (bedtimeMinute + sleepMinutes) % 60;
    const wakeTime = `${wakeHour.toString().padStart(2, '0')}:${wakeMinute.toString().padStart(2, '0')}`;
    
    // 수면 효율
    const sleepEfficiency = Math.round(75 + (sleepScore - 75) * 0.3 + Math.random() * 10);
    
    // 수면 단계별 비율 (자연스러운 분포)
    const deepRatio = Math.round(20 + (sleepScore - 75) * 0.3 + Math.random() * 10);
    const remRatio = Math.round(15 + Math.random() * 10);
    const lightRatio = 100 - deepRatio - remRatio;
    
    // 수면 단계별 시간 계산
    const deepHours = (sleepTimeHours * deepRatio) / 100;
    const lightHours = (sleepTimeHours * lightRatio) / 100;
    const remHours = (sleepTimeHours * remRatio) / 100;
    
    const formatTime = (hours: number) => {
      const h = Math.floor(hours);
      const m = Math.round((hours - h) * 60);
      return `${h}시간 ${m}분`;
    };
    
    // 뇌파 데이터 생성 (취침부터 기상까지)
    const brainwaveData = [];
    let currentHour = bedtimeHour;
    let currentMinute = bedtimeMinute;
    
    for (let i = 0; i < 10; i++) {
      const time = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
      
      // 수면 초기와 말기는 얕은 수면, 중간은 깊은 수면
      let level: 'A' | 'B' | 'C' | 'D' | 'E';
      if (i < 2 || i > 7) {
        level = Math.random() > 0.5 ? 'B' : 'C';
      } else if (i < 5) {
        level = Math.random() > 0.3 ? 'D' : 'C';
      } else {
        level = Math.random() > 0.5 ? 'C' : 'D';
      }
      
      brainwaveData.push({ time, level });
      
      // 다음 시간 계산
      currentMinute += Math.floor(sleepTimeHours * 60 / 10);
      currentHour += Math.floor(currentMinute / 60);
      currentMinute = currentMinute % 60;
      currentHour = currentHour % 24;
    }
    
    // 소음 이벤트 (랜덤)
    const noiseEvents = [];
    if (Math.random() > 0.6) noiseEvents.push({ type: '코골이', icon: 'user' });
    if (Math.random() > 0.7) noiseEvents.push({ type: '에어컨 소음', icon: 'air-vent' });
    if (Math.random() > 0.8) noiseEvents.push({ type: '외부 소음', icon: 'car' });
    
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
    
    records.push({
      date: dateStr,
      sleepScore,
      sleepTime,
      sleepTimeHours,
      bedtime,
      wakeTime,
      sleepEfficiency,
      sleepStages: {
        deep: formatTime(deepHours),
        light: formatTime(lightHours),
        rem: formatTime(remHours)
      },
      sleepRatios: {
        deep: deepRatio,
        light: lightRatio,
        rem: remRatio
      },
      brainwaveData,
      noiseEvents,
      sleepMemo
    });
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
  }
];

// 특정 날짜의 수면 기록 가져오기
export const getSleepRecordByDate = (userId: string, date: string): DailySleepRecord | null => {
  const userData = testSleepData.find(data => data.userId === userId);
  if (!userData) return null;
  
  const record = userData.records.find(r => r.date === date);
  return record || null;
};

// 특정 기간의 수면 기록 가져오기
export const getSleepRecordsByDateRange = (
  userId: string,
  startDate: string,
  endDate: string
): DailySleepRecord[] => {
  const userData = testSleepData.find(data => data.userId === userId);
  if (!userData) return [];
  
  return userData.records.filter(r => r.date >= startDate && r.date <= endDate);
};

// 특정 월의 수면 기록 가져오기
export const getSleepRecordsByMonth = (
  userId: string,
  year: number,
  month: number
): DailySleepRecord[] => {
  const userData = testSleepData.find(data => data.userId === userId);
  if (!userData) return [];
  
  const monthStr = month.toString().padStart(2, '0');
  return userData.records.filter(r => r.date.startsWith(`${year}-${monthStr}`));
};

// 수면 점수 상태 가져오기 (캘린더 표시용)
export const getSleepStatus = (sleepScore: number): 'good' | 'normal' | null => {
  if (sleepScore >= 85) return 'good';
  if (sleepScore >= 70) return 'normal';
  return null;
};

// 개발 환경에서만 사용할 수 있도록 전역 객체에 추가
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  (window as any).sleepData = {
    all: testSleepData,
    getByDate: getSleepRecordByDate,
    getByDateRange: getSleepRecordsByDateRange,
    getByMonth: getSleepRecordsByMonth,
    getStatus: getSleepStatus
  };
}

