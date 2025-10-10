/**
 * 시간 계산 유틸리티 함수들
 */

/**
 * 시간 문자열을 분으로 변환
 */
export const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

/**
 * 분을 시간 문자열로 변환
 */
export const minutesToTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
};

/**
 * 취침 시간과 기상 시간으로부터 수면 시간 계산
 */
export const calculateSleepHours = (bedtime: string, wakeTime: string): number => {
  const bedtimeMinutes = timeToMinutes(bedtime);
  const wakeTimeMinutes = timeToMinutes(wakeTime);
  
  let sleepMinutes: number;
  
  if (wakeTimeMinutes >= bedtimeMinutes) {
    // 같은 날 내에서의 수면 (예: 23:00 -> 07:00)
    sleepMinutes = wakeTimeMinutes - bedtimeMinutes;
  } else {
    // 다음날까지의 수면 (예: 23:00 -> 06:00)
    sleepMinutes = (24 * 60) - bedtimeMinutes + wakeTimeMinutes;
  }
  
  return Math.round((sleepMinutes / 60) * 10) / 10; // 소수점 첫째자리까지
};

/**
 * 취침 시간과 수면 시간으로부터 기상 시간 계산
 */
export const calculateWakeTime = (bedtime: string, sleepHours: number): string => {
  const bedtimeMinutes = timeToMinutes(bedtime);
  const sleepMinutes = Math.round(sleepHours * 60);
  const wakeTimeMinutes = (bedtimeMinutes + sleepMinutes) % (24 * 60);
  
  return minutesToTime(wakeTimeMinutes);
};

/**
 * 24시간 형식을 12시간 형식으로 변환
 */
export const convertTo12Hour = (time24: string): { time: string; ampm: string } => {
  const [hours, minutes] = time24.split(':').map(Number);
  
  if (hours === 0) {
    return { time: `12:${minutes.toString().padStart(2, '0')}`, ampm: 'AM' };
  } else if (hours < 12) {
    return { time: `${hours}:${minutes.toString().padStart(2, '0')}`, ampm: 'AM' };
  } else if (hours === 12) {
    return { time: `12:${minutes.toString().padStart(2, '0')}`, ampm: 'PM' };
  } else {
    return { time: `${hours - 12}:${minutes.toString().padStart(2, '0')}`, ampm: 'PM' };
  }
};

/**
 * 12시간 형식을 24시간 형식으로 변환
 */
export const convertTo24Hour = (time12: string, ampm: string): string => {
  const [hours, minutes] = time12.split(':').map(Number);
  
  if (ampm === 'AM') {
    if (hours === 12) {
      return `00:${minutes.toString().padStart(2, '0')}`;
    }
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  } else {
    if (hours === 12) {
      return `12:${minutes.toString().padStart(2, '0')}`;
    }
    return `${(hours + 12).toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }
};

/**
 * 현재 시간을 가져오기
 */
export const getCurrentTime = (): string => {
  const now = new Date();
  return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
};

/**
 * 시간 형식 검증
 */
export const isValidTimeFormat = (time: string): boolean => {
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(time);
};

/**
 * 시간 비교 (첫 번째 시간이 두 번째 시간보다 이른지)
 */
export const isEarlier = (time1: string, time2: string): boolean => {
  const minutes1 = timeToMinutes(time1);
  const minutes2 = timeToMinutes(time2);
  return minutes1 < minutes2;
};

/**
 * 시간 차이 계산 (분 단위)
 */
export const getTimeDifference = (time1: string, time2: string): number => {
  const minutes1 = timeToMinutes(time1);
  const minutes2 = timeToMinutes(time2);
  
  if (minutes2 >= minutes1) {
    return minutes2 - minutes1;
  } else {
    return (24 * 60) - minutes1 + minutes2;
  }
};

/**
 * 수면 시간 유효성 검사
 */
export const validateSleepHours = (sleepHours: number): boolean => {
  return sleepHours >= 1 && sleepHours <= 24;
};

/**
 * 권장 수면 시간 범위 검사
 */
export const isRecommendedSleepHours = (sleepHours: number): boolean => {
  return sleepHours >= 7 && sleepHours <= 9;
};
