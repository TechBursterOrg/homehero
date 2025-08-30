// hooks/useAuth.ts
export const useAuth = () => {
  const getToken = () => {
    return localStorage.getItem('authToken') || localStorage.getItem('token');
  };

  const isAuthenticated = () => {
    return !!getToken();
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    window.location.href = '/login';
  };

  return { getToken, isAuthenticated, logout };
};