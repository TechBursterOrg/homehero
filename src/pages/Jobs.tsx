import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  Calendar, 
  Clock, 
  DollarSign, 
  Eye, 
  Star,
  Briefcase,
  AlertCircle
} from 'lucide-react';

const Jobs: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const availableJobs = [
    {
      id: 4,
      title: 'Deep House Cleaning',
      description: 'Full house cleaning including bathrooms, kitchen, and bedrooms. Looking for experienced cleaner with attention to detail.',
      location: '321 Maple Street, Downtown',
      date: '2025-01-10',
      timeframe: 'Morning (8AM-12PM)',
      budget: '$80-100',
      urgency: 'Normal',
      rating: 4.8,
      reviews: 12,
      category: 'cleaning'
    },
    {
      id: 5,
      title: 'Bathroom Renovation Help',
      description: 'Need experienced handyman for tile installation and fixture mounting. Materials provided.',
      location: '654 Cedar Lane, Suburbs',
      date: '2025-01-12',
      timeframe: 'All Day',
      budget: '$200-250',
      urgency: 'Urgent',
      rating: 4.9,
      reviews: 8,
      category: 'handyman'
    },
    {
      id: 6,
      title: 'Weekly Garden Maintenance',
      description: 'Regular garden upkeep including pruning, weeding, and lawn care. Ongoing weekly commitment.',
      location: '987 Oak Boulevard, Westside',
      date: '2025-01-08',
      timeframe: 'Afternoon (1PM-5PM)',
      budget: '$60-80',
      urgency: 'Normal',
      rating: 4.7,
      reviews: 15,
      category: 'gardening'
    },
    {
      id: 7,
      title: 'Kitchen Deep Clean',
      description: 'Post-renovation kitchen cleaning. Includes appliance cleaning and cabinet organization.',
      location: '456 Pine Street, Central',
      date: '2025-01-11',
      timeframe: 'Morning (9AM-1PM)',
      budget: '$100-120',
      urgency: 'Normal',
      rating: 4.6,
      reviews: 22,
      category: 'cleaning'
    }
  ];

  const filteredJobs = availableJobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || job.category === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
            <Briefcase className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Available Jobs</h1>
            <p className="text-gray-600">Find and apply for jobs that match your skills</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search jobs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
            />
          </div>
          
          <select 
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            className="p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Categories</option>
            <option value="cleaning">Cleaning</option>
            <option value="handyman">Handyman</option>
            <option value="gardening">Gardening</option>
          </select>
        </div>
      </div>

      {/* Job Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <Briefcase className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{filteredJobs.length}</p>
              <p className="text-sm text-gray-600">Available Jobs</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <Clock className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">3</p>
              <p className="text-sm text-gray-600">Applied Today</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-4 h-4 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {filteredJobs.filter(job => job.urgency === 'Urgent').length}
              </p>
              <p className="text-sm text-gray-600">Urgent Jobs</p>
            </div>
          </div>
        </div>
      </div>

      {/* Jobs Grid */}
      <div className="grid gap-6">
        {filteredJobs.map((job) => (
          <div key={job.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200 hover:border-blue-200">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
                  {job.urgency === 'Urgent' && (
                    <span className="bg-red-100 text-red-800 text-xs px-3 py-1 rounded-full font-medium flex items-center space-x-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>Urgent</span>
                    </span>
                  )}
                </div>
                
                <p className="text-gray-600 mb-4 leading-relaxed">{job.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span>{job.date}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span>{job.timeframe}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <DollarSign className="w-4 h-4 text-gray-400" />
                    <span className="font-medium text-green-600">{job.budget}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium text-gray-900">{job.rating}</span>
                      <span className="text-sm text-gray-600">({job.reviews} reviews)</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <button className="text-blue-600 hover:text-blue-700 transition-colors flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-blue-50">
                      <Eye className="w-4 h-4" />
                      <span>View Details</span>
                    </button>
                    <button className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all duration-200 hover:scale-105">
                      Apply Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredJobs.length === 0 && (
        <div className="text-center py-12">
          <Briefcase className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
          <p className="text-gray-600">Try adjusting your search terms or filters</p>
        </div>
      )}
    </div>
  );
};

export default Jobs;