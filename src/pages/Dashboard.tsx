import React from 'react';
import { 
  DollarSign, 
  CheckCircle, 
  Star, 
  Users, 
  TrendingUp, 
  Plus,
  Clock,
  Calendar,
  MapPin
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const recentJobs = [
    {
      id: 1,
      title: 'House Cleaning',
      client: 'Sarah Johnson',
      location: '123 Oak Street',
      date: '2025-01-08',
      time: '10:00 AM',
      payment: '$75',
      status: 'upcoming'
    },
    {
      id: 2,
      title: 'Plumbing Repair',
      client: 'Mike Chen',
      location: '456 Pine Avenue',
      date: '2025-01-06',
      time: '2:00 PM',
      payment: '$120',
      status: 'completed'
    },
    {
      id: 3,
      title: 'Garden Maintenance',
      client: 'Emma Wilson',
      location: '789 Elm Drive',
      date: '2025-01-05',
      time: '9:00 AM',
      payment: '$60',
      status: 'completed'
    }
  ];

  const upcomingTasks = [
    {
      id: 1,
      title: 'Deep Clean - Wilson Residence',
      time: '9:00 AM',
      duration: '3 hours',
      client: 'Emma Wilson'
    },
    {
      id: 2,
      title: 'Bathroom Repair - Chen Property',
      time: '2:00 PM',
      duration: '2 hours',
      client: 'Mike Chen'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Welcome back, Alex!</h1>
          <p className="text-gray-600 mt-1">Here's what's happening with your services today.</p>
        </div>
        <button className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-200 hover:scale-105 flex items-center space-x-2">
          <Plus className="w-5 h-5" />
          <span>Add Availability</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Earnings</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">$2,850</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-green-100 to-green-200 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-3 flex items-center text-sm text-green-600">
            <TrendingUp className="w-4 h-4 mr-1" />
            +12% from last month
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Jobs Completed</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">47</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-3 flex items-center text-sm text-blue-600">
            <TrendingUp className="w-4 h-4 mr-1" />
            +8 this week
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Rating</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">4.9</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-yellow-100 to-yellow-200 rounded-xl flex items-center justify-center">
              <Star className="w-6 h-6 text-yellow-600 fill-current" />
            </div>
          </div>
          <div className="mt-3 text-sm text-gray-600">
            Based on 43 reviews
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Clients</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">23</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-purple-100 to-purple-200 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-3 flex items-center text-sm text-purple-600">
            <TrendingUp className="w-4 h-4 mr-1" />
            +3 new this week
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Jobs */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">Recent Jobs</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentJobs.map((job) => (
                <div key={job.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200 group">
                  <div className="flex items-center space-x-4">
                    <div className={`w-3 h-3 rounded-full ${
                      job.status === 'completed' ? 'bg-green-500' : 
                      job.status === 'upcoming' ? 'bg-blue-500' : 'bg-yellow-500'
                    }`}></div>
                    <div>
                      <h4 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                        {job.title}
                      </h4>
                      <p className="text-sm text-gray-600 flex items-center space-x-1 mt-1">
                        <span>{job.client}</span>
                        <span>•</span>
                        <MapPin className="w-3 h-3" />
                        <span>{job.location}</span>
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{job.payment}</p>
                    <p className="text-sm text-gray-600 flex items-center space-x-1 mt-1">
                      <Calendar className="w-3 h-3" />
                      <span>{job.date}</span>
                      <Clock className="w-3 h-3 ml-1" />
                      <span>{job.time}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Today's Schedule */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">Today's Schedule</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {upcomingTasks.map((task) => (
                <div key={task.id} className="border-l-4 border-blue-500 pl-4 py-2">
                  <h4 className="font-medium text-gray-900">{task.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{task.client}</p>
                  <div className="flex items-center space-x-2 text-sm text-blue-600 mt-2">
                    <Clock className="w-4 h-4" />
                    <span>{task.time} ({task.duration})</span>
                  </div>
                </div>
              ))}
              {upcomingTasks.length === 0 && (
                <div className="text-center py-6 text-gray-500">
                  <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No tasks scheduled for today</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;