import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Container from '../components/Container';
import NavBar from '../components/NavBar';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorBoundary from '../components/ErrorBoundary';
import BrainwaveChart from '../components/charts/BrainwaveChart';
import { useAuth, useUserProfile } from '../store/hooks';
import { sleepAPI, DailyReportResponse } from '../api/sleep';
import { WEEKDAYS_KR } from '../constants/sleep';
import '../styles/statistics.css';
import '../styles/daily-report.css';

const DailyReport: React.FC = () => {
  const { date } = useParams<{ date: string }>();
  const navigate = useNavigate();
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { profile } = useUserProfile();
  
  // 로컬 타임존 기준 YYYY-MM-DD 파서/포매터
  const parseDateStr = (s: string) => {
    const [y, m, d] = s.split('-').map(Number);
    return new Date(y, (m || 1) - 1, d || 1);
  };
  const formatDateStr = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  // 현재 보고 있는 월 상태 (기본값: URL 파라미터의 date 또는 오늘)
  const [currentMonth, setCurrentMonth] = useState(() => {
    if (date) {
      return parseDateStr(date);
    }
    return new Date();
  });

  // 현재 날짜의 수면 데이터
  const [reportData, setReportData] = useState<DailyReportResponse | null>(null);

  // 현재 날짜의 summary 데이터 (취침/기상 시간용)
  const [summaryData, setSummaryData] = useState<any>(null);

  // 현재 월의 수면 데이터 (캘린더 표시용) - summary API 사용
  const [monthlyData, setMonthlyData] = useState<any[]>([]);

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

        if (date) {
          console.log('🔍 API 호출: 일간 리포트 조회', { date });

          // 일간 리포트 조회
          const response = await sleepAPI.getDailyReport(date);
          console.log('✅ API 응답: 일간 리포트 조회 성공', response);
          
          if (response.result) {
            setReportData(response.result);
            console.log('📊 일간 리포트 설정:', response.result);
          } else {
            console.log('📝 일간 리포트 데이터가 없습니다.');
            setReportData(null);
          }

          // 해당 날짜의 summary 데이터도 조회 (취침/기상 시간용)
          const dateObj = new Date(date);
          const year = dateObj.getFullYear();
          const month = dateObj.getMonth() + 1;
          
          console.log('🔍 API 호출: 월별 수면 요약 조회 (단일 날짜용)', { year, month });
          
          const summaryResponse = await sleepAPI.getMonthlySleepSummary(year, month);
          console.log('✅ API 응답: 월별 수면 요약 조회 성공', summaryResponse);
          
          if (summaryResponse.result && summaryResponse.result.length > 0) {
            // 해당 날짜의 데이터 찾기
            const dayData = summaryResponse.result.find((item: any) => item.date === date);
            if (dayData) {
              setSummaryData(dayData);
              console.log('📊 일간 summary 데이터 설정:', dayData);
            } else {
              console.log('📝 해당 날짜의 summary 데이터가 없습니다.');
              setSummaryData(null);
            }
          } else {
            console.log('📝 해당 월의 summary 데이터가 없습니다.');
            setSummaryData(null);
          }
        }
      } catch (error: any) {
        console.error('❌ 일간 리포트 API 호출 실패:', error);
        
        // 404 에러일 때는 해당 날짜에 데이터가 없음을 로그로 남기고 null 설정
        if (error.response?.status === 404) {
          console.log('📝 404 에러: 해당 날짜의 리포트가 없습니다.');
          setReportData(null);
          setSummaryData(null);
        } else {
          console.log('⚠️ API 호출 실패: 일간 리포트 데이터 없음');
          setReportData(null);
          setSummaryData(null);
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [date]);

  // 월별 데이터 로드 (캘린더용) - summary API 사용
  useEffect(() => {
    const loadMonthlyData = async () => {
      try {
        // 토큰 확인
        const token = localStorage.getItem('accessToken');
        if (!token) {
          console.log('토큰이 없습니다.');
          return;
        }

        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth() + 1;
        console.log('🔍 API 호출: 월별 수면 요약 조회', { year, month });

        // 월별 수면 요약 데이터 가져오기
        const response = await sleepAPI.getMonthlySleepSummary(year, month);
        console.log('✅ API 응답: 월별 수면 요약 조회 성공', response);
        
        if (response.result && response.result.length > 0) {
          setMonthlyData(response.result);
          console.log('📊 월별 데이터 설정:', response.result.length, '개 기록');
        } else {
          console.log('📝 해당 월의 수면 기록이 없습니다.');
          setMonthlyData([]);
        }
      } catch (error: any) {
        console.error('❌ 월별 수면 요약 API 호출 실패:', error);
        
        // 404 에러일 때는 해당 월에 데이터가 없음을 로그로 남기고 빈 배열 설정
        if (error.response?.status === 404) {
          console.log('📝 404 에러: 해당 월의 수면 기록이 없습니다.');
          setMonthlyData([]);
        } else {
          console.log('⚠️ API 호출 실패: 월별 데이터 없음');
          setMonthlyData([]);
        }
      }
    };

    loadMonthlyData();
  }, [currentMonth]);

  const handleStartSleepRecord = useCallback(() => {
    console.log('수면 기록 시작');
  }, []);

  const handleLogout = useCallback(() => {
    console.log('로그아웃');
    navigate('/login');
  }, [navigate]);

  const handleCalendarToggle = useCallback(() => {
    setShowCalendar(prev => !prev);
  }, []);

  const handleCalendarDateSelect = useCallback((selectedDate: string) => {
    navigate(`/daily-report/${selectedDate}`);
    setShowCalendar(false);
  }, [navigate]);

  const handlePrevMonth = useCallback(() => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() - 1);
      return newDate;
    });
  }, []);

  const handleNextMonth = useCallback(() => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + 1);
      return newDate;
    });
  }, []);

  // 달력 공통 함수들
  const getCurrentDate = () => {
    if (date) return parseDateStr(date);
    return new Date();
  };

  const getWeekDates = (selectedDate: string) => {
    const date = parseDateStr(selectedDate);
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

  // 달력 생성 함수 - 메모이제이션
  const calendar = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const calendarDays = [];
    
    // 이전 달의 빈 날짜들
    for (let i = 0; i < startingDayOfWeek; i++) {
      calendarDays.push(null);
    }
    
    // 현재 달의 날짜들
    for (let day = 1; day <= daysInMonth; day++) {
      calendarDays.push({
        day: day,
        fullDate: new Date(year, month, day),
        isCurrentMonth: true
      });
    }
    
    // 마지막 주를 완성하기 위한 빈 칸만 추가
    const totalCells = calendarDays.length;
    const lastWeekRemainingCells = (7 - (totalCells % 7)) % 7;
    for (let i = 0; i < lastWeekRemainingCells; i++) {
      calendarDays.push(null);
    }
    
    return calendarDays;
  }, [currentMonth]);

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
    
    if (record.sleepScore >= 85) return 'good';
    if (record.sleepScore >= 70) return 'normal';
    return 'bad';
  };

  const hasSleepData = (day: number, isCurrentMonth: boolean) => {
    if (!isCurrentMonth || !monthlyData.length) return false;
    
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth() + 1;
    const dateStr = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    
    return monthlyData.some(r => r.date === dateStr);
  };

  // 실제 사용자 프로필 정보 사용 - 메모이제이션 (localStorage fallback 포함)
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

  // 로딩 중
  if (isLoading) {
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
                <LoadingSpinner size="large" text="수면 데이터를 불러오는 중..." />
              </div>
            </div>
          </main>
        </Container>
      </div>
    );
  }

  // 데이터가 없을 경우에도 캘린더는 유지 표시
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
                {/* 캘린더 미니뷰 */}
                <div className="calendar-mini">
                  <div className="flex items-center justify-end mb-2">
                    {showCalendar && (
                      <div className="flex items-center gap-4 mr-2">
                        <button 
                          className="w-6 h-6 flex items-center justify-center text-white hover:bg-gray-800 rounded transition-colors" 
                          onClick={handlePrevMonth}
                          aria-label="이전 달로 이동"
                        >
                          ‹
                        </button>
                        <span aria-live="polite">{currentMonth.getFullYear()}.{currentMonth.getMonth() + 1}</span>
                        <button 
                          className="w-6 h-6 flex items-center justify-center text-white hover:bg-gray-800 rounded transition-colors" 
                          onClick={handleNextMonth}
                          aria-label="다음 달로 이동"
                        >
                          ›
                        </button>
                      </div>
                    )}
                    <button 
                      className="flex items-center gap-2 text-white hover:bg-gray-800 rounded transition-colors p-1" 
                      onClick={handleCalendarToggle}
                      aria-label={showCalendar ? '캘린더 접기' : '캘린더 펼치기'}
                      aria-expanded={showCalendar}
                    >
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
                      {calendar.map((dayData, index) => {
                        if (!dayData) {
                          return (
                            <div key={index} className="calendar-day-cell empty" />
                          );
                        }
                        const { day, fullDate, isCurrentMonth } = dayData;
                        if (!isCurrentMonth) {
                          return (
                            <div key={index} className="calendar-day-cell empty" />
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
                              const selectedDate = formatDateStr(fullDate);
                              handleCalendarDateSelect(selectedDate);
                            }}
                            role="button"
                            tabIndex={0}
                            aria-label={`${currentMonth.getFullYear()}년 ${currentMonth.getMonth() + 1}월 ${day}일${hasData ? ' (수면 기록 있음)' : ''}`}
                            aria-pressed={isSelected}
                          >
                            <span className="day-number">{day}</span>
                            {sleepStatus && <span className={`sleep-indicator ${sleepStatus}`} />}
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
                              const selectedDate = formatDateStr(fullDate);
                              handleCalendarDateSelect(selectedDate);
                            }}
                            role="button"
                            tabIndex={0}
                            aria-label={`${fullDate.getMonth() + 1}월 ${day}일 ${WEEKDAYS_KR[fullDate.getDay()]}요일${hasData ? ' (수면 기록 있음)' : ''}`}
                            aria-pressed={isSelected}
                          >
                            <span className="day-number">{day}</span>
                            {sleepStatus && <span className={`sleep-indicator ${sleepStatus}`} />}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* 데이터 없음 메시지 */}
                <div className="flex flex-col items-center justify-center py-24 text-center">
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#a1a1aa" strokeWidth="1.5" className="mb-4">
                    <path d="M12 18V5"/>
                    <path d="M15 13a4.17 4.17 0 0 1-3-4 4.17 4.17 0 0 1-3 4"/>
                    <path d="M17.598 6.5A3 3 0 1 0 12 5a3 3 0 1 0-5.598 1.5"/>
                  </svg>
                  <h2 className="text-xl font-semibold text-white mb-2">해당 날짜의 수면 기록이 없습니다</h2>
                  <p className="text-sm text-[#a1a1aa]">달력에서 다른 날짜를 선택해주세요</p>
                </div>
              </div>
            </div>
          </main>
        </Container>
      </div>
    );
  }

  const getScoreLabel = (score: number) => {
    if (score >= 80) return '좋음';
    if (score >= 70) return '보통';
    return '개선 필요';
  };

  const getScoreBadgeColor = (score: number) => {
    if (score >= 85) return 'good';
    if (score >= 70) return 'normal';
    return 'bad';
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
                <div className="flex items-center justify-end mb-2">
                  {showCalendar && (
                    <div className="flex items-center gap-4 mr-2">
                      <button 
                        className="w-6 h-6 flex items-center justify-center text-white hover:bg-gray-800 rounded transition-colors" 
                        onClick={handlePrevMonth}
                        aria-label="이전 달로 이동"
                      >
                        ‹
                      </button>
                      <span aria-live="polite">{currentMonth.getFullYear()}.{currentMonth.getMonth() + 1}</span>
                      <button 
                        className="w-6 h-6 flex items-center justify-center text-white hover:bg-gray-800 rounded transition-colors" 
                        onClick={handleNextMonth}
                        aria-label="다음 달로 이동"
                      >
                        ›
                      </button>
                    </div>
                  )}
                  <button 
                    className="flex items-center gap-2 text-white hover:bg-gray-800 rounded transition-colors p-1" 
                    onClick={handleCalendarToggle}
                    aria-label={showCalendar ? '캘린더 접기' : '캘린더 펼치기'}
                    aria-expanded={showCalendar}
                  >
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
                    {calendar.map((dayData, index) => {
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
                            const selectedDate = formatDateStr(fullDate);
                            handleCalendarDateSelect(selectedDate);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              const selectedDate = formatDateStr(fullDate);
                              handleCalendarDateSelect(selectedDate);
                            }
                          }}
                          role="button"
                          tabIndex={0}
                          aria-label={`${currentMonth.getFullYear()}년 ${currentMonth.getMonth() + 1}월 ${day}일${hasData ? ' (수면 기록 있음)' : ''}`}
                          aria-pressed={isSelected}
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
                      {getWeekDates(date || formatDateStr(new Date())).map((dayData, index) => {
                      const { day, fullDate, isCurrentMonth } = dayData;
                      const isSelected = isSelectedDate(day, fullDate);
                      const sleepStatus = getSleepStatus(day, isCurrentMonth);
                      const hasData = hasSleepData(day, isCurrentMonth);
                      
                      return (
                        <div 
                          key={index}
                          className={`calendar-day ${isSelected ? 'selected' : ''} ${!isCurrentMonth ? 'other-month' : ''} ${hasData ? 'has-data' : ''}`} 
                          onClick={() => {
                            const selectedDate = formatDateStr(fullDate);
                            handleCalendarDateSelect(selectedDate);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              const selectedDate = formatDateStr(fullDate);
                              handleCalendarDateSelect(selectedDate);
                            }
                          }}
                          role="button"
                          tabIndex={0}
                          aria-label={`${fullDate.getMonth() + 1}월 ${day}일 ${WEEKDAYS_KR[fullDate.getDay()]}요일${hasData ? ' (수면 기록 있음)' : ''}`}
                          aria-pressed={isSelected}
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
                      <span>{reportData ? Math.round((reportData.deepSleepRatio + reportData.lightSleepRatio + reportData.remSleepRatio) * 10) : 0}</span>
                    </div>
                    <h2>수면 점수</h2>
                    <span className={`score-badge ${reportData ? getScoreBadgeColor(Math.round((reportData.deepSleepRatio + reportData.lightSleepRatio + reportData.remSleepRatio) * 10)) : 'gray'}`}>
                      {reportData ? getScoreLabel(Math.round((reportData.deepSleepRatio + reportData.lightSleepRatio + reportData.remSleepRatio) * 10)) : '데이터 없음'}
                    </span>
                    <p>{reportData ? '수면 품질 분석 완료' : '수면 데이터가 없습니다'}</p>
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
                        <div className="value">{summaryData ? summaryData.bedTime : '--:--'}</div>
                        <p>{summaryData ? '취침 시간' : '데이터 없음'}</p>
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
                        <div className="value">{reportData ? `${Math.round((reportData.deepSleepTime + reportData.lightSleepTime + reportData.remSleepTime) / 60)}시간 ${(reportData.deepSleepTime + reportData.lightSleepTime + reportData.remSleepTime) % 60}분` : '--:--'}</div>
                        <p>{reportData ? '총 수면 시간' : '데이터 없음'}</p>
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
                        <div className="value">{summaryData ? summaryData.wakeTime : '--:--'}</div>
                        <p>{summaryData ? '기상 시간' : '데이터 없음'}</p>
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
                      <span>{reportData ? `${reportData.deepSleepTime}분` : '--분'}</span>
                    </div>
                    <div className="sleep-stage-item">
                      <span>얕은 수면</span>
                      <span>{reportData ? `${reportData.lightSleepTime}분` : '--분'}</span>
                    </div>
                    <div className="sleep-stage-item">
                      <span>REM 수면</span>
                      <span>{reportData ? `${reportData.remSleepTime}분` : '--분'}</span>
                    </div>
                    <div className="sleep-stage-item total">
                      <span>총 수면 시간</span>
                      <span>{reportData ? `${Math.round((reportData.deepSleepTime + reportData.lightSleepTime + reportData.remSleepTime) / 60)}시간 ${(reportData.deepSleepTime + reportData.lightSleepTime + reportData.remSleepTime) % 60}분` : '--시간 --분'}</span>
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
                        <span>{reportData ? Math.round(reportData.deepSleepRatio) : 0}%</span>
                      </div>
                      <p className="ratio-label">깊은 수면</p>
                      <p className="ratio-status">{reportData ? '이상적' : '데이터 없음'}</p>
                    </div>
                    <div className="sleep-ratio-item">
                      <div className="ratio-icon green">
                        <span>{reportData ? Math.round(reportData.lightSleepRatio) : 0}%</span>
                      </div>
                      <p className="ratio-label">얕은 수면</p>
                      <p className="ratio-status">{reportData ? '양호' : '데이터 없음'}</p>
                    </div>
                    <div className="sleep-ratio-item">
                      <div className="ratio-icon purple">
                        <span>{reportData ? Math.round(reportData.remSleepRatio) : 0}%</span>
                      </div>
                      <p className="ratio-label">REM 수면</p>
                      <p className="ratio-status">{reportData ? '정상' : '데이터 없음'}</p>
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
                    <ErrorBoundary
                      fallback={
                        <div className="flex flex-col items-center justify-center p-8 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl">
                          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#fb2c36" strokeWidth="2" className="mb-4">
                            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                            <line x1="12" y1="9" x2="12" y2="13"/>
                            <line x1="12" y1="17" x2="12.01" y2="17"/>
                          </svg>
                          <p className="text-sm text-[#a1a1aa]">뇌파 차트를 표시할 수 없습니다</p>
                        </div>
                      }
                    >
                      <BrainwaveChart brainwaveAnalysis={reportData ? {
                        totalDuration: `${Math.round((reportData.deepSleepTime + reportData.lightSleepTime + reportData.remSleepTime) / 60)}시간 ${(reportData.deepSleepTime + reportData.lightSleepTime + reportData.remSleepTime) % 60}분`,
                        averageLevel: reportData.microwaveGrades.length > 0 ? (reportData.microwaveGrades.reduce((a, b) => a + b, 0) / reportData.microwaveGrades.length).toFixed(1) : '0.0',
                        deepSleepRatio: reportData.deepSleepRatio,
                        lightSleepRatio: reportData.lightSleepRatio,
                        remSleepRatio: reportData.remSleepRatio,
                        awakeRatio: 0,
                        dataPoints: reportData.microwaveGrades.map((grade, index) => ({
                          time: `${Math.floor((index * 5) / 60).toString().padStart(2, '0')}:${((index * 5) % 60).toString().padStart(2, '0')}`,
                          level: grade <= 20 ? 'A' : grade <= 40 ? 'B' : grade <= 60 ? 'C' : grade <= 80 ? 'D' : 'E',
                          intensity: grade
                        }))
                      } : {
                        totalDuration: '0시간 0분',
                        averageLevel: '0.0',
                        deepSleepRatio: 0,
                        lightSleepRatio: 0,
                        remSleepRatio: 0,
                        awakeRatio: 0,
                        dataPoints: []
                      }} />
                    </ErrorBoundary>
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
                        className="bg-transparent border-none text-[#a1a1aa] cursor-pointer p-1 rounded transition-all hover:bg-white/10 hover:text-white"
                        onClick={() => setShowRecommendations(!showRecommendations)}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="m6 9 6 6 6-6"/>
                        </svg>
                      </button>
                    </div>
                    <div className="noise-events-grid">
                      {reportData?.noiseEventTypes && reportData.noiseEventTypes.length > 0 ? (
                        <div className="grid grid-cols-2 gap-3">
                          {reportData.noiseEventTypes.map((eventType, index) => (
                          <div key={index} className="flex items-center gap-2 text-base">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary">
                              {eventType === 'user' && (
                                <>
                                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
                                  <circle cx="12" cy="7" r="4"/>
                                </>
                              )}
                              {eventType === 'air-vent' && (
                                <>
                                  <path d="M18 17.5a2.5 2.5 0 1 1-4 2.03V12"/>
                                  <path d="M6 12H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
                                  <path d="M6 8h12"/>
                                  <path d="M6.6 15.572A2 2 0 1 0 10 17v-5"/>
                                </>
                              )}
                              {eventType === 'car' && (
                                <>
                                  <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/>
                                  <circle cx="7" cy="17" r="2"/>
                                  <path d="M9 17h6"/>
                                  <circle cx="17" cy="17" r="2"/>
                                </>
                              )}
                              {eventType === 'bird' && (
                                <>
                                  <path d="M16 7h.01"/>
                                  <path d="M21.2 8c.4 0 .8.3.8.8v2.4c0 .4-.3.8-.8.8-.1 0-.2 0-.3-.1l-1.1-1.1-1.1 1.1c-.1.1-.2.1-.3.1-.4 0-.8-.3-.8-.8V8.8c0-.4.3-.8.8-.8.1 0 .2 0 .3.1l1.1 1.1L20.9 8c.1-.1.2-.1.3-.1z"/>
                                  <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8z"/>
                                </>
                              )}
                            </svg>
                            <span className="flex-1">{eventType}</span>
                          </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-8 text-center">
                          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#a1a1aa" strokeWidth="1.5" className="mb-3 opacity-50">
                            <path d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z"/>
                            <line x1="22" y1="9" x2="16" y2="15"/>
                            <line x1="16" y1="9" x2="22" y2="15"/>
                          </svg>
                          <p className="text-sm font-semibold text-white mb-1">감지된 소음이 없습니다</p>
                          <p className="text-xs text-[#a1a1aa]">조용한 환경에서 편안한 수면을 취하셨습니다</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* 수면 기록 메모 */}
                {reportData?.memo && (
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
                      <p>{reportData.memo}</p>
                    </div>
                  </div>
                )}

                {/* AI 분석 리포트 */}
                <div className="ai-analysis-card">
                  <div className="card-header">
                    <h4>개선 권장사항</h4>
                    <p>현재 수면 패턴을 기반으로 한 맞춤형 개선 방법</p>
                  </div>
                  <div className="flex flex-col gap-6">
                    <div className="recommendation-item">
                      <div className="recommendation-header">
                        <div className="recommendation-title">
                          <span className="text-2xl mr-2">💡</span>
                          일정한 취침 시간 유지
                        </div>
                        <div className="recommendation-badges">
                          <span className="badge badge-easy">쉬움</span>
                          <span className="badge badge-high-effect">높은 효과</span>
                        </div>
                      </div>
                      <p className="recommendation-description">
                        {reportData ? reportData.analysisDescription : '수면 데이터가 없어 분석할 수 없습니다.'}
                      </p>
                      <div className="text-[#00d4aa] text-sm font-medium mt-3">예상 기간: 2-3주</div>
                      <div className="recommendation-steps">
                        <div className="text-white font-semibold mb-3 text-sm">실행 단계:</div>
                        <ol className="text-[#d1d5db] pl-4 m-0 [&>li]:mb-2 [&>li]:leading-relaxed">
                          <li>목표 취침 시간을 정하세요 (예: 23:00)</li>
                          <li>주말에도 같은 시간을 유지하세요</li>
                          <li>취침 1시간 전부터 준비를 시작하세요</li>
                        </ol>
                      </div>
                    </div>

                    <div className="recommendation-item">
                      <div className="recommendation-header">
                        <div className="recommendation-title">
                          <span className="text-2xl mr-2">💡</span>
                          수면 환경 최적화
                        </div>
                        <div className="recommendation-badges">
                          <span className="badge badge-normal">보통</span>
                          <span className="badge badge-high-effect">높은 효과</span>
                        </div>
                      </div>
                      <p className="recommendation-description">
                        {reportData ? reportData.analysisDescription : '수면 환경 개선이 필요합니다.'}
                      </p>
                      <div className="text-[#00d4aa] text-sm font-medium mt-3">예상 기간: 1주</div>
                      <div className="recommendation-steps">
                        <div className="text-white font-semibold mb-3 text-sm">실행 단계:</div>
                        <ol className="text-[#d1d5db] pl-4 m-0 [&>li]:mb-2 [&>li]:leading-relaxed">
                          <li>방 온도를 18-20도로 유지하세요</li>
                          <li>완전히 어둡게 만들거나 수면 안대를 사용하세요</li>
                          <li>소음을 차단하거나 백색소음을 활용하세요</li>
                        </ol>
                      </div>
                    </div>

                    <div className="recommendation-item">
                      <div className="recommendation-header">
                        <div className="recommendation-title">
                          <span className="text-2xl mr-2">💡</span>
                          수면 전 루틴 개선
                        </div>
                        <div className="recommendation-badges">
                          <span className="badge badge-normal">보통</span>
                          <span className="badge badge-normal-effect">보통 효과</span>
                        </div>
                      </div>
                      <p className="recommendation-description">
                        {reportData ? reportData.analysisDescription : '수면 패턴 개선이 필요합니다.'}
                      </p>
                      <div className="text-[#00d4aa] text-sm font-medium mt-3">예상 기간: 1-2주</div>
                      <div className="recommendation-steps">
                        <div className="text-white font-semibold mb-3 text-sm">실행 단계:</div>
                        <ol className="text-[#d1d5db] pl-4 m-0 [&>li]:mb-2 [&>li]:leading-relaxed">
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
