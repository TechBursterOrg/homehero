import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Clock,
  DollarSign,
  Star,
  Calendar,
  CheckCircle,
  AlertCircle,
  Zap,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Phone,
  Mail,
  Clock as ClockIcon,
  AlertTriangle,
  User
} from 'lucide-react';
import IdentityVerificationModal from './IdentityVerificationModal';

interface Job {
  _id: string;
  serviceType: string;
  description: string;
  location: string;
  urgency: string;
  timeframe: string;
  budget: string;
  status: string;
  createdAt: string;
  customerId: {
    _id: string;
    name: string;
    email: string;
    phoneNumber?: string;
    profileImage?: string;
    rating?: number;
    reviewCount?: number;
  } | null;
  providerId?: {
    _id: string;
    name: string;
    email: string;
  };
}

interface UserVerification {
  hasSubmittedVerification: boolean;
  verificationStatus: string;
  isVerified: boolean;
  details: {
    ninVerified: boolean;
    nepaVerified: boolean;
    selfieVerified: boolean;
    submittedAt: string;
    reviewedAt: string;
    notes: string;
  };
  requiredDocuments: {
    nin: boolean;
    selfie: boolean;
    utilityBill: boolean;
  };
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

// Job Details Modal Component
const JobDetailsModal: React.FC<{
  job: Job | null;
  isOpen: boolean;
  onClose: () => void;
  onApply: (jobId: string) => void;
  userVerification: UserVerification | null;
}> = ({ job, isOpen, onClose, onApply, userVerification }) => {
  if (!isOpen || !job) return null;

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Safe customer name access
  const customerName = job.customerId?.name || 'Unknown Customer';
  const customerEmail = job.customerId?.email || 'No email provided';
  const customerPhone = job.customerId?.phoneNumber;
  const customerRating = job.customerId?.rating;
  const customerReviewCount = job.customerId?.reviewCount;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{job.serviceType}</h2>
            <div className="flex items-center space-x-2 mt-1">
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                {job.status}
              </span>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(job.urgency)}`}>
                {job.urgency === 'urgent' && <Zap className="w-3 h-3 mr-1" />}
                {job.urgency}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <AlertCircle className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Job Description */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Service Description</h3>
            <p className="text-gray-700 whitespace-pre-wrap">{job.description}</p>
          </div>

          {/* Job Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-500">Location</p>
                <p className="text-gray-900">{job.location}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <DollarSign className="w-5 h-5 text-gray-400 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-500">Budget</p>
                <p className="text-green-600 font-semibold">{job.budget}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <ClockIcon className="w-5 h-5 text-gray-400 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-500">Timeframe</p>
                <p className="text-gray-900">{job.timeframe}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Calendar className="w-5 h-5 text-gray-400 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-500">Posted</p>
                <p className="text-gray-900">{formatDate(job.createdAt)}</p>
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Customer Information</h3>
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                {customerName.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">{customerName}</p>
                {customerRating && (
                  <div className="flex items-center space-x-2 mt-1">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-700 ml-1">
                        {customerRating} ({customerReviewCount} reviews)
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Contact Information */}
            <div className="mt-4 grid grid-cols-1 gap-2">
              {customerPhone && (
                <div className="flex items-center space-x-3 text-sm">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">{customerPhone}</span>
                </div>
              )}
              <div className="flex items-center space-x-3 text-sm">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">{customerEmail}</span>
              </div>
            </div>
          </div>

          {/* Verification Notice */}
          {job.status === 'pending' && !userVerification?.isVerified && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-yellow-800 font-medium">Verification Required</p>
                  <p className="text-yellow-700 text-sm mt-1">
                    You need to verify your identity before applying for this job. 
                    This helps build trust with customers.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="border-t px-6 py-4 bg-gray-50">
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
            {job.status === 'pending' && (
              <button
                onClick={() => onApply(job._id)}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                <CheckCircle className="w-5 h-5 mr-2" />
                {userVerification?.isVerified ? 'Apply Now' : 'Verify & Apply'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ProviderJobBoard: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    status: 'pending',
    serviceType: '',
    location: '',
    minBudget: '',
    maxBudget: '',
    urgency: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [userVerification, setUserVerification] = useState<UserVerification | null>(null);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [isSubmittingVerification, setIsSubmittingVerification] = useState(false);
  
  // New state for job details modal
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showJobDetails, setShowJobDetails] = useState(false);

  // Fetch user verification status - UPDATED ENDPOINT
  const fetchUserVerification = async () => {
    try {
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      if (!token) {
        console.log('No token found, skipping verification fetch');
        return;
      }

      console.log('Fetching verification status...');
      const response = await fetch(`${API_BASE_URL}/api/verification/status`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Verification data received:', data.data);
        setUserVerification(data.data);
      } else {
        console.log('Failed to fetch verification status:', response.status);
      }
    } catch (error) {
      console.error('Error fetching verification status:', error);
    }
  };

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Please log in to view jobs');
      }

      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...filters
      });

      const response = await fetch(`${API_BASE_URL}/api/jobs?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch jobs');
      }

      const data = await response.json();
      
      // Ensure jobs have proper customerId structure
      const safeJobs = data.data.jobs.map((job: Job) => ({
        ...job,
        customerId: job.customerId || {
          _id: 'unknown',
          name: 'Unknown Customer',
          email: 'No email provided'
        }
      }));
      
      setJobs(safeJobs);
      setTotalPages(data.data.totalPages);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
    fetchUserVerification();
  }, [filters, page]);

  // Fixed handleApply function
  const handleApply = async (jobId: string) => {
    try {
      console.log('HandleApply called for job:', jobId);
      console.log('User verification status:', userVerification);
      
      // Check if user needs verification - UPDATED CHECK
      if (!userVerification?.isVerified) {
        console.log('User needs verification, opening modal');
        setSelectedJobId(jobId);
        setShowVerificationModal(true);
        console.log('Modal should be open now. showVerificationModal:', showVerificationModal);
        return;
      }

      console.log('User is verified, applying directly');
      await applyForJob(jobId);
    } catch (error) {
      console.error('Apply error:', error);
      alert('Error applying for job');
    }
  };

  const applyForJob = async (jobId: string) => {
    try {
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      
      const response = await fetch(`${API_BASE_URL}/api/jobs/${jobId}/apply`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: 'I would like to help with this service request.'
        }),
      });

      if (response.ok) {
        fetchJobs();
        setShowJobDetails(false); // Close details modal after applying
        alert('Successfully applied for the job!');
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to apply for the job');
      }
    } catch (error) {
      console.error('Apply error:', error);
      alert('Error applying for job');
    }
  };

  // UPDATED: Use the new verification endpoint
  // UPDATED: Use the correct verification endpoint
