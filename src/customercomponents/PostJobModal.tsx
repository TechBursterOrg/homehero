import React, { useState } from 'react';
import {
  X,
  Upload,
  DollarSign,
  Calendar,
  FileText,
  MapPin
} from 'lucide-react';

interface PostJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (jobData: {
    serviceType: string;
    description: string;
    location: string;
    urgency: string;
    timeframe: string;
    budget: string;
    category: string;
  }) => void;
}

const PostJobModal: React.FC<PostJobModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [jobData, setJobData] = useState({
    serviceType: '',
    description: '',
    category: '',
    budget: '',
    timeframe: '',
    location: '',
    urgency: 'normal'
  });

  const categories = [
    'House Cleaning',
    'Plumbing',
    'Electrical',
    'Garden Care',
    'Handyman',
    'Painting',
    'HVAC',
    'Carpentry',
    'Moving',
    'Other'
  ];

  const timeframes = [
    'ASAP',
    'Within 1 week',
    'Within 2 weeks',
    'Within 1 month',
    'Flexible'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!jobData.serviceType || !jobData.description || !jobData.location) {
      alert('Please fill in all required fields');
      return;
    }

    onSubmit(jobData);
    onClose();
    // Reset form
    setJobData({
      serviceType: '',
      description: '',
      category: '',
      budget: '',
      timeframe: '',
      location: '',
      urgency: 'normal'
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Post a Job</h2>
            <button
              onClick={onClose}
              className="text-gray-600 hover:text-gray-900 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-gray-600 mt-2">
            Describe your job and get responses from qualified service providers
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Service Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Service Type *
            </label>
            <input
              type="text"
              required
              value={jobData.serviceType}
              onChange={(e) => setJobData(prev => ({ ...prev, serviceType: e.target.value }))}
              placeholder="e.g., House Cleaning, Plumbing, Electrical Work"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <select
              required
              value={jobData.category}
              onChange={(e) => setJobData(prev => ({ ...prev, category: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select a category</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Description *
            </label>
            <textarea
              required
              rows={4}
              value={jobData.description}
              onChange={(e) => setJobData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe your job in detail. Include specific requirements, expectations, and any relevant information..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Budget and Timeframe */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Budget *
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  required
                  value={jobData.budget}
                  onChange={(e) => setJobData(prev => ({ ...prev, budget: e.target.value }))}
                  placeholder="e.g., ₦5000-₦10000 or Negotiable"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Timeframe *
              </label>
              <select
                required
                value={jobData.timeframe}
                onChange={(e) => setJobData(prev => ({ ...prev, timeframe: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select timeframe</option>
                {timeframes.map(timeframe => (
                  <option key={timeframe} value={timeframe}>{timeframe}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location *
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input
                type="text"
                required
                value={jobData.location}
                onChange={(e) => setJobData(prev => ({ ...prev, location: e.target.value }))}
                placeholder="Enter your location "
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Urgency */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Urgency
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="urgency"
                  value="normal"
                  checked={jobData.urgency === 'normal'}
                  onChange={(e) => setJobData(prev => ({ ...prev, urgency: e.target.value }))}
                  className="mr-2"
                />
                <span>Normal</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="urgency"
                  value="urgent"
                  checked={jobData.urgency === 'urgent'}
                  onChange={(e) => setJobData(prev => ({ ...prev, urgency: e.target.value }))}
                  className="mr-2"
                />
                <span>Urgent</span>
              </label>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center space-x-4 pt-6 border-t border-gray-200">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-blue-600 to-green-600 text-white py-3 rounded-lg hover:shadow-lg transition-all duration-200 font-medium"
            >
              Post Job
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostJobModal;