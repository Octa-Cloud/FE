# Mong - 수면 추적 애플리케이션

TypeScript, Redux Toolkit, Tailwind CSS로 구축된 현대적인 React 기반 수면 추적 애플리케이션입니다. 이 애플리케이션은 사용자가 수면 패턴을 모니터링하고, 수면 목표를 설정하며, 건강한 수면 습관을 유지할 수 있도록 도와줍니다.

## 🚀 주요 기능

### 핵심 기능
- **사용자 인증**: 이메일 인증을 통한 안전한 로그인/회원가입
- **프로필 관리**: 개인정보를 포함한 완전한 사용자 프로필
- **수면 목표 설정**: 맞춤형 수면 시간 목표 및 취침 시간 일정
- **수면 추적**: 수면 패턴 모니터링 및 분석
- **반응형 디자인**: 현대적인 UI/UX를 적용한 모바일 우선 접근법

### 기술적 기능
- **TypeScript**: 애플리케이션 전체에 걸친 완전한 타입 안전성
- **Redux Toolkit**: 중앙화된 상태 관리
- **React Router**: 보호된 라우트를 포함한 클라이언트 사이드 라우팅
- **Tailwind CSS**: 커스텀 컴포넌트를 포함한 유틸리티 우선 스타일링
- **Local Storage**: 타입 안전한 유틸리티를 통한 영구 데이터 저장
- **폼 검증**: 실시간 피드백을 포함한 포괄적인 검증

## 📁 프로젝트 구조

```
src/mong/
├── components/          # 재사용 가능한 UI 컴포넌트
│   ├── AuthButton.tsx   # 변형을 지원하는 버튼 컴포넌트
│   ├── AuthHeader.tsx   # 인증 페이지 헤더
│   ├── AuthFooter.tsx   # 인증 페이지 푸터
│   ├── Container.tsx    # 레이아웃 컨테이너
│   ├── FormField.tsx    # 향상된 폼 입력 필드
│   ├── ShortFormField.tsx # 드롭다운용 컴팩트 폼 필드
│   ├── ProfileHeader.tsx # 드롭다운을 포함한 프로필 페이지 헤더
│   ├── ProfileStatsCard.tsx # 사용자 통계 표시
│   ├── ProfileFooter.tsx # 프로필 액션 버튼
│   └── BasicInfoForm.tsx # 프로필 편집 폼
├── hooks/              # 커스텀 React 훅
│   ├── useLocalStorage.ts # LocalStorage 관리 훅
│   ├── useFormValidation.ts # 폼 검증 훅
│   └── useSleepGoalCalculation.ts # 수면 계산 훅
├── pages/              # 페이지 컴포넌트
│   ├── Home.tsx        # 랜딩 페이지
│   ├── Login.tsx       # 로그인 페이지
│   ├── SignUp.tsx      # 회원가입 페이지
│   ├── ForgotPassword.tsx # 비밀번호 복구 페이지
│   ├── ProfileModification.tsx # 프로필 편집 페이지
│   └── SleepGoalSetting.tsx # 수면 목표 설정
├── store/              # Redux 스토어 설정
│   ├── index.ts        # 스토어 설정
│   ├── hooks.ts        # 타입이 지정된 Redux 훅
│   └── slices/         # Redux 슬라이스
│       ├── authSlice.ts # 인증 상태
│       └── userSlice.ts # 사용자 프로필 상태
├── styles/             # CSS 스타일시트
│   ├── global.css      # 전역 스타일 및 CSS 변수
│   ├── common.css      # 공통 컴포넌트 스타일
│   ├── login.css       # 인증 페이지 스타일
│   ├── signup.css      # 회원가입 페이지 스타일
│   └── profile.css     # 프로필 페이지 스타일
├── types/              # TypeScript 타입 정의
│   ├── index.ts        # 메인 타입 내보내기
│   ├── common.ts       # 공통 인터페이스
│   ├── components.ts   # 컴포넌트 prop 타입
│   ├── forms.ts        # 폼 데이터 타입
│   ├── redux.ts        # Redux 상태 타입
│   └── utils.ts        # 유틸리티 타입
└── utils/              # 유틸리티 함수
    ├── index.ts        # 유틸리티 내보내기
    ├── storage.ts      # LocalStorage 유틸리티
    ├── validation.ts   # 폼 검증 함수
    └── timeCalculation.ts # 수면 시간 계산
```

