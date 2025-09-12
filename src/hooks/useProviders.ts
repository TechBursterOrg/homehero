import { useState, useEffect } from 'react';
import { Provider, ServiceType } from '../types';
import { providersAPI } from '../services/api';

export const useProviders = (serviceType: ServiceType, filters?: any) => {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    loadProviders();
    loadFavorites();
  }, [serviceType, filters]);

  const loadProviders = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Convert serviceType to match your backend if needed
      const backendFilters = {
        ...filters,
        userType: 'provider', // Only get providers
        serviceType: serviceType === 'immediate' ? undefined : serviceType
      };
      
      const data = await providersAPI.getProviders(backendFilters);
      setProviders(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load providers');
      console.error('Error loading providers:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadFavorites = async () => {
    try {
      const favoriteIds = await providersAPI.getFavorites();
      setFavorites(favoriteIds);
    } catch (err) {
      console.error('Error loading favorites:', err);
    }
  };

  const toggleFavorite = async (providerId: string) => {
    try {
      const isNowFavorite = await providersAPI.toggleFavorite(providerId);
      
      if (isNowFavorite) {
        setFavorites(prev => [...prev, providerId]);
      } else {
        setFavorites(prev => prev.filter(id => id !== providerId));
      }
      
      return isNowFavorite;
    } catch (err) {
      console.error('Error toggling favorite:', err);
      throw err;
    }
  };

  const refresh = () => {
    loadProviders();
    loadFavorites();
  };

  return {
    providers,
    loading,
    error,
    favorites,
    toggleFavorite,
    refresh
  };
};