# Mong - Sleep Tracking Application

A modern React-based sleep tracking application built with TypeScript, Redux Toolkit, and Tailwind CSS. This application helps users monitor their sleep patterns, set sleep goals, and maintain healthy sleep habits.

## 🚀 Features

### Core Functionality
- **User Authentication**: Secure login/signup with email verification
- **Profile Management**: Complete user profile with personal information
- **Sleep Goal Setting**: Customizable sleep time targets and bedtime schedules
- **Sleep Tracking**: Monitor and analyze sleep patterns
- **Responsive Design**: Mobile-first approach with modern UI/UX

### Technical Features
- **TypeScript**: Full type safety throughout the application
- **Redux Toolkit**: Centralized state management
- **React Router**: Client-side routing with protected routes
- **Tailwind CSS**: Utility-first styling with custom components
- **Local Storage**: Persistent data storage with type-safe utilities
- **Form Validation**: Comprehensive validation with real-time feedback

## 📁 Project Structure

```
src/mong/
├── components/          # Reusable UI components
│   ├── AuthButton.tsx   # Button component with variants
│   ├── AuthHeader.tsx   # Authentication page header
│   ├── AuthFooter.tsx   # Authentication page footer
│   ├── Container.tsx    # Layout container
│   ├── FormField.tsx    # Enhanced form input field
│   ├── ShortFormField.tsx # Compact form field for dropdowns
│   ├── ProfileHeader.tsx # Profile page header with dropdown
│   ├── ProfileStatsCard.tsx # User statistics display
│   ├── ProfileFooter.tsx # Profile action buttons
│   └── BasicInfoForm.tsx # Profile editing form
├── hooks/              # Custom React hooks
│   ├── useLocalStorage.ts # LocalStorage management hook
│   ├── useFormValidation.ts # Form validation hook
│   └── useSleepGoalCalculation.ts # Sleep calculation hook
├── pages/              # Page components
│   ├── Home.tsx        # Landing page
│   ├── Login.tsx       # Login page
│   ├── SignUp.tsx      # Registration page
│   ├── ForgotPassword.tsx # Password recovery page
│   ├── ProfileModification.tsx # Profile editing page
│   └── SleepGoalSetting.tsx # Sleep goal configuration
├── store/              # Redux store configuration
│   ├── index.ts        # Store setup
│   ├── hooks.ts        # Typed Redux hooks
│   └── slices/         # Redux slices
│       ├── authSlice.ts # Authentication state
│       └── userSlice.ts # User profile state
├── styles/             # CSS stylesheets
│   ├── global.css      # Global styles and CSS variables
│   ├── common.css      # Common component styles
│   ├── login.css       # Authentication page styles
│   ├── signup.css      # Registration page styles
│   └── profile.css     # Profile page styles
├── types/              # TypeScript type definitions
│   ├── index.ts        # Main type exports
│   ├── common.ts       # Common interfaces
│   ├── components.ts   # Component prop types
│   ├── forms.ts        # Form data types
│   ├── redux.ts        # Redux state types
│   └── utils.ts        # Utility types
└── utils/              # Utility functions
    ├── index.ts        # Utility exports
    ├── storage.ts      # LocalStorage utilities
    ├── validation.ts   # Form validation functions
    └── timeCalculation.ts # Sleep time calculations
```

## 🛠️ Technology Stack

### Frontend
- **React 18.3.1** - UI library
- **TypeScript 5.0.0** - Type safety
- **Redux Toolkit 2.9.0** - State management
- **React Router DOM 7.9.3** - Routing
- **Tailwind CSS 4.1.14** - Styling
- **Vite 5.4.20** - Build tool

### Development Tools
- **Bun** - Runtime and package manager
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixes
- **tsup** - TypeScript bundler

## 🚀 Getting Started

