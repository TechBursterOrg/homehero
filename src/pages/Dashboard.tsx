import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  Star, 
  Users, 
  TrendingUp, 
  Plus,
  Clock,
  Calendar,
  MapPin,
  X,
  Save,
  Award,
  Target,
  Activity,
  ChevronRight,
  Sparkles,
  Loader2,
  AlertCircle,
  BookOpen,
  Eye,
  Mail,
  Phone
} from 'lucide-react';
import IdentityVerificationModal from './IdentityVerificationModal';

interface BusinessHours {
  id?: number;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  serviceTypes: string[];
  notes: string;
}

interface Booking {
  _id: string;
  providerId: string;
  providerName: string;
  providerEmail: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  serviceType: string;
  description: string;
  location: string;
  timeframe: string;
  budget: string;
  specialRequests: string;
  bookingType: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'rejected';
  requestedAt: string;
  acceptedAt?: string;
  completedAt?: string;
  updatedAt: string;
  ratingStatus?: {
    customerRated: boolean;
    providerRated: boolean;
  };
  ratingPrompted?: boolean;
}

interface ScheduleEntry {
  id: string;
  title: string;
  client: string;
  phone: string;
  location: string;
  date: string;
  time: string;
  endTime: string;
  duration: string;
  payment: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  notes: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
  providerId?: string;
  customerId?: string;
  bookingId?: string;
}

interface DashboardData {
  user: {
    name: string;
    email: string;
    id: string;
    country: string;
    phoneNumber?: string;
    isAvailableNow?: boolean;
  };
  businessHours: BusinessHours[];
  recentJobs: any[];
  upcomingTasks: any[];
  bookings: Booking[];
  schedule: ScheduleEntry[];
  stats: {
    totalEarnings: number;
    jobsCompleted: number;
    averageRating: number;
    activeClients: number;
    totalRatings?: number;
  };
}

interface RatingModalProps {
  isOpen: boolean;
  booking: Booking;
  onClose: () => void;
  onSubmit: (rating: number, comment?: string) => void;
  type: 'provider' | 'customer';
}

