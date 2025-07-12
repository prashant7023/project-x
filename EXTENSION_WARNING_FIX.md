# Browser Extension Hydration Warning Fix

## Problem
Next.js was showing hydration warnings about "Extra attributes from the server" specifically mentioning `cz-shortcut-listen` attribute. This is caused by browser extensions (like Grammarly, language translators, or other Chrome extensions) that inject DOM attributes after the page loads.

## Solution Implemented

### 1. Layout Level Suppression (`app/layout.tsx`)
- Added `suppressHydrationWarning` to both `<html>` and `<body>` tags
- This prevents React from warning about mismatches between server and client rendering for these elements

### 2. Development Warning Suppressor (`components/DevWarningSupressor.tsx`)
- Created a client-component that runs only in development mode
- Intercepts `console.error` and `console.warn` to filter out extension-related warnings
- Automatically restores original console methods on cleanup

### 3. Next.js Configuration (`next.config.js`)
- Added `reactStrictMode: true` for better development experience
- Added experimental `suppressHydrationWarning: true`
- Added webpack configuration to filter warnings

### 4. Utility Hook (`lib/extension-utils.ts`)
- Created `useSuppressExtensionWarnings()` hook for selective use in components
- Created `ExtensionErrorBoundary` for handling extension-related errors
- Can be used in specific components that need this functionality

## Files Modified
- `app/layout.tsx` - Added hydration warning suppression
- `app/page.tsx` - Added conditional warning suppression hook
- `next.config.js` - Added React strict mode and webpack config
- `components/DevWarningSupressor.tsx` - New component for dev warning suppression
- `lib/extension-utils.ts` - New utility functions and hooks

## Known Extension Attributes Handled
- `cz-shortcut-listen` (translation/language extensions)
- `data-new-gr-c-s-check-loaded` (Grammarly)
- `data-gr-ext-installed` (Grammarly)
- `data-gramm` (Grammarly)
- `data-lt-installed` (LanguageTool)

## Usage
The fix is now automatically applied globally. For new components that might need specific handling:

```tsx
import { useSuppressExtensionWarnings } from '@/lib/extension-utils';

export default function MyComponent() {
  // Only in development
  if (process.env.NODE_ENV === 'development') {
    useSuppressExtensionWarnings();
  }
  
  return <div>My component</div>;
}
```

## Note
This solution maintains important React hydration warnings while specifically filtering out browser extension-related false positives. The warnings are only suppressed in development mode to maintain debugging capabilities in production.
