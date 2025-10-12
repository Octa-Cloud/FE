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
  const [showCalendar, setShowCalendar] = useState(false);
  const { user } = useAuth();
  const { profile } = useUserProfile();
  
  // 현재 보고 있는 월 상태 (기본값: URL 파라미터의 date 또는 오늘)
  const [currentMonth, setCurrentMonth] = useState(() => {
    if (date) {
      return new Date(date);
    }
    return new Date();
  });

  const handleStartSleepRecord = () => {
    console.log('수면 기록 시작');
  };

  const handleLogout = () => {
    console.log('로그아웃');
    navigate('/login');
  };


  const handleCalendarToggle = () => {
    setShowCalendar(!showCalendar);
  };

  const handleCalendarDateSelect = (selectedDate: string) => {
    navigate(`/daily-report/${selectedDate}`);
    setShowCalendar(false);
  };

  const handlePrevMonth = () => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() - 1);
      return newDate;
    });
  };

  const handleNextMonth = () => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + 1);
      return newDate;
    });
  };

  // 달력 공통 함수들
  const getCurrentDate = () => {
    return new Date(date || new Date().toISOString().split('T')[0]);
  };

  const getWeekDates = (selectedDate: string) => {
    const date = new Date(selectedDate);
    const dayOfWeek = date.getDay();
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - dayOfWeek);
    
    const weekDates = [];
    for (let i = 0; i < 7; i++) {
      const weekDate = new Date(startOfWeek);
      weekDate.setDate(startOfWeek.getDate() + i);
      weekDates.push({
        day: weekDate.getDate(),
        fullDate: new Date(weekDate),
        isCurrentMonth: weekDate.getMonth() === date.getMonth()
      });
    }
    return weekDates;
  };

  // 달력 생성 함수 (선택된 월 기반)
  const generateCalendar = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const calendar = [];
    
    // 이전 달의 빈 날짜들
    for (let i = 0; i < startingDayOfWeek; i++) {
      calendar.push(null);
    }
    
    // 현재 달의 날짜들
    for (let day = 1; day <= daysInMonth; day++) {
      calendar.push({
        day: day,
        fullDate: new Date(year, month, day),
        isCurrentMonth: true
      });
    }
    
    // 마지막 주를 완성하기 위한 빈 칸만 추가
    const totalCells = calendar.length;
    const lastWeekRemainingCells = (7 - (totalCells % 7)) % 7;
    for (let i = 0; i < lastWeekRemainingCells; i++) {
      calendar.push(null);
    }
    
    return calendar;
  };

  const isSelectedDate = (day: number | null, fullDate?: Date) => {
    if (!day || !fullDate) return false;
    const currentDate = getCurrentDate();
    return fullDate.toDateString() === currentDate.toDateString();
  };

  // 날짜별 수면 데이터 상태 (예시 데이터)
  const getSleepStatus = (day: number, isCurrentMonth: boolean) => {
    if (!isCurrentMonth) return null;
    
    // 실제로는 API에서 가져온 데이터를 사용
    // 예시: 특정 날짜에 수면 데이터가 있는 경우
    const hasGoodSleep = [9, 11].includes(day); // 초록색 점
    const hasNormalSleep = [7, 8, 10, 12, 13, 14].includes(day); // 노란색 점
    
    if (hasGoodSleep) return 'good';
    if (hasNormalSleep) return 'normal';
    return null;
  };

  const hasSleepData = (day: number, isCurrentMonth: boolean) => {
    if (!isCurrentMonth) return false;
    // 수면 기록이 있는 날짜 (7~14일에 데이터가 있다고 가정)
    return day >= 7 && day <= 14;
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
                <div className="calendar-nav-controls">
                  {showCalendar && (
                    <div className="calendar-month-nav">
                      <button className="calendar-nav-btn" onClick={handlePrevMonth}>‹</button>
                      <span>{currentMonth.getFullYear()}.{currentMonth.getMonth() + 1}</span>
                      <button className="calendar-nav-btn" onClick={handleNextMonth}>›</button>
                    </div>
                  )}
                  <button className="calendar-toggle-btn" onClick={handleCalendarToggle}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      {showCalendar ? (
                        <path d="m18 15-6-6-6 6"/>
                      ) : (
                        <path d="m6 9 6 6 6-6"/>
                      )}
                    </svg>
                  </button>
                </div>

                <div className="calendar-weekdays">
                  <div>일</div>
                  <div>월</div>
                  <div>화</div>
                  <div>수</div>
                  <div>목</div>
                  <div>금</div>
                  <div>토</div>
                </div>

                {showCalendar ? (
                  <div className="calendar-days-grid">
                    {generateCalendar().map((dayData, index) => {
                      if (!dayData) {
                        return (
                          <div key={index} className="calendar-day-cell empty">
                          </div>
                        );
                      }
                      
                      const { day, fullDate, isCurrentMonth } = dayData;
                      
                      // 현재 달이 아닌 날짜는 렌더링하지 않음
                      if (!isCurrentMonth) {
                        return (
                          <div key={index} className="calendar-day-cell empty">
                          </div>
                        );
                      }
                      
                      const isSelected = isSelectedDate(day, fullDate);
                      const sleepStatus = getSleepStatus(day, isCurrentMonth);
                      const hasData = hasSleepData(day, isCurrentMonth);
                      
                      return (
                        <div
                          key={index}
                          className={`calendar-day-cell ${isSelected ? 'selected' : ''} ${hasData ? 'has-data' : ''}`}
                          onClick={() => {
                            const selectedDate = fullDate.toISOString().split('T')[0];
                            handleCalendarDateSelect(selectedDate);
                          }}
                        >
                          <span className="day-number">{day}</span>
                          {sleepStatus && (
                            <span className={`sleep-indicator ${sleepStatus}`} />
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="calendar-days">
                    {getWeekDates(date || new Date().toISOString().split('T')[0]).map((dayData, index) => {
                      const { day, fullDate, isCurrentMonth } = dayData;
                      const isSelected = isSelectedDate(day, fullDate);
                      const sleepStatus = getSleepStatus(day, isCurrentMonth);
                      const hasData = hasSleepData(day, isCurrentMonth);
                      
                      return (
                        <div 
                          key={index}
                          className={`calendar-day ${isSelected ? 'selected' : ''} ${!isCurrentMonth ? 'other-month' : ''} ${hasData ? 'has-data' : ''}`} 
                          onClick={() => {
                            const selectedDate = fullDate.toISOString().split('T')[0];
                            handleCalendarDateSelect(selectedDate);
                          }}
                        >
                          <span className="day-number">{day}</span>
                          {sleepStatus && (
                            <span className={`sleep-indicator ${sleepStatus}`} />
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
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
                    <p>{date ? new Date(date).toLocaleDateString('ko-KR', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric'
                    }) : '2024년 9월 12일'} 수면 시간 요약</p>
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

                {/* AI 분석 리포트 */}
                <div className="ai-analysis-card">
                  <div className="card-header">
                    <h4>개선 권장사항</h4>
                    <p>현재 수면 패턴을 기반으로 한 맞춤형 개선 방법</p>
                  </div>
                  <div className="recommendations-content">
                    <div className="recommendation-item">
                      <div className="recommendation-header">
                        <div className="recommendation-title">
                          <span className="recommendation-icon">💡</span>
                          일정한 취침 시간 유지
                        </div>
                        <div className="recommendation-badges">
                          <span className="badge badge-easy">쉬움</span>
                          <span className="badge badge-high-effect">높은 효과</span>
                        </div>
                      </div>
                      <p className="recommendation-description">
                        현재 취침 시간이 ±45분으로 불규칙합니다. 매일 같은 시간에 잠자리에 들면 멜라토닌 분비가 규칙적이 되어 자연스럽게 잠이 들 수 있습니다. 생체시계가 안정되면 수면의 질이 크게 향상되고, 아침에 일어나기도 쉬워집니다.
                      </p>
                      <div className="recommendation-duration">예상 기간: 2-3주</div>
                      <div className="recommendation-steps">
                        <div className="steps-title">실행 단계:</div>
                        <ol className="steps-list">
                          <li>목표 취침 시간을 정하세요 (예: 23:00)</li>
                          <li>주말에도 같은 시간을 유지하세요</li>
                          <li>취침 1시간 전부터 준비를 시작하세요</li>
                        </ol>
                      </div>
                    </div>

                    <div className="recommendation-item">
                      <div className="recommendation-header">
                        <div className="recommendation-title">
                          <span className="recommendation-icon">💡</span>
                          수면 환경 최적화
                        </div>
                        <div className="recommendation-badges">
                          <span className="badge badge-normal">보통</span>
                          <span className="badge badge-high-effect">높은 효과</span>
                        </div>
                      </div>
                      <p className="recommendation-description">
                        수면 환경은 깊은 수면에 직접적인 영향을 미칩니다. 현재 깊은 수면 비율이 28%로 목표치보다 낮습니다. 적절한 온도(18-20°C)는 체온 조절을 돕고, 완전한 암흑 상태는 멜라토닌 분비를 촉진합니다. 조용한 환경은 수면 중 각성을 방지해 연속적인 깊은 수면을 가능하게 합니다.
                      </p>
                      <div className="recommendation-duration">예상 기간: 1주</div>
                      <div className="recommendation-steps">
                        <div className="steps-title">실행 단계:</div>
                        <ol className="steps-list">
                          <li>방 온도를 18-20도로 유지하세요</li>
                          <li>완전히 어둡게 만들거나 수면 안대를 사용하세요</li>
                          <li>소음을 차단하거나 백색소음을 활용하세요</li>
                        </ol>
                      </div>
                    </div>

                    <div className="recommendation-item">
                      <div className="recommendation-header">
                        <div className="recommendation-title">
                          <span className="recommendation-icon">💡</span>
                          수면 전 루틴 개선
                        </div>
                        <div className="recommendation-badges">
                          <span className="badge badge-normal">보통</span>
                          <span className="badge badge-normal-effect">보통 효과</span>
                        </div>
                      </div>
                      <p className="recommendation-description">
                        현재 수면 시간은 7.2시간으로 목표치에 근접하지만, 수면의 질 개선이 필요합니다. 카페인은 6-8시간 동안 체내에 머물며 잠들기 어렵게 만들고, 블루라이트는 멜라토닌 분비를 억제합니다. 취침 전 차분한 활동은 교감신경을 진정시켜 자연스러운 수면 유도에 도움이 됩니다.
                      </p>
                      <div className="recommendation-duration">예상 기간: 1-2주</div>
                      <div className="recommendation-steps">
                        <div className="steps-title">실행 단계:</div>
                        <ol className="steps-list">
                          <li>취침 2시간 전 카페인 섭취 중단</li>
                          <li>취침 1시간 전 스크린 타임 줄이기</li>
                          <li>가벼운 독서나 명상으로 마음 진정하기</li>
                        </ol>
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
              </div>
            </div>
          </div>
        </main>
      </Container>
    </div>
  );
};

export default DailyReport;

