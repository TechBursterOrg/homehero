import { API_BASE_URL } from '../config';

export const logoutUser = async (token: string): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Logout failed');
    }

    // Clear any stored tokens or user data
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    
    return await response.json();
  } catch (error) {
    console.error('Logout error:', error);
    // Even if API call fails, clear local storage
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    throw error;
  }
};