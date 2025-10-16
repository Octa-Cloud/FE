/**
 * 통합된 테스트 사용자 데이터
 * 각 사용자별로 모든 정보를 하나의 객체에 포함
 */

import { User, TestUser } from './types';
import { additionalTestUsers } from './DummyData';

// 통합된 테스트 사용자 데이터
export const testUsers: TestUser[] = [
  {
    // 기본 사용자 정보
    id: 'test-user-001',
    email: 'test1@gmail.com',
    password: 'password1!',
    name: '추민기',
    birthDate: '2004-08-19',
    gender: '남',
    createdAt: '2024-01-15T09:00:00.000Z',
    
    // 프로필 정보
    profile: {
      avatar: '추',
      averageScore: 85,
      averageSleepTime: 7.5,
      totalDays: 30
    },
    
    // 수면 목표 정보
    sleepGoal: {
      targetBedtime: '23:00',
      targetWakeTime: '07:00',
      targetSleepHours: 8.0
    }
  },
  {
    // 기본 사용자 정보
    id: 'test-user-002',
    email: 'sleepy@mong.com',
    password: 'sleep123!',
    name: '김수면',
    birthDate: '1990-01-15',
    gender: '여',
    createdAt: '2024-01-20T14:30:00.000Z',
    
    // 프로필 정보
    profile: {
      avatar: '김',
      averageScore: 92,
      averageSleepTime: 8.2,
      totalDays: 45
    },
    
    // 수면 목표 정보
    sleepGoal: {
      targetBedtime: '22:30',
      targetWakeTime: '06:30',
      targetSleepHours: 8.0
    }
  },
  {
    // 기본 사용자 정보
    id: 'test-user-003',
    email: 'insomnia@test.com',
    password: 'test123!',
    name: '박불면',
    birthDate: '1995-06-10',
    gender: '남',
    createdAt: '2024-02-01T10:15:00.000Z',
    
    // 프로필 정보
    profile: {
      avatar: '박',
      averageScore: 65,
      averageSleepTime: 5.8,
      totalDays: 15
    },
    
    // 수면 목표 정보
    sleepGoal: {
      targetBedtime: '01:00',
      targetWakeTime: '07:00',
      targetSleepHours: 6.0
    }
  },
  ...additionalTestUsers
];

// 테스트 데이터 초기화 함수
export const initializeTestData = () => {
  // 사용자 데이터 초기화
  const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
  const existingUserEmails = existingUsers.map((user: User) => user.email);
  
  const newUsers = testUsers.filter(user => !existingUserEmails.includes(user.email));
  
  if (newUsers.length > 0) {
    const allUsers = [...existingUsers, ...newUsers];
    localStorage.setItem('users', JSON.stringify(allUsers));
    console.log(`✅ ${newUsers.length}명의 테스트 사용자가 추가되었습니다.`);
  }
  
  console.log('🎯 통합 테스트 데이터 초기화 완료!');
  console.log('📧 테스트 계정들:');
  testUsers.forEach(user => {
    console.log(`  - ${user.email} (${user.name}) - 비밀번호: ${user.password}`);
    console.log(`    📊 평균점수: ${user.profile.averageScore}점, 수면시간: ${user.profile.averageSleepTime}시간`);
    console.log(`    🛏️ 목표 취침: ${user.sleepGoal.targetBedtime}, 기상: ${user.sleepGoal.targetWakeTime}`);
  });
};

// 테스트 데이터 리셋 함수
export const resetTestData = () => {
  // 사용자 데이터 리셋
  localStorage.setItem('users', JSON.stringify(testUsers));
  
  console.log('🔄 통합 테스트 데이터가 리셋되었습니다.');
};

// 특정 사용자의 모든 정보 가져오기
export const getTestUser = (userId: string): TestUser | null => {
  const user = testUsers.find(user => user.id === userId);
  return user || null;
};

// 특정 사용자의 기본 정보만 가져오기 (User 타입)
export const getTestUserBasic = (userId: string): User | null => {
  const testUser = getTestUser(userId);
  if (!testUser) return null;
  
  const { profile, sleepGoal, ...basicInfo } = testUser;
  return basicInfo;
};

// 특정 사용자의 프로필 정보 가져오기
export const getTestUserProfile = (userId: string) => {
  const testUser = getTestUser(userId);
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

// 특정 사용자의 수면 목표 정보 가져오기
export const getTestUserSleepGoal = (userId: string) => {
  const testUser = getTestUser(userId);
  if (!testUser) return null;
  
  return {
    ...testUser.sleepGoal,
    name: testUser.name
  };
};


// 이메일로 사용자 찾기
export const getTestUserByEmail = (email: string): TestUser | null => {
  return testUsers.find(user => user.email === email) || null;
};

// 개발 환경에서만 사용할 수 있도록 전역 객체에 추가
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  (window as any).testData = {
    initialize: initializeTestData,
    reset: resetTestData,
    users: testUsers,
    getUser: getTestUser,
    getUserBasic: getTestUserBasic,
    getUserProfile: getTestUserProfile,
    getUserSleepGoal: getTestUserSleepGoal,
    getUserByEmail: getTestUserByEmail
  };
}
