import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User, UpdateProfileData } from '../../types';
import { UserProfileState } from '../../types/redux';
import { userStorage } from '../../utils/storage';

// 사용자 정보 업데이트 비동기 액션
export const updateUserProfile = createAsyncThunk(
  'user/updateUserProfile',
  async (userData: UpdateProfileData, { rejectWithValue, getState }) => {
    try {
      console.log('🔄 updateUserProfile 시작, userData:', userData);
      
      // 현재 로그인된 사용자 가져오기
      const currentUser = userStorage.getCurrentUser();
      console.log('👤 현재 사용자:', currentUser);
      
      // localStorage 전체 상태 확인
      console.log('🔍 localStorage 전체 상태:');
      console.log('  - user:', userStorage.getCurrentUser());
      console.log('  - users:', userStorage.getUsers());
      
      if (!currentUser) {
        // Redux state에서 현재 사용자 정보 확인 시도
        const state = getState() as { auth: { user: User | null } };
        const authUser = state.auth.user;
        console.log('🔄 Redux auth state에서 사용자 확인:', authUser);
        
        if (authUser) {
          console.log('💾 Redux state에서 사용자 정보를 localStorage에 복원');
          userStorage.setCurrentUser(authUser);
          return { ...authUser, ...userData, updatedAt: new Date().toISOString() } as User;
        }
        
        throw new Error('User not found - 현재 로그인된 사용자가 없습니다. 다시 로그인해주세요.');
      }
      
      // currentUser는 이미 파싱된 객체이므로 JSON.parse 불필요
      const user: User = currentUser as User;
      console.log('📝 사용자 정보:', user);
      
      // 사용자 정보 업데이트
      const updatedUser: User = {
        ...user,
        ...userData,
        updatedAt: new Date().toISOString(),
      } as User;
      console.log('✅ 업데이트된 사용자 정보:', updatedUser);
      
      // localStorage에 업데이트된 사용자 저장
      userStorage.setCurrentUser(updatedUser);
      console.log('💾 localStorage.user 업데이트 완료');
      
      // users 배열에서도 해당 사용자 정보 업데이트
      const users: User[] = userStorage.getUsers() || [];
      const userIndex = users.findIndex(u => u.id === user.id || u.email === user.email);
      
      if (userIndex !== -1) {
        users[userIndex] = updatedUser;
        userStorage.setUsers(users);
        console.log('👥 localStorage.users 배열 업데이트 완료');
      } else {
        console.warn('⚠️ users 배열에서 사용자를 찾을 수 없음');
      }
      
      console.log('🎉 프로필 업데이트 성공:', updatedUser);
      return updatedUser;
      
    } catch (error) {
      console.error('❌ 프로필 업데이트 실패:', error);
      return rejectWithValue((error as Error).message);
    }
  }
);

const initialState: UserProfileState = {
  profile: null,
  loading: false,
  error: null,
  isEditing: false,
  tempProfile: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setProfile: (state, action: PayloadAction<User | null>) => {
      // 이미 같은 프로필이면 업데이트하지 않음
      if (!state.profile || JSON.stringify(state.profile) !== JSON.stringify(action.payload)) {
        state.profile = action.payload;
      }
    },
    setEditing: (state, action: PayloadAction<boolean>) => {
      // 이미 같은 편집 상태면 업데이트하지 않음
      if (state.isEditing !== action.payload) {
        state.isEditing = action.payload;
      }
    },
    clearError: (state) => {
      state.error = null;
    },
    // 프로필 수정을 위한 임시 데이터 설정
    setTempProfile: (state, action: PayloadAction<Partial<User> | null>) => {
      state.tempProfile = action.payload;
    },
    clearTempProfile: (state) => {
      state.tempProfile = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
        state.error = null;
        state.isEditing = false;
        state.tempProfile = null;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { 
  setProfile, 
  setEditing, 
  clearError, 
  setTempProfile, 
  clearTempProfile 
} = userSlice.actions;
export default userSlice.reducer;
