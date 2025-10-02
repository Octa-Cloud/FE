import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Provider, useDispatch } from 'react-redux';
import { store } from './store';
import { restoreUser } from './store/slices/authSlice';
import Home from './pages/Home.jsx';
import SignUp from './pages/SignUp.jsx';
import Login from './pages/Login.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';
import ProfileModification from './pages/ProfileModification.jsx';

// 앱 초기화 컴포넌트 - useAuth 훅 사용하지 않고 직접 dispatch 사용
function AppInitializer() {
  const dispatch = useDispatch();

  useEffect(() => {
    // 기본 테스트 사용자 등록 (한 번만 실행)
    const initializeDefaultUser = () => {
      const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
      
      // 기본 테스트 사용자가 이미 있는지 확인
      const defaultUserExists = existingUsers.some(user => user.email === 'test1@gmail.com');
      
      if (!defaultUserExists) {
        const defaultUser = {
          id: 'default-test-user-001',
          email: 'test1@gmail.com',
          password: 'password1',
          name: '추민기',
          birthDate: '2004-08-19',
          gender: 'male',
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

    // 기본 사용자 등록
    initializeDefaultUser();
    
    // 앱 시작 시 로컬 스토리지에서 사용자 정보 복원
    dispatch(restoreUser());
  }, [dispatch]); // dispatch는 안정적이므로 의존성 배열에 포함

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/profile" element={<ProfileModification />} />
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


