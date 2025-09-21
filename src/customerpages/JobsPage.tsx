import React, { useState, useEffect } from 'react';
import { Plus, ArrowRight, Briefcase, TrendingUp, Users, Eye, Search, Filter } from 'lucide-react';
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
  const navigate = useNavigate();

  useEffect(() => {
    fetchJobPosts();
  }, [authToken, userId]);

  const fetchJobPosts = async () => {
    try {
      if (!authToken) {
        setError('Authentication required');
        setLoading(false);
        navigate('/login');
        return;
      }

      // Verify token is still valid before making the request
      try {
        const profileResponse = await fetch(`${API_BASE_URL}/api/auth/profile`, {
          headers: {
            'Authorization': `Bearer ${authToken}`,
          },
        });

        if (profileResponse.status === 401) {
          localStorage.removeItem('authToken');
          localStorage.removeItem('token');
          setError('Session expired. Please login again.');
          navigate('/login');
          return;
        }
      } catch (profileError) {
        console.error('Token validation error:', profileError);
        setError('Failed to validate session');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/service-requests/customer?t=${Date.now()}`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 401) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('token');
        setError('Session expired. Please login again.');
        navigate('/login');
        return;
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch job posts: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      
      if (data.success) {
        // Transform the API response to match JobPost interface
        const transformedJobs: JobPost[] = data.data.jobs.map((job: any) => ({
          _id: job._id,
          id: job._id,
          title: job.serviceType || 'Untitled Service',
          description: job.description || 'No description provided',
          budget: job.budget || '0',
          category: job.category || 'general',
          location: job.location || 'Location not specified',
          status: job.status || 'pending',
          createdAt: job.createdAt,
          datePosted: new Date(job.createdAt).toLocaleDateString(),
          duration: 'Not specified',
          proposals: 0,
          serviceType: job.serviceType,
          urgency: job.urgency,
          timeframe: job.timeframe
        }));

        setJobPosts(transformedJobs);
      } else {
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
    console.log('Edit job:', id);
    // Implement edit functionality
  };

  const handleViewProposals = (id: string) => {
    console.log('View proposals for job:', id);
    // Implement view proposals functionality
  };

  const handleDeleteJob = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this job post?')) return;

    try {
      const response = await fetch(`${API_BASE_URL}:3001/api/service-requests/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setJobPosts(prev => prev.filter(job => job._id !== id));
      } else {
        throw new Error('Failed to delete job post');
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete job post');
    }
  };

  const handlePostJob = (jobData: any) => {
    console.log('New job posted:', jobData);
    setShowPostJob(false);
    // Refresh the job posts after posting a new job
    fetchJobPosts();
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
          className="mt-4 ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Login Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Enhanced Header Section with Background */}
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 rounded-3xl p-8">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-green-400 to-blue-600 rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2"></div>
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
            <option value="accepted">In Progress</option>
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
              <JobPostCard
                key={jobPost._id}
                jobPost={jobPost}
                onEdit={handleEditJob}
                onViewProposals={handleViewProposals}
                onDelete={handleDeleteJob}
              />
            ))
          )}
        </div>
      </div>

      <PostJobModal
        isOpen={showPostJob}
        onClose={() => setShowPostJob(false)}
        onSubmit={handlePostJob}
      />
    </div>
  );
};

export default JobsPage;