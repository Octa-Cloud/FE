import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import Container from '../components/Container';
import SleepTimeChart from '../components/charts/SleepTimeChart';
import SleepScoreChart from '../components/charts/SleepScoreChart';
import { useAuth, useUserProfile } from '../store/hooks';
import { sleepAPI, SleepPattern } from '../api/sleep';
import '../styles/sleep-dashboard.css';
import '../styles/statistics.css';

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

//  이번 주(일~토) 범위 내의 수면 데이터를 필터링하고
//  차트에서 사용할 sleepHours / sleepScores 배열 생성
//  → 주간 수면 추이 및 점수 추이 그래프에 사용됨
const generateCurrentWeekChartData = (sleepData: SleepData[]) => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - dayOfWeek);
    startOfWeek.setHours(0, 0, 0, 0);
    const dayLabels = ['일', '월', '화', '수', '목', '금', '토'];

    const currentWeekData = sleepData.filter(data => {
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
        
        const foundData = currentWeekData.find(d => d.date === dateStr);
        
        if (foundData) {
            chartData.push({ ...foundData, dayOfWeekLabel: dayLabels[i], day: `${month}월 ${day}일` });
        } else {
            chartData.push({ date: dateStr, hours: 0, sleepHours: 0, sleepMinutes: 0, score: 0, sleepScore: 0, day: `${month}월 ${day}일`, dayOfWeekLabel: dayLabels[i] });
        }
    }
    return {
        sleepHours: chartData.map(data => ({ 
            day: data.day, 
            hours: data.sleepTimeHours || data.hours || (data.sleepHours + data.sleepMinutes / 60), 
            sleepHours: data.sleepHours, 
            sleepMinutes: data.sleepMinutes, 
            dayOfWeekLabel: data.dayOfWeekLabel 
        })),
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
    const [chartSectionVisible, setChartSectionVisible] = useState(false)

    const today = new Date();
    today.setHours(0,0,0,0);
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    const calendarDays = useMemo(() => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay(); // 0: 일요일, 1: 월요일 ...
        
        const days = [];
        
        // 1. 이전 달의 빈 날짜들을 null로 채웁니다.
        for (let i = 0; i < startingDayOfWeek; i++) {
          days.push(null);
        }
        
        // 2. 현재 달의 날짜들을 객체로 채웁니다.
        for (let day = 1; day <= daysInMonth; day++) {
          days.push({
            day: day,
            date: new Date(year, month, day),
          });
        }
        
        // 3. 마지막 주를 7일로 맞추기 위해 다음 달의 빈 날짜들을 null로 채웁니다.
        const totalCells = days.length;
        const lastWeekRemainingCells = (7 - (totalCells % 7)) % 7;
        for (let i = 0; i < lastWeekRemainingCells; i++) {
          days.push(null);
        }
        
        return days;
    }, [currentMonth]);

    const loadSleepData = useCallback(async () => {
        clearSleepData();
        
        let data: SleepData[] = [];
        
        try {
            // 현재 선택된 월의 연도와 월 계산
            const year = currentMonth.getFullYear();
            const month = currentMonth.getMonth() + 1; // getMonth()는 0부터 시작하므로 +1
            
            console.log('🔍 API 호출: 월별 수면 요약 조회', { year, month });
            
            // API에서 월별 수면 요약 데이터 가져오기
            const response = await sleepAPI.getMonthlySleepSummary(year, month);
            console.log('✅ API 응답: 월별 수면 요약 조회 성공', response);
            
            if (response.result && response.result.length > 0) {
                // SleepSummaryResponse를 SleepData 형식으로 변환
                data = response.result.map((summary: any) => {
                    const sleepHours = Math.floor(summary.totalSleepTime / 60);
                    const sleepMinutes = summary.totalSleepTime % 60;
                    const sleepDurationHours = sleepHours + (sleepMinutes / 60);
                    
                    return {
                        date: summary.date,
                        sleepScore: summary.score,
                        sleepDuration: `${sleepHours}시간 ${sleepMinutes}분`,
                        sleepHours: sleepHours,
                        sleepMinutes: sleepMinutes,
                        sleepTimeHours: sleepDurationHours,
                        sleepStatus: summary.score >= 80 ? '좋음' : summary.score >= 60 ? '보통' : '나쁨',
                        scoreColor: summary.score >= 80 ? '#22C55E' : summary.score >= 60 ? '#EAB308' : '#C52222',
                        bedTime: summary.bedTime || '22:00',
                        wakeTime: summary.wakeTime || '07:00',
                        sleepEfficiency: 85,
                        sleepStages: { deep: 20, light: 50, rem: 30 },
                        brainwaveData: [],
                        noiseEvents: [],
                        sleepMemo: ''
                    };
                });
                
                console.log('😴 월별 수면 데이터 변환 완료:', data.length, '개 기록');
            } else {
                console.log('📝 해당 월의 수면 기록이 없습니다.');
                data = [];
            }
            
        } catch (error: any) {
            console.error('❌ 월별 수면 요약 API 호출 실패:', error);
            
            // 모든 에러를 콘솔에만 로그하고 UI에는 표시하지 않음
            if (error.response?.status === 404) {
                console.log('📝 404 에러: 해당 월의 수면 기록이 없습니다.');
                data = [];
            } else {
                console.log('⚠️ API 호출 실패: localStorage에서 데이터 가져오기 시도');
                
                // API 호출 실패 시 localStorage에서 데이터 가져오기 (fallback)
                const storedSleepData = JSON.parse(localStorage.getItem('sleepData') || '[]');
                const currentUserId = user?.id || profile?.id;
            
                if (currentUserId) {
                    const userData = storedSleepData.find((data: any) => data.userId === currentUserId);
                    if (userData) {
                        data = userData.records.map((record: any) => {
                            let sleepDurationHours = 0;
                            if (typeof record.sleepTime === 'string') {
                                const timeMatch = record.sleepTime.match(/(\d+)시간\s*(\d+)?분?/);
                                if (timeMatch) {
                                    const hours = parseInt(timeMatch[1]);
                                    const minutes = timeMatch[2] ? parseInt(timeMatch[2]) : 0;
                                    sleepDurationHours = hours + (minutes / 60);
                                }
                            } else if (typeof record.sleepTime === 'number') {
                                sleepDurationHours = record.sleepTime;
                            }
                            
                            return {
                                date: record.date,
                                sleepScore: record.sleepScore,
                                sleepDuration: sleepDurationHours > 0 ? `${Math.floor(sleepDurationHours)}시간 ${Math.round((sleepDurationHours % 1) * 60)}분` : record.sleepTime,
                                sleepHours: Math.floor(sleepDurationHours),
                                sleepMinutes: Math.round((sleepDurationHours % 1) * 60),
                                sleepTimeHours: record.sleepTimeHours || sleepDurationHours,
                                sleepStatus: record.sleepScore >= 80 ? '좋음' : record.sleepScore >= 60 ? '보통' : '나쁨',
                                scoreColor: record.sleepScore >= 80 ? '#22C55E' : record.sleepScore >= 60 ? '#EAB308' : '#C52222',
                                bedTime: record.bedtime,
                                wakeTime: record.wakeTime,
                                sleepEfficiency: record.sleepEfficiency,
                                sleepStages: record.sleepStages,
                                brainwaveData: record.brainwaveData,
                                noiseEvents: record.noiseEvents,
                                sleepMemo: record.sleepMemo
                            };
                        });
                    }
                }
                
                // 데이터가 없으면 빈 배열로 유지 (더미 데이터 생성하지 않음)
                if (data.length === 0) {
                    console.log('No sleep data found in localStorage');
                }
            }
        }
        
        setSleepData(data); 
        
        // 실제 API에서 수면 통계 가져오기
        try {
            const apiResponse = await sleepAPI.getTotalSleepStats();
            const apiStats = apiResponse.result;
            
            // 이번 주의 실제 평균 계산 (기존 로컬 데이터 사용)
            const today = new Date();
            const dayOfWeek = today.getDay();
            const startOfWeek = new Date(today);
            startOfWeek.setDate(today.getDate() - dayOfWeek);
            startOfWeek.setHours(0, 0, 0, 0);

            const currentWeekData = data.filter(sleepData => {
                const recordDate = new Date(sleepData.date);
                return recordDate >= startOfWeek && recordDate <= today;
            });

            let weeklyAverage = 0;
            if (currentWeekData.length > 0) {
                const weeklyScore = currentWeekData.reduce((sum, sleepData) => sum + sleepData.sleepScore, 0);
                weeklyAverage = Math.round(weeklyScore / currentWeekData.length);
            } else {
                // 이번 주 데이터가 없으면 API에서 가져온 전체 평균 사용
                weeklyAverage = apiStats.avgScore || 0;
            }

            // API 데이터와 로컬 주간 데이터 결합
            const calculatedStats = {
                averageScore: apiStats.avgScore || 0,
                weeklyAverage: weeklyAverage,
                averageSleepHours: apiStats.avgSleepTime ? (apiStats.avgSleepTime / 60).toFixed(1) : 0, // 분을 시간으로 변환
                totalRecords: data.length
            };
            
            setStats(calculatedStats);
        } catch (error: any) {
            console.error('수면 통계 API 호출 실패:', error);
            
            // 404 에러인 경우 (데이터가 없음)
            if (error.response?.status === 404) {
                const calculatedStats = {
                    averageScore: 0,
                    weeklyAverage: 0,
                    averageSleepHours: 0,
                    totalRecords: 0
                };
                setStats(calculatedStats);
            } else {
                // 다른 에러인 경우 로컬 데이터 사용
                const calculatedStats = calculateStats(data);
                setStats(calculatedStats);
            }
        } 
        const chart = generateCurrentWeekChartData(data); 
        setChartData(chart); 
        const recent = getRecentRecords(data); 
        setRecentRecords(recent);
    }, [user?.id, profile?.id, currentMonth])

    useEffect(() => {
        loadSleepData()
    }, [loadSleepData])

    const hasChartData = chartData.sleepHours?.some((day: any) => day.hours > 0);

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
            avatar: userName.charAt(0)
        };
    }, [profile?.name, user?.name, user?.id, profile?.id]);

    // 사용자의 수면 목표 시간 가져오기 - 메모이제이션
    const targetSleepHours = useMemo(() => {
        const currentUserId = user?.id || profile?.id;
        
        if (currentUserId) {
            // localStorage에서 사용자 데이터 가져오기
            const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
            const currentUser = storedUsers.find((u: any) => u.id === currentUserId);
            
            if (currentUser && currentUser.sleepGoal) {
                return currentUser.sleepGoal.targetSleepHours || 8.0;
            }
            
            // 수면 목표 설정 페이지에서 저장된 데이터 확인
            const savedSleepGoal = localStorage.getItem('sleepGoal');
            if (savedSleepGoal) {
                const goalData = JSON.parse(savedSleepGoal);
                return goalData.targetSleepHours || 8.0;
            }
        }
        
        return 8.0; // 기본값
    }, [user?.id, profile?.id]);

    const handleStartSleepRecord = useCallback(() => {
        navigate('/sleep-setup');
    }, [navigate]);

    const handleLogout = useCallback(() => {
        logout();
        navigate('/');
    }, [logout, navigate]);

    const goToPreviousMonth = useCallback(() => setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1)), []);
    const goToNextMonth = useCallback(() => setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1)), []);
    const selectedDayData = useMemo(() => findSleepDataByDate(sleepData, selectedDate), [sleepData, selectedDate]);

    return (
        <Container className="sleep-dashboard-page" backgroundColor="#000000" width="100vw">
            <NavBar
                userProfile={currentUserProfile}
                onLogout={handleLogout}
                onStartSleepRecord={handleStartSleepRecord}
                showStartButton
            />
            
            <main className="flex-1 flex justify-center px-8 py-6 relative">
                <div className="w-full max-w-4xl relative">
                    <div className="page-content">
                        <div className="sleep-dashboard-content">
                            
                            {/* 상단 3개 카드를 가로로 배치 */}
                            <div className="grid grid-cols-3 gap-4">
                                {/* 카드 1: 전체 평균 점수 */}
                                <div className="basic-card">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-sm font-medium text-white">전체 평균 수면 점수</span>
                                        <IoStatsChart color="#a1a1aa" size={16} />
                                    </div>
                                    <div className="text-3xl font-bold text-white mb-2">
                                        {stats.totalRecords > 0 ? `${stats.averageScore}점` : '데이터 없음'}
                                    </div>
                                    <div className="text-xs text-gray-400">
                                        {stats.totalRecords > 0 ? `${stats.totalRecords}일 기록` : '수면 기록이 없습니다'}
                                    </div>
                                </div>

                                {/* 카드 2: 주간 평균 */}
                                <div className="basic-card">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-sm font-medium text-white">주간 평균 수면 점수</span>
                                        <FaChartLine color="#a1a1aa" size={16} />
                                    </div>
                                    <div className="text-3xl font-bold text-white mb-2">
                                        {stats.weeklyAverage > 0 ? `${stats.weeklyAverage}점` : '데이터 없음'}
                                    </div>
                                    <div className="text-xs text-gray-400">
                                        {stats.weeklyAverage > 0 ? '이번 주 평균' : '이번 주 기록이 없습니다'}
                                    </div>
                                </div>

                                {/* 카드 3: 평균 수면 시간 */}
                                <div className="basic-card">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-sm font-medium text-white">전체 평균 수면 시간</span>
                                        <FaRegClock color="#a1a1aa" size={16} />
                                    </div>
                                    <div className="text-3xl font-bold text-white mb-2">
                                        {stats.averageSleepHours > 0 ? `${stats.averageSleepHours}h` : '데이터 없음'}
                                    </div>
                                    <div className="text-xs text-gray-400">
                                        {stats.averageSleepHours > 0 ? `목표: ${targetSleepHours}시간` : '수면 기록이 없습니다'}
                                    </div>
                                </div>
                            </div>

                            {/* 카드 4: 수면 패턴 분석 (이번 주 수면시간 / 점수 추이 차트) */}
                            <div className="basic-card">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-2">
                                        <FaChartPie color="#a1a1aa" size={18} />
                                        <span className="text-lg font-bold text-white">수면 패턴 분석</span>
                                    </div>
                                    <button onClick={() => navigate('/statistics')} className="px-4 py-2 bg-gray-600 border border-gray-500 text-white text-sm font-medium rounded-lg flex items-center gap-2 hover:bg-gray-500 transition-colors">
                                        <IoStatsChart size={16} />
                                        통계 보기
                                    </button>
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <div className="flex items-center gap-2 mb-4">
                                            <FaChartBar color="#a1a1aa" size={16} />
                                            <span className="text-base font-medium text-white">수면 시간 추이</span>
                                        </div>
                                        <SleepTimeChart data={(chartData.sleepHours || []).map((d:any)=>({ day:d.dayOfWeekLabel, hours:d.hours }))} isWeekly={true} />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-4">
                                            <FaChartLine color="#a1a1aa" size={16} />
                                            <span className="text-base font-medium text-white">수면 점수 추이</span>
                                        </div>
                                        <SleepScoreChart data={(chartData.sleepScores || []).map((d:any)=>({ day:d.dayOfWeekLabel, score:d.score }))} isWeekly={true} />
                                    </div>
                                </div>
                            </div>
                            
                            {/* 카드 5: 수면 기록 달력 (월별 달력 + 날짜 클릭 시 상세 정보 표시) */}
                            <div className="basic-card">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-2">
                                        <LuCalendarDays color="#a1a1aa" size={20} />
                                        <span className="text-lg font-bold text-white">수면 기록 달력</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <button onClick={goToPreviousMonth} className="w-8 h-8 bg-gray-600 border border-gray-500 text-white rounded-lg flex items-center justify-center hover:bg-gray-500 transition-colors"><FaChevronLeft size={14} /></button>
                                        <span className="text-base font-medium text-white min-w-[120px] text-center">{currentMonth.getFullYear()}년 {currentMonth.getMonth() + 1}월</span>
                                        <button onClick={goToNextMonth} className="w-8 h-8 bg-gray-600 border border-gray-500 text-white rounded-lg flex items-center justify-center hover:bg-gray-500 transition-colors"><FaChevronRight size={14} /></button>
                                    </div>
                                </div>
                                
                                <div className="mb-4">
                                    <div className="grid grid-cols-7 gap-2 mb-4">
                                        {['일', '월', '화', '수', '목', '금', '토'].map(day => (<div key={day} className="text-center text-sm font-medium text-gray-400">{day}</div>))}
                                    </div>
                                    <div className="grid grid-cols-7 gap-2">
                                        {/* calendarDays 배열을 사용하여 렌더링 */}
                                        {calendarDays.map((dayInfo, index) => {
                                            // 1. dayInfo가 null이면 (빈 칸이면) 빈 div를 렌더링합니다.
                                            if (!dayInfo) {
                                                return <div key={index} />;
                                            }

                                            // 2. dayInfo가 있으면 날짜 정보를 추출합니다.
                                            const { day, date } = dayInfo;
                                            const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
                                            const dayData = findSleepDataByDate(sleepData, dateStr); 
                                            const isSelected = selectedDate === dateStr; 
                                            const isToday = dateStr === todayStr; 
                                            const isClickable = date <= today;
                                            
                                            return (
                                                <div 
                                                    key={index} 
                                                    className={`text-center font-medium text-base py-2 relative transition-all duration-200 rounded-lg text-white ${isSelected ? 'bg-primary-400 text-black font-bold' : isToday ? 'bg-gray-600' : ''} ${isClickable ? 'cursor-pointer hover:bg-gray-600' : 'cursor-default opacity-50'}`}
                                                    onClick={() => { if (isClickable) { setSelectedDate(dateStr); } }}
                                                >
                                                    {day}
                                                    {dayData && (
                                                        <span className={`sleep-indicator ${dayData.sleepScore >= 80 ? 'good' : dayData.sleepScore >= 60 ? 'normal' : 'bad'} block mx-auto mt-1`} />
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                                
                                {selectedDate ? (
                                    selectedDayData ? (
                                        <div className="bg-gray-800 rounded-lg p-4 flex items-center gap-4">
                                            <div className="w-10 h-10 border-2 rounded-full flex items-center justify-center text-sm font-bold" style={{ borderColor: selectedDayData.scoreColor, color: selectedDayData.scoreColor }}>{selectedDayData.sleepScore}</div>
                                            <div className="flex-1 grid grid-cols-2 gap-4">
                                                <div><div className="text-xs text-gray-400 mb-1">수면 시간</div><div className="text-sm font-bold text-white">{selectedDayData.sleepDuration}</div></div>
                                                <div><div className="text-xs text-gray-400 mb-1">수면 상태</div><div className="text-sm font-bold" style={{ color: selectedDayData.scoreColor }}>{selectedDayData.sleepStatus}</div></div>
                                                <div><div className="text-xs text-gray-400 mb-1">취침 시각</div><div className="text-sm font-bold text-white">{selectedDayData.bedTime}</div></div>
                                                <div><div className="text-xs text-gray-400 mb-1">기상 시각</div><div className="text-sm font-bold text-white">{selectedDayData.wakeTime}</div></div>
                                            </div>
                                            <button onClick={() => navigate(`/daily-report/${selectedDate}`)} className="px-4 py-2 bg-gray-600 border border-gray-500 text-white text-sm font-medium rounded-lg flex items-center gap-2 hover:bg-gray-500 transition-colors"><LuArrowRight size={16} />상세 기록</button>
                                        </div>
                                    ) : (
                                        selectedDate === todayStr ? (
                                            <div className="bg-gray-800 rounded-lg p-4 flex items-center justify-between">
                                                <span className="text-gray-400 text-sm">
                                                    {new Date().getHours() < 6 ? "아직 수면 기록이 없습니다. (새벽 6시 이후부터 기록됩니다)" : "오늘 수면 기록이 없습니다."}
                                                </span>
                                                {new Date().getHours() >= 6 && (
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
                            
                            {/* 카드 6: 최근 수면 기록 (최근 8일 카드 리스트) */}
                            <div className="basic-card">
                                <div className="mb-4"><span className="text-lg font-bold text-white">최근 수면 기록</span></div>
                                <div className="text-sm text-gray-400 mb-6">최근 기록들을 한눈에 확인하고 월간 리포트에서 상세 분석을 확인하세요</div>
                                {recentRecords.length > 0 ? (
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
                                ) : (
                                    <div className="h-32 bg-gray-700 rounded-lg flex items-center justify-center text-gray-400 text-sm">
                                        수면 기록이 없습니다. 수면 측정을 시작해보세요.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </Container>
    )
}
