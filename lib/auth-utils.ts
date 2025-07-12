// Authentication utilities for client-side route protection

export const isAuthenticated = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const token = localStorage.getItem('auth_token');
  return !!token;
};

export const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  
  return localStorage.getItem('auth_token');
};

export const removeAuthToken = (): void => {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem('auth_token');
};

export const redirectToLogin = (): void => {
  if (typeof window !== 'undefined') {
    window.location.href = '/';
  }
};

export const redirectToDashboard = (): void => {
  if (typeof window !== 'undefined') {
    window.location.href = '/dashboard';
  }
};

// Check if token is expired (basic check)
export const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    return payload.exp < currentTime;
  } catch (error) {
    return true; // If we can't parse the token, consider it expired
  }
};

// Get user info from token
export const getUserFromToken = (token: string): any => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload;
  } catch (error) {
    return null;
  }
};
