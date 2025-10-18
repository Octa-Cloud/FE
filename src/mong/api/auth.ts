import apiClient from './client';
import {
  BaseResponse,
  LoginRequest,
  LoginResponse,
  TokenReissueRequest,
  TokenReissueResponse,
  SignUpRequest,
  SignUpResponse,
} from './types';

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
   * 로그아웃
   */
  static async logout(): Promise<BaseResponse<void>> {
    const response = await apiClient.post<BaseResponse<void>>('/api/auth/logout');
    return response.data;
  }

  /**
   * 토큰 재발급
   */
  static async reissueToken(
    refreshToken: string
  ): Promise<BaseResponse<TokenReissueResponse>> {
    const response = await apiClient.post<BaseResponse<TokenReissueResponse>>(
      '/api/auth/token/reissue',
      { refreshToken }
    );
    return response.data;
  }

  /**
   * 인증 검증 (내부 API)
   */
  static async verifyAuthentication(): Promise<void> {
    await apiClient.post('/api/auth/internal');
  }

  /**
   * 회원가입 (추후 구현 예정)
   */
  static async signUp(userData: SignUpRequest): Promise<BaseResponse<SignUpResponse>> {
    const response = await apiClient.post<BaseResponse<SignUpResponse>>(
      '/api/auth/signup',
      userData
    );
    return response.data;
  }
}

// 편의 함수들
export const authAPI = {
  login: AuthAPI.login,
  logout: AuthAPI.logout,
  reissueToken: AuthAPI.reissueToken,
  verifyAuthentication: AuthAPI.verifyAuthentication,
  signUp: AuthAPI.signUp,
};