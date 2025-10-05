/**
 * 테스트 데이터 관련 타입 정의
 */

import { User } from './common';

// 통합된 테스트 사용자 타입 정의
export interface TestUser extends User {
  // 프로필 정보
  profile: {
    avatar: string;
    averageScore: number;
    averageSleepTime: number;
    totalDays: number;
  };
  // 수면 목표 정보
  sleepGoal: {
    targetBedtime: string;
    targetWakeTime: string;
    targetSleepHours: number;
  };
}
