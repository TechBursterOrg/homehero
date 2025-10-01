// JobPostCard.tsx
import React, { useState } from 'react';
import {
  Calendar,
  DollarSign,
  Users,
  MoreVertical,
  Edit3,
  Eye,
  Clock,
  XCircle,
  MessageCircle
} from 'lucide-react';

export interface JobPost {
  _id: string;
  id: string;
  title: string;
  description: string;
  budget: string;
  category: string;
  location: string;
  status: string;
  createdAt: string;
  datePosted: string;
  duration: string;
  proposals: number;
  serviceType?: string;
  urgency?: string;
  timeframe?: string;
}

interface JobPostCardProps {
  jobPost: JobPost;
  onEdit: (jobId: string) => void;
  onViewProposals: (jobId: string) => void;
  onDelete: (jobId: string) => void;
  onToggleFavorite?: (jobId: string) => void;
  isFavorite?: boolean;
}

const JobPostCard: React.FC<JobPostCardProps> = ({
  jobPost,
  onEdit,
  onViewProposals,
  onDelete,
  onToggleFavorite,
  isFavorite = false
}) => {
  const [showMoreOptions, setShowMoreOptions] = useState(false);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return <div className="w-2 h-2 bg-green-500 rounded-full" />;
      case 'in-progress':
        return <div className="w-2 h-2 bg-blue-500 rounded-full" />;
      case 'completed':
        return <div className="w-2 h-2 bg-purple-500 rounded-full" />;
      case 'paused':
        return <div className="w-2 h-2 bg-yellow-500 rounded-full" />;
      case 'cancelled':
        return <div className="w-2 h-2 bg-red-500 rounded-full" />;
      default:
        return <div className="w-2 h-2 bg-gray-500 rounded-full" />;
    }
  };

  const getStatusBadge = (status: string) => {
  const baseClasses = "inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold";
  
  switch (status) {
    case 'pending':
      return `${baseClasses} bg-yellow-100 text-yellow-800`;
    case 'accepted':
      return `${baseClasses} bg-blue-100 text-blue-800`;
    case 'completed':
      return `${baseClasses} bg-green-100 text-green-800`;
    case 'cancelled':
      return `${baseClasses} bg-red-100 text-red-800`;
    case 'rejected':
      return `${baseClasses} bg-red-100 text-red-800`;
    default:
      return `${baseClasses} bg-gray-100 text-gray-600`;
  }
};


  const getInitials = (title: string) => {
    return title.split(' ').slice(0, 2).map(word => word[0]).join('').toUpperCase();
  };

  const getPriorityColor = (budget: string) => {
    const budgetNum = parseInt(budget.replace(/\D/g, ''));
    if (budgetNum >= 5000) return 'bg-gradient-to-br from-purple-600 to-pink-600';
    if (budgetNum >= 2000) return 'bg-gradient-to-br from-blue-600 to-purple-600';
    return 'bg-gradient-to-br from-green-600 to-blue-600';
  };

  return (
    <>
      <div className="group bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 p-4">
        {/* Mobile Layout */}
        <div className="flex flex-col sm:hidden space-y-3">
          {/* Header Row */}
          <div className="flex items-start gap-3">
            <div className={`w-12 h-12 ${getPriorityColor(jobPost.budget)} rounded-xl flex items-center justify-center text-white font-bold text-sm`}>
              {getInitials(jobPost.title)}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-gray-900 mb-1 line-clamp-2">
                    {jobPost.title}
                  </h3>
                  
                  <div className={getStatusBadge(jobPost.status)}>
                    {getStatusIcon(jobPost.status)}
                    <span>{jobPost.status.replace('-', ' ')}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-1">
                  <div className="relative">
                    <button 
                      onClick={() => setShowMoreOptions(!showMoreOptions)}
                      className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-600 line-clamp-2">
            {jobPost.description}
          </p>

          {/* Stats Row */}
          <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
            <div className="flex items-center gap-1">
              <DollarSign className="w-3 h-3" />
              <span className="font-semibold text-emerald-600">{jobPost.budget}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              <span>{jobPost.proposals} proposals</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{jobPost.duration}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span className="truncate">{jobPost.datePosted}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <button 
                onClick={() => onViewProposals(jobPost.id)}
                className="flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-600 text-sm rounded-lg hover:bg-blue-100"
              >
                <Eye className="w-3 h-3" />
                <span>View</span>
              </button>
            </div>
            
            <button
              onClick={() => onEdit(jobPost.id)}
              className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200"
            >
              Edit
            </button>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden sm:flex items-start gap-4">
          <div className={`w-14 h-14 ${getPriorityColor(jobPost.budget)} rounded-xl flex items-center justify-center text-white font-bold text-lg`}>
            {getInitials(jobPost.title)}
          </div>
          
          <div className="flex-1">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {jobPost.title}
                  </h3>
                  
                  <div className={getStatusBadge(jobPost.status)}>
                    {getStatusIcon(jobPost.status)}
                    <span>{jobPost.status.replace('-', ' ')}</span>
                  </div>
                </div>
                
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {jobPost.description}
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="relative">
                  <button 
                    onClick={() => setShowMoreOptions(!showMoreOptions)}
                    className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                  <span className="font-semibold text-emerald-600">{jobPost.budget}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span>{jobPost.duration}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4 text-purple-600" />
                  <span>{jobPost.proposals} proposals</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span>Posted {jobPost.datePosted}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => onViewProposals(jobPost.id)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200"
                >
                  <Eye className="w-4 h-4" />
                  <span className="text-sm">View Proposals</span>
                </button>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onEdit(jobPost.id)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm"
                >
                  Edit Job
                </button>
                <button
                  onClick={() => onDelete(jobPost.id)}
                  className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Dropdown Menu */}
        {showMoreOptions && (
          <div className="absolute right-4 top-12 bg-white border border-gray-200 rounded-lg shadow-lg p-2 z-10 min-w-32">
            <button
              onClick={() => {
                onViewProposals(jobPost.id);
                setShowMoreOptions(false);
              }}
              className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded-md flex items-center gap-2"
            >
              <Eye className="w-4 h-4" />
              <span>View Proposals</span>
            </button>
            <button
              onClick={() => {
                onEdit(jobPost.id);
                setShowMoreOptions(false);
              }}
              className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded-md flex items-center gap-2"
            >
              <Edit3 className="w-4 h-4" />
              <span>Edit Job</span>
            </button>
            <button
              onClick={() => {
                onDelete(jobPost.id);
                setShowMoreOptions(false);
              }}
              className="w-full text-left px-3 py-2 text-sm hover:bg-red-50 rounded-md flex items-center gap-2 text-red-600"
            >
              <XCircle className="w-4 h-4" />
              <span>Delete</span>
            </button>
          </div>
        )}
      </div>

      {showMoreOptions && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={() => setShowMoreOptions(false)}
        />
      )}
    </>
  );
};

export default JobPostCard;