import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Container from '../components/Container';
import NavBar from '../components/NavBar';
import { useAuth, useUserProfile } from '../store/hooks';
import { getSleepRecordByDate, getSleepRecordsByMonth, getSleepStatus as getSleepStatusByScore } from '../sleepData';
import { DailySleepRecord } from '../types/sleepData';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
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

  // 현재 날짜의 수면 데이터
  const [reportData, setReportData] = useState<DailySleepRecord | null>(null);

  // 현재 월의 수면 데이터 (캘린더 표시용)
  const [monthlyData, setMonthlyData] = useState<DailySleepRecord[]>([]);

  // 데이터 로드
  useEffect(() => {
    if (user?.id && date) {
      const record = getSleepRecordByDate(user.id, date);
      setReportData(record);
    }
  }, [user?.id, date]);

  // 월별 데이터 로드 (캘린더용)
  useEffect(() => {
    if (user?.id) {
      const records = getSleepRecordsByMonth(
        user.id,
        currentMonth.getFullYear(),
        currentMonth.getMonth() + 1
      );
      setMonthlyData(records);
    }
  }, [user?.id, currentMonth]);

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

  // 날짜별 수면 데이터 상태 (실제 데이터 사용)
  const getSleepStatus = (day: number, isCurrentMonth: boolean) => {
    if (!isCurrentMonth || !monthlyData.length) return null;
    
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth() + 1;
    const dateStr = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    
    const record = monthlyData.find(r => r.date === dateStr);
    if (!record) return null;
    
    return getSleepStatusByScore(record.sleepScore);
  };

  const hasSleepData = (day: number, isCurrentMonth: boolean) => {
    if (!isCurrentMonth || !monthlyData.length) return false;
    
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth() + 1;
    const dateStr = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    
    return monthlyData.some(r => r.date === dateStr);
  };

  // 실제 사용자 프로필 정보 사용
  const currentUserProfile = {
    name: profile?.name || user?.name || '사용자',
    avatar: '',
    email: profile?.email || user?.email || ''
  };

  // 데이터가 없을 경우 기본 메시지
  if (!reportData) {
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
                <div style={{ textAlign: 'center', padding: '100px 0', color: '#a1a1aa' }}>
                  <h2>해당 날짜의 수면 기록이 없습니다.</h2>
                  <p>다른 날짜를 선택해주세요.</p>
                </div>
              </div>
            </div>
          </main>
        </Container>
      </div>
    );
  }

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
                    <p>{reportData.date ? new Date(reportData.date).toLocaleDateString('ko-KR', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric'
                    }) : '날짜 정보 없음'} 수면 시간 요약</p>
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
                        <p>{reportData.sleepScore >= 85 ? '목표 시간 달성' : '목표보다 늦음'}</p>
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
                        <p>{reportData.sleepTimeHours >= 7 ? '충분한 수면' : '수면 부족'}</p>
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
                        <p>기상 완료</p>
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
                    <div className="recharts-responsive-container" style={{ width: '100%', height: '350px', minWidth: '0px' }}>
                      <ResponsiveContainer width="100%" height={350}>
                        <AreaChart 
                          data={reportData.brainwaveAnalysis.dataPoints.map((point, index) => ({
                            time: point.time,
                            level: point.level,
                            intensity: point.intensity,
                            yValue: point.level === 'A' ? 0 : point.level === 'B' ? 1 : point.level === 'C' ? 2 : point.level === 'D' ? 3 : 4
                          }))}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                          <XAxis
                            dataKey="time"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: '#a1a1aa' }}
                          />
                          <YAxis
                            domain={[0, 4]}
                            ticks={[0, 1, 2, 3, 4]}
                            tickFormatter={(value) => ['A', 'B', 'C', 'D', 'E'][value]}
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: '#a1a1aa' }}
                            label={{ value: '뇌파 등급', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#808080' } }}
                          />
                          <defs>
                            <linearGradient id="brainwaveGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#1e40af" stopOpacity={0.8} />
                              <stop offset="25%" stopColor="#3b82f6" stopOpacity={0.6} />
                              <stop offset="50%" stopColor="#60a5fa" stopOpacity={0.4} />
                              <stop offset="75%" stopColor="#93c5fd" stopOpacity={0.3} />
                              <stop offset="100%" stopColor="#dbeafe" stopOpacity={0.1} />
                            </linearGradient>
                          </defs>
                          <Area
                            type="monotone"
                            dataKey="yValue"
                            stroke="#3b82f6"
                            strokeWidth={2}
                            fill="url(#brainwaveGradient)"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  <div className="brainwave-legend">
                    <div className="flex items-center gap-6 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-3 rounded-full bg-gradient-to-r from-blue-800 via-blue-400 to-blue-100"></div>
                        <span>뇌파 등급 (A: 깊은 수면 → E: 각성)</span>
                      </div>
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
                      <div className="grid grid-cols-2 gap-3">
                        {reportData.noiseEvents.map((event, index) => (
                          <div key={index} className="flex items-center gap-2 text-base">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary">
                              {event.icon === 'user' && (
                                <>
                                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
                                  <circle cx="12" cy="7" r="4"/>
                                </>
                              )}
                              {event.icon === 'air-vent' && (
                                <>
                                  <path d="M18 17.5a2.5 2.5 0 1 1-4 2.03V12"/>
                                  <path d="M6 12H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
                                  <path d="M6 8h12"/>
                                  <path d="M6.6 15.572A2 2 0 1 0 10 17v-5"/>
                                </>
                              )}
                              {event.icon === 'car' && (
                                <>
                                  <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/>
                                  <circle cx="7" cy="17" r="2"/>
                                  <path d="M9 17h6"/>
                                  <circle cx="17" cy="17" r="2"/>
                                </>
                              )}
                              {event.icon === 'bird' && (
                                <>
                                  <path d="M16 7h.01"/>
                                  <path d="M21.2 8c.4 0 .8.3.8.8v2.4c0 .4-.3.8-.8.8-.1 0-.2 0-.3-.1l-1.1-1.1-1.1 1.1c-.1.1-.2.1-.3.1-.4 0-.8-.3-.8-.8V8.8c0-.4.3-.8.8-.8.1 0 .2 0 .3.1l1.1 1.1L20.9 8c.1-.1.2-.1.3-.1z"/>
                                  <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8z"/>
                                </>
                              )}
                            </svg>
                            <span className="flex-1">{event.type}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 수면 기록 메모 */}
                {reportData.sleepMemo && (
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
                )}

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
                        현재 수면 패턴을 분석한 결과, 수면 환경 개선이 필요합니다. 뇌파 분석에서 깊은 수면 비율이 {reportData.brainwaveAnalysis.deepSleepRatio}%로 나타났으며, 소음 이벤트가 {reportData.noiseEvents.length}회 감지되었습니다. 규칙적인 취침 시간과 최적화된 수면 환경을 통해 수면의 질을 크게 향상시킬 수 있습니다.
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
                        수면 환경은 깊은 수면에 직접적인 영향을 미칩니다. 현재 깊은 수면 비율이 {reportData.brainwaveAnalysis.deepSleepRatio}%로 나타났으며, 각성 상태가 {reportData.brainwaveAnalysis.awakeRatio}% 감지되었습니다. 적절한 온도(18-20°C)는 체온 조절을 돕고, 완전한 암흑 상태는 멜라토닌 분비를 촉진합니다. 조용한 환경은 수면 중 각성을 방지해 연속적인 깊은 수면을 가능하게 합니다.
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
                        현재 수면 시간은 {reportData.sleepTimeHours}시간으로 나타났으며, 수면 효율은 {reportData.sleepEfficiency}%입니다. 뇌파 분석에서 REM 수면 비율이 {reportData.brainwaveAnalysis.remSleepRatio}%로 측정되었습니다. 카페인은 6-8시간 동안 체내에 머물며 잠들기 어렵게 만들고, 블루라이트는 멜라토닌 분비를 억제합니다. 취침 전 차분한 활동은 교감신경을 진정시켜 자연스러운 수면 유도에 도움이 됩니다.
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
              </div>
            </div>
          </div>
        </main>
      </Container>
    </div>
  );
};

export default DailyReport;

