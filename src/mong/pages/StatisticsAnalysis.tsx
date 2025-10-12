import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Container from '../components/Container';
import NavBar from '../components/NavBar';
import { useAuth, useUserProfile } from '../store/hooks';
import { getSleepRecordsByMonth } from '../sleepData';
import { analyzeWeeklyData, analyzeMonthlyData } from '../utils/statisticsCalculations';
import { DailySleepRecord } from '../types/sleepData';
import '../styles/statistics.css';
import '../styles/profile.css';

const StatisticsAnalysis: React.FC = () => {
  const navigate = useNavigate();
  const [analysisType, setAnalysisType] = useState<'weekly' | 'monthly'>('weekly');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [sleepRecords, setSleepRecords] = useState<DailySleepRecord[]>([]);
  const { user } = useAuth();
  const { profile } = useUserProfile();

  const handleStartSleepRecord = () => {
    // 수면 기록 시작 로직
    console.log('수면 기록 시작');
  };

  const handleLogout = () => {
    // 로그아웃 로직
    console.log('로그아웃');
    navigate('/login');
  };

  const handleDateClick = (date: string) => {
    navigate(`/daily-report/${date}`);
  };

  // 데이터 로드
  useEffect(() => {
    if (user?.id) {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;
      const records = getSleepRecordsByMonth(user.id, year, month);
      setSleepRecords(records);
    }
  }, [user?.id, currentDate]);

  // 실제 사용자 프로필 정보 사용
  const currentUserProfile = {
    name: profile?.name || user?.name || '사용자',
    avatar: '',
    email: profile?.email || user?.email || ''
  };

  // 실제 데이터로 계산된 주간/월간 데이터
  const weeklyData = analyzeWeeklyData(sleepRecords, currentDate);
  const monthlyData = analyzeMonthlyData(sleepRecords, currentDate.getFullYear(), currentDate.getMonth() + 1);

  const currentData = analysisType === 'weekly' ? weeklyData : monthlyData;

  // 수면 점수 차트의 Y축 설정을 동적으로 계산
  const getSleepScoreYAxisConfig = () => {
    const scores = weeklyData.sleepScoreChart.map(item => item.score).filter(score => score > 0);
    
    if (scores.length === 0) {
      return { domain: [0, 100], ticks: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100] };
    }

    const minScore = Math.min(...scores);
    const maxScore = Math.max(...scores);

    // 최솟값이 50 이상인 경우: 50~100
    if (minScore >= 50) {
      return { domain: [50, 100], ticks: [50, 60, 70, 80, 90, 100] };
    }
    
    // 최댓값이 50 미만인 경우: 0~50
    if (maxScore < 50) {
      return { domain: [0, 50], ticks: [0, 10, 20, 30, 40, 50] };
    }
    
    // 이외의 경우: 0~100
    return { domain: [0, 100], ticks: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100] };
  };

  const sleepScoreYAxis = getSleepScoreYAxisConfig();

  // 날짜 네비게이션 핸들러
  const handlePrevPeriod = () => {
    const newDate = new Date(currentDate);
    if (analysisType === 'weekly') {
      newDate.setDate(newDate.getDate() - 7);
    } else {
      newDate.setMonth(newDate.getMonth() - 1);
    }
    setCurrentDate(newDate);
  };

  const handleNextPeriod = () => {
    const newDate = new Date(currentDate);
    if (analysisType === 'weekly') {
      newDate.setDate(newDate.getDate() + 7);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

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
            <div className="statistics-header">
              <div className="analysis-toggle">
                <button 
                  className={`toggle-btn ${analysisType === 'weekly' ? 'active' : ''}`}
                  onClick={() => setAnalysisType('weekly')}
                >
                  주간 분석
                </button>
                <button 
                  className={`toggle-btn ${analysisType === 'monthly' ? 'active' : ''}`}
                  onClick={() => setAnalysisType('monthly')}
                >
                  월간 분석
                </button>
              </div>
            </div>

            <div className="statistics-content">
              {/* 기간 표시 및 차트 */}
              <div className="period-card">
                <div className="period-header">
                  <div className="period-title">
                    <h2>{currentData.period}</h2>
                  </div>
                  <div className="period-nav">
                    <button className="nav-btn" onClick={handlePrevPeriod}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="m15 18-6-6 6-6"/>
                      </svg>
                    </button>
                    <button className="nav-btn" onClick={handleNextPeriod}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="m9 18 6-6-6-6"/>
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="charts-grid">
                  {analysisType === 'weekly' ? (
                    <>
                      <div className="chart-section">
                        <h4>수면 시간 (시간)</h4>
                        <div className="chart-container">
                          <ResponsiveContainer width="100%" height={200}>
                            <BarChart data={weeklyData.sleepTimeChart} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                              <XAxis 
                                dataKey="day" 
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 12, fill: '#a1a1aa' }}
                              />
                              <YAxis 
                                domain={[6, 9]}
                                tickCount={5}
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 12, fill: '#a1a1aa' }}
                              />
                              <Tooltip 
                                contentStyle={{
                                  backgroundColor: '#1a1a1a',
                                  border: '1px solid #2a2a2a',
                                  borderRadius: '8px',
                                  color: '#ffffff'
                                }}
                                labelStyle={{ color: '#ffffff' }}
                                formatter={(value: number) => [`${value}시간`, '수면 시간']}
                              />
                              <Bar 
                                dataKey="hours" 
                                fill="url(#sleepTimeGradient)"
                                radius={[4, 4, 0, 0]}
                              />
                              <defs>
                                <linearGradient id="sleepTimeGradient" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="0%" stopColor="#00d4aa" />
                                  <stop offset="100%" stopColor="#00b894" />
                                </linearGradient>
                              </defs>
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                      <div className="chart-section">
                        <h4>수면 점수</h4>
                        <div className="chart-container">
                          <ResponsiveContainer width="100%" height={200}>
                            <BarChart data={weeklyData.sleepScoreChart} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                              <XAxis 
                                dataKey="day" 
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 12, fill: '#a1a1aa' }}
                              />
                              <YAxis 
                                domain={sleepScoreYAxis.domain}
                                ticks={sleepScoreYAxis.ticks}
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 12, fill: '#a1a1aa' }}
                              />
                              <Tooltip 
                                contentStyle={{
                                  backgroundColor: '#1a1a1a',
                                  border: '1px solid #2a2a2a',
                                  borderRadius: '8px',
                                  color: '#ffffff'
                                }}
                                labelStyle={{ color: '#ffffff' }}
                                formatter={(value: number) => [`${value}점`, '수면 점수']}
                              />
                              <Bar 
                                dataKey="score" 
                                fill="url(#sleepScoreGradient)"
                                radius={[4, 4, 0, 0]}
                                maxBarSize={40}
                              />
                              <defs>
                                <linearGradient id="sleepScoreGradient" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="0%" stopColor="#3b82f6" />
                                  <stop offset="100%" stopColor="#2563eb" />
                                </linearGradient>
                              </defs>
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="chart-section">
                        <h4>주간 평균 수면 시간 (시간)</h4>
                        <div className="chart-container">
                          <ResponsiveContainer width="100%" height={200}>
                            <LineChart data={monthlyData.weeklyAvgChart} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                              <XAxis 
                                dataKey="week" 
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 12, fill: '#a1a1aa' }}
                              />
                              <YAxis 
                                domain={[6.5, 8]}
                                tickCount={5}
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 12, fill: '#a1a1aa' }}
                              />
                              <Tooltip 
                                contentStyle={{
                                  backgroundColor: '#1a1a1a',
                                  border: '1px solid #2a2a2a',
                                  borderRadius: '8px',
                                  color: '#ffffff'
                                }}
                                labelStyle={{ color: '#ffffff' }}
                                formatter={(value: number) => [`${value}시간`, '수면 시간']}
                              />
                              <Line 
                                type="monotone" 
                                dataKey="hours" 
                                stroke="#00d4aa" 
                                strokeWidth={3}
                                dot={{ fill: '#00d4aa', strokeWidth: 2, r: 4 }}
                                activeDot={{ r: 6, stroke: '#00d4aa', strokeWidth: 2, fill: '#00d4aa' }}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                      <div className="chart-section">
                        <h4>주간 평균 수면 점수</h4>
                        <div className="chart-container">
                          <ResponsiveContainer width="100%" height={200}>
                            <LineChart data={monthlyData.weeklyAvgChart} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                              <XAxis 
                                dataKey="week" 
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 12, fill: '#a1a1aa' }}
                              />
                              <YAxis 
                                domain={[75, 90]}
                                tickCount={4}
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 12, fill: '#a1a1aa' }}
                              />
                              <Tooltip 
                                contentStyle={{
                                  backgroundColor: '#1a1a1a',
                                  border: '1px solid #2a2a2a',
                                  borderRadius: '8px',
                                  color: '#ffffff'
                                }}
                                labelStyle={{ color: '#ffffff' }}
                                formatter={(value: number) => [`${value}점`, '수면 점수']}
                              />
                              <Line 
                                type="monotone" 
                                dataKey="score" 
                                stroke="#3b82f6" 
                                strokeWidth={3}
                                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                                activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2, fill: '#3b82f6' }}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
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

