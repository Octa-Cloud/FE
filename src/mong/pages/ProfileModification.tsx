import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, useUserProfile } from '../store/hooks';
import ProfileHeader from '../components/ProfileHeader';
import ProfileStatsCard from '../components/ProfileStatsCard';
import BasicInfoForm from '../components/BasicInfoForm';
import '../styles/profile.css';
import { User } from '../types';

const ProfileModification = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { 
    profile, 
    isEditing, 
    tempProfile, 
    loading, 
    error,
    setProfile, 
    setEditing, 
    updateProfile, 
    setTempProfile, 
    clearTempProfile 
  } = useUserProfile();

  // 기본 사용자 데이터 (실제 앱에서는 API에서 가져옴)
  const defaultUserData = {
    name: '김수면',
    email: 'a@a.a',
    avatar: '김',
    averageScore: 85,
    averageSleepTime: 7.2,
    totalDays: 45,
    birthDate: '1990-01-15',
    gender: 'female'
  };

  // 현재 표시할 사용자 데이터 (localStorage > profile > user > defaultUserData 순으로 우선순위)
  const currentUserData = useMemo(() => {
    // localStorage에서 직접 확인 (가장 확실한 방법)
    const localStorageUser = localStorage.getItem('user');
    if (localStorageUser) {
      try {
        const parsedUser: User = JSON.parse(localStorageUser);
        console.log('💾 ProfileModification - localStorage 사용자 데이터 사용:', parsedUser);
        const userData = {
          ...defaultUserData,
          ...parsedUser,
          avatar: parsedUser.name ? parsedUser.name.charAt(0) : 'U'
        };
        return userData;
      } catch (error) {
        console.error('❌ localStorage 사용자 데이터 파싱 오류:', error);
      }
    }
    
    // localStorage가 없으면 profile 사용
    if (profile) {
      console.log('📝 ProfileModification - Redux profile 데이터 사용:', profile);
      return profile;
    }
    
    // user가 있으면 user 데이터로 생성
    if (user) {
      console.log('👤 ProfileModification - Redux user 데이터 사용:', user);
      const userData = {
        ...defaultUserData,
        ...user,
        avatar: user.name ? user.name.charAt(0) : 'U'
      };
      return userData;
    }
    
    // 둘 다 없으면 기본 데이터 사용
    console.log('⚠️ ProfileModification - 기본 데이터 사용:', defaultUserData);
    return defaultUserData;
  }, [user, profile]); // 의존성 배열 유지

  // 컴포넌트가 마운트되었는지 확인
  const [isMounted, setIsMounted] = useState<boolean>(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 사용자 데이터 초기화 (한 번만 실행)
  useEffect(() => {
    // 이미 profile이 설정되어 있으면 다시 설정하지 않음
    if (profile) {
      return;
    }
    
    if (user) {
      const userData = {
        ...defaultUserData,
        ...user,
        avatar: user.name ? user.name.charAt(0) : 'U'
      };
      setProfile(userData);
    } else {
      setProfile(defaultUserData);
    }
  }, [user]); // profile과 setProfile을 의존성 배열에서 제거

  const handleBack = () => {
    navigate(-1); // Go back to previous page
  };

  const handleStartSleepRecord = () => {
    // Navigate to sleep recording page
    console.log('Starting sleep record...');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleEdit = () => {
    setTempProfile({ ...currentUserData }); // 깊은 복사로 현재 데이터를 임시 데이터에 설정
    setEditing(true);
  };

  const handleSave = async (updatedData: any) => {
    try {
      console.log('ProfileModification - handleSave called with:', updatedData);
      const result = await updateProfile(updatedData);
      console.log('ProfileModification - updateProfile result:', result);
      
      // Redux createAsyncThunk는 fulfilled/rejected 액션을 반환
      // result.type을 확인하여 성공 여부 판단
      if (result && result.type && result.type.endsWith('/fulfilled')) {
        console.log('✅ 프로필 업데이트 성공');
        // 저장 성공 후 편집 모드 종료
        setEditing(false);
        console.log('✅ 프로필 저장 완료');
      } else if (result && result.type && result.type.endsWith('/rejected')) {
        console.error('❌ 프로필 업데이트 실패:', result.payload);
        alert(`프로필 업데이트에 실패했습니다: ${result.payload || '알 수 없는 오류'}`);
      } else {
        console.warn('⚠️ 예상치 못한 결과:', result);
        // 예상치 못한 경우에도 편집 모드 종료 (성공으로 간주)
        setEditing(false);
        console.log('✅ 프로필 저장 완료 (예상치 못한 결과)');
      }
      
    } catch (error) {
      console.error('❌ Failed to update profile:', error);
      alert(`프로필 업데이트 중 오류가 발생했습니다: ${(error as Error).message || error}`);
    }
  };

  const handleCancel = () => {
    clearTempProfile(); // 임시 데이터 초기화
    setEditing(false);
  };

  const handleFormDataChange = (newFormData: any) => {
    setTempProfile(newFormData);
  };

  // 컴포넌트가 마운트되지 않았거나 로딩 중일 때
  if (!isMounted || loading) {
    return (
      <div className="profile-modification-page">
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          {!isMounted ? '초기화 중...' : '로딩 중...'}
        </div>
      </div>
    );
  }


  return (
    <div className="profile-modification-page min-h-screen bg-gradient-to-br from-primary-50 to-primary-100">
      <ProfileHeader 
        onBack={handleBack}
        onStartSleepRecord={handleStartSleepRecord}
        onLogout={handleLogout}
        userProfile={{
          name: currentUserData?.name || '사용자',
          avatar: currentUserData?.avatar || 'U'
        }}
      />
      
      <main className="profile-main p-4">
        <div className="profile-container max-w-4xl mx-auto">
          <div className="profile-content space-y-6">
            {/* 항상 데이터가 있도록 보장 */}
            <ProfileStatsCard userData={currentUserData} />
            <BasicInfoForm 
              userData={currentUserData}
              tempFormData={tempProfile}
              isEditing={isEditing}
              onEdit={handleEdit}
              onSave={handleSave}
              onCancel={handleCancel}
              onFormDataChange={handleFormDataChange}
            />
            {error && (
              <div className="error-message text-center p-4 text-error-600 bg-error-50 border border-error-200 rounded-lg mt-4">
                {error}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfileModification;
