import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileHeader from '../components/ProfileHeader';
import Container from '../components/Container';
import { SleepHoursChart, SleepScoreChart } from '../components/Charts';
import { useAuth, useUserProfile } from '../store/hooks';
import '../styles/profile.css';

import {
    generateSleepData,
    calculateStats,
    findSleepDataByDate,
    getRecentRecords,
    clearSleepData,
    SleepData
} from '../sleepTestData';

import { IoStatsChart } from "react-icons/io5";
import { LuCalendarDays, LuArrowRight } from "react-icons/lu";
import { FaChartLine, FaRegClock, FaChartPie, FaChartBar, FaChevronLeft, FaChevronRight, FaPlus } from "react-icons/fa";

// 👇 [수정] "새벽 6시 이전" 관련 중복 로직을 모두 제거하고 단순화
const generateCurrentWeekChartData = (sleepData: SleepData[]) => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - dayOfWeek);
    startOfWeek.setHours(0, 0, 0, 0);
    const dayLabels = ['일', '월', '화', '수', '목', '금', '토'];

    // 이번 주에 해당하는 모든 데이터를 필터링
    const currentWeekData = sleepData.filter(data => {
        // Timezone 문제를 피하기 위해 날짜 문자열을 직접 파싱
        const [year, month, day] = data.date.split('-').map(Number);
        const recordDate = new Date(year, month - 1, day);
        return recordDate >= startOfWeek && recordDate <= today;
    });

    const chartData: any[] = [];
    for (let i = 0; i < 7; i++) {
        const currentDate = new Date(startOfWeek);
        currentDate.setDate(startOfWeek.getDate() + i);
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const day = String(currentDate.getDate()).padStart(2, '0');
        const dateStr = `${year}-${month}-${day}`;
        
        // 필터링된 데이터에서 해당 날짜의 기록을 찾음
        const foundData = currentWeekData.find(d => d.date === dateStr);
        
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
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const { profile } = useUserProfile();
    
    const [sleepData, setSleepData] = useState<SleepData[]>([])
    const [stats, setStats] = useState<any>({})
    const [chartData, setChartData] = useState<any>({})
    const [selectedDate, setSelectedDate] = useState<string | null>(null)
    const [recentRecords, setRecentRecords] = useState<SleepData[]>([])
    const [currentMonth, setCurrentMonth] = useState(new Date())

    const today = new Date();
    today.setHours(0,0,0,0);
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    const loadSleepData = () => {
        clearSleepData();
        const data = generateSleepData(); 
        setSleepData(data); 
        const calculatedStats = calculateStats(data); 
        setStats(calculatedStats); 
        const chart = generateCurrentWeekChartData(data); 
        setChartData(chart); 
        const recent = getRecentRecords(data); 
        setRecentRecords(recent);
    }

    useEffect(() => {
        loadSleepData()
    }, [])

    const hasChartData = chartData.sleepHours?.some((day: any) => day.hours > 0);

    const currentUser = user || profile;
    
    const userProfile = {
        name: currentUser?.name || '사용자',
        avatar: (currentUser?.name || '사용자').charAt(0)
    };

    const handleBack = () => {
        navigate('/profile');
    };

    const handleStartSleepRecord = () => {
        navigate('/sleep-setup');
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const getMonthName = (date: Date) => `${date.getFullYear()}년 ${date.getMonth() + 1}월`
    const getCalendarDays = (date: Date) => {
        const year = date.getFullYear(); const month = date.getMonth(); const firstDay = new Date(year, month, 1); const lastDay = new Date(year, month + 1, 0); const firstDayOfWeek = firstDay.getDay(); const days = []; const prevMonth = new Date(year, month, 0); for (let i = firstDayOfWeek - 1; i >= 0; i--) { days.push({ day: prevMonth.getDate() - i, isCurrentMonth: false, date: new Date(year, month - 1, prevMonth.getDate() - i) }) } for (let day = 1; day <= lastDay.getDate(); day++) { days.push({ day, isCurrentMonth: true, date: new Date(year, month, day) }) } const remainingDays = 42 - days.length; for (let day = 1; day <= remainingDays; day++) { days.push({ day, isCurrentMonth: false, date: new Date(year, month + 1, day) }) } return days
    }
    const goToPreviousMonth = () => setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))
    const goToNextMonth = () => setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))
    const selectedDayData = findSleepDataByDate(sleepData, selectedDate)

    return (
        <Container className="sleep-dashboard-page" backgroundColor="#000000">
            <ProfileHeader
                onBack={handleBack}
                onStartSleepRecord={handleStartSleepRecord}
                userProfile={userProfile}
                onLogout={handleLogout}
            />
            
            <main className="flex-1 flex justify-center px-8 py-6 relative">
                <div className="w-full max-w-4xl relative">
                    <div className="profile-content">
                        <div className="sleep-dashboard-content">
                            <div className="grid grid-cols-3 gap-4 mb-6">
                                <div className="stats-card">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-sm font-medium text-white">전체 평균 점수</span>
                                        <IoStatsChart color="#a1a1aa" size={16} />
                                    </div>
                                    <div className="text-3xl font-bold text-white mb-2">{stats.averageScore}점</div>
                                    <div className="text-xs text-gray-400">{stats.totalRecords}일 기록</div>
                                </div>
                                <div className="stats-card">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-sm font-medium text-white">주간 평균</span>
                                        <FaChartLine color="#a1a1aa" size={16} />
                                    </div>
                                    <div className="text-3xl font-bold text-white mb-2">{stats.weeklyAverage}점</div>
                                    <div className="text-xs text-gray-400">이번 주 평균</div>
                                </div>
                                <div className="stats-card">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-sm font-medium text-white">평균 수면 시간</span>
                                        <FaRegClock color="#a1a1aa" size={16} />
                                    </div>
                                    <div className="text-3xl font-bold text-white mb-2">{stats.averageSleepHours}h</div>
                                    <div className="text-xs text-gray-400">목표: 8시간</div>
                                </div>
                            </div>
                            
                            <div className="sleep-goal-card mb-6">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-2">
                                        <FaChartPie color="#a1a1aa" size={18} />
                                        <span className="text-lg font-bold text-white">수면 패턴 분석</span>
                                    </div>
                                    <button className="px-4 py-2 bg-gray-600 border border-gray-500 text-white text-sm font-medium rounded-lg flex items-center gap-2 hover:bg-gray-500 transition-colors">
                                        <IoStatsChart size={16} />
                                        통계 보기
                                    </button>
                                </div>
                                {hasChartData ? (
                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <div className="flex items-center gap-2 mb-4">
                                                <FaChartBar color="#a1a1aa" size={16} />
                                                <span className="text-base font-medium text-white">수면 시간 추이</span>
                                            </div>
                                            <SleepHoursChart data={chartData.sleepHours || []} />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-4">
                                                <FaChartLine color="#a1a1aa" size={16} />
                                                <span className="text-base font-medium text-white">수면 점수 추이</span>
                                            </div>
                                            <SleepScoreChart data={chartData.sleepScores || []} />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="h-56 bg-gray-700 rounded-lg flex items-center justify-center text-gray-400 text-sm">
                                        이번 주 수면 기록이 없습니다.
                                    </div>
                                )}
                            </div>
                            
                            <div className="sleep-goal-card mb-6">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-2">
                                        <LuCalendarDays color="#a1a1aa" size={20} />
                                        <span className="text-lg font-bold text-white">수면 기록 달력</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <button onClick={goToPreviousMonth} className="w-8 h-8 bg-gray-600 border border-gray-500 text-white rounded-lg flex items-center justify-center hover:bg-gray-500 transition-colors"><FaChevronLeft size={14} /></button>
                                        <span className="text-base font-medium text-white min-w-[120px] text-center">{getMonthName(currentMonth)}</span>
                                        <button onClick={goToNextMonth} className="w-8 h-8 bg-gray-600 border border-gray-500 text-white rounded-lg flex items-center justify-center hover:bg-gray-500 transition-colors"><FaChevronRight size={14} /></button>
                                    </div>
                                </div>
                                
                                <div className="mb-4">
                                    <div className="grid grid-cols-7 gap-2 mb-4">
                                        {['일', '월', '화', '수', '목', '금', '토'].map(day => (<div key={day} className="text-center text-sm font-medium text-gray-400">{day}</div>))}
                                    </div>
                                    <div className="grid grid-cols-7 gap-2">
                                        {getCalendarDays(currentMonth).map((dayInfo, index) => {
                                            const { day, isCurrentMonth, date } = dayInfo;
                                            const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
                                            const dayData = findSleepDataByDate(sleepData, dateStr); 
                                            const isSelected = selectedDate === dateStr; 
                                            const isToday = dateStr === todayStr; 
                                            const isClickable = isCurrentMonth && date <= today;
                                            
                                            return (
                                                <div 
                                                    key={index} 
                                                    className={`text-center font-medium text-base py-2 relative transition-all duration-200 rounded-lg ${isSelected ? 'bg-primary-400 text-black font-bold' : isToday ? 'bg-gray-600 text-white' : isClickable ? 'hover:bg-gray-600' : ''} ${isCurrentMonth ? 'text-white' : 'text-gray-500'} ${isClickable ? 'cursor-pointer' : 'cursor-default opacity-50'}`}
                                                    onClick={() => { if (isClickable) { setSelectedDate(dateStr); } }}
                                                >
                                                    {day}
                                                    {dayData && isCurrentMonth && (<div className="absolute bottom-1.5 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: dayData.scoreColor }}/>)}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                                
                                {selectedDate ? (
                                    selectedDayData ? (
                                        <div className="bg-gray-800 rounded-lg p-4 flex items-center gap-4">
                                            <div className="w-15 h-15 border-2 rounded-lg flex items-center justify-center text-xl font-bold" style={{ borderColor: selectedDayData.scoreColor, color: selectedDayData.scoreColor }}>{selectedDayData.sleepScore}</div>
                                            <div className="flex-1 grid grid-cols-2 gap-4">
                                                <div><div className="text-xs text-gray-400 mb-1">수면 시간</div><div className="text-sm font-bold text-white">{selectedDayData.sleepDuration}</div></div>
                                                <div><div className="text-xs text-gray-400 mb-1">수면 상태</div><div className="text-sm font-bold" style={{ color: selectedDayData.scoreColor }}>{selectedDayData.sleepStatus}</div></div>
                                                <div><div className="text-xs text-gray-400 mb-1">취침 시각</div><div className="text-sm font-bold text-white">{selectedDayData.bedTime}</div></div>
                                                <div><div className="text-xs text-gray-400 mb-1">기상 시각</div><div className="text-sm font-bold text-white">{selectedDayData.wakeTime}</div></div>
                                            </div>
                                            <button className="px-4 py-2 bg-gray-600 border border-gray-500 text-white text-sm font-medium rounded-lg flex items-center gap-2 hover:bg-gray-500 transition-colors"><LuArrowRight size={16} />상세 기록</button>
                                        </div>
                                    ) : (
                                        selectedDate === todayStr ? (
                                            <div className="bg-gray-800 rounded-lg p-4 flex items-center justify-between">
                                                <span className="text-gray-400 text-sm">
                                                    {today.getHours() < 6 ? "아직 수면 기록이 없습니다. (새벽 6시 이후부터 기록됩니다)" : "오늘 수면 기록이 없습니다."}
                                                </span>
                                                {today.getHours() >= 6 && (
                                                    <button onClick={() => navigate('/sleep-setup')} className="px-4 py-2 bg-primary-400 text-black text-sm font-semibold rounded-lg flex items-center gap-2 hover:bg-primary-300 transition-colors"><FaPlus size={14} />수면 측정하러 가기</button>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="bg-gray-800 rounded-lg p-6 text-center text-gray-400">{`${parseInt(selectedDate.split('-')[1])}월 ${parseInt(selectedDate.split('-')[2])}일 수면 기록이 없습니다.`}</div>
                                        )
                                    )
                                ) : (
                                    <div className="bg-gray-800 rounded-lg p-6 text-center text-gray-400">달력에서 날짜를 클릭하여 수면 기록을 확인하세요</div>
                                )}
                            </div>
                            
                            <div className="sleep-goal-card">
                                <div className="mb-4"><span className="text-lg font-bold text-white">최근 수면 기록</span></div>
                                <div className="text-sm text-gray-400 mb-6">최근 기록들을 한눈에 확인하고 월간 리포트에서 상세 분석을 확인하세요</div>
                                <div className="grid grid-cols-4 gap-4">
                                    {recentRecords.map((record, index) => {
                                        const date = new Date(record.date); 
                                        const formattedDate = `${date.getMonth() + 1}월 ${date.getDate()}일`;
                                        return (
                                            <div key={index} className="stats-card">
                                                <div className="flex items-center justify-between mb-4">
                                                    <span className="text-sm font-medium text-white">{formattedDate}</span>
                                                    <div className="w-10 h-10 border-2 rounded-full flex items-center justify-center text-sm font-bold" style={{ borderColor: record.scoreColor, color: record.scoreColor }}>{record.sleepScore}</div>
                                                </div>
                                                <div className="text-xs text-gray-400 mb-1">수면 시간</div>
                                                <div className="text-sm text-white mb-4 font-medium">{record.sleepDuration}</div>
                                                <div className="text-xs text-gray-400 mb-2">수면 패턴</div>
                                                <div className="bg-gray-600 rounded-lg px-2 py-1 inline-block text-xs font-medium" style={{ color: record.scoreColor }}>{record.sleepStatus}</div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </Container>
    )
}

