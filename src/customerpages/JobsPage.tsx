import React, { useState, useEffect } from 'react';
import { Plus, ArrowRight, Briefcase, TrendingUp, Users, Eye, Search, Filter, X, MessageCircle } from 'lucide-react';
import JobPostCard, { JobPost } from '../customercomponents/JobPostCard';
import PostJobModal from '../customercomponents/PostJobModal';
import { useNavigate } from 'react-router-dom';

interface JobsPageProps {
  authToken: string | null;
  userId: string;
}

const API_BASE_URL = process.env.NODE_ENV === 'production' 
    ? "https://backendhomeheroes.onrender.com" 
    : "http://localhost:3001";

const JobsPage: React.FC<JobsPageProps> = ({ authToken, userId }) => {
  const [jobPosts, setJobPosts] = useState<JobPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showPostJob, setShowPostJob] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showProposalsModal, setShowProposalsModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobPost | null>(null);
  const [editFormData, setEditFormData] = useState<any>(null);
  const [proposals, setProposals] = useState<any[]>([]);
  const [proposalsLoading, setProposalsLoading] = useState(false);
  const navigate = useNavigate();

  // Get auth token from localStorage if not provided
  const getAuthToken = () => {
    const token = authToken || localStorage.getItem('authToken') || localStorage.getItem('token');
    console.log('🔐 Getting auth token:', token ? 'Token exists' : 'No token');
    return token;
  };

  useEffect(() => {
    fetchJobPosts();
  }, [userId]);

  const fetchJobPosts = async () => {
  try {
    const token = getAuthToken();
    if (!token) {
      console.error('❌ No auth token found');
      setError('Authentication required');
      setLoading(false);
      navigate('/login');
      return;
    }

    console.log('🔍 Fetching job posts with token');

    // First, try the debug endpoint to see raw data
    try {
      console.log('🧪 Testing debug endpoint...');
      const debugResponse = await fetch(`${API_BASE_URL}/api/debug/service-requests`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (debugResponse.ok) {
        const debugData = await debugResponse.json();
        console.log('🔍 Debug endpoint response:', debugData);
      }
    } catch (debugError) {
      console.log('Debug endpoint not available, continuing...');
    }

    const response = await fetch(`${API_BASE_URL}/api/service-requests/customer?t=${Date.now()}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('📥 Jobs response status:', response.status);

    if (response.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('token');
      setError('Session expired. Please login again.');
      setLoading(false);
      navigate('/login');
      return;
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Failed to fetch job posts:', response.status, errorText);
      throw new Error(`Failed to fetch job posts: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    
    if (data.success) {
      console.log('📥 Jobs data received:', {
        count: data.data?.jobs?.length || 0,
        jobs: data.data?.jobs?.map((j: any) => ({
          id: j._id,
          title: j.serviceType,
          proposals: j.proposals?.length || 0,
          hasId: !!j._id
        }))
      });
      
      // Log jobs without IDs for debugging
      const jobsWithoutId = (data.data.jobs || []).filter((job: any) => !job._id);
      if (jobsWithoutId.length > 0) {
        console.warn('⚠️ Jobs without _id from API:', jobsWithoutId.length);
        jobsWithoutId.forEach((job: any, index: number) => {
          console.warn(`Job ${index + 1} without _id:`, {
            serviceType: job.serviceType,
            description: job.description?.substring(0, 100),
            createdAt: job.createdAt
          });
        });
      }
      
      // Transform the API response to match JobPost interface
      const transformedJobs: JobPost[] = (data.data.jobs || []).map((job: any, index: number) => {
        // Create a stable ID - use existing _id or generate one
        const jobId = job._id || `job-${Date.now()}-${index}-${Math.random().toString(36).substring(2, 9)}`;
        
        console.log('🔍 Processing job:', {
          originalId: job._id,
          generatedId: jobId,
          title: job.serviceType,
          proposalsCount: job.proposals?.length || 0
        });
        
        return {
          _id: jobId,
          id: jobId,
          title: job.serviceType || 'Untitled Service',
          description: job.description || 'No description provided',
          budget: job.budget || '₦0',
          category: job.category || 'general',
          location: job.location || 'Location not specified',
          status: job.status || 'pending',
          createdAt: job.createdAt || new Date().toISOString(),
          datePosted: job.createdAt ? new Date(job.createdAt).toLocaleDateString() : 'Just now',
          duration: job.estimatedDuration || 'Not specified',
          proposals: job.proposals?.length || 0,
          proposalCount: job.proposals?.length || 0,
          serviceType: job.serviceType,
          urgency: job.urgency,
          timeframe: job.timeframe,
          // Store original data for debugging
          originalData: job._id ? undefined : { ...job, _id: 'MISSING_IN_API' }
        };
      });

      console.log('✅ Transformed jobs:', transformedJobs.map(j => ({
        _id: j._id,
        title: j.title,
        proposals: j.proposals,
        hasOriginalId: !j._id.startsWith('job-')
      })));
      setJobPosts(transformedJobs);
    } else {
      console.error('❌ API returned error:', data.message);
      setError(data.message || 'Failed to fetch job posts');
    }
  } catch (err) {
    console.error('Fetch error:', err);
    setError(err instanceof Error ? err.message : 'An error occurred');
  } finally {
    setLoading(false);
  }
};

  const filteredJobPosts = jobPosts.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleEditJob = (id: string) => {
    console.log('✏️ Edit job:', id);
    const job = jobPosts.find(j => j._id === id || j.id === id);
    if (job) {
      setSelectedJob(job);
      setEditFormData({
        serviceType: job.serviceType || job.title,
        description: job.description,
        location: job.location,
        budget: job.budget,
        category: job.category,
        urgency: job.urgency || 'normal',
        timeframe: job.timeframe || 'ASAP'
      });
      setShowEditModal(true);
    } else {
      console.error('❌ Job not found for editing:', id);
    }
  };

  const handleViewProposals = async (id: string) => {
    console.log('👁️ View proposals for job ID:', id);
    
    // Validate ID
    if (!id || id === 'undefined' || id === 'null' || id.startsWith('temp-')) {
      console.error('❌ Cannot view proposals: Invalid job ID:', id);
      alert('Cannot view proposals: Invalid job ID. Please refresh the page and try again.');
      return;
    }

    // Find job in local state
    const job = jobPosts.find(j => j._id === id || j.id === id);
    if (!job) {
      console.error('❌ Job not found in local state:', id);
      alert('Job not found. Please refresh the page.');
      return;
    }

    console.log('✅ Found job:', {
      id: job._id,
      title: job.title,
      proposalsCount: job.proposals
    });

    setSelectedJob(job);
    setProposalsLoading(true);
    
    try {
      const token = getAuthToken();
      if (!token) {
        alert('Please log in to view proposals');
        navigate('/login');
        return;
      }

      console.log('📨 Fetching proposals for job:', id);
      
      // First try the direct service-requests endpoint
      try {
        const response = await fetch(`${API_BASE_URL}/api/service-requests/${id}/proposals`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        console.log('📥 Direct proposals response status:', response.status);

        if (response.ok) {
          const data = await response.json();
          console.log('✅ Direct proposals data:', {
            success: data.success,
            count: data.data?.proposals?.length || 0,
            proposals: data.data?.proposals?.map((p: any) => ({
              id: p._id,
              provider: p.providerId?.name,
              status: p.status
            }))
          });
          
          const proposals = data.data?.proposals || [];
          setProposals(proposals);
          
          // Update the job post count in local state
          if (proposals.length > 0) {
            setJobPosts(prev => prev.map(j => 
              (j._id === id || j.id === id)
                ? { ...j, proposals: proposals.length, proposalCount: proposals.length }
                : j
            ));
          }
        } else {
          console.log('🔄 Direct endpoint failed, trying unified endpoint...');
          const fallbackResponse = await fetch(`${API_BASE_URL}/api/jobs/${id}/proposals`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (fallbackResponse.ok) {
            const fallbackData = await fallbackResponse.json();
            console.log('✅ Unified proposals:', {
              success: fallbackData.success,
              count: fallbackData.data?.proposals?.length || 0
            });
            const proposals = fallbackData.data?.proposals || [];
            setProposals(proposals);
          } else {
            console.log('❌ All endpoints failed for job:', id);
            setProposals([]);
          }
        }
      } catch (fetchError) {
        console.error('❌ Error fetching proposals:', fetchError);
        setProposals([]);
      }
    } catch (error) {
      console.error('❌ Error in handleViewProposals:', error);
      setProposals([]);
    } finally {
      setProposalsLoading(false);
      setShowProposalsModal(true);
    }
  };

  // Enhanced accept proposal function
  const handleAcceptProposal = async (proposalId: string) => {
    if (!selectedJob || !selectedJob._id) {
      console.error('❌ No selected job for accepting proposal');
      return;
    }

    try {
      const token = getAuthToken();
      if (!token) {
        navigate('/login');
        return;
      }

      console.log('✅ Accepting proposal:', { 
        jobId: selectedJob._id, 
        proposalId 
      });
      
      const response = await fetch(
        `${API_BASE_URL}/api/service-requests/${selectedJob._id}/proposals/${proposalId}/accept`, 
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await response.json();
      console.log('📥 Accept proposal response:', data);

      if (response.ok) {
        // Refresh proposals and job status
        await handleViewProposals(selectedJob._id);
        await fetchJobPosts(); // Refresh job posts to update status
        
        alert('Proposal accepted successfully! The provider has been notified.');
      } else {
        const errorMessage = data.message || 'Failed to accept proposal';
        console.error('❌ Accept proposal error:', errorMessage);
        alert(`Failed to accept proposal: ${errorMessage}`);
      }
    } catch (err) {
      console.error('❌ Accept proposal error:', err);
      alert(err instanceof Error ? err.message : 'Failed to accept proposal');
    }
  };

  const handleDeleteJob = async (id: string) => {
    console.log('🗑️ Delete job:', id);
    const job = jobPosts.find(j => j._id === id || j.id === id);
    if (job) {
      setSelectedJob(job);
      setShowDeleteModal(true);
    } else {
      console.error('❌ Job not found for deletion:', id);
    }
  };

  const confirmDeleteJob = async () => {
    if (!selectedJob || !selectedJob._id) {
      console.error('❌ No selected job to delete');
      return;
    }

    try {
      const token = getAuthToken();
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/service-requests/${selectedJob._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setJobPosts(prev => prev.filter(job => job._id !== selectedJob._id));
        setShowDeleteModal(false);
        setSelectedJob(null);
        alert('Job deleted successfully!');
      } else {
        throw new Error('Failed to delete job post');
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert(err instanceof Error ? err.message : 'Failed to delete job post');
    }
  };

  const handleUpdateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJob || !selectedJob._id || !editFormData) {
      console.error('❌ Missing data for update');
      return;
    }

    try {
      const token = getAuthToken();
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/service-requests/${selectedJob._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editFormData),
      });

      if (response.ok) {
        // Update the job in the local state
        setJobPosts(prev => prev.map(job => 
          job._id === selectedJob._id 
            ? { ...job, ...editFormData, title: editFormData.serviceType }
            : job
        ));
        setShowEditModal(false);
        setSelectedJob(null);
        setEditFormData(null);
        alert('Job updated successfully!');
      } else {
        throw new Error('Failed to update job post');
      }
    } catch (err) {
      console.error('Update error:', err);
      alert(err instanceof Error ? err.message : 'Failed to update job post');
    }
  };

  const handleMessageProvider = async (proposal: any) => {
    try {
      const providerId = proposal.providerId?._id || proposal.providerId;
      const providerName = proposal.providerId?.name || proposal.provider?.name || 'Provider';
      
      if (!providerId) {
        alert('Provider information not available');
        return;
      }

      console.log('💬 Starting conversation with provider:', { providerId, providerName });

      // Get auth token
      const token = getAuthToken();
      if (!token) {
        alert('Please log in to message providers');
        return;
      }

      // Create conversation directly
      const conversationResponse = await fetch(`${API_BASE_URL}/api/messages/conversation`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          participantId: providerId
        }),
      });

      if (conversationResponse.ok) {
        const conversationData = await conversationResponse.json();
        console.log('✅ Conversation created:', conversationData);
        
        const conversationId = conversationData.data?.conversation?._id || conversationData.conversation?._id;
        
        if (conversationId) {
          // Navigate directly to messages with the conversation ID
          navigate('/customer/messages', {
            state: {
              activeConversationId: conversationId,
              providerName: providerName
            }
          });
        } else {
          // Fallback: navigate without specific conversation
          navigate('/customer/messages');
        }
      } else {
        // Fallback: navigate to messages page anyway
        navigate('/customer/messages');
      }

    } catch (error) {
      console.error('❌ Error starting conversation:', error);
      // Fallback: navigate to messages page anyway
      navigate('/customer/messages');
    }
  };

  const handleViewProviderProfile = (proposal: any) => {
    const providerId = proposal.providerId?._id || proposal.providerId;
    
    if (!providerId) {
      alert('Provider information not available');
      return;
    }

    console.log('👤 Viewing provider profile:', providerId);
    
    // Navigate to correct provider profile path
    navigate(`/customer/provider/${providerId}`);
  };

  const handlePostJob = async (jobData: any) => {
    try {
      console.log('💰 Handling job posting...', jobData);
      
      const budgetAmount = jobData.budget ? parseInt(jobData.budget.replace(/[^\d]/g, '')) || 0 : 0;

      const token = getAuthToken();
      if (!token) {
        alert('Please log in to post a job');
        return;
      }

      const serviceRequestData = {
        serviceType: jobData.serviceType,
        description: jobData.description,
        location: jobData.location,
        urgency: jobData.urgency,
        timeframe: jobData.timeframe,
        budget: jobData.budget,
        budgetAmount: budgetAmount,
        category: jobData.category,
        skillsRequired: jobData.skillsRequired,
        estimatedDuration: jobData.estimatedDuration,
        preferredSchedule: jobData.preferredSchedule,
        status: "pending",
      };

      const response = await fetch(`${API_BASE_URL}/api/service-requests`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(serviceRequestData),
      });

      const data = await response.json();

      if (data.success) {
        const createdJobId = data.data._id || data.data.id;
        console.log('✅ Job created with ID:', createdJobId);
        
        if (budgetAmount > 0) {
          try {
            const userCountry = 'Nigeria';

            console.log('💰 Initiating payment for job:', createdJobId);

            const paymentResponse = await fetch(`${API_BASE_URL}/api/jobs/${createdJobId}/create-payment`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({
                amount: budgetAmount,
                customerCountry: userCountry
              })
            });

            const paymentResult = await paymentResponse.json();

            if (paymentResult.success && paymentResult.data.authorizationUrl) {
              window.location.href = paymentResult.data.authorizationUrl;
            } else {
              console.log('✅ Job posted without payment (or payment pending)');
              alert("Job posted successfully!");
              setShowPostJob(false);
              fetchJobPosts(); // Refresh the list
            }
          } catch (paymentError) {
            console.error('Payment initiation error:', paymentError);
            alert("Job posted successfully but payment initiation failed. Please contact support.");
          }
        } else {
          alert("Job posted successfully!");
          setShowPostJob(false);
          fetchJobPosts(); // Refresh the list
        }
      } else {
        alert("Failed to post job: " + data.message);
      }
    } catch (error) {
      console.error('Error posting job:', error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      alert("Error posting job: " + errorMessage);
    }
  };

  // Debug function to check job data
  const debugJobData = (jobId: string) => {
    const job = jobPosts.find(j => j._id === jobId || j.id === jobId);
    console.log('🔍 Debug job data:', job);
    
    const token = getAuthToken();
    if (token) {
      fetch(`${API_BASE_URL}/api/service-requests/${jobId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
      .then(res => res.json())
      .then(data => console.log('🔍 Fresh API job data:', data));
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <h3 className="text-red-800 font-semibold mb-2">Error</h3>
        <p className="text-red-600">{error}</p>
        <button
          onClick={fetchJobPosts}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Try Again
        </button>
        <button
          onClick={() => navigate('/login')}
          className="mt-4 ml-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          Login Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 rounded-3xl p-8">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-green-400 to-green-600 rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2"></div>
        </div>
        
        <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-emerald-800 to-teal-800 bg-clip-text text-transparent">
                My Job Posts
              </h1>
            </div>
            <p className="text-gray-700 text-lg font-medium max-w-md">
              Manage your long-term service contracts and connect with skilled professionals
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <button className="group bg-white/80 backdrop-blur-sm border border-white/50 text-gray-700 px-6 py-3 rounded-2xl hover:bg-white hover:shadow-xl transition-all duration-300 flex items-center space-x-2 font-semibold">
              <Eye className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
              <span>View Analytics</span>
            </button>
            
            <button
              onClick={() => setShowPostJob(true)}
              className="group bg-gradient-to-r from-emerald-600 via-green-600 to-teal-700 text-white px-8 py-3 rounded-2xl hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center space-x-2 font-semibold shadow-lg"
            >
              <Plus className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
              <span>Post New Job</span>
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search jobs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="awaiting_hero">Awaiting Hero</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          
          <button className="flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Filter className="w-5 h-5" />
            <span>More Filters</span>
          </button>
        </div>

        {/* Job Posts List */}
        <div className="space-y-4">
          {filteredJobPosts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No job posts yet</h3>
              <p className="text-gray-600">Get started by posting your first service request</p>
            </div>
          ) : (
            filteredJobPosts.map((jobPost) => (
              <div key={jobPost._id} className="relative">
                <JobPostCard
                  jobPost={jobPost}
                  onEdit={handleEditJob}
                  onViewProposals={handleViewProposals}
                  onDelete={handleDeleteJob}
                />
                {/* Debug button - remove in production */}
                {process.env.NODE_ENV === 'development' && (
                  <button
                    onClick={() => debugJobData(jobPost._id)}
                    className="absolute top-2 right-2 text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded opacity-0 hover:opacity-100 transition-opacity"
                  >
                    Debug
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Post Job Modal */}
      <PostJobModal
        isOpen={showPostJob}
        onClose={() => setShowPostJob(false)}
        onSubmit={handlePostJob}
      />

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">Delete Job Post</h3>
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSelectedJob(null);
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete the job post "<strong>{selectedJob.title}</strong>"? This action cannot be undone.
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSelectedJob(null);
                  }}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteJob}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Job Modal */}
      {showEditModal && selectedJob && editFormData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Edit Job Post</h3>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedJob(null);
                    setEditFormData(null);
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleUpdateJob} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Service Type
                  </label>
                  <input
                    type="text"
                    value={editFormData.serviceType || ''}
                    onChange={(e) => setEditFormData({...editFormData, serviceType: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={editFormData.description || ''}
                    onChange={(e) => setEditFormData({...editFormData, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                    rows={4}
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      value={editFormData.location || ''}
                      onChange={(e) => setEditFormData({...editFormData, location: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Budget
                    </label>
                    <input
                      type="text"
                      value={editFormData.budget || ''}
                      onChange={(e) => setEditFormData({...editFormData, budget: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                      required
                    />
                  </div>
                </div>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditModal(false);
                      setSelectedJob(null);
                      setEditFormData(null);
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Proposals Modal */}
      {showProposalsModal && selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Proposals for {selectedJob.title}</h3>
                  <p className="text-gray-600">{proposals.length} proposals received</p>
                </div>
                <button
                  onClick={() => {
                    setShowProposalsModal(false);
                    setSelectedJob(null);
                    setProposals([]);
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {proposalsLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
                  <p className="text-gray-600 mt-4">Loading proposals...</p>
                </div>
              ) : proposals.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">No Proposals Yet</h4>
                  <p className="text-gray-600">No providers have submitted proposals for this job yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {proposals.map((proposal, index) => (
                    <div key={proposal._id || `proposal-${index}`} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 
                            className="font-semibold text-gray-900 cursor-pointer hover:text-green-600 transition-colors inline-block"
                            onClick={() => handleViewProviderProfile(proposal)}
                          >
                            {proposal.providerId?.name || proposal.provider?.name || 'Unknown Provider'}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {proposal.providerId?.email || proposal.provider?.email || 'No email provided'}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          proposal.status === 'accepted' 
                            ? 'bg-green-100 text-green-800'
                            : proposal.status === 'rejected'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {proposal.status || 'pending'}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-500">Proposed Budget</label>
                          <p className="text-sm font-semibold text-emerald-600">
                            {proposal.proposedBudget || proposal.budget || 'Not specified'}
                          </p>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500">Timeline</label>
                          <p className="text-sm text-gray-900">
                            {proposal.timeline || proposal.estimatedDuration || 'Not specified'}
                          </p>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500">Submitted</label>
                          <p className="text-sm text-gray-900">
                            {new Date(proposal.createdAt || proposal.submittedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      {(proposal.message || proposal.proposalText) && (
                        <div className="mb-3">
                          <label className="block text-xs font-medium text-gray-500">Message</label>
                          <p className="text-sm text-gray-900">
                            {proposal.message || proposal.proposalText}
                          </p>
                        </div>
                      )}

                      {(proposal.status === 'pending' || !proposal.status) && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleAcceptProposal(proposal._id)}
                            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-sm"
                          >
                            Accept Proposal
                          </button>
                          <button 
                            onClick={() => handleMessageProvider(proposal)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm flex items-center gap-2"
                          >
                            <MessageCircle className="w-4 h-4" />
                            Message Provider
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobsPage;