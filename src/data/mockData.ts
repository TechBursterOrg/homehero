import { Service, Provider, Booking, JobPost } from '../types';

// Currency configuration for Nigeria only
export const currencyConfig = {
  symbol: '₦',
  name: 'NGN'
} as const;

// Pricing for different services in Nigeria (in Naira)
const servicePricing = {
  houseCleaning: { low: 2000, high: 5000 },
  plumbing: { low: 8000, high: 15000 },
  electrical: { low: 10000, high: 20000 },
  gardenCare: { low: 1500, high: 4000 },
  handyman: { low: 3000, high: 8000 },
  painting: { low: 5000, high: 12000 }
} as const;

// Fixed pricing for specific services/bookings (Customer pays these amounts in Naira)
const fixedCustomerPricing = {
  houseCleaning: 15000,
  plumbingRepair: 25000,
  gardenMaintenance: 12000,
  interiorPainting: 35000,
  deepCleaning: 18000,
  smartHomeSetup: 28000,
  wallPainting: 32000,
  electricalRepair: 30000,
  handymanService: 20000
} as const;

// Budget ranges for job posts in Naira
const jobPostBudgets = {
  weeklyHouseCleaning: '₦20,000-35,000/week',
  gardenMaintenanceContract: '₦50,000-80,000/month'
} as const;

// Customer total spending amount (what they've spent so far in Naira)
const customerTotalSpending = 280000;

// Helper function to format price ranges
const formatPriceRange = (low: number, high: number): string => {
  return `₦${low.toLocaleString()}-${high.toLocaleString()}`;
};

// Helper function to format single prices
const formatPrice = (price: number): string => {
  return `₦${price.toLocaleString()}`;
};

// Generate services with Naira pricing
export const getServices = (): Service[] => {
  return [
    {
      id: '1',
      name: 'House Cleaning',
      description: 'Professional residential cleaning services',
      icon: '🏠',
      averagePrice: formatPriceRange(servicePricing.houseCleaning.low, servicePricing.houseCleaning.high),
      providers: 127
    },
    {
      id: '2',
      name: 'Plumbing',
      description: 'Repairs, installations, and maintenance',
      icon: '🔧',
      averagePrice: formatPriceRange(servicePricing.plumbing.low, servicePricing.plumbing.high),
      providers: 89
    },
    {
      id: '3',
      name: 'Electrical',
      description: 'Wiring, fixtures, and electrical repairs',
      icon: '⚡',
      averagePrice: formatPriceRange(servicePricing.electrical.low, servicePricing.electrical.high),
      providers: 76
    },
    {
      id: '4',
      name: 'Garden Care',
      description: 'Landscaping and garden maintenance',
      icon: '🌱',
      averagePrice: formatPriceRange(servicePricing.gardenCare.low, servicePricing.gardenCare.high),
      providers: 94
    },
    {
      id: '5',
      name: 'Handyman',
      description: 'General repairs and maintenance',
      icon: '🔨',
      averagePrice: formatPriceRange(servicePricing.handyman.low, servicePricing.handyman.high),
      providers: 156
    },
    {
      id: '6',
      name: 'Painting',
      description: 'Interior and exterior painting services',
      icon: '🎨',
      averagePrice: formatPriceRange(servicePricing.painting.low, servicePricing.painting.high),
      providers: 68
    }
  ];
};

