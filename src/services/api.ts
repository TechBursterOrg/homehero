import { Provider } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

export const providersAPI = {
  // Get all providers
  getProviders: async (filters?: {
    serviceType?: string;
    location?: string;
    minRating?: number;
    availability?: string;
  }): Promise<Provider[]> => {
    const queryParams = new URLSearchParams();
    
    if (filters?.serviceType) queryParams.append('serviceType', filters.serviceType);
    if (filters?.location) queryParams.append('location', filters.location);
    if (filters?.minRating) queryParams.append('minRating', filters.minRating.toString());
    if (filters?.availability) queryParams.append('availability', filters.availability);
    
    const response = await fetch(`${API_BASE_URL}/users?${queryParams.toString()}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch providers');
    }
    
    const data = await response.json();
    return data.data.users.map((user: any) => mapUserToProvider(user));
  },

  // Get provider by ID
  getProviderById: async (id: string): Promise<Provider> => {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch provider');
    }
    
    const data = await response.json();
    return mapUserToProvider(data.data.user);
  },

  // Search providers
  searchProviders: async (query: string, filters?: any): Promise<Provider[]> => {
    const queryParams = new URLSearchParams({ search: query });
    
    if (filters) {
      Object.keys(filters).forEach(key => {
        if (filters[key]) queryParams.append(key, filters[key]);
      });
    }
    
    const response = await fetch(`${API_BASE_URL}/users?${queryParams.toString()}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to search providers');
    }
    
    const data = await response.json();
    return data.data.users.map((user: any) => mapUserToProvider(user));
  },

  // Toggle favorite provider
  toggleFavorite: async (providerId: string): Promise<boolean> => {
    // This would typically interact with your favorites API endpoint
    // For now, we'll just use localStorage
    const favorites = JSON.parse(localStorage.getItem('favoriteProviders') || '[]');
    const index = favorites.indexOf(providerId);
    
    if (index === -1) {
      favorites.push(providerId);
    } else {
      favorites.splice(index, 1);
    }
    
    localStorage.setItem('favoriteProviders', JSON.stringify(favorites));
    return index === -1; // Return true if added to favorites, false if removed
  },

  // Get favorite providers
  getFavorites: async (): Promise<string[]> => {
    return JSON.parse(localStorage.getItem('favoriteProviders') || '[]');
  }
};

// Helper function to map user data to provider format
const mapUserToProvider = (user: any): Provider => {
  // Generate mock data for fields that might not exist in your user model yet
  const mockRating = Math.random() * 2 + 3; // Random rating between 3-5
  const mockReviewCount = Math.floor(Math.random() * 100) + 1;
  const responseTimes = ['within minutes', 'within an hour', 'within a few hours'];
  const priceRanges = ['$20-40/hr', '$40-60/hr', '$60-80/hr', '$80-100/hr'];
  
  return {
    id: user._id || user.id,
    _id: user._id,
    name: user.name,
    email: user.email,
    userType: user.userType,
    country: user.country,
    profileImage: user.profileImage || user.profilePicture,
    profileImageFull: user.profileImageFull,
    services: user.services || [],
    hourlyRate: user.hourlyRate,
    experience: user.experience,
    rating: user.averageRating || mockRating,
    reviewCount: user.reviewCount || mockReviewCount,
    location: user.address || `${user.country}`,
    responseTime: responseTimes[Math.floor(Math.random() * responseTimes.length)],
    priceRange: user.priceRange || priceRanges[Math.floor(Math.random() * priceRanges.length)],
    completedJobs: user.completedJobs || Math.floor(Math.random() * 50) + 1,
    isVerified: user.isEmailVerified || Math.random() > 0.3, // 70% verified
    isTopRated: user.averageRating > 4.5 || Math.random() > 0.7, // 30% top rated
    isAvailableNow: user.availability && user.availability.length > 0 || Math.random() > 0.4, // 60% available
    phoneNumber: user.phoneNumber,
    certifications: user.certifications,
    availability: user.availability
  };
};