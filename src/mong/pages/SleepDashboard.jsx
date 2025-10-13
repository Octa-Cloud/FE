import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Container from '../components/Container.jsx'
import { SleepHoursChart, SleepScoreChart } from '../components/Charts.jsx'
import { 
  generateSleepData, 
  calculateStats, 
  findSleepDataByDate,
  getRecentRecords,
} from '../utils/sleepData.js' 

// --- 아이콘 import ---
import { IoStatsChart, IoBedOutline } from "react-icons/io5";
import { LuCalendarDays, LuArrowRight } from "react-icons/lu";
import { FaChartLine, FaRegClock, FaUser, FaChartPie, FaChartBar, FaChevronLeft, FaChevronRight, FaPlus } from "react-icons/fa";

const generateCurrentWeekChartData = (sleepData) => {
  const today = new Date();
  const dayOfWeek = today.getDay(); 
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - dayOfWeek);
  startOfWeek.setHours(0, 0, 0, 0);
  const dayLabels = ['일', '월', '화', '수', '목', '금', '토'];
  const currentWeekData = sleepData.filter(data => {
    const recordDate = new Date(data.date);
    return recordDate >= startOfWeek && recordDate <= today;
  });
  const chartData = [];
  for (let i = 0; i < 7; i++) {
    const currentDate = new Date(startOfWeek);
    currentDate.setDate(startOfWeek.getDate() + i);
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    let foundData = null;
    if (i <= dayOfWeek) {
      foundData = currentWeekData.find(d => d.date === dateStr);
    }
    if (foundData) {
      chartData.push({ ...foundData, dayOfWeekLabel: dayLabels[i], day: `${month}월 ${day}일` });
    } else {
      chartData.push({ date: dateStr, hours: 0, sleepHours: 0, sleepMinutes: 0, score: 0, sleepScore: 0, day: `${month}월 ${day}일`, dayOfWeekLabel: dayLabels[i] });
    }
  }
  return {
    sleepHours: chartData.map(data => ({ day: data.day, hours: data.hours || (data.sleepHours + data.sleepMinutes / 60), sleepHours: data.sleepHours, sleepMinutes: data.sleepMinutes, dayOfWeekLabel: data.dayOfWeekLabel })),
    sleepScores: chartData.map(data => ({ day: data.day, score: data.sleepScore || 0, dayOfWeekLabel: data.dayOfWeekLabel }))
  };
};