interface UserVerification {
  isNinVerified: boolean;
  isNepaVerified: boolean;
  verificationStatus: string;
  hasSubmittedVerification: boolean;
  userDetails?: {
    fullName: string;
    gender: string;
    state: string;
  };
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

// Rating Modal Component
const RatingModal: React.FC<RatingModalProps> = ({ isOpen, booking, onClose, onSubmit, type }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      alert('Please select a rating');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(rating, comment);
      onClose();
      setRating(0);
      setComment('');
    } catch (error) {
      console.error('Rating submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const modalTitle = type === 'customer' ? 'Rate Customer' : 'Rate Your Experience';
  const modalDescription = type === 'customer' 
    ? `How was your experience with ${booking.customerName}?`
    : `How was your service with ${booking.providerName}?`;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-md w-full">
        <div className="p-6 sm:p-8 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl sm:rounded-2xl flex items-center justify-center">
                <Star className="w-5 h-5 sm:w-6 sm:h-6 text-white fill-current" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{modalTitle}</h2>
                <p className="text-gray-600 text-sm sm:text-base">{modalDescription}</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 hover:bg-gray-200 rounded-xl sm:rounded-2xl flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
            </button>
          </div>
        </div>
        
        <div className="p-6 sm:p-8">
          <div className="flex justify-center mb-6">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="p-2 transition-transform hover:scale-110"
              >
                <Star
                  className={`w-8 h-8 sm:w-10 sm:h-10 ${
                    star <= (hoverRating || rating)
                      ? 'text-yellow-500 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
          </div>

          {type === 'provider' && (
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Comment (Optional)
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience..."
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none"
              />
            </div>
          )}

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="font-medium">Service:</span>
            <span>{booking.serviceType}</span>
          </div>
        </div>

        <div className="p-6 sm:p-8 border-t border-gray-100 flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl sm:rounded-2xl hover:bg-gray-50 transition-all duration-200 font-semibold"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || rating === 0}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-green-600 text-white rounded-xl sm:rounded-2xl hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Rating'}
          </button>
        </div>
      </div>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const [showAvailabilityModal, setShowAvailabilityModal] = useState(false);
  const [businessHours, setBusinessHours] = useState<BusinessHours[]>([]);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [schedule, setSchedule] = useState<ScheduleEntry[]>([]);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [ratingBooking, setRatingBooking] = useState<Booking | null>(null);
  const [ratingType, setRatingType] = useState<'provider' | 'customer'>('provider');
  const [currentAvailability, setCurrentAvailability] = useState<boolean | null>(null);
  
  // Identity Verification State
  const [userVerification, setUserVerification] = useState<UserVerification | null>(null);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [isSubmittingVerification, setIsSubmittingVerification] = useState(false);
  const [pendingBookingAction, setPendingBookingAction] = useState<{
    bookingId: string;
    action: 'confirm' | 'complete';
  } | null>(null);

  // Days of the week
  const daysOfWeek = [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
  ];

  // Initialize default hours for each day
  const defaultHours: BusinessHours = {
    dayOfWeek: 'Monday',
    startTime: '09:00',
    endTime: '17:00',
    isAvailable: true,
    serviceTypes: [],
    notes: ''
  };

  // Fetch user verification status
  const fetchUserVerification = async () => {
  try {
    const token = localStorage.getItem('authToken') || localStorage.getItem('token');
    if (!token) {
      console.log('❌ No token found for verification fetch');
      return;
    }

    console.log('🔄 Fetching verification status...');
    const response = await fetch(`${API_BASE_URL}/api/auth/verification-status`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      console.error('❌ Failed to fetch verification status:', response.status);
      return;
    }

    const data = await response.json();
    console.log('✅ Verification data received:', data.data);
    setUserVerification(data.data);
    
  } catch (error) {
    console.error('❌ Error fetching verification status:', error);
  }
};


  // Check if user is verified
  const isUserVerified = () => {
  // If no verification data, assume not verified
  if (!userVerification) {
    return false;
  }
  
  // Only return true if explicitly verified
  return userVerification.isNinVerified === true;
};




  // Handle identity verification
const handleIdentityVerify = async (verificationData: { 
  nin: string; 
  nepaBill: File | null;
  selfie: File | null;
  consent: boolean;
}) => {
  console.log('🔐 Starting verification process');
  setIsSubmittingVerification(true);
  
  try {
    const token = localStorage.getItem('authToken') || localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const formData = new FormData();
    formData.append('nin', verificationData.nin);
    formData.append('consent', verificationData.consent.toString());
    
    if (verificationData.selfie) {
      formData.append('selfie', verificationData.selfie);
    }
    
    if (verificationData.nepaBill) {
      formData.append('nepaBill', verificationData.nepaBill);
    }

    const response = await fetch(`${API_BASE_URL}/api/verification/submit`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Verification submission failed: ${response.status}`);
    }

    // Update verification status to show pending state
    setUserVerification(prev => prev ? {
      ...prev,
      hasSubmittedVerification: true,
      verificationStatus: 'pending'
    } : null);
    
    setShowVerificationModal(false);
    
    // Execute pending action if exists
    if (pendingBookingAction) {
      console.log('🔄 Executing pending action after verification');
      
      // Use setTimeout to ensure state updates are processed
      setTimeout(async () => {
        if (isUserVerified()) {
          if (pendingBookingAction.action === 'confirm') {
            await handleUpdateBookingStatus(pendingBookingAction.bookingId, 'confirmed');
          } else if (pendingBookingAction.action === 'complete') {
            await handleUpdateBookingStatus(pendingBookingAction.bookingId, 'completed');
          }
        } else {
          alert('Please wait for your verification to be processed.');
        }
        setPendingBookingAction(null);
      }, 100);
    }
    
    alert('Verification submitted successfully! Your documents are under review.');
    
  } catch (error) {
    console.error('Verification error:', error);
    alert(error instanceof Error ? error.message : 'Verification failed');
  } finally {
    setIsSubmittingVerification(false);
  }
};




  // Get hours for the selected day
  const getHoursForDay = (day: string): BusinessHours => {
    const existingHours = businessHours.find(hours => hours.dayOfWeek === day);
    return existingHours || {
      ...defaultHours,
      dayOfWeek: day
    };
  };

  // Update hours for multiple days
  const updateHoursForDays = (days: string[], updatedHours: Partial<BusinessHours>) => {
    const updatedBusinessHours = [...businessHours];
    
    days.forEach(day => {
      const existingIndex = updatedBusinessHours.findIndex(hours => hours.dayOfWeek === day);
      const baseHours = getHoursForDay(day);
      
      if (existingIndex >= 0) {
        updatedBusinessHours[existingIndex] = {
          ...updatedBusinessHours[existingIndex],
          ...updatedHours,
          dayOfWeek: day // Ensure day remains correct
        };
      } else {
        updatedBusinessHours.push({
          ...baseHours,
          ...updatedHours,
          dayOfWeek: day
        });
      }
    });
    
    setBusinessHours(updatedBusinessHours);
  };

  // Fetch current availability status
  const checkAvailability = async () => {
    try {
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      
      if (!token) {
        console.warn('No authentication token found for availability check');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/availability/check-now`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      const data = await response.json();
      if (data.success) {
        setCurrentAvailability(data.data.isAvailableNow);
      } else {
        console.warn('Availability check failed:', data.message);
        // Fallback to dashboard data if available
        if (dashboardData?.user.isAvailableNow !== undefined) {
          setCurrentAvailability(dashboardData.user.isAvailableNow);
        }
      }
    } catch (error) {
      console.error('Failed to check availability:', error);
      // Fallback to dashboard data if available
      if (dashboardData?.user.isAvailableNow !== undefined) {
        setCurrentAvailability(dashboardData.user.isAvailableNow);
      }
    }
  };

  useEffect(() => {
  console.log('🔄 Dashboard mounted - checking verification state');
  console.log('📊 Current userVerification:', userVerification);
  console.log('🔒 Is user verified?', isUserVerified());
}, []);

  // Fetch dashboard data from backend
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found. Please log in again.');
      }

      const response = await fetch(`${API_BASE_URL}/api/user/dashboard?refresh=${Date.now()}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('Dashboard response status:', response.status);
      
      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('token');
        localStorage.removeItem('userData');
        throw new Error('Your session has expired. Please log in again.');
      }
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Dashboard API response:', data);
      
      if (data.success === false && data.message?.includes('token')) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('token');
        localStorage.removeItem('userData');
        throw new Error('Authentication failed. Please log in again.');
      }
      
      setDashboardData(data);
      setBusinessHours(data.businessHours || []);
      setSchedule(data.schedule || []);
      
      // Set availability from dashboard data if available
      if (data.user?.isAvailableNow !== undefined) {
        setCurrentAvailability(data.user.isAvailableNow);
      }
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      console.error('Dashboard fetch error:', err);
      
      if (errorMessage.includes('session') || errorMessage.includes('Authentication') || errorMessage.includes('token')) {
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    fetchUserVerification();
  }, []);

  // Check availability when dashboard data is loaded or business hours are updated
  useEffect(() => {
    if (dashboardData) {
      checkAvailability();
    }
  }, [dashboardData]);

  const serviceTypes = [
    'House Cleaning',
    'Plumbing Repair',
    'Garden Maintenance',
    'Electrical Work',
    'Painting',
    'General Maintenance',
    'Barber',
    'AC Repair',
    'Generator Repair',
    'Carpentry',
    'Tiling',
    'Masonry',
    'Welding',
    'Pest Control',
    'Auto Mechanic',
    'Panel Beater',
    'Auto Electrician',
    'Vulcanizer',
    'Car Wash',
    'Hair Stylist',
    'Makeup Artist',
    'Nail Technician',
    'Massage Therapist',
    'Tailor',
    'Nanny',
    'Cook',
    'Laundry',
    'Gardener',
    'Security Guard',
    'CCTV Installer',
    'Solar Technician',
    'Inverter Technician',
    'IT Support',
    'Interior Designer',
    'TV Repair',
    'Other'
  ];

  const handleAddAvailability = () => {
    setShowAvailabilityModal(true);
    setSelectedDays([]);
  };

  const handleSaveBusinessHours = async (): Promise<void> => {
    try {
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      const response = await fetch(`${API_BASE_URL}/api/business-hours/bulk`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ businessHours }),
      });

      if (!response.ok) {
        throw new Error('Failed to save business hours');
      }

      const result = await response.json();
      setBusinessHours(result.data.businessHours || []);
      setShowAvailabilityModal(false);
      
      // Recheck availability after saving business hours
      await checkAvailability();
      
      alert('Business hours saved successfully!');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save business hours';
      setError(errorMessage);
      alert(`Error: ${errorMessage}`);
    }
  };

  const fetchScheduleData = async () => {
    try {
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/api/schedule`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('📅 Fetched schedule data:', data);
      
      if (data.success && data.data) {
        setSchedule(data.data.schedule || data.data || []);
      } else {
        setSchedule(data.schedule || []);
      }
    } catch (error) {
      console.error('Failed to fetch schedule:', error);
    }
  };

  useEffect(() => {
    if (dashboardData) {
      fetchScheduleData();
    }
  }, [dashboardData]);

  const handleCloseModal = () => {
    setShowAvailabilityModal(false);
    setSelectedDays([]);
  };

  const formatTime = (timeString: string): string => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'confirmed': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'accepted': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'pending': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
      case 'rejected': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-400 bg-red-50';
      case 'medium': return 'border-amber-400 bg-amber-50';
      case 'low': return 'border-green-400 bg-green-50';
      default: return 'border-blue-400 bg-blue-50';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'cleaning': return '🧽';
      case 'handyman': return '🔧';
      case 'gardening': return '🌿';
      case 'petcare': return '🐾';
      case 'childcare': return '👶';
      default: return '💼';
    }
  };

  const getClientInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const handleDaySelection = (day: string) => {
    setSelectedDays(prev => 
      prev.includes(day) 
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
  };

  const handleSelectAllDays = () => {
    setSelectedDays(selectedDays.length === daysOfWeek.length ? [] : [...daysOfWeek]);
  };

  const handleServiceTypeToggle = (serviceType: string) => {
    if (selectedDays.length === 0) {
      alert('Please select at least one day first');
      return;
    }

    const currentServiceTypes = getHoursForDay(selectedDays[0]).serviceTypes;
    const updatedServiceTypes = currentServiceTypes.includes(serviceType)
      ? currentServiceTypes.filter(st => st !== serviceType)
      : [...currentServiceTypes, serviceType];
    
    updateHoursForDays(selectedDays, { serviceTypes: updatedServiceTypes });
  };

  const handleViewBooking = (booking: Booking) => {
    setSelectedBooking(booking);
    setShowBookingModal(true);
  };

  // FIXED: Calculate realistic duration based on service type
  const calculateRealisticDuration = (serviceType: string): { duration: string; hours: number } => {
    const serviceDurations: { [key: string]: { duration: string; hours: number } } = {
      'House Cleaning': { duration: '3-4 hours', hours: 3.5 },
      'Deep Cleaning': { duration: '4-6 hours', hours: 5 },
      'Plumbing Repair': { duration: '2-3 hours', hours: 2.5 },
      'Garden Maintenance': { duration: '2-4 hours', hours: 3 },
      'Electrical Work': { duration: '2-3 hours', hours: 2.5 },
      'Painting': { duration: '5-8 hours', hours: 6.5 },
      'General Maintenance': { duration: '2-4 hours', hours: 3 },
      'Other': { duration: '2-3 hours', hours: 2.5 }
    };

    return serviceDurations[serviceType] || { duration: '2-3 hours', hours: 2.5 };
  };

  // FIXED: Calculate end time based on realistic duration
  const calculateEndTime = (startTime: string, serviceType: string): string => {
    const [time, modifier] = startTime.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    
    if (modifier === 'PM' && hours !== 12) hours += 12;
    if (modifier === 'AM' && hours === 12) hours = 0;
    
    const { hours: durationHours } = calculateRealisticDuration(serviceType);
    
    const totalMinutes = hours * 60 + minutes + Math.round(durationHours * 60);
    let endHours = Math.floor(totalMinutes / 60) % 24;
    const endMinutes = totalMinutes % 60;
    
    const endModifier = endHours >= 12 ? 'PM' : 'AM';
    if (endHours > 12) endHours -= 12;
    if (endHours === 0) endHours = 12;
    
    return `${endHours}:${endMinutes.toString().padStart(2, '0')} ${endModifier}`;
  };

  const addBookingToSchedule = async (booking: Booking): Promise<void> => {
    try {
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const { duration } = calculateRealisticDuration(booking.serviceType);

      const scheduleData = {
        title: booking.serviceType,
        client: booking.customerName,
        phone: booking.customerPhone,
        location: booking.location,
        date: new Date().toISOString().split('T')[0],
        time: '10:00 AM',
        endTime: calculateEndTime('10:00 AM', booking.serviceType),
        duration: duration,
        payment: booking.budget,
        status: 'confirmed' as const,
        notes: booking.specialRequests || booking.description,
        category: booking.serviceType.toLowerCase().includes('clean') ? 'cleaning' : 'handyman',
        priority: 'medium' as const,
        providerId: booking.providerId,
        customerId: booking.customerId,
        bookingId: booking._id
      };

      console.log('📋 Sending schedule data:', scheduleData);

      const response = await fetch(`${API_BASE_URL}/api/schedule`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(scheduleData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ Schedule creation failed:', errorData);
        throw new Error(errorData.message || `Failed to add booking to schedule: ${response.status}`);
      }

      const result = await response.json();
      console.log('✅ Schedule creation successful:', result);
      
      if (result.data) {
        setSchedule(prev => [...prev, result.data]);
        await fetchScheduleData();
      }
      
    } catch (err) {
      console.error('❌ Error adding booking to schedule:', err);
    }
  };

  // Handle customer rating submission
  const handleCustomerRating = async (bookingId: string, rating: number, comment?: string) => {
    try {
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const response = await fetch(`${API_BASE_URL}/api/ratings/customer`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingId,
          rating,
          comment
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit rating');
      }

      await fetchDashboardData();
      
      alert('Thank you for your rating!');
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to submit rating';
      setError(errorMessage);
      console.error('Rating error:', err);
      throw err;
    }
  };

  // Handle provider rating of customer
  const handleProviderRating = async (bookingId: string, rating: number) => {
    try {
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const response = await fetch(`${API_BASE_URL}/api/ratings/provider`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingId,
          rating
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit rating');
      }

      await fetchDashboardData();
      
      alert('Customer rated successfully!');
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to rate customer';
      setError(errorMessage);
      console.error('Provider rating error:', err);
      throw err;
    }
  };

  const handleCompleteBooking = async (bookingId: string) => {
    try {
      setError(null);
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Authentication token not found');
      }

      console.log('🔄 Starting booking completion process for:', bookingId);

      // First, update the booking status to completed
      const statusResponse = await fetch(`${API_BASE_URL}/api/bookings/${bookingId}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'completed' }),
      });

      if (!statusResponse.ok) {
        const errorData = await statusResponse.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${statusResponse.status}`);
      }

      const statusResult = await statusResponse.json();
      
      if (statusResult.success) {
        console.log('✅ Booking status updated to completed');
        
        // Remove from schedule
        await removeBookingFromSchedule(bookingId);
        
        // Now update the provider dashboard with earnings and stats
        const completeResponse = await fetch(`${API_BASE_URL}/api/bookings/${bookingId}/complete`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!completeResponse.ok) {
          console.warn('⚠️ Failed to update dashboard, but booking was completed');
        } else {
          const completeResult = await completeResponse.json();
          console.log('✅ Dashboard updated with earnings:', completeResult.data);
        }

        // Find the completed booking
        const completedBooking = dashboardData?.bookings.find(b => b._id === bookingId);
        if (completedBooking) {
          // Show provider rating modal for customer
          setRatingBooking(completedBooking);
          setRatingType('customer');
          setShowRatingModal(true);
        }
        
        // Refresh dashboard data to show updated stats
        await fetchDashboardData();
        
        setError(null);
        setShowBookingModal(false);
        
        alert('Booking marked as completed! Removed from schedule. Earnings added to your dashboard. Please rate the customer.');
      } else {
        throw new Error(statusResult.message || 'Failed to update booking status');
      }
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to complete booking';
      setError(errorMessage);
      console.error('❌ Complete booking error:', err);
      alert(`Error: ${errorMessage}`);
    }
  };

  const removeBookingFromSchedule = async (bookingId: string): Promise<void> => {
    try {
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Authentication token not found');
      }
      
      console.log('🗑️ Removing booking from schedule:', bookingId);

      const response = await fetch(`${API_BASE_URL}/api/schedule/booking/${bookingId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.warn('⚠️ Failed to remove from schedule (non-critical):', errorData.message);
        // Don't throw error - schedule removal is secondary
      } else {
        const result = await response.json();
        console.log('✅ Booking removed from schedule:', result);
        
        // Update local schedule state
        setSchedule(prev => prev.filter(entry => entry.bookingId !== bookingId));
      }
      
    } catch (err) {
      console.error('❌ Error removing booking from schedule:', err);
      // Don't throw error - schedule removal is non-critical
    }
  };

  // FIXED: Enhanced booking status update function with verification check
  const handleUpdateBookingStatus = async (bookingId: string, status: 'pending' | 'confirmed' | 'completed' | 'cancelled') => {
  console.log('🔄 handleUpdateBookingStatus called with:', { bookingId, status });
  
  // Check if user needs verification for confirm/complete actions
  if ((status === 'confirmed' || status === 'completed') && !isUserVerified()) {
    console.log('🚨 VERIFICATION REQUIRED - Blocking action');
    
    // Store the pending action
    setPendingBookingAction({ 
      bookingId, 
      action: status as 'confirm' | 'complete' 
    });
    
    // Show verification modal and close booking modal
    setShowVerificationModal(true);
    setShowBookingModal(false);
    
    // Stop execution completely
    return;
  }

  console.log('✅ Proceeding with booking action');
  
  // Rest of the function for when user is verified...
  if (status === 'completed') {
    await handleCompleteBooking(bookingId);
  } else {
    try {
      setError(null);
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const response = await fetch(`${API_BASE_URL}/api/bookings/${bookingId}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        if (status === 'confirmed' && selectedBooking) {
          await addBookingToSchedule(selectedBooking);
          
          // Email notification (non-critical)
          try {
            const emailResponse = await fetch(`${API_BASE_URL}/api/email/send-booking-confirmed`, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                customerEmail: selectedBooking.customerEmail,
                bookingData: {
                  customerName: selectedBooking.customerName,
                  serviceType: selectedBooking.serviceType,
                  location: selectedBooking.location,
                  timeframe: selectedBooking.timeframe,
                  budget: selectedBooking.budget,
                  description: selectedBooking.description,
                  specialRequests: selectedBooking.specialRequests
                },
                providerInfo: {
                  name: dashboardData?.user.name || 'Service Provider',
                  phone: dashboardData?.user.phoneNumber || 'Will contact you shortly',
                  email: dashboardData?.user.email || ''
                }
              }),
            });

            if (!emailResponse.ok) {
              console.log('⚠️ Failed to send booking confirmation email');
            }
          } catch (emailError) {
            console.error('⚠️ Email notification failed:', emailError);
          }
        }
        
        await fetchDashboardData();
        setError(null);
        setShowBookingModal(false);
        
        let successMessage = `Booking ${status} successfully!`;
        if (status === 'confirmed') {
          successMessage += ' Added to schedule and customer has been notified.';
        }
        alert(successMessage);
      } else {
        throw new Error(result.message || 'Failed to update booking status');
      }
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update booking status';
      setError(errorMessage);
      console.error('Booking status update error:', err);
      alert(`Error: ${errorMessage}`);
    }
  }
};




  const handleRatingSubmit = async (rating: number, comment?: string) => {
    if (!ratingBooking) return;

    try {
      if (ratingType === 'customer') {
        await handleProviderRating(ratingBooking._id, rating);
        await triggerCustomerRatingPrompt(ratingBooking._id);
      } else {
        await handleCustomerRating(ratingBooking._id, rating, comment);
      }
      
      await fetchDashboardData();
      
    } catch (error) {
      console.error('Rating submission error:', error);
      throw error;
    }
  };

  const triggerCustomerRatingPrompt = async (bookingId: string) => {
    try {
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const response = await fetch(`${API_BASE_URL}/api/bookings/${bookingId}/rating-prompt`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        console.log('✅ Customer rating prompt triggered');
        const booking = ratingBooking;
        if (booking) {
          console.log(`📧 Rating prompt should be sent to: ${booking.customerEmail}`);
          console.log(`🔗 Customer should be directed to rate provider: ${booking.providerName}`);
        }
      }
    } catch (error) {
      console.error('Failed to trigger customer rating prompt:', error);
    }
  };

  const handleContactCustomer = (booking: Booking, method: 'email' | 'phone') => {
    if (method === 'email') {
      window.location.href = `mailto:${booking.customerEmail}`;
    } else if (method === 'phone') {
      window.location.href = `tel:${booking.customerPhone}`;
    }
  };

  // Format amount in Naira
  const formatNaira = (amount: number) => {
    return `₦${amount.toLocaleString()}`;
  };

  // Get upcoming bookings (pending and confirmed)
  const getUpcomingBookings = () => {
    if (!dashboardData?.bookings) return [];
    
    // Show ALL non-completed bookings (pending, confirmed)
    const upcomingBookings = dashboardData.bookings.filter(booking => 
      ['pending', 'confirmed'].includes(booking.status)
    );
    
    console.log('📋 Frontend - Upcoming bookings filtered:', {
      total: dashboardData.bookings.length,
      upcoming: upcomingBookings.length,
      pending: upcomingBookings.filter(b => b.status === 'pending').length,
      confirmed: upcomingBookings.filter(b => b.status === 'confirmed').length
    });
    
    return upcomingBookings;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-green-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-green-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-green-100 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-green-100 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
          <p className="text-gray-600">No data available</p>
        </div>
      </div>
    );
  }

  const upcomingBookings = getUpcomingBookings();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-green-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0 gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 bg-gradient-to-br from-green-600 to-green-700 rounded-xl sm:rounded-2xl md:rounded-3xl flex items-center justify-center shadow-lg flex-shrink-0">
                  <span className="text-white font-bold text-sm sm:text-lg md:text-xl">
                    {getClientInitials(dashboardData.user.name)}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <h1 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent leading-tight">
                    <span className="block sm:inline">Welcome back, {dashboardData.user.name.split(' ')[0]}!</span> 
                    <span className="inline sm:inline">👋</span>
                  </h1>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                      <span className="hidden xs:inline">Ready to make today productive? Here's your overview.</span>
                      <span className="xs:hidden">Here's your overview for today.</span>
                    </p>
                    <div className="flex items-center gap-1 px-2 py-1 bg-white/80 rounded-lg border">
                      <span className="text-sm">🇳🇬</span>
                      <span className="text-xs font-medium text-gray-600"></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Availability Status Indicator */}
            <div className="flex flex-col sm:flex-row gap-3">
              {currentAvailability !== null && (
    <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
      currentAvailability ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
    }`}>
      <div className={`w-3 h-3 rounded-full ${
        currentAvailability ? 'bg-green-500' : 'bg-red-500'
      }`}></div>
      <span className="font-medium text-sm">
        {currentAvailability ? 'Available Now' : 'Currently Unavailable'}
      </span>
    </div>
  )}

  {/* Verification Status Indicator */}
  {userVerification && (
    <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
      isUserVerified() ? 'bg-green-100 text-green-800' : 
      userVerification.hasSubmittedVerification ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
    }`}>
      <div className={`w-3 h-3 rounded-full ${
        isUserVerified() ? 'bg-green-500' : 
        userVerification.hasSubmittedVerification ? 'bg-yellow-500' : 'bg-red-500'
      }`}></div>
      <span className="font-medium text-sm">
        {isUserVerified() ? 'Verified' : 
         userVerification.hasSubmittedVerification ? 'Verification Pending' : 'Verification Required'}
      </span>
    </div>
  )}
              <button 
                onClick={handleAddAvailability}
                className="bg-gradient-to-r from-green-600 to-green-600 text-white px-6 py-3 sm:px-8 sm:py-4 rounded-xl sm:rounded-2xl font-semibold transition-all duration-200 hover:scale-105 hover:shadow-xl shadow-lg shadow-green-200 flex items-center justify-center gap-3 w-full sm:w-auto"
              >
                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-white/20 rounded-lg flex items-center justify-center">
                  <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                </div>
                <span>Set Business Hours</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
          <div className="group bg-white/80 backdrop-blur-sm p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="w-10 h-10 sm:w-14 sm:h-14 bg-gradient-to-br from-emerald-400 to-green-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg text-white">
                ₦
              </div>
              <div className="text-emerald-600">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-xs sm:text-sm font-medium text-gray-600">Total Earnings</p>
              <p className="text-xl sm:text-3xl font-bold text-gray-900">{formatNaira(dashboardData.stats.totalEarnings)}</p>
              <div className="flex items-center gap-1 text-xs sm:text-sm">
                <span className="text-emerald-600 font-semibold">+12%</span>
                <span className="text-gray-500 hidden sm:inline">from last month</span>
                <span className="text-gray-500 sm:hidden">vs last</span>
              </div>
            </div>
          </div>

          <div className="group bg-white/80 backdrop-blur-sm p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="w-10 h-10 sm:w-14 sm:h-14 bg-gradient-to-br from-green-400 to-blue-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
                <CheckCircle className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
              </div>
              <div className="text-blue-600">
                <Activity className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-xs sm:text-sm font-medium text-gray-600">Jobs Completed</p>
              <p className="text-xl sm:text-3xl font-bold text-gray-900">{dashboardData.stats.jobsCompleted}</p>
              <div className="flex items-center gap-1 text-xs sm:text-sm">
                <span className="text-blue-600 font-semibold">+8</span>
                <span className="text-gray-500 hidden sm:inline">this week</span>
                <span className="text-gray-500 sm:hidden">this week</span>
              </div>
            </div>
          </div>

          <div className="group bg-white/80 backdrop-blur-sm p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="w-10 h-10 sm:w-14 sm:h-14 bg-gradient-to-br from-amber-400 to-yellow-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
                <Star className="w-5 h-5 sm:w-7 sm:h-7 text-white fill-current" />
              </div>
              <div className="text-amber-600">
                <Award className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-xs sm:text-sm font-medium text-gray-600">Average Rating</p>
              <p className="text-xl sm:text-3xl font-bold text-gray-900">{dashboardData.stats.averageRating > 0 ? dashboardData.stats.averageRating.toFixed(1) : '0.0'} ⭐</p>
              <div className="text-xs sm:text-sm text-gray-500">
                <span className="hidden sm:inline">Based on {dashboardData.stats.totalRatings} reviews</span>
                <span className="sm:hidden">reviews</span>
              </div>
            </div>
          </div>

          <div className="group bg-white/80 backdrop-blur-sm p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="w-10 h-10 sm:w-14 sm:h-14 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
                <Users className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
              </div>
              <div className="text-purple-600">
                <Target className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-xs sm:text-sm font-medium text-gray-600">Active Clients</p>
              <p className="text-xl sm:text-3xl font-bold text-gray-900">{dashboardData.stats.activeClients}</p>
              <div className="flex items-center gap-1 text-xs sm:text-sm">
                <span className="text-purple-600 font-semibold">+3</span>
                <span className="text-gray-500 hidden sm:inline">new this week</span>
                <span className="text-gray-500 sm:hidden">new</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Recent Jobs */}
          <div className="lg:col-span-2 space-y-6 sm:space-y-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100">
              <div className="p-4 sm:p-8 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-green-500 to-green-500 rounded-xl sm:rounded-2xl flex items-center justify-center">
                      <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Recent Jobs</h3>
                      <p className="text-gray-600 text-sm sm:text-base hidden sm:block">Your latest service activities</p>
                    </div>
                  </div>
                  <button className="text-green-600 hover:text-green-700 font-medium flex items-center gap-1 transition-colors text-sm sm:text-base">
                    <span className="hidden sm:inline">View All</span>
                    <span className="sm:hidden">All</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="p-4 sm:p-8">
                <div className="space-y-3 sm:space-y-4">
                  {dashboardData.recentJobs && dashboardData.recentJobs.map((job) => (
                    <div key={job.id} className="group p-4 sm:p-6 bg-gradient-to-r from-green-50 to-green-50 rounded-xl sm:rounded-2xl hover:from-green-50 hover:to-green-50 transition-all duration-300 hover:shadow-lg border border-gray-100">
                      {/* Mobile Layout */}
                      <div className="flex flex-col sm:hidden space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                              <span className="text-white font-bold text-xs">
                                {getClientInitials(job.client)}
                              </span>
                            </div>
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-base">{getCategoryIcon(job.category)}</span>
                                <h4 className="font-bold text-gray-900 text-sm group-hover:text-green-600 transition-colors">
                                  {job.title}
                                </h4>
                              </div>
                              <p className="text-sm text-gray-600 font-medium">{job.client}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-green-600">{formatNaira(job.payment)}</p>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold border ${getStatusColor(job.status)}`}>
                              {job.status}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between text-xs text-gray-600">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            <span className="truncate max-w-[120px]">{job.location}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              <span>{job.time}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Desktop Layout */}
                      <div className="hidden sm:flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                            <span className="text-white font-bold text-sm">
                              {getClientInitials(job.client)}
                            </span>
                          </div>
                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <span className="text-lg">{getCategoryIcon(job.category)}</span>
                              <h4 className="font-bold text-gray-900 group-hover:text-green-600 transition-colors">
                                {job.title}
                              </h4>
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(job.status)}`}>
                                {job.status}
                              </span>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <span className="font-medium">{job.client}</span>
                              <div className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                <span>{job.location}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-green-600 mb-1">{formatNaira(job.payment)}</p>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Calendar className="w-4 h-4" />
                            <span>{job.date}</span>
                            <Clock className="w-4 h-4" />
                            <span>{job.time}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {(!dashboardData.recentJobs || dashboardData.recentJobs.length === 0) && (
                    <div className="text-center py-8 text-gray-500">
                      <Activity className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <p className="font-medium">No recent jobs</p>
                      <p className="text-sm">Your completed jobs will appear here</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Bookings Section - FIXED: Shows upcoming bookings (pending and confirmed) */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100">
              <div className="p-4 sm:p-8 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-green-500 to-teal-500 rounded-xl sm:rounded-2xl flex items-center justify-center">
                      <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Recent Bookings</h3>
                      <p className="text-gray-600 text-sm sm:text-base hidden sm:block">Your upcoming appointments</p>
                    </div>
                  </div>
                  <button className="text-green-600 hover:text-green-700 font-medium flex items-center gap-1 transition-colors text-sm sm:text-base">
                    <span className="hidden sm:inline">View All</span>
                    <span className="sm:hidden">All</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="p-4 sm:p-8">
                <div className="space-y-4">
                  {upcomingBookings.map((booking) => (
                    <div key={booking._id} className="p-4 bg-gradient-to-r from-gray-50 to-green-50 rounded-xl sm:rounded-2xl hover:from-green-50 hover:to-teal-50 transition-all duration-300 hover:shadow-lg border border-gray-100">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
                            <span className="text-white font-bold text-xs sm:text-sm">
                              {getClientInitials(booking.customerName)}
                            </span>
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900 text-sm sm:text-base">{booking.serviceType}</h4>
                            <p className="text-gray-600 text-xs sm:text-sm">{booking.customerName}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
                              <span className="text-xs sm:text-sm text-gray-600">{formatDate(booking.requestedAt)}</span>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
                              <span className="text-xs sm:text-sm text-gray-600">{booking.location}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg sm:text-xl font-bold text-green-600">{booking.budget}</p>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold border ${getStatusColor(booking.status)}`}>
                            {booking.status}
                          </span>
                          <div className="mt-2 flex justify-end gap-2">
                            <button 
                              onClick={() => handleViewBooking(booking)}
                              className="p-1.5 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                              title="View Details"
                            >
                              <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                            </button>
                            <button 
                              onClick={() => handleContactCustomer(booking, 'email')}
                              className="p-1.5 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                              title="Send Email"
                            >
                              <Mail className="w-3 h-3 sm:w-4 sm:h-4" />
                            </button>
                            <button 
                              onClick={() => handleContactCustomer(booking, 'phone')}
                              className="p-1.5 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors"
                              title="Call Customer"
                            >
                              <Phone className="w-3 h-3 sm:w-4 sm:h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {upcomingBookings.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <p className="font-medium">No upcoming bookings</p>
                      <p className="text-sm">Your upcoming appointments will appear here</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4 sm:space-y-6">
            {/* Today's Schedule */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100">
              <div className="p-4 sm:p-6 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl sm:rounded-2xl flex items-center justify-center">
                    <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900">Today's Schedule</h3>
                    <p className="text-gray-600 text-xs sm:text-sm">{new Date().toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</p>
                  </div>
                </div>
              </div>
              <div className="p-4 sm:p-6">
                <div className="space-y-3 sm:space-y-4">
                  {schedule.map((task) => (
                    <div key={task.id} className={`relative p-3 sm:p-4 rounded-xl sm:rounded-2xl border-l-4 ${getPriorityColor(task.priority)} transition-all duration-200 hover:shadow-md`}>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-base sm:text-lg">{getCategoryIcon(task.category)}</span>
                        <h4 className="font-bold text-gray-900 text-xs sm:text-sm leading-tight">{task.title}</h4>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(task.status)}`}>
                          {task.status}
                        </span>
                      </div>
                      <p className="text-gray-600 text-xs sm:text-sm mb-1">{task.client}</p>
                      <p className="text-gray-500 text-xs mb-3">{task.location}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-green-600">
                          <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span>{task.time} - {task.endTime}</span>
                        </div>
                        <span className="text-xs bg-white/80 text-gray-600 px-2 py-1 rounded-lg">
                          {task.duration}
                        </span>
                      </div>
                      {task.payment && (
                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-xs font-medium text-green-600">{task.payment}</span>
                        </div>
                      )}
                    </div>
                  ))}
                  {schedule.length === 0 && (
                    <div className="text-center py-6 sm:py-8 text-gray-500">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-4">
                        <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
                      </div>
                      <p className="font-medium text-sm sm:text-base">No tasks scheduled</p>
                      <p className="text-xs sm:text-sm">Enjoy your free day!</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Business Hours */}
            {businessHours.length > 0 && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100">
                <div className="p-4 sm:p-6 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl sm:rounded-2xl flex items-center justify-center">
                      <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900">Business Hours</h3>
                      <p className="text-gray-600 text-xs sm:text-sm">Your weekly availability</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 sm:p-6">
                  <div className="space-y-3 sm:space-y-4">
                    {businessHours.map((hours, index) => (
                      <div key={index} className="p-3 sm:p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl sm:rounded-2xl border border-emerald-200">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-bold text-gray-900 text-xs sm:text-sm">{hours.dayOfWeek}</h4>
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${hours.isAvailable ? 'bg-emerald-500' : 'bg-gray-400'}`}></div>
                            <span className="text-xs text-gray-600">{hours.isAvailable ? 'Available' : 'Unavailable'}</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-xs sm:text-sm text-emerald-600 font-medium">
                            <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span>{formatTime(hours.startTime)} - {formatTime(hours.endTime)}</span>
                          </div>
                          {hours.serviceTypes.length > 0 && (
                            <p className="text-xs sm:text-sm text-gray-700 font-medium">
                              Services: {hours.serviceTypes.join(', ')}
                            </p>
                          )}
                          {hours.notes && (
                            <p className="text-xs sm:text-sm text-gray-500 mt-2 italic">{hours.notes}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Add Business Hours Modal */}
        {showAvailabilityModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 sm:p-8 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-600 to-green-600 rounded-xl sm:rounded-2xl flex items-center justify-center">
                      <Plus className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Set Business Hours</h2>
                      <p className="text-gray-600 text-sm sm:text-base">Configure your weekly availability</p>
                    </div>
                  </div>
                  <button 
                    onClick={handleCloseModal}
                    className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 hover:bg-gray-200 rounded-xl sm:rounded-2xl flex items-center justify-center transition-colors"
                  >
                    <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                  </button>
                </div>
              </div>
              
              <div className="p-6 sm:p-8 space-y-6">
                {/* Day Selection - Multiple Days */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Select Days <span className="text-red-500">*</span>
                    </label>
                    <button
                      onClick={handleSelectAllDays}
                      className="text-xs text-green-600 hover:text-green-700 font-medium"
                    >
                      {selectedDays.length === daysOfWeek.length ? 'Deselect All' : 'Select All'}
                    </button>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {daysOfWeek.map((day) => (
                      <button
                        key={day}
                        onClick={() => handleDaySelection(day)}
                        className={`p-2 text-xs font-medium rounded-lg transition-all ${
                          selectedDays.includes(day)
                            ? 'bg-green-600 text-white shadow-md'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {day.slice(0, 3)}
                      </button>
                    ))}
                  </div>
                  {selectedDays.length > 0 && (
                    <p className="text-xs text-gray-500 mt-2">
                      Selected: {selectedDays.join(', ')}
                    </p>
                  )}
                </div>

                {/* Time Range */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Start Time <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="time"
                      value={selectedDays.length > 0 ? getHoursForDay(selectedDays[0]).startTime : '09:00'}
                      onChange={(e) => updateHoursForDays(selectedDays, { startTime: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      disabled={selectedDays.length === 0}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      End Time <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="time"
                      value={selectedDays.length > 0 ? getHoursForDay(selectedDays[0]).endTime : '17:00'}
                      onChange={(e) => updateHoursForDays(selectedDays, { endTime: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      disabled={selectedDays.length === 0}
                    />
                  </div>
                </div>

                {/* Availability Toggle */}
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-semibold text-gray-700">
                    Available on selected days
                  </label>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedDays.length > 0 ? getHoursForDay(selectedDays[0]).isAvailable : true}
                      onChange={(e) => updateHoursForDays(selectedDays, { isAvailable: e.target.checked })}
                      className="sr-only peer"
                      disabled={selectedDays.length === 0}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                  </label>
                </div>

                {/* Service Types */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Service Types <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                    {serviceTypes.map((service) => {
                      const isSelected = selectedDays.length > 0 && getHoursForDay(selectedDays[0]).serviceTypes.includes(service);
                      return (
                        <button
                          key={service}
                          type="button"
                          onClick={() => handleServiceTypeToggle(service)}
                          className={`p-2 text-xs font-medium rounded-lg transition-all ${
                            isSelected
                              ? 'bg-green-100 text-green-700 border border-green-300'
                              : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                          }`}
                          disabled={selectedDays.length === 0}
                        >
                          {service}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Notes (Optional)
                  </label>
                  <textarea
                    value={selectedDays.length > 0 ? getHoursForDay(selectedDays[0]).notes : ''}
                    onChange={(e) => updateHoursForDays(selectedDays, { notes: e.target.value })}
                    placeholder="Any special requirements or notes..."
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none"
                    disabled={selectedDays.length === 0}
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-6 sm:p-8 border-t border-gray-100 flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button
                  onClick={handleCloseModal}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl sm:rounded-2xl hover:bg-gray-50 transition-all duration-200 font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveBusinessHours}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-purple-600 text-white rounded-xl sm:rounded-2xl hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 font-semibold hover:scale-105"
                >
                  <Save className="w-5 h-5" />
                  <span>Save All Hours</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Booking Details Modal */}
        {showBookingModal && selectedBooking && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 sm:p-8 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl sm:rounded-2xl flex items-center justify-center">
                      <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Booking Details</h2>
                      <p className="text-gray-600 text-sm sm:text-base">Appointment information</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowBookingModal(false)}
                    className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 hover:bg-gray-200 rounded-xl sm:rounded-2xl flex items-center justify-center transition-colors"
                  >
                    <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                  </button>
                </div>
              </div>
              
              <div className="p-6 sm:p-8 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Client Name
                    </label>
                    <p className="text-gray-900">{selectedBooking.customerName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Service
                    </label>
                    <p className="text-gray-900">{selectedBooking.serviceType}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Date Requested
                    </label>
                    <p className="text-gray-900">{formatDate(selectedBooking.requestedAt)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Timeframe
                    </label>
                    <p className="text-gray-900">{selectedBooking.timeframe}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Location
                  </label>
                  <p className="text-gray-900">{selectedBooking.location}</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Budget
                  </label>
                  <p className="text-2xl font-bold text-green-600">{selectedBooking.budget}</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Status
                  </label>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(selectedBooking.status)}`}>
                    {selectedBooking.status}
                  </span>
                </div>

                {selectedBooking.description && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Description
                    </label>
                    <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{selectedBooking.description}</p>
                  </div>
                )}

                {selectedBooking.specialRequests && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Special Requests
                    </label>
                    <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{selectedBooking.specialRequests}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Contact Email
                    </label>
                    <p className="text-gray-900">{selectedBooking.customerEmail}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Contact Phone
                    </label>
                    <p className="text-gray-900">{selectedBooking.customerPhone}</p>
                  </div>
                </div>

                <div>
  <label className="block text-sm font-semibold text-gray-700 mb-2">
    Update Status
  </label>
  <div className="space-y-2">
    <button 
      onClick={() => {
        console.log('Accept button clicked - verification status:', isUserVerified());
        handleUpdateBookingStatus(selectedBooking._id, 'confirmed');
      }}
      className={`w-full px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
        !isUserVerified() 
          ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
          : 'bg-green-600 text-white hover:bg-green-700'
      }`}
      disabled={!isUserVerified() || selectedBooking.status === 'confirmed' || selectedBooking.status === 'completed'}
    >
      {!isUserVerified() ? 'Verify Identity to Accept' : 'Accept Booking'}
    </button>
    
    <button 
      onClick={() => handleUpdateBookingStatus(selectedBooking._id, 'completed')}
      className={`w-full px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
        !isUserVerified() 
          ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
          : 'bg-blue-600 text-white hover:bg-blue-700'
      }`}
      disabled={!isUserVerified() || selectedBooking.status === 'completed' || selectedBooking.status !== 'confirmed'}
    >
      {!isUserVerified() ? 'Verify Identity to Complete' : 'Complete & Rate'}
    </button>
    
    <button 
      onClick={() => handleUpdateBookingStatus(selectedBooking._id, 'cancelled')}
      className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
      disabled={selectedBooking.status === 'cancelled'}
    >
      Cancel Booking
    </button>
  </div>
  
  {!isUserVerified() && (
    <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
      <p className="text-sm text-yellow-800 text-center">
        <strong>Identity Verification Required</strong>
      </p>
      <button
        onClick={() => {
          setShowVerificationModal(true);
          setShowBookingModal(false);
        }}
        className="w-full mt-2 px-4 py-2 bg-yellow-500 text-white rounded text-sm hover:bg-yellow-600 font-medium"
      >
        {userVerification?.hasSubmittedVerification ? 'Verification Pending' : 'Start Verification'}
      </button>
    </div>
  )}
</div>


                {/* <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Contact Customer
                  </label>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleContactCustomer(selectedBooking, 'email')}
                      className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm font-medium flex items-center gap-2"
                    >
                      <Mail className="w-4 h-4" />
                      Email
                    </button>
                    <button 
                      onClick={() => handleContactCustomer(selectedBooking, 'phone')}
                      className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm font-medium flex items-center gap-2"
                    >
                      <Phone className="w-4 h-4" />
                      Call
                    </button>
                  </div>
                </div> */}
              </div>

              <div className="p-6 sm:p-8 border-t border-gray-100">
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-green-600 text-white rounded-xl sm:rounded-2xl hover:shadow-xl transition-all duration-200 font-semibold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Rating Modal */}
        <RatingModal
          isOpen={showRatingModal}
          booking={ratingBooking!}
          onClose={() => {
            setShowRatingModal(false);
            setRatingBooking(null);
          }}
          onSubmit={handleRatingSubmit}
          type={ratingType}
        />

        {/* Identity Verification Modal */}
        <IdentityVerificationModal
          isOpen={showVerificationModal}
          onClose={() => {
            setShowVerificationModal(false);
            setPendingBookingAction(null);
          }}
          onVerify={handleIdentityVerify}
          isSubmitting={isSubmittingVerification}
          hasSubmittedVerification={userVerification?.hasSubmittedVerification || false}
        />
      </div>
    </div>
  );
};

export default Dashboard;