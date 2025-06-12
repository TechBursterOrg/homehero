export interface Service {
  id: string;
  name: string;
  description: string;
  icon: string;
  averagePrice: string;
  providers: number;
}

export interface Provider {
  id: string;
  name: string;
  rating: number;
  reviewCount: number;
  services: string[];
  location: string;
  priceRange: string;
  responseTime: string;
  isVerified: boolean;
  isTopRated: boolean;
  avatar: string;
  completedJobs: number;
  isAvailableNow?: boolean;
  coordinates: [number, number]; // [latitude, longitude]
  distance?: number; // distance from user in miles
}

export interface Booking {
  id: string;
  provider: string;
  service: string;
  date: string;
  time: string;
  status: 'upcoming' | 'in-progress' | 'completed' | 'cancelled';
  price: string;
}

export interface JobPost {
  id: string;
  title: string;
  description: string;
  budget: string;
  duration: string;
  proposals: number;
  status: 'open' | 'in-progress' | 'completed';
  datePosted: string;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  address: string;
  bio: string;
  avatar: string | null;
}

export interface LocationData {
  address: string;
  coordinates: [number, number];
}

export type ServiceType = 'immediate' | 'long-term';
export type ActiveTab = 'services' | 'bookings' | 'jobs' | 'favorites' | 'profile';