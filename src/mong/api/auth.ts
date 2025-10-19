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
}

// 편의 함수들
export const authAPI = {
  login: AuthAPI.login,
  getUserInfo: AuthAPI.getUserInfo,
};