// Generate providers with Naira pricing
export const getProviders = (): Provider[] => {
  return [
    {
      id: '1',
      name: 'Sarah Johnson',
      rating: 4.9,
      reviewCount: 67,
      services: ['House Cleaning', 'Deep Cleaning'],
      location: '2.3 miles away',
      priceRange: formatPriceRange(servicePricing.houseCleaning.low, servicePricing.houseCleaning.high),
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
      priceRange: formatPriceRange(servicePricing.plumbing.low, servicePricing.plumbing.high),
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
      priceRange: formatPriceRange(servicePricing.electrical.low, servicePricing.electrical.high),
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
      priceRange: formatPriceRange(servicePricing.gardenCare.low, servicePricing.gardenCare.high),
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
      priceRange: formatPriceRange(servicePricing.painting.low, servicePricing.painting.high),
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
      priceRange: formatPriceRange(servicePricing.houseCleaning.low, servicePricing.houseCleaning.high),
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
};

// Generate bookings with Naira pricing
export const getBookings = (): Booking[] => {
  return [
    {
      id: '1',
      provider: 'Sarah Johnson',
      service: 'House Cleaning',
      date: 'Today',
      time: '2:00 PM',
      status: 'upcoming',
      price: formatPrice(fixedCustomerPricing.houseCleaning)
    },
    {
      id: '2',
      provider: 'Mike Rodriguez',
      service: 'Plumbing Repair',
      date: 'Tomorrow',
      time: '10:30 AM',
      status: 'upcoming',
      price: formatPrice(fixedCustomerPricing.plumbingRepair)
    },
    {
      id: '3',
      provider: 'Emma Wilson',
      service: 'Garden Maintenance',
      date: 'Dec 18',
      time: '9:00 AM',
      status: 'completed',
      price: formatPrice(fixedCustomerPricing.gardenMaintenance)
    }
  ];
};

// Generate job posts with Naira pricing
export const getJobPosts = (): JobPost[] => {
  return [
    {
      id: '1',
      title: 'Weekly House Cleaning',
      description: '3-bedroom house, weekly cleaning service needed',
      budget: jobPostBudgets.weeklyHouseCleaning,
      duration: '6 months',
      proposals: 12,
      status: 'open',
      datePosted: '2 days ago'
    },
    {
      id: '2',
      title: 'Garden Maintenance Contract',
      description: 'Monthly landscaping and garden care',
      budget: jobPostBudgets.gardenMaintenanceContract,
      duration: '12 months',
      proposals: 8,
      status: 'in-progress',
      datePosted: '1 week ago'
    }
  ];
};

// Customer Dashboard Mock Data with Naira pricing
export const getCustomerDashboardData = () => {
  return {
    user: {
      name: 'Jane Smith',
      email: 'jane@example.com',
      id: '1',
      country: 'Nigeria'
    },
    activeBookings: [
      {
        id: 1,
        provider: 'Sarah Johnson',
        service: 'House Cleaning',
        date: 'Today',
        time: '2:00 PM',
        status: 'confirmed',
        price: formatPrice(fixedCustomerPricing.houseCleaning),
        avatar: 'SJ',
        location: '123 Main Street'
      },
      {
        id: 2,
        provider: 'Mike Rodriguez',
        service: 'Plumbing Repair',
        date: 'Tomorrow',
        time: '10:30 AM',
        status: 'pending',
        price: formatPrice(fixedCustomerPricing.plumbingRepair),
        avatar: 'MR',
        location: '456 Oak Avenue'
      }
    ],
    recentServices: [
      {
        id: 1,
        provider: 'Emma Wilson',
        service: 'Garden Maintenance',
        completedDate: 'Dec 18',
        rating: 5,
        price: formatPrice(fixedCustomerPricing.gardenMaintenance),
        status: 'completed',
        avatar: 'EW'
      },
      {
        id: 2,
        provider: 'David Park',
        service: 'Interior Painting',
        completedDate: 'Dec 15',
        rating: 4,
        price: formatPrice(fixedCustomerPricing.interiorPainting),
        status: 'completed',
        avatar: 'DP'
      },
      {
        id: 3,
        provider: 'Lisa Martinez',
        service: 'Deep Cleaning',
        completedDate: 'Dec 10',
        rating: 5,
        price: formatPrice(fixedCustomerPricing.deepCleaning),
        status: 'completed',
        avatar: 'LM'
      },
      {
        id: 4,
        provider: 'Alex Chen',
        service: 'Electrical Repair',
        completedDate: 'Dec 5',
        rating: 4,
        price: formatPrice(fixedCustomerPricing.electricalRepair),
        status: 'completed',
        avatar: 'AC'
      }
    ],
    favoriteProviders: [
      {
        id: 1,
        name: 'Sarah Johnson',
        rating: 4.9,
        reviewCount: 67,
        services: ['House Cleaning', 'Deep Cleaning'],
        priceRange: formatPriceRange(servicePricing.houseCleaning.low, servicePricing.houseCleaning.high),
        avatar: 'SJ',
        timesBooked: 8
      },
      {
        id: 2,
        name: 'Emma Wilson',
        rating: 4.9,
        reviewCount: 78,
        services: ['Garden Care', 'Landscaping'],
        priceRange: formatPriceRange(servicePricing.gardenCare.low, servicePricing.gardenCare.high),
        avatar: 'EW',
        timesBooked: 5
      },
      {
        id: 3,
        name: 'Mike Rodriguez',
        rating: 4.8,
        reviewCount: 45,
        services: ['Plumbing', 'Handyman'],
        priceRange: formatPriceRange(servicePricing.plumbing.low, servicePricing.plumbing.high),
        avatar: 'MR',
        timesBooked: 4
      }
    ],
    stats: {
      totalSpent: customerTotalSpending,
      servicesBooked: 23,
      favoriteProviders: 6,
      averageRating: 4.7,
      currency: currencyConfig
    },
    recommendations: [
      {
        id: 1,
        provider: 'Alex Chen',
        service: 'Smart Home Setup',
        rating: 4.7,
        price: formatPrice(fixedCustomerPricing.smartHomeSetup),
        reason: 'Based on your electrical service history',
        avatar: 'AC'
      },
      {
        id: 2,
        provider: 'David Park',
        service: 'Wall Painting',
        rating: 4.6,
        price: formatPrice(fixedCustomerPricing.wallPainting),
        reason: 'Highly rated in your area',
        avatar: 'DP'
      },
      {
        id: 3,
        provider: 'Lisa Martinez',
        service: 'Handyman Service',
        rating: 4.8,
        price: formatPrice(fixedCustomerPricing.handymanService),
        reason: 'Perfect for small home repairs',
        avatar: 'LM'
      }
    ]
  };
};

// Function to get financial summary in Naira
export const getCustomerFinancialSummary = () => {
  const monthlySavings = 45000;
  const monthlySpending = 65000;
  
  return {
    currency: currencyConfig,
    totalSpent: formatPrice(customerTotalSpending),
    monthlySavings: formatPrice(monthlySavings),
    monthlySpending: formatPrice(monthlySpending),
    averageServiceCost: formatPrice(Math.round(customerTotalSpending / 23))
  };
};

// Get all user data (simplified since we only have Nigeria now)
export const getCurrentUserData = () => {
  return {
    services: getServices(),
    providers: getProviders(),
    bookings: getBookings(),
    jobPosts: getJobPosts(),
    customerDashboard: getCustomerDashboardData(),
    financialSummary: getCustomerFinancialSummary(),
    userCountry: 'Nigeria',
    currency: currencyConfig
  };
};

// Export static data
export const services = getServices();
export const providers = getProviders();
export const bookings = getBookings();
export const jobPosts = getJobPosts();