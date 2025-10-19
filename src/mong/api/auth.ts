import apiClient from './client';

// 로그인 요청 타입
export interface LoginRequest {
  email: string;
  password: string;
}

// 로그인 응답 타입
export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

// API 응답 타입
export interface BaseResponse<T> {
  timestamp: string;
  code: string;
  message: string;
  result: T;
}

// 사용자 정보 타입
export interface UserInfo {
  name: string;
  email: string;
  nickname: string;
  birth: string;
  gender: string;
}

// 회원가입 요청 타입
export interface SignUpRequest {
  name: string;
  nickname: string;
  email: string;
  password: string;
  gender: 'MALE' | 'FEMALE';
}

// Auth API 클래스
export class AuthAPI {
  /**
   * 로그인
   */
  static async login(credentials: LoginRequest): Promise<BaseResponse<LoginResponse>> {
    const response = await apiClient.post<BaseResponse<LoginResponse>>(
      '/api/auth/login',
      credentials
    );
    return response.data;
  }

  /**
   * 사용자 정보 조회
   */
  static async getUserInfo(): Promise<BaseResponse<UserInfo>> {
    const response = await apiClient.get<BaseResponse<UserInfo>>(
      '/api/users/information'
    );
    return response.data;
  }

  /**
   * 이메일 인증 요청
   */
  static async sendVerificationEmail(email: string): Promise<BaseResponse<void>> {
    console.log('📧 API 호출: 이메일 인증 요청', { email });
    const response = await apiClient.post<BaseResponse<void>>(
      '/api/users/email/send',
      null,
      {
        params: { email }
      }
    );
    console.log('📧 API 응답: 이메일 인증 요청', response.data);
    return response.data;
  }

  /**
   * 이메일 인증 코드 검증
   */
  static async verifyEmail(email: string, code: string): Promise<BaseResponse<void>> {
    console.log('🔐 API 호출: 이메일 인증 코드 검증', { email, code });
    const response = await apiClient.post<BaseResponse<void>>(
      '/api/users/email/verify',
      null,
      {
        params: { email, code }
      }
    );
    console.log('🔐 API 응답: 이메일 인증 코드 검증', response.data);
    return response.data;
  }

  /**
   * 회원가입
   */
  static async signUp(signUpData: SignUpRequest): Promise<BaseResponse<void>> {
    console.log('👤 API 호출: 회원가입', signUpData);
    const response = await apiClient.post<BaseResponse<void>>(
      '/api/users/sign-up',
      signUpData
    );
    console.log('👤 API 응답: 회원가입', response.data);
    return response.data;
  }
}

// 편의 함수들
export const authAPI = {
  login: AuthAPI.login,
  getUserInfo: AuthAPI.getUserInfo,
  sendVerificationEmail: AuthAPI.sendVerificationEmail,
  verifyEmail: AuthAPI.verifyEmail,
  signUp: AuthAPI.signUp,
};