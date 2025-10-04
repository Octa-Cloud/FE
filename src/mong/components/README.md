# Components Directory

This directory contains reusable React components for the application, organized with TypeScript support and performance optimizations.

## Component Structure

### UI Components
- **AuthButton.tsx** - Reusable button component with primary/secondary variants
- **Container.tsx** - Layout container with responsive width control
- **FormField.tsx** - Enhanced form input field with password toggle and status indicators
- **ShortFormField.tsx** - Compact form field for dropdowns and specialized inputs

### Authentication Components
- **AuthHeader.tsx** - Header for authentication pages with stepper support
- **AuthFooter.tsx** - Footer for authentication pages with links

### Profile Components
- **ProfileHeader.tsx** - Header with user profile dropdown menu
- **ProfileStatsCard.tsx** - Statistics display card
- **ProfileFooter.tsx** - Action buttons (Edit/Save/Cancel) for profile forms
- **BasicInfoForm.tsx** - Form for editing user profile information

## Performance Optimizations

All components are wrapped with `React.memo` for optimal re-rendering:
```typescript
const Component = React.memo<Props>(({ ... }) => {
  // Component logic
});

Component.displayName = 'Component';
export default Component;
```

## TypeScript Support

Each component has corresponding TypeScript interfaces:
- Props are fully typed with interfaces
- Default values are properly typed
- Event handlers use proper React event types

## Styling

Components use a hybrid approach:
- **Tailwind CSS**: For utility classes and responsive design
- **Custom CSS**: For complex styling and animations
- **CSS Variables**: For consistent theming

## Usage Examples

```typescript
import AuthButton from '../components/AuthButton';
import FormField from '../components/FormField';

// Primary button
<AuthButton variant="primary" onClick={handleSubmit}>
  Submit
</AuthButton>

// Form field with validation
<FormField
  id="email"
  label="Email"
  type="email"
  value={email}
  onChange={handleChange}
  required
  helperText="Enter your email address"
/>
```

## Features

- **TypeScript**: Full type safety and IntelliSense support
- **Performance**: React.memo optimization for all components
- **Accessibility**: Proper ARIA attributes and keyboard navigation
- **Responsive**: Mobile-first design with Tailwind CSS
- **Theming**: Consistent design system with CSS variables
- **Reusability**: Modular components with clear prop interfaces
