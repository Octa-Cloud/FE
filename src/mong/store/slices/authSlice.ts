import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User, LoginCredentials, RegisterData } from '../../types';
import { AuthState } from '../../types/redux';
import { userStorage } from '../../utils/storage';
import { authAPI } from '../../api/auth';

// 비동기 액션들
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials: LoginCredentials, { rejectWithValue, getState }) => {
    try {
      // 입력값 검증
      if (!credentials.email || !credentials.password) {
        throw new Error('이메일과 비밀번호를 모두 입력해주세요.');
      }

      // 로그인 시도 횟수 제한 확인
      const state = getState() as { auth: AuthState };
      const { loginAttempts, lastLoginAttempt } = state.auth;
      
      // 5분 내에 5회 이상 실패한 경우 차단
      if (loginAttempts >= 5) {
        const now = Date.now();
        const timeDiff = now - (lastLoginAttempt ? parseInt(lastLoginAttempt) : 0);
        const fiveMinutes = 5 * 60 * 1000;
        
        if (timeDiff < fiveMinutes) {
          throw new Error('로그인 시도 횟수가 너무 많습니다. 5분 후에 다시 시도해주세요.');
        }
      }
      
      // 보안을 위한 인위적 지연 (브루트 포스 공격 방지)
      if (loginAttempts > 0) {
        const delay = Math.min(loginAttempts * 1000, 5000); // 최대 5초까지 지연
        await new Promise(resolve => setTimeout(resolve, delay));
      }

      console.log('🔑 API 서버로 로그인 요청:', credentials);
      
      // 실제 API 서버로 로그인 요청
      const response = await authAPI.login(credentials);
      console.log('📡 API 응답:', response);
      
      // 토큰을 localStorage에 저장
      localStorage.setItem('accessToken', response.result.accessToken);
      localStorage.setItem('refreshToken', response.result.refreshToken);
      
      // 사용자 정보 구성 (API에서 사용자 정보를 반환하지 않는 경우)
      const user: User = {
        id: 'api-user', // API에서 사용자 ID를 반환하지 않으므로 임시 ID
        email: credentials.email,
        password: credentials.password, // 보안상 실제로는 저장하지 않아야 함
        name: 'API 사용자',
        birthDate: '',
        gender: '',
        createdAt: new Date().toISOString(),
      };
      
      console.log('✅ 로그인 성공 - 사용자 정보:', user);
      return user;
      
    } catch (error: any) {
      console.error('Login API error:', error);
      
      // API 에러 응답 처리
      if (error.response?.data?.message) {
        return rejectWithValue(error.response.data.message);
      } else if (error.message) {
        return rejectWithValue(error.message);
      } else {
        return rejectWithValue('로그인에 실패했습니다.');
      }
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData: RegisterData, { rejectWithValue }) => {
    try {
      // 기존 사용자 목록 가져오기
      const existingUsers: User[] = userStorage.getUsers() || [];
      
      // 이메일 중복 확인
      const emailExists = existingUsers.some(user => user.email === userData.email);
      if (emailExists) {
        throw new Error('이미 등록된 이메일입니다.');
      }
      
      // 새 사용자 생성
      const newUser: User = {
        id: Date.now().toString(),
        email: userData.email,
        password: userData.password,
        name: userData.name,
        birthDate: userData.birthDate,
        gender: userData.gender,
        createdAt: new Date().toISOString(),
      };
      
      // 사용자 목록에 추가
      existingUsers.push(newUser);
      userStorage.setUsers(existingUsers);
      
      // 현재 로그인된 사용자로 설정
      userStorage.setCurrentUser(newUser);
      
      return newUser;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  // 회원가입 후에만 설정되는 테스트 자격증명
  testCredentials: {
    email: '',
    password: ''
  },
  // 로그인 시도 횟수 제한
  loginAttempts: 0,
  lastLoginAttempt: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      // 사용자 목록은 유지하고 현재 로그인된 사용자 정보만 제거
      userStorage.removeCurrentUser();
    },
    clearError: (state) => {
      state.error = null;
    },
    updateTestCredentials: (state, action: PayloadAction<{ email: string; password: string }>) => {
      state.testCredentials = action.payload;
    },
    // 프로필 수정 시 자격증명 업데이트
    updateCredentialsFromProfile: (state, action: PayloadAction<{ email?: string; password?: string }>) => {
      const { email, password } = action.payload;
      if (email) state.testCredentials.email = email;
      if (password) state.testCredentials.password = password;
    },
    // 로그인 시도 횟수 초기화
    resetLoginAttempts: (state) => {
      state.loginAttempts = 0;
      state.lastLoginAttempt = null;
    },
    // 로컬 스토리지에서 사용자 정보 복원
    restoreUser: (state) => {
      const storedUser = userStorage.getCurrentUser();
      if (storedUser) {
        try {
          const user: User = storedUser;
          // 사용자 목록에서 해당 사용자가 여전히 존재하는지 확인
          const storedUsers = userStorage.getUsers() || [];
          if (storedUsers.length > 0) {
            const users: User[] = storedUsers;
            const userExists = users.find(u => u.id === user.id && u.email === user.email);
            if (userExists) {
              // 이미 같은 사용자 정보가 있으면 업데이트하지 않음
              if (!state.user || state.user.id !== user.id || state.user.email !== user.email) {
                state.user = user;
                state.isAuthenticated = true;
              }
            } else {
              // 사용자가 더 이상 존재하지 않으면 로그아웃
              userStorage.removeCurrentUser();
              state.user = null;
              state.isAuthenticated = false;
            }
          }
        } catch (error) {
          console.error('Failed to parse stored user:', error);
          // 잘못된 데이터는 제거
          userStorage.removeCurrentUser();
        }
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // 로그인
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
        
        // 🔑 핵심 수정: 로그인 성공 시 localStorage.user 설정
        userStorage.setCurrentUser(action.payload);
        console.log('💾 로그인 성공 - localStorage.user 설정:', action.payload);
        
        // 로그인 성공 시 테스트 자격증명 업데이트
        state.testCredentials = {
          email: action.payload.email,
          password: action.payload.password
        };
        // 로그인 성공 시 시도 횟수 초기화
        state.loginAttempts = 0;
        state.lastLoginAttempt = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
        // 로그인 실패 시 시도 횟수 증가
        state.loginAttempts += 1;
        state.lastLoginAttempt = Date.now().toString();
      })
      // 회원가입
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
        
        // 🔑 핵심 수정: 회원가입 성공 시 localStorage.user 설정
        userStorage.setCurrentUser(action.payload);
        console.log('💾 회원가입 성공 - localStorage.user 설정:', action.payload);
        
        // 회원가입 성공 시 테스트 자격증명 업데이트
        state.testCredentials = {
          email: action.payload.email,
          password: action.payload.password
        };
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      });
  },
});

export const { logout, clearError, updateTestCredentials, updateCredentialsFromProfile, resetLoginAttempts, restoreUser } = authSlice.actions;
export default authSlice.reducer;
