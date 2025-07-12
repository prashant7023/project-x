'use client';

import { useEffect, useState } from 'react';
import { isAuthenticated, redirectToLogin, redirectToDashboard } from '@/lib/auth-utils';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean; // true = requires login, false = requires logout
  fallback?: React.ReactNode;
}

export default function ProtectedRoute({ 
  children, 
  requireAuth = true, 
  fallback = null 
}: ProtectedRouteProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const authenticated = isAuthenticated();
      
      if (requireAuth) {
        // Route requires authentication
        if (!authenticated) {
          redirectToLogin();
          return;
        }
        setHasAccess(true);
      } else {
        // Route requires NO authentication (login page)
        if (authenticated) {
          redirectToDashboard();
          return;
        }
        setHasAccess(true);
      }
      
      setIsLoading(false);
    };

    // Add a small delay to prevent flash
    const timer = setTimeout(checkAuth, 100);
    
    return () => clearTimeout(timer);
  }, [requireAuth]);

  if (isLoading) {
    return (
      fallback || (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-lg text-slate-600">Loading...</p>
          </div>
        </div>
      )
    );
  }

  if (!hasAccess) {
    return null; // Will redirect, so don't render anything
  }

  return <>{children}</>;
}
