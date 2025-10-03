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

// API 응답 타입
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// 폼 검증 타입
export interface PasswordValidation {
  isValid: boolean;
  hasLowerCase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}
