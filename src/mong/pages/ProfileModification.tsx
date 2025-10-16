import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, useUserProfile } from '../store/hooks';
import NavBar from '../components/NavBar';
import ProfileStatsCard from '../components/ProfileStatsCard';
import BasicInfoForm from '../components/BasicInfoForm';
import Container from '../components/Container';
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

  // 현재 로그인한 사용자의 프로필 데이터 가져오기 - 실제 사용자 데이터 사용
  const getCurrentUserProfile = () => {
    // localStorage에서 사용자 프로필 정보 가져오기
    const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const currentUserId = user?.id;
    const currentUser = storedUsers.find((u: any) => u.id === currentUserId);
    
    // 실제 사용자 데이터가 있으면 사용, 없으면 기본값
    if (currentUser && currentUser.profile) {
      return {
        name: currentUser.name || '사용자',
        email: currentUser.email || '',
        avatar: (currentUser.name || '사용자').charAt(0),
        averageScore: currentUser.profile.averageScore || 85,
        averageSleepTime: currentUser.profile.averageSleepTime || 7.5,
        totalDays: currentUser.profile.totalDays || 30,
        birthDate: currentUser.birthDate || '1990-01-01',
        gender: currentUser.gender || '남'
      };
    }
    
    // 기본값 (로그인하지 않았거나 사용자 데이터가 없는 경우)
    return {
      name: '김수면',
      email: 'a@a.a',
      avatar: '김',
      averageScore: 85,
      averageSleepTime: 7.2,
      totalDays: 45,
      birthDate: '1990-01-15',
      gender: '여'
    };
  };

  const defaultUserData = getCurrentUserProfile();

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
      setProfile(userData as any);
    } else {
      setProfile(defaultUserData as any);
    }
  }, [user]); // profile과 setProfile을 의존성 배열에서 제거

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleEdit = () => {
    setTempProfile({ ...currentUserData } as any); // 깊은 복사로 현재 데이터를 임시 데이터에 설정
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
        alert('프로필이 변경되었습니다!');

        // 전역 프로필 및 로컬 스토리지 동기화 - 헤더 이름/아바타 즉시 반영
        try {
          const newProfile = {
            ...(profile as any),
            ...updatedData,
            avatar: (updatedData?.name || (profile as any)?.name || 'U').charAt(0)
          } as any;
          setProfile(newProfile);

          const storedUserRaw = localStorage.getItem('user');
          if (storedUserRaw) {
            const storedUser = JSON.parse(storedUserRaw);
            const mergedStored = {
              ...storedUser,
              name: newProfile.name,
              email: newProfile.email,
              birthDate: newProfile.birthDate,
              gender: newProfile.gender
            };
            localStorage.setItem('user', JSON.stringify(mergedStored));
          }
        } catch (e) {
          console.warn('프로필 동기화 중 경고:', e);
        }
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
      <Container className="profile-modification-page" width="100vw">
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          {!isMounted ? '초기화 중...' : '로딩 중...'}
        </div>
      </Container>
    );
  }

  return (
    <Container className="profile-modification-page" width="100vw">
      <NavBar 
        onLogout={handleLogout}
        userProfile={{
          name: currentUserData?.name || '사용자',
          avatar: (currentUserData?.name || '사용자').charAt(0)
        }}
      />
      
      <main className="flex-1 flex justify-center p-4 relative">
        <div className="w-full max-w-4xl relative">
          <div className="profile-content">
            {/* 항상 데이터가 있도록 보장 */}
            <ProfileStatsCard userData={{
              name: currentUserData?.name || '사용자',
              email: currentUserData?.email || '',
              avatar: (currentUserData?.name || '사용자').charAt(0),
              averageScore: (currentUserData as any)?.averageScore || 85,
              averageSleepTime: (currentUserData as any)?.averageSleepTime || 7.5,
              totalDays: (currentUserData as any)?.totalDays || 30
            }} />
            <BasicInfoForm 
              userData={{
                name: currentUserData?.name || '사용자',
                email: currentUserData?.email || '',
                birthDate: currentUserData?.birthDate || '1990-01-01',
                gender: (currentUserData?.gender as '남' | '여') || '남'
              }}
              tempFormData={tempProfile || undefined}
              isEditing={isEditing}
              onEdit={handleEdit}
              onSave={handleSave}
              onCancel={handleCancel}
              onFormDataChange={handleFormDataChange}
            />
            {error && (
              <div className="profile-error-message">
                {error}
              </div>
            )}
          </div>
          <div className="mt-4" style={{ display: 'flex', justifyContent: 'flex-end' }}>
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
          </div>
        </div>
      </main>
    </Container>
  );
};

export default ProfileModification;
