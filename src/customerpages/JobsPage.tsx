import React, { useState } from 'react';
import { Plus, ArrowRight, Briefcase, TrendingUp, Users, Eye } from 'lucide-react';
import JobPostCard from '../customercomponents/JobPostCard';
import PostJobModal from '../customercomponents/PostJobModal';
import { jobPosts } from '../data/mockData';

const JobsPage: React.FC = () => {
  const [showPostJob, setShowPostJob] = useState(false);

  const handleJobAction = (jobId: string, action: string) => {
    console.log('Job action:', action, jobId);
  };

  const handlePostJob = (jobData: any) => {
    console.log('New job posted:', jobData);
    setShowPostJob(false);
  };

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

      {/* Enhanced Stats Grid */}
      

      {/* Job Posts List */}
      <div className="space-y-4 sm:space-y-6">
        {jobPosts.map((jobPost) => (
          <JobPostCard
            key={jobPost.id}
            jobPost={jobPost}
            onEdit={(id) => handleJobAction(id, 'edit')}
            onViewProposals={(id) => handleJobAction(id, 'view-proposals')}
            onDelete={(id) => handleJobAction(id, 'delete')}
          />
        ))}
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