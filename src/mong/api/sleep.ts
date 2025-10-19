import apiClient from './client';

// 수면 통계 응답 타입
export interface SleepStats {
  avgScore: number;
  avgSleepTime: number;
  avgBedTime: string;
}

// 수면 패턴 응답 타입
export interface SleepPattern {
  date: string;
  score: number;
  totalSleepTime: number;
}

// API 응답 타입
export interface BaseResponse<T> {
  timestamp: string;
  code: string;
  message: string;
  result: T;
}

// Sleep API 클래스
export class SleepAPI {
  /**
   * 누적 수면 기록 조회
   */
  static async getTotalSleepStats(): Promise<BaseResponse<SleepStats>> {
    const response = await apiClient.get<BaseResponse<SleepStats>>(
      '/api/sleep/total'
    );
    return response.data;
  }

  /**
   * 수면 패턴 조회
   */
  static async getSleepPatterns(startDate: string, endDate: string): Promise<SleepPattern[]> {
    const response = await apiClient.get<SleepPattern[]>(
      `/api/sleep/patterns?startDate=${startDate}&endDate=${endDate}`
    );
    return response.data;
  }
}

// 편의 함수들
export const sleepAPI = {
  getTotalSleepStats: SleepAPI.getTotalSleepStats,
  getSleepPatterns: SleepAPI.getSleepPatterns,
};
