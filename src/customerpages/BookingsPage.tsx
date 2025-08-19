import React from 'react';
import { Calendar, CheckCircle, Sparkles, Star, DollarSign, MoreVertical, ArrowRight, Plus } from 'lucide-react';
import BookingCard from '../customercomponents/BookingCard';
import { bookings } from '../data/mockData';

const BookingsPage: React.FC = () => {
  const handleBookingAction = (bookingId: string, action: string) => {
    console.log('Booking action:', action, bookingId);
  };

  return (
    <div className="space-y-8">
      {/* Enhanced Header Section with Background */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-3xl p-8">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-400 to-pink-600 rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2"></div>
        </div>
        
        <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                My Bookings
              </h1>
            </div>
            <p className="text-gray-700 text-lg font-medium max-w-md">
              Manage your service appointments and track your booking history
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <button className="group bg-white/80 backdrop-blur-sm border border-white/50 text-gray-700 px-6 py-3 rounded-2xl hover:bg-white hover:shadow-xl transition-all duration-300 flex items-center space-x-2 font-semibold">
              <Calendar className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
              <span>View Calendar</span>
            </button>
            
            <button className="group bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white px-8 py-3 rounded-2xl hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center space-x-2 font-semibold shadow-lg">
              <Plus className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
              <span>Book New Service</span>
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Stats Grid */}
     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Upcoming Bookings */}
      <div className="group relative bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-sm border border-gray-100/50 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-cyan-400/10 rounded-full transform translate-x-8 -translate-y-8"></div>
        
        <div className="relative flex items-start justify-between mb-4">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
            <Calendar className="w-7 h-7 text-white" />
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">2</p>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          </div>
        </div>
        
        <div className="relative">
          <h3 className="text-sm font-bold text-gray-900 mb-1">Upcoming</h3>
          <p className="text-xs text-gray-600">Next: Tomorrow at 2:00 PM</p>
          <div className="mt-3 h-1 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full w-3/4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Completed Bookings */}
      <div className="group relative bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-sm border border-gray-100/50 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-400/10 to-green-400/10 rounded-full transform translate-x-8 -translate-y-8"></div>
        
        <div className="relative flex items-start justify-between mb-4">
          <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
            <CheckCircle className="w-7 h-7 text-white" />
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-gray-900 group-hover:text-emerald-600 transition-colors duration-300">12</p>
            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
          </div>
        </div>
        
        <div className="relative">
          <h3 className="text-sm font-bold text-gray-900 mb-1">Completed</h3>
          <p className="text-xs text-gray-600">100% success rate</p>
          <div className="mt-3 h-1 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full w-full bg-gradient-to-r from-emerald-500 to-green-500 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Average Rating */}
      <div className="group relative bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-sm border border-gray-100/50 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-400/10 to-orange-400/10 rounded-full transform translate-x-8 -translate-y-8"></div>
        
        <div className="relative flex items-start justify-between mb-4">
          <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <div className="text-right flex items-center gap-1">
            <p className="text-3xl font-bold text-gray-900 group-hover:text-amber-600 transition-colors duration-300">4.8</p>
            <Star className="w-4 h-4 text-amber-500 fill-current" />
          </div>
        </div>
        
        <div className="relative">
          <h3 className="text-sm font-bold text-gray-900 mb-1">Avg Rating</h3>
          <p className="text-xs text-gray-600">From 12 reviews</p>
          <div className="flex gap-1 mt-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} className={`w-3 h-3 ${star <= 4 ? 'text-amber-400 fill-current' : 'text-gray-300'}`} />
            ))}
          </div>
        </div>
      </div>

      {/* Total Spent */}
      <div className="group relative bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-sm border border-gray-100/50 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full transform translate-x-8 -translate-y-8"></div>
        
        <div className="relative flex items-start justify-between mb-4">
          <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
            <DollarSign className="w-7 h-7 text-white" />
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors duration-300">$2.4k</p>
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
          </div>
        </div>
        
        <div className="relative">
          <h3 className="text-sm font-bold text-gray-900 mb-1">Total Spent</h3>
          <p className="text-xs text-gray-600">This year</p>
          <div className="mt-3 h-1 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full w-4/5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>


      {/* Enhanced Bookings List */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Recent Bookings</h2>
            <p className="text-gray-600 mt-1">Your latest service appointments</p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <select className="appearance-none bg-white border border-gray-200 rounded-2xl px-4 py-2 pr-8 text-sm font-medium text-gray-700 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors">
                <option>All Bookings</option>
                <option>Upcoming</option>
                <option>Completed</option>
                <option>Cancelled</option>
              </select>
              <MoreVertical className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
            
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Bookings Cards with Enhanced Animation */}
        <div className="space-y-4">
          {bookings.map((booking, index) => (
            <div
              key={booking.id}
              className="animate-in fade-in slide-in-from-bottom-4 duration-700"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <BookingCard
                booking={booking}
                onReschedule={(id) => handleBookingAction(id, 'reschedule')}
                onCancel={(id) => handleBookingAction(id, 'cancel')}
                onContact={(id, method) => handleBookingAction(id, `contact-${method}`)}
              />
            </div>
          ))}
        </div>

        {/* Load More Button */}
        <div className="flex justify-center pt-8">
          <button className="group bg-gradient-to-r from-gray-100 to-gray-200 hover:from-blue-50 hover:to-purple-50 text-gray-700 hover:text-blue-700 px-8 py-3 rounded-2xl border border-gray-200 hover:border-blue-200 transition-all duration-300 flex items-center space-x-3 font-semibold hover:shadow-lg">
            <span>Load More Bookings</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingsPage;