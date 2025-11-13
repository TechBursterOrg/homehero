// customerpages/Customer.tsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import { ArrowRight, MoreVertical, Users } from "lucide-react";
import { Routes, Route, useNavigate } from "react-router-dom";
import ProfilePage from "../customercomponents/CustomerProfile";

// Components
import Header from "../customercomponents/Header";
import HeroSection from "../customercomponents/HeroSection";
import ServiceCard from "../customercomponents/ServiceCard";
import PostJobModal from "../customercomponents/PostJobModal";
import BookingModal from "../customercomponents/BookingModal";
import MapView from "../customercomponents/MapView";
import ProvidersList from "../customercomponents/ProvidersList";

// Pages
import BookingsPage from "./BookingsPage";
import JobsPage from "./JobsPage";
import FavoritesPage from "./FavoritesPage";
import MessagesPage from "./MessagesPage";
import ProviderProfilePage from "../customercomponents/ProviderProfilePage";
import WorkingMapView from "../customercomponents/WorkingMapView";
import StandaloneMapView from "../customercomponents/StandaloneMapView";
import PaymentStatusPage from '../customercomponents/PaymentStatusPage';


// Types and Data
import {
  ServiceType,
  UserProfile,
  Service,
  Provider as ProviderType,
  LocationData,
  ChatState,
} from "../types";
import { services } from "../data/mockData";

const API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://backendhomeheroes.onrender.com"
    : "http://localhost:3001";

interface ExtendedUserProfile extends UserProfile {
  id: string;
}

