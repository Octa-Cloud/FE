import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileHeader from '../components/ProfileHeader';
import ProfileStatsCard from '../components/ProfileStatsCard';
import ProfileFooter from '../components/ProfileFooter';
import { useAuth, useUserProfile } from '../store/hooks';
import { SleepGoalFormData, SleepGoalData } from '../types';
import { getTestUserSleepGoal } from '../testData';
import '../styles/profile.css';

const SleepGoalSetting = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { profile } = useUserProfile();
  
  const [formData, setFormData] = useState<SleepGoalFormData>({
    targetBedtime: '22:00',
    targetWakeTime: '06:00',
    targetSleepHours: '8'
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');



  // 사용자 데이터 가져오기
  const currentUser = user || profile;
  
  // 현재 사용자의 수면 목표 데이터 가져오기
  const getCurrentUserSleepGoal = () => {
    if (currentUser?.id) {
      const testUserSleepGoal = getTestUserSleepGoal(currentUser.id);
      if (testUserSleepGoal) {
        return testUserSleepGoal;
      }
    }
    // 기본값
    return {
      targetBedtime: '23:00',
      targetWakeTime: '07:00',
      targetSleepHours: 8.0,
      name: '사용자'
    };
  };

  const sleepGoalData = getCurrentUserSleepGoal();
  
  const userProfile = {
    name: currentUser?.name || '사용자',
    avatar: (currentUser?.name || '사용자').charAt(0)
  };

  const userData = {
    name: currentUser?.name || '사용자',
    email: currentUser?.email || '',
    avatar: (currentUser?.name || '사용자').charAt(0),
    averageScore: 85,
    averageSleepTime: 7.5,
    totalDays: 30
  };

  // 시간 계산 유틸리티 함수들
  const timeToMinutes = (timeStr: string): number => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const minutesToTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  };




  const calculateSleepHours = (bedtime: string, wakeTime: string): string => {
    const bedtimeMinutes = timeToMinutes(bedtime);
    let wakeMinutes = timeToMinutes(wakeTime);
    
    // 다음날 아침으로 간주 (취침시간이 기상시간보다 늦은 경우)
    if (bedtimeMinutes > wakeMinutes) {
      wakeMinutes += 24 * 60; // 24시간 추가
    }
    
    const sleepMinutes = wakeMinutes - bedtimeMinutes;
    const sleepHours = sleepMinutes / 60;
    return sleepHours.toFixed(1);
  };

  const calculateWakeTime = (bedtime: string, sleepHours: string): string => {
    const bedtimeMinutes = timeToMinutes(bedtime);
    const sleepMinutes = parseFloat(sleepHours) * 60;
    const wakeMinutes = bedtimeMinutes + sleepMinutes;
    
    // 24시간을 넘어가면 다음날로 계산
    const adjustedWakeMinutes = wakeMinutes % (24 * 60);
    return minutesToTime(adjustedWakeMinutes);
  };

  // 수면시간 입력 검증
  const validateSleepHours = (value: string): boolean => {
    const num = parseFloat(value);
    return !isNaN(num) && num >= 1 && num <= 24;
  };

  // 로컬 스토리지에서 수면 목표 데이터 로드
  useEffect(() => {
    const savedSleepGoal = localStorage.getItem('sleepGoal');
    if (savedSleepGoal) {
      const goalData = JSON.parse(savedSleepGoal);
      setFormData({
        targetBedtime: goalData.targetBedtime || '22:00',
        targetWakeTime: goalData.targetWakeTime || '06:00',
        targetSleepHours: goalData.targetSleepHours?.toString() || '8'
      });
    }
  }, []);


  // 뒤로가기 핸들러
  const handleBack = () => {
    navigate('/profile');
  };

  // 수면 기록 시작 핸들러
  const handleStartSleepRecord = () => {
    // TODO: 수면 기록 시작 로직 구현
    console.log('수면 기록 시작');
  };

  // 로그아웃 핸들러
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // 폼 데이터 변경 핸들러
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // 오류 메시지 초기화
    setErrorMessage('');
    
    setFormData(prev => {
      const newFormData = { ...prev, [name]: value };
      
      // 취침시간이나 기상시간이 변경되면 수면시간 자동 계산
      if (name === 'targetBedtime' || name === 'targetWakeTime') {
        if (newFormData.targetBedtime && newFormData.targetWakeTime) {
          const calculatedHours = calculateSleepHours(
            newFormData.targetBedtime, 
            newFormData.targetWakeTime
          );
          newFormData.targetSleepHours = calculatedHours;
        }
      }
      
      // 수면시간 입력 검증
      if (name === 'targetSleepHours') {
        if (value && !validateSleepHours(value)) {
          setErrorMessage('수면시간은 1-24시간 사이의 값이어야 합니다.');
          return prev; // 잘못된 값이면 이전 상태 유지
        }
      }

      // 수면시간이 변경되면 기상시간 자동 계산
      if (name === 'targetSleepHours' && value) {
        if (newFormData.targetBedtime && validateSleepHours(value)) {
          const wakeTimeResult = calculateWakeTime(
            newFormData.targetBedtime, 
            value
          );
          newFormData.targetWakeTime = wakeTimeResult;
        }
      }
      
      return newFormData;
    });
  };


  // 수정 모드 토글
  const handleEdit = () => {
    setIsEditing(true);
  };

  // 취소 핸들러
  const handleCancel = () => {
    setIsEditing(false);
    // 원래 데이터로 복원
  };

  // 저장 핸들러
  const handleSave = async () => {
    // 입력 검증
    if (!validateSleepHours(formData.targetSleepHours)) {
      setErrorMessage('수면시간은 1-24시간 사이의 값이어야 합니다.');
      return;
    }
    
    setIsLoading(true);
    setErrorMessage('');
    
    try {
      // 수면 목표 데이터 저장
      const sleepGoalData: SleepGoalData = {
        targetBedtime: formData.targetBedtime,
        targetWakeTime: formData.targetWakeTime,
        targetSleepHours: parseFloat(formData.targetSleepHours)
      };
      
      localStorage.setItem('sleepGoal', JSON.stringify(sleepGoalData));
      
      setIsEditing(false);
      console.log('수면 목표가 저장되었습니다:', sleepGoalData);
    } catch (error) {
      console.error('수면 목표 저장 중 오류 발생:', error);
      setErrorMessage('저장 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="sleep-goal-setting-page min-h-screen bg-background">
      <ProfileHeader
        onBack={handleBack}
        onStartSleepRecord={handleStartSleepRecord}
        userProfile={userProfile}
        onLogout={handleLogout}
      />
      
      <main className="profile-main">
        <div className="profile-container">
          <div className="profile-content">
            {/* 사용자 통계 카드 */}
            <ProfileStatsCard userData={userData} />
            
            {/* 수면 목표 설정 카드 */}
            <div className="sleep-goal-card bg-card border border-border rounded-xl p-6">
              <div className="sleep-goal-header mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="24" 
                    height="24" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    className="h-5 w-5 text-primary"
                  >
                    <path d="M12 6v6l4 2"></path>
                    <circle cx="12" cy="12" r="10"></circle>
                  </svg>
                  <h2 className="text-xl font-semibold text-white">수면 시간 목표</h2>
                </div>
                <p className="text-muted-foreground text-sm">
                  일일 수면 시간과 취침/기상 시간을 설정하세요
                </p>
              </div>

              <div className="sleep-goal-form space-y-4">
                {/* 오류 메시지 */}
                {errorMessage && (
                  <div className="error-message text-center p-3 text-red-500 bg-red-50 border border-red-200 rounded-lg">
                    {errorMessage}
                  </div>
                )}
                
                <div className="grid grid-cols-3 gap-4">
                  {/* 목표 수면시간 */}
                  <div className="space-y-2">
                    <label 
                      htmlFor="targetSleepHours" 
                      className="block text-sm font-medium text-white"
                    >
                      목표 수면시간
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        id="targetSleepHours"
                        name="targetSleepHours"
                        value={formData.targetSleepHours}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        min="1"
                        max="24"
                        step="0.1"
                        placeholder="8"
                        className="w-full h-9 pl-3 pr-10 py-2 text-sm bg-input-background border border-input rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-400 pointer-events-none">
                        시간
                      </span>
                    </div>
                  </div>

                  {/* 목표 취침시간 */}
                  <div className="space-y-2">
                    <label 
                      htmlFor="targetBedtime" 
                      className="block text-sm font-medium text-white"
                    >
                      목표 취침시간
                    </label>
                    <input
                      type="time"
                      id="targetBedtime"
                      name="targetBedtime"
                      value={formData.targetBedtime}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full h-9 px-3 py-2 text-sm bg-input-background border border-input rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>

                  {/* 목표 기상시간 */}
                  <div className="space-y-2">
                    <label 
                      htmlFor="targetWakeTime" 
                      className="block text-sm font-medium text-white"
                    >
                      목표 기상시간
                    </label>
                    <input
                      type="time"
                      id="targetWakeTime"
                      name="targetWakeTime"
                      value={formData.targetWakeTime}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full h-9 px-3 py-2 text-sm bg-input-background border border-input rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* 액션 버튼들 */}
                <ProfileFooter
                  isEditing={isEditing}
                  isLoading={isLoading}
                  onEdit={handleEdit}
                  onSave={handleSave}
                  onCancel={handleCancel}
                  loadingText="저장 중..."
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SleepGoalSetting;