## 🛠️ 기술 스택

### 프론트엔드
- **React 18.3.1** - UI 라이브러리
- **TypeScript 5.0.0** - 타입 안전성
- **Redux Toolkit 2.9.0** - 상태 관리
- **React Router DOM 7.9.3** - 라우팅
- **Tailwind CSS 4.1.14** - 스타일링
- **Vite 5.4.20** - 빌드 도구

### 개발 도구
- **Bun** - 런타임 및 패키지 매니저
- **PostCSS** - CSS 처리
- **Autoprefixer** - CSS 벤더 접두사
- **tsup** - TypeScript 번들러

## 🚀 시작하기

### 필수 요구사항
- [Bun](https://bun.sh/) 런타임 설치
- Node.js 18+ (Bun을 사용하지 않는 경우)

### 설치

1. 저장소 클론:
```bash
git clone <repository-url>
cd FE
```

2. 의존성 설치:
```bash
bun install
```

3. 개발 서버 시작:
```bash
bun dev
```

4. 브라우저를 열고 `http://localhost:5173`으로 이동

### 사용 가능한 스크립트

```bash
# 개발
bun dev          # 개발 서버 시작
bun web          # Vite 개발 서버 시작
bun web:build    # 프로덕션 빌드
bun web:preview  # 프로덕션 빌드 미리보기

# 빌드
bun build        # TypeScript 빌드
bun build:watch  # 감시 모드로 빌드
```

## 📱 페이지 및 기능

### 인증 플로우
- **홈 페이지**: 앱 소개가 포함된 랜딩 페이지
- **로그인**: 검증을 포함한 이메일/비밀번호 인증
- **회원가입**: 이메일 인증을 포함한 다단계 등록
- **비밀번호 찾기**: 비밀번호 복구 기능

### 사용자 대시보드
- **프로필 수정**: 개인정보 편집
- **수면 목표 설정**: 취침 시간 및 기상 시간 일정 설정
- **통계 표시**: 수면 추적 지표 보기

## 🔧 컴포넌트 아키텍처

### 재사용 가능한 컴포넌트

#### AuthButton
```typescript
<AuthButton 
  variant="primary" 
  onClick={handleSubmit}
  disabled={loading}
>
  제출
</AuthButton>
```

#### FormField
```typescript
<FormField
  id="email"
  label="이메일"
  type="email"
  value={email}
  onChange={handleChange}
  required
  helperText="이메일 주소를 입력하세요"
  showPasswordToggle={true}
/>
```

#### ShortFormField
```typescript
<ShortFormField
  label="성별"
  value={gender}
  onChange={handleChange}
  options={[
    { value: '남', label: '남자' },
    { value: '여', label: '여자' }
  ]}
/>
```

### 커스텀 훅

#### useFormValidation
```typescript
const {
  errors,
  isValid,
  validateEmailField,
  validatePasswordField,
  validateForm,
  clearAllErrors
} = useFormValidation();
```

#### useLocalStorage
```typescript
const [value, setValue, removeValue] = useLocalStorage('key', initialValue);
```

#### useSleepGoalCalculation
```typescript
const {
  formData,
  calculatedSleepHours,
  calculatedWakeTime,
  handleBedtimeChange,
  handleWakeTimeChange,
  validateForm
} = useSleepGoalCalculation();
```

## 🎨 스타일링 시스템

### CSS 아키텍처
- **전역 스타일**: 테마를 위한 CSS 변수
- **컴포넌트 스타일**: 특정 컴포넌트를 위한 범위가 지정된 스타일
- **Tailwind 클래스**: 빠른 개발을 위한 유틸리티 우선 접근법
- **반응형 디자인**: 브레이크포인트별 스타일을 포함한 모바일 우선

### 테마 변수
```css
:root {
  --color-primary: #13e1c9;
  --color-secondary: #6366f1;
  --color-text-primary: #1f2937;
  --color-text-secondary: #6b7280;
  --color-background: #ffffff;
  --color-surface: #f9fafb;
  --color-border: #e5e7eb;
  --color-error: #ef4444;
}
```

## 🔒 상태 관리

### Redux 스토어 구조
```typescript
interface RootState {
  auth: {
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
  };
  user: {
    profile: User | null;
    loading: boolean;
    error: string | null;
    isEditing: boolean;
    tempProfile: Partial<User> | null;
  };
}
```

### 인증 플로우
1. 사용자가 로그인/회원가입 폼 제출
2. Redux 비동기 thunk가 인증 처리
3. 사용자 데이터가 localStorage에 저장
4. 보호된 라우트가 인증 상태에 따라 리디렉션
5. 프로필 업데이트가 컴포넌트 간 동기화

## 🧪 폼 검증

### 검증 규칙
- **이메일**: 유효한 이메일 형식 필수
- **비밀번호**: 소문자, 숫자, 특수문자를 포함한 최소 8자
- **이름**: 최소 길이를 포함한 필수 필드
- **성별**: 미리 정의된 옵션 중 하나 ('남' 또는 '여')
- **생년월일**: 연령 제한을 포함한 유효한 날짜 형식

### 실시간 검증
- 블러 시 필드별 검증
- 제출 시 폼별 검증
- 사용자 친화적인 텍스트가 포함된 오류 메시지
- 오류 상태가 포함된 시각적 피드백

## 💾 데이터 영속성

### LocalStorage 전략
- **사용자 데이터**: 현재 사용자 프로필 및 인증 상태
- **사용자 배열**: 인증을 위한 모든 등록된 사용자
- **폼 상태**: 편집 중 임시 폼 데이터
- **설정**: 사용자 환경설정 및 구성

### 스토리지 유틸리티
```typescript
// 타입 안전한 스토리지 작업
const user = userStorage.getCurrentUser();
userStorage.setCurrentUser(userData);
const users = userStorage.getUsers();
```

## 🚀 성능 최적화

### React 최적화
- **React.memo**: 불필요한 리렌더링을 방지하기 위해 모든 컴포넌트 래핑
- **useCallback**: 불필요한 리렌더링을 방지하기 위해 이벤트 핸들러 메모이제이션
- **useMemo**: 비용이 많이 드는 계산 캐싱
- **지연 로딩**: 라우트 기반 코드 분할

### 번들 최적화
- **Tree Shaking**: 사용하지 않는 코드 제거
- **코드 분할**: 라우트 기반 지연 로딩
- **자산 최적화**: 이미지 및 CSS 최적화
- **최소화**: 프로덕션 빌드 최적화

## 🔐 보안 기능

### 인증 보안
- **입력 검증**: 모든 사용자 입력 검증 및 정화
- **비밀번호 요구사항**: 강력한 비밀번호 정책 강제
- **속도 제한**: 로그인 시도 제한
- **세션 관리**: 안전한 사용자 세션 처리

### 데이터 보호
- **타입 안전성**: TypeScript가 런타임 타입 오류 방지
- **입력 정화**: 적절한 이스케이핑을 통한 XSS 방지
- **오류 처리**: 데이터 노출 없이 우아한 오류 처리

## 📱 반응형 디자인

### 브레이크포인트
- **모바일**: < 640px
- **태블릿**: 640px - 1024px
- **데스크톱**: > 1024px

### 모바일 우선 접근법
- 터치 친화적인 인터페이스 요소
- 모바일용 최적화된 폼 레이아웃
- 반응형 내비게이션 및 메뉴
- 적응형 컴포넌트 크기 조정

## 🧪 테스트 전략

### 컴포넌트 테스트
- 유틸리티 함수에 대한 단위 테스트
- 폼 검증에 대한 통합 테스트
- 중요한 사용자 플로우에 대한 E2E 테스트

### 코드 품질
- 컴파일 타임 오류 검사를 위한 TypeScript
- 코드 품질 강제를 위한 ESLint
- 일관된 코드 포맷팅을 위한 Prettier

## 🚀 배포

### 프로덕션 빌드
```bash
bun web:build
```

### 환경 구성
- 개발: `http://localhost:5173`
- 프로덕션: 정적 호스팅용 구성

### 빌드 출력
- 최적화된 JavaScript 번들
- 사용하지 않는 스타일이 제거된 최소화된 CSS
- CDN 배송용 최적화된 정적 자산

## 🤝 기여하기

### 개발 가이드라인
1. TypeScript 모범 사례 따르기
2. 의미 있는 컴포넌트 및 변수명 사용
3. 적절한 오류 처리 구현
4. 반응형이고 접근 가능한 컴포넌트 작성
5. 설정된 파일 구조 따르기

### 코드 스타일
- TypeScript 엄격 모드 사용
- React 훅 규칙 따르기
- 적절한 prop 타이핑 구현
- 의미 있는 HTML 요소 사용

## 🧪 테스트 데이터

프로젝트에는 개발 및 테스트 목적으로 포괄적인 테스트 데이터가 포함되어 있습니다.

### 테스트 사용자

애플리케이션이 시작될 때 자동으로 초기화되는 3명의 사전 정의된 테스트 사용자:

| 사용자 | 이메일 | 비밀번호 | 이름 | 성별 | 프로필 점수 | 수면 시간 |
|--------|--------|----------|------|------|-------------|-----------|
| **추민기** | `test1@gmail.com` | `password1!` | 추민기 | 남 | 85 | 7.5시간 |
| **김수면** | `sleepy@mong.com` | `sleep123!` | 김수면 | 여 | 92 | 8.2시간 |
| **박불면** | `insomnia@test.com` | `test123!` | 박불면 | 남 | 65 | 5.8시간 |

### 수면 목표

각 테스트 사용자는 서로 다른 수면 목표 패턴을 가지고 있습니다:

- **추민기**: 취침 23:00, 기상 07:00, 목표 8.0시간
- **김수면**: 취침 22:30, 기상 06:30, 목표 8.0시간
- **박불면**: 취침 01:00, 기상 07:00, 목표 6.0시간

### 개발자 콘솔 명령어

개발 모드에서는 브라우저 콘솔을 통해 테스트 데이터 유틸리티에 접근할 수 있습니다:

```javascript
// 테스트 데이터 초기화
window.testData.initialize()

// 테스트 데이터 리셋
window.testData.reset()

// 특정 사용자 데이터 가져오기
window.testData.getUser('test-user-001')
window.testData.getUserProfile('test-user-002')
window.testData.getUserSleepGoal('test-user-003')

// 이메일로 사용자 찾기
window.testData.getUserByEmail('test1@gmail.com')
```

### 데이터 구조

테스트 데이터는 각 사용자가 다음을 포함하는 통합 구조로 구성되어 있습니다:

```typescript
interface TestUser {
  // 기본 사용자 정보
  id, email, password, name, birthDate, gender, createdAt
  
  // 프로필 통계
  profile: {
    avatar, averageScore, averageSleepTime, totalDays
  }
  
  // 수면 목표
  sleepGoal: {
    targetBedtime, targetWakeTime, targetSleepHours
  }
}
```

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 있습니다. 자세한 내용은 LICENSE 파일을 참조하세요.

## 🆘 지원

지원 및 질문:
- 각 디렉토리의 README에서 컴포넌트 문서 확인
- 타입 정보는 TypeScript 인터페이스 검토
- 상태 관리는 Redux 스토어 구조 참조
- 일반적인 작업은 유틸리티 함수 참조

---

**React, TypeScript 및 현대적인 웹 기술을 사용하여 ❤️로 구축됨**
