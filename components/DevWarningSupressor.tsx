'use client';

import { useEffect } from 'react';

/**
 * Development helper component to suppress browser extension warnings
 * This should only be used in development mode
 */
export default function DevWarningSupressor() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;

    const originalError = console.error;
    const originalWarn = console.warn;

    console.error = (...args) => {
      const message = args.join(' ');
      
      // Filter out hydration warnings caused by browser extensions
      if (
        message.includes('Extra attributes from the server') ||
        message.includes('cz-shortcut-listen') ||
        message.includes('data-new-gr-c-s-check-loaded') ||
        message.includes('data-gr-ext-installed') ||
        message.includes('data-gramm') ||
        message.includes('data-lt-installed')
      ) {
        return; // Suppress the warning
      }
      
      originalError.apply(console, args);
    };

    console.warn = (...args) => {
      const message = args.join(' ');
      
      // Filter out hydration warnings caused by browser extensions
      if (
        message.includes('Extra attributes from the server') ||
        message.includes('cz-shortcut-listen') ||
        message.includes('data-new-gr-c-s-check-loaded') ||
        message.includes('data-gr-ext-installed') ||
        message.includes('data-gramm') ||
        message.includes('data-lt-installed')
      ) {
        return; // Suppress the warning
      }
      
      originalWarn.apply(console, args);
    };

    return () => {
      console.error = originalError;
      console.warn = originalWarn;
    };
  }, []);

  return null; // This component doesn't render anything
}
