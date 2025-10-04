// 폼 관련 타입 정의
export interface FormData {
  email: string;
  verificationCode: string;
  name: string;
  birthMonth: string;
  birthDay: string;
  birthYear: string;
  gender: string;
  password: string;
  confirmPassword: string;
}

// 인증 관련 타입
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  birthDate: string;
  gender: 'male' | 'female';
}

export interface UpdateProfileData {
  name?: string;
  birthDate?: string;
  gender?: 'male' | 'female';
  email?: string;
  password?: string;
}

// 수면 목표 설정 관련 타입
export interface SleepGoalData {
  targetBedtime: string;
  targetWakeTime: string;
  targetSleepHours: number;
}

export interface SleepGoalFormData {
  targetBedtime: string;
  targetWakeTime: string;
  targetSleepHours: string;
}
