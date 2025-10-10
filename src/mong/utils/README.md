# Utils Directory

This directory contains utility functions and helpers for the application, organized by functionality.

## Structure

### Storage Utilities (`storage.ts`)
Type-safe localStorage management with error handling:

```typescript
import { storage, userStorage } from '../utils/storage';

// Basic storage operations
const data = storage.get('key', { defaultValue: [] });
storage.set('key', value);
storage.remove('key');

// User-specific storage helpers
const currentUser = userStorage.getCurrentUser();
userStorage.setCurrentUser(user);
const users = userStorage.getUsers();
userStorage.setUsers(users);
```

### Validation Utilities (`validation.ts`)
Comprehensive form validation functions:

```typescript
import { 
  validateEmail, 
  validatePassword, 
  validateName,
  validateRequiredFields 
} from '../utils/validation';

// Email validation
const emailResult = validateEmail('user@example.com');

// Password validation with complexity check
const passwordResult = validatePassword('password123!');

// Complete form validation
const formResult = validateRequiredFields({
  email: 'user@example.com',
  name: 'John Doe',
  // ... other fields
});
```

### Time Calculation Utilities (`timeCalculation.ts`)
Sleep-related time calculations and conversions:

```typescript
import { 
  calculateSleepHours, 
  calculateWakeTime,
  convertTo12Hour,
  convertTo24Hour 
} from '../utils/timeCalculation';

// Calculate sleep hours from bedtime and wake time
const sleepHours = calculateSleepHours('23:00', '07:00'); // 8

// Calculate wake time from bedtime and sleep hours
const wakeTime = calculateWakeTime('23:00', 8); // '07:00'

// Time format conversions
const time12 = convertTo12Hour('15:30'); // { time: '03:30', ampm: 'PM' }
const time24 = convertTo24Hour('03:30', 'PM'); // '15:30'
```

## Features

- **Type Safety**: Full TypeScript support with proper interfaces
- **Error Handling**: Comprehensive error catching and logging
- **Performance**: Optimized functions with minimal overhead
- **Reusability**: Modular functions that can be used across components
- **Testing**: Pure functions that are easy to unit test

## Usage in Components

```typescript
import { userStorage } from '../utils/storage';
import { validateEmail } from '../utils/validation';

// In a React component
const handleSubmit = () => {
  // Validate form data
  const emailValidation = validateEmail(email);
  if (!emailValidation.isValid) {
    setError(emailValidation.message);
    return;
  }
  
  // Save to storage
  userStorage.setCurrentUser(userData);
};
```
