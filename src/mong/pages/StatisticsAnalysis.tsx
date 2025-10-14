import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Container from '../components/Container';
import NavBar from '../components/NavBar';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorBoundary from '../components/ErrorBoundary';
import SleepTimeChart from '../components/charts/SleepTimeChart';
import SleepScoreChart from '../components/charts/SleepScoreChart';
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
  const [currentDate, setCurrentDate] = useState(new Date(2025, 9, 1)); // 2025년 10월 1일 (9/29-10/5 주간 테스트)
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
        // 테스트용: 하드코딩된 사용자 ID 사용
        const testUserId = 'test-user-001';
        // 실제로는 비동기 API 호출이 될 수 있음
        await new Promise(resolve => setTimeout(resolve, 100));
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1;
        const records = getSleepRecordsByMonth(testUserId, year, month);
        console.log('로드된 수면 기록:', records.length, '개');
        console.log('날짜 범위:', year, '년', month, '월');
        setSleepRecords(records);
      } catch (error) {
        console.error('데이터 로드 오류:', error);
        setSleepRecords([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [currentDate]);

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
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-1 p-1 bg-[#2a2a2a] rounded-lg">
                <button 
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    analysisType === 'weekly' 
                      ? 'bg-[#a1a1aa] text-black' 
                      : 'bg-transparent text-[#a1a1aa] hover:bg-[#a1a1aa]/10 hover:text-white'
                  }`}
                  onClick={() => setAnalysisType('weekly')}
                >
                  주간 분석
                </button>
                <button 
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    analysisType === 'monthly' 
                      ? 'bg-[#a1a1aa] text-black' 
                      : 'bg-transparent text-[#a1a1aa] hover:bg-[#a1a1aa]/10 hover:text-white'
                  }`}
                  onClick={() => setAnalysisType('monthly')}
                >
                  월간 분석
                </button>
              </div>
            </div>

            <div className="statistics-content">
              {/* 기간 표시 및 차트 */}
              <div className="period-card">
                <div className="flex items-center justify-between mb-6">
                  <div className="period-title">
                    <h2>{currentData.period}</h2>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      className="w-8 h-8 rounded-md bg-[#2a2a2a] border-none text-[#a1a1aa] flex items-center justify-center cursor-pointer transition-all hover:bg-[#3a3a3a] hover:text-white" 
                      onClick={handlePrevPeriod}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="m15 18-6-6 6-6"/>
                      </svg>
                    </button>
                    <button 
                      className="w-8 h-8 rounded-md bg-[#2a2a2a] border-none text-[#a1a1aa] flex items-center justify-center cursor-pointer transition-all hover:bg-[#3a3a3a] hover:text-white" 
                      onClick={handleNextPeriod}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="m9 18 6-6-6-6"/>
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8 min-h-[280px] mt-2">
                  {analysisType === 'weekly' ? (
                    <>
                      <div className="space-y-3">
                        <h4 className="text-sm font-medium text-[#a1a1aa] mb-3">수면 시간 (시간)</h4>
                        <SleepTimeChart 
                          data={weeklyData.sleepTimeChart}
                          isWeekly={true}
                          margin={{ top: 10, right: 10, left: 30, bottom: 30 }}
                        />
                      </div>
                      <div className="space-y-3">
                        <h4 className="text-sm font-medium text-[#a1a1aa] mb-3">수면 점수</h4>
                        <SleepScoreChart 
                          data={weeklyData.sleepScoreChart}
                          isWeekly={true}
                          margin={{ top: 10, right: 10, left: 30, bottom: 30 }}
                          yAxisConfig={sleepScoreYAxis}
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="space-y-3">
                        <h4 className="text-sm font-medium text-[#a1a1aa] mb-3">월간 수면 시간 (시간)</h4>
                        <SleepTimeChart 
                          data={monthlyData.monthlyDailyChart.map(item => ({ date: item.date, hours: item.hours }))}
                          isWeekly={false}
                          margin={{ top: 10, right: 10, left: 30, bottom: 30 }}
                        />
                      </div>
                      <div className="space-y-3">
                        <h4 className="text-sm font-medium text-[#a1a1aa] mb-3">월간 수면 점수</h4>
                        <SleepScoreChart 
                          data={monthlyData.monthlyDailyChart.map(item => ({ date: item.date, score: item.score }))}
                          isWeekly={false}
                          margin={{ top: 10, right: 10, left: 30, bottom: 30 }}
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* 요약 카드 */}
              <div className="summary-card">
                <div className="card-header">
                  <h4>{analysisType === 'weekly' ? '주간' : '월간'} 수면 요약</h4>
                  <p>{analysisType === 'weekly' ? '이번 주' : '이번 달'} 수면 패턴 분석</p>
                </div>
                <div className="summary-grid">
                  <div className="summary-item">
                    <div className="summary-icon blue">
                      <span>{currentData.summary.avgScore}</span>
                    </div>
                    <p className="summary-label">{analysisType === 'weekly' ? '평균' : '월 평균'} 수면 점수</p>
                    <p className="summary-change">{currentData.summary.scoreChange}</p>
                  </div>
                  <div className="summary-item">
                    <div className="summary-icon green">
                      <span>{currentData.summary.avgHours}h</span>
                    </div>
                    <p className="summary-label">{analysisType === 'weekly' ? '평균' : '월 평균'} 수면 시간</p>
                    <p className="summary-change">{currentData.summary.hoursStatus}</p>
                  </div>
                  <div className="summary-item">
                    <div className="summary-icon orange">
                      <span>{currentData.summary.avgBedtime}</span>
                    </div>
                    <p className="summary-label">{analysisType === 'weekly' ? '평균' : '월 평균'} 취침 시간</p>
                    <p className="summary-change">{currentData.summary.bedtimeStatus}</p>
                  </div>
                </div>
              </div>

              {/* 수면 패턴 분석 */}
              <div className="patterns-card">
                <div className="card-header">
                  <h4>수면 패턴 분석</h4>
                  <p>{analysisType === 'weekly' ? '이번 주' : '이번 달'} 상세 분석</p>
                </div>
                <div className="patterns-grid">
                  <div className="pattern-item">
                    <div className="pattern-icon blue">
                      <span>{currentData.patterns.deepSleep}</span>
                    </div>
                    <p className="pattern-label">평균 깊은 수면</p>
                    <p className="pattern-status">정상 범위</p>
                  </div>
                  <div className="pattern-item">
                    <div className="pattern-icon green">
                      <span>{currentData.patterns.lightSleep}</span>
                    </div>
                    <p className="pattern-label">평균 얕은 수면</p>
                    <p className="pattern-status">정상 범위</p>
                  </div>
                  <div className="pattern-item">
                    <div className="pattern-icon purple">
                      <span>{currentData.patterns.remSleep}</span>
                    </div>
                    <p className="pattern-label">평균 REM 수면</p>
                    <p className="pattern-status">정상 범위</p>
                  </div>
                  <div className="pattern-item">
                    <div className="pattern-icon orange">
                      <span>{currentData.patterns.avgBedtime}</span>
                    </div>
                    <p className="pattern-label">평균 취침시간</p>
                    <p className="pattern-status">
                      {analysisType === 'weekly' ? '목표보다 25분 늦음' : '목표보다 30분 늦음'}
                    </p>
                  </div>
                </div>
              </div>

              {/* 분석 결과 */}
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

              {/* 목표 및 성취 */}
              <div className="goals-card">
                <div className="card-header">
                  <h4>수면 목표 및 성취</h4>
                  <p>{analysisType === 'weekly' ? '이번 주' : '이번 달'} 목표 달성률</p>
                </div>
                <div className="goals-list">
                  {currentData.goals.map((goal, index) => (
                    <div key={index} className="goal-item">
                      <div className="goal-header">
                        <span className="goal-name">{goal.name}</span>
                        <span className="goal-progress">{goal.progress}% 달성</span>
                      </div>
                      <div className="goal-bar">
                        <div 
                          className={`goal-fill ${goal.color}`}
                          style={{ width: `${goal.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
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

