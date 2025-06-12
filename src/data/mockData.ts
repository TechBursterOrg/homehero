import { Service, Provider, Booking, JobPost } from '../types';

export const services: Service[] = [
  {
    id: '1',
    name: 'House Cleaning',
    description: 'Professional residential cleaning services',
    icon: '🏠',
    averagePrice: '$25-40/hr',
    providers: 127
  },
  {
    id: '2',
    name: 'Plumbing',
    description: 'Repairs, installations, and maintenance',
    icon: '🔧',
    averagePrice: '$50-80/hr',
    providers: 89
  },
  {
    id: '3',
    name: 'Electrical',
    description: 'Wiring, fixtures, and electrical repairs',
    icon: '⚡',
    averagePrice: '$60-90/hr',
    providers: 76
  },
  {
    id: '4',
    name: 'Garden Care',
    description: 'Landscaping and garden maintenance',
    icon: '🌱',
    averagePrice: '$20-35/hr',
    providers: 94
  },
  {
    id: '5',
    name: 'Handyman',
    description: 'General repairs and maintenance',
    icon: '🔨',
    averagePrice: '$30-50/hr',
    providers: 156
  },
  {
    id: '6',
    name: 'Painting',
    description: 'Interior and exterior painting services',
    icon: '🎨',
    averagePrice: '$35-55/hr',
    providers: 68
  }
];

export const providers: Provider[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    rating: 4.9,
    reviewCount: 67,
    services: ['House Cleaning', 'Deep Cleaning'],
    location: '2.3 miles away',
    priceRange: '$25-35/hr',
    responseTime: '< 30 min',
    isVerified: true,
    isTopRated: true,
    avatar: 'SJ',
    completedJobs: 134,
    isAvailableNow: true,
    coordinates: [37.7849, -122.4094],
    distance: 2.3
  },
  {
    id: '2',
    name: 'Mike Rodriguez',
    rating: 4.8,
    reviewCount: 45,
    services: ['Plumbing', 'Handyman'],
    location: '1.8 miles away',
    priceRange: '$45-65/hr',
    responseTime: '< 1 hr',
    isVerified: true,
    isTopRated: true,
    avatar: 'MR',
    completedJobs: 89,
    isAvailableNow: true,
    coordinates: [37.7649, -122.4294],
    distance: 1.8
  },
  {
    id: '3',
    name: 'Alex Chen',
    rating: 4.7,
    reviewCount: 32,
    services: ['Electrical', 'Smart Home'],
    location: '3.1 miles away',
    priceRange: '$55-75/hr',
    responseTime: '< 2 hrs',
    isVerified: true,
    isTopRated: false,
    avatar: 'AC',
    completedJobs: 56,
    isAvailableNow: false,
    coordinates: [37.7949, -122.3994],
    distance: 3.1
  },
  {
    id: '4',
    name: 'Emma Wilson',
    rating: 4.9,
    reviewCount: 78,
    services: ['Garden Care', 'Landscaping'],
    location: '1.2 miles away',
    priceRange: '$20-30/hr',
    responseTime: '< 45 min',
    isVerified: true,
    isTopRated: true,
    avatar: 'EW',
    completedJobs: 167,
    isAvailableNow: true,
    coordinates: [37.7549, -122.4394],
    distance: 1.2
  },
  {
    id: '5',
    name: 'David Park',
    rating: 4.6,
    reviewCount: 23,
    services: ['Painting', 'Interior Design'],
    location: '4.2 miles away',
    priceRange: '$35-50/hr',
    responseTime: '< 3 hrs',
    isVerified: true,
    isTopRated: false,
    avatar: 'DP',
    completedJobs: 41,
    isAvailableNow: true,
    coordinates: [37.8049, -122.4494],
    distance: 4.2
  },
  {
    id: '6',
    name: 'Lisa Martinez',
    rating: 4.8,
    reviewCount: 56,
    services: ['House Cleaning', 'Organization'],
    location: '2.8 miles away',
    priceRange: '$28-38/hr',
    responseTime: '< 1 hr',
    isVerified: true,
    isTopRated: true,
    avatar: 'LM',
    completedJobs: 98,
    isAvailableNow: false,
    coordinates: [37.7449, -122.4594],
    distance: 2.8
  }
];

export const bookings: Booking[] = [
  {
    id: '1',
    provider: 'Sarah Johnson',
    service: 'House Cleaning',
    date: 'Today',
    time: '2:00 PM',
    status: 'upcoming',
    price: '$85'
  },
  {
    id: '2',
    provider: 'Mike Rodriguez',
    service: 'Plumbing Repair',
    date: 'Tomorrow',
    time: '10:30 AM',
    status: 'upcoming',
    price: '$125'
  },
  {
    id: '3',
    provider: 'Emma Wilson',
    service: 'Garden Maintenance',
    date: 'Dec 18',
    time: '9:00 AM',
    status: 'completed',
    price: '$75'
  }
];

export const jobPosts: JobPost[] = [
  {
    id: '1',
    title: 'Weekly House Cleaning',
    description: '3-bedroom house, weekly cleaning service needed',
    budget: '$100-150/week',
    duration: '6 months',
    proposals: 12,
    status: 'open',
    datePosted: '2 days ago'
  },
  {
    id: '2',
    title: 'Garden Maintenance Contract',
    description: 'Monthly landscaping and garden care',
    budget: '$200-300/month',
    duration: '12 months',
    proposals: 8,
    status: 'in-progress',
    datePosted: '1 week ago'
  }
];