# Hooks Directory

This directory contains custom React hooks for state management and business logic.

## Available Hooks

### useLocalStorage (`useLocalStorage.ts`)
React hook for localStorage management with synchronization:

```typescript
import { useLocalStorage, useUserStorage } from '../hooks/useLocalStorage';

// Basic localStorage hook
const [value, setValue, removeValue] = useLocalStorage('key', initialValue);

// User-specific storage hook
const {
  currentUser,
  users,
  updateCurrentUser,
  addUser,
  findUserByEmail
} = useUserStorage();
```

### useFormValidation (`useFormValidation.ts`)
Comprehensive form validation with real-time feedback:

```typescript
import { useFormValidation } from '../hooks/useFormValidation';

const {
  errors,
  isValid,
  validateEmailField,
  validatePasswordField,
  validateForm,
  clearAllErrors
} = useFormValidation();

// Validate individual fields
const handleEmailChange = (email: string) => {
  validateEmailField(email, 'email');
};

// Validate entire form
const handleSubmit = (formData) => {
  if (validateForm(formData)) {
    // Submit form
  }
};
```

### useSleepGoalCalculation (`useSleepGoalCalculation.ts`)
Sleep goal calculations with auto-updates:

```typescript
import { useSleepGoalCalculation } from '../hooks/useSleepGoalCalculation';

const {
  formData,
  calculatedSleepHours,
  calculatedWakeTime,
  handleBedtimeChange,
  handleWakeTimeChange,
  handleSleepHoursChange,
  validateForm
} = useSleepGoalCalculation();

// Auto-calculation when times change
const handleBedtime = (bedtime: string) => {
  handleBedtimeChange(bedtime);
  // Sleep hours automatically recalculated
};
```

## Features

- **Type Safety**: Full TypeScript support with proper interfaces
- **Performance**: Optimized with useCallback and useMemo where appropriate
- **Error Handling**: Built-in error states and validation
- **Reusability**: Custom hooks that can be shared across components
- **State Management**: Local state with localStorage synchronization

## Usage Examples

### Form with Validation
```typescript
import { useFormValidation } from '../hooks/useFormValidation';

const LoginForm = () => {
  const { errors, validateEmailField, validatePasswordField } = useFormValidation();
  
  return (
    <form>
      <input 
        onChange={(e) => validateEmailField(e.target.value, 'email')}
        className={errors.email ? 'error' : ''}
      />
      {errors.email && <span>{errors.email}</span>}
    </form>
  );
};
```

### User Data Management
```typescript
import { useUserStorage } from '../hooks/useLocalStorage';

const ProfilePage = () => {
  const { currentUser, updateCurrentUser } = useUserStorage();
  
  const handleUpdate = (newData) => {
    updateCurrentUser({ ...currentUser, ...newData });
  };
  
  return <div>{currentUser?.name}</div>;
};
```

### Sleep Goal Management
```typescript
import { useSleepGoalCalculation } from '../hooks/useSleepGoalCalculation';

const SleepGoalForm = () => {
  const { formData, handleBedtimeChange, calculatedSleepHours } = useSleepGoalCalculation();
  
  return (
    <div>
      <input 
        type="time"
        value={formData.targetBedtime}
        onChange={(e) => handleBedtimeChange(e.target.value)}
      />
      <span>Calculated sleep hours: {calculatedSleepHours}</span>
    </div>
  );
};
```
