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
  FileText,
  Send,
  Search,
  Filter,
  Users,
  Eye
} from 'lucide-react';
import IdentityVerificationModal from '../pages/IdentityVerificationModal';

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
  proposals?: any[];
  hasApplied?: boolean;
}

interface UserVerification {
  isNinVerified: boolean;
  isNepaVerified: boolean;
  verificationStatus: string;
  hasSubmittedVerification: boolean;
  isVerified?: boolean;
  details?: {
    ninVerified: boolean;
    nepaVerified: boolean;
    selfieVerified: boolean;
    submittedAt?: string;
    reviewedAt?: string;
    notes?: string;
  };
  userDetails?: {
    fullName: string;
    gender: string;
    state: string;
  };
}

interface ProposalFormData {
  proposedBudget: string;
  timeline: string;
  message: string;
  proposedSchedule?: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

// Job Details Modal Component
const JobDetailsModal: React.FC<{
  job: Job | null;
  isOpen: boolean;
  onClose: () => void;
  onApply: (jobId: string) => void;
  userVerification: UserVerification | null;
}> = ({ job, isOpen, onClose, onApply, userVerification }) => {
  if (!isOpen || !job) return null;

  const [isApplying, setIsApplying] = useState(false);

  const handleApplyClick = async () => {
    setIsApplying(true);
    try {
      await onApply(job._id);
    } finally {
      setIsApplying(false);
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      default: return 'bg-green-100 text-green-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'applied': return 'bg-blue-100 text-blue-800';
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

  // Check if user is fully verified (using multiple verification checks)
  const isUserVerified = userVerification?.isVerified || 
                        userVerification?.verificationStatus === 'verified' ||
                        (userVerification?.isNinVerified && userVerification?.details?.ninVerified);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{job.serviceType}</h2>
            <div className="flex items-center space-x-2 mt-1">
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                {job.status === 'accepted' ? 'Assigned' : job.status}
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
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold text-lg">
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
          {job.status === 'pending' && !isUserVerified && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-yellow-800 font-medium">Verification Required</p>
                  <p className="text-yellow-700 text-sm mt-1">
                    You need to verify your identity with your NIN before applying for jobs. 
                    This helps build trust with customers.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Already Applied Notice */}
          {(job.status === 'applied' || job.hasApplied) && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-blue-800 font-medium">Proposal Submitted</p>
                  <p className="text-blue-700 text-sm mt-1">
                    You have already submitted a proposal for this job. The customer will review your application.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Accepted Notice */}
          {job.status === 'accepted' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-green-800 font-medium">Job Accepted</p>
                  <p className="text-green-700 text-sm mt-1">
                    You have successfully accepted this job. Contact the customer to arrange the service.
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
            {job.status === 'pending' && !job.hasApplied && (
              <button
                onClick={handleApplyClick}
                disabled={isApplying || !isUserVerified}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
              >
                {isApplying ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <FileText className="w-5 h-5 mr-2" />
                    {isUserVerified ? 'Submit Proposal' : 'Verify & Apply'}
                  </>
                )}
              </button>
            )}
            {job.status === 'accepted' && customerPhone && (
              <a
                href={`tel:${customerPhone}`}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
              >
                <Phone className="w-5 h-5 mr-2" />
                Call Customer
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Proposal Modal Component
const ProposalModal: React.FC<{
  job: Job | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (proposalData: ProposalFormData) => Promise<void>;
  isSubmitting: boolean;
}> = ({ job, isOpen, onClose, onSubmit, isSubmitting }) => {
  const [formData, setFormData] = useState<ProposalFormData>({
    proposedBudget: '',
    timeline: '',
    message: ''
  });

  useEffect(() => {
    if (job && isOpen) {
      // Pre-fill budget with job's budget as a starting point
      setFormData({
        proposedBudget: job.budget || '',
        timeline: job.timeframe || '',
        message: `Hello! I'm interested in helping you with your ${job.serviceType} service. I have experience in this area and I believe I can deliver quality work within your timeframe. I'm available to discuss the details further. Looking forward to working with you!`
      });
    }
  }, [job, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const handleClose = () => {
    setFormData({
      proposedBudget: '',
      timeline: '',
      message: ''
    });
    onClose();
  };

  if (!isOpen || !job) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Submit Proposal</h2>
            <p className="text-gray-600 text-sm mt-1">Apply for: {job.serviceType}</p>
          </div>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
          >
            <AlertCircle className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Job Summary */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-2">Job Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>{job.location}</span>
              </div>
              <div className="flex items-center space-x-2">
                <DollarSign className="w-4 h-4" />
                <span>Customer's Budget: {job.budget}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>Timeframe: {job.timeframe}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4" />
                <span>Urgency: {job.urgency}</span>
              </div>
            </div>
          </div>

          {/* Proposal Form */}
          <div className="space-y-4">
            <div>
              <label htmlFor="proposedBudget" className="block text-sm font-medium text-gray-700 mb-2">
                Your Proposed Budget *
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  ₦
                </div>
                <input
                  type="text"
                  id="proposedBudget"
                  required
                  value={formData.proposedBudget}
                  onChange={(e) => setFormData({ ...formData, proposedBudget: e.target.value })}
                  placeholder="e.g., ₦15,000"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Consider the customer's budget of {job.budget} when making your proposal
              </p>
            </div>

            <div>
              <label htmlFor="timeline" className="block text-sm font-medium text-gray-700 mb-2">
                Proposed Timeline *
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  id="timeline"
                  required
                  value={formData.timeline}
                  onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                  placeholder="e.g., 2-3 days, Within 1 week, ASAP"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                Your Proposal Message *
              </label>
              <textarea
                id="message"
                required
                rows={6}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Introduce yourself and explain why you're the right fit for this job. Mention your relevant experience and how you plan to approach the work..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-vertical"
              />
              <p className="text-xs text-gray-500 mt-1">
                A good proposal increases your chances of being hired. Be specific about your approach and qualifications.
              </p>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-medium text-green-900 mb-2 flex items-center">
              <CheckCircle className="w-4 h-4 mr-2" />
              Tips for a Great Proposal
            </h4>
            <ul className="text-sm text-green-800 space-y-1">
              <li>• Mention specific experience relevant to this job</li>
              <li>• Explain your approach to the work</li>
              <li>• Be professional and friendly</li>
              <li>• Highlight what makes you the best choice</li>
              <li>• Include your availability</li>
            </ul>
          </div>
        </form>

        {/* Footer Actions */}
        <div className="border-t px-6 py-4 bg-gray-50">
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5 mr-2" />
                  Submit Proposal
                </>
              )}
            </button>
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
  const [applyingJobs] = useState<Set<string>>(new Set());
  
  // New state for job details modal and proposal modal
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showJobDetails, setShowJobDetails] = useState(false);
  const [showProposalModal, setShowProposalModal] = useState(false);
  const [isSubmittingProposal, setIsSubmittingProposal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Enhanced verification check function
  const isUserVerified = () => {
    if (!userVerification) return false;
    
    // Check multiple verification fields to be safe
    return userVerification.isVerified || 
           userVerification.verificationStatus === 'verified' ||
           (userVerification.isNinVerified && userVerification.details?.ninVerified) ||
           (userVerification.details?.ninVerified && userVerification.details?.selfieVerified);
  };

  // Fetch user verification status
  const fetchUserVerification = async () => {
    try {
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      if (!token) {
        console.log('No token found, skipping verification fetch');
        return;
      }

      console.log('🔍 Fetching verification status...');
      const response = await fetch(`${API_BASE_URL}/api/auth/verification-status`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log('📥 Verification status response:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Verification data received:', data.data);
        
        // Map backend fields to frontend expected fields
        const verificationData = data.data;
        const mappedVerification = {
          hasSubmittedVerification: verificationData.hasSubmittedVerification,
          verificationStatus: verificationData.verificationStatus,
          isVerified: verificationData.isVerified,
          // Map the backend fields to what frontend expects
          isNinVerified: verificationData.isVerified || verificationData.details?.ninVerified || false,
          isNepaVerified: verificationData.details?.nepaVerified || false,
          details: {
            ninVerified: verificationData.details?.ninVerified || false,
            nepaVerified: verificationData.details?.nepaVerified || false,
            selfieVerified: verificationData.details?.selfieVerified || false,
            submittedAt: verificationData.details?.submittedAt,
            reviewedAt: verificationData.details?.reviewedAt,
            notes: verificationData.details?.notes || ''
          }
        };
        
        console.log('🔄 Mapped verification data:', mappedVerification);
        setUserVerification(mappedVerification);
      } else {
        console.log('❌ Failed to fetch verification status:', response.status);
        // Set default verification state if fetch fails
        setUserVerification({
          hasSubmittedVerification: false,
          verificationStatus: 'not_submitted',
          isNinVerified: false,
          isNepaVerified: false,
          isVerified: false,
          details: {
            ninVerified: false,
            nepaVerified: false,
            selfieVerified: false
          }
        });
      }
    } catch (error) {
      console.error('❌ Error fetching verification status:', error);
      // Set default verification state on error
      setUserVerification({
        hasSubmittedVerification: false,
        verificationStatus: 'not_submitted',
        isNinVerified: false,
        isNepaVerified: false,
        isVerified: false,
        details: {
          ninVerified: false,
          nepaVerified: false,
          selfieVerified: false
        }
      });
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

  // Filter jobs based on search term
  const filteredJobs = jobs.filter(job => {
    const matchesSearch = searchTerm === '' || 
      job.serviceType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  // Updated handleApply function with better verification check
  const handleApply = async (jobId: string) => {
    try {
      console.log('HandleApply called for job:', jobId);
      console.log('User verification status:', userVerification);
      console.log('Is user verified?', isUserVerified());
      
      // Check if user needs verification using the enhanced check
      if (!isUserVerified()) {
        console.log('User needs verification, opening modal');
        setSelectedJobId(jobId);
        setShowVerificationModal(true);
        return;
      }

      console.log('User is verified, opening proposal modal');
      const job = jobs.find(j => j._id === jobId);
      if (job) {
        setSelectedJob(job);
        setShowProposalModal(true);
      }
    } catch (error) {
      console.error('Apply error:', error);
      alert('Error applying for job');
    }
  };

  // New function to handle proposal submission
  const handleSubmitProposal = async (proposalData: ProposalFormData) => {
    if (!selectedJob) return;

    try {
      setIsSubmittingProposal(true);
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      
      console.log('Submitting proposal for job:', selectedJob._id);
      console.log('Proposal data:', proposalData);

      const response = await fetch(`${API_BASE_URL}/api/jobs/${selectedJob._id}/apply`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          proposedBudget: proposalData.proposedBudget,
          timeline: proposalData.timeline,
          message: proposalData.message,
          proposedSchedule: proposalData.proposedSchedule || 'Flexible'
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Update the local state to reflect the job application
        setJobs(prevJobs => 
          prevJobs.map(job => 
            job._id === selectedJob._id 
              ? { 
                  ...job, 
                  status: 'applied',
                  hasApplied: true 
                }
              : job
          )
        );
        
        setShowProposalModal(false);
        setSelectedJob(null);
        alert('Proposal submitted successfully! The customer will review your application.');
      } else {
        throw new Error(data.message || 'Failed to submit proposal');
      }
    } catch (error) {
      console.error('Proposal submission error:', error);
      alert(error instanceof Error ? error.message : 'Error submitting proposal');
    } finally {
      setIsSubmittingProposal(false);
    }
  };

  // Updated verification handler
  const handleIdentityVerify = async (verificationData: { 
    nin: string; 
    nepaBill: File | null;
    selfie: File | null;
    consent: boolean;
  }) => {
    console.log('🔐 HandleIdentityVerify called with:', {
      nin: verificationData.nin,
      hasSelfie: !!verificationData.selfie,
      hasNepaBill: !!verificationData.nepaBill,
      consent: verificationData.consent
    });
    
    setIsSubmittingVerification(true);
    try {
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      const formData = new FormData();
      
      formData.append('nin', verificationData.nin);
      formData.append('consent', verificationData.consent.toString());
      
      if (verificationData.selfie) {
        formData.append('selfie', verificationData.selfie);
        console.log('📸 Selfie file details:', {
          name: verificationData.selfie.name,
          size: verificationData.selfie.size,
          type: verificationData.selfie.type
        });
      }
      
      if (verificationData.nepaBill) {
        formData.append('nepaBill', verificationData.nepaBill);
        console.log('📄 NEPA bill file details:', {
          name: verificationData.nepaBill.name,
          size: verificationData.nepaBill.size,
          type: verificationData.nepaBill.type
        });
      }

      console.log('📤 Sending verification request to:', `${API_BASE_URL}/api/verification/submit`);
      
      const response = await fetch(`${API_BASE_URL}/api/verification/submit`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      console.log('📥 Response status:', response.status);
      
      const result = await response.json();
      console.log('📥 Response data:', result);

      if (response.ok) {
        console.log('✅ Verification submitted successfully');
        
        // Update user verification status immediately
        await fetchUserVerification();
        
        setShowVerificationModal(false);
        
        // If there was a selected job, open proposal modal now
        if (selectedJobId) {
          const job = jobs.find(j => j._id === selectedJobId);
          if (job) {
            setSelectedJob(job);
            setShowProposalModal(true);
          }
          setSelectedJobId(null);
        }
        
        alert('Verification submitted successfully! Your documents will be reviewed.');
      } else {
        console.error('❌ Verification submission failed:', result);
        
        let errorMessage = result.message || 'Verification submission failed';
        
        if (response.status === 400) {
          errorMessage = `Validation error: ${result.message}`;
        } else if (response.status === 404) {
          errorMessage = 'Verification endpoint not found. Please contact support.';
        } else if (response.status === 500) {
          errorMessage = 'Server error. Please try again later.';
        }
        
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('❌ Verification error:', error);
      
      let userMessage = 'Verification failed. Please try again.';
      
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        userMessage = 'Network error. Please check your internet connection and try again.';
      } else if (error instanceof Error) {
        userMessage = error.message;
      }
      
      alert(userMessage);
      throw error;
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
    const isNinVerified = userVerification.isNinVerified;
    const isNepaVerified = userVerification.isNepaVerified;
    const isVerified = isUserVerified();

    if (isVerified) {
      if (isNepaVerified) {
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <ShieldCheck className="w-3 h-3 mr-1" />
            Fully Verified
          </span>
        );
      } else {
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <Shield className="w-3 h-3 mr-1" />
            Basic Verification
          </span>
        );
      }
    } else if (status === 'pending') {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          <ShieldAlert className="w-3 h-3 mr-1" />
          Verification Pending
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <ShieldAlert className="w-3 h-3 mr-1" />
          Unverified
        </span>
      );
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'accepted': return 'bg-green-100 text-green-800 border-green-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      case 'applied': return 'bg-blue-100 text-blue-800 border-blue-200';
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
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
              {!isUserVerified() && (
                <button
                  onClick={() => {
                    console.log('Verify Now button clicked');
                    setShowVerificationModal(true);
                  }}
                  className="text-sm text-green-600 hover:text-green-800 font-medium"
                >
                  Verify Now
                </button>
              )}
            </div>
          )}
        </div>

        {/* Verification Info Banner */}
        {userVerification && !isUserVerified() && (
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

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Search Jobs</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by service, description, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
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
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters({...filters, sortBy: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
            >
              <option value="createdAt">Newest First</option>
              <option value="urgency">Urgency</option>
              <option value="budget">Budget</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing {filteredJobs.length} of {jobs.length} jobs
          </div>
          <button
            onClick={() => {
              setSearchTerm('');
              setFilters({
                status: 'pending',
                serviceType: '',
                location: '',
                minBudget: '',
                maxBudget: '',
                urgency: '',
                sortBy: 'createdAt',
                sortOrder: 'desc'
              });
            }}
            className="text-sm text-green-600 hover:text-green-800 font-medium"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Jobs List */}
      <div className="space-y-4">
        {filteredJobs.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No jobs found matching your criteria</p>
            <p className="text-gray-400 mt-2">Try adjusting your filters or check back later</p>
          </div>
        ) : (
          filteredJobs.map((job) => {
            const customerInfo = getCustomerInfo(job);
            const isApplying = applyingJobs.has(job._id);
            const isVerified = isUserVerified();
            
            return (
              <div key={job._id} className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  {/* Job Details */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-xl font-semibold text-gray-900">{job.serviceType}</h3>
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getUrgencyColor(job.urgency)}`}>
                          {job.urgency === 'urgent' && <Zap className="w-4 h-4 mr-1" />}
                          {job.urgency}
                        </span>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(job.status)}`}>
                          {job.status === 'accepted' ? 'Assigned to You' : job.status}
                        </span>
                      </div>
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
                      <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold">
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
                  <div className="flex flex-col space-y-2 min-w-[200px]">
                    {job.status === 'pending' && !job.hasApplied && (
                      <button
                        onClick={() => handleApply(job._id)}
                        disabled={isApplying || !isVerified}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                      >
                        {isApplying ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Submitting...
                          </>
                        ) : (
                          <>
                            <FileText className="w-5 h-5 mr-2" />
                            {isVerified ? 'Submit Proposal' : 'Verify & Apply'}
                          </>
                        )}
                      </button>
                    )}
                    
                    {job.status === 'applied' || job.hasApplied ? (
                      <div className="text-center">
                        <span className="text-green-600 font-medium">✓ Proposal Submitted</span>
                        <p className="text-sm text-gray-500 mt-1">Waiting for customer response</p>
                      </div>
                    ) : null}
                    
                    {job.status === 'accepted' && (
                      <div className="space-y-2">
                        <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors w-full">
                          Mark Complete
                        </button>
                        {customerInfo.phoneNumber && (
                          <a
                            href={`tel:${customerInfo.phoneNumber}`}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors w-full flex items-center justify-center"
                          >
                            <Phone className="w-4 h-4 mr-2" />
                            Call Customer
                          </a>
                        )}
                      </div>
                    )}
                    
                    <button 
                      onClick={() => handleViewDetails(job)}
                      className="text-green-600 hover:text-green-800 text-sm font-medium flex items-center justify-center"
                    >
                      <Eye className="w-4 h-4 mr-1" />
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
            className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 hover:bg-gray-50"
          >
            Previous
          </button>
          
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const pageNum = i + 1;
            return (
              <button
                key={pageNum}
                onClick={() => setPage(pageNum)}
                className={`px-4 py-2 border rounded-md ${
                  page === pageNum
                    ? 'bg-green-600 text-white border-green-600'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {pageNum}
              </button>
            );
          })}
          
          <button
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 hover:bg-gray-50"
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

      {/* Proposal Modal */}
      <ProposalModal
        job={selectedJob}
        isOpen={showProposalModal}
        onClose={() => {
          setShowProposalModal(false);
          setSelectedJob(null);
        }}
        onSubmit={handleSubmitProposal}
        isSubmitting={isSubmittingProposal}
      />
    </div>
  );
};

export default ProviderJobBoard;