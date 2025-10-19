import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Container from '../components/Container';
import NavBar from '../components/NavBar';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorBoundary from '../components/ErrorBoundary';
import SleepTimeChart from '../components/charts/SleepTimeChart';
import SleepScoreChart from '../components/charts/SleepScoreChart';
import EmptyState from '../components/EmptyState';
import { useAuth, useUserProfile } from '../store/hooks';
import { sleepAPI, PeriodicReportResponse } from '../api/sleep';
import { CHART_CONFIG } from '../constants/sleep';
import '../styles/statistics.css';
import '../styles/profile.css';

const StatisticsAnalysis: React.FC = () => {
  const navigate = useNavigate();
  const [analysisType, setAnalysisType] = useState<'weekly' | 'monthly'>('weekly');
  // 오늘 날짜를 기준으로 "이번 주"/"이번 달"을 계산하도록 현재 날짜 기본값 설정
  const [currentDate, setCurrentDate] = useState(new Date());
  const [weeklyReport, setWeeklyReport] = useState<PeriodicReportResponse | null>(null);
  const [monthlyReport, setMonthlyReport] = useState<PeriodicReportResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { profile } = useUserProfile();

  const handleStartSleepRecord = useCallback(() => {
    // 수면 기록 시작 로직
    console.log('수면 기록 시작');
  }, []);

  const handleLogout = useCallback(() => {
    // 로그아웃 로직
    console.log('로그아웃');
    navigate('/login');
  }, [navigate]);

  const handleDateClick = useCallback((date: string) => {
    navigate(`/daily-report/${date}`);
  }, [navigate]);

  // 데이터 로드
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // 토큰 확인
        const token = localStorage.getItem('accessToken');
        if (!token) {
          console.log('토큰이 없습니다.');
          return;
        }

        const dateStr = currentDate.toISOString().split('T')[0];
        console.log('🔍 API 호출: 주간 리포트 조회', { date: dateStr });

        // 주간 리포트 조회
        const weeklyResponse = await sleepAPI.getWeeklyReport(dateStr);
        console.log('✅ API 응답: 주간 리포트 조회 성공', weeklyResponse);
        
        if (weeklyResponse.result) {
          setWeeklyReport(weeklyResponse.result);
          console.log('📊 주간 리포트 설정:', weeklyResponse.result);
        } else {
          console.log('📝 주간 리포트 데이터가 없습니다.');
          setWeeklyReport(null);
        }

      } catch (error: any) {
        console.error('❌ 주간 리포트 API 호출 실패:', error);
        
        // 404 에러일 때는 해당 주에 데이터가 없음을 로그로 남기고 null 설정
        if (error.response?.status === 404) {
          console.log('📝 404 에러: 해당 주의 리포트가 없습니다.');
          setWeeklyReport(null);
        } else {
          console.log('⚠️ API 호출 실패: 주간 리포트 데이터 없음');
          setWeeklyReport(null);
        }
      } finally {
        setIsLoading(false);
      }
    }
    
    loadData();
  }, [currentDate]);

  // 실제 사용자 프로필 정보 사용 - 메모이제이션
  const currentUserProfile = useMemo(() => {
    // Redux store에서 먼저 시도
    let userName = profile?.name || user?.name;
    
    // Redux store에 정보가 없으면 localStorage에서 가져오기
    if (!userName) {
      const currentUserId = user?.id || profile?.id;
      if (currentUserId) {
        const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
        const currentUser = storedUsers.find((u: any) => u.id === currentUserId);
        userName = currentUser?.name || currentUser?.profile?.name;
      }
    }
    
    // 그래도 없으면 기본값 사용
    userName = userName || '사용자';
    
    return {
      name: userName,
      avatar: '',
      email: profile?.email || user?.email || ''
    };
  }, [profile?.name, profile?.email, user?.name, user?.email, user?.id, profile?.id]);

  // 현재 리포트 데이터 - API에서 가져온 실제 데이터 사용
  const currentReport = useMemo(() => 
    analysisType === 'weekly' ? weeklyReport : monthlyReport,
    [analysisType, weeklyReport, monthlyReport]
  );

  // 월별 주차 계산 함수
  const getWeekOfMonth = useCallback((date: Date) => {
    const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const firstDayOfWeek = firstDayOfMonth.getDay(); // 0=일요일, 1=월요일, ..., 6=토요일
    const dayOfMonth = date.getDate();
    
    // 해당 월의 첫 번째 주를 계산 (월요일 기준)
    const firstMonday = firstDayOfWeek === 0 ? 2 : 9 - firstDayOfWeek;
    
    // 현재 날짜가 몇 번째 주인지 계산
    const weekNumber = Math.ceil((dayOfMonth - firstMonday + 7) / 7);
    
    return Math.max(1, weekNumber);
  }, []);

  // 수면 점수 차트의 Y축 설정 - 기본값 사용
  const sleepScoreYAxis = useMemo(() => {
    return { domain: [0, 100] as [number, number], ticks: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100] };
  }, []);

  // 차트 데이터는 현재 리포트 데이터에서 가져옴
  const chartData = useMemo(() => {
    if (!currentReport) return { timeChart: [], scoreChart: [] };
    
    // 현재 리포트 데이터로부터 차트 데이터 생성
    return {
      timeChart: [],
      scoreChart: []
    };
  }, [currentReport]);

  // 날짜 네비게이션 핸들러 - useCallback 최적화
  const handlePrevPeriod = useCallback(() => {
    const newDate = new Date(currentDate);
    if (analysisType === 'weekly') {
      newDate.setDate(newDate.getDate() - 7);
    } else {
      newDate.setMonth(newDate.getMonth() - 1);
    }
    setCurrentDate(newDate);
  }, [currentDate, analysisType]);

  const handleNextPeriod = useCallback(() => {
    const newDate = new Date(currentDate);
    if (analysisType === 'weekly') {
      newDate.setDate(newDate.getDate() + 7);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  }, [currentDate, analysisType]);

  // 로딩 중
  if (isLoading) {
    return (
      <div className="statistics-page">
        <NavBar 
          onStartSleepRecord={handleStartSleepRecord}
          userProfile={currentUserProfile}
          onLogout={handleLogout}
        />
        <Container width={800} backgroundColor="#000000">
          <main className="statistics-main">
            <div className="statistics-container">
              <LoadingSpinner size="large" text="통계 데이터를 분석하는 중..." />
            </div>
          </main>
        </Container>
      </div>
    );
  }

  return (
    <div className="statistics-page">
      <NavBar 
        onStartSleepRecord={handleStartSleepRecord}
        userProfile={currentUserProfile}
        onLogout={handleLogout}
      />
      
      <Container width={800} backgroundColor="#000000">
        <main className="statistics-main">
          <div className="statistics-container">
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <div 
                className="flex items-center gap-1 p-1 bg-[#2a2a2a] rounded-lg w-full sm:w-auto"
                role="tablist"
                aria-label="통계 분석 기간 선택"
              >
                {/* 주간 분석 탭 */}
                <button 
                  className={`px-3 py-2 sm:px-4 rounded-md text-xs sm:text-sm font-medium transition-all flex-1 sm:flex-none ${
                    analysisType === 'weekly' 
                      ? 'bg-[#a1a1aa] text-black' 
                      : 'bg-transparent text-[#a1a1aa] hover:bg-[#a1a1aa]/10 hover:text-white'
                  }`}
                  onClick={() => setAnalysisType('weekly')}
                  role="tab"
                  aria-selected={analysisType === 'weekly'}
                  aria-controls="statistics-content"
                  tabIndex={analysisType === 'weekly' ? 0 : -1}
                >
                  주간 분석
                </button>
                {/* 월간 분석 탭 */}
                <button 
                  className={`px-3 py-2 sm:px-4 rounded-md text-xs sm:text-sm font-medium transition-all flex-1 sm:flex-none ${
                    analysisType === 'monthly' 
                      ? 'bg-[#a1a1aa] text-black' 
                      : 'bg-transparent text-[#a1a1aa] hover:bg-[#a1a1aa]/10 hover:text-white'
                  }`}
                  onClick={() => setAnalysisType('monthly')}
                  role="tab"
                  aria-selected={analysisType === 'monthly'}
                  aria-controls="statistics-content"
                  tabIndex={analysisType === 'monthly' ? 0 : -1}
                >
                  월간 분석
                </button>
              </div>
            </div>

            <div className="statistics-content" id="statistics-content" role="tabpanel">
              {/* 기간 표시 및 차트 */}
              <div className="period-card">
                <div className="flex items-center justify-between mb-6">
                  <div className="period-title">
                    <h2>
                      {analysisType === 'weekly' 
                        ? `${currentDate.getMonth() + 1}월 ${getWeekOfMonth(currentDate)}주차` 
                        : `${currentDate.getFullYear()}년 ${currentDate.getMonth() + 1}월`}
                    </h2>
                  </div>
                  <div className="flex gap-2" role="group" aria-label="기간 네비게이션">
                    <button 
                      className="w-10 h-10 sm:w-8 sm:h-8 rounded-md bg-[#2a2a2a] border-none text-[#a1a1aa] flex items-center justify-center cursor-pointer transition-all hover:bg-[#3a3a3a] hover:text-white touch-manipulation" 
                      onClick={handlePrevPeriod}
                      aria-label={analysisType === 'weekly' ? '이전 주로 이동' : '이전 달로 이동'}
                      title={analysisType === 'weekly' ? '이전 주' : '이전 달'}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                        <path d="m15 18-6-6 6-6"/>
                      </svg>
                    </button>
                    <button 
                      className="w-10 h-10 sm:w-8 sm:h-8 rounded-md bg-[#2a2a2a] border-none text-[#a1a1aa] flex items-center justify-center cursor-pointer transition-all hover:bg-[#3a3a3a] hover:text-white touch-manipulation" 
                      onClick={handleNextPeriod}
                      aria-label={analysisType === 'weekly' ? '다음 주로 이동' : '다음 달로 이동'}
                      title={analysisType === 'weekly' ? '다음 주' : '다음 달'}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                        <path d="m9 18 6-6-6-6"/>
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 sm:gap-4 md:gap-8 min-h-[280px] mt-2">
                  {analysisType === 'weekly' ? (
                    <>
                      <div className="space-y-3">
                        <h4 className="text-xs sm:text-sm font-medium text-[#a1a1aa] mb-2 sm:mb-3" id="weekly-sleep-time-title">주간 수면 시간</h4>
                        <div 
                          role="img" 
                          aria-labelledby="weekly-sleep-time-title"
                          aria-describedby="weekly-sleep-time-desc"
                        >
                          {currentReport ? (
                            <SleepTimeChart 
                              data={chartData.timeChart}
                              isWeekly={true}
                              margin={{ top: 10, right: 30, left: 30, bottom: 30 }}
                            />
                          ) : (
                            <div className="flex items-center justify-center h-48 bg-[#1a1a1a] rounded-lg border border-[#2a2a2a]">
                              <div className="text-center">
                                <div className="text-[#a1a1aa] text-sm mb-2">데이터 없음</div>
                                <div className="text-[#666] text-xs">수면 기록이 없습니다</div>
                              </div>
                            </div>
                          )}
                        </div>
                        <div id="weekly-sleep-time-desc" className="sr-only">
                          주간 평균 수면 시간: {currentReport ? Math.round(currentReport.totalSleepTime / 60) : 0}시간
                        </div>
                      </div>
                      <div className="space-y-3">
                        <h4 className="text-xs sm:text-sm font-medium text-[#a1a1aa] mb-2 sm:mb-3" id="weekly-sleep-score-title">주간 수면 점수</h4>
                        <div 
                          role="img" 
                          aria-labelledby="weekly-sleep-score-title"
                          aria-describedby="weekly-sleep-score-desc"
                        >
                          {currentReport ? (
                            <SleepScoreChart 
                              data={chartData.scoreChart}
                            />
                          ) : (
                            <div className="flex items-center justify-center h-48 bg-[#1a1a1a] rounded-lg border border-[#2a2a2a]">
                              <div className="text-center">
                                <div className="text-[#a1a1aa] text-sm mb-2">데이터 없음</div>
                                <div className="text-[#666] text-xs">수면 기록이 없습니다</div>
                              </div>
                            </div>
                          )}
                        </div>
                        <div id="weekly-sleep-score-desc" className="sr-only">
                          주간 평균 수면 점수: {currentReport ? currentReport.score : 0}점
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="space-y-3">
                        <h4 className="text-xs sm:text-sm font-medium text-[#a1a1aa] mb-2 sm:mb-3" id="monthly-sleep-time-title">월간 수면 시간</h4>
                        <div 
                          role="img" 
                          aria-labelledby="monthly-sleep-time-title"
                          aria-describedby="monthly-sleep-time-desc"
                        >
                          {currentReport ? (
                            <SleepTimeChart 
                              data={chartData.timeChart}
                              isWeekly={false}
                            />
                          ) : (
                            <div className="flex items-center justify-center h-48 bg-[#1a1a1a] rounded-lg border border-[#2a2a2a]">
                              <div className="text-center">
                                <div className="text-[#a1a1aa] text-sm mb-2">데이터 없음</div>
                                <div className="text-[#666] text-xs">수면 기록이 없습니다</div>
                              </div>
                            </div>
                          )}
                        </div>
                        <div id="monthly-sleep-time-desc" className="sr-only">
                          월간 평균 수면 시간: {currentReport ? Math.round(currentReport.totalSleepTime / 60) : 0}시간
                        </div>
                      </div>
                      <div className="space-y-3">
                        <h4 className="text-xs sm:text-sm font-medium text-[#a1a1aa] mb-2 sm:mb-3" id="monthly-sleep-score-title">월간 수면 점수</h4>
                        <div 
                          role="img" 
                          aria-labelledby="monthly-sleep-score-title"
                          aria-describedby="monthly-sleep-score-desc"
                        >
                          {currentReport ? (
                            <SleepScoreChart 
                              data={chartData.scoreChart}
                              isWeekly={false}
                            />
                          ) : (
                            <div className="flex items-center justify-center h-48 bg-[#1a1a1a] rounded-lg border border-[#2a2a2a]">
                              <div className="text-center">
                                <div className="text-[#a1a1aa] text-sm mb-2">데이터 없음</div>
                                <div className="text-[#666] text-xs">수면 기록이 없습니다</div>
                              </div>
                            </div>
                          )}
                        </div>
                        <div id="monthly-sleep-score-desc" className="sr-only">
                          월간 평균 수면 점수: {currentReport ? currentReport.score : 0}점
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* 요약 카드 - 항상 표시 */}
              <div className="summary-card">
                <div className="card-header">
                  <h4>{analysisType === 'weekly' ? '주간' : '월간'} 수면 요약</h4>
                  <p>평균 수면 점수, 시간, 취침 시각</p>
                </div>
                <div className="summary-grid">
                  <div className="summary-item">
                    <div className="summary-icon blue">
                      <span>{currentReport ? currentReport.score : 0}</span>
                    </div>
                    <p className="summary-label">{analysisType === 'weekly' ? '주간 평균' : '월간 평균'} 수면 점수</p>
                    <p className="summary-change">{currentReport ? '점' : '데이터 없음'}</p>
                  </div>
                  <div className="summary-item">
                    <div className="summary-icon green">
                      <span>{currentReport ? Math.round(currentReport.totalSleepTime / 60) : 0}h</span>
                    </div>
                    <p className="summary-label">{analysisType === 'weekly' ? '주간 평균' : '월간 평균'} 수면 시간</p>
                    <p className="summary-change">{currentReport ? '시간' : '데이터 없음'}</p>
                  </div>
                  <div className="summary-item">
                    <div className="summary-icon orange">
                      <span>{currentReport ? currentReport.bedTime : '--:--'}</span>
                    </div>
                    <p className="summary-label">{analysisType === 'weekly' ? '주간 평균' : '월간 평균'} 취침 시각</p>
                    <p className="summary-change">{currentReport ? '시각' : '데이터 없음'}</p>
                  </div>
                </div>
              </div>

              {/* 수면 패턴 분석 - 항상 표시 */}
              <div className="patterns-card">
                <div className="card-header">
                <h4>{analysisType === 'weekly' ? '주간' : '월간'} 수면 패턴</h4>
                  <p>수면 단계별 평균 비율</p>
                </div>
                <div className="summary-grid">
                  <div className="summary-item">
                    <div className="summary-icon blue">
                      <span>{currentReport ? `${Math.round(currentReport.deepSleepRatio)}%` : '0%'}</span>
                    </div>
                    <p className="summary-label">평균 깊은 수면</p>
                    <p className="summary-change">{currentReport ? '정상 범위' : '데이터 없음'}</p>
                  </div>
                  <div className="summary-item">
                    <div className="summary-icon green">
                      <span>{currentReport ? `${Math.round(currentReport.lightSleepRatio)}%` : '0%'}</span>
                    </div>
                    <p className="summary-label">평균 얕은 수면</p>
                    <p className="summary-change">{currentReport ? '정상 범위' : '데이터 없음'}</p>
                  </div>
                  <div className="summary-item">
                    <div className="summary-icon orange">
                      <span>{currentReport ? `${Math.round(currentReport.remSleepRatio)}%` : '0%'}</span>
                    </div>
                    <p className="summary-label">평균 REM 수면</p>
                    <p className="summary-change">정상 범위</p>
                  </div>
                </div>
              </div>

              {/* 분석 결과 - 항상 표시 */}
              <div className="analysis-card">
                <div className="card-header">
                  <h4>분석 결과</h4>
                  <p>{analysisType === 'weekly' ? '이번 주' : '이번 달'} 수면 패턴 분석 결과</p>
                </div>
                <div className="analysis-list">
                  {currentReport ? (
                    <>
                      {currentReport.improvement && (
                        <div className="analysis-item">
                          <span className="analysis-badge improvement">개선</span>
                          <div className="analysis-content">
                            <p className="analysis-title">개선점</p>
                            <p className="analysis-description">{currentReport.improvement}</p>
                          </div>
                        </div>
                      )}
                      {currentReport.weakness && (
                        <div className="analysis-item">
                          <span className="analysis-badge warning">주의</span>
                          <div className="analysis-content">
                            <p className="analysis-title">약점</p>
                            <p className="analysis-description">{currentReport.weakness}</p>
                          </div>
                        </div>
                      )}
                      {currentReport.recommendation && (
                        <div className="analysis-item">
                          <span className="analysis-badge recommendation">권장</span>
                          <div className="analysis-content">
                            <p className="analysis-title">추천사항</p>
                            <p className="analysis-description">{currentReport.recommendation}</p>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="analysis-item">
                      <span className="analysis-badge analysis">분석</span>
                      <div className="analysis-content">
                        <p className="analysis-title">데이터 없음</p>
                        <p className="analysis-description">수면 기록이 없어 분석할 데이터가 없습니다.</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* 목표 및 성취 - 항상 표시 */}
              <div className="goals-card">
                <div className="card-header">
                  <h4>수면 목표 및 성취</h4>
                  <p>{analysisType === 'weekly' ? '이번 주' : '이번 달'} 목표 달성률</p>
                </div>
                <div className="goals-list">
                  <div className="goal-item">
                    <div className="goal-header">
                      <span className="goal-name">수면 시간 목표</span>
                      <span className="goal-progress">{currentReport ? '80%' : '0%'} 달성</span>
                    </div>
                    <div className="goal-bar">
                      <div 
                        className="goal-fill blue"
                        style={{ width: currentReport ? '80%' : '0%' }}
                      ></div>
                    </div>
                  </div>
                  <div className="goal-item">
                    <div className="goal-header">
                      <span className="goal-name">수면 점수 목표</span>
                      <span className="goal-progress">{currentReport ? '75%' : '0%'} 달성</span>
                    </div>
                    <div className="goal-bar">
                      <div 
                        className="goal-fill green"
                        style={{ width: currentReport ? '75%' : '0%' }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </Container>
    </div>
  );
};

export default StatisticsAnalysis;

