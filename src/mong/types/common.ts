// 공통 타입 정의
export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  birthDate: string;
  gender: 'male' | 'female';
  createdAt: string;
}

// 유틸리티 타입
export type Gender = 'male' | 'female';
export type AuthStep = 1 | 2 | 3;
export type ButtonVariant = 'primary' | 'secondary';
export type InputType = 'text' | 'email' | 'password' | 'tel';

// 이 타입들은 utils.ts로 이동되었습니다.
