import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import {
  Star,
  MapPin,
  Clock,
  Phone,
  Mail,
  MessageCircle,
  ArrowLeft,
  Shield,
  Award,
  CheckCircle,
  Calendar,
  Users,
  Zap,
  Eye,
  X,
  DollarSign,
  User,
} from "lucide-react";

interface ProviderProfile {
  _id: string;
  name: string;
  email: string;
  services: string[];
  hourlyRate: number;
  averageRating: number;
  city: string;
  state: string;
  country: string;
  profileImage?: string;
  isAvailableNow: boolean;
  experience: string;
  phoneNumber?: string;
  address?: string;
  reviewCount: number;
  completedJobs: number;
  isVerified?: boolean;
  isTopRated?: boolean;
  responseTime?: string;
  joinedDate?: string;
}

interface GalleryImage {
  id: string;
  url: string;
  title: string;
  description?: string;
  category: string;
  uploadDate: string;
}

interface Review {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  date: string;
  service: string;
  customerAvatar?: string;
}

interface BookingFormData {
  serviceType: string;
  description: string;
  date: string;
  time: string;
  location: string;
  budget: string;
  contactPhone: string;
  contactEmail: string;
  specialRequests: string;
}

const API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://backendhomeheroes.onrender.com"
    : "http://localhost:3001";

// Helper function for image URLs
const getFullImageUrl = (url: string | undefined): string | undefined => {
  if (!url) return undefined;
  if (url.startsWith("http")) return url;
  if (url.startsWith("/")) return `${API_BASE_URL}${url}`;
  return `${API_BASE_URL}/uploads/${url}`;
};

