import React, { useState } from 'react';
import { 
  DollarSign, 
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
  Zap,
  Activity,
  ChevronRight,
  Sparkles
} from 'lucide-react';

interface AvailabilitySlot {
  id: number;
  date: string;
  startTime: string;
  endTime: string;
  serviceType: string;
  notes: string;
  status: string;
}

interface NewSlotData {
  date: string;
  startTime: string;
  endTime: string;
  serviceType: string;
  notes: string;
}

const Dashboard: React.FC = () => {
  const [showAvailabilityModal, setShowAvailabilityModal] = useState(false);
  const [availabilitySlots, setAvailabilitySlots] = useState<AvailabilitySlot[]>([]);
  const [newSlot, setNewSlot] = useState<NewSlotData>({
    date: '',
    startTime: '',
    endTime: '',
    serviceType: '',
    notes: ''
  });

  const serviceTypes = [
    'House Cleaning',
    'Plumbing Repair',
    'Garden Maintenance',
    'Electrical Work',
    'Painting',
    'General Maintenance',
    'Other'
  ];

  const recentJobs = [
    {
      id: 1,
      title: 'House Cleaning',
      client: 'Sarah Johnson',
      location: '123 Oak Street',
      date: '2025-01-08',
      time: '10:00 AM',
      payment: '$75',
      status: 'upcoming',
      category: 'cleaning'
    },
    {
      id: 2,
      title: 'Plumbing Repair',
      client: 'Mike Chen',
      location: '456 Pine Avenue',
      date: '2025-01-06',
      time: '2:00 PM',
      payment: '$120',
      status: 'completed',
      category: 'handyman'
    },
    {
      id: 3,
      title: 'Garden Maintenance',
      client: 'Emma Wilson',
      location: '789 Elm Drive',
      date: '2025-01-05',
      time: '9:00 AM',
      payment: '$60',
      status: 'completed',
      category: 'gardening'
    }
  ];

  const upcomingTasks = [
    {
      id: 1,
      title: 'Deep Clean - Wilson Residence',
      time: '9:00 AM',
      duration: '3 hours',
      client: 'Emma Wilson',
      priority: 'high',
      category: 'cleaning'
    },
    {
      id: 2,
      title: 'Bathroom Repair - Chen Property',
      time: '2:00 PM',
      duration: '2 hours',
      client: 'Mike Chen',
      priority: 'medium',
      category: 'handyman'
    }
  ];

  const handleAddAvailability = () => {
    setShowAvailabilityModal(true);
  };

  const handleSaveAvailability = (): void => {
    if (newSlot.date && newSlot.startTime && newSlot.endTime && newSlot.serviceType) {
      const slot: AvailabilitySlot = {
        id: Date.now(),
        ...newSlot,
        status: 'available'
      };
      setAvailabilitySlots([...availabilitySlots, slot]);
      setNewSlot({
        date: '',
        startTime: '',
        endTime: '',
        serviceType: '',
        notes: ''
      });
      setShowAvailabilityModal(false);
    }
  };

  const handleCloseModal = () => {
    setShowAvailabilityModal(false);
    setNewSlot({
      date: '',
      startTime: '',
      endTime: '',
      serviceType: '',
      notes: ''
    });
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatTime = (timeString: string): string => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'upcoming': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'in-progress': return 'bg-amber-100 text-amber-700 border-amber-200';
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Modern Header - Mobile Responsive */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0 gap-6">
            <div className="space-y-2">
             <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 bg-gradient-to-br from-blue-600 to-purple-700 rounded-xl sm:rounded-2xl md:rounded-3xl flex items-center justify-center shadow-lg flex-shrink-0">
                  <span className="text-white font-bold text-sm sm:text-lg md:text-xl">A</span>
                </div>
                <div className="min-w-0 flex-1">
                  <h1 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent leading-tight">
                    <span className="block sm:inline">Welcome back, Alex!</span> 
                    <span className="inline sm:inline">👋</span>
                  </h1>
                  <p className="text-gray-600 text-sm sm:text-base md:text-lg mt-1 leading-relaxed">
                    <span className="hidden xs:inline">Ready to make today productive? Here's your overview.</span>
                    <span className="xs:hidden">Here's your overview for today.</span>
                  </p>
                </div>
              </div>
            </div>
            
            <button 
              onClick={handleAddAvailability}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 sm:px-8 sm:py-4 rounded-xl sm:rounded-2xl font-semibold transition-all duration-200 hover:scale-105 hover:shadow-xl shadow-lg shadow-blue-200 flex items-center justify-center gap-3 w-full sm:w-auto"
            >
              <div className="w-5 h-5 sm:w-6 sm:h-6 bg-white/20 rounded-lg flex items-center justify-center">
                <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
              </div>
              <span>Add Availability</span>
            </button>
          </div>
        </div>

        {/* Enhanced Stats Cards - Mobile Responsive */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
          <div className="group bg-white/80 backdrop-blur-sm p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="w-10 h-10 sm:w-14 sm:h-14 bg-gradient-to-br from-emerald-400 to-green-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
                <DollarSign className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
              </div>
              <div className="text-emerald-600">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-xs sm:text-sm font-medium text-gray-600">Total Earnings</p>
              <p className="text-xl sm:text-3xl font-bold text-gray-900">$2,850</p>
              <div className="flex items-center gap-1 text-xs sm:text-sm">
                <span className="text-emerald-600 font-semibold">+12%</span>
                <span className="text-gray-500 hidden sm:inline">from last month</span>
                <span className="text-gray-500 sm:hidden">vs last</span>
              </div>
            </div>
          </div>

          <div className="group bg-white/80 backdrop-blur-sm p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="w-10 h-10 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
                <CheckCircle className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
              </div>
              <div className="text-blue-600">
                <Activity className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-xs sm:text-sm font-medium text-gray-600">Jobs Completed</p>
              <p className="text-xl sm:text-3xl font-bold text-gray-900">47</p>
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
              <p className="text-xl sm:text-3xl font-bold text-gray-900">4.9 ⭐</p>
              <div className="text-xs sm:text-sm text-gray-500">
                <span className="hidden sm:inline">Based on 43 reviews</span>
                <span className="sm:hidden">43 reviews</span>
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
              <p className="text-xl sm:text-3xl font-bold text-gray-900">23</p>
              <div className="flex items-center gap-1 text-xs sm:text-sm">
                <span className="text-purple-600 font-semibold">+3</span>
                <span className="text-gray-500 hidden sm:inline">new this week</span>
                <span className="text-gray-500 sm:hidden">new</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Recent Jobs - Mobile Responsive */}
          <div className="lg:col-span-2 bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100">
            <div className="p-4 sm:p-8 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl sm:rounded-2xl flex items-center justify-center">
                    <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Recent Jobs</h3>
                    <p className="text-gray-600 text-sm sm:text-base hidden sm:block">Your latest service activities</p>
                  </div>
                </div>
                <button className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 transition-colors text-sm sm:text-base">
                  <span className="hidden sm:inline">View All</span>
                  <span className="sm:hidden">All</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="p-4 sm:p-8">
              <div className="space-y-3 sm:space-y-4">
                {recentJobs.map((job) => (
                  <div key={job.id} className="group p-4 sm:p-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl sm:rounded-2xl hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 hover:shadow-lg border border-gray-100">
                    {/* Mobile Layout - Stacked */}
                    <div className="flex flex-col sm:hidden space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                            <span className="text-white font-bold text-xs">
                              {getClientInitials(job.client)}
                            </span>
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-base">{getCategoryIcon(job.category)}</span>
                              <h4 className="font-bold text-gray-900 text-sm group-hover:text-blue-600 transition-colors">
                                {job.title}
                              </h4>
                            </div>
                            <p className="text-sm text-gray-600 font-medium">{job.client}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-green-600">{job.payment}</p>
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
                            <span>{job.date}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{job.time}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Desktop Layout - Original */}
                    <div className="hidden sm:flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                          <span className="text-white font-bold text-sm">
                            {getClientInitials(job.client)}
                          </span>
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <span className="text-lg">{getCategoryIcon(job.category)}</span>
                            <h4 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
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
                        <p className="text-2xl font-bold text-green-600 mb-1">{job.payment}</p>
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
              </div>
            </div>
          </div>

          {/* Sidebar - Mobile Responsive */}
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
                    <p className="text-gray-600 text-xs sm:text-sm">January 12, 2025</p>
                  </div>
                </div>
              </div>
              <div className="p-4 sm:p-6">
                <div className="space-y-3 sm:space-y-4">
                  {upcomingTasks.map((task) => (
                    <div key={task.id} className={`relative p-3 sm:p-4 rounded-xl sm:rounded-2xl border-l-4 ${getPriorityColor(task.priority)} transition-all duration-200 hover:shadow-md`}>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-base sm:text-lg">{getCategoryIcon(task.category)}</span>
                        <h4 className="font-bold text-gray-900 text-xs sm:text-sm leading-tight">{task.title}</h4>
                      </div>
                      <p className="text-gray-600 text-xs sm:text-sm mb-3">{task.client}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-blue-600">
                          <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span>{task.time}</span>
                        </div>
                        <span className="text-xs bg-white/80 text-gray-600 px-2 py-1 rounded-lg">
                          {task.duration}
                        </span>
                      </div>
                    </div>
                  ))}
                  {upcomingTasks.length === 0 && (
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

            {/* Available Slots */}
            {availabilitySlots.length > 0 && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100">
                <div className="p-4 sm:p-6 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl sm:rounded-2xl flex items-center justify-center">
                      <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900">Available Slots</h3>
                      <p className="text-gray-600 text-xs sm:text-sm">Open for bookings</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 sm:p-6">
                  <div className="space-y-3 sm:space-y-4">
                    {availabilitySlots.map((slot) => (
                      <div key={slot.id} className="p-3 sm:p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl sm:rounded-2xl border border-emerald-200">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                          <h4 className="font-bold text-gray-900 text-xs sm:text-sm">{slot.serviceType}</h4>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                            <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span>{formatDate(slot.date)}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs sm:text-sm text-emerald-600 font-medium">
                            <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span>{formatTime(slot.startTime)} - {formatTime(slot.endTime)}</span>
                          </div>
                          {slot.notes && (
                            <p className="text-xs sm:text-sm text-gray-500 mt-2 italic">{slot.notes}</p>
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

        {/* Enhanced Add Availability Modal - Mobile Responsive */}
        {showAvailabilityModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 sm:p-8 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl sm:rounded-2xl flex items-center justify-center">
                      <Plus className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Add Availability</h2>
                      <p className="text-gray-600 text-sm sm:text-base">Set your available time slots</p>
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
                {/* Date */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    Select Date
                  </label>
                  <input
                    type="date"
                    value={newSlot.date}
                    onChange={(e) => setNewSlot({...newSlot, date: e.target.value})}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 transition-all duration-200"
                  />
                </div>

                {/* Time Range */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3">
                      Start Time
                    </label>
                    <input
                      type="time"
                      value={newSlot.startTime}
                      onChange={(e) => setNewSlot({...newSlot, startTime: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3">
                      End Time
                    </label>
                    <input
                      type="time"
                      value={newSlot.endTime}
                      onChange={(e) => setNewSlot({...newSlot, endTime: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Service Type */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    Service Type
                  </label>
                  <select
                    value={newSlot.serviceType}
                    onChange={(e) => setNewSlot({...newSlot, serviceType: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 transition-all duration-200"
                  >
                    <option value="">Choose your service type</option>
                    {serviceTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    Additional Notes (Optional)
                  </label>
                  <textarea
                    value={newSlot.notes}
                    onChange={(e) => setNewSlot({...newSlot, notes: e.target.value})}
                    placeholder="Any special requirements, tools needed, or important details..."
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 resize-none transition-all duration-200"
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
                  onClick={handleSaveAvailability}
                  disabled={!newSlot.date || !newSlot.startTime || !newSlot.endTime || !newSlot.serviceType}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl sm:rounded-2xl hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 font-semibold hover:scale-105"
                >
                  <Save className="w-5 h-5" />
                  <span>Save Availability</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;