export default function SleepDashboard() {
  const [sleepData, setSleepData] = useState([])
  const [stats, setStats] = useState({})
  const [chartData, setChartData] = useState({})
  const [selectedDate, setSelectedDate] = useState(null)
  const [recentRecords, setRecentRecords] = useState([])
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const today = new Date();
  today.setHours(0,0,0,0);
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const loadSleepData = () => {
    const data = generateSleepData(); setSleepData(data); const calculatedStats = calculateStats(data); setStats(calculatedStats); const chart = generateCurrentWeekChartData(data); setChartData(chart); const recent = getRecentRecords(data); setRecentRecords(recent);
  }

  useEffect(() => {
    loadSleepData()
  }, [])
  
  const hasChartData = chartData.sleepHours?.some(day => day.hours > 0);

  const handleLogout = () => {
    if (window.confirm('로그아웃 하시겠습니까?')) {
      console.log("로그아웃 처리 로직 실행");
      alert('로그아웃 되었습니다.');
      setIsProfileMenuOpen(false);
    }
  };

  const getMonthName = (date) => `${date.getFullYear()}년 ${date.getMonth() + 1}월`
  const getCalendarDays = (date) => {
    const year = date.getFullYear(); const month = date.getMonth(); const firstDay = new Date(year, month, 1); const lastDay = new Date(year, month + 1, 0); const firstDayOfWeek = firstDay.getDay(); const days = []; const prevMonth = new Date(year, month, 0); for (let i = firstDayOfWeek - 1; i >= 0; i--) { days.push({ day: prevMonth.getDate() - i, isCurrentMonth: false, date: new Date(year, month - 1, prevMonth.getDate() - i) }) } for (let day = 1; day <= lastDay.getDate(); day++) { days.push({ day, isCurrentMonth: true, date: new Date(year, month, day) }) } const remainingDays = 42 - days.length; for (let day = 1; day <= remainingDays; day++) { days.push({ day, isCurrentMonth: false, date: new Date(year, month + 1, day) }) } return days
  }
  const goToPreviousMonth = () => setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))
  const goToNextMonth = () => setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))
  const selectedDayData = findSleepDataByDate(sleepData, selectedDate)

  return (
    <div style={{ backgroundColor: '#000000', minHeight: '100vh', color: '#fff' }}>
      <div style={{ backgroundColor: '#000000', borderBottom: '1px solid #27272a', padding: '16px 0' }}>
        <Container>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 32 }}>
            <Link to="/dashboard" style={{ textDecoration: 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', backgroundColor: 'rgba(0, 212, 170, 0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <IoBedOutline color="#00d4aa" size={20} />
                </div>
                <span style={{ fontFamily: 'Righteous, system-ui', fontSize: 24, color: '#fff' }}>mong</span>
              </div>
            </Link>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <button style={{ background: 'none', border: 'none', color: '#a1a1aa', fontSize: 14, fontWeight: 500, cursor: 'pointer', padding: '8px 16px' }}>상세기록</button>
              <button style={{ background: 'none', border: 'none', color: '#a1a1aa', fontSize: 14, fontWeight: 500, cursor: 'pointer', padding: '8px 16px' }}>통계</button>
              <button style={{ background: 'none', border: 'none', color: '#a1a1aa', fontSize: 14, fontWeight: 500, cursor: 'pointer', padding: '8px 16px' }}>AI 인사이트</button>
              <div style={{ width: 1, height: 24, backgroundColor: '#27272a' }} />
              <Link to="/sleep-setup" style={{ textDecoration: 'none' }}>
                <button style={{ backgroundColor: '#00d4aa', border: 'none', color: '#000', fontSize: 14, fontWeight: 600, cursor: 'pointer', padding: '8px 16px', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <FaPlus size={14} />
                  수면 기록 시작
                </button>
              </Link>
              <div 
                style={{ position: 'relative', marginLeft: 8 }}
                onMouseEnter={() => setIsProfileMenuOpen(true)}
                onMouseLeave={() => setIsProfileMenuOpen(false)}
              >
                <div style={{ backgroundColor: '#27272a', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  <FaUser color="#a1a1aa" />
                </div>
                {isProfileMenuOpen && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    paddingTop: '8px', 
                    width: '160px',
                    zIndex: 10,
                  }}>
                    <div style={{
                      backgroundColor: '#1a1a1a',
                      border: '1px solid #3f3f46',
                      borderRadius: '8px',
                      padding: '8px',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)'
                    }}>
                      <button style={{ width: '100%', background: 'none', border: 'none', color: '#fafafa', padding: '8px 12px', textAlign: 'left', borderRadius: '4px', cursor: 'pointer' }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#3f3f46'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        내 정보 수정하기
                      </button>
                      <button 
                        onClick={handleLogout}
                        style={{ width: '100%', background: 'none', border: 'none', color: '#ef4444', padding: '8px 12px', textAlign: 'left', borderRadius: '4px', cursor: 'pointer' }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#3f3f46'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        로그아웃
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Container>
      </div>
      <Container>
        <div style={{ paddingTop: 32, paddingBottom: 32 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 32 }}>
            <div style={{ backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 14, padding: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}><span style={{ fontSize: 14, fontWeight: 500, color: '#fafafa' }}>전체 평균 점수</span><IoStatsChart color="#a1a1aa" size={16} /></div>
              <div style={{ fontSize: 32, fontWeight: 700, color: '#fafafa', marginBottom: 8 }}>{stats.averageScore}점</div>
              <div style={{ fontSize: 12, color: '#a1a1aa' }}>{stats.totalRecords}일 기록</div>
            </div>
            <div style={{ backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 14, padding: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}><span style={{ fontSize: 14, fontWeight: 500, color: '#fafafa' }}>주간 평균</span><FaChartLine color="#a1a1aa" size={16} /></div>
              <div style={{ fontSize: 32, fontWeight: 700, color: '#fafafa', marginBottom: 8 }}>{stats.weeklyAverage}점</div>
              <div style={{ fontSize: 12, color: '#a1a1aa' }}>이번 주 평균</div>
            </div>
            <div style={{ backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 14, padding: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}><span style={{ fontSize: 14, fontWeight: 500, color: '#fafafa' }}>평균 수면 시간</span><FaRegClock color="#a1a1aa" size={16} /></div>
              <div style={{ fontSize: 32, fontWeight: 700, color: '#fafafa', marginBottom: 8 }}>{stats.averageSleepHours}h</div>
              <div style={{ fontSize: 12, color: '#a1a1aa' }}>목표: 8시간</div>
            </div>
          </div>
          <div style={{ backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 14, padding: 24, marginBottom: 32 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><FaChartPie color="#a1a1aa" size={18} /><span style={{ fontSize: 16, fontWeight: 700, color: '#fafafa' }}>수면 패턴 분석</span></div>
              <button style={{ backgroundColor: '#3f3f46', border: '1px solid #52525b', color: '#fafafa', fontSize: 14, fontWeight: 500, cursor: 'pointer', padding: '8px 16px', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 8 }}><IoStatsChart size={16} />통계 보기</button>
            </div>
            {hasChartData ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24 }}>
                <div><div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}><FaChartBar color="#a1a1aa" size={16} /><span style={{ fontSize: 16, fontWeight: 500, color: '#fafafa' }}>수면 시간 추이</span></div><SleepHoursChart data={chartData.sleepHours || []} /></div>
                <div><div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}><FaChartLine color="#a1a1aa" size={16} /><span style={{ fontSize: 16, fontWeight: 500, color: '#fafafa' }}>수면 점수 추이</span></div><SleepScoreChart data={chartData.sleepScores || []} /></div>
              </div>
            ) : (
              <div style={{ height: 220, backgroundColor: '#2a2a2a', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a1a1aa', fontSize: 14 }}>이번 주 수면 기록이 없습니다.</div>
            )}
          </div>
          <div style={{ backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 14, padding: 24, marginBottom: 32 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><LuCalendarDays color="#a1a1aa" size={20} /><span style={{ fontSize: 16, fontWeight: 700, color: '#fafafa' }}>수면 기록 달력</span></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <button onClick={goToPreviousMonth} style={{ background: '#3f3f46', border: '1px solid #52525b', color: '#fafafa', cursor: 'pointer', borderRadius: 8, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FaChevronLeft size={14} /></button>
                <span style={{ fontSize: 16, fontWeight: 500, color: '#fafafa', minWidth: 120, textAlign: 'center' }}>{getMonthName(currentMonth)}</span>
                <button onClick={goToNextMonth} style={{ background: '#3f3f46', border: '1px solid #52525b', color: '#fafafa', cursor: 'pointer', borderRadius: 8, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FaChevronRight size={14} /></button>
              </div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8, marginBottom: 16 }}>
                {['일', '월', '화', '수', '목', '금', '토'].map(day => (<div key={day} style={{ textAlign: 'center', fontSize: 14, fontWeight: 500, color: '#a1a1aa' }}>{day}</div>))}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8 }}>
                {getCalendarDays(currentMonth).map((dayInfo, index) => {
                  const { day, isCurrentMonth, date } = dayInfo;
                  const year = date.getFullYear(); const month = String(date.getMonth() + 1).padStart(2, '0'); const dayOfMonth = String(date.getDate()).padStart(2, '0'); const dateStr = `${year}-${month}-${dayOfMonth}`; const dayData = findSleepDataByDate(sleepData, dateStr); const isSelected = selectedDate === dateStr; const isToday = dateStr === todayStr; const isClickable = isCurrentMonth && date <= today;
                  return (
                    <div key={index} style={{ textAlign: 'center', fontWeight: isSelected ? 700 : 500, fontSize: 16, padding: '8px 0', backgroundColor: isSelected ? '#00d4aa' : isToday ? '#3f3f46' : 'transparent', color: isSelected ? '#000' : isCurrentMonth ? '#fafafa' : '#52525b', borderRadius: isSelected || isToday ? 10 : 0, position: 'relative', cursor: isClickable ? 'pointer' : 'default', transition: 'all 0.2s ease', opacity: isClickable ? 1 : 0.5 }} onClick={() => { if (isClickable) { setSelectedDate(dateStr); } }}>
                      {day}
                      {dayData && isCurrentMonth && (<div style={{ position: 'absolute', bottom: 6, left: '50%', transform: 'translateX(-50%)', width: 6, height: 6, backgroundColor: dayData.scoreColor, borderRadius: '50%' }} />)}
                    </div>
                  );
                })}
              </div>
            </div>
            {selectedDate ? ( selectedDayData ? ( <div style={{ backgroundColor: '#18181b', borderRadius: 10, padding: 16, display: 'flex', alignItems: 'center', gap: 16 }}> <div style={{ width: 60, height: 60, border: `2px solid ${selectedDayData.scoreColor}`, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 700, color: selectedDayData.scoreColor }}>{selectedDayData.sleepScore}</div> <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 16px' }}> <div><div style={{ fontSize: 12, color: '#a1a1aa', marginBottom: 4 }}>수면 시간</div><div style={{ fontSize: 14, fontWeight: 700, color: '#fafafa' }}>{selectedDayData.sleepDuration}</div></div> <div><div style={{ fontSize: 12, color: '#a1a1aa', marginBottom: 4 }}>수면 상태</div><div style={{ fontSize: 14, fontWeight: 700, color: selectedDayData.scoreColor }}>{selectedDayData.sleepStatus}</div></div> <div><div style={{ fontSize: 12, color: '#a1a1aa', marginBottom: 4 }}>취침 시각</div><div style={{ fontSize: 14, fontWeight: 700, color: '#fafafa' }}>{selectedDayData.bedTime}</div></div> <div><div style={{ fontSize: 12, color: '#a1a1aa', marginBottom: 4 }}>기상 시각</div><div style={{ fontSize: 14, fontWeight: 700, color: '#fafafa' }}>{selectedDayData.wakeTime}</div></div> </div> <button style={{ background: '#3f3f46', border: '1px solid #52525b', color: '#fafafa', fontSize: 14, fontWeight: 500, cursor: 'pointer', padding: '8px 16px', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 8, alignSelf: 'stretch' }}><LuArrowRight size={16} />상세 기록</button> </div> ) : ( (selectedDate === todayStr) ? ( <div style={{ backgroundColor: '#18181b', borderRadius: 10, padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}> <span style={{ color: '#a1a1aa', fontSize: 14 }}>오늘 수면 기록이 없습니다.</span> <Link to="/sleep-setup" style={{ textDecoration: 'none' }}> <button style={{ backgroundColor: '#00d4aa', border: 'none', color: '#000', fontSize: 14, fontWeight: 600, cursor: 'pointer', padding: '8px 16px', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 8 }}> <FaPlus size={14} /> 수면 측정하러 가기 </button> </Link> </div> ) : ( <div style={{ backgroundColor: '#18181b', borderRadius: 10, padding: 24, textAlign: 'center', color: '#a1a1aa' }}> {`${parseInt(selectedDate.split('-')[1])}월 ${parseInt(selectedDate.split('-')[2])}일 수면 기록이 없습니다.`} </div> ) ) ) : ( <div style={{ backgroundColor: '#18181b', borderRadius: 10, padding: 24, textAlign: 'center', color: '#a1a1aa' }}> 달력에서 날짜를 클릭하여 수면 기록을 확인하세요 </div> )}
          </div>
          <div style={{ backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 14, padding: 24 }}>
            <div style={{ marginBottom: 16 }}><span style={{ fontSize: 18, fontWeight: 700, color: '#fafafa' }}>최근 수면 기록</span></div>
            <div style={{ fontSize: 14, color: '#a1a1aa', marginBottom: 24 }}>최근 기록들을 한눈에 확인하고 월간 리포트에서 상세 분석을 확인하세요</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
              {recentRecords.map((record, index) => {
                const date = new Date(record.date); const formattedDate = `${date.getMonth() + 1}월 ${date.getDate()}일`;
                return (
                  <div key={index} style={{ backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 10, padding: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}><span style={{ fontSize: 14, fontWeight: 500, color: '#fafafa' }}>{formattedDate}</span><div style={{ width: 40, height: 40, border: `2px solid ${record.scoreColor}`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: record.scoreColor }}>{record.sleepScore}</div></div>
                    <div style={{ fontSize: 12, color: '#a1a1aa', marginBottom: 4 }}>수면 시간</div><div style={{ fontSize: 14, color: '#fafafa', marginBottom: 16, fontWeight: 500 }}>{record.sleepDuration}</div>
                    <div style={{ fontSize: 12, color: '#a1a1aa', marginBottom: 8 }}>수면 패턴</div><div style={{ backgroundColor: '#3f3f46', borderRadius: 8, padding: '4px 8px', display: 'inline-block', fontSize: 12, fontWeight: 500, color: record.scoreColor }}>{record.sleepStatus}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}