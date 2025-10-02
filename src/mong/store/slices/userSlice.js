import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// 사용자 정보 업데이트 비동기 액션
export const updateUserProfile = createAsyncThunk(
  'user/updateUserProfile',
  async (userData, { rejectWithValue, getState }) => {
    try {
      // 실제 API 호출 대신 로컬 스토리지 업데이트
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        const updatedUser = {
          ...user,
          ...userData,
          updatedAt: new Date().toISOString(),
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        // 이메일이나 비밀번호가 변경된 경우 auth state의 testCredentials도 업데이트
        const state = getState();
        const authState = state.auth;
        
        if (userData.email && userData.email !== authState.testCredentials.email) {
          // 이메일이 변경된 경우 testCredentials 업데이트
          return { ...updatedUser, credentialsUpdated: true, newCredentials: { email: userData.email, password: userData.password || authState.testCredentials.password } };
        } else if (userData.password && userData.password !== authState.testCredentials.password) {
          // 비밀번호가 변경된 경우 testCredentials 업데이트
          return { ...updatedUser, credentialsUpdated: true, newCredentials: { email: authState.testCredentials.email, password: userData.password } };
        }
        
        return updatedUser;
      }
      throw new Error('User not found');
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
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
    setProfile: (state, action) => {
      // 이미 같은 프로필이면 업데이트하지 않음
      if (!state.profile || JSON.stringify(state.profile) !== JSON.stringify(action.payload)) {
        state.profile = action.payload;
      }
    },
    setEditing: (state, action) => {
      // 이미 같은 편집 상태면 업데이트하지 않음
      if (state.isEditing !== action.payload) {
        state.isEditing = action.payload;
      }
    },
    clearError: (state) => {
      state.error = null;
    },
    // 프로필 수정을 위한 임시 데이터 설정
    setTempProfile: (state, action) => {
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
        state.error = action.payload;
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
