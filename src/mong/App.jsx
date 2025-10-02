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
    // 앱 시작 시 로컬 스토리지에서 사용자 정보 복원 (한 번만 실행)
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


