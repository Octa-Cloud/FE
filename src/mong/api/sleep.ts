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

// 수면 목표 설정 요청 타입
export interface SleepGoalRequest {
  goalBedTime: string;        // 목표 취침 시각 (HH:mm 형식)
  goalWakeTime: string;       // 목표 기상 시각 (HH:mm 형식)
  goalTotalSleepTime: number; // 목표 총 수면 시간 (시간 단위)
}

// 수면 목표 설정 응답 타입
export interface SleepGoalResponse {
  goalBedTime: string;
  goalWakeTime: string;
  goalTotalSleepTime: number;
}

// 수면 패턴 조회 응답 타입
export interface SleepPatternsResponse {
  date: string;           // 날짜 (YYYY-MM-DD)
  score: number;          // 수면 점수
  totalSleepTime: number; // 총 수면 시간 (분 단위)
}

// 월별 수면 요약 응답 타입
export interface SleepSummaryResponse {
  score: number;          // 수면 점수
  totalSleepTime: number; // 총 수면 시간 (분 단위)
  bedTime: string;        // 취침 시각 (HH:mm)
  wakeTime: string;       // 기상 시각 (HH:mm)
  date: string;           // 날짜 (YYYY-MM-DD)
}

// 주간/월간 리포트 응답 타입
export interface PeriodicReportResponse {
  score: number;              // 평균 수면 점수
  totalSleepTime: number;     // 평균 총 수면 시간 (분 단위)
  bedTime: string;            // 평균 취침 시각 (HH:mm)
  deepSleepRatio: number;     // 깊은 수면 비율
  lightSleepRatio: number;    // 얕은 수면 비율
  remSleepRatio: number;      // REM 수면 비율
  improvement: string;        // 개선점
  weakness: string;           // 약점
  recommendation: string;     // 추천사항
  predictDescription: string; // 예측 설명
  scorePrediction: number[];  // 점수 예측 배열
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

  /**
   * 수면 목표 조회
   */
  static async getSleepGoal(): Promise<BaseResponse<SleepGoalResponse>> {
    const response = await apiClient.get<BaseResponse<SleepGoalResponse>>(
      '/api/sleep/goal'
    );
    return response.data;
  }

  /**
   * 수면 목표 설정
   */
  static async setSleepGoal(goalData: SleepGoalRequest): Promise<BaseResponse<SleepGoalResponse>> {
    const response = await apiClient.post<BaseResponse<SleepGoalResponse>>(
      '/api/sleep/goal',
      goalData
    );
    return response.data;
  }

  /**
   * 수면 목표 업데이트
   */
  static async updateSleepGoal(goalData: SleepGoalRequest): Promise<BaseResponse<SleepGoalResponse>> {
    const response = await apiClient.put<BaseResponse<SleepGoalResponse>>(
      '/api/sleep/goal',
      goalData
    );
    return response.data;
  }

  /**
   * 수면 패턴 조회 (특정 기간)
   */
  static async getSleepPatterns(startDate: string, endDate: string): Promise<BaseResponse<SleepPatternsResponse[]>> {
    const response = await apiClient.get<BaseResponse<SleepPatternsResponse[]>>(
      '/api/sleep/patterns',
      {
        params: {
          startDate,
          endDate
        }
      }
    );
    return response.data;
  }

  /**
   * 월별 수면 요약 조회 (달력용)
   */
  static async getMonthlySleepSummary(year: number, month: number): Promise<BaseResponse<SleepSummaryResponse[]>> {
    const response = await apiClient.get<BaseResponse<SleepSummaryResponse[]>>(
      '/api/sleep/summary',
      {
        params: {
          year,
          month
        }
      }
    );
    return response.data;
  }

  /**
   * 주간 리포트 조회
   */
  static async getWeeklyReport(date: string): Promise<BaseResponse<PeriodicReportResponse>> {
    const response = await apiClient.get<BaseResponse<PeriodicReportResponse>>(
      '/api/sleep/report/weekly',
      {
        params: {
          date
        }
      }
    );
    return response.data;
  }

  /**
   * 월간 리포트 조회
   */
  static async getMonthlyReport(date: string): Promise<BaseResponse<PeriodicReportResponse>> {
    const response = await apiClient.get<BaseResponse<PeriodicReportResponse>>(
      '/api/sleep/report/monthly',
      {
        params: {
          date
        }
      }
    );
    return response.data;
  }
}

// 편의 함수들
export const sleepAPI = {
  getTotalSleepStats: SleepAPI.getTotalSleepStats,
  getSleepPatterns: SleepAPI.getSleepPatterns,
  getSleepGoal: SleepAPI.getSleepGoal,
  setSleepGoal: SleepAPI.setSleepGoal,
  updateSleepGoal: SleepAPI.updateSleepGoal,
  getMonthlySleepSummary: SleepAPI.getMonthlySleepSummary,
  getWeeklyReport: SleepAPI.getWeeklyReport,
  getMonthlyReport: SleepAPI.getMonthlyReport,
};
