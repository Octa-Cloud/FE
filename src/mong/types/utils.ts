/**
 * 유틸리티 관련 타입 정의
 */

/**
 * LocalStorage 저장 옵션
 */
export interface StorageOptions {
  defaultValue?: any;
  serializer?: {
    read: (value: string) => any;
    write: (value: any) => string;
  };
}

/**
 * 유효성 검사 결과
 */
export interface ValidationResult {
  isValid: boolean;
  message?: string;
}

/**
 * 비밀번호 유효성 검사 결과
 */
export interface PasswordValidation extends ValidationResult {
  hasLowerCase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
}

/**
 * 폼 유효성 검사 상태
 */
export interface FormValidationState {
  errors: Record<string, string>;
  isValid: boolean;
}

/**
 * 시간 형식
 */
export interface TimeFormat {
  time: string;
  ampm: string;
}

/**
 * 수면 목표 계산 결과
 */
export interface SleepGoalCalculation {
  formData: {
    targetBedtime: string;
    targetWakeTime: string;
    targetSleepHours: string;
  };
  calculatedSleepHours: number;
  calculatedWakeTime: string;
  autoCalculationEnabled: boolean;
}

/**
 * API 응답 타입
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * 페이지네이션 정보
 */
export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/**
 * 페이지네이션된 응답
 */
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: PaginationInfo;
}

/**
 * 로딩 상태
 */
export interface LoadingState {
  isLoading: boolean;
  error?: string;
}

/**
 * 액션 상태
 */
export interface ActionState extends LoadingState {
  isSuccess?: boolean;
  isError?: boolean;
}
