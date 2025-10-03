import { PayloadAction } from '@reduxjs/toolkit';
import { User } from './common';
import { LoginCredentials, RegisterData, UpdateProfileData } from './forms';

// Auth Slice 타입
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  loginAttempts: number;
  lastLoginAttempt: string | null;
  testCredentials: {
    email: string;
    password: string;
  };
}

// User Profile Slice 타입
export interface UserProfileState {
  profile: User | null;
  loading: boolean;
  error: string | null;
  isEditing: boolean;
  tempProfile: Partial<User> | null;
}

// Redux 액션 타입
export type LoginUserAction = PayloadAction<LoginCredentials>;
export type RegisterUserAction = PayloadAction<RegisterData>;
export type UpdateUserProfileAction = PayloadAction<UpdateProfileData>;
export type SetProfileAction = PayloadAction<User | null>;
export type SetEditingAction = PayloadAction<boolean>;
export type SetTempProfileAction = PayloadAction<Partial<User> | null>;
export type ClearErrorAction = PayloadAction<void>;
export type UpdateTestCredentialsAction = PayloadAction<{ email: string; password: string }>;
export type UpdateCredentialsFromProfileAction = PayloadAction<{ email?: string; password?: string }>;

// Redux Thunk 타입
export interface ThunkApiConfig {
  rejectValue: string;
}

// Root State 타입
export interface RootState {
  auth: AuthState;
  userProfile: UserProfileState;
}

// Redux Hooks 타입
export type AppDispatch = (action: any) => any;
export type AppSelector<T> = (state: RootState) => T;
