/**
 * 수면 목표 계산을 위한 커스텀 훅
 */
import { useState, useCallback, useMemo } from 'react';
import { 
  calculateSleepHours, 
  calculateWakeTime, 
  validateSleepHours,
  validateTimeFormat 
} from '../utils/timeCalculation';
import { SleepGoalFormData } from '../types';

export function useSleepGoalCalculation(initialData?: Partial<SleepGoalFormData>) {
  const [formData, setFormData] = useState<SleepGoalFormData>({
    targetBedtime: initialData?.targetBedtime || '23:00',
    targetWakeTime: initialData?.targetWakeTime || '07:00',
    targetSleepHours: initialData?.targetSleepHours || '8',
    ...initialData
  });

  // 수면 시간 계산 (취침 시간과 기상 시간으로부터)
  const calculatedSleepHours = useMemo(() => {
    if (!formData.targetBedtime || !formData.targetWakeTime) return 0;
    return calculateSleepHours(formData.targetBedtime, formData.targetWakeTime);
  }, [formData.targetBedtime, formData.targetWakeTime]);

  // 기상 시간 계산 (취침 시간과 수면 시간으로부터)
  const calculatedWakeTime = useMemo(() => {
    if (!formData.targetBedtime || !formData.targetSleepHours) return '07:00';
    const sleepHours = parseFloat(formData.targetSleepHours);
    return calculateWakeTime(formData.targetBedtime, sleepHours);
  }, [formData.targetBedtime, formData.targetSleepHours]);

  // 취침 시간 변경 핸들러
  const handleBedtimeChange = useCallback((bedtime: string) => {
    setFormData(prev => ({
      ...prev,
      targetBedtime: bedtime,
      targetSleepHours: calculatedSleepHours.toString()
    }));
  }, [calculatedSleepHours]);

  // 기상 시간 변경 핸들러
  const handleWakeTimeChange = useCallback((wakeTime: string) => {
    setFormData(prev => ({
      ...prev,
      targetWakeTime: wakeTime,
      targetSleepHours: calculatedSleepHours.toString()
    }));
  }, [calculatedSleepHours]);

  // 수면 시간 변경 핸들러
  const handleSleepHoursChange = useCallback((sleepHours: string) => {
    const hours = parseFloat(sleepHours);
    
    if (validateSleepHours(hours)) {
      setFormData(prev => ({
        ...prev,
        targetSleepHours: sleepHours,
        targetWakeTime: calculatedWakeTime
      }));
    } else {
      // 유효하지 않은 경우 이전 값 유지
      setFormData(prev => ({
        ...prev,
        targetSleepHours: sleepHours
      }));
    }
  }, [calculatedWakeTime]);

  // 전체 폼 데이터 업데이트
  const updateFormData = useCallback((data: Partial<SleepGoalFormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  }, []);

  // 폼 리셋
  const resetFormData = useCallback(() => {
    setFormData({
      targetBedtime: '23:00',
      targetWakeTime: '07:00',
      targetSleepHours: '8'
    });
  }, []);

  // 유효성 검사
  const validateForm = useCallback(() => {
    const bedtimeValid = validateTimeFormat(formData.targetBedtime);
    const wakeTimeValid = validateTimeFormat(formData.targetWakeTime);
    const sleepHoursValid = validateSleepHours(parseFloat(formData.targetSleepHours));

    return {
      isValid: bedtimeValid.isValid && wakeTimeValid.isValid && sleepHoursValid,
      errors: {
        bedtime: bedtimeValid.message,
        wakeTime: wakeTimeValid.message,
        sleepHours: sleepHoursValid.message
      }
    };
  }, [formData]);

  // 자동 계산 상태
  const autoCalculationEnabled = useMemo(() => {
    return formData.targetSleepHours === calculatedSleepHours.toString();
  }, [formData.targetSleepHours, calculatedSleepHours]);

  return {
    formData,
    calculatedSleepHours,
    calculatedWakeTime,
    autoCalculationEnabled,
    handleBedtimeChange,
    handleWakeTimeChange,
    handleSleepHoursChange,
    updateFormData,
    resetFormData,
    validateForm
  };
}
