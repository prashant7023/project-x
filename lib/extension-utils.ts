import { useEffect } from 'react';
import React from 'react';

/**
 * Hook to suppress console warnings from browser extensions
 * This helps clean up development console from extension-related hydration warnings
 */
export function useSuppressExtensionWarnings() {
  useEffect(() => {
    // Store original console.warn
    const originalWarn = console.warn;
    
    // Override console.warn to filter out extension-related warnings
    console.warn = (...args) => {
      const message = args.join(' ');
      
      // List of known browser extension attributes that cause hydration warnings
      const extensionWarnings = [
        'cz-shortcut-listen',
        'data-new-gr-c-s-check-loaded',
        'data-gr-ext-installed',
        'data-gramm',
        'data-lt-installed',
        '__react_devtools_global_hook__'
      ];
      
      // Check if this is an extension-related warning
      const isExtensionWarning = extensionWarnings.some(warning => 
        message.includes(warning)
      );
      
      // Only show warning if it's not extension-related
      if (!isExtensionWarning) {
        originalWarn.apply(console, args);
      }
    };
    
    // Cleanup: restore original console.warn when component unmounts
    return () => {
      console.warn = originalWarn;
    };
  }, []);
}

/**
 * Custom error boundary for development to handle extension-related errors
 */
export class ExtensionErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  
  static getDerivedStateFromError(error: Error) {
    // Check if error is extension-related
    if (error.message.includes('cz-shortcut-listen') || 
        error.message.includes('Extra attributes from the server')) {
      return { hasError: false }; // Don't treat as error
    }
    return { hasError: true };
  }
  
  render() {
    if (this.state.hasError) {
      return React.createElement('div', null, 'Something went wrong.');
    }
    
    return this.props.children;
  }
}
