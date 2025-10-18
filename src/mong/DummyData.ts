/**
 * 권재우, 우재권 테스트 사용자 데이터
 */

import { DailySleepRecord, UserSleepData, BrainwavePoint } from './types/sleepData';
import { TestUser } from './types/testData';
import {
  formatTimeFromHours,
  calculateSleepStages,
  generateBrainwaveAnalysis,
  calculateSleepScore,
  calculateSleepEfficiency,
  validateSleepData,
  formatClockTime
} from './utils/sleepDataCalculations';

// 특정 날짜들에 대한 수면 데이터 생성 함수
const generateSleepDataForDates = (dates: string[], userId: string): DailySleepRecord[] => {
  const records: DailySleepRecord[] = [];
  
  // 사용자별 수면 패턴 차이
  const isKwon = userId === 'test-user-004'; // 권재우
  
  dates.forEach((dateStr, index) => {
    // 다양한 수면 패턴 생성
    const baseScore = isKwon 
      ? 78 + Math.sin(index / 4) * 12 + (Math.random() - 0.5) * 8  // 권재우: 평균 78점
      : 82 + Math.sin(index / 5) * 10 + (Math.random() - 0.5) * 6; // 우재권: 평균 82점
    
    const sleepScore = Math.round(Math.max(65, Math.min(95, baseScore)));
    
    const baseSleepHours = isKwon
      ? 6.8 + Math.sin(index / 6) * 1.2 + (Math.random() - 0.5) * 0.4  // 권재우: 평균 6.8시간
      : 7.5 + Math.sin(index / 7) * 1.0 + (Math.random() - 0.5) * 0.3; // 우재권: 평균 7.5시간
    
    const sleepTimeHours = Math.max(5.5, Math.min(9, baseSleepHours));
    const sleepTime = formatTimeFromHours(sleepTimeHours);
    
    // 취침/기상 시간
    const dayOfWeek = new Date(dateStr).getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    
    const bedtimeHour = isKwon
      ? (isWeekend ? 1 : 0) + Math.floor(Math.random() * 2)  // 권재우: 0~2시 (늦게 잠)
      : (isWeekend ? 23 : 22) + Math.floor(Math.random() * 2); // 우재권: 22~24시
    
    const bedtimeMinute = Math.floor(Math.random() * 60);
    const bedtime = formatClockTime(bedtimeHour, bedtimeMinute);
    
    const sleepMinutes = Math.round((sleepTimeHours - Math.floor(sleepTimeHours)) * 60);
    const wakeHour = Math.floor((bedtimeHour + sleepTimeHours) % 24);
    const wakeMinute = (bedtimeMinute + sleepMinutes) % 60;
    const wakeTime = formatClockTime(wakeHour, wakeMinute);
    
    // 뇌파 데이터 생성
    const brainwaveData: BrainwavePoint[] = [];
    let currentHour = bedtimeHour;
    let currentMinute = bedtimeMinute;
    
    const totalMinutes = Math.floor(sleepTimeHours * 60);
    const intervals = Math.floor(totalMinutes / 5);
    
    for (let i = 0; i < intervals; i++) {
      const time = formatClockTime(currentHour, currentMinute);
      
      let level: 'A' | 'B' | 'C' | 'D' | 'E';
      let intensity: number;
      
      const progress = i / intervals;
      
      // 권재우는 얕은 수면이 많고, 우재권은 깊은 수면이 많음
      if (progress < 0.1 || progress > 0.9) {
        level = Math.random() > 0.3 ? 'B' : 'C';
        intensity = 30 + Math.random() * 40;
      } else if (progress >= 0.2 && progress <= 0.6) {
        if (isKwon) {
          // 권재우: 깊은 수면 적음
          level = Math.random() > 0.4 ? 'C' : 'D';
          intensity = 45 + Math.random() * 35;
        } else {
          // 우재권: 깊은 수면 많음
          level = Math.random() > 0.2 ? 'D' : 'A';
          intensity = 60 + Math.random() * 30;
        }
      } else if (Math.random() > 0.7) {
        level = Math.random() > 0.5 ? 'C' : 'D';
        intensity = 40 + Math.random() * 40;
      } else {
        level = 'B';
        intensity = 35 + Math.random() * 35;
      }
      
      // 권재우는 각성 빈도 높음
      if (isKwon && Math.random() < 0.08) {
        level = 'E';
        intensity = 70 + Math.random() * 20;
      } else if (!isKwon && Math.random() < 0.03) {
        level = 'E';
        intensity = 70 + Math.random() * 20;
      }
      
      brainwaveData.push({ time, level, intensity });
      
      currentMinute += 5;
      currentHour += Math.floor(currentMinute / 60);
      currentMinute = currentMinute % 60;
      currentHour = currentHour % 24;
    }
    
    const brainwaveAnalysis = generateBrainwaveAnalysis(brainwaveData, sleepTime, intervals);
    
    // 소음 이벤트
    const noiseEvents = [];
    
    const generateNoiseTimestamp = (offsetMinutes: number) => {
      const totalOffset = bedtimeHour * 60 + bedtimeMinute + offsetMinutes;
      const hour = Math.floor(totalOffset / 60) % 24;
      const minute = totalOffset % 60;
      return formatClockTime(hour, minute);
    };
    
    // 권재우는 소음에 더 민감 (더 많은 소음 이벤트)
    if (isKwon ? Math.random() > 0.5 : Math.random() > 0.6) {
      noiseEvents.push({
        type: '코골이',
        icon: 'user',
        timestamp: generateNoiseTimestamp(Math.floor(Math.random() * totalMinutes)),
        duration: 120 + Math.random() * 300,
        intensity: 60 + Math.random() * 30
      });
    }
    
    if (isKwon ? Math.random() > 0.6 : Math.random() > 0.7) {
      noiseEvents.push({
        type: '에어컨 소음',
        icon: 'air-vent',
        timestamp: generateNoiseTimestamp(Math.floor(Math.random() * totalMinutes)),
        duration: 60 + Math.random() * 180,
        intensity: 40 + Math.random() * 25
      });
    }
    
    if (isKwon ? Math.random() > 0.7 : Math.random() > 0.8) {
      noiseEvents.push({
        type: '외부 소음',
        icon: 'car',
        timestamp: generateNoiseTimestamp(Math.floor(Math.random() * totalMinutes)),
        duration: 30 + Math.random() * 120,
        intensity: 50 + Math.random() * 40
      });
    }
    
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
    
    // 수면 메모
    const kwonMemos = [
      '"늦게까지 개발하느라 수면 시간이 부족했어요."',
      '"커피를 너무 많이 마셔서 잠들기 힘들었어요."',
      '"프로젝트 마감이 다가와서 걱정돼요."',
      '"주말이라 좀 늦게까지 놀았네요."',
      '"잠들기 전에 스마트폰을 너무 봤어요."',
      '"코딩하다가 밤 샜어요..."',
      '"오늘은 그나마 일찍 잤습니다!"',
      '"스트레스 받는 일이 있어서 잠을 설쳤어요."'
    ];
    
    const wooMemos = [
      '"규칙적인 수면으로 컨디션이 좋아요!"',
      '"저녁 운동 후 숙면했습니다."',
      '"명상하고 자니까 잠이 잘 와요."',
      '"오늘도 7시간 목표 달성!"',
      '"주말이지만 일찍 일어났어요."',
      '"편안하고 깊게 잘 잤습니다."',
      '"수면 루틴을 잘 지켰어요."',
      '"일찍 자니까 아침이 상쾌해요."'
    ];
    
    const memos = isKwon ? kwonMemos : wooMemos;
    const sleepMemo = Math.random() > 0.4 ? memos[Math.floor(Math.random() * memos.length)] : undefined;
    
    const sleepEfficiency = calculateSleepEfficiency(sleepTimeHours, bedtime, wakeTime);
    
    const sleepRatios = {
      deep: brainwaveAnalysis.deepSleepRatio,
      light: brainwaveAnalysis.lightSleepRatio,
      rem: brainwaveAnalysis.remSleepRatio
    };
    
    const sleepStages = calculateSleepStages(sleepTimeHours, sleepRatios);
    
    const calculatedScore = calculateSleepScore(
      sleepTimeHours,
      sleepEfficiency,
      brainwaveAnalysis.deepSleepRatio,
      brainwaveAnalysis.remSleepRatio,
      brainwaveAnalysis.awakeRatio,
      noiseEvents.length
    );
    
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
    
    const validation = validateSleepData({
      sleepTimeHours: record.sleepTimeHours,
      sleepRatios: record.sleepRatios,
      sleepScore: record.sleepScore
    });
    
    if (!validation.isValid && import.meta.env.DEV) {
      console.warn(`날짜 ${dateStr} 데이터 검증 오류:`, validation.errors);
    }
    
    records.push(record);
  });
  
  return records;
};