const CustomerContent: React.FC = () => {
  // State for search parameters (typing state)
  const [searchQuery, setSearchQuery] = useState("");
  const [currentLocationAddress, setCurrentLocationAddress] = useState("");

  // Search execution state - only updated when actual search is performed
  const [searchParams, setSearchParams] = useState({
    query: "",
    location: "",
    serviceType: "immediate" as ServiceType,
    searchRadius: 10,
  });

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [serviceType, setServiceType] = useState<ServiceType>("immediate");
  const [showPostJob, setShowPostJob] = useState(false);

  // BookingModal state
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedProviderForBooking, setSelectedProviderForBooking] =
    useState<ProviderType | null>(null);

  const [favorites, setFavorites] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [searchRadius, setSearchRadius] = useState(10);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(
    null
  );
  const [selectedProvider, setSelectedProvider] = useState<ProviderType | null>(
    null
  );
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [providers, setProviders] = useState<ProviderType[]>([]); // ADDED: State to store providers
  const navigate = useNavigate();

  const providersRef = useRef<HTMLDivElement>(null);

  const [profileData, setProfileData] = useState<ExtendedUserProfile>({
    id: "user-1",
    name: "John Doe",
    email: "john.doe@email.com",
    phone: "+1 (555) 123-4567",
    address: "123 Main St, City, State 12345",
    bio: "Homeowner looking for reliable service providers for regular maintenance and repairs.",
    avatar: null,
  });

  const [chatState, setChatState] = useState<ChatState>({
    conversations: [],
    activeConversation: null,
    messages: {},
  });

  const [customerAlert, setCustomerAlert] = useState<{
    show: boolean;
    message: string;
    providerName: string;
  }>({
    show: false,
    message: "",
    providerName: "",
  });

  const unreadMessagesCount = chatState.conversations.reduce(
    (total, conv) => total + (conv.unreadCount || 0),
    0
  );

  

  // Fetch providers data
  const fetchProviders = useCallback(async () => {
    try {
      const token =
        authToken ||
        localStorage.getItem("authToken") ||
        localStorage.getItem("token");
      if (!token) return;

      // Build query parameters
      const params = new URLSearchParams();
      if (searchParams.query) params.append("service", searchParams.query);
      if (searchParams.location)
        params.append("location", searchParams.location);
      if (searchParams.serviceType)
        params.append("serviceType", searchParams.serviceType);
      params.append("radius", searchParams.searchRadius.toString());

      const response = await fetch(
        `${API_BASE_URL}/api/providers?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Transform the API response to match our Provider type
          const transformedProviders: ProviderType[] = data.data.providers.map(
            (provider: any) => ({
              id: provider._id || provider.id,
              _id: provider._id,
              name: provider.name || "Unknown Provider",
              avatar: provider.profileImage || provider.avatar || "P",
              rating: provider.rating || 0,
              reviewCount: provider.reviewCount || 0,
              location:
                provider.address ||
                provider.location ||
                "Location not specified",
              coordinates: provider.coordinates || [6.5244, 3.3792], // Default to Lagos coordinates
              services: provider.services || provider.skills || [],
              priceRange: provider.priceRange || "Contact for pricing",
              isAvailableNow:
                provider.isAvailable || provider.isAvailableNow || false,
              isVerified: provider.isVerified || false,
              isTopRated: provider.rating >= 4.5 || false,
              phoneNumber: provider.phoneNumber || provider.contactNumber,
            })
          );
          setProviders(transformedProviders);
        }
      } else {
        console.error("Failed to fetch providers");
        // Fallback to mock data or empty array
        setProviders([]);
      }
    } catch (error) {
      console.error("Error fetching providers:", error);
      setProviders([]);
    }
  }, [searchParams, authToken]);

  // Fetch conversations
  const fetchConversations = async () => {
    try {
      const token =
        authToken ||
        localStorage.getItem("authToken") ||
        localStorage.getItem("token");
      if (!token) return;

      const response = await fetch(
        `${API_BASE_URL}/api/messages/conversations`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          const transformedConversations = data.data.conversations.map(
            (conv: any) => {
              const otherParticipant = conv.participants.find(
                (p: any) => p._id !== profileData.id
              );
              return {
                id: conv._id,
                providerId: otherParticipant?._id,
                providerName: otherParticipant?.name || "Unknown Provider",
                providerService:
                  otherParticipant?.services?.[0] || "Service Provider",
                providerAvatar: otherParticipant?.profileImage || "",
                isOnline: true,
                unreadCount: 0,
                lastMessage: conv.lastMessage
                  ? {
                      id: conv.lastMessage._id,
                      senderId: conv.lastMessage.senderId._id,
                      content: conv.lastMessage.content,
                      timestamp: new Date(conv.lastMessage.timestamp),
                      status: conv.lastMessage.status,
                    }
                  : {
                      id: "temp",
                      senderId: "system",
                      content: "No messages yet",
                      timestamp: new Date(),
                      status: "sent",
                    },
              };
            }
          );

          setChatState((prev) => ({
            ...prev,
            conversations: transformedConversations,
          }));
        }
      }
    } catch (error) {
      console.error("Error fetching conversations:", error);
    }
  };

  // Fetch messages for a conversation
  const fetchMessages = async (conversationId: string) => {
    try {
      const token =
        authToken ||
        localStorage.getItem("authToken") ||
        localStorage.getItem("token");
      if (!token) return;

      const response = await fetch(
        `${API_BASE_URL}/api/messages/conversation/${conversationId}?limit=100`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          const transformedMessages = data.data.messages.map((msg: any) => ({
            id: msg._id,
            senderId: msg.senderId._id,
            content: msg.content,
            timestamp: new Date(msg.timestamp),
            status: msg.status,
            isMe: msg.senderId._id === profileData.id, // Add isMe flag for alignment
          }));

          setChatState((prev) => ({
            ...prev,
            messages: {
              ...prev.messages,
              [conversationId]: transformedMessages,
            },
          }));
        }
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  // Send message function
  const handleSendMessage = async (conversationId: string, content: string) => {
    try {
      const token =
        authToken ||
        localStorage.getItem("authToken") ||
        localStorage.getItem("token");
      if (!token) {
        alert("Please log in to send messages");
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/messages/send`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          conversationId,
          content,
          messageType: "text",
        }),
      });

      if (response.ok) {
        await fetchMessages(conversationId);
        await fetchConversations();
      } else {
        alert("Failed to send message");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Error sending message");
    }
  };

  // Start conversation function
  const handleStartConversation = async (providerId: string) => {
    try {
      const token =
        authToken ||
        localStorage.getItem("authToken") ||
        localStorage.getItem("token");
      if (!token) {
        alert("Please log in to message providers");
        return;
      }

      const response = await fetch(
        `${API_BASE_URL}/api/messages/conversation`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            participantId: providerId,
          }),
        }
      );

      const result = await response.json();

      if (result.success) {
        await fetchConversations();
        return result.data.conversation._id;
      } else {
        alert("Failed to start conversation: " + result.message);
        return null;
      }
    } catch (error) {
      console.error("Error starting conversation:", error);
      alert("Error starting conversation");
      return null;
    }
  };

  // Set active conversation and fetch its messages
  const handleSetActiveConversation = async (conversationId: string) => {
    setChatState((prev) => ({
      ...prev,
      activeConversation: conversationId,
    }));
    await fetchMessages(conversationId);
  };

  // Customer detection handlers
  const handleCustomerDetected = (distance: number, eta: number) => {
    setCustomerAlert({
      show: true,
      message: `Customer is approaching! Distance: ${Math.round(
        distance
      )}m, ETA: ${Math.round(eta / 60)} minutes`,
      providerName: selectedProvider?.name || "",
    });

    // Show browser notification if supported
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("Customer Approaching", {
        body: `Customer is ${Math.round(distance)}m away from ${
          selectedProvider?.name
        }. ETA: ${Math.round(eta / 60)}min`,
        icon: "/favicon.ico",
      });
    }
  };

  const handleCustomerArrived = () => {
    setCustomerAlert({
      show: true,
      message: "Customer has arrived at your location!",
      providerName: selectedProvider?.name || "",
    });

    // Show browser notification
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("Customer Arrived", {
        body: `Customer has arrived at ${selectedProvider?.name}'s location`,
        icon: "/favicon.ico",
      });
    }

    // Auto-hide after 5 seconds
    setTimeout(() => {
      setCustomerAlert((prev) => ({ ...prev, show: false }));
    }, 5000);
  };

  // Request notification permission
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  // Poll for new messages (simple real-time updates)
  useEffect(() => {
    if (chatState.activeConversation) {
      const interval = setInterval(() => {
        fetchMessages(chatState.activeConversation!);
        fetchConversations();
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [chatState.activeConversation]);

  // Load conversations when user is authenticated
  useEffect(() => {
    if (authToken) {
      fetchConversations();
    }
  }, [authToken]);

  // Fetch providers when search params change
  useEffect(() => {
    if (authToken) {
      fetchProviders();
    }
  }, [authToken, searchParams, fetchProviders]);

  const checkTokenValidity = async (token: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        return false;
      }

      return response.ok;
    } catch (error) {
      console.error("Token validation error:", error);
      return false;
    }
  };

  const handleAPICall = async (url: string, options: RequestInit = {}) => {
    const token =
      authToken ||
      localStorage.getItem("authToken") ||
      localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      throw new Error("Authentication required");
    }

    const response = await fetch(url, {
      ...options,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (response.status === 401) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("token");
      setAuthToken(null);
      navigate("/login");
      throw new Error("Session expired");
    }

    return response;
  };

  useEffect(() => {
    const token =
      localStorage.getItem("authToken") || localStorage.getItem("token");

    const initializeApp = async () => {
      if (token) {
        const isValid = await checkTokenValidity(token);
        if (isValid) {
          setAuthToken(token);
          await loadUserProfile(token);
          await fetchConversations();
          await fetchProviders(); // Fetch initial providers
        } else {
          localStorage.removeItem("authToken");
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }
      } else {
        navigate("/login");
        return;
      }

      const savedFavorites = localStorage.getItem("favorites");
      if (savedFavorites) {
        try {
          setFavorites(JSON.parse(savedFavorites));
        } catch (error) {
          console.error("Error parsing favorites:", error);
        }
      }
    };

    initializeApp();
  }, [navigate]);

  const loadUserProfile = async (token: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data.user) {
          setProfileData({
            id: data.data.user._id,
            name: data.data.user.name,
            email: data.data.user.email,
            phone: data.data.user.phoneNumber || "+1 (555) 123-4567",
            address: data.data.user.address || "123 Main St, City, State 12345",
            bio: "Homeowner looking for reliable service providers for regular maintenance and repairs.",
            avatar: data.data.user.profileImage || null,
          });
        }
      }
    } catch (error) {
      console.error("Error loading user profile:", error);
    }
  };

  const handleLogout = async () => {
    try {
      const token =
        authToken ||
        localStorage.getItem("authToken") ||
        localStorage.getItem("token");
      if (token) {
        const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Logout failed");
        }
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("authToken");
      localStorage.removeItem("userData");
      localStorage.removeItem("favorites");
      setAuthToken(null);
      navigate("/login");
    }
  };

  const handleServiceClick = (service: Service) => {
    setSearchQuery(service.name);
    // Trigger search immediately when service is clicked
    handleSearch(service.name, currentLocationAddress, serviceType);
  };

  const handleLocationChange = (location: LocationData) => {
    setCurrentLocationAddress(location.address);
    if (location.coordinates && location.coordinates.length === 2) {
      setUserLocation([location.coordinates[0], location.coordinates[1]]);
    }
  };

  // FIXED: Search function that only updates searchParams when actual search is performed
  const handleSearch = useCallback(
    (
      query: string,
      location: string,
      searchServiceType: "immediate" | "long-term"
    ) => {
      console.log("🔄 Performing search with:", {
        query,
        location,
        searchServiceType,
      });

      // Update search params - this will trigger ProvidersList to fetch new data
      setSearchParams({
        query: query || "",
        location: location || "",
        serviceType: searchServiceType,
        searchRadius: searchRadius,
      });

      setServiceType(searchServiceType);

      if (providersRef.current) {
        const yOffset = -100;
        const element = providersRef.current;
        const y =
          element.getBoundingClientRect().top + window.pageYOffset + yOffset;

        window.scrollTo({
          top: y,
          behavior: "smooth",
        });
      }
    },
    [searchRadius]
  );

  // FIXED: Service type change should trigger search
  const handleServiceTypeChange = useCallback(
    (type: "immediate" | "long-term") => {
      console.log("🔄 Service type changed to:", type);
      setServiceType(type);
      // Trigger search with current values when service type changes
      handleSearch(searchQuery, currentLocationAddress, type);
    },
    [searchQuery, currentLocationAddress, handleSearch]
  );

  // FIXED: Search radius change should trigger search
  const handleSearchRadiusChange = useCallback(
    (radius: number) => {
      console.log("🔄 Search radius changed to:", radius);
      setSearchRadius(radius);
      // Trigger search with current values when radius changes
      handleSearch(searchQuery, currentLocationAddress, serviceType);
    },
    [searchQuery, currentLocationAddress, serviceType, handleSearch]
  );

  const handleProviderBook = (provider: ProviderType) => {
    const token =
      authToken ||
      localStorage.getItem("authToken") ||
      localStorage.getItem("token");

    if (!token) {
      alert("Please log in to book a service");
      return;
    }

    setSelectedProviderForBooking(provider);
    setShowBookingModal(true);
  };

  const handleBookingConfirm = async (bookingData: any) => {
    try {
      const token =
        authToken ||
        localStorage.getItem("authToken") ||
        localStorage.getItem("token");

      if (!token) {
        alert("Please log in to book a service");
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bookingData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        alert("Booking request sent successfully!");
        setShowBookingModal(false);
        setSelectedProviderForBooking(null);
      } else {
        throw new Error(result.message || "Failed to book service");
      }
    } catch (error) {
      console.error("Booking error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      alert(`Failed to book service: ${errorMessage}`);
      throw error;
    }
  };

  const handleToggleFavorite = async (providerId: string) => {
    try {
      const method = favorites.includes(providerId) ? "DELETE" : "POST";
      const response = await handleAPICall(
        `${API_BASE_URL}/api/favorites/${providerId}`,
        {
          method,
        }
      );

      if (response.ok) {
        const newFavorites = favorites.includes(providerId)
          ? favorites.filter((id) => id !== providerId)
          : [...favorites, providerId];

        setFavorites(newFavorites);
        localStorage.setItem("favorites", JSON.stringify(newFavorites));
      }
    } catch (err) {
      console.error("Error toggling favorite:", err);
      alert("Failed to update favorites. Please try again.");
    }
  };

  const handlePostJob = async (jobData: {
    serviceType: string;
    description: string;
    location: string;
    urgency: string;
    timeframe: string;
    budget: string;
    category: string;
  }) => {
    try {
      const token =
        authToken ||
        localStorage.getItem("authToken") ||
        localStorage.getItem("token");

      if (!token) {
        alert("Please log in to post a job");
        return;
      }

      const serviceRequestData = {
        serviceType: jobData.serviceType,
        description: jobData.description,
        location: jobData.location,
        urgency: jobData.urgency,
        timeframe: jobData.timeframe,
        budget: jobData.budget,
        category: jobData.category,
        status: "pending",
      };

      const response = await fetch(`${API_BASE_URL}/api/service-requests`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(serviceRequestData),
      });

      const data = await response.json();

      if (data.success) {
        alert("Job posted successfully!");
        setSearchQuery("");
        setShowPostJob(false);
        // Trigger search to refresh providers
        handleSearch("", currentLocationAddress, serviceType);
      } else {
        alert("Failed to post job: " + data.message);
      }
    } catch (error) {
      console.error("Error posting job:", error);
      alert("Error posting job. Please try again.");
    }
  };

  const handleProviderSelect = (provider: ProviderType) => {
    setSelectedProvider(provider);
  };

  const handleProviderCall = (provider: ProviderType) => {
    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
    const phoneNumber = provider.phoneNumber || "+1 (555) 000-0000";
    const cleanPhoneNumber = phoneNumber.replace(/\D/g, "");

    if (isMobile) {
      window.location.href = `tel:${cleanPhoneNumber}`;
    } else {
      const userChoice = window.confirm(
        `Call ${provider.name}?\n\nPhone: ${phoneNumber}\n\nClick OK to copy the number to clipboard, or Cancel to close.`
      );

      if (userChoice) {
        navigator.clipboard
          .writeText(phoneNumber)
          .then(() => {
            alert(`Phone number ${phoneNumber} copied to clipboard!`);
          })
          .catch(() => {
            prompt("Copy this phone number:", phoneNumber);
          });
      }
    }
  };

  const handleProviderMessage = async (provider: ProviderType) => {
    try {
      const conversationId = await handleStartConversation(
        provider._id || provider.id
      );

      if (conversationId) {
        setChatState((prev) => ({
          ...prev,
          activeConversation: conversationId,
        }));

        navigate("/customer/messages", {
          state: {
            activeConversation: conversationId,
            provider: provider,
          },
        });
      }
    } catch (error) {
      console.error("Error starting conversation:", error);
      alert("Error starting conversation. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Customer Alert */}
      {customerAlert.show && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white p-4 rounded-lg shadow-lg max-w-sm">
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5" />
            <div>
              <p className="font-semibold">Customer Alert</p>
              <p className="text-sm">{customerAlert.message}</p>
            </div>
            <button
              onClick={() =>
                setCustomerAlert((prev) => ({ ...prev, show: false }))
              }
              className="text-white hover:text-gray-200"
            >
              ×
            </button>
          </div>
        </div>
      )}

      <Header
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        unreadMessagesCount={unreadMessagesCount}
        onLogout={handleLogout}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          <Route
            index
            element={
              <div className="space-y-8">
                <HeroSection
                  serviceType={serviceType}
                  setServiceType={handleServiceTypeChange}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  onLocationChange={handleLocationChange}
                  currentLocation={currentLocationAddress}
                  onSearch={handleSearch}
                  viewMode={viewMode}
                  onViewModeChange={setViewMode}
                  searchRadius={searchRadius}
                  onSearchRadiusChange={handleSearchRadiusChange}
                  onPostJob={() => setShowPostJob(true)}
                />

                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900">
                      {serviceType === "immediate"
                        ? "Available Now"
                        : "Popular Services"}
                    </h2>
                    <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium transition-colors">
                      <span>View all</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services.map((service) => (
                      <ServiceCard
                        key={service.id}
                        service={service}
                        serviceType={serviceType}
                        onClick={handleServiceClick}
                      />
                    ))}
                  </div>
                </div>

                <div
                  ref={providersRef}
                  className="space-y-6"
                  id="providers-section"
                >
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900">
                      {serviceType === "immediate"
                        ? "Available Providers"
                        : "Top Rated Providers"}
                    </h2>
                    <div className="flex items-center space-x-3">
                      <button className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        <MoreVertical className="w-4 h-4" />
                        <span>Filter</span>
                      </button>
                    </div>
                  </div>

                  {viewMode === "map" ? (
                    <StandaloneMapView
                      providers={providers}
                      userLocation={userLocation}
                      selectedProvider={selectedProvider}
                      onProviderSelect={handleProviderSelect}
                      onBook={handleProviderBook}
                      onMessage={handleProviderMessage}
                      onCall={handleProviderCall}
                      searchRadius={searchRadius}
                      searchQuery={searchQuery}
                      onCustomerDetected={handleCustomerDetected}
                      onCustomerArrived={handleCustomerArrived}
                    />
                  ) : (
                    <ProvidersList
                      serviceType={searchParams.serviceType}
                      searchQuery={searchParams.query}
                      location={searchParams.location}
                      onBook={handleProviderBook}
                      onMessage={handleProviderMessage}
                      onCall={handleProviderCall}
                      onToggleFavorite={handleToggleFavorite}
                      authToken={authToken || undefined}
                      currentUser={profileData}
                      favorites={favorites}
                      searchRadius={searchParams.searchRadius}
                      userLocation={userLocation}
                    />
                  )}
                </div>
              </div>
            }
          />
          <Route path="bookings" element={<BookingsPage />} />
          <Route path="/customer/payment-status" element={<PaymentStatusPage />} />
          <Route
            path="provider/:providerId"
            element={<ProviderProfilePage />}
          />
          <Route
            path="jobs"
            element={<JobsPage authToken={authToken} userId={profileData.id} />}
          />
          <Route
            path="profile"
            element={
              <ProfilePage
                profileData={{
                  ...profileData,
                  avatar: profileData.avatar ?? undefined,
                }}
                onProfileUpdate={(data) =>
                  setProfileData({
                    ...data,
                    id: profileData.id,
                    avatar: data.avatar ?? null,
                  })
                }
              />
            }
          />
          <Route
            path="favorites"
            element={
              <FavoritesPage
                favorites={favorites}
                onToggleFavorite={handleToggleFavorite}
                onBook={handleProviderBook}
                onMessage={handleProviderMessage}
                onCall={handleProviderCall}
              />
            }
          />
          <Route
            path="messages"
            element={
              <MessagesPage
                chatState={chatState}
                onSendMessage={handleSendMessage}
                onStartConversation={handleStartConversation}
                onSetActiveConversation={handleSetActiveConversation}
              />
            }
          />
        </Routes>

        <PostJobModal
          isOpen={showPostJob}
          onClose={() => setShowPostJob(false)}
          onSubmit={handlePostJob}
        />

        {selectedProviderForBooking && (
          <BookingModal
            isOpen={showBookingModal}
            provider={selectedProviderForBooking}
            currentUser={profileData}
            onClose={() => {
              setShowBookingModal(false);
              setSelectedProviderForBooking(null);
            }}
            onConfirm={handleBookingConfirm}
            serviceType={serviceType}
            authToken={authToken || undefined}
          />
        )}
      </main>
    </div>
  );
};

const Customer: React.FC = () => {
  return <CustomerContent />;
};

export default Customer;
