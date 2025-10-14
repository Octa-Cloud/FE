# 수면 데이터 테스트 가이드

## 📊 테스트 데이터 구조

### 1. 기존 사용자 데이터 (`testData.ts`)
- 사용자 기본 정보
- 프로필 정보
- 수면 목표 정보

### 2. 새로운 수면 기록 데이터 (`sleepData.ts`)
- 2025년 10월 1일~31일 수면 기록
- 각 날짜별 상세 수면 데이터

## 🗓️ 테스트 데이터 기간
**2025년 10월 1일 ~ 10월 31일** (31일간)

## 📝 데이터 내용

### 각 날짜마다 포함된 정보:
- **수면 점수** (60~95점 범위)
- **총 수면 시간** (5.5~9시간 범위)
- **취침/기상 시간** (주말은 늦게 자고 늦게 일어남)
- **수면 효율** (%)
- **수면 단계별 시간 및 비율**
  - 깊은 수면
  - 얕은 수면
  - REM 수면
- **뇌파 데이터** (A~E 등급, 10개 포인트)
- **소음 이벤트** (코골이, 에어컨 소음, 외부 소음)
- **수면 메모** (일부 날짜만)

## 🎯 사용 방법

### 1. 일별 보고서 페이지
```
/daily-report/2025-10-01  ← 10월 1일 데이터
/daily-report/2025-10-15  ← 10월 15일 데이터
/daily-report/2025-10-31  ← 10월 31일 데이터
```

### 2. 캘린더
- 수면 점수가 85점 이상: 🟢 초록색 점
- 수면 점수가 70~84점: 🟡 노란색 점
- 수면 점수가 70점 미만: 표시 없음
- 수면 기록이 있는 날짜: 폰트 굵게 (weight: 500)

### 3. 통계 페이지 ✅
- **주간 분석**: 일별 수면 시간/점수 바 차트 (실제 데이터 기반)
- **월간 분석**: 주차별 평균 수면 시간/점수 라인 차트
- **인터랙티브 차트**: 호버 효과, 툴팁, 데이터 값 표시
- **자연스러운 시각화**: 그라디언트, 애니메이션, 그림자 효과
- **데이터 없음 처리**: 적절한 메시지와 아이콘 표시
- **수면 패턴 분석**: 깊은수면, 얕은수면, REM 수면 비율
- **목표 달성률**: 수면 시간, 수면 점수, 수면 효율
- **개선 권장사항**: 자동 분석 기반 맞춤형 조언

## 🔧 개발자 도구

브라우저 콘솔에서 사용 가능한 명령어:

### 수면 데이터 관련
```javascript
// 모든 수면 데이터 확인
window.sleepData.all

// 특정 날짜의 데이터 가져오기
window.sleepData.getByDate('test-user-001', '2025-10-15')

// 특정 기간의 데이터 가져오기
window.sleepData.getByDateRange('test-user-001', '2025-10-01', '2025-10-31')

// 특정 월의 데이터 가져오기
window.sleepData.getByMonth('test-user-001', 2025, 10)

// 수면 점수로 상태 확인
window.sleepData.getStatus(85)  // 'good'
window.sleepData.getStatus(75)  // 'normal'
window.sleepData.getStatus(65)  // null
```

### 통계 계산 관련
```javascript
// 기본 통계 계산
window.statisticsUtils.calculateAverage([85, 90, 78, 92])
window.statisticsUtils.calculateMedian([85, 90, 78, 92])

// 수면 기록 분석
const records = window.sleepData.getByMonth('test-user-001', 2025, 10)
window.statisticsUtils.analyzeSleepRecords(records)

// 주간 데이터 분석
window.statisticsUtils.analyzeWeeklyData(records, new Date())

// 월간 데이터 분석
window.statisticsUtils.analyzeMonthlyData(records, 2025, 10)

// 날짜 관련 유틸리티
window.statisticsUtils.getWeekDates(new Date())
window.statisticsUtils.getWeekNumber(new Date())
window.statisticsUtils.getMonthWeeks(2025, 10)

// 시간 계산
window.statisticsUtils.parseTime('23:30')  // 23.5
window.statisticsUtils.formatTime(23.5)    // '23:30'
window.statisticsUtils.calculateTimeDifference('23:00', '07:00')  // 8
```

## 📌 주의사항

1. **날짜 형식**: `YYYY-MM-DD` (예: 2025-10-15)
2. **데이터 범위**: 2025년 10월 1일~31일만 존재
3. **사용자 ID**: `test-user-001`, `test-user-002`, `test-user-003`
4. **자동 생성 데이터**: 각 사용자마다 다른 랜덤 패턴의 수면 데이터

## 🚀 향후 확장

- 다른 월 데이터 추가 가능
- API 연동 시 동일한 인터페이스 사용
- LocalStorage 또는 Backend API로 전환 가능

## 📖 관련 파일

- `src/mong/sleepData.ts` - 수면 데이터 정의 및 함수
- `src/mong/types/sleepData.ts` - 수면 데이터 타입 정의
- `src/mong/utils/statisticsCalculations.ts` - 통계 계산 함수들
- `src/mong/pages/DailyReport.tsx` - 일별 보고서 페이지
- `src/mong/pages/StatisticsAnalysis.tsx` - 통계 분석 페이지
- `src/mong/pages/Home.tsx` - 홈 페이지 (데이터 페이지로 이동)