// 권재우 수면 기록 날짜
const kwonDates = [
  // 9월 15일~30일
  '2025-09-15', '2025-09-16', '2025-09-17', '2025-09-18', '2025-09-19',
  '2025-09-20', '2025-09-21', '2025-09-22', '2025-09-23', '2025-09-24',
  '2025-09-25', '2025-09-26', '2025-09-27', '2025-09-28', '2025-09-29',
  '2025-09-30',
  // 10월 3, 4, 12, 13일
  '2025-10-03', '2025-10-04', '2025-10-12', '2025-10-13'
];

// 우재권 수면 기록 날짜 (10월 1일~14일)
const wooDates = [
  '2025-10-01', '2025-10-02', '2025-10-03', '2025-10-04', '2025-10-05',
  '2025-10-06', '2025-10-07', '2025-10-08', '2025-10-09', '2025-10-10',
  '2025-10-11', '2025-10-12', '2025-10-13', '2025-10-14'
];

// 통합 테스트 사용자 데이터
export const additionalTestUsers: TestUser[] = [
  {
    // 권재우
    id: 'test-user-004',
    email: 'kwon.jaewoo@test.com',
    password: 'kwon1234!',
    name: '권재우',
    birthDate: '1998-03-22',
    gender: '여',
    createdAt: '2024-09-15T10:00:00.000Z',
    
    profile: {
      avatar: '권',
      averageScore: 78,
      averageSleepTime: 6.8,
      totalDays: 20
    },
    
    sleepGoal: {
      targetBedtime: '00:30',
      targetWakeTime: '07:30',
      targetSleepHours: 7.0
    }
  },
  {
    // 우재권
    id: 'test-user-005',
    email: 'woo.jaekwon@test.com',
    password: 'woo1234!',
    name: '우재권',
    birthDate: '2002-01-15',
    gender: '여',
    createdAt: '2024-10-01T09:00:00.000Z',
    
    profile: {
      avatar: '우',
      averageScore: 87,
      averageSleepTime: 7.5,
      totalDays: 14
    },
    
    sleepGoal: {
      targetBedtime: '23:00',
      targetWakeTime: '06:30',
      targetSleepHours: 7.5
    }
  }
];

