import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import NavBar from '../components/NavBar';
import ProfileStatsCard from '../components/ProfileStatsCard';
import ProfileFooter from '../components/ProfileFooter';
import Container from '../components/Container';
import { useAuth, useUserProfile } from '../store/hooks';
import { SleepGoalFormData, SleepGoalData } from '../types';
import { getTestUserSleepGoal } from '../testData';
import { SleepAPI, SleepGoalResponse, SleepGoalRequest } from '../api/sleep';
import '../styles/profile.css';

const SleepGoalSetting = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const cameFromSetup = Boolean((location.state as any)?.from === 'sleep-setup');
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
  
  // API 상태 관리
  const [apiSleepGoal, setApiSleepGoal] = useState<SleepGoalResponse | null>(null);
  const [apiLoading, setApiLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // API에서 수면 목표 정보 가져오기
  const fetchSleepGoal = useCallback(async () => {
    try {
      setApiLoading(true);
      setApiError(null);
      
      // 토큰 확인
      const token = localStorage.getItem('accessToken');
      if (!token) {
        console.warn('⚠️ 액세스 토큰이 없습니다. 로그인이 필요합니다.');
        setApiError('로그인이 필요합니다. 로그인 페이지로 이동하세요.');
        return;
      }
      
      console.log('🔍 API 호출: 수면 목표 조회');
      
      const response = await SleepAPI.getSleepGoal();
      console.log('✅ API 응답: 수면 목표 조회 성공', response);
      
      if (response.result) {
        setApiSleepGoal(response.result);
        console.log('😴 수면 목표 설정:', response.result);
        
        // API에서 가져온 데이터로 폼 데이터 업데이트
        setFormData({
          targetBedtime: response.result.goalBedTime,
          targetWakeTime: response.result.goalWakeTime,
          targetSleepHours: response.result.goalTotalSleepTime.toString()
        });
      }
    } catch (error: any) {
      console.error('❌ API 호출 실패: 수면 목표 조회', error);
      
      // 404 에러일 때는 기본 데이터 설정하고 에러 메시지 표시하지 않음
      if (error.response?.status === 404) {
        console.log('📝 404 에러: 기본 수면 목표 데이터 설정');
        const defaultSleepGoal = {
          targetBedtime: '22:00',
          targetWakeTime: '06:00',
          targetSleepHours: '8'
        };
        
        setFormData(defaultSleepGoal);
        setApiSleepGoal(null); // API에서 가져온 데이터가 아님을 표시
        setApiLoading(false);
        return;
      }
      
            // 에러 타입별 처리 - 모든 에러를 콘솔에만 로그하고 UI에는 표시하지 않음
            if (error.response?.status === 401) {
              console.log('🔑 401 에러: 토큰 재발급 시도 중...');
            } else if (error.response?.status === 403) {
              console.log('🚫 403 에러: 접근 권한이 없습니다.');
            } else if (error.code === 'NETWORK_ERROR' || !error.response) {
              console.log('🌐 네트워크 에러: 연결을 확인해주세요.');
            } else {
              console.log('❌ 수면 목표 조회 실패:', error.message || '알 수 없는 오류');
            }
    } finally {
      setApiLoading(false);
    }
  }, []);

  // API에 수면 목표 저장하기
  const saveSleepGoalToAPI = useCallback(async (goalData: SleepGoalRequest): Promise<boolean> => {
    try {
      console.log('💾 API 호출: 수면 목표 저장', goalData);
      
      const response = await SleepAPI.setSleepGoal(goalData);
      console.log('✅ API 응답: 수면 목표 저장 성공', response);
      
      if (response.result) {
        setApiSleepGoal(response.result);
        console.log('😴 수면 목표 저장 완료:', response.result);
        return true;
      }
      return false;
    } catch (error: any) {
      console.error('❌ API 호출 실패: 수면 목표 저장', error);
      console.error('❌ 에러 상세 정보:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
        goalData: goalData
      });
      
      // 모든 에러를 콘솔에만 로그하고 UI에는 표시하지 않음
      if (error.response?.status === 400) {
        console.error('❌ 400 에러: 잘못된 요청 데이터', error.response.data);
      } else {
        console.error('❌ 수면 목표 저장 실패:', error instanceof Error ? error.message : '알 수 없는 오류');
      }
      return false;
    }
  }, []);

  // API에 수면 목표 업데이트하기
  const updateSleepGoalToAPI = useCallback(async (goalData: SleepGoalRequest): Promise<boolean> => {
    try {
      console.log('🔄 API 호출: 수면 목표 업데이트', goalData);
      
      const response = await SleepAPI.updateSleepGoal(goalData);
      console.log('✅ API 응답: 수면 목표 업데이트 성공', response);
      
      if (response.result) {
        setApiSleepGoal(response.result);
        console.log('😴 수면 목표 업데이트 완료:', response.result);
        return true;
      }
      return false;
    } catch (error: any) {
      console.error('❌ API 호출 실패: 수면 목표 업데이트', error);
      console.error('❌ 에러 상세 정보:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
        goalData: goalData
      });
      
      // 모든 에러를 콘솔에만 로그하고 UI에는 표시하지 않음
      if (error.response?.status === 400) {
        console.error('❌ 400 에러: 잘못된 요청 데이터', error.response.data);
      } else {
        console.error('❌ 수면 목표 업데이트 실패:', error instanceof Error ? error.message : '알 수 없는 오류');
      }
      return false;
    }
  }, []);

  // 실제 사용자 프로필 정보 사용 - 메모이제이션 (localStorage fallback 포함)
  const userProfile = useMemo(() => {
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

  const userData = useMemo(() => {
    // localStorage에서 사용자 프로필 정보 가져오기
    const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const currentUserId = user?.id || profile?.id;
    const currentUser = storedUsers.find((u: any) => u.id === currentUserId);
    
    // 실제 사용자 데이터가 있으면 사용, 없으면 기본값
    if (currentUser && currentUser.profile) {
      return {
        name: currentUser.name || '사용자',
        email: currentUser.email || '',
        avatar: (currentUser.name || '사용자').charAt(0),
        averageScore: currentUser.profile.averageScore || 85,
        averageSleepTime: currentUser.profile.averageSleepTime || 7.5,
        totalDays: currentUser.profile.totalDays || 30
      };
    }
    
    // 기본값
    return {
      name: profile?.name || user?.name || '사용자',
      email: profile?.email || user?.email || '',
      avatar: (profile?.name || user?.name || '사용자').charAt(0),
      averageScore: 85,
      averageSleepTime: 7.5,
      totalDays: 30
    };
  }, [profile?.name, profile?.email, user?.name, user?.email, user?.id, profile?.id]);
  
  // 현재 사용자의 수면 목표 데이터 가져오기 - 메모이제이션
  const sleepGoalData = useMemo(() => {
    const userId = user?.id || profile?.id;
    
    if (userId) {
      const testUserSleepGoal = getTestUserSleepGoal(userId);
      if (testUserSleepGoal) {
        return testUserSleepGoal;
      }
    }
    
    // 기본값
    return {
      targetBedtime: '23:00',
      targetWakeTime: '07:00',
      targetSleepHours: 8.0,
      name: profile?.name || user?.name || '사용자'
    };
  }, [user?.id, user?.name, profile?.id, profile?.name]);

  // 시간 계산 유틸리티 함수들
  const timeToMinutes = useCallback((timeStr: string): number => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  }, []);

  const minutesToTime = useCallback((minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  }, []);

  const calculateSleepHours = useCallback((bedtime: string, wakeTime: string): string => {
    const bedtimeMinutes = timeToMinutes(bedtime);
    let wakeMinutes = timeToMinutes(wakeTime);
    
    // 다음날 아침으로 간주 (취침시간이 기상시간보다 늦은 경우)
    if (bedtimeMinutes > wakeMinutes) {
      wakeMinutes += 24 * 60; // 24시간 추가
    }
    
    const sleepMinutes = wakeMinutes - bedtimeMinutes;
    const sleepHours = sleepMinutes / 60;
    return sleepHours.toFixed(1);
  }, [timeToMinutes]);

  const calculateWakeTime = useCallback((bedtime: string, sleepHours: string): string => {
    const bedtimeMinutes = timeToMinutes(bedtime);
    const sleepMinutes = parseFloat(sleepHours) * 60;
    const wakeMinutes = bedtimeMinutes + sleepMinutes;
    
    // 24시간을 넘어가면 다음날로 계산
    const adjustedWakeMinutes = wakeMinutes % (24 * 60);
    return minutesToTime(adjustedWakeMinutes);
  }, [timeToMinutes, minutesToTime]);

  // 수면시간 입력 검증
  const validateSleepHours = useCallback((value: string): boolean => {
    const num = parseFloat(value);
    return !isNaN(num) && num >= 1 && num <= 24;
  }, []);

  // 컴포넌트 마운트 시 API에서 수면 목표 데이터 로드
  useEffect(() => {
    fetchSleepGoal();
  }, [fetchSleepGoal]);

  // API 호출 실패 시 로컬 스토리지에서 수면 목표 데이터 로드 (fallback)
  useEffect(() => {
    if (apiError && !apiSleepGoal) {
      const savedSleepGoal = localStorage.getItem('sleepGoal');
      if (savedSleepGoal) {
        const goalData = JSON.parse(savedSleepGoal);
        setFormData({
          targetBedtime: goalData.targetBedtime || '22:00',
          targetWakeTime: goalData.targetWakeTime || '06:00',
          targetSleepHours: goalData.targetSleepHours?.toString() || '8'
        });
      }
    }
  }, [apiError, apiSleepGoal]);

  // 뒤로가기 핸들러
  const handleBack = useCallback(() => {
    if (cameFromSetup) {
      navigate('/sleep-setup');
    } else {
      navigate('/profile');
    }
  }, [cameFromSetup, navigate]);

  // 수면 기록 시작 핸들러
  const handleStartSleepRecord = useCallback(() => {
    console.log('수면 기록 시작');
  }, []);

  // 로그아웃 핸들러
  const handleLogout = useCallback(() => {
    logout();
    navigate('/');
  }, [logout, navigate]);

  // 폼 데이터 변경 핸들러
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
  }, [calculateSleepHours, validateSleepHours, calculateWakeTime]);

  // 수정 모드 토글
  const handleEdit = useCallback(() => {
    setIsEditing(true);
  }, []);

  // 취소 핸들러
  const handleCancel = useCallback(() => {
    setIsEditing(false);
    // 원래 데이터로 복원
  }, []);

  // 저장 핸들러
  const handleSave = useCallback(async () => {
    // 입력 검증
    if (!validateSleepHours(formData.targetSleepHours)) {
      setErrorMessage('수면시간은 1-24시간 사이의 값이어야 합니다.');
      return;
    }
    
    setIsLoading(true);
    setErrorMessage('');
    
    try {
      // 수면 목표 데이터 준비 및 검증
      const sleepHours = parseFloat(formData.targetSleepHours);
      
      // 데이터 검증
      if (isNaN(sleepHours) || sleepHours < 1 || sleepHours > 24) {
        setErrorMessage('수면시간은 1-24시간 사이의 유효한 숫자여야 합니다.');
        setIsLoading(false);
        return;
      }
      
      if (!formData.targetBedtime || !formData.targetWakeTime) {
        setErrorMessage('취침시각과 기상시각을 모두 입력해주세요.');
        setIsLoading(false);
        return;
      }
      
      const sleepGoalData: SleepGoalRequest = {
        goalBedTime: formData.targetBedtime,
        goalWakeTime: formData.targetWakeTime,
        goalTotalSleepTime: sleepHours
      };
      
      console.log('💾 저장할 데이터:', {
        formData: formData,
        sleepGoalData: sleepGoalData,
        goalTotalSleepTimeType: typeof sleepGoalData.goalTotalSleepTime,
        goalTotalSleepTimeValue: sleepGoalData.goalTotalSleepTime,
        isValidTime: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(formData.targetBedtime) && /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(formData.targetWakeTime)
      });
      
      // API에 저장/업데이트 시도
      let apiSuccess = false;
      if (apiSleepGoal) {
        // 기존 데이터가 있으면 업데이트
        apiSuccess = await updateSleepGoalToAPI(sleepGoalData);
      } else {
        // 기존 데이터가 없으면 새로 저장
        apiSuccess = await saveSleepGoalToAPI(sleepGoalData);
      }
      
      // API 저장 성공/실패와 관계없이 로컬 스토리지에 저장하고 UI에는 성공 메시지만 표시
      localStorage.setItem('sleepGoal', JSON.stringify(sleepGoalData));
      setIsEditing(false);
      
      if (apiSuccess) {
        console.log('✅ 수면 목표가 API에 저장되었습니다:', sleepGoalData);
        alert('수면 목표를 저장했습니다!');
      } else {
        console.log('⚠️ 수면 목표가 로컬에만 저장되었습니다:', sleepGoalData);
        alert('수면 목표를 저장했습니다!');
      }
    } catch (error) {
      console.error('수면 목표 저장 중 오류 발생:', error);
      // 에러를 콘솔에만 로그하고 UI에는 표시하지 않음
    } finally {
      setIsLoading(false);
    }
  }, [formData, validateSleepHours, apiSleepGoal, saveSleepGoalToAPI, updateSleepGoalToAPI]);

  return (
    <Container className="sleep-goal-setting-page" backgroundColor="#000000" width="100vw">
      <NavBar
        onStartSleepRecord={handleStartSleepRecord}
        userProfile={userProfile}
        onLogout={handleLogout}
      />
      
      <main className="flex-1 flex justify-center px-8 py-6 relative">
        <div className="w-full max-w-4xl relative">
          <div className="profile-content" style={{ minHeight: 'auto' }}>

            {/* 사용자 통계 카드 */}
            <ProfileStatsCard userData={userData} />
            
            {/* 수면 목표 설정 카드 */}
            <div className="sleep-goal-card">
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
                {(errorMessage || apiError) && (
                  <div className="profile-error-message">
                    {apiError || errorMessage}
                    {apiError && apiError.includes('로그인이 필요합니다') && (
                      <div style={{ marginTop: '8px' }}>
                        <button 
                          onClick={() => navigate('/login')}
                          style={{
                            padding: '8px 16px',
                            fontSize: '14px',
                            backgroundColor: '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                          }}
                        >
                          로그인하러 가기
                        </button>
                      </div>
                    )}
                  </div>
                )}
                
                <div className="grid grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-4">

                  {/* 목표 수면시간 */}
                  <div className="space-y-2">
                    <label 
                      htmlFor="targetSleepHours" 
                      className="form-label"
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
                        className="form-input"
                      />
                      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-400 pointer-events-none">
                        시간
                      </span>
                    </div>
                  </div>

                  {/* 목표 취침시각*/}
                  <div className="space-y-2">
                    <label 
                      htmlFor="targetBedtime" 
                      className="form-label"
                    >
                      목표 취침시각
                    </label>
                    <input
                      type="time"
                      id="targetBedtime"
                      name="targetBedtime"
                      value={formData.targetBedtime}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="form-input"
                    />
                  </div>

                  {/* 목표 기상시각 */}
                  <div className="space-y-2">
                    <label 
                      htmlFor="targetWakeTime" 
                      className="form-label"
                    >
                      목표 기상시각
                    </label>
                    <input
                      type="time"
                      id="targetWakeTime"
                      name="targetWakeTime"
                      value={formData.targetWakeTime}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="form-input"
                    />
                  </div>
                </div>

                {/* 액션 버튼들 */}
                <ProfileFooter
                  isEditing={isEditing}
                  isLoading={isLoading || apiLoading}
                  onEdit={handleEdit}
                  onSave={handleSave}
                  onCancel={handleCancel}
                  loadingText={apiLoading ? "데이터 로딩 중..." : "저장 중..."}
                />
              </div>
            </div>
          </div>
          
          {/* 뒤로가기 버튼 */}
          <div className="mt-4" style={{ display: 'flex', justifyContent: 'flex-end' }}>
            {cameFromSetup ? (
              <button
                type="button"
                className="btn-back"
                onClick={() => navigate('/sleep-setup')}
                aria-label="수면 설정으로 돌아가기"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 6 }}>
                  <path d="m12 19-7-7 7-7"></path>
                  <path d="M19 12H5"></path>
                </svg>
                뒤로가기
              </button>
            ) : (
              <button
                type="button"
                className="btn-back"
                onClick={() => navigate('/dashboard')}
                aria-label="대시보드로 돌아가기"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 6 }}>
                  <path d="m12 19-7-7 7-7"></path>
                  <path d="M19 12H5"></path>
                </svg>
                대시보드로 돌아가기
              </button>
            )}
          </div>
        </div>
      </main>
    </Container>
  );
};

export default SleepGoalSetting;
