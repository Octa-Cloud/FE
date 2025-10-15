// [추가] SleepData 타입을 정의합니다. (데이터의 설계도 역할)
export interface SleepData {
    date: string;
    bedTime: string;
    wakeTime: string;
    sleepDuration: string;
    sleepHours: number;
    sleepMinutes: number;
    sleepTimeHours: number;
    sleepScore: number;
    sleepStatus: string;
    scoreColor: string;
}

// 수면 점수에 따른 색상 반환
export const getScoreColor = (score: number): string => {
    if (score >= 85) return '#22c55e'; // 좋음 (녹색)
    if (score >= 75) return '#eab308'; // 보통 (노란색)
    if (score >= 65) return '#f97316'; // 나쁨 (주황색)
    return '#ef4444'; // 매우 나쁨 (빨간색)
}

// 수면 점수에 따른 상태 텍스트 반환
export const getSleepStatus = (score: number): string => {
    if (score >= 85) return '좋음';
    if (score >= 75) return '보통';
    if (score >= 65) return '나쁨';
    return '매우 나쁨';
}

// 시간을 시:분 형식으로 포맷팅
export const formatTime = (hour: number, minute: number): string => {
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
}

// 수면 시간을 시간:분 형식으로 포맷팅
export const formatSleepDuration = (hours: number, minutes: number): string => {
    return `${hours}시간 ${minutes}분`
}

// 시드 기반 의사 랜덤 함수 (일관된 결과를 위해)
const seededRandom = (seed: number): number => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
}

// 랜덤 수면 데이터 생성 (일관된 결과를 위해 시드 사용)
const generateRandomSleepData = (date: Date): SleepData => {
    const dayOfWeek = date.getDay();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;

    const seed = parseInt(dateStr.replace(/-/g, ''));
    const random1 = seededRandom(seed);
    const random2 = seededRandom(seed + 1);
    const random3 = seededRandom(seed + 2);
    const random4 = seededRandom(seed + 3);
    const random5 = seededRandom(seed + 4);

    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    let bedTimeHour, wakeTimeHour, sleepScore;

    if (isWeekend) {
        bedTimeHour = Math.floor(random1 * 3) + 24;
        wakeTimeHour = Math.floor(random2 * 3) + 8;
        sleepScore = Math.floor(random3 * 15) + 75;
    } else {
        bedTimeHour = Math.floor(random1 * 2) + 22;
        wakeTimeHour = Math.floor(random2 * 2) + 6;
        sleepScore = Math.floor(random3 * 20) + 70;
    }

    const bedTimeMinute = Math.floor(random4 * 60);
    const wakeTimeMinute = Math.floor(random5 * 60);

    let sleepDurationMinutes = (wakeTimeHour * 60 + wakeTimeMinute) - (bedTimeHour * 60 + bedTimeMinute);
    if (sleepDurationMinutes < 0) {
        sleepDurationMinutes += 24 * 60;
    }

    const sleepHours = Math.floor(sleepDurationMinutes / 60);
    const sleepMinutes = sleepDurationMinutes % 60;

    if (sleepHours < 6) {
        sleepScore = Math.max(60, sleepScore - 10);
    } else if (sleepHours >= 8) {
        sleepScore = Math.min(95, sleepScore + 5);
    }

    return {
        date: dateStr,
        bedTime: formatTime(bedTimeHour % 24, bedTimeMinute),
        wakeTime: formatTime(wakeTimeHour, wakeTimeMinute),
        sleepDuration: formatSleepDuration(sleepHours, sleepMinutes),
        sleepHours,
        sleepMinutes,
        sleepTimeHours: sleepDurationMinutes / 60, // 정확한 수면 시간 (시간 단위)
        sleepScore,
        sleepStatus: getSleepStatus(sleepScore),
        scoreColor: getScoreColor(sleepScore)
    };
}

// 로컬 스토리지 데이터 초기화 함수
export const clearSleepData = (): void => {
    const STORAGE_KEY = 'mong_sleep_data';
    localStorage.removeItem(STORAGE_KEY);
}

// 더미 데이터 생성 함수
export const generateSleepData = (): SleepData[] => {
    const STORAGE_KEY = 'mong_sleep_data';

    const existingData = localStorage.getItem(STORAGE_KEY);
    if (existingData) {
        try {
            return JSON.parse(existingData);
        } catch (error) {
            console.warn('로컬 스토리지 데이터 파싱 실패:', error);
        }
    }

    // 9월과 10월에 걸친 약 20개의 날짜를 수동으로 지정
    const specificDates = [
        '2025-09-02', '2025-09-03', '2025-09-05', '2025-09-06', '2025-09-08',
        '2025-09-10', '2025-09-11', '2025-09-13', '2025-09-15', '2025-09-18',
        '2025-09-21', '2025-09-22', '2025-09-25', '2025-09-28', '2025-09-30',
        '2025-10-01', '2025-10-03', '2025-10-06', '2025-10-09', '2025-10-11',
        '2025-10-13'
    ];

    const sleepData = specificDates.map(dateStr => {
        const [year, month, day] = dateStr.split('-').map(Number);
        // 월은 0부터 시작하므로 1을 빼줍니다.
        const date = new Date(year, month - 1, day);
        return generateRandomSleepData(date);
    });

    // 날짜순으로 정렬
    const sortedData = sleepData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sortedData));

    return sortedData;
}

// 통계 계산 함수들
export const calculateStats = (sleepData: SleepData[]) => {
    if (sleepData.length === 0) {
        return { averageScore: 0, weeklyAverage: 0, averageSleepHours: 0, totalRecords: 0 };
    }

    const totalScore = sleepData.reduce((sum, data) => sum + data.sleepScore, 0);
    const averageScore = Math.round(totalScore / sleepData.length);

    const today = new Date();
    const dayOfWeek = today.getDay();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - dayOfWeek);
    startOfWeek.setHours(0, 0, 0, 0);

    const currentWeekData = sleepData.filter(data => {
        const recordDate = new Date(data.date);
        return recordDate >= startOfWeek && recordDate <= today;
    });

    let weeklyAverage = 0;
    if (currentWeekData.length > 0) {
        const weeklyScore = currentWeekData.reduce((sum, data) => sum + data.sleepScore, 0);
        weeklyAverage = Math.round(weeklyScore / currentWeekData.length);
    }

    const totalSleepMinutes = sleepData.reduce((sum, data) => {
        return sum + (data.sleepHours * 60 + data.sleepMinutes);
    }, 0);
    const averageSleepMinutes = totalSleepMinutes / sleepData.length;
    const averageSleepHours = Math.round((averageSleepMinutes / 60) * 10) / 10;

    return { averageScore, weeklyAverage, averageSleepHours, totalRecords: sleepData.length };
}

// 특정 날짜의 데이터 찾기
export const findSleepDataByDate = (sleepData: SleepData[], targetDate: string | null): SleepData | undefined => {
    return sleepData.find(data => data.date === targetDate);
}

// 최근 기록 데이터 (최신 8개)
export const getRecentRecords = (sleepData: SleepData[]): SleepData[] => {
    return sleepData.slice(-8).reverse();
}