// 수면 데이터
export const additionalSleepData: UserSleepData[] = [
  {
    userId: 'test-user-004', // 권재우
    records: generateSleepDataForDates(kwonDates, 'test-user-004')
  },
  {
    userId: 'test-user-005', // 우재권
    records: generateSleepDataForDates(wooDates, 'test-user-005')
  }
];

// 특정 사용자 정보 가져오기
export const getAdditionalTestUser = (userId: string): TestUser | null => {
  return additionalTestUsers.find(user => user.id === userId) || null;
};

export const getAdditionalTestUserByEmail = (email: string): TestUser | null => {
  return additionalTestUsers.find(user => user.email === email) || null;
};

export const getAdditionalTestUserProfile = (userId: string) => {
  const testUser = getAdditionalTestUser(userId);
  if (!testUser) return null;
  
  return {
    name: testUser.name,
    email: testUser.email,
    avatar: testUser.profile.avatar,
    averageScore: testUser.profile.averageScore,
    averageSleepTime: testUser.profile.averageSleepTime,
    totalDays: testUser.profile.totalDays,
    birthDate: testUser.birthDate,
    gender: testUser.gender
  };
};

export const getAdditionalTestUserSleepGoal = (userId: string) => {
  const testUser = getAdditionalTestUser(userId);
  if (!testUser) return null;
  
  return {
    ...testUser.sleepGoal,
    name: testUser.name
  };
};

// 초기화 함수
export const initializeAdditionalTestData = () => {
  const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
  const existingUserEmails = existingUsers.map((user: any) => user.email);
  
  const newUsers = additionalTestUsers.filter(user => !existingUserEmails.includes(user.email));
  
  if (newUsers.length > 0) {
    const allUsers = [...existingUsers, ...newUsers];
    localStorage.setItem('users', JSON.stringify(allUsers));
    console.log(`✅ ${newUsers.length}명의 추가 테스트 사용자가 등록되었습니다.`);
  }
  
  // 수면 데이터도 localStorage에 저장
  const existingSleepData = JSON.parse(localStorage.getItem('sleepData') || '[]');
  const newSleepData = additionalSleepData.filter(data => 
    !existingSleepData.some((existing: any) => existing.userId === data.userId)
  );
  
  if (newSleepData.length > 0) {
    const allSleepData = [...existingSleepData, ...newSleepData];
    localStorage.setItem('sleepData', JSON.stringify(allSleepData));
    console.log(`✅ ${newSleepData.length}명의 추가 수면 데이터가 등록되었습니다.`);
  }
  
  console.log('🎯 추가 테스트 데이터 초기화 완료!');
  console.log('📧 추가 테스트 계정들:');
  additionalTestUsers.forEach(user => {
    console.log(`  - ${user.email} (${user.name}) - 비밀번호: ${user.password}`);
    console.log(`    📊 평균점수: ${user.profile.averageScore}점, 수면시간: ${user.profile.averageSleepTime}시간`);
    console.log(`    🛏️ 목표 취침: ${user.sleepGoal.targetBedtime}, 기상: ${user.sleepGoal.targetWakeTime}`);
  });
};

// 개발 환경에서만 사용
if (typeof window !== 'undefined' && import.meta.env.DEV) {
  (window as any).additionalTestData = {
    initialize: initializeAdditionalTestData,
    users: additionalTestUsers,
    sleepData: additionalSleepData,
    getUser: getAdditionalTestUser,
    getUserByEmail: getAdditionalTestUserByEmail,
    getUserProfile: getAdditionalTestUserProfile,
    getUserSleepGoal: getAdditionalTestUserSleepGoal
  };
}

// DummyData.ts 파일 끝에 추가
if (typeof window !== 'undefined' && import.meta.env.DEV) {
    // 페이지 로드 시 자동으로 한 번만 실행
    const initialized = localStorage.getItem('additionalUsersInitialized');
    if (!initialized) {
      initializeAdditionalTestData();
      localStorage.setItem('additionalUsersInitialized', 'true');
    }
  }