// BookingModal Component
const BookingModal: React.FC<{
  isOpen: boolean;
  provider: ProviderProfile;
  currentUser: {
    id: string;
    name: string;
    email: string;
    phoneNumber?: string;
    address?: string;
  };
  onClose: () => void;
  onConfirm: (bookingData: any) => Promise<void>;
  serviceType: "immediate" | "long-term";
}> = ({ isOpen, provider, currentUser, onClose, onConfirm, serviceType }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<BookingFormData>({
    serviceType: provider.services[0] || "",
    description: "",
    date: "",
    time: "",
    location: currentUser.address || "",
    budget: `₦${provider.hourlyRate || 0}`,
    contactPhone: currentUser.phoneNumber || "",
    contactEmail: currentUser.email || "",
    specialRequests: "",
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const bookingData = {
        providerId: provider._id,
        providerName: provider.name,
        providerEmail: provider.email,
        serviceType: formData.serviceType,
        description: formData.description,
        location: formData.location,
        timeframe:
          serviceType === "immediate"
            ? "ASAP"
            : formData.date
            ? `${formData.date} at ${formData.time}`
            : "Flexible",
        budget: formData.budget,
        contactInfo: {
          phone: formData.contactPhone,
          email: formData.contactEmail,
          name: currentUser.name,
        },
        specialRequests: formData.specialRequests,
        bookingType: serviceType,
        requestedAt: new Date().toISOString(),
      };

      await onConfirm(bookingData);
      onClose();
    } catch (error) {
      console.error("Booking error:", error);
      alert("Failed to submit booking. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 transition-colors ${
          i < Math.floor(rating)
            ? "text-amber-400 fill-current"
            : "text-gray-300"
        }`}
      />
    ));
  };

  const rating = provider.averageRating || 4.5;
  const reviewCount = provider.reviewCount || 0;
  const locationText = `${provider.city}, ${provider.state}`;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/95 backdrop-blur-md rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden border border-gray-200/50 shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Book {provider.name}</h2>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-xl"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Provider Info Card */}
          <div className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-2xl p-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-white font-bold text-xl">
              {provider.profileImage ? (
                <img
                  src={getFullImageUrl(provider.profileImage)}
                  alt={provider.name}
                  className="w-16 h-16 rounded-2xl object-cover"
                />
              ) : (
                getInitials(provider.name)
              )}
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-lg font-semibold text-white">
                  {provider.name}
                </h3>
                {provider.isVerified && (
                  <Shield className="w-4 h-4 text-blue-200" />
                )}
                {provider.isTopRated && (
                  <Award className="w-4 h-4 text-amber-300" />
                )}
              </div>

              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center">{renderStars(rating)}</div>
                <span className="text-sm font-medium text-white">
                  {rating.toFixed(1)}
                </span>
                <span className="text-sm text-white/70">
                  ({reviewCount} reviews)
                </span>
              </div>

              <div className="flex items-center gap-4 text-sm text-white/80">
                <span>{locationText}</span>
                <span>{provider.experience}</span>
                {provider.isAvailableNow && serviceType === "immediate" && (
                  <span className="bg-emerald-500/30 text-emerald-200 px-2 py-1 rounded-lg text-xs font-medium">
                    Available Now
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <div className="max-h-[60vh] overflow-y-auto">
            <div className="p-6 space-y-6">
              {/* Service Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Service Type *
                </label>
                <select
                  name="serviceType"
                  value={formData.serviceType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
                  required
                >
                  {provider.services.map((service, index) => (
                    <option key={index} value={service}>
                      {service}
                    </option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe what you need help with..."
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm resize-none"
                />
              </div>

              {serviceType === "long-term" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Date */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <Calendar className="w-4 h-4 inline mr-1" />
                      Preferred Date
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      min={new Date().toISOString().split("T")[0]}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
                    />
                  </div>

                  {/* Time */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <Clock className="w-4 h-4 inline mr-1" />
                      Preferred Time
                    </label>
                    <input
                      type="time"
                      name="time"
                      value={formData.time}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
                    />
                  </div>
                </div>
              )}

              {/* Location */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Service Location *
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="Enter the address where service is needed"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
                  required
                />
              </div>

              {/* Budget */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <DollarSign className="w-4 h-4 inline mr-1" />
                  Budget Range
                </label>
                <input
                  type="text"
                  name="budget"
                  value={formData.budget}
                  onChange={handleInputChange}
                  placeholder="e.g., ₦5,000 - ₦10,000"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
                />
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                  Contact Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <User className="w-4 h-4 inline mr-1" />
                      Your Name
                    </label>
                    <input
                      type="text"
                      value={currentUser.name}
                      disabled
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50/80 backdrop-blur-sm text-gray-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <Mail className="w-4 h-4 inline mr-1" />
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={currentUser.email}
                      disabled
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50/80 backdrop-blur-sm text-gray-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Phone className="w-4 h-4 inline mr-1" />
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="contactPhone"
                    value={formData.contactPhone}
                    onChange={handleInputChange}
                    placeholder="Enter your phone number"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
                    required
                  />
                </div>
              </div>

              {/* Special Requests */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Special Requests or Notes
                </label>
                <textarea
                  name="specialRequests"
                  value={formData.specialRequests}
                  onChange={handleInputChange}
                  placeholder="Any special requirements, tools needed, or additional information..."
                  rows={2}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm resize-none"
                />
              </div>

              {/* Booking Summary */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/50 rounded-2xl p-4">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Booking Summary
                </h3>
                <div className="space-y-1 text-sm text-gray-700">
                  <div className="flex justify-between">
                    <span>Service:</span>
                    <span className="font-medium">
                      {formData.serviceType || "Not selected"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Type:</span>
                    <span className="font-medium capitalize">
                      {serviceType}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Provider:</span>
                    <span className="font-medium">{provider.name}</span>
                  </div>
                  {serviceType === "immediate" && (
                    <div className="flex justify-between">
                      <span>Availability:</span>
                      <span className="font-medium text-emerald-600">
                        Available Now
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50/80 backdrop-blur-sm border-t border-gray-200/50 p-6 mt-auto">
            <div className="flex flex-col sm:flex-row justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-6 py-3 text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-100 transition-all duration-200 font-medium disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-xl hover:scale-105 transition-all duration-300 font-semibold shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Submitting...
                  </div>
                ) : (
                  `${
                    serviceType === "immediate"
                      ? "Book Now"
                      : "Send Quote Request"
                  }`
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

const ProviderProfilePage: React.FC = () => {
  const { providerId } = useParams<{ providerId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const [provider, setProvider] = useState<ProviderProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [galleryLoading, setGalleryLoading] = useState(false);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingServiceType, setBookingServiceType] = useState<
    "immediate" | "long-term"
  >("immediate");

  // Mock current user - replace with actual user data from your auth context
  const currentUser = {
    id: "current-user-id",
    name: "John Doe",
    email: "john.doe@example.com",
    phoneNumber: "+234 123 456 7890",
    address: "Lagos, Nigeria",
  };

  // Get provider data from location state or fetch from API
  useEffect(() => {
    const fetchProviderProfile = async () => {
      try {
        setLoading(true);

        // First check if provider data was passed via navigation state
        if (location.state?.provider) {
          setProvider(location.state.provider);
          setLoading(false);
          return;
        }

        // If not, fetch from API
        if (providerId) {
          const response = await fetch(
            `${API_BASE_URL}/api/providers/${providerId}`
          );

          if (!response.ok) {
            throw new Error("Failed to fetch provider profile");
          }

          const data = await response.json();

          if (data.success) {
            setProvider(data.data);
          } else {
            throw new Error(data.message || "Failed to load provider profile");
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchProviderProfile();
  }, [providerId, location.state]);

  // Fetch gallery images
  const fetchGalleryImages = async () => {
    if (!providerId) return;

    try {
      setGalleryLoading(true);
      const response = await fetch(
        `${API_BASE_URL}/api/providers/${providerId}/gallery`
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setGalleryImages(data.data);
        } else {
          setGalleryImages(getSampleGalleryImages());
        }
      } else {
        setGalleryImages(getSampleGalleryImages());
      }
    } catch (error) {
      console.error("Error fetching gallery:", error);
      setGalleryImages(getSampleGalleryImages());
    } finally {
      setGalleryLoading(false);
    }
  };

  // Fetch reviews
  const fetchReviews = async () => {
    if (!providerId) return;

    try {
      setReviewsLoading(true);
      const response = await fetch(
        `${API_BASE_URL}/api/providers/${providerId}/reviews`
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setReviews(data.data);
        } else {
          setReviews(getSampleReviews());
        }
      } else {
        setReviews(getSampleReviews());
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setReviews(getSampleReviews());
    } finally {
      setReviewsLoading(false);
    }
  };

  // Load gallery and reviews when provider data is available
  useEffect(() => {
    if (provider) {
      fetchGalleryImages();
      fetchReviews();
    }
  }, [provider]);

  const handleBookNow = () => {
    if (provider) {
      setBookingServiceType(
        provider.isAvailableNow ? "immediate" : "long-term"
      );
      setShowBookingModal(true);
    }
  };

  const handleBookingConfirm = async (bookingData: any) => {
    try {
      console.log("Booking data:", bookingData);

      const response = await fetch(`${API_BASE_URL}/api/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      });

      if (response.ok) {
        const result = await response.json();
        alert(
          "Booking request submitted successfully! The provider will be notified."
        );
        setShowBookingModal(false);
      } else {
        throw new Error("Failed to submit booking request");
      }
    } catch (error) {
      console.error("Booking error:", error);
      throw error;
    }
  };

  // FIXED: Enhanced handleSendMessage function with proper event handling
  const handleSendMessage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (provider) {
      console.log('🔄 Message button clicked, navigating to messages with provider:', provider);
      
      // Create conversation data to pass to messages page
      const conversationData = {
        id: `conv-${provider._id}`, // Generate conversation ID
        providerId: provider._id,
        providerName: provider.name,
        providerService: provider.services[0] || 'General Service',
        providerAvatar: provider.profileImage,
        isOnline: provider.isAvailableNow || false,
        unreadCount: 0,
        lastMessage: {
          id: 'initial',
          senderId: 'system',
          content: 'Start a conversation with this provider',
          timestamp: new Date(),
          status: 'sent' as const
        }
      };

      // Navigate to messages page with provider data to start conversation
      navigate('/customer/messages', { 
        state: { 
          provider,
          conversation: conversationData,
          startNewConversation: true
        }
      });
    }
  };

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 sm:w-5 sm:h-5 ${
          i < Math.floor(rating)
            ? "text-yellow-400 fill-current"
            : "text-gray-300"
        }`}
      />
    ));
  };

  const renderReviewStars = (rating: number, size = "w-4 h-4") => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`${size} ${
          i < Math.floor(rating)
            ? "text-yellow-400 fill-current"
            : "text-gray-300"
        }`}
      />
    ));
  };

  // Sample data functions
  const getSampleGalleryImages = (): GalleryImage[] => [
    {
      id: "1",
      url: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=500&h=400&fit=crop",
      title: "Kitchen Renovation",
      description: "Complete kitchen remodeling with modern fixtures",
      category: "Renovation",
      uploadDate: "2024-01-15",
    },
    {
      id: "2",
      url: "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=500&h=400&fit=crop",
      title: "Bathroom Upgrade",
      description: "Luxury bathroom upgrade with premium tiles",
      category: "Plumbing",
      uploadDate: "2024-01-10",
    },
    {
      id: "3",
      url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=500&h=400&fit=crop",
      title: "Living Room Painting",
      description: "Professional painting with eco-friendly materials",
      category: "Painting",
      uploadDate: "2024-01-05",
    },
    {
      id: "4",
      url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&h=400&fit=crop",
      title: "Furniture Assembly",
      description: "Expert furniture assembly and setup",
      category: "Assembly",
      uploadDate: "2024-01-02",
    },
    {
      id: "5",
      url: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=500&h=400&fit=crop",
      title: "Garden Maintenance",
      description: "Professional garden care and maintenance",
      category: "Gardening",
      uploadDate: "2023-12-28",
    },
    {
      id: "6",
      url: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=500&h=400&fit=crop",
      title: "Home Cleaning",
      description: "Deep cleaning and sanitization",
      category: "Cleaning",
      uploadDate: "2023-12-25",
    },
  ];

  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    const target = e.target as HTMLImageElement;
    console.error("Image failed to load:", target.src);

    target.style.display = "none";
    const parent = target.parentElement;
    if (parent) {
      const fallback = parent.querySelector(".fallback-initials");
      if (fallback) {
        (fallback as HTMLElement).style.display = "flex";
      }
    }
  };

  const handleImageLoad = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    console.log("Image loaded successfully:", e.currentTarget.src);
  };

  const getSampleReviews = (): Review[] => [
    {
      id: "1",
      customerName: "Sarah Johnson",
      rating: 5,
      comment:
        "Excellent work! The kitchen renovation exceeded my expectations. Professional and timely completion.",
      date: "2024-01-20",
      service: "Kitchen Renovation",
      customerAvatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
    },
    {
      id: "2",
      customerName: "Michael Brown",
      rating: 4,
      comment:
        "Good quality painting work. Clean and efficient service. Would recommend for home projects.",
      date: "2024-01-18",
      service: "House Painting",
      customerAvatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    },
    {
      id: "3",
      customerName: "Emily Davis",
      rating: 5,
      comment:
        "Outstanding plumbing service! Fixed the issue quickly and explained everything clearly.",
      date: "2024-01-15",
      service: "Plumbing Repair",
      customerAvatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    },
    {
      id: "4",
      customerName: "Robert Wilson",
      rating: 4,
      comment:
        "Professional and reliable. The garden looks amazing after the maintenance work.",
      date: "2024-01-12",
      service: "Garden Maintenance",
      customerAvatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    },
  ];

  const tabs = [
    { id: "overview", name: "Overview" },
    { id: "services", name: "Services" },
    { id: "gallery", name: "Gallery" },
    { id: "reviews", name: "Reviews" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading provider profile...</p>
        </div>
      </div>
    );
  }

  if (error || !provider) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Eye className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Provider Not Found
          </h3>
          <p className="text-gray-600 mb-4">
            {error || "The provider profile could not be loaded."}
          </p>
          <button
            onClick={() => navigate(-1)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
              Provider Profile
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-4 sm:py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-8 mb-4 sm:mb-8">
          <div className="flex flex-col gap-6">
            {/* Profile Image and Basic Info */}
            <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
              <div className="relative mx-auto sm:mx-0">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl sm:text-2xl overflow-hidden relative">
                  {provider.profileImage ? (
                    <>
                      <img
                        src={getFullImageUrl(provider.profileImage)}
                        alt={provider.name}
                        className="w-full h-full object-cover"
                        onError={handleImageError}
                        onLoad={handleImageLoad}
                      />
                      <div
                        className="fallback-initials absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl sm:text-2xl"
                        style={{ display: "none" }}
                      >
                        {provider.name.charAt(0).toUpperCase()}
                      </div>
                    </>
                  ) : (
                    provider.name.charAt(0).toUpperCase()
                  )}
                </div>
                {provider.isAvailableNow && (
                  <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-5 h-5 sm:w-6 sm:h-6 bg-green-500 rounded-full flex items-center justify-center animate-pulse">
                    <Zap className="w-2 h-2 sm:w-3 sm:h-3 text-white" />
                  </div>
                )}
              </div>

              <div className="flex-1 text-center sm:text-left">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-3">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                    {provider.name}
                  </h2>
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    {provider.isVerified && (
                      <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />
                    )}
                    {provider.isTopRated && (
                      <Award className="w-5 h-5 sm:w-6 sm:h-6 text-amber-500" />
                    )}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-4">
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    {renderStars(provider.averageRating)}
                    <span className="font-bold text-gray-900">
                      {provider.averageRating.toFixed(1)}
                    </span>
                    <span className="text-gray-600 text-sm">
                      ({provider.reviewCount} reviews)
                    </span>
                  </div>
                </div>

                <div className="space-y-2 text-sm sm:text-base text-gray-600">
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <MapPin className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                    <span className="truncate">
                      {provider.city}, {provider.state}, {provider.country}
                    </span>
                  </div>
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <Clock className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                    <span>
                      Response time: {provider.responseTime || "Within 1 hour"}
                    </span>
                  </div>
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <Users className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                    <span>{provider.completedJobs} jobs completed</span>
                  </div>
                  {provider.joinedDate && (
                    <div className="flex items-center justify-center sm:justify-start gap-2">
                      <Calendar className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                      <span>Member since {provider.joinedDate}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleBookNow}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 flex-1 sm:flex-none"
              >
                Book Now
              </button>
              {/* FIXED: Message button with enhanced functionality */}
              <button
                onClick={handleSendMessage}
                className="bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 flex-1 sm:flex-none hover:border-blue-300 hover:text-blue-600"
              >
                <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">Send Message</span>
                <span className="sm:hidden">Message</span>
              </button>
              {provider.phoneNumber && (
                <a
                  href={`tel:${provider.phoneNumber}`}
                  className="bg-green-50 text-green-700 px-6 py-3 rounded-xl font-semibold hover:bg-green-100 transition-colors flex items-center justify-center gap-2 flex-1 sm:flex-none"
                >
                  <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="hidden sm:inline">Call Provider</span>
                  <span className="sm:hidden">Call</span>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 mb-4 sm:mb-8">
          <div className="border-b border-gray-200 overflow-x-auto">
            <nav className="flex px-4 sm:px-6 min-w-max sm:min-w-0">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-3 sm:py-4 px-4 sm:px-6 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-4 sm:p-6">
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
                {/* Services */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Services Offered */}
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
                      Services Offered
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {provider.services.map((service, index) => (
                        <div
                          key={index}
                          className="bg-blue-50 text-blue-700 px-3 sm:px-4 py-2 sm:py-3 rounded-lg font-medium text-center text-sm"
                        >
                          {service}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Experience and Pricing */}
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
                      Professional Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                      <div>
                        <h4 className="font-semibold text-gray-700 mb-2">
                          Experience
                        </h4>
                        <p className="text-gray-900">{provider.experience}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-700 mb-2">
                          Hourly Rate
                        </h4>
                        <p className="text-xl sm:text-2xl font-bold text-green-600">
                          ₦{provider.hourlyRate}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stats and Contact */}
                <div className="space-y-6">
                  {/* Stats */}
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
                      Performance Stats
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Completed Jobs</span>
                        <span className="font-bold text-gray-900">
                          {provider.completedJobs}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Response Rate</span>
                        <span className="font-bold text-green-600">98%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">On-time Delivery</span>
                        <span className="font-bold text-green-600">95%</span>
                      </div>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
                      Contact Information
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700 text-sm break-all">
                          {provider.email}
                        </span>
                      </div>
                      {provider.phoneNumber && (
                        <div className="flex items-center gap-3">
                          <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
                          <span className="text-gray-700 text-sm">
                            {provider.phoneNumber}
                          </span>
                        </div>
                      )}
                      {provider.address && (
                        <div className="flex items-start gap-3">
                          <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700 text-sm">
                            {provider.address}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Services Tab */}
            {activeTab === "services" && (
              <div className="space-y-6">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
                  All Services
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {provider.services.map((service, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                          <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                        </div>
                        <h4 className="font-bold text-gray-900 text-base sm:text-lg">
                          {service}
                        </h4>
                      </div>
                      <p className="text-gray-600 mb-4 text-sm">
                        Professional {service.toLowerCase()} services with years
                        of experience and quality guarantee.
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xl sm:text-2xl font-bold text-green-600">
                          ₦{provider.hourlyRate}
                        </span>
                        <span className="text-xs sm:text-sm text-gray-500">
                          per hour
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Gallery Tab */}
            {activeTab === "gallery" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                    Work Gallery
                  </h3>
                  <span className="text-gray-600 text-sm">
                    {galleryImages.length} projects
                  </span>
                </div>

                {galleryLoading ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                    {[...Array(8)].map((_, i) => (
                      <div
                        key={i}
                        className="aspect-square bg-gray-200 rounded-xl sm:rounded-2xl animate-pulse"
                      ></div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                    {galleryImages.map((image) => (
                      <div
                        key={image.id}
                        className="group relative bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300"
                        onClick={() => setSelectedImage(image)}
                      >
                        <div className="aspect-square bg-gray-100 relative">
                          <img
                            src={getFullImageUrl(image.url)}
                            alt={image.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              console.error(
                                "Gallery image failed to load:",
                                target.src
                              );
                              target.style.display = "none";
                              // You could add a fallback image here
                            }}
                            onLoad={handleImageLoad}
                          />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="absolute bottom-0 left-0 right-0 p-4">
                            <h4 className="text-white font-semibold text-sm mb-1 line-clamp-2">
                              {image.title}
                            </h4>
                            <p className="text-gray-300 text-xs line-clamp-2">
                              {image.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === "reviews" && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                      Customer Reviews
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Based on {reviews.length} verified reviews
                    </p>
                  </div>
                  <div className="flex items-center gap-3 bg-blue-50 px-4 py-2 rounded-xl w-fit">
                    <div className="flex items-center gap-1">
                      {renderReviewStars(
                        provider.averageRating,
                        "w-4 h-4 sm:w-5 sm:h-5"
                      )}
                    </div>
                    <span className="font-bold text-gray-900 text-sm sm:text-base">
                      {provider.averageRating.toFixed(1)}
                    </span>
                  </div>
                </div>

                {reviewsLoading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6 animate-pulse"
                      >
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 rounded-full"></div>
                          <div className="space-y-2">
                            <div className="h-3 sm:h-4 bg-gray-200 rounded w-24 sm:w-32"></div>
                            <div className="h-2 sm:h-3 bg-gray-200 rounded w-16 sm:w-24"></div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="h-3 sm:h-4 bg-gray-200 rounded w-full"></div>
                          <div className="h-3 sm:h-4 bg-gray-200 rounded w-3/4"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <div
                        key={review.id}
                        className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6"
                      >
                        <div className="flex items-start gap-3 sm:gap-4 mb-4">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base overflow-hidden flex-shrink-0">
                            {review.customerAvatar ? (
                              <img
                                src={review.customerAvatar}
                                alt={review.customerName}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              review.customerName.charAt(0).toUpperCase()
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2 mb-2">
                              <h4 className="font-bold text-gray-900 text-sm sm:text-base truncate">
                                {review.customerName}
                              </h4>
                              <span className="text-xs sm:text-sm text-gray-500">
                                {review.date}
                              </span>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                              <div className="flex items-center gap-1">
                                {renderReviewStars(review.rating)}
                              </div>
                              <span className="text-xs sm:text-sm text-blue-600 font-medium">
                                {review.service}
                              </span>
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                          {review.comment}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Gallery Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 truncate pr-4">
                {selectedImage.title}
              </h3>
              <button
                onClick={() => setSelectedImage(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            <div className="p-4 sm:p-6 max-h-[calc(90vh-80px)] overflow-y-auto">
              <div className="grid lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden">
                    <img
                      src={getFullImageUrl(selectedImage.url)}
                      alt={selectedImage.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        console.error(
                          "Modal image failed to load:",
                          target.src
                        );
                        // You could set a fallback image here
                        target.src =
                          "https://via.placeholder.com/800x600?text=Image+Not+Found";
                      }}
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                      Project Details
                    </h4>
                    <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                      {selectedImage.description ||
                        "No description available for this project."}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-3 sm:p-4 rounded-xl">
                      <p className="text-xs sm:text-sm text-gray-600">
                        Category
                      </p>
                      <p className="font-semibold text-gray-900 capitalize text-sm sm:text-base">
                        {selectedImage.category}
                      </p>
                    </div>
                    <div className="bg-green-50 p-3 sm:p-4 rounded-xl">
                      <p className="text-xs sm:text-sm text-gray-600">
                        Upload Date
                      </p>
                      <p className="font-semibold text-gray-900 text-sm sm:text-base">
                        {new Date(
                          selectedImage.uploadDate
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedImage(null);
                      handleBookNow();
                    }}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
                  >
                    Book Similar Service
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Booking Modal */}
      {showBookingModal && (
        <BookingModal
          isOpen={showBookingModal}
          provider={provider}
          currentUser={currentUser}
          onClose={() => setShowBookingModal(false)}
          onConfirm={handleBookingConfirm}
          serviceType={bookingServiceType}
        />
      )}
    </div>
  );
};

export default ProviderProfilePage;