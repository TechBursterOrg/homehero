import { Service, Provider, Booking, JobPost } from '../types';

// Currency configuration for Nigeria only
export const currencyConfig = {
  symbol: '₦',
  name: 'NGN'
} as const;

// Pricing for different services in Nigeria (in Naira)
const servicePricing = {
  // Original services
  houseCleaning: { low: 2000, high: 15000 },
  plumbing: { low: 8000, high: 15000 },
  electrical: { low: 10000, high: 20000 },
  gardenCare: { low: 1500, high: 4000 },
  handyman: { low: 3000, high: 8000 },
  painting: { low: 5000, high: 12000 },

  // 🏠 Home Maintenance & Repair - NEW
  acRepair: { low: 12000, high: 35000 },
  generatorRepair: { low: 15000, high: 50000 },
  carpentry: { low: 7000, high: 25000 },
  tiling: { low: 8000, high: 30000 },
  masonry: { low: 10000, high: 40000 },
  welding: { low: 6000, high: 20000 },
  pestControl: { low: 12000, high: 25000 },

  // 🚗 Auto & Mechanical Services - NEW
  autoMechanic: { low: 10000, high: 80000 },
  panelBeater: { low: 15000, high: 100000 },
  autoElectrician: { low: 8000, high: 35000 },
  vulcanizer: { low: 500, high: 3000 },
  carWash: { low: 1500, high: 5000 },

  // 💇🏾‍♂️ Beauty & Personal Care - NEW
  // barber: { low: 1000, high: 3000 },
  hairStylist: { low: 2000, high: 15000 },
  makeupArtist: { low: 5000, high: 25000 },
  nailTechnician: { low: 2000, high: 8000 },
  massageTherapist: { low: 4000, high: 12000 },
  tailor: { low: 1500, high: 10000 },

  // 🧹 Domestic & Household Help - NEW
  nanny: { low: 15000, high: 40000 },
  cook: { low: 10000, high: 35000 },
  laundry: { low: 2000, high: 6000 },
  gardener: { low: 2500, high: 8000 },
  securityGuard: { low: 20000, high: 60000 },

  // 🔌 Smart Home & Modern Needs - NEW
  cctvInstaller: { low: 15000, high: 50000 },
  solarTechnician: { low: 25000, high: 150000 },
  inverterTechnician: { low: 8000, high: 30000 },
  itSupport: { low: 5000, high: 25000 },
  interiorDesigner: { low: 20000, high: 100000 },
  tvRepair: { low: 6000, high: 25000 }
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
    // Previous services (unchanged)
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

    // {
    //   id: '19',
    //   name: 'Barber',
    //   description: 'Men\'s grooming and haircuts',
    //   icon: '✂️',
    //   averagePrice: formatPriceRange(servicePricing.barber.low, servicePricing.barber.high),
    //   providers: 156
    // },
    {
      id: '20',
      name: 'Hair Stylist',
      description: 'Women\'s hair care and styling',
      icon: '💇',
      averagePrice: formatPriceRange(servicePricing.hairStylist.low, servicePricing.hairStylist.high),
      providers: 134
    },

    {
      id: '8',
      name: 'Generator Repairer',
      description: 'Essential due to frequent power outages',
      icon: '🔌',
      averagePrice: formatPriceRange(servicePricing.generatorRepair.low, servicePricing.generatorRepair.high),
      providers: 32
    },
    {
      id: '9',
      name: 'Carpenter',
      description: 'Furniture making and repairs',
      icon: '🪵',
      averagePrice: formatPriceRange(servicePricing.carpentry.low, servicePricing.carpentry.high),
      providers: 67
    },

    {
      id: '17',
      name: 'Vulcanizer',
      description: 'Tyre repair and inflation',
      icon: '🛞',
      averagePrice: formatPriceRange(servicePricing.vulcanizer.low, servicePricing.vulcanizer.high),
      providers: 88
    },
    {
      id: '18',
      name: 'Car Wash',
      description: 'Professional vehicle cleaning services',
      icon: '🧼',
      averagePrice: formatPriceRange(servicePricing.carWash.low, servicePricing.carWash.high),
      providers: 203
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
    },

    // 🏠 Home Maintenance & Repair - NEW
    {
      id: '7',
      name: 'AC/Fridge Technician',
      description: 'Installation and repair of cooling systems',
      icon: '❄️',
      averagePrice: formatPriceRange(servicePricing.acRepair.low, servicePricing.acRepair.high),
      providers: 45
    },
    
    {
      id: '10',
      name: 'Tiler',
      description: 'Floor and wall tiling for homes and offices',
      icon: '🧱',
      averagePrice: formatPriceRange(servicePricing.tiling.low, servicePricing.tiling.high),
      providers: 53
    },
    {
      id: '11',
      name: 'Mason/Bricklayer',
      description: 'Building and structural repairs',
      icon: '🧱',
      averagePrice: formatPriceRange(servicePricing.masonry.low, servicePricing.masonry.high),
      providers: 41
    },
    {
      id: '12',
      name: 'Welder',
      description: 'Gates, burglar proofs, and metal works',
      icon: '🔥',
      averagePrice: formatPriceRange(servicePricing.welding.low, servicePricing.welding.high),
      providers: 48
    },
    {
      id: '13',
      name: 'Pest Control',
      description: 'Fumigation and pest management',
      icon: '🐜',
      averagePrice: formatPriceRange(servicePricing.pestControl.low, servicePricing.pestControl.high),
      providers: 39
    },

    // 🚗 Auto & Mechanical Services - NEW
    {
      id: '14',
      name: 'Auto Mechanic',
      description: 'Car repair and maintenance',
      icon: '🚗',
      averagePrice: formatPriceRange(servicePricing.autoMechanic.low, servicePricing.autoMechanic.high),
      providers: 112
    },
    {
      id: '15',
      name: 'Panel Beater',
      description: 'Body repairs for cars',
      icon: '🔨',
      averagePrice: formatPriceRange(servicePricing.panelBeater.low, servicePricing.panelBeater.high),
      providers: 34
    },
    {
      id: '16',
      name: 'Auto Electrician',
      description: 'Vehicle wiring and electrical diagnostics',
      icon: '⚡',
      averagePrice: formatPriceRange(servicePricing.autoElectrician.low, servicePricing.autoElectrician.high),
      providers: 28
    },
    

    // 💇🏾‍♂️ Beauty & Personal Care - NEW
    
    {
      id: '21',
      name: 'Makeup Artist',
      description: 'Events and personal makeup services',
      icon: '💄',
      averagePrice: formatPriceRange(servicePricing.makeupArtist.low, servicePricing.makeupArtist.high),
      providers: 92
    },
    {
      id: '22',
      name: 'Nail Technician',
      description: 'Manicure, pedicure, nail art',
      icon: '💅',
      averagePrice: formatPriceRange(servicePricing.nailTechnician.low, servicePricing.nailTechnician.high),
      providers: 78
    },
    {
      id: '23',
      name: 'Spa/Massage Therapist',
      description: 'Body massage and skincare',
      icon: '🧖',
      averagePrice: formatPriceRange(servicePricing.massageTherapist.low, servicePricing.massageTherapist.high),
      providers: 65
    },
    {
      id: '24',
      name: 'Tailor',
      description: 'Clothing design and alterations',
      icon: '🧵',
      averagePrice: formatPriceRange(servicePricing.tailor.low, servicePricing.tailor.high),
      providers: 117
    },

    // 🧹 Domestic & Household Help - NEW
    {
      id: '25',
      name: 'Nanny/Babysitter',
      description: 'Childcare services',
      icon: '👶',
      averagePrice: formatPriceRange(servicePricing.nanny.low, servicePricing.nanny.high),
      providers: 143
    },
    {
      id: '26',
      name: 'Cook/Chef',
      description: 'Home or event cooking',
      icon: '👨‍🍳',
      averagePrice: formatPriceRange(servicePricing.cook.low, servicePricing.cook.high),
      providers: 96
    },
    {
      id: '27',
      name: 'Laundry Worker',
      description: 'Washing and ironing clothes',
      icon: '👕',
      averagePrice: formatPriceRange(servicePricing.laundry.low, servicePricing.laundry.high),
      providers: 124
    },
    {
      id: '28',
      name: 'Gardener',
      description: 'Lawn care and flower maintenance',
      icon: '🌿',
      averagePrice: formatPriceRange(servicePricing.gardener.low, servicePricing.gardener.high),
      providers: 87
    },
    {
      id: '29',
      name: 'Security Guard',
      description: 'Home and compound security',
      icon: '🛡️',
      averagePrice: formatPriceRange(servicePricing.securityGuard.low, servicePricing.securityGuard.high),
      providers: 112
    },

    // 🔌 Smart Home & Modern Needs - NEW
    {
      id: '30',
      name: 'CCTV Installer',
      description: 'Security camera installation',
      icon: '📹',
      averagePrice: formatPriceRange(servicePricing.cctvInstaller.low, servicePricing.cctvInstaller.high),
      providers: 41
    },
    {
      id: '31',
      name: 'Solar Panel Technician',
      description: 'Solar panel installation and repair',
      icon: '☀️',
      averagePrice: formatPriceRange(servicePricing.solarTechnician.low, servicePricing.solarTechnician.high),
      providers: 29
    },
    {
      id: '32',
      name: 'Inverter Technician',
      description: 'Inverter repair and maintenance',
      icon: '🔋',
      averagePrice: formatPriceRange(servicePricing.inverterTechnician.low, servicePricing.inverterTechnician.high),
      providers: 36
    },
    {
      id: '33',
      name: 'IT Support',
      description: 'Computer repair and IT services',
      icon: '💻',
      averagePrice: formatPriceRange(servicePricing.itSupport.low, servicePricing.itSupport.high),
      providers: 54
    },
    {
      id: '34',
      name: 'Interior Designer',
      description: 'Home and office decoration',
      icon: '🛋️',
      averagePrice: formatPriceRange(servicePricing.interiorDesigner.low, servicePricing.interiorDesigner.high),
      providers: 47
    },
    {
      id: '35',
      name: 'TV Repairer',
      description: 'Television repair and maintenance',
      icon: '📺',
      averagePrice: formatPriceRange(servicePricing.tvRepair.low, servicePricing.tvRepair.high),
      providers: 31
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