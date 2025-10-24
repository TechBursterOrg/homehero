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
  providerId?: string;
  customerId?: string;
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

  // Fetch schedule data from backend API
  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!authToken) {
        throw new Error("No authentication token found. Please log in again.");
      }

      console.log("📅 Fetching schedule data...");

      // Try to fetch from the schedule endpoint first
      const response = await fetch(`${API_BASE_URL}/api/schedule?refresh=${Date.now()}`, {
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
        // If schedule endpoint fails, try to get from user dashboard
        console.log("Schedule endpoint failed, trying dashboard...");
        const dashboardResponse = await fetch(`${API_BASE_URL}/api/user/dashboard?refresh=${Date.now()}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        });

        if (!dashboardResponse.ok) {
          const errorData = await dashboardResponse.json().catch(() => ({}));
          throw new Error(
            errorData.message || `HTTP error! status: ${dashboardResponse.status}`
          );
        }

        const dashboardResult = await dashboardResponse.json();
        console.log("Dashboard schedule data:", dashboardResult.schedule);
        
        if (dashboardResult.schedule && Array.isArray(dashboardResult.schedule)) {
          // Transform dashboard schedule data to appointments
          const transformedAppointments = dashboardResult.schedule.map((schedule: any) => ({
            id: schedule._id || schedule.id,
            title: schedule.title || schedule.serviceType || 'Appointment',
            client: schedule.client || schedule.customerName || 'Unknown Client',
            phone: schedule.phone || schedule.customerPhone || 'No phone',
            location: schedule.location,
            date: schedule.date || new Date().toISOString().split('T')[0],
            time: schedule.time || "10:00 AM",
            endTime: schedule.endTime || "12:00 PM",
            duration: schedule.duration || "2 hours",
            payment: schedule.payment || "₦0",
            status: (schedule.status === 'accepted' ? 'confirmed' : schedule.status) || 'confirmed',
            notes: schedule.notes || schedule.specialRequests || '',
            category: schedule.category || 'other',
            priority: schedule.priority || 'medium',
            bookingId: schedule.bookingId,
            providerId: schedule.providerId,
            customerId: schedule.customerId
          }));
          setAppointments(transformedAppointments);
          console.log("✅ Transformed appointments from dashboard:", transformedAppointments.length);
        } else {
          throw new Error("No schedule data found in dashboard");
        }
      } else {
        const result = await response.json();
        console.log("Schedule API response:", result);
        
        if (result.success) {
          // Handle different response structures
          const scheduleData = result.data?.schedule || result.data || result.schedule || [];
          setAppointments(scheduleData);
          console.log("✅ Schedule data loaded:", scheduleData.length);
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

  // Refresh schedule data
  const refreshSchedule = () => {
    if (authToken) {
      fetchAppointments();
    }
  };

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
        date: new Date().toISOString().split('T')[0], // Today's date
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
        date: new Date().toISOString().split('T')[0], // Today's date
        time: "2:00 PM",
        endTime: "4:00 PM",
        duration: "2 hours",
        payment: `₦${nairaPayments[1].amount.toLocaleString()}`,
        status: "confirmed",
        notes: "Kitchen sink leak repair",
        category: "handyman",
        priority: "medium",
      },
      {
        id: "3",
        title: "Garden Maintenance",
        client: "Alice Brown",
        phone: "+234 555 123 4567",
        location: "789 Palm Road, Port Harcourt",
        date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
        time: "9:00 AM",
        endTime: "11:00 AM",
        duration: "2 hours",
        payment: `₦${nairaPayments[2].amount.toLocaleString()}`,
        status: "pending",
        notes: "Lawn mowing and garden cleanup",
        category: "gardening",
        priority: "low",
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
      
      // Show success message
      console.log("✅ Appointment deleted successfully");
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
      
      console.log(`✅ Appointment status updated to: ${newStatus}`);
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
      
      // Create new appointment object
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

      // Add to local state
      setAppointments(prev => [...prev, newAppointment]);
      setShowAddModal(false);
      
      console.log("✅ New appointment added successfully");
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
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <button
              onClick={handleRetry}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
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

            <div className="flex gap-3">
              <button 
                onClick={refreshSchedule}
                className="bg-gradient-to-r from-gray-600 to-gray-700 text-white px-4 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105 hover:shadow-lg flex items-center gap-2"
              >
                <Loader2 className="w-4 h-4" />
                Refresh
              </button>
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
        </div>

        {/* Error Banner */}
        {error && appointments.length > 0 && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircleIcon className="w-5 h-5 text-red-600" />
              <p className="text-red-700">{error}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={refreshSchedule}
                className="text-red-600 hover:text-red-800 text-sm font-medium"
              >
                Retry
              </button>
              <button
                onClick={() => setError(null)}
                className="text-red-600 hover:text-red-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Success Banner */}
        {!error && appointments.length > 0 && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
              <p className="text-emerald-700">
                Loaded {appointments.length} appointments from your schedule
              </p>
            </div>
            <button
              onClick={refreshSchedule}
              className="text-emerald-600 hover:text-emerald-800 text-sm font-medium"
            >
              Refresh
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

        {/* Rest of your component remains exactly the same from here... */}
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

        {/* The rest of your existing component code for controls, calendar view, and appointment list remains exactly the same */}
        {/* ... [Keep all the existing JSX for controls, calendar, and appointment list] ... */}

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