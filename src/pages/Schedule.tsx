import React, { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Plus,
  ChevronLeft,
  ChevronRight,
  Edit3,
  Trash2,
  Phone,
  DollarSign,
  Filter,
  Search,
  MoreVertical,
  CheckCircle,
  AlertCircle,
  Activity,
  Sparkles,
  Target,
  Zap,
  Loader2,
  AlertCircle as AlertCircleIcon,
  X,
} from "lucide-react";

interface Appointment {
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
  status: "confirmed" | "pending" | "cancelled";
  notes: string;
  category: string;
  priority: "high" | "medium" | "low";
  bookingId?: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

const Schedule: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<"week" | "month">("week");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "confirmed" | "pending" | "cancelled"
  >("all");
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Initialize auth token from localStorage
  useEffect(() => {
    const token =
      localStorage.getItem("authToken") || localStorage.getItem("token");
    setAuthToken(token);
  }, []);

  // Fetch appointments from backend API
  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!authToken) {
        throw new Error("No authentication token found. Please log in again.");
      }

      // First try the schedule endpoint
      let response = await fetch(`${API_BASE_URL}/api/user/schedule`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      });

      console.log("Schedule response status:", response.status);

      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("authToken");
        localStorage.removeItem("token");
        setAuthToken(null);
        throw new Error("Your session has expired. Please log in again.");
      }

      if (!response.ok) {
        // If schedule endpoint fails, try to get appointments from bookings
        console.log("Schedule endpoint failed, trying bookings...");
        response = await fetch(`${API_BASE_URL}/api/bookings/provider?status=confirmed`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.message || `HTTP error! status: ${response.status}`
          );
        }

        const bookingsResult = await response.json();
        if (bookingsResult.success) {
          // Transform bookings to appointments
          const transformedAppointments = bookingsResult.data.bookings.map((booking: any) => ({
            id: booking._id,
            title: booking.serviceType,
            client: booking.customerName || booking.customerId?.name || 'Unknown Client',
            phone: booking.customerPhone || booking.customerId?.phoneNumber || 'No phone',
            location: booking.location,
            date: new Date(booking.requestedAt).toISOString().split('T')[0],
            time: "10:00 AM", // Default time, you might want to extract from timeframe
            endTime: "12:00 PM",
            duration: "2 hours",
            payment: booking.budget || "₦0",
            status: "confirmed",
            notes: booking.specialRequests || booking.description || '',
            category: booking.serviceType.toLowerCase().includes('clean') ? 'cleaning' : 'handyman',
            priority: 'medium',
            bookingId: booking._id
          }));
          setAppointments(transformedAppointments);
        } else {
          throw new Error("Failed to fetch schedule data from bookings");
        }
      } else {
        const result = await response.json();
        if (result.success) {
          setAppointments(result.data || []);
        } else {
          throw new Error(result.message || "Failed to fetch schedule data");
        }
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";
      setError(errorMessage);
      console.error("Schedule fetch error:", err);

      // Fallback to mock data for development
      if (process.env.NODE_ENV === 'development') {
        console.log("Using mock data for development");
        setAppointments(getMockAppointments());
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authToken) {
      fetchAppointments();
    } else {
      setLoading(false);
    }
  }, [authToken]);

  // Currency configuration - Only Naira
  const currencyConfig = {
    symbol: "₦",
    icon: () => <span className="text-base font-bold">₦</span>,
    name: "NGN",
  };

  const CurrencyIcon = currencyConfig.icon;

  // Get payments in Naira only
  const getNairaPayments = () => {
    const basePayments = [75, 120, 80, 60];
    const nairaMultiplier = 1650;

    return basePayments.map((payment) => ({
      amount: Math.round(payment * nairaMultiplier),
      symbol: "₦",
    }));
  };

  // Mock data for development
  const getMockAppointments = (): Appointment[] => {
    const nairaPayments = getNairaPayments();

    return [
      {
        id: "1",
        title: "Deep House Cleaning",
        client: "Sarah Johnson",
        phone: "+234 123 456 7890",
        location: "123 Oak Street, Lagos",
        date: "2025-01-08",
        time: "10:00 AM",
        endTime: "1:00 PM",
        duration: "3 hours",
        payment: `₦${nairaPayments[0].amount.toLocaleString()}`,
        status: "confirmed",
        notes: "Client prefers eco-friendly products",
        category: "cleaning",
        priority: "high",
      },
      {
        id: "2",
        title: "Plumbing Repair",
        client: "Mike Chen",
        phone: "+234 987 654 3210",
        location: "456 Pine Avenue, Abuja",
        date: "2025-01-08",
        time: "2:00 PM",
        endTime: "4:00 PM",
        duration: "2 hours",
        payment: `₦${nairaPayments[1].amount.toLocaleString()}`,
        status: "confirmed",
        notes: "Kitchen sink leak repair",
        category: "handyman",
        priority: "medium",
      },
    ];
  };

  // Appointment actions
  const handleEditAppointment = async (appointment: Appointment) => {
    setActionLoading(appointment.id);
    try {
      // Implement edit functionality
      console.log("Editing appointment:", appointment);
      // Add your API call here
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
    } catch (error) {
      console.error("Error editing appointment:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteAppointment = async (appointment: Appointment) => {
    setActionLoading(appointment.id);
    try {
      if (appointment.bookingId) {
        // Update booking status to cancelled
        const response = await fetch(`${API_BASE_URL}/api/bookings/${appointment.bookingId}/status`, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: "cancelled" }),
        });

        if (!response.ok) {
          throw new Error("Failed to cancel booking");
        }
      }

      // Remove from local state
      setAppointments(prev => prev.filter(apt => apt.id !== appointment.id));
    } catch (error) {
      console.error("Error deleting appointment:", error);
      setError("Failed to delete appointment");
    } finally {
      setActionLoading(null);
    }
  };

  const handleStatusChange = async (appointment: Appointment, newStatus: "confirmed" | "cancelled") => {
    setActionLoading(appointment.id);
    try {
      if (appointment.bookingId) {
        const response = await fetch(`${API_BASE_URL}/api/bookings/${appointment.bookingId}/status`, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus === "confirmed" ? "confirmed" : "cancelled" }),
        });

        if (!response.ok) {
          throw new Error("Failed to update status");
        }
      }

      // Update local state
      setAppointments(prev =>
        prev.map(apt =>
          apt.id === appointment.id ? { ...apt, status: newStatus } : apt
        )
      );
    } catch (error) {
      console.error("Error updating status:", error);
      setError("Failed to update status");
    } finally {
      setActionLoading(null);
    }
  };

  const handleAddAppointment = async (appointmentData: Partial<Appointment>) => {
    setActionLoading("new");
    try {
      // Implement add appointment functionality
      console.log("Adding appointment:", appointmentData);
      // Add your API call here
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      // For now, add to local state
      const newAppointment: Appointment = {
        id: Date.now().toString(),
        title: appointmentData.title || "New Appointment",
        client: appointmentData.client || "New Client",
        phone: appointmentData.phone || "+234 000 000 0000",
        location: appointmentData.location || "Location",
        date: appointmentData.date || new Date().toISOString().split('T')[0],
        time: appointmentData.time || "10:00 AM",
        endTime: appointmentData.endTime || "12:00 PM",
        duration: appointmentData.duration || "2 hours",
        payment: appointmentData.payment || "₦0",
        status: "confirmed",
        notes: appointmentData.notes || "",
        category: appointmentData.category || "other",
        priority: appointmentData.priority || "medium",
      };

      setAppointments(prev => [...prev, newAppointment]);
      setShowAddModal(false);
    } catch (error) {
      console.error("Error adding appointment:", error);
      setError("Failed to add appointment");
    } finally {
      setActionLoading(null);
    }
  };

  const getWeekDays = () => {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());

    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split("T")[0];
  };

  const getAppointmentsForDate = (date: string) => {
    return appointments.filter(
      (apt) =>
        apt.date === date &&
        (filterStatus === "all" || apt.status === filterStatus) &&
        (searchQuery === "" ||
          apt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          apt.client.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  };

  const navigateWeek = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + (direction === "next" ? 7 : -7));
    setCurrentDate(newDate);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "cleaning":
        return "🧽";
      case "handyman":
        return "🔧";
      case "gardening":
        return "🌿";
      default:
        return "💼";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-emerald-50 border-emerald-200 text-emerald-700";
      case "pending":
        return "bg-amber-50 border-amber-200 text-amber-700";
      case "cancelled":
        return "bg-red-50 border-red-200 text-red-700";
      default:
        return "bg-gray-50 border-gray-200 text-gray-700";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-red-400";
      case "medium":
        return "border-amber-400";
      case "low":
        return "border-green-400";
      default:
        return "border-blue-400";
    }
  };

  const getClientInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const handleRetry = async () => {
    const token =
      localStorage.getItem("authToken") || localStorage.getItem("token");
    setAuthToken(token);
    setError(null);
    await fetchAppointments();
  };

  const handleLogin = () => {
    window.location.href = "/login";
  };

  const weekDays = getWeekDays();
  const today = formatDate(new Date());
  const filteredAppointments = appointments.filter(
    (apt) =>
      (filterStatus === "all" || apt.status === filterStatus) &&
      (searchQuery === "" ||
        apt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        apt.client.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const todayAppointments = getAppointmentsForDate(today);
  const totalRevenue = filteredAppointments.reduce((sum, apt) => {
    const amount = parseInt(apt.payment.replace(/[^0-9]/g, ""));
    return sum + (isNaN(amount) ? 0 : amount);
  }, 0);

  const formatRevenue = (amount: number) => {
    return `₦${amount.toLocaleString()}`;
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your schedule...</p>
        </div>
      </div>
    );
  }

  // Authentication error
  if (!authToken) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center max-w-md p-6 bg-white rounded-xl shadow-lg">
          <AlertCircleIcon className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Authentication Required
          </h3>
          <p className="text-gray-600 mb-4">
            Please log in to view your schedule.
          </p>
          <button
            onClick={handleLogin}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Log In
          </button>
        </div>
      </div>
    );
  }

  // Error state (other than auth)
  if (error && appointments.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center max-w-md p-6 bg-white rounded-xl shadow-lg">
          <AlertCircleIcon className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Error Loading Schedule
          </h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={handleRetry}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors mr-2"
          >
            Retry
          </button>
          <button
            onClick={handleLogin}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Log In Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Modern Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 lg:gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-600 to-blue-700 rounded-2xl sm:rounded-3xl flex items-center justify-center shadow-lg">
                  <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent leading-tight">
                    Schedule Management
                  </h1>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-gray-600 text-sm sm:text-base lg:text-lg">
                      Organize your appointments and track your availability
                    </p>
                    <div className="flex items-center gap-1 px-2 py-1 bg-white/80 rounded-lg border">
                      <span className="text-sm">🇳🇬</span>
                      <span className="text-xs font-medium text-gray-600">
                        NGN
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <button 
              onClick={() => setShowAddModal(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 sm:px-8 sm:py-4 rounded-xl sm:rounded-2xl font-semibold transition-all duration-200 hover:scale-105 hover:shadow-xl shadow-lg shadow-blue-200 flex items-center justify-center gap-2 sm:gap-3 w-full sm:w-auto"
            >
              <div className="w-5 h-5 sm:w-6 sm:h-6 bg-white/20 rounded-md sm:rounded-lg flex items-center justify-center">
                <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
              </div>
              <span className="text-sm sm:text-base">Add Appointment</span>
            </button>
          </div>
        </div>

        {/* Error Banner */}
        {error && appointments.length > 0 && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircleIcon className="w-5 h-5 text-red-600" />
              <p className="text-red-700">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-red-600 hover:text-red-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Empty State */}
        {appointments.length === 0 && !loading && !error && (
          <div className="text-center py-12 bg-white/80 backdrop-blur-sm rounded-3xl shadow-sm border border-gray-100 mb-8">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No appointments scheduled
            </h3>
            <p className="text-gray-600 mb-6">
              You don't have any upcoming appointments.
            </p>
            <button 
              onClick={() => setShowAddModal(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
            >
              Create Your First Appointment
            </button>
          </div>
        )}

        {/* Rest of your component remains the same... */}
        {/* Enhanced Stats Cards */}
        {appointments.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Stats cards code remains the same */}
            <div className="group bg-white/80 backdrop-blur-sm p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:scale-105 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Calendar className="w-7 h-7 text-white" />
                </div>
                <div className="text-blue-600">
                  <Activity className="w-5 h-5" />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-600">
                  Today's Appointments
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {todayAppointments.length}
                </p>
                <div className="text-sm text-gray-500">
                  {todayAppointments.filter((apt) => apt.status === "confirmed").length} confirmed
                </div>
              </div>
            </div>

            <div className="group bg-white/80 backdrop-blur-sm p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:scale-105 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <CheckCircle className="w-7 h-7 text-white" />
                </div>
                <div className="text-emerald-600">
                  <Target className="w-5 h-5" />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-600">
                  Confirmed Jobs
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {appointments.filter((apt) => apt.status === "confirmed").length}
                </p>
                <div className="text-sm text-emerald-600 font-semibold">
                  Ready to go!
                </div>
              </div>
            </div>

            <div className="group bg-white/80 backdrop-blur-sm p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:scale-105 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-yellow-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <AlertCircle className="w-7 h-7 text-white" />
                </div>
                <div className="text-amber-600">
                  <Zap className="w-5 h-5" />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-600">
                  Pending Approval
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {appointments.filter((apt) => apt.status === "pending").length}
                </p>
                <div className="text-sm text-amber-600 font-semibold">
                  Needs attention
                </div>
              </div>
            </div>

            <div className="group bg-white/80 backdrop-blur-sm p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:scale-105 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-xl">₦</span>
                </div>
                <div className="text-green-600">
                  <Sparkles className="w-5 h-5" />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-600">
                  Expected Revenue
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {formatRevenue(totalRevenue)}
                </p>
                <div className="text-sm text-green-600 font-semibold">
                  This week
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Controls and Filters */}
        {appointments.length > 0 && (
          <>
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-sm border border-gray-100 p-4 sm:p-6 mb-8">
              {/* Mobile Layout - Stacked */}
              <div className="flex flex-col gap-4 lg:hidden">
                {/* Top row - View Mode and Navigation */}
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                  {/* View Mode Toggle */}
                  <div className="flex items-center space-x-2 bg-gray-100 rounded-2xl p-1 w-full sm:w-auto">
                    <button
                      onClick={() => setViewMode("week")}
                      className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                        viewMode === "week"
                          ? "bg-white text-gray-900 shadow-sm"
                          : "text-gray-600 hover:text-gray-800"
                      }`}
                    >
                      Week View
                    </button>
                    <button
                      onClick={() => setViewMode("month")}
                      className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                        viewMode === "month"
                          ? "bg-white text-gray-900 shadow-sm"
                          : "text-gray-600 hover:text-gray-800"
                      }`}
                    >
                      Month View
                    </button>
                  </div>

                  {/* Week Navigation */}
                  <div className="flex items-center bg-gray-100 rounded-2xl p-1 w-full sm:w-auto">
                    <button
                      onClick={() => navigateWeek("prev")}
                      className="p-2 rounded-xl hover:bg-white transition-all duration-200 hover:shadow-sm"
                    >
                      <ChevronLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <span className="flex-1 sm:flex-none px-2 sm:px-4 text-xs sm:text-sm font-medium text-gray-700 text-center">
                      {weekDays[0].toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}{" "}
                      -{" "}
                      {weekDays[6].toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                    <button
                      onClick={() => navigateWeek("next")}
                      className="p-2 rounded-xl hover:bg-white transition-all duration-200 hover:shadow-sm"
                    >
                      <ChevronRight className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                </div>

                {/* Bottom row - Search and Filter */}
                <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
                  {/* Search */}
                  <div className="relative flex-1 sm:max-w-xs">
                    <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search appointments..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 text-sm"
                    />
                  </div>

                  {/* Status Filter */}
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Filter className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    <select
                      value={filterStatus}
                      onChange={(e) =>
                        setFilterStatus(
                          e.target.value as
                            | "all"
                            | "confirmed"
                            | "pending"
                            | "cancelled"
                        )
                      }
                      className="flex-1 sm:flex-none border border-gray-200 rounded-2xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-sm"
                    >
                      <option value="all">All Status</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="pending">Pending</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Desktop Layout - Single Line */}
              <div className="hidden lg:flex items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  {/* View Mode Toggle */}
                  <div className="flex items-center space-x-2 bg-gray-100 rounded-2xl p-1">
                    <button
                      onClick={() => setViewMode("week")}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                        viewMode === "week"
                          ? "bg-white text-gray-900 shadow-sm"
                          : "text-gray-600 hover:text-gray-800"
                      }`}
                    >
                      Week View
                    </button>
                    <button
                      onClick={() => setViewMode("month")}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                        viewMode === "month"
                          ? "bg-white text-gray-900 shadow-sm"
                          : "text-gray-600 hover:text-gray-800"
                      }`}
                    >
                      Month View
                    </button>
                  </div>

                  {/* Week Navigation */}
                  <div className="flex items-center bg-gray-100 rounded-2xl p-1">
                    <button
                      onClick={() => navigateWeek("prev")}
                      className="p-2 rounded-xl hover:bg-white transition-all duration-200 hover:shadow-sm"
                    >
                      <ChevronLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <span className="px-4 text-sm font-medium text-gray-700">
                      {weekDays[0].toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}{" "}
                      -{" "}
                      {weekDays[6].toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                    <button
                      onClick={() => navigateWeek("next")}
                      className="p-2 rounded-xl hover:bg-white transition-all duration-200 hover:shadow-sm"
                    >
                      <ChevronRight className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {/* Search */}
                  <div className="relative">
                    <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search appointments..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 text-sm min-w-64"
                    />
                  </div>

                  {/* Status Filter */}
                  <div className="flex items-center gap-2">
                    <Filter className="w-5 h-5 text-gray-400" />
                    <select
                      value={filterStatus}
                      onChange={(e) =>
                        setFilterStatus(
                          e.target.value as
                            | "all"
                            | "confirmed"
                            | "pending"
                            | "cancelled"
                        )
                      }
                      className="border border-gray-200 rounded-2xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-sm"
                    >
                      <option value="all">All Status</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="pending">Pending</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Weekly Calendar View */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-8">
              {/* Days Header */}
              <div className="grid grid-cols-7 border-b border-gray-200">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                  (day, index) => (
                    <div
                      key={day}
                      className="p-2 sm:p-4 text-center border-r border-gray-200 last:border-r-0"
                    >
                      <div className="text-xs sm:text-sm font-medium text-gray-600 mb-1">
                        <span className="hidden sm:inline">
                          {["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][index]}
                        </span>
                        <span className="sm:hidden">{day}</span>
                      </div>
                      <div
                        className={`text-lg sm:text-2xl font-bold transition-all duration-200 ${
                          formatDate(weekDays[index]) === today
                            ? "text-white bg-gradient-to-br from-blue-600 to-purple-600 w-8 h-8 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto shadow-lg text-sm sm:text-2xl"
                            : "text-gray-900"
                        }`}
                      >
                        {weekDays[index].getDate()}
                      </div>
                    </div>
                  )
                )}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-7 min-h-64 sm:min-h-96">
                {weekDays.map((day, index) => {
                  const dayAppointments = getAppointmentsForDate(formatDate(day));

                  return (
                    <div
                      key={index}
                      className="p-3 sm:p-4 border-r border-gray-200 last:border-r-0 border-b sm:border-b-0 border-gray-200 min-h-48 sm:min-h-64"
                    >
                      {/* Mobile: Show day name again */}
                      <div className="sm:hidden mb-3 pb-2 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-gray-700">
                            {["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][index]}
                          </span>
                          <span
                            className={`text-lg font-bold ${
                              formatDate(weekDays[index]) === today
                                ? "text-blue-600"
                                : "text-gray-600"
                            }`}
                          >
                            {weekDays[index].getDate()}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2 sm:space-y-3">
                        {dayAppointments.map((appointment) => (
                          <div
                            key={appointment.id}
                            className={`group p-3 sm:p-4 rounded-xl sm:rounded-2xl text-sm border-l-4 hover:shadow-lg transition-all duration-300 cursor-pointer ${
                              appointment.status === "confirmed"
                                ? "bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-500 hover:from-emerald-100 hover:to-green-100"
                                : appointment.status === "pending"
                                ? "bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-500 hover:from-amber-100 hover:to-yellow-100"
                                : "bg-gradient-to-r from-red-50 to-pink-50 border-red-500 hover:from-red-100 hover:to-pink-100"
                            } ${getPriorityColor(appointment.priority)}`}
                            onClick={() => setSelectedAppointment(appointment)}
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-sm sm:text-base">
                                {getCategoryIcon(appointment.category)}
                              </span>
                              <div className="font-bold text-gray-900 text-xs sm:text-xs">
                                {appointment.time}
                              </div>
                              <div className={`text-xs px-2 py-1 rounded-full ${getStatusColor(appointment.status)}`}>
                                {appointment.status}
                              </div>
                            </div>
                            <div className="text-gray-800 font-semibold mb-2 text-xs sm:text-xs leading-tight">
                              {appointment.title}
                            </div>
                            <div className="space-y-1">
                              <div className="text-gray-600 flex items-center gap-1 text-xs">
                                <User className="w-3 h-3 flex-shrink-0" />
                                <span className="truncate">
                                  {appointment.client}
                                </span>
                              </div>
                              <div className="text-green-600 font-bold text-xs">
                                {appointment.payment}
                              </div>
                              {/* Mobile: Show location on mobile for better context */}
                              <div className="sm:hidden text-gray-500 flex items-start gap-1 text-xs">
                                <MapPin className="w-3 h-3 flex-shrink-0 mt-0.5" />
                                <span className="break-words text-xs leading-tight">
                                  {appointment.location}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                        {dayAppointments.length === 0 && (
                          <div className="text-center py-6 sm:py-8 text-gray-400">
                            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-100 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-2">
                              <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                            </div>
                            <p className="text-xs">No appointments</p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Mobile-Responsive Upcoming Appointments */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-sm border border-gray-100">
              <div className="p-4 sm:p-8 border-b border-gray-100">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                      <Clock className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                        Upcoming Appointments
                      </h3>
                      <p className="text-gray-600 text-sm sm:text-base">
                        Detailed view of your scheduled services
                      </p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 self-start sm:self-center">
                    {filteredAppointments.length} appointments found
                  </div>
                </div>
              </div>
              <div className="p-4 sm:p-8">
                <div className="space-y-4 sm:space-y-6">
                  {filteredAppointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="group bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-200 rounded-2xl sm:rounded-3xl p-4 sm:p-6 hover:shadow-xl hover:from-blue-50 hover:to-indigo-50 transition-all duration-300"
                    >
                      {/* Mobile Layout */}
                      <div className="block sm:hidden space-y-4">
                        {/* Header with avatar and actions */}
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                              <span className="text-white font-bold text-sm">
                                {getClientInitials(appointment.client)}
                              </span>
                            </div>
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-lg">
                                  {getCategoryIcon(appointment.category)}
                                </span>
                                <h4 className="font-bold text-gray-900 text-base">
                                  {appointment.title}
                                </h4>
                              </div>
                              <div className="flex items-center gap-2">
                                <span
                                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                                    appointment.status
                                  )}`}
                                >
                                  {appointment.status === "confirmed" ? (
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                  ) : (
                                    <AlertCircle className="w-3 h-3 mr-1" />
                                  )}
                                  {appointment.status}
                                </span>
                                <div
                                  className={`w-1 h-4 rounded-full ${getPriorityColor(
                                    appointment.priority
                                  ).replace("border-", "bg-")}`}
                                ></div>
                              </div>
                            </div>
                          </div>

                          {/* Mobile action buttons - vertical stack */}
                          <div className="flex flex-col gap-2">
                            <button 
                              onClick={() => handleEditAppointment(appointment)}
                              disabled={actionLoading === appointment.id}
                              className="w-8 h-8 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-xl flex items-center justify-center transition-all duration-200 disabled:opacity-50"
                            >
                              {actionLoading === appointment.id ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                <Edit3 className="w-3 h-3" />
                              )}
                            </button>
                            <button 
                              onClick={() => handleDeleteAppointment(appointment)}
                              disabled={actionLoading === appointment.id}
                              className="w-8 h-8 bg-red-100 hover:bg-red-200 text-red-600 rounded-xl flex items-center justify-center transition-all duration-200 disabled:opacity-50"
                            >
                              {actionLoading === appointment.id ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                <Trash2 className="w-3 h-3" />
                              )}
                            </button>
                            <button className="w-8 h-8 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl flex items-center justify-center transition-all duration-200">
                              <MoreVertical className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                        {/* Mobile info grid */}
                        <div className="grid grid-cols-1 gap-3 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-blue-500 flex-shrink-0" />
                            <span className="font-medium truncate">
                              {appointment.client}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-green-500 flex-shrink-0" />
                            <span className="truncate">
                              {appointment.phone}
                            </span>
                          </div>
                          <div className="flex items-start gap-2">
                            <MapPin className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                            <span className="break-words">
                              {appointment.location}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-purple-500 flex-shrink-0" />
                            <span>
                              {new Date(appointment.date).toLocaleDateString("en-US", {
                                weekday: "short",
                                month: "short",
                                day: "numeric",
                              })}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-orange-500 flex-shrink-0" />
                            <span>
                              {appointment.time} - {appointment.endTime}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="w-4 h-4 text-emerald-500 flex-shrink-0 font-bold">
                              ₦
                            </span>
                            <span className="font-bold text-emerald-600 text-base">
                              {appointment.payment}
                            </span>
                          </div>
                        </div>

                        {/* Status Actions */}
                        <div className="flex gap-2">
                          {appointment.status !== "confirmed" && (
                            <button
                              onClick={() => handleStatusChange(appointment, "confirmed")}
                              disabled={actionLoading === appointment.id}
                              className="flex-1 bg-green-600 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
                            >
                              Confirm
                            </button>
                          )}
                          {appointment.status !== "cancelled" && (
                            <button
                              onClick={() => handleStatusChange(appointment, "cancelled")}
                              disabled={actionLoading === appointment.id}
                              className="flex-1 bg-red-600 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
                            >
                              Cancel
                            </button>
                          )}
                        </div>

                        {/* Mobile notes */}
                        {appointment.notes && (
                          <div className="p-3 bg-white/60 backdrop-blur-sm rounded-xl border border-gray-200">
                            <div className="flex items-start gap-2">
                              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                              <div className="min-w-0">
                                <strong className="text-gray-700 text-sm">
                                  Notes:
                                </strong>
                                <p className="text-gray-600 text-sm mt-1 break-words">
                                  {appointment.notes}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Desktop Layout - Hidden on mobile */}
                      <div className="hidden sm:flex items-start justify-between">
                        <div className="flex items-start gap-4 flex-1 min-w-0">
                          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-lg flex-shrink-0">
                            <span className="text-white font-bold text-lg">
                              {getClientInitials(appointment.client)}
                            </span>
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-3">
                              <span className="text-2xl">
                                {getCategoryIcon(appointment.category)}
                              </span>
                              <h4 className="font-bold text-gray-900 text-lg group-hover:text-blue-600 transition-colors">
                                {appointment.title}
                              </h4>
                              <span
                                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(
                                  appointment.status
                                )}`}
                              >
                                {appointment.status === "confirmed" ? (
                                  <CheckCircle className="w-4 h-4 mr-1" />
                                ) : (
                                  <AlertCircle className="w-4 h-4 mr-1" />
                                )}
                                {appointment.status}
                              </span>
                              <div
                                className={`w-1 h-6 rounded-full ${getPriorityColor(
                                  appointment.priority
                                ).replace("border-", "bg-")}`}
                              ></div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-gray-600 mb-4">
                              <div className="flex items-center gap-2">
                                <User className="w-4 h-4 text-blue-500" />
                                <span className="font-medium">
                                  {appointment.client}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Phone className="w-4 h-4 text-green-500" />
                                <span>{appointment.phone}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-red-500" />
                                <span className="truncate">
                                  {appointment.location}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-purple-500" />
                                <span>
                                  {new Date(appointment.date).toLocaleDateString("en-US", {
                                    weekday: "short",
                                    month: "short",
                                    day: "numeric",
                                  })}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-orange-500" />
                                <span>
                                  {appointment.time} - {appointment.endTime}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="w-4 h-4 text-emerald-500 flex-shrink-0 font-bold">
                                  ₦
                                </span>
                                <span className="font-bold text-emerald-600 text-lg">
                                  {appointment.payment}
                                </span>
                              </div>
                            </div>

                            {/* Status Actions */}
                            <div className="flex gap-3 mb-4">
                              {appointment.status !== "confirmed" && (
                                <button
                                  onClick={() => handleStatusChange(appointment, "confirmed")}
                                  disabled={actionLoading === appointment.id}
                                  className="bg-green-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
                                >
                                  Confirm Appointment
                                </button>
                              )}
                              {appointment.status !== "cancelled" && (
                                <button
                                  onClick={() => handleStatusChange(appointment, "cancelled")}
                                  disabled={actionLoading === appointment.id}
                                  className="bg-red-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
                                >
                                  Cancel Appointment
                                </button>
                              )}
                            </div>

                            {appointment.notes && (
                              <div className="p-4 bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-200">
                                <div className="flex items-start gap-2">
                                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                  <div>
                                    <strong className="text-gray-700 text-sm">
                                      Notes:
                                    </strong>
                                    <p className="text-gray-600 text-sm mt-1">
                                      {appointment.notes}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 ml-4">
                          <button 
                            onClick={() => handleEditAppointment(appointment)}
                            disabled={actionLoading === appointment.id}
                            className="w-10 h-10 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-2xl flex items-center justify-center transition-all duration-200 hover:scale-110 disabled:opacity-50"
                          >
                            {actionLoading === appointment.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Edit3 className="w-4 h-4" />
                            )}
                          </button>
                          <button 
                            onClick={() => handleDeleteAppointment(appointment)}
                            disabled={actionLoading === appointment.id}
                            className="w-10 h-10 bg-red-100 hover:bg-red-200 text-red-600 rounded-2xl flex items-center justify-center transition-all duration-200 hover:scale-110 disabled:opacity-50"
                          >
                            {actionLoading === appointment.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                          <button className="w-10 h-10 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-2xl flex items-center justify-center transition-all duration-200 hover:scale-110">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Add Appointment Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Add New Appointment</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter appointment title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Client Name
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter client name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Time
                  </label>
                  <input
                    type="time"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Time
                  </label>
                  <input
                    type="time"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="flex gap-2 pt-4">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleAddAppointment({})}
                  disabled={actionLoading === "new"}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {actionLoading === "new" ? (
                    <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                  ) : (
                    "Add Appointment"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Appointment Detail Modal */}
      {selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Appointment Details</h3>
              <button
                onClick={() => setSelectedAppointment(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <strong>Title:</strong> {selectedAppointment.title}
              </div>
              <div>
                <strong>Client:</strong> {selectedAppointment.client}
              </div>
              <div>
                <strong>Phone:</strong> {selectedAppointment.phone}
              </div>
              <div>
                <strong>Location:</strong> {selectedAppointment.location}
              </div>
              <div>
                <strong>Date:</strong> {selectedAppointment.date}
              </div>
              <div>
                <strong>Time:</strong> {selectedAppointment.time} - {selectedAppointment.endTime}
              </div>
              <div>
                <strong>Payment:</strong> {selectedAppointment.payment}
              </div>
              {selectedAppointment.notes && (
                <div>
                  <strong>Notes:</strong> {selectedAppointment.notes}
                </div>
              )}
            </div>
            <div className="flex gap-2 pt-4">
              <button
                onClick={() => setSelectedAppointment(null)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-400 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Schedule;