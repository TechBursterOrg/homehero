import React, { useState } from 'react';
import {
  X,
  DollarSign,
  MapPin,
  CreditCard,
  Shield
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
    skillsRequired: string[];
    estimatedDuration: string;
    preferredSchedule: string;
  }) => void;
  userCountry?: string;
}

const PostJobModal: React.FC<PostJobModalProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit,
  userCountry = 'Nigeria'
}) => {
  const [jobData, setJobData] = useState({
    serviceType: '',
    description: '',
    category: '',
    budget: '',
    timeframe: '',
    location: '',
    urgency: 'normal',
    skillsRequired: [] as string[],
    estimatedDuration: '',
    preferredSchedule: ''
  });

  const [currentSkill, setCurrentSkill] = useState('');
  const [showPaymentInfo, setShowPaymentInfo] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    'House Cleaning',
    'Plumbing',
    'Electrical',
    'Barber',
    'Hair Stylist',
    'Garden Care',
    'Handyman',
    'Babysitting',
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

  const estimatedDurations = [
    'Less than 1 hour',
    '1-2 hours',
    '2-4 hours',
    '4-8 hours',
    '1-2 days',
    '2+ days',
    'To be determined'
  ];

  const schedules = [
    'Weekdays',
    'Weekends',
    'Mornings',
    'Afternoons',
    'Evenings',
    'Flexible',
    'To be discussed'
  ];

  const commonSkills = [
    'Cleaning',
    'Repair',
    'Installation',
    'Maintenance',
    'Assembly',
    'Painting',
    'Electrical',
    'Plumbing',
    'Carpentry',
    'Gardening',
    'Childcare',
    'Moving'
  ];

  const addSkill = () => {
    if (currentSkill.trim() && !jobData.skillsRequired.includes(currentSkill.trim())) {
      setJobData(prev => ({
        ...prev,
        skillsRequired: [...prev.skillsRequired, currentSkill.trim()]
      }));
      setCurrentSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setJobData(prev => ({
      ...prev,
      skillsRequired: prev.skillsRequired.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleSkillKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsSubmitting(true);
  
  // Validate required fields
  if (!jobData.serviceType || !jobData.description || !jobData.location) {
    alert('Please fill in all required fields');
    setIsSubmitting(false);
    return;
  }

  try {
    // Use the correct backend URL - FIXED
    const API_BASE_URL = process.env.NODE_ENV === 'production' 
      ? 'https://backendhomeheroes.onrender.com'
      : 'http://localhost:3001';

    // First, create the job posting
    const jobResponse = await fetch(`${API_BASE_URL}/api/jobs/create`, { // CHANGED THIS LINE
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      },
      body: JSON.stringify(jobData)
    });

    const jobResult = await jobResponse.json();

    if (!jobResult.success) {
      throw new Error(jobResult.message || 'Failed to create job posting');
    }

    console.log('✅ Job created:', jobResult.data);

    // Extract budget amount for payment
    const budgetAmount = jobData.budget ? parseInt(jobData.budget.replace(/[^\d]/g, '')) || 0 : 0;

    if (budgetAmount > 0) {
      // Show payment info and trigger payment flow
      setShowPaymentInfo(true);
      
      // The parent component should handle the payment flow
      onSubmit(jobData);
    } else {
      // No payment needed, just submit
      onSubmit(jobData);
      onClose();
    }

  } catch (error) {
    console.error('❌ Job creation error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to create job posting. Please try again.';
    alert(errorMessage);
  } finally {
    setIsSubmitting(false);
  }
};

  const handleClose = () => {
    setJobData({
      serviceType: '',
      description: '',
      category: '',
      budget: '',
      timeframe: '',
      location: '',
      urgency: 'normal',
      skillsRequired: [],
      estimatedDuration: '',
      preferredSchedule: ''
    });
    setShowPaymentInfo(false);
    onClose();
  };

  if (!isOpen) return null;

  if (showPaymentInfo) {
    const budgetAmount = jobData.budget ? parseInt(jobData.budget.replace(/[^\d]/g, '')) || 0 : 0;
    const isNigeria = userCountry.toLowerCase().includes('nigeria');
    const isUK = userCountry.toLowerCase().includes('uk') || userCountry.toLowerCase().includes('united kingdom');
    const currency = isNigeria ? '₦' : isUK ? '£' : '$';

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Secure Your Job</h2>
              <button
                onClick={handleClose}
                className="text-gray-600 hover:text-gray-900 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Payment Information */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-blue-900">Payment Protection</h3>
                  <p className="text-blue-700 text-sm mt-1">
                    Your payment is held securely in escrow. You'll get a full refund if no suitable provider is found.
                  </p>
                </div>
              </div>
            </div>

            {/* Job Summary */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-3">Job Summary</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Service:</span>
                  <span className="font-medium">{jobData.serviceType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Category:</span>
                  <span className="font-medium">{jobData.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Budget:</span>
                  <span className="font-medium">{jobData.budget}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Location:</span>
                  <span className="font-medium">{jobData.location}</span>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Payment Method</h4>
              <div className="space-y-3">
                {isNigeria && (
                  <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <CreditCard className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">Paystack</p>
                      <p className="text-sm text-gray-600">Secure payment for Nigeria</p>
                    </div>
                  </div>
                )}
                
                {isUK && (
                  <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <CreditCard className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">Stripe</p>
                      <p className="text-sm text-gray-600">Secure payment for UK</p>
                    </div>
                  </div>
                )}

                {!isNigeria && !isUK && (
                  <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <CreditCard className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium">Secure Payment</p>
                      <p className="text-sm text-gray-600">Payment processed securely</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Refund Policy */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">Refund Guarantee</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Full refund if no provider accepts your job</li>
                <li>• Full refund if you don't accept any proposals</li>
                <li>• Payment released only after you approve completed work</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-4">
              <button
                onClick={handleClose}
                className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onSubmit(jobData);
                  onClose();
                }}
                className="flex-1 bg-gradient-to-r from-blue-600 to-green-600 text-white py-3 rounded-lg hover:shadow-lg transition-all duration-200 font-medium"
              >
                Pay {currency}{budgetAmount.toLocaleString()}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Post a Job</h2>
            <button
              onClick={handleClose}
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

          {/* Skills Required */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Skills Required
            </label>
            <div className="space-y-3">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={currentSkill}
                  onChange={(e) => setCurrentSkill(e.target.value)}
                  onKeyPress={handleSkillKeyPress}
                  placeholder="Add required skills..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={addSkill}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Add
                </button>
              </div>
              
              {/* Quick skill suggestions */}
              <div className="flex flex-wrap gap-2">
                {commonSkills.map(skill => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => {
                      if (!jobData.skillsRequired.includes(skill)) {
                        setJobData(prev => ({
                          ...prev,
                          skillsRequired: [...prev.skillsRequired, skill]
                        }));
                      }
                    }}
                    className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full hover:bg-blue-200 transition-colors"
                  >
                    + {skill}
                  </button>
                ))}
              </div>

              {/* Selected skills */}
              {jobData.skillsRequired.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {jobData.skillsRequired.map(skill => (
                    <div
                      key={skill}
                      className="flex items-center space-x-1 px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full"
                    >
                      <span>{skill}</span>
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="text-green-600 hover:text-green-800"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Budget, Timeframe, Duration, Schedule */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Budget *
              </label>
              <div className="relative">
                <div className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" >
                  N
                  </div>
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estimated Duration
              </label>
              <select
                value={jobData.estimatedDuration}
                onChange={(e) => setJobData(prev => ({ ...prev, estimatedDuration: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select duration</option>
                {estimatedDurations.map(duration => (
                  <option key={duration} value={duration}>{duration}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Schedule
              </label>
              <select
                value={jobData.preferredSchedule}
                onChange={(e) => setJobData(prev => ({ ...prev, preferredSchedule: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select schedule</option>
                {schedules.map(schedule => (
                  <option key={schedule} value={schedule}>{schedule}</option>
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
                placeholder="Enter your location"
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

          {/* Payment Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-blue-900">Payment Protection</h3>
                <p className="text-blue-700 text-sm mt-1">
                  Your budget amount will be held securely in escrow. You'll only pay when you're satisfied with the completed work.
                </p>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center space-x-4 pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-gradient-to-r from-blue-600 to-green-600 text-white py-3 rounded-lg hover:shadow-lg transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Posting...' : 'Post Job'}
            </button>
            <button
              type="button"
              onClick={handleClose}
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