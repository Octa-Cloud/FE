// 수면 더미 데이터 생성

// 수면 점수에 따른 색상 반환
export const getScoreColor = (score) => {
  if (score >= 85) return '#22c55e' // 좋음 (녹색)
  if (score >= 75) return '#eab308' // 보통 (노란색)
  if (score >= 65) return '#f97316' // 나쁨 (주황색)
  return '#ef4444' // 매우 나쁨 (빨간색)
}

// 수면 점수에 따른 상태 텍스트 반환
export const getSleepStatus = (score) => {
  if (score >= 85) return '좋음'
  if (score >= 75) return '보통'
  if (score >= 65) return '나쁨'
  return '매우 나쁨'
}

// 시간을 시:분 형식으로 포맷팅
export const formatTime = (hour, minute) => {
  return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
}

// 수면 시간을 시간:분 형식으로 포맷팅
export const formatSleepDuration = (hours, minutes) => {
  return `${hours}시간 ${minutes}분`
}

// 시드 기반 의사 랜덤 함수 (일관된 결과를 위해)
const seededRandom = (seed) => {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

// 랜덤 수면 데이터 생성 (일관된 결과를 위해 시드 사용)
const generateRandomSleepData = (date) => {
  const dayOfWeek = date.getDay() // 0: 일요일, 6: 토요일
  // 시간대 문제를 피하기 위해 로컬 날짜로 직접 문자열 생성
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const dateStr = `${year}-${month}-${day}`
  
  // 날짜를 시드로 사용하여 일관된 결과 생성
  const seed = dateStr.split('-').join('')
  const random1 = seededRandom(parseInt(seed))
  const random2 = seededRandom(parseInt(seed) + 1)
  const random3 = seededRandom(parseInt(seed) + 2)
  const random4 = seededRandom(parseInt(seed) + 3)
  const random5 = seededRandom(parseInt(seed) + 4)
  
  // 주말과 평일의 수면 패턴을 다르게 설정
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
  
  let bedTimeHour, wakeTimeHour, sleepScore
  
  if (isWeekend) {
    // 주말: 늦게 자고 늦게 일어남
    bedTimeHour = Math.floor(random1 * 3) + 24 // 24-26시 (0-2시)
    wakeTimeHour = Math.floor(random2 * 3) + 8 // 8-10시
    sleepScore = Math.floor(random3 * 15) + 75 // 75-89점
  } else {
    // 평일: 일찍 자고 일찍 일어남
    bedTimeHour = Math.floor(random1 * 2) + 22 // 22-23시
    wakeTimeHour = Math.floor(random2 * 2) + 6 // 6-7시
    sleepScore = Math.floor(random3 * 20) + 70 // 70-89점
  }
  
  const bedTimeMinute = Math.floor(random4 * 60)
  const wakeTimeMinute = Math.floor(random5 * 60)
  
  // 수면 시간 계산
  let sleepDurationMinutes = (wakeTimeHour * 60 + wakeTimeMinute) - (bedTimeHour * 60 + bedTimeMinute)
  if (sleepDurationMinutes < 0) {
    sleepDurationMinutes += 24 * 60 // 다음날로 넘어간 경우
  }
  
  const sleepHours = Math.floor(sleepDurationMinutes / 60)
  const sleepMinutes = sleepDurationMinutes % 60
  
  // 수면 시간에 따른 점수 조정
  if (sleepHours < 6) {
    sleepScore = Math.max(60, sleepScore - 10)
  } else if (sleepHours >= 8) {
    sleepScore = Math.min(95, sleepScore + 5)
  }
  
  return {
    date: dateStr,
    bedTime: formatTime(bedTimeHour % 24, bedTimeMinute),
    wakeTime: formatTime(wakeTimeHour, wakeTimeMinute),
    sleepDuration: formatSleepDuration(sleepHours, sleepMinutes),
    sleepHours,
    sleepMinutes,
    sleepScore,
    sleepStatus: getSleepStatus(sleepScore),
    scoreColor: getScoreColor(sleepScore)
  }
}

// 2025년 9월 1일부터 22일까지의 더미 데이터 생성
export const generateSleepData = () => {
  const STORAGE_KEY = 'mong_sleep_data'
  
  const existingData = localStorage.getItem(STORAGE_KEY)
  if (existingData) {
    try {
      return JSON.parse(existingData)
    } catch (error) {
      console.warn('로컬 스토리지 데이터 파싱 실패:', error)
    }
  }
  
  const sleepData = []
  const startDate = new Date('2025-09-01')
  
  for (let i = 0; i < 22; i++) {
    const currentDate = new Date(startDate)
    currentDate.setDate(startDate.getDate() + i)
    sleepData.push(generateRandomSleepData(currentDate))
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sleepData))
  
  return sleepData
}

// 데이터 초기화 함수 (개발용)
export const resetSleepData = () => {
  localStorage.removeItem('mong_sleep_data')
  return generateSleepData()
}

// 강제로 새로운 데이터 생성 (기존 데이터 무시)
export const forceGenerateNewData = () => {
  localStorage.removeItem('mong_sleep_data')
  
  const sleepData = []
  const startDate = new Date('2025-09-03')
  const excludedDates = ['2025-09-10', '2025-09-11', '2025-09-19', '2025-09-21']
  
  for (let i = 0; i < 20; i++) {
    const currentDate = new Date(startDate)
    currentDate.setDate(startDate.getDate() + i)
    sleepData.push(generateRandomSleepData(currentDate))
  }
  
  const filteredData = sleepData.filter(data => !excludedDates.includes(data.date))
  localStorage.setItem('mong_sleep_data', JSON.stringify(filteredData))
  return filteredData
}

// 통계 계산 함수들
export const calculateStats = (sleepData) => {
  if (sleepData.length === 0) {
    return {
      averageScore: 0,
      weeklyAverage: 0,
      averageSleepHours: 0,
      totalRecords: 0
    }
  }
  
  // 1. 전체 평균 점수
  const totalScore = sleepData.reduce((sum, data) => sum + data.sleepScore, 0)
  const averageScore = Math.round(totalScore / sleepData.length)
  
  // 2. 주간 평균 점수 (이번 주 일요일 ~ 오늘 기준)
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
  
  // 3. 전체 평균 수면 시간
  const totalSleepMinutes = sleepData.reduce((sum, data) => {
    return sum + (data.sleepHours * 60 + data.sleepMinutes)
  }, 0)
  const averageSleepMinutes = totalSleepMinutes / sleepData.length
  const averageSleepHours = Math.round(averageSleepMinutes / 60 * 10) / 10
  
  return {
    averageScore,
    weeklyAverage,
    averageSleepHours,
    totalRecords: sleepData.length
  }
}

// 차트 데이터 생성 (현재 사용되지 않지만, 다른 곳에서 사용할 수 있으므로 유지)
export const generateChartData = (sleepData) => {
  const last7Days = sleepData.slice(-7)
  
  const sortedDays = last7Days.sort((a, b) => {
    const dayA = new Date(a.date).getDay()
    const dayB = new Date(b.date).getDay()
    return dayA - dayB
  })
  
  return {
    sleepHours: sortedDays.map(data => {
      const [year, month, day] = data.date.split('-').map(Number)
      return {
        day: `${month}월 ${day}일`,
        hours: data.sleepHours + data.sleepMinutes / 60,
        sleepHours: data.sleepHours,
        sleepMinutes: data.sleepMinutes
      }
    }),
    sleepScores: sortedDays.map(data => {
      const [year, month, day] = data.date.split('-').map(Number)
      return {
        day: `${month}월 ${day}일`,
        score: data.sleepScore
      }
    })
  }
}

// 특정 날짜의 데이터 찾기
export const findSleepDataByDate = (sleepData, targetDate) => {
  return sleepData.find(data => data.date === targetDate)
}

// 최근 기록 데이터 (최신 4개)
export const getRecentRecords = (sleepData) => {
  return sleepData.slice(-8).reverse()
}