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
  DollarSign
} from 'lucide-react';

const Schedule: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'week' | 'month'>('week');

  const appointments = [
    {
      id: 1,
      title: 'Deep House Cleaning',
      client: 'Sarah Johnson',
      phone: '+1 (555) 123-4567',
      location: '123 Oak Street',
      date: '2025-01-08',
      time: '10:00 AM',
      duration: '3 hours',
      payment: '$75',
      status: 'confirmed',
      notes: 'Client prefers eco-friendly products'
    },
    {
      id: 2,
      title: 'Plumbing Repair',
      client: 'Mike Chen',
      phone: '+1 (555) 987-6543',
      location: '456 Pine Avenue',
      date: '2025-01-08',
      time: '2:00 PM',
      duration: '2 hours',
      payment: '$120',
      status: 'confirmed',
      notes: 'Kitchen sink leak repair'
    },
    {
      id: 3,
      title: 'Garden Maintenance',
      client: 'Emma Wilson',
      phone: '+1 (555) 246-8135',
      location: '789 Elm Drive',
      date: '2025-01-09',
      time: '9:00 AM',
      duration: '4 hours',
      payment: '$80',
      status: 'pending',
      notes: 'Weekly maintenance service'
    },
    {
      id: 4,
      title: 'Bathroom Deep Clean',
      client: 'David Brown',
      phone: '+1 (555) 369-2580',
      location: '321 Maple Street',
      date: '2025-01-10',
      time: '11:00 AM',
      duration: '2 hours',
      payment: '$60',
      status: 'confirmed',
      notes: 'Post-renovation cleanup'
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
    return appointments.filter(apt => apt.date === date);
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentDate(newDate);
  };

  const weekDays = getWeekDays();
  const today = formatDate(new Date());

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-100 to-purple-200 rounded-lg flex items-center justify-center">
            <Calendar className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Schedule</h1>
            <p className="text-gray-600">Manage your appointments and availability</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
            <button 
              onClick={() => setViewMode('week')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'week' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
              }`}
            >
              Week
            </button>
            <button 
              onClick={() => setViewMode('month')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'month' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
              }`}
            >
              Month
            </button>
          </div>
          
          <button className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-200 hover:scale-105 flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Add Appointment</span>
          </button>
        </div>
      </div>

      {/* Week Navigation */}
      <div className="flex items-center justify-between bg-white rounded-lg p-4 shadow-sm border border-gray-100">
        <button 
          onClick={() => navigateWeek('prev')}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
        
        <h2 className="text-lg font-semibold text-gray-900">
          Week of {weekDays[0].toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </h2>
        
        <button 
          onClick={() => navigateWeek('next')}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Weekly Calendar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="grid grid-cols-7 border-b border-gray-200">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
            <div key={day} className="p-4 text-center border-r border-gray-200 last:border-r-0">
              <div className="text-sm font-medium text-gray-600">{day}</div>
              <div className={`text-lg font-semibold mt-1 ${
                formatDate(weekDays[index]) === today 
                  ? 'text-blue-600 bg-blue-100 w-8 h-8 rounded-full flex items-center justify-center mx-auto' 
                  : 'text-gray-900'
              }`}>
                {weekDays[index].getDate()}
              </div>
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-7 min-h-96">
          {weekDays.map((day, index) => {
            const dayAppointments = getAppointmentsForDate(formatDate(day));
            
            return (
              <div key={index} className="p-3 border-r border-gray-200 last:border-r-0 border-b md:border-b-0 border-gray-200">
                <div className="space-y-2">
                  {dayAppointments.map((appointment) => (
                    <div 
                      key={appointment.id} 
                      className={`p-3 rounded-lg text-xs border-l-4 hover:shadow-sm transition-all duration-200 cursor-pointer ${
                        appointment.status === 'confirmed' 
                          ? 'bg-green-50 border-green-500 hover:bg-green-100' 
                          : 'bg-yellow-50 border-yellow-500 hover:bg-yellow-100'
                      }`}
                    >
                      <div className="font-medium text-gray-900 mb-1">
                        {appointment.time}
                      </div>
                      <div className="text-gray-800 font-medium mb-1">
                        {appointment.title}
                      </div>
                      <div className="text-gray-600 flex items-center space-x-1">
                        <User className="w-3 h-3" />
                        <span>{appointment.client}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Upcoming Appointments */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Upcoming Appointments</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <div key={appointment.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="font-semibold text-gray-900">{appointment.title}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        appointment.status === 'confirmed' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {appointment.status}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4" />
                        <span>{appointment.client}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4" />
                        <span>{appointment.phone}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4" />
                        <span>{appointment.location}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4" />
                        <span>{appointment.date} at {appointment.time} ({appointment.duration})</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <DollarSign className="w-4 h-4" />
                        <span className="font-medium text-green-600">{appointment.payment}</span>
                      </div>
                    </div>
                    
                    {appointment.notes && (
                      <div className="mt-3 p-2 bg-gray-50 rounded text-sm text-gray-600">
                        <strong>Notes:</strong> {appointment.notes}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Schedule;