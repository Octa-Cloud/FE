# JWT 인증 기능 구현 참고 가이드

## 📁 핵심 참고 파일들

### 1. Redux Store 구조
**파일**: `src/mong/store/index.ts`
- Redux store 설정
- RTK Query 또는 일반 Redux 설정 참고
- 미들웨어 설정 방법

### 2. 인증 상태 관리 (Redux Slice)
**파일**: `src/mong/store/slices/authSlice.ts`
- **현재 상태**: localStorage 기반 인증 (JWT 미적용)
- **참고 포인트**:
  - `createAsyncThunk`를 사용한 비동기 액션 패턴
  - `loginUser`, `registerUser` thunk 구조
  - Redux state 관리 방식
  - 에러 처리 및 로딩 상태 관리
- **JWT 적용 시 수정 필요**:
  - `accessToken`, `refreshToken` 상태 추가
  - API 호출을 axios로 변경
  - 토큰 자동 갱신 로직 추가

### 3. 타입 정의
**파일**: `src/mong/types/redux.ts`
- **AuthState 인터페이스**:
  ```typescript
  export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
    // JWT 추가 필요: accessToken, refreshToken
  }
  ```
- **참고 포인트**: 타입 안전성 확보 방법

**파일**: `src/mong/types/common.ts`
- **User 인터페이스**: 사용자 데이터 구조
- **참고 포인트**: 공통 타입 정의 방식

### 4. API 클라이언트 설정
**파일**: `src/mong/api/lib/axiosPublic.ts`
- **현재 상태**: 기본 axios 설정
- **참고 포인트**: 
  - baseURL 설정 방법
  - 공개 API용 axios 인스턴스 생성

**파일**: `src/mong/api/lib/axiosAuth.ts`
- **현재 상태**: 인증된 API용 axios 설정 (미완성)
- **참고 포인트**:
  - `authGet`, `authPost` 헬퍼 함수
  - 토큰 자동 첨부 방식
  - **JWT 적용 시 활용**: 인터셉터로 토큰 자동 관리

**파일**: `src/mong/api/features/auth/thunks.ts`
- **현재 상태**: 기본적인 로그인 thunk (미완성)
- **참고 포인트**:
  - `createAsyncThunk` 사용법
  - API 호출 후 Redux 상태 업데이트

### 5. 커스텀 훅
**파일**: `src/mong/store/hooks.ts`
- **useAuth 훅**:
  - 현재 상태 관리 방법
  - 액션 디스패치 패턴
  - 메모이제이션을 통한 성능 최적화
- **참고 포인트**: 
  - `useCallback`을 사용한 안전한 액션 디스패치
  - 타입 안전한 selector 사용법

### 6. 로컬 스토리지 관리
**파일**: `src/mong/utils/storage.ts`
- **참고 포인트**:
  - 타입 안전한 localStorage 관리
  - 에러 처리 포함한 storage 헬퍼
  - **JWT 적용 시**: 토큰 저장/관리 로직 추가 필요

## 🔧 JWT 구현 시 활용 방법

### 1. Axios 인터셉터 설정
```typescript
// src/mong/api/lib/axiosAuth.ts 참고
// 요청 인터셉터: 토큰 자동 첨부
// 응답 인터셉터: 401 에러 시 토큰 갱신
```

### 2. Redux 상태 확장
```typescript
// src/mong/types/redux.ts의 AuthState 확장
interface AuthState {
  // 기존 필드들...
  accessToken: string | null;
  refreshToken: string | null;
  isRefreshing: boolean;
}
```

### 3. 토큰 관리 유틸리티
```typescript
// src/mong/utils/tokenManager.ts 생성 필요
// - 토큰 저장/조회/삭제
// - 토큰 만료 검증
// - 자동 갱신 로직
```

### 4. API 엔드포인트 매핑
```typescript
// src/mong/api/features/auth/thunks.ts 확장
// - loginThunk: /api/users/login
// - registerThunk: /api/users/sign-up
// - refreshTokenThunk: /api/token/reissue
// - logoutThunk: /api/users/log-out
```

## 📋 구현 순서 가이드

1. **토큰 관리 유틸리티 생성** (`src/mong/utils/tokenManager.ts`)
2. **Axios 인터셉터 설정** (`src/mong/api/lib/axiosAuth.ts` 수정)
3. **Redux 상태 확장** (`src/mong/types/redux.ts` 수정)
4. **Auth Slice 업데이트** (`src/mong/store/slices/authSlice.ts` 수정)
5. **API Thunk 구현** (`src/mong/api/features/auth/thunks.ts` 완성)
6. **컴포넌트에서 사용** (`src/mong/pages/Login.tsx` 등)

## ⚠️ 주의사항

- 현재 프로젝트는 localStorage 기반 인증으로 구현되어 있음
- JWT 적용 시 기존 localStorage 로직을 토큰 기반으로 변경 필요
- `src/mong/api/lib/axiosAuth.ts`의 store import 경로 수정 필요
- CORS 설정 확인 (백엔드: 5000, 프론트엔드: 5173)
