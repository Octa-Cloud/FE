# Profile Modification Components

This directory contains React components for the personal information modification page, designed to match the Figma design specifications.

## Components

### ProfileHeader.jsx
Header component with navigation and user profile information.
- **Props:**
  - `onBack`: Function to handle back button click
  - `onStartSleepRecord`: Function to handle sleep recording start
  - `userProfile`: Object containing user name and avatar

### ProfileStatsCard.jsx
Card component displaying user statistics and profile information.
- **Props:**
  - `userData`: Object containing user information and statistics
    - `name`: User's name
    - `email`: User's email
    - `avatar`: User's avatar character
    - `averageScore`: Average sleep score
    - `averageSleepTime`: Average sleep time in hours
    - `totalDays`: Total measurement days

### BasicInfoForm.jsx
Form component for editing basic user information.
- **Props:**
  - `userData`: Current user data object
  - `onSave`: Function called when form is submitted with updated data

## Styling

All components use CSS modules with a dark theme design that matches the Figma specifications:
- **Primary Color:** #00C896 (teal/cyan)
- **Background:** #0F0F0F (dark)
- **Card Background:** #2C2C2C (darker gray)
- **Text:** White and light gray variants
- **Borders:** #404040 (medium gray)

## Usage

```jsx
import ProfileModification from '../pages/ProfileModification';

// Navigate to /profile to see the page
```

## Features

- Responsive design for mobile and desktop
- Dark theme matching Figma design
- Form validation and state management
- Accessible form controls
- Consistent styling with the rest of the application
