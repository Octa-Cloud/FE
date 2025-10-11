import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Container from '../components/Container';
import NavBar from '../components/NavBar';
import { useAuth, useUserProfile } from '../store/hooks';
import '../styles/statistics.css';
import '../styles/profile.css';

const DailyReport: React.FC = () => {
  const { date } = useParams<{ date: string }>();
  const navigate = useNavigate();
  const [showRecommendations, setShowRecommendations] = useState(false);
  const { user } = useAuth();
  const { profile } = useUserProfile();

  const handleStartSleepRecord = () => {
    console.log('수면 기록 시작');
  };

  const handleLogout = () => {
    console.log('로그아웃');
    navigate('/login');
  };

  const handleDateClick = (day: number) => {
    const newDate = `2024-09-${day.toString().padStart(2, '0')}`;
    navigate(`/daily-report/${newDate}`);
  };

  // 실제 사용자 프로필 정보 사용
  const currentUserProfile = {
    name: profile?.name || user?.name || '사용자',
    avatar: '',
    email: profile?.email || user?.email || ''
  };

  // 샘플 데이터
  const reportData = {
    date: date || '2024-09-12',
    sleepScore: 85,
    sleepTime: '7시간 30분',
    bedtime: '23:15',
    wakeTime: '06:45',
    sleepEfficiency: 89,
    sleepStages: {
      deep: '2시간 15분',
      light: '3시간 45분',
      rem: '1시간 30분'
    },
    sleepRatios: {
      deep: 30,
      light: 50,
      rem: 20
    },
    brainwaveData: [
      { time: '23:15', level: 'B' },
      { time: '23:45', level: 'B' },
      { time: '00:30', level: 'C' },
      { time: '01:00', level: 'D' },
      { time: '02:00', level: 'D' },
      { time: '03:15', level: 'C' },
      { time: '04:30', level: 'D' },
      { time: '05:45', level: 'C' },
      { time: '06:30', level: 'B' },
      { time: '06:45', level: 'B' }
    ],
    noiseEvents: [
      { type: '코골이', icon: 'user' },
      { type: '에어컨 소음', icon: 'air-vent' },
      { type: '외부 소음', icon: 'car' }
    ],
    sleepMemo: '"스트레스가 많아서 잠들기까지 오래 걸렸어요. 그래도 중간에 깨지 않고 푹 잘 수 있어서 다행이었습니다."',
    aiAnalysis: {
      summary: '조용한 환경에서 양질의 수면을 취했습니다. 깊은 수면 비율이 이상적입니다.',
      recommendations: [
        '취침 시간을 15분 앞당겨 목표 수면시간을 달성해보세요',
        '현재 깊은 수면 비율이 이상적입니다. 이 패턴을 유지해보세요',
        '스트레스 관리를 위한 취침 전 명상이나 독서를 추천드립니다 (수면 메모 반영)',
        '수면 환경이 매우 좋습니다. 현재 설정을 계속 사용하세요'
      ]
    }
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return '우수';
    if (score >= 80) return '좋음';
    if (score >= 70) return '보통';
    return '개선 필요';
  };

  const getScoreBadgeColor = (score: number) => {
    if (score >= 90) return 'excellent';
    if (score >= 80) return 'good';
    if (score >= 70) return 'average';
    return 'poor';
  };

  return (
    <div className="daily-report-page">
      <NavBar 
        onStartSleepRecord={handleStartSleepRecord}
        userProfile={currentUserProfile}
        onLogout={handleLogout}
      />
      
      <Container width={800} backgroundColor="#000000">
        <main className="daily-report-main">
          <div className="daily-report-container">
            <div className="daily-report-content">
              {/* 캘린더 미니뷰 */}
              <div className="calendar-mini">
                <div className="calendar-header">
                  <button className="calendar-nav">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="m6 9 6 6 6-6"/>
                    </svg>
                  </button>
                </div>
                <div className="calendar-grid">
                  <div className="calendar-weekdays">
                    <div>일</div>
                    <div>월</div>
                    <div>화</div>
                    <div>수</div>
                    <div>목</div>
                    <div>금</div>
                    <div>토</div>
                  </div>
                  <div className="calendar-days">
                    <div className="calendar-day" onClick={() => handleDateClick(5)}>5</div>
                    <div className="calendar-day" onClick={() => handleDateClick(6)}>6</div>
                    <div className="calendar-day" onClick={() => handleDateClick(7)}>7</div>
                    <div className="calendar-day" onClick={() => handleDateClick(8)}>8</div>
                    <div className="calendar-day" onClick={() => handleDateClick(9)}>9</div>
                    <div className="calendar-day selected" onClick={() => handleDateClick(10)}>10</div>
                    <div className="calendar-day" onClick={() => handleDateClick(11)}>11</div>
                  </div>
                </div>
              </div>

              <div className="report-grid">
                {/* 수면 점수 카드 */}
                <div className="score-card primary-border">
                  <div className="score-content">
                    <div className="score-icon">
                      <span>{reportData.sleepScore}</span>
                    </div>
                    <h2>수면 점수</h2>
                    <span className={`score-badge ${getScoreBadgeColor(reportData.sleepScore)}`}>
                      {getScoreLabel(reportData.sleepScore)}
                    </span>
                    <p>전체 평균보다 높은 점수입니다</p>
                  </div>
                </div>

                {/* 수면 시간 정보 */}
                <div className="sleep-info-card">
                  <div className="card-header">
                    <h4>수면 시간 정보</h4>
                    <p>2024년 9월 12일 수면 시간 요약</p>
                  </div>
                  <div className="sleep-info-list">
                    <div className="sleep-info-item">
                      <div className="sleep-info-label">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401"/>
                        </svg>
                        <span>취침 시간</span>
                      </div>
                      <div className="sleep-info-value">
                        <div className="value">{reportData.bedtime}</div>
                        <p>목표보다 15분 늦음</p>
                      </div>
                    </div>
                    <div className="sleep-info-item">
                      <div className="sleep-info-label">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 6v6l4 2"/>
                          <circle cx="12" cy="12" r="10"/>
                        </svg>
                        <span>총 수면 시간</span>
                      </div>
                      <div className="sleep-info-value">
                        <div className="value">{reportData.sleepTime}</div>
                        <p>목표 대비 -30분</p>
                      </div>
                    </div>
                    <div className="sleep-info-item">
                      <div className="sleep-info-label">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="4"/>
                          <path d="M12 2v2"/>
                          <path d="M12 20v2"/>
                          <path d="m4.93 4.93 1.41 1.41"/>
                          <path d="m17.66 17.66 1.41 1.41"/>
                          <path d="M2 12h2"/>
                          <path d="M20 12h2"/>
                          <path d="m6.34 17.66-1.41 1.41"/>
                          <path d="m19.07 4.93-1.41 1.41"/>
                        </svg>
                        <span>기상 시간</span>
                      </div>
                      <div className="sleep-info-value">
                        <div className="value">{reportData.wakeTime}</div>
                        <p>알람 시간과 동일</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 수면 단계별 시간 */}
                <div className="sleep-stages-card">
                  <div className="card-header">
                    <h4>수면 단계별 시간</h4>
                    <p>각 수면 단계별 상세 시간</p>
                  </div>
                  <div className="sleep-stages-list">
                    <div className="sleep-stage-item">
                      <span>깊은 수면</span>
                      <span>{reportData.sleepStages.deep}</span>
                    </div>
                    <div className="sleep-stage-item">
                      <span>얕은 수면</span>
                      <span>{reportData.sleepStages.light}</span>
                    </div>
                    <div className="sleep-stage-item">
                      <span>REM 수면</span>
                      <span>{reportData.sleepStages.rem}</span>
                    </div>
                    <div className="sleep-stage-item total">
                      <span>수면 효율</span>
                      <span>{reportData.sleepEfficiency}%</span>
                    </div>
                  </div>
                </div>

                {/* 수면 단계별 비율 */}
                <div className="sleep-ratios-card">
                  <div className="card-header">
                    <h4>수면 단계별 비율</h4>
                    <p>각 수면 단계별 비율 분석</p>
                  </div>
                  <div className="sleep-ratios-grid">
                    <div className="sleep-ratio-item">
                      <div className="ratio-icon blue">
                        <span>{reportData.sleepRatios.deep}%</span>
                      </div>
                      <p className="ratio-label">깊은 수면</p>
                      <p className="ratio-status">이상적</p>
                    </div>
                    <div className="sleep-ratio-item">
                      <div className="ratio-icon green">
                        <span>{reportData.sleepRatios.light}%</span>
                      </div>
                      <p className="ratio-label">얕은 수면</p>
                      <p className="ratio-status">양호</p>
                    </div>
                    <div className="sleep-ratio-item">
                      <div className="ratio-icon purple">
                        <span>{reportData.sleepRatios.rem}%</span>
                      </div>
                      <p className="ratio-label">REM 수면</p>
                      <p className="ratio-status">정상</p>
                    </div>
                  </div>
                </div>

                {/* 뇌파 & 소음 분석 */}
                <div className="brainwave-card">
                  <div className="card-header">
                    <h4>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 18V5"/>
                        <path d="M15 13a4.17 4.17 0 0 1-3-4 4.17 4.17 0 0 1-3 4"/>
                        <path d="M17.598 6.5A3 3 0 1 0 12 5a3 3 0 1 0-5.598 1.5"/>
                        <path d="M17.997 5.125a4 4 0 0 1 2.526 5.77"/>
                        <path d="M18 18a4 4 0 0 0 2-7.464"/>
                        <path d="M19.967 17.483A4 4 0 1 1 12 18a4 4 0 1 1-7.967-.517"/>
                        <path d="M6 18a4 4 0 0 1-2-7.464"/>
                        <path d="M6.003 5.125a4 4 0 0 0-2.526 5.77"/>
                      </svg>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z"/>
                        <path d="M16 9a5 5 0 0 1 0 6"/>
                        <path d="M19.364 18.364a9 9 0 0 0 0-12.728"/>
                      </svg>
                      뇌파 & 소음 분석
                    </h4>
                    <p>수면 중 뇌파 등급(A~E)과 소음 이벤트</p>
                  </div>
                  <div className="brainwave-chart">
                    <div className="chart-area">
                      <div className="brainwave-gradient"></div>
                    </div>
                  </div>
                  <div className="brainwave-legend">
                    <div className="legend-item">
                      <div className="legend-gradient"></div>
                      <span>뇌파 등급 (A: 깊은 수면 → E: 각성)</span>
                    </div>
                  </div>
                  
                  <div className="noise-events-card">
                    <div className="noise-header">
                      <h4>감지된 소음 이벤트</h4>
                      <button 
                        className="expand-btn"
                        onClick={() => setShowRecommendations(!showRecommendations)}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="m6 9 6 6 6-6"/>
                        </svg>
                      </button>
                    </div>
                    <div className="noise-events-grid">
                      <div className="noise-event">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
                          <circle cx="12" cy="7" r="4"/>
                        </svg>
                        <span>코골이</span>
                      </div>
                      <div className="noise-event">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M18 17.5a2.5 2.5 0 1 1-4 2.03V12"/>
                          <path d="M6 12H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
                          <path d="M6 8h12"/>
                          <path d="M6.6 15.572A2 2 0 1 0 10 17v-5"/>
                        </svg>
                        <span>에어컨 소음</span>
                      </div>
                      <div className="noise-event">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/>
                          <circle cx="7" cy="17" r="2"/>
                          <path d="M9 17h6"/>
                          <circle cx="17" cy="17" r="2"/>
                        </svg>
                        <span>외부 소음</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 수면 기록 메모 */}
                <div className="sleep-memo-card">
                  <div className="card-header">
                    <h4>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z"/>
                      </svg>
                      수면 기록 메모
                    </h4>
                    <p>이날 밤 수면에 대한 개인 기록</p>
                  </div>
                  <div className="memo-content">
                    <p>{reportData.sleepMemo}</p>
                  </div>
                </div>

                {/* AI 분석 리포트 */}
                <div className="ai-analysis-card">
                  <div className="card-header">
                    <h4>AI 분석 리포트</h4>
                    <p>수면 메모를 바탕으로 한 개인화된 분석</p>
                  </div>
                  <div className="ai-analysis-content">
                    <p className="analysis-summary">{reportData.aiAnalysis.summary}</p>
                    
                    {showRecommendations && (
                      <div className="recommendations-section">
                        <p className="recommendations-title">💡 개선 제안</p>
                        <ul className="recommendations-list">
                          {reportData.aiAnalysis.recommendations.map((rec, index) => (
                            <li key={index}>• {rec}</li>
                          ))}
                        </ul>
                      </div>
                    )}
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

export default DailyReport;

