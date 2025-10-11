import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Container from '../components/Container';
import NavBar from '../components/NavBar';
import { useAuth, useUserProfile } from '../store/hooks';
import '../styles/statistics.css';
import '../styles/profile.css';

const StatisticsAnalysis: React.FC = () => {
  const navigate = useNavigate();
  const [analysisType, setAnalysisType] = useState<'weekly' | 'monthly'>('weekly');
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

  // 실제 사용자 프로필 정보 사용
  const currentUserProfile = {
    name: profile?.name || user?.name || '사용자',
    avatar: '',
    email: profile?.email || user?.email || ''
  };

  // 주간 데이터
  const weeklyData = {
    period: '이번 주 10/6 - 10/12',
    sleepTimeChart: [
      { day: '월', hours: 7.5 },
      { day: '화', hours: 6.5 },
      { day: '수', hours: 8.5 },
      { day: '목', hours: 7.0 },
      { day: '금', hours: 6.5 },
      { day: '토', hours: 9.0 },
      { day: '일', hours: 9.0 }
    ],
    sleepScoreChart: [
      { day: '월', score: 75 },
      { day: '화', score: 70 },
      { day: '수', score: 95 },
      { day: '목', score: 82 },
      { day: '금', score: 70 },
      { day: '토', score: 95 },
      { day: '일', score: 90 }
    ],
    summary: {
      avgScore: 77,
      avgHours: 7.3,
      avgBedtime: '23:20',
      scoreChange: '+3점',
      hoursStatus: '목표 달성',
      bedtimeStatus: '목표보다 20분 늦음'
    },
    patterns: {
      deepSleep: '25%',
      lightSleep: '55%',
      remSleep: '20%',
      avgBedtime: '23:25'
    },
    analysis: [
      {
        type: 'improvement',
        title: '취침 시간 일관성 향상',
        description: '이번 주 취침 시간 편차가 지난 주보다 15분 줄어들었습니다.'
      },
      {
        type: 'warning',
        title: '금요일 수면 부족',
        description: '금요일 수면 시간이 6.5시간으로 권장량보다 부족합니다.'
      },
      {
        type: 'recommendation',
        title: '주말 수면 패턴 우수',
        description: '주말 수면 시간과 점수가 매우 좋습니다. 평일에도 유지해보세요.'
      }
    ],
    goals: [
      { name: '수면 시간 목표 (8시간)', progress: 75, color: 'primary' },
      { name: '수면 점수 목표 (90점)', progress: 85, color: 'blue' },
      { name: '취침 시간 일관성', progress: 92, color: 'green' }
    ]
  };

  // 월간 데이터
  const monthlyData = {
    period: '2025년 10월',
    weeklyAvgChart: [
      { week: '1주차', hours: 7.2, score: 82 },
      { week: '2주차', hours: 6.9, score: 78 },
      { week: '3주차', hours: 7.5, score: 85 },
      { week: '4주차', hours: 7.0, score: 80 }
    ],
    summary: {
      avgScore: 83,
      avgHours: 7.4,
      avgBedtime: '23:15',
      scoreChange: '+5점',
      hoursStatus: '목표 달성',
      bedtimeStatus: '목표보다 15분 늦음'
    },
    patterns: {
      deepSleep: '24%',
      lightSleep: '54%',
      remSleep: '20%',
      avgBedtime: '23:30'
    },
    analysis: [
      {
        type: 'improvement',
        title: '월간 수면 점수 상승 추세',
        description: '이번 달 평균 수면 점수가 전월 대비 5점 상승했습니다.'
      },
      {
        type: 'analysis',
        title: '3주차 일시적 하락',
        description: '3주차에 수면 점수가 일시적으로 하락했지만 4주차에 회복했습니다.'
      },
      {
        type: 'improvement',
        title: '다음 달 목표 설정',
        description: '현재 추세를 유지하면 다음 달 평균 85점 달성이 가능합니다.'
      }
    ],
    goals: [
      { name: '수면 시간 목표 (8시간)', progress: 78, color: 'primary' },
      { name: '수면 점수 목표 (90점)', progress: 82, color: 'blue' },
      { name: '취침 시간 일관성', progress: 88, color: 'green' }
    ]
  };

  const currentData = analysisType === 'weekly' ? weeklyData : monthlyData;

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
                    <button className="nav-btn">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="m15 18-6-6 6-6"/>
                      </svg>
                    </button>
                    <button className="nav-btn">
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
                          <div className="chart-bars">
                            {weeklyData.sleepTimeChart.map((item, index) => (
                              <div key={index} className="bar-container">
                                <div 
                                  className="bar sleep-time-bar"
                                  style={{ height: `${(item.hours / 9) * 100}%` }}
                                ></div>
                                <span className="bar-label">{item.day}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="chart-section">
                        <h4>수면 점수</h4>
                        <div className="chart-container">
                          <div className="chart-bars">
                            {weeklyData.sleepScoreChart.map((item, index) => (
                              <div key={index} className="bar-container">
                                <div 
                                  className="bar sleep-score-bar"
                                  style={{ height: `${(item.score / 100) * 100}%` }}
                                ></div>
                                <span className="bar-label">{item.day}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="chart-section">
                        <h4>주간 평균 수면 시간 (시간)</h4>
                        <div className="chart-container">
                          <div className="line-chart">
                            {monthlyData.weeklyAvgChart.map((item, index) => (
                              <div key={index} className="line-point">
                                <div 
                                  className="point"
                                  style={{ bottom: `${(item.hours / 8) * 100}%` }}
                                ></div>
                                <span className="point-label">{item.week}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="chart-section">
                        <h4>주간 평균 수면 점수</h4>
                        <div className="chart-container">
                          <div className="line-chart">
                            {monthlyData.weeklyAvgChart.map((item, index) => (
                              <div key={index} className="line-point">
                                <div 
                                  className="point"
                                  style={{ bottom: `${(item.score / 100) * 100}%` }}
                                ></div>
                                <span className="point-label">{item.week}</span>
                              </div>
                            ))}
                          </div>
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

