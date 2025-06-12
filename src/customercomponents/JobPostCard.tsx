import React from 'react';
import {
  Calendar,
  DollarSign,
  Users,
  MoreVertical,
  Edit3,
  Eye
} from 'lucide-react';
import { JobPost } from '../types';
import { getStatusColor } from '../utils/helpers';

interface JobPostCardProps {
  jobPost: JobPost;
  onEdit: (jobId: string) => void;
  onViewProposals: (jobId: string) => void;
  onDelete: (jobId: string) => void;
}

const JobPostCard: React.FC<JobPostCardProps> = ({
  jobPost,
  onEdit,
  onViewProposals,
  onDelete
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {jobPost.title}
          </h3>
          <p className="text-gray-600 text-sm mb-3 leading-relaxed">
            {jobPost.description}
          </p>
          
          <div className="flex items-center space-x-6 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <DollarSign className="w-4 h-4" />
              <span>{jobPost.budget}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>{jobPost.duration}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="w-4 h-4" />
              <span>{jobPost.proposals} proposals</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(jobPost.status)}`}>
            {jobPost.status.replace('-', ' ')}
          </span>
          
          <div className="relative group">
            <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
              <MoreVertical className="w-4 h-4" />
            </button>
            
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
              <div className="py-1">
                <button
                  onClick={() => onViewProposals(jobPost.id)}
                  className="flex items-center space-x-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <Eye className="w-4 h-4" />
                  <span>View Proposals</span>
                </button>
                <button
                  onClick={() => onEdit(jobPost.id)}
                  className="flex items-center space-x-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Edit Job</span>
                </button>
                <button
                  onClick={() => onDelete(jobPost.id)}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  Delete Job
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <span className="text-sm text-gray-500">
          Posted {jobPost.datePosted}
        </span>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onViewProposals(jobPost.id)}
            className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm font-medium"
          >
            View Proposals ({jobPost.proposals})
          </button>
          {jobPost.status === 'open' && (
            <button
              onClick={() => onEdit(jobPost.id)}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-lg hover:shadow-lg transition-all duration-200 text-sm font-medium"
            >
              Edit Job
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobPostCard;