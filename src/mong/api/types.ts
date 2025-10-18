// API 응답 기본 구조
export interface BaseResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// 로그인 요청 타입
export interface LoginRequest {
  email: string;
  password: string;
}

// 로그인 응답 타입
export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    userNo: number;
    email: string;
    name: string;
  };
}

// 토큰 재발급 요청 타입
export interface TokenReissueRequest {
  refreshToken: string;
}

// 토큰 재발급 응답 타입
export interface TokenReissueResponse {
  accessToken: string;
  refreshToken: string;
}

// 회원가입 요청 타입
export interface SignUpRequest {
  email: string;
  password: string;
  name: string;
}

// 회원가입 응답 타입
export interface SignUpResponse {
  userNo: number;
  email: string;
  name: string;
}

// API 에러 타입
export interface ApiError {
  success: false;
  message: string;
  error?: string;
}