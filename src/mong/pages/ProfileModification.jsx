import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, useUserProfile } from '../store/hooks';
import ProfileHeader from '../components/ProfileHeader';
import ProfileStatsCard from '../components/ProfileStatsCard';
import BasicInfoForm from '../components/BasicInfoForm';
import '../styles/profile.css';

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

  // 현재 표시할 사용자 데이터 (메모이제이션으로 최적화)
  const currentUserData = useMemo(() => {
    // profile이 있으면 profile 사용 (우선순위 높음)
    if (profile) {
      return profile;
    }
    
    // user가 있으면 user 데이터로 생성
    if (user) {
      const userData = {
        ...defaultUserData,
        ...user,
        avatar: user.name ? user.name.charAt(0) : 'U'
      };
      return userData;
    }
    
    // 둘 다 없으면 기본 데이터 사용
    return defaultUserData;
  }, [user, profile]); // 의존성 배열 유지

  // 컴포넌트가 마운트되었는지 확인
  const [isMounted, setIsMounted] = useState(false);
  
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

  const handleEdit = () => {
    setTempProfile({ ...currentUserData }); // 깊은 복사로 현재 데이터를 임시 데이터에 설정
    setEditing(true);
  };

  const handleSave = async (updatedData) => {
    try {
      const result = await updateProfile(updatedData);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const handleCancel = () => {
    clearTempProfile(); // 임시 데이터 초기화
    setEditing(false);
  };

  const handleFormDataChange = (newFormData) => {
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
    <div className="profile-modification-page">
      <ProfileHeader 
        onBack={handleBack}
        onStartSleepRecord={handleStartSleepRecord}
        userProfile={{
          name: currentUserData?.name || '사용자',
          avatar: currentUserData?.avatar || 'U'
        }}
      />
      
      <main className="profile-main">
        <div className="profile-container">
          <div className="profile-content">
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
              <div className="error-message" style={{ color: '#ef4444', margin: '1rem 0' }}>
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