### Prerequisites
- [Bun](https://bun.sh/) runtime installed
- Node.js 18+ (if not using Bun)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd FE
```

2. Install dependencies:
```bash
bun install
```

3. Start the development server:
```bash
bun dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Available Scripts

```bash
# Development
bun dev          # Start development server
bun web          # Start Vite development server
bun web:build    # Build for production
bun web:preview  # Preview production build

# Building
bun build        # Build TypeScript
bun build:watch  # Build with watch mode
```

## 📱 Pages & Features

### Authentication Flow
- **Home Page**: Landing page with app introduction
- **Login**: Email/password authentication with validation
- **Sign Up**: Multi-step registration with email verification
- **Forgot Password**: Password recovery functionality

### User Dashboard
- **Profile Modification**: Edit personal information
- **Sleep Goal Setting**: Configure bedtime and wake-up schedules
- **Statistics Display**: View sleep tracking metrics

## 🔧 Component Architecture

### Reusable Components

#### AuthButton
```typescript
<AuthButton 
  variant="primary" 
  onClick={handleSubmit}
  disabled={loading}
>
  Submit
</AuthButton>
```

#### FormField
```typescript
<FormField
  id="email"
  label="Email"
  type="email"
  value={email}
  onChange={handleChange}
  required
  helperText="Enter your email address"
  showPasswordToggle={true}
/>
```

#### ShortFormField
```typescript
<ShortFormField
  label="Gender"
  value={gender}
  onChange={handleChange}
  options={[
    { value: '남', label: '남자' },
    { value: '여', label: '여자' }
  ]}
/>
```

### Custom Hooks

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

## 🎨 Styling System

### CSS Architecture
- **Global Styles**: CSS variables for theming
- **Component Styles**: Scoped styles for specific components
- **Tailwind Classes**: Utility-first approach for rapid development
- **Responsive Design**: Mobile-first with breakpoint-specific styles

### Theme Variables
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

## 🔒 State Management

### Redux Store Structure
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

### Authentication Flow
1. User submits login/signup form
2. Redux async thunk processes authentication
3. User data stored in localStorage
4. Protected routes redirect based on auth state
5. Profile updates sync across components

## 🧪 Form Validation

### Validation Rules
- **Email**: Valid email format required
- **Password**: Minimum 8 characters with lowercase, number, and special character
- **Name**: Required field with minimum length
- **Gender**: Must be one of the predefined options ('남' or '여')
- **Birth Date**: Valid date format with age restrictions

### Real-time Validation
- Field-level validation on blur
- Form-level validation on submit
- Error messages with user-friendly text
- Visual feedback with error states

## 💾 Data Persistence

### LocalStorage Strategy
- **User Data**: Current user profile and authentication state
- **Users Array**: All registered users for authentication
- **Form State**: Temporary form data during editing
- **Settings**: User preferences and configurations

### Storage Utilities
```typescript
// Type-safe storage operations
const user = userStorage.getCurrentUser();
userStorage.setCurrentUser(userData);
const users = userStorage.getUsers();
```

## 🚀 Performance Optimizations

### React Optimizations
- **React.memo**: All components wrapped for optimal re-rendering
- **useCallback**: Event handlers memoized to prevent unnecessary re-renders
- **useMemo**: Expensive calculations cached
- **Lazy Loading**: Route-based code splitting

### Bundle Optimization
- **Tree Shaking**: Unused code elimination
- **Code Splitting**: Route-based lazy loading
- **Asset Optimization**: Image and CSS optimization
- **Minification**: Production builds optimized

## 🔐 Security Features

### Authentication Security
- **Input Validation**: All user inputs validated and sanitized
- **Password Requirements**: Strong password policies enforced
- **Rate Limiting**: Login attempt restrictions
- **Session Management**: Secure user session handling

### Data Protection
- **Type Safety**: TypeScript prevents runtime type errors
- **Input Sanitization**: XSS prevention through proper escaping
- **Error Handling**: Graceful error handling without data exposure

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

### Mobile-First Approach
- Touch-friendly interface elements
- Optimized form layouts for mobile
- Responsive navigation and menus
- Adaptive component sizing

## 🧪 Testing Strategy

### Component Testing
- Unit tests for utility functions
- Integration tests for form validation
- E2E tests for critical user flows

### Code Quality
- TypeScript for compile-time error checking
- ESLint for code quality enforcement
- Prettier for consistent code formatting

## 🚀 Deployment

### Production Build
```bash
bun web:build
```

### Environment Configuration
- Development: `http://localhost:5173`
- Production: Configured for static hosting

### Build Output
- Optimized JavaScript bundles
- Minified CSS with purged unused styles
- Static assets optimized for CDN delivery

## 🤝 Contributing

### Development Guidelines
1. Follow TypeScript best practices
2. Use meaningful component and variable names
3. Implement proper error handling
4. Write responsive, accessible components
5. Follow the established file structure

### Code Style
- Use TypeScript strict mode
- Follow React hooks rules
- Implement proper prop typing
- Use semantic HTML elements

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Check the component documentation in each directory's README
- Review the TypeScript interfaces for type information
- Examine the Redux store structure for state management
- Refer to the utility functions for common operations

---

**Built with ❤️ using React, TypeScript, and modern web technologies**
