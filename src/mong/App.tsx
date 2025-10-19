import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Provider, useDispatch } from 'react-redux';
import { store, AppDispatch } from './store';
import { restoreUser } from './store/slices/authSlice';
import { setProfile } from './store/slices/userSlice';
import { authAPI } from './api/auth';
import { User } from './types';
import { userStorage } from './utils/storage';
import Home from './pages/Home';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import ProfileModification from './pages/ProfileModification';
import SleepGoalSetting from './pages/SleepGoalSetting';
import StatisticsAnalysis from './pages/StatisticsAnalysis';
import DailyReport from './pages/DailyReport';
import SleepDashboard from './pages/SleepDashboard';
import SleepSetup from './pages/SleepSetup';
import SleepMeasuring from './pages/SleepMeasuring';
import WakeUp from './pages/WakeUp';
import WakeUpSummary from './pages/WakeUpSummary';
import { initializeTestData } from './testData';
import { initializeAdditionalTestData } from './DummyData';

// 앱 초기화 컴포넌트 - useAuth 훅 사용하지 않고 직접 dispatch 사용
function AppInitializer() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    // 기본 테스트 사용자 등록 (한 번만 실행)
    const initializeDefaultUser = () => {
      const existingUsers: User[] = JSON.parse(localStorage.getItem('users') || '[]');
      
      // 기본 테스트 사용자가 이미 있는지 확인
      const defaultUserExists = existingUsers.some(user => user.email === 'test1@gmail.com');
      
      if (!defaultUserExists) {
        const defaultUser: User = {
          id: 'default-test-user-001',
          email: 'test1@gmail.com',
          password: 'password1!',
          name: '추민기',
          birthDate: '2004-08-19',
          gender: '남',
          createdAt: new Date().toISOString(),
        };
        
        // 기본 사용자를 사용자 목록에 추가
        existingUsers.push(defaultUser);
        localStorage.setItem('users', JSON.stringify(existingUsers));
        
        console.log('✅ 기본 테스트 사용자가 등록되었습니다!');
        console.log('📧 이메일:', defaultUser.email);
        console.log('🔑 비밀번호:', defaultUser.password);
        console.log('👤 이름:', defaultUser.name);
      } else {
        console.log('ℹ️ 기본 테스트 사용자가 이미 등록되어 있습니다.');
      }
    };

    // 특정 사용자 제거 함수
    const removeSpecificUsers = () => {
      const existingUsers: User[] = JSON.parse(localStorage.getItem('users') || '[]');
      const usersToRemove = ['test3@gmail.com', 'test4@gmail.com'];
      
      // 제거할 사용자들을 필터링
      const filteredUsers = existingUsers.filter(user => !usersToRemove.includes(user.email));
      
      // 변경사항이 있는 경우에만 업데이트
      if (filteredUsers.length !== existingUsers.length) {
        localStorage.setItem('users', JSON.stringify(filteredUsers));
        console.log('🗑️ test3@gmail.com과 test4@gmail.com 사용자가 제거되었습니다.');
        console.log('📊 현재 등록된 사용자 수:', filteredUsers.length);
      } else {
        console.log('ℹ️ 제거할 사용자가 없습니다.');
      }
    };

    // 기존 사용자 비밀번호에 특수문자 추가 함수
    const updateExistingUserPasswords = () => {
      const existingUsers: User[] = JSON.parse(localStorage.getItem('users') || '[]');
      let hasUpdates = false;
      
      const updatedUsers = existingUsers.map(user => {
        // 비밀번호에 특수문자가 없는 경우 '!' 추가
        if (user.password && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(user.password)) {
          hasUpdates = true;
          return {
            ...user,
            password: user.password + '!'
          };
        }
        return user;
      });
      
      if (hasUpdates) {
        localStorage.setItem('users', JSON.stringify(updatedUsers));
        console.log('🔐 기존 사용자들의 비밀번호에 특수문자(!)가 추가되었습니다.');
        
        // 현재 로그인된 사용자도 업데이트
        const currentUser = JSON.parse(localStorage.getItem('user') || 'null');
        if (currentUser && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(currentUser.password)) {
          const updatedCurrentUser = {
            ...currentUser,
            password: currentUser.password + '!'
          };
          localStorage.setItem('user', JSON.stringify(updatedCurrentUser));
          console.log('🔐 현재 로그인된 사용자의 비밀번호도 업데이트되었습니다.');
        }
      } else {
        console.log('ℹ️ 모든 사용자의 비밀번호가 이미 특수문자를 포함하고 있습니다.');
      }
    };

    // 통합 테스트 데이터 초기화
    initializeTestData();
    
    // 추가 테스트 데이터 초기화 (DummyData.ts)
    initializeAdditionalTestData();
    
    // 특정 사용자 제거
    removeSpecificUsers();
    
    // 기존 사용자 비밀번호에 특수문자 추가
    updateExistingUserPasswords();
    
    // 앱 시작 시 로컬 스토리지에서 사용자 정보 복원
    dispatch(restoreUser());
    
    // 토큰이 있으면 사용자 정보 자동 복원
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    
    if (accessToken && refreshToken) {
      console.log('🔑 토큰 발견: 사용자 정보 자동 복원 시도');
      
      // 토큰이 있으면 사용자 정보를 API에서 가져와서 Redux store에 설정
      const restoreUserFromToken = async () => {
        try {
          console.log('👤 토큰으로 사용자 정보 조회 중...');
          const userInfoResponse = await authAPI.getUserInfo();
          console.log('✅ 토큰으로 사용자 정보 조회 성공:', userInfoResponse);
          
          if (userInfoResponse.result) {
            // 성별 변환
            const genderMap: Record<string, '남' | '여'> = {
              'MALE': '남',
              'FEMALE': '여'
            };
            
            const user: User = {
              id: userInfoResponse.result.email, // 임시로 이메일을 ID로 사용
              email: userInfoResponse.result.email,
              password: '', // 토큰 기반 복원에서는 비밀번호 없음
              name: userInfoResponse.result.name,
              birthDate: userInfoResponse.result.birth || '',
              gender: genderMap[userInfoResponse.result.gender] || '남',
              createdAt: new Date().toISOString(),
            };
            
            // Redux store에 사용자 정보 설정
            dispatch(setProfile(user));
            
            // localStorage에도 저장
            userStorage.setCurrentUser(user);
            
            console.log('💾 토큰 기반 사용자 정보 복원 완료:', user);
          }
        } catch (error: any) {
          console.error('❌ 토큰으로 사용자 정보 조회 실패:', error);
          
          // 토큰이 만료되었거나 유효하지 않은 경우 토큰 제거
          if (error.response?.status === 401 || error.response?.status === 403) {
            console.log('🧹 만료된 토큰 제거');
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
          }
        }
      };
      
      restoreUserFromToken();
    } else {
      console.log('🔍 토큰 없음: 로컬 스토리지에서만 사용자 정보 복원');
    }
  }, [dispatch]); // dispatch는 안정적이므로 의존성 배열에 포함

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/profile" element={<ProfileModification />} />
        <Route path="/sleep-goal" element={<SleepGoalSetting />} />
        <Route path="/statistics" element={<StatisticsAnalysis />} />
        <Route path="/daily-report/:date" element={<DailyReport />} />
        <Route path="/dashboard" element={<SleepDashboard />} />
        <Route path="/sleep-setup" element={<SleepSetup />} />
        <Route path="/sleep-measuring" element={<SleepMeasuring />} />
        <Route path="/wakeup" element={<WakeUp />} />
        <Route path="/wake-up-summary" element={<WakeUpSummary />} />
      </Routes>
    </Router>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <AppInitializer />
    </Provider>
  );
}