const handleIdentityVerify = async (verificationData: { 
  nin: string; 
  nepaBill: File | null;
  selfie: File | null;
  consent: boolean;
}) => {
  console.log('HandleIdentityVerify called with:', verificationData);
  setIsSubmittingVerification(true);
  try {
    const token = localStorage.getItem('authToken') || localStorage.getItem('token');
    const formData = new FormData();
    
    formData.append('nin', verificationData.nin);
    formData.append('consent', verificationData.consent.toString());
    
    if (verificationData.selfie) {
      formData.append('selfie', verificationData.selfie);
    }
    
    if (verificationData.nepaBill) {
      formData.append('nepaBill', verificationData.nepaBill);
    }

    // ✅ CORRECT ENDPOINT - Use /api/verification/submit
    const response = await fetch(`${API_BASE_URL}/api/verification/submit`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        // Don't set Content-Type for FormData - browser will set it with boundary
      },
      body: formData,
    });

    if (response.ok) {
      const result = await response.json();
      
      // Update user verification status
      await fetchUserVerification(); // Refresh the status
      
      setShowVerificationModal(false);
      
      // If there was a selected job, apply for it now
      if (selectedJobId) {
        await applyForJob(selectedJobId);
        setSelectedJobId(null);
      }
      
      alert('Verification submitted successfully! Your documents will be reviewed.');
    } else {
      // Handle different HTTP status codes
      if (response.status === 404) {
        throw new Error('Verification endpoint not found. Please contact support.');
      } else if (response.status === 500) {
        throw new Error('Server error. Please try again later.');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Verification submission failed');
      }
    }
  } catch (error) {
    console.error('Verification error:', error);
    alert(error instanceof Error ? error.message : 'Verification failed. Please try again.');
    throw error; // Re-throw to let the modal handle the error
  } finally {
    setIsSubmittingVerification(false);
  }
};

  // View job details
  const handleViewDetails = (job: Job) => {
    setSelectedJob(job);
    setShowJobDetails(true);
  };

  const getVerificationBadge = () => {
    if (!userVerification) return null;

    const status = userVerification.verificationStatus;
    const isVerified = userVerification.isVerified;

    if (status === 'verified') {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <ShieldCheck className="w-3 h-3 mr-1" />
          Verified
        </span>
      );
    } else if (status === 'pending_review' || status === 'submitted') {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          <ShieldAlert className="w-3 h-3 mr-1" />
          Under Review
        </span>
      );
    } else if (status === 'rejected') {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <ShieldAlert className="w-3 h-3 mr-1" />
          Verification Failed
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          <ShieldAlert className="w-3 h-3 mr-1" />
          Not Verified
        </span>
      );
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'accepted': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Safe customer info access function
  const getCustomerInfo = (job: Job) => {
    if (!job.customerId) {
      return {
        name: 'Unknown Customer',
        email: 'No email provided',
        phoneNumber: undefined,
        rating: undefined,
        reviewCount: undefined
      };
    }
    return job.customerId;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-2" />
        <p className="text-red-700">{error}</p>
        <button
          onClick={fetchJobs}
          className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Service Requests</h1>
            <p className="text-gray-600">Find and apply for service requests from customers</p>
          </div>
          {userVerification && (
            <div className="flex items-center space-x-2">
              {getVerificationBadge()}
              {!userVerification.isVerified && (
                <button
                  onClick={() => {
                    console.log('Verify Now button clicked');
                    setShowVerificationModal(true);
                  }}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Verify Now
                </button>
              )}
            </div>
          )}
        </div>

        {/* Verification Info Banner */}
        {userVerification && !userVerification.isVerified && (
          <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center">
              <ShieldAlert className="w-5 h-5 text-yellow-600 mr-2" />
              <div>
                <p className="text-yellow-800 font-medium">Identity Verification Required</p>
                <p className="text-yellow-700 text-sm">
                  You need to verify your identity with your NIN before applying for jobs. 
                  This helps build trust with customers.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="pending">Available</option>
              <option value="accepted">My Accepted Jobs</option>
              <option value="completed">Completed</option>
              <option value="all">All Jobs</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Service Type</label>
            <input
              type="text"
              placeholder="e.g., Plumbing, Cleaning"
              value={filters.serviceType}
              onChange={(e) => setFilters({...filters, serviceType: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input
              type="text"
              placeholder="City or area"
              value={filters.location}
              onChange={(e) => setFilters({...filters, location: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters({...filters, sortBy: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="createdAt">Newest First</option>
              <option value="urgency">Urgency</option>
              <option value="budget">Budget</option>
            </select>
          </div>
        </div>
      </div>

      {/* Jobs List */}
      <div className="space-y-4">
        {jobs.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-500 text-lg">No jobs found matching your criteria</p>
            <p className="text-gray-400 mt-2">Try adjusting your filters or check back later</p>
          </div>
        ) : (
          jobs.map((job) => {
            const customerInfo = getCustomerInfo(job);
            
            return (
              <div key={job._id} className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  {/* Job Details */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-xl font-semibold text-gray-900">{job.serviceType}</h3>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getUrgencyColor(job.urgency)}`}>
                        {job.urgency === 'urgent' && <Zap className="w-4 h-4 mr-1" />}
                        {job.urgency}
                      </span>
                    </div>

                    <p className="text-gray-600 mb-4 line-clamp-2">{job.description}</p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center text-gray-600">
                        <MapPin className="w-5 h-5 mr-2 text-gray-400" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <DollarSign className="w-5 h-5 mr-2 text-gray-400" />
                        <span className="font-semibold text-green-600">{job.budget}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Clock className="w-5 h-5 mr-2 text-gray-400" />
                        <span>{job.timeframe}</span>
                      </div>
                    </div>

                    {/* Customer Info */}
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                        {customerInfo.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{customerInfo.name}</p>
                        {customerInfo.rating && (
                          <div className="flex items-center text-sm text-gray-600">
                            <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                            <span>{customerInfo.rating} ({customerInfo.reviewCount} reviews)</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col space-y-2">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(job.status)}`}>
                      {job.status}
                    </span>
                    
                    {job.status === 'pending' && (
                      <button
                        onClick={() => handleApply(job._id)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                      >
                        <CheckCircle className="w-5 h-5 mr-2" />
                        Apply
                      </button>
                    )}
                    
                    {job.status === 'accepted' && (
                      <div className="space-y-2">
                        <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors w-full">
                          Mark Complete
                        </button>
                        <button className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors w-full">
                          Message Customer
                        </button>
                      </div>
                    )}
                    
                    <button 
                      onClick={() => handleViewDetails(job)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center justify-center"
                    >
                      View Details
                    </button>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200 text-sm text-gray-500">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Posted {new Date(job.createdAt).toLocaleDateString()}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8 space-x-2">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50"
          >
            Previous
          </button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => setPage(pageNum)}
              className={`px-4 py-2 border rounded-md ${
                page === pageNum
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'border-gray-300 text-gray-700'
              }`}
            >
              {pageNum}
            </button>
          ))}
          
          <button
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/* Verification Modal */}
      <IdentityVerificationModal
        isOpen={showVerificationModal}
        onClose={() => {
          console.log('Modal onClose called');
          setShowVerificationModal(false);
          setSelectedJobId(null);
        }}
        onVerify={handleIdentityVerify}
        isSubmitting={isSubmittingVerification}
      />

      {/* Job Details Modal */}
      <JobDetailsModal
        job={selectedJob}
        isOpen={showJobDetails}
        onClose={() => setShowJobDetails(false)}
        onApply={handleApply}
        userVerification={userVerification}
      />
    </div>
  );
};

export default ProviderJobBoard;