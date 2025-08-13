import React, { useState } from 'react';
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
  Zap
} from 'lucide-react';

const Schedule: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'week' | 'month'>('week');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'confirmed' | 'pending'>('all');

  const appointments = [
    {
      id: 1,
      title: 'Deep House Cleaning',
      client: 'Sarah Johnson',
      phone: '+1 (555) 123-4567',
      location: '123 Oak Street',
      date: '2025-01-08',
      time: '10:00 AM',
      endTime: '1:00 PM',
      duration: '3 hours',
      payment: '$75',
      status: 'confirmed',
      notes: 'Client prefers eco-friendly products',
      category: 'cleaning',
      priority: 'high'
    },
    {
      id: 2,
      title: 'Plumbing Repair',
      client: 'Mike Chen',
      phone: '+1 (555) 987-6543',
      location: '456 Pine Avenue',
      date: '2025-01-08',
      time: '2:00 PM',
      endTime: '4:00 PM',
      duration: '2 hours',
      payment: '$120',
      status: 'confirmed',
      notes: 'Kitchen sink leak repair',
      category: 'handyman',
      priority: 'medium'
    },
    {
      id: 3,
      title: 'Garden Maintenance',
      client: 'Emma Wilson',
      phone: '+1 (555) 246-8135',
      location: '789 Elm Drive',
      date: '2025-01-09',
      time: '9:00 AM',
      endTime: '1:00 PM',
      duration: '4 hours',
      payment: '$80',
      status: 'pending',
      notes: 'Weekly maintenance service',
      category: 'gardening',
      priority: 'low'
    },
    {
      id: 4,
      title: 'Bathroom Deep Clean',
      client: 'David Brown',
      phone: '+1 (555) 369-2580',
      location: '321 Maple Street',
      date: '2025-01-10',
      time: '11:00 AM',
      endTime: '1:00 PM',
      duration: '2 hours',
      payment: '$60',
      status: 'confirmed',
      notes: 'Post-renovation cleanup',
      category: 'cleaning',
      priority: 'medium'
    }
  ];

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
    return date.toISOString().split('T')[0];
  };

  const getAppointmentsForDate = (date: string) => {
    return appointments.filter(apt => apt.date === date && 
      (filterStatus === 'all' || apt.status === filterStatus) &&
      (searchQuery === '' || 
        apt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        apt.client.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentDate(newDate);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'cleaning': return '🧽';
      case 'handyman': return '🔧';
      case 'gardening': return '🌿';
      default: return '💼';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-emerald-50 border-emerald-200 text-emerald-700';
      case 'pending': return 'bg-amber-50 border-amber-200 text-amber-700';
      default: return 'bg-gray-50 border-gray-200 text-gray-700';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-400';
      case 'medium': return 'border-amber-400';
      case 'low': return 'border-green-400';
      default: return 'border-blue-400';
    }
  };

  const getClientInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const weekDays = getWeekDays();
  const today = formatDate(new Date());
  const filteredAppointments = appointments.filter(apt => 
    (filterStatus === 'all' || apt.status === filterStatus) &&
    (searchQuery === '' || 
      apt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.client.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const todayAppointments = getAppointmentsForDate(today);
  const totalRevenue = filteredAppointments.reduce((sum, apt) => sum + parseInt(apt.payment.replace('$', '')), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Modern Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-700 rounded-3xl flex items-center justify-center shadow-lg">
                  <Calendar className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                    Schedule Management 📅
                  </h1>
                  <p className="text-gray-600 text-lg">Organize your appointments and track your availability</p>
                </div>
              </div>
            </div>
            
            <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-200 hover:scale-105 hover:shadow-xl shadow-lg shadow-blue-200 flex items-center gap-3">
              <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center">
                <Plus className="w-4 h-4" />
              </div>
              <span>Add Appointment</span>
            </button>
          </div>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
              <p className="text-sm font-medium text-gray-600">Today's Appointments</p>
              <p className="text-3xl font-bold text-gray-900">{todayAppointments.length}</p>
              <div className="text-sm text-gray-500">
                {todayAppointments.filter(apt => apt.status === 'confirmed').length} confirmed
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
              <p className="text-sm font-medium text-gray-600">Confirmed Jobs</p>
              <p className="text-3xl font-bold text-gray-900">
                {appointments.filter(apt => apt.status === 'confirmed').length}
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
              <p className="text-sm font-medium text-gray-600">Pending Approval</p>
              <p className="text-3xl font-bold text-gray-900">
                {appointments.filter(apt => apt.status === 'pending').length}
              </p>
              <div className="text-sm text-amber-600 font-semibold">
                Needs attention
              </div>
            </div>
          </div>

          <div className="group bg-white/80 backdrop-blur-sm p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                <DollarSign className="w-7 h-7 text-white" />
              </div>
              <div className="text-green-600">
                <Sparkles className="w-5 h-5" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-600">Expected Revenue</p>
              <p className="text-3xl font-bold text-gray-900">${totalRevenue}</p>
              <div className="text-sm text-green-600 font-semibold">
                This week
              </div>
            </div>
          </div>
        </div>

        {/* Controls and Filters */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-sm border border-gray-100 p-4 sm:p-6 mb-8">
          {/* Mobile Layout - Stacked */}
          <div className="flex flex-col gap-4 lg:hidden">
            {/* Top row - View Mode and Navigation */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              {/* View Mode Toggle */}
              <div className="flex items-center space-x-2 bg-gray-100 rounded-2xl p-1 w-full sm:w-auto">
                <button 
                  onClick={() => setViewMode('week')}
                  className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    viewMode === 'week' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Week View
                </button>
                <button 
                  onClick={() => setViewMode('month')}
                  className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    viewMode === 'month' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Month View
                </button>
              </div>

              {/* Week Navigation */}
              <div className="flex items-center bg-gray-100 rounded-2xl p-1 w-full sm:w-auto">
                <button 
                  onClick={() => navigateWeek('prev')}
                  className="p-2 rounded-xl hover:bg-white transition-all duration-200 hover:shadow-sm"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-600" />
                </button>
                <span className="flex-1 sm:flex-none px-2 sm:px-4 text-xs sm:text-sm font-medium text-gray-700 text-center">
                  {weekDays[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {weekDays[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
                <button 
                  onClick={() => navigateWeek('next')}
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
                  onChange={(e) => setFilterStatus(e.target.value as 'all' | 'confirmed' | 'pending')}
                  className="flex-1 sm:flex-none border border-gray-200 rounded-2xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="pending">Pending</option>
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
                  onClick={() => setViewMode('week')}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    viewMode === 'week' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Week View
                </button>
                <button 
                  onClick={() => setViewMode('month')}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    viewMode === 'month' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Month View
                </button>
              </div>

              {/* Week Navigation */}
              <div className="flex items-center bg-gray-100 rounded-2xl p-1">
                <button 
                  onClick={() => navigateWeek('prev')}
                  className="p-2 rounded-xl hover:bg-white transition-all duration-200 hover:shadow-sm"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-600" />
                </button>
                <span className="px-4 text-sm font-medium text-gray-700">
                  {weekDays[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {weekDays[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
                <button 
                  onClick={() => navigateWeek('next')}
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
                  onChange={(e) => setFilterStatus(e.target.value as 'all' | 'confirmed' | 'pending')}
                  className="border border-gray-200 rounded-2xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Weekly Calendar View */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-8">
          {/* Days Header */}
          <div className="grid grid-cols-7 border-b border-gray-200">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
              <div key={day} className="p-2 sm:p-4 text-center border-r border-gray-200 last:border-r-0">
                <div className="text-xs sm:text-sm font-medium text-gray-600 mb-1">
                  <span className="hidden sm:inline">
                    {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][index]}
                  </span>
                  <span className="sm:hidden">{day}</span>
                </div>
                <div className={`text-lg sm:text-2xl font-bold transition-all duration-200 ${
                  formatDate(weekDays[index]) === today 
                    ? 'text-white bg-gradient-to-br from-blue-600 to-purple-600 w-8 h-8 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto shadow-lg text-sm sm:text-2xl' 
                    : 'text-gray-900'
                }`}>
                  {weekDays[index].getDate()}
                </div>
              </div>
            ))}
          </div>
          
          {/* Calendar Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-7 min-h-64 sm:min-h-96">
            {weekDays.map((day, index) => {
              const dayAppointments = getAppointmentsForDate(formatDate(day));
              
              return (
                <div key={index} className="p-3 sm:p-4 border-r border-gray-200 last:border-r-0 border-b sm:border-b-0 border-gray-200 min-h-48 sm:min-h-64">
                  {/* Mobile: Show day name again */}
                  <div className="sm:hidden mb-3 pb-2 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-700">
                        {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][index]}
                      </span>
                      <span className={`text-lg font-bold ${
                        formatDate(weekDays[index]) === today ? 'text-blue-600' : 'text-gray-600'
                      }`}>
                        {weekDays[index].getDate()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-2 sm:space-y-3">
                    {dayAppointments.map((appointment) => (
                      <div 
                        key={appointment.id} 
                        className={`group p-3 sm:p-4 rounded-xl sm:rounded-2xl text-sm border-l-4 hover:shadow-lg transition-all duration-300 cursor-pointer ${
                          appointment.status === 'confirmed' 
                            ? 'bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-500 hover:from-emerald-100 hover:to-green-100' 
                            : 'bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-500 hover:from-amber-100 hover:to-yellow-100'
                        } ${getPriorityColor(appointment.priority)}`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm sm:text-base">{getCategoryIcon(appointment.category)}</span>
                          <div className="font-bold text-gray-900 text-xs sm:text-xs">
                            {appointment.time}
                          </div>
                        </div>
                        <div className="text-gray-800 font-semibold mb-2 text-xs sm:text-xs leading-tight">
                          {appointment.title}
                        </div>
                        <div className="space-y-1">
                          <div className="text-gray-600 flex items-center gap-1 text-xs">
                            <User className="w-3 h-3 flex-shrink-0" />
                            <span className="truncate">{appointment.client}</span>
                          </div>
                          <div className="text-green-600 font-bold text-xs">
                            {appointment.payment}
                          </div>
                          {/* Mobile: Show location on mobile for better context */}
                          <div className="sm:hidden text-gray-500 flex items-start gap-1 text-xs">
                            <MapPin className="w-3 h-3 flex-shrink-0 mt-0.5" />
                            <span className="break-words text-xs leading-tight">{appointment.location}</span>
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

        {/* FIXED: Mobile-Responsive Upcoming Appointments */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-sm border border-gray-100">
          <div className="p-4 sm:p-8 border-b border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Upcoming Appointments</h3>
                  <p className="text-gray-600 text-sm sm:text-base">Detailed view of your scheduled services</p>
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
                <div key={appointment.id} className="group bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-200 rounded-2xl sm:rounded-3xl p-4 sm:p-6 hover:shadow-xl hover:from-blue-50 hover:to-indigo-50 transition-all duration-300">
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
                            <span className="text-lg">{getCategoryIcon(appointment.category)}</span>
                            <h4 className="font-bold text-gray-900 text-base">
                              {appointment.title}
                            </h4>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold border ${getStatusColor(appointment.status)}`}>
                              {appointment.status === 'confirmed' ? <CheckCircle className="w-3 h-3 mr-1" /> : <AlertCircle className="w-3 h-3 mr-1" />}
                              {appointment.status}
                            </span>
                            <div className={`w-1 h-4 rounded-full ${getPriorityColor(appointment.priority).replace('border-', 'bg-')}`}></div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Mobile action buttons - vertical stack */}
                      <div className="flex flex-col gap-2">
                        <button className="w-8 h-8 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-xl flex items-center justify-center transition-all duration-200">
                          <Edit3 className="w-3 h-3" />
                        </button>
                        <button className="w-8 h-8 bg-red-100 hover:bg-red-200 text-red-600 rounded-xl flex items-center justify-center transition-all duration-200">
                          <Trash2 className="w-3 h-3" />
                        </button>
                        <button className="w-8 h-8 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl flex items-center justify-center transition-all duration-200">
                          <MoreVertical className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    
                    {/* Mobile info grid - 2 columns */}
                    <div className="grid grid-cols-1 gap-3 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-blue-500 flex-shrink-0" />
                        <span className="font-medium truncate">{appointment.client}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span className="truncate">{appointment.phone}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                        <span className="break-words">{appointment.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-purple-500 flex-shrink-0" />
                        <span>{new Date(appointment.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-orange-500 flex-shrink-0" />
                        <span>{appointment.time} - {appointment.endTime}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                        <span className="font-bold text-emerald-600 text-base">{appointment.payment}</span>
                      </div>
                    </div>
                    
                    {/* Mobile notes */}
                    {appointment.notes && (
                      <div className="p-3 bg-white/60 backdrop-blur-sm rounded-xl border border-gray-200">
                        <div className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                          <div className="min-w-0">
                            <strong className="text-gray-700 text-sm">Notes:</strong>
                            <p className="text-gray-600 text-sm mt-1 break-words">{appointment.notes}</p>
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
                          <span className="text-2xl">{getCategoryIcon(appointment.category)}</span>
                          <h4 className="font-bold text-gray-900 text-lg group-hover:text-blue-600 transition-colors">
                            {appointment.title}
                          </h4>
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(appointment.status)}`}>
                            {appointment.status === 'confirmed' ? <CheckCircle className="w-4 h-4 mr-1" /> : <AlertCircle className="w-4 h-4 mr-1" />}
                            {appointment.status}
                          </span>
                          <div className={`w-1 h-6 rounded-full ${getPriorityColor(appointment.priority).replace('border-', 'bg-')}`}></div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-gray-600 mb-4">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-blue-500" />
                            <span className="font-medium">{appointment.client}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-green-500" />
                            <span>{appointment.phone}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-red-500" />
                            <span className="truncate">{appointment.location}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-purple-500" />
                            <span>{new Date(appointment.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-orange-500" />
                            <span>{appointment.time} - {appointment.endTime}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-emerald-500" />
                            <span className="font-bold text-emerald-600 text-lg">{appointment.payment}</span>
                          </div>
                        </div>
                        
                        {appointment.notes && (
                          <div className="p-4 bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-200">
                            <div className="flex items-start gap-2">
                              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                              <div>
                                <strong className="text-gray-700 text-sm">Notes:</strong>
                                <p className="text-gray-600 text-sm mt-1">{appointment.notes}</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      <button className="w-10 h-10 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-2xl flex items-center justify-center transition-all duration-200 hover:scale-110">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button className="w-10 h-10 bg-red-100 hover:bg-red-200 text-red-600 rounded-2xl flex items-center justify-center transition-all duration-200 hover:scale-110">
                        <Trash2 className="w-4 h-4" />
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
      </div>
    </div>
  );
};

export default Schedule;