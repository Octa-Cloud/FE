import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  loginUser, 
  registerUser, 
  logout, 
  clearError as clearAuthError, 
  updateTestCredentials, 
  updateCredentialsFromProfile,
  restoreUser 
} from './slices/authSlice';
import { 
  setProfile, 
  setEditing, 
  updateUserProfile, 
  setTempProfile, 
  clearTempProfile, 
  clearError as clearUserError 
} from './slices/userSlice';

// 타입 안전성을 위한 커스텀 훅들
export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;

// 인증 관련 훅들
export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, loading, error, testCredentials } = useAppSelector(
    (state) => state.auth
  );

  // 안전한 액션 디스패치 함수들 (메모이제이션)
  const safeLogin = React.useCallback((credentials) => {
    return dispatch(loginUser(credentials));
  }, [dispatch]);

  const safeRegister = React.useCallback((userData) => {
    return dispatch(registerUser(userData));
  }, [dispatch]);

  const safeLogout = React.useCallback(() => {
    dispatch(logout());
  }, [dispatch]);

  const safeClearError = React.useCallback(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  const safeUpdateTestCredentials = React.useCallback((credentials) => {
    dispatch(updateTestCredentials(credentials));
  }, [dispatch]);

  const safeUpdateCredentialsFromProfile = React.useCallback((credentials) => {
    dispatch(updateCredentialsFromProfile(credentials));
  }, [dispatch]);

  const safeRestoreUser = React.useCallback(() => {
    dispatch(restoreUser());
  }, [dispatch]);

  return {
    user,
    isAuthenticated,
    loading,
    error,
    testCredentials,
    login: safeLogin,
    register: safeRegister,
    logout: safeLogout,
    clearError: safeClearError,
    updateTestCredentials: safeUpdateTestCredentials,
    updateCredentialsFromProfile: safeUpdateCredentialsFromProfile,
    restoreUser: safeRestoreUser,
  };
};

// 사용자 프로필 관련 훅들
export const useUserProfile = () => {
  const dispatch = useAppDispatch();
  const { profile, loading, error, isEditing, tempProfile } = useAppSelector(
    (state) => state.user
  );

  // 안전한 액션 디스패치 함수들 (메모이제이션)
  const safeSetProfile = React.useCallback((profile) => {
    dispatch(setProfile(profile));
  }, [dispatch]);

  const safeSetEditing = React.useCallback((editing) => {
    dispatch(setEditing(editing));
  }, [dispatch]);

  const safeUpdateProfile = React.useCallback((userData) => {
    return dispatch(updateUserProfile(userData));
  }, [dispatch]);

  const safeSetTempProfile = React.useCallback((profile) => {
    dispatch(setTempProfile(profile));
  }, [dispatch]);

  const safeClearTempProfile = React.useCallback(() => {
    dispatch(clearTempProfile());
  }, [dispatch]);

  const safeClearError = React.useCallback(() => {
    dispatch(clearUserError());
  }, [dispatch]);

  return {
    profile,
    loading,
    error,
    isEditing,
    tempProfile,
    setProfile: safeSetProfile,
    setEditing: safeSetEditing,
    updateProfile: safeUpdateProfile,
    setTempProfile: safeSetTempProfile,
    clearTempProfile: safeClearTempProfile,
    clearError: safeClearError,
  };
};
