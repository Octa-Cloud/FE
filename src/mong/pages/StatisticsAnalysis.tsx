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
import { getSleepRecordsByMonth } from '../sleepData';
import { analyzeWeeklyData, analyzeMonthlyData } from '../utils/statisticsCalculations';
import { DailySleepRecord } from '../types/sleepData';
import { CHART_CONFIG } from '../constants/sleep';
import '../styles/statistics.css';
import '../styles/profile.css';

const StatisticsAnalysis: React.FC = () => {
  const navigate = useNavigate();
  const [analysisType, setAnalysisType] = useState<'weekly' | 'monthly'>('weekly');
  // 오늘 날짜를 기준으로 "이번 주"/"이번 달"을 계산하도록 현재 날짜 기본값 설정
  const [currentDate, setCurrentDate] = useState(new Date());
  const [sleepRecords, setSleepRecords] = useState<DailySleepRecord[]>([]);
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
        // 현재 로그인된 사용자 ID 사용
        const currentUserId = user?.id || profile?.id;
        if (!currentUserId) {
          console.warn('사용자 ID가 없습니다.');
          setSleepRecords([]);
          return;
        }
        
        // 실제로는 비동기 API 호출이 될 수 있음
        await new Promise(resolve => setTimeout(resolve, 100));
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1;
        const records = getSleepRecordsByMonth(currentUserId, year, month);
        console.log('로드된 수면 기록:', records.length, '개');
        console.log('날짜 범위:', year, '년', month, '월');
        console.log('사용자 ID:', currentUserId);
        setSleepRecords(records);
      } catch (error) {
        console.error('데이터 로드 오류:', error);
        setSleepRecords([]);
      } finally {
        setIsLoading(false);
      }
    }
    
    loadData();
  }, [currentDate, user?.id, profile?.id]);

  // 실제 사용자 프로필 정보 사용 - 메모이제이션
  const currentUserProfile = useMemo(() => ({
    name: profile?.name || user?.name || '사용자',
    avatar: '',
    email: profile?.email || user?.email || ''
  }), [profile?.name, profile?.email, user?.name, user?.email]);

  // 실제 데이터로 계산된 주간/월간 데이터 - 메모이제이션
  const weeklyData = useMemo(() => 
    analyzeWeeklyData(sleepRecords, currentDate),
    [sleepRecords, currentDate]
  );
  
  const monthlyData = useMemo(() => 
    analyzeMonthlyData(sleepRecords, currentDate.getFullYear(), currentDate.getMonth() + 1),
    [sleepRecords, currentDate]
  );

  const currentData = useMemo(() => 
    analysisType === 'weekly' ? weeklyData : monthlyData,
    [analysisType, weeklyData, monthlyData]
  );

  // 수면 점수 차트의 Y축 설정을 동적으로 계산 - 메모이제이션
  const sleepScoreYAxis = useMemo(() => {
    const scores = weeklyData.sleepScoreChart.map(item => item.score).filter(score => score > 0);
    
    if (scores.length === 0) {
      return { domain: [0, 100] as [number, number], ticks: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100] };
    }

    const minScore = Math.min(...scores);
    const maxScore = Math.max(...scores);

    // 최솟값이 50 이상인 경우: 50~100
    if (minScore >= 50) {
      return { domain: [50, 100] as [number, number], ticks: [50, 60, 70, 80, 90, 100] };
    }
    
    // 최댓값이 50 미만인 경우: 0~50
    if (maxScore < 50) {
      return { domain: [0, 50] as [number, number], ticks: [0, 10, 20, 30, 40, 50] };
    }
    
    // 이외의 경우: 0~100
    return { domain: [0, 100] as [number, number], ticks: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100] };
  }, [weeklyData.sleepScoreChart]);

  // 월간 차트 데이터 메모이제이션 - 불필요한 재계산 방지
  const monthlyTimeChartData = useMemo(() => 
    monthlyData.monthlyDailyChart.map(item => ({ 
      date: item.date, 
      hours: item.hours 
    })),
    [monthlyData.monthlyDailyChart]
  );

  const monthlyScoreChartData = useMemo(() => 
    monthlyData.monthlyDailyChart.map(item => ({ 
      date: item.date, 
      score: item.score 
    })),
    [monthlyData.monthlyDailyChart]
  );

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
                    <h2>{currentData.period}</h2>
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

                {sleepRecords.length === 0 ? (
                  <EmptyState 
                    type={analysisType}
                    onStartSleepRecord={handleStartSleepRecord}
                  />
                ) : (
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
                            <SleepTimeChart 
                              data={weeklyData.sleepTimeChart}
                              isWeekly={true}
                              margin={{ top: 10, right: 30, left: 30, bottom: 30 }}
                            />
                          </div>
                          <div id="weekly-sleep-time-desc" className="sr-only">
                            주간 평균 수면 시간: {currentData.summary.avgHours}시간
                          </div>
                        </div>
                        <div className="space-y-3">
                          <h4 className="text-xs sm:text-sm font-medium text-[#a1a1aa] mb-2 sm:mb-3" id="weekly-sleep-score-title">주간 수면 점수</h4>
                          <div 
                            role="img" 
                            aria-labelledby="weekly-sleep-score-title"
                            aria-describedby="weekly-sleep-score-desc"
                          >
                            <SleepScoreChart 
                              data={weeklyData.sleepScoreChart}
                            />
                          </div>
                          <div id="weekly-sleep-score-desc" className="sr-only">
                            주간 평균 수면 점수: {currentData.summary.avgScore}점
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
                            <SleepTimeChart 
                              data={monthlyTimeChartData}
                              isWeekly={false}
                            />
                          </div>
                          <div id="monthly-sleep-time-desc" className="sr-only">
                            월간 평균 수면 시간: {currentData.summary.avgHours}시간
                          </div>
                        </div>
                        <div className="space-y-3">
                          <h4 className="text-xs sm:text-sm font-medium text-[#a1a1aa] mb-2 sm:mb-3" id="monthly-sleep-score-title">월간 수면 점수</h4>
                          <div 
                            role="img" 
                            aria-labelledby="monthly-sleep-score-title"
                            aria-describedby="monthly-sleep-score-desc"
                          >
                            <SleepScoreChart 
                              data={monthlyScoreChartData}
                              isWeekly={false}
                            />
                          </div>
                          <div id="monthly-sleep-score-desc" className="sr-only">
                            월간 평균 수면 점수: {currentData.summary.avgScore}점
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* 요약 카드 - 데이터가 있을 때만 표시 */}
              {sleepRecords.length > 0 && (
              <div className="summary-card">
                <div className="card-header">
                  <h4>{analysisType === 'weekly' ? '주간' : '월간'} 수면 요약</h4>
                  <p>평균 수면 점수, 시간, 취침 시각</p>
                </div>
                <div className="summary-grid">
                  <div className="summary-item">
                    <div className="summary-icon blue">
                      <span>{currentData.summary.avgScore}</span>
                    </div>
                    <p className="summary-label">{analysisType === 'weekly' ? '주간 평균' : '월간 평균'} 수면 점수</p>
                    <p className="summary-change">{currentData.summary.scoreChange}</p>
                  </div>
                  <div className="summary-item">
                    <div className="summary-icon green">
                      <span>{currentData.summary.avgHours}h</span>
                    </div>
                    <p className="summary-label">{analysisType === 'weekly' ? '주간 평균' : '월간 평균'} 수면 시간</p>
                    <p className="summary-change">{currentData.summary.hoursStatus}</p>
                  </div>
                  <div className="summary-item">
                    <div className="summary-icon orange">
                      <span>{currentData.summary.avgBedtime}</span>
                    </div>
                    <p className="summary-label">{analysisType === 'weekly' ? '주간 평균' : '월간 평균'} 취침 시각</p>
                    <p className="summary-change">{currentData.summary.bedtimeStatus}</p>
                  </div>
                </div>
              </div>
              )}

              {/* 수면 패턴 분석 - 데이터가 있을 때만 표시 */}
              {sleepRecords.length > 0 && (
              <div className="patterns-card">
                <div className="card-header">
                <h4>{analysisType === 'weekly' ? '주간' : '월간'} 수면 패턴</h4>
                  <p>수면 단계별 평균 비율</p>
                </div>
                <div className="summary-grid">
                  <div className="summary-item">
                    <div className="summary-icon blue">
                      <span>{currentData.patterns.deepSleep}</span>
                    </div>
                    <p className="summary-label">평균 깊은 수면</p>
                    <p className="summary-change">정상 범위</p>
                  </div>
                  <div className="summary-item">
                    <div className="summary-icon green">
                      <span>{currentData.patterns.lightSleep}</span>
                    </div>
                    <p className="summary-label">평균 얕은 수면</p>
                    <p className="summary-change">정상 범위</p>
                  </div>
                  <div className="summary-item">
                    <div className="summary-icon orange">
                      <span>{currentData.patterns.remSleep}</span>
                    </div>
                    <p className="summary-label">평균 REM 수면</p>
                    <p className="summary-change">정상 범위</p>
                  </div>
                </div>
              </div>
              )}

              {/* 분석 결과 - 데이터가 있을 때만 표시 */}
              {sleepRecords.length > 0 && (
              <div className="analysis-card">
                <div className="card-header">
                  <h4>분석 결과</h4>
                  <p>{analysisType === 'weekly' ? '이번 주' : '이번 달'} 수면 패턴 분석 결과</p>
                </div>
                <div className="analysis-list">
                  {currentData.analysis.map((item, index) => (
                    <div key={index} className="analysis-item">
                      <span className={`analysis-badge ${item.type}`}>
                        {item.type === 'improvement' && '개선'}
                        {item.type === 'warning' && '주의'}
                        {item.type === 'recommendation' && '권장'}
                        {item.type === 'analysis' && '분석'}
                      </span>
                      <div className="analysis-content">
                        <p className="analysis-title">{item.title}</p>
                        <p className="analysis-description">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              )}

              {/* AI 예측 및 목표 - 데이터가 있을 때만 표시 */}
              {sleepRecords.length > 0 && (
              <div className="ai-prediction-card">
                <div className="card-header">
                  <div className="header-content">
                    <div className="header-icon">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 3v18h18"/>
                        <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"/>
                        <path d="M15 8h3v3"/>
                      </svg>
                    </div>
                    <h4>AI 예측 및 목표</h4>
                  </div>
                  <p>현재 패턴을 기반으로 한 AI 분석 결과, 아래 개선사항을 실천하시면 4-6주 내에 수면 점수를 85점에서 90점으로 향상 시킬 수 있을 것으로 예측됩니다.</p>
                </div>
                <div className="prediction-chart-container">
                  <div className="prediction-chart">
                    <div className="chart-content">
                      <div className="chart-y-axis">
                        <div className="y-label">92</div>
                        <div className="y-label">89</div>
                        <div className="y-label">86</div>
                        <div className="y-label">83</div>
                        <div className="y-label">80</div>
                      </div>
                      <div className="chart-area">
                        <div className="chart-lines">
                          <svg className="prediction-svg" viewBox="-50 -30 550 250" preserveAspectRatio="none">
                            {/* 격자 시스템: Y축 5개 라벨 (92, 89, 86, 83, 80) = 5개 수평선 */}
                            {/* 격자 시스템: X축 6개 라벨 (1주전, 현재, 1주후, 2주후, 3주후, 4주후) = 6개 수직선 */}
                            
                            {/* 좌표축 - X축과 Y축 화살표 실선 */}
                            {/* Y축 (세로축) - 아래에서 위로 화살표 */}
                            <line x1="0" y1="200" x2="0" y2="10" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
                            <polygon points="0,10 -6,22 6,22" fill="#ffffff" />
                            
                            {/* X축 (가로축) - 왼쪽에서 오른쪽으로 화살표 */}
                            <line x1="0" y1="200" x2="500" y2="200" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
                            <polygon points="500,200 488,194 488,206" fill="#ffffff" />
                            
                            {/* Y축 수평 격자선 - 5개 (Y축 라벨 개수만큼) */}
                            <line x1="0" y1="0" x2="500" y2="0" stroke="#3a3a3a" strokeWidth="1" strokeDasharray="4 4" opacity="0.6" />
                            <line x1="0" y1="50" x2="500" y2="50" stroke="#3a3a3a" strokeWidth="1" strokeDasharray="4 4" opacity="0.6" />
                            <line x1="0" y1="100" x2="500" y2="100" stroke="#3a3a3a" strokeWidth="1" strokeDasharray="4 4" opacity="0.6" />
                            <line x1="0" y1="150" x2="500" y2="150" stroke="#3a3a3a" strokeWidth="1" strokeDasharray="4 4" opacity="0.6" />
                            <line x1="0" y1="200" x2="500" y2="200" stroke="#3a3a3a" strokeWidth="1" strokeDasharray="4 4" opacity="0.6" />
                            
                            {/* X축 수직 격자선 - 6개 (1주 전이 Y축에 완전히 붙어있음) */}
                            <line x1="0" y1="0" x2="0" y2="200" stroke="#3a3a3a" strokeWidth="1" strokeDasharray="4 4" opacity="0.6" />
                            <line x1="100" y1="0" x2="100" y2="200" stroke="#a1a1aa" strokeWidth="1" strokeDasharray="4 4" opacity="0.75" />
                            <line x1="200" y1="0" x2="200" y2="200" stroke="#3a3a3a" strokeWidth="1" strokeDasharray="4 4" opacity="0.6" />
                            <line x1="300" y1="0" x2="300" y2="200" stroke="#3a3a3a" strokeWidth="1" strokeDasharray="4 4" opacity="0.6" />
                            <line x1="400" y1="0" x2="400" y2="200" stroke="#3a3a3a" strokeWidth="1" strokeDasharray="4 4" opacity="0.6" />
                            <line x1="500" y1="0" x2="500" y2="200" stroke="#3a3a3a" strokeWidth="1" strokeDasharray="4 4" opacity="0.6" />
                            
                            {/* 데이터 라인 및 포인트 */}
                            {/* Y축 좌표 계산: (92-value) * 200 / (92-80) = (92-value) * 16.67 */}
                            {/* 점수 80 = y:200, 점수 83 = y:150, 점수 86 = y:100, 점수 89 = y:50, 점수 92 = y:0 */}
                            
                            {/* 과거 데이터 (실제 성과) - 1주 전: 83점, 현재: 85점 */}
                            <path 
                              d="M 0 150 L 100 116.67" 
                              stroke="#22c55e" 
                              strokeWidth="3" 
                              fill="none"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            
                            {/* 미래 예측 (AI 예측) - 1주후: 87점, 2주후: 89점, 3주후: 91점, 4주후: 92점 */}
                            <path 
                              d="M 200 83.33 L 300 50 L 400 16.67 L 500 0" 
                              stroke="#3b82f6" 
                              strokeWidth="3" 
                              strokeDasharray="8 4"
                              fill="none"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            
                            {/* 데이터 포인트 */}
                            {/* 1주 전 (83점) - Y축에 완전히 붙어있음 */}
                            <circle cx="0" cy="150" r="5" fill="#22c55e" stroke="#1a1a1a" strokeWidth="2" />
                            {/* 현재 (85점) */}
                            <circle cx="100" cy="116.67" r="5" fill="#22c55e" stroke="#1a1a1a" strokeWidth="2" />
                            {/* 1주 후 (87점 예측) */}
                            <circle cx="200" cy="83.33" r="5" fill="#3b82f6" stroke="#1a1a1a" strokeWidth="2" />
                            {/* 2주 후 (89점 예측) */}
                            <circle cx="300" cy="50" r="5" fill="#3b82f6" stroke="#1a1a1a" strokeWidth="2" />
                            {/* 3주 후 (91점 예측) */}
                            <circle cx="400" cy="16.67" r="5" fill="#3b82f6" stroke="#1a1a1a" strokeWidth="2" />
                            {/* 4주 후 (92점 예측) */}
                            <circle cx="500" cy="0" r="5" fill="#3b82f6" stroke="#1a1a1a" strokeWidth="2" />
                            
                            {/* '현재' 텍스트 레이블 - 그래프와 겹치지 않도록 위치 조정 */}
                            <text x="100" y="130" className="current-label">현재</text>
                            
                            {/* 축 라벨 */}
                            {/* Y축 라벨 (수면 점수) - 한 글자씩 세로로 배치, X축과 동일한 간격 */}
                            <text x="-30" y="85" className="axis-label-vertical" textAnchor="middle">수</text>
                            <text x="-30" y="100" className="axis-label-vertical" textAnchor="middle">면</text>
                            <text x="-30" y="115" className="axis-label-vertical" textAnchor="middle">점</text>
                            <text x="-30" y="130" className="axis-label-vertical" textAnchor="middle">수</text>
                            
                            {/* X축 라벨 (시간) */}
                            <text x="250" y="220" className="axis-label" textAnchor="middle">시간</text>
                          </svg>
                        </div>
                        <div className="chart-x-axis">
                          <div className="x-label">1주 전</div>
                          <div className="x-label current">현재</div>
                          <div className="x-label">1주 후</div>
                          <div className="x-label">2주 후</div>
                          <div className="x-label">3주 후</div>
                          <div className="x-label">4주 후</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              )}
            </div>
          </div>
        </main>
      </Container>
    </div>
  );
};

export default StatisticsAnalysis;

