import React, { useState } from 'react';
import {
  Calendar,
  DollarSign,
  Users,
  MoreVertical,
  Edit3,
  Eye,
  Clock,
  Briefcase,
  Star,
  Heart,
  MessageCircle,
  CheckCircle2,
  AlertCircle,
  Pause,
  XCircle
} from 'lucide-react';
import { JobPost } from '../types';
import { getStatusColor } from '../utils/helpers';

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
        return <CheckCircle2 className="w-3 h-3" />;
      case 'in-progress':
        return <Clock className="w-3 h-3" />;
      case 'completed':
        return <CheckCircle2 className="w-3 h-3" />;
      case 'paused':
        return <Pause className="w-3 h-3" />;
      case 'cancelled':
        return <XCircle className="w-3 h-3" />;
      default:
        return <AlertCircle className="w-3 h-3" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold";
    
    switch (status) {
      case 'open':
        return `${baseClasses} bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-sm`;
      case 'in-progress':
        return `${baseClasses} bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-sm`;
      case 'completed':
        return `${baseClasses} bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-sm`;
      case 'paused':
        return `${baseClasses} bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-sm`;
      case 'cancelled':
        return `${baseClasses} bg-gradient-to-r from-red-500 to-red-600 text-white shadow-sm`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-600`;
    }
  };

  const getInitials = (title: string) => {
    return title.split(' ').slice(0, 2).map(word => word[0]).join('').toUpperCase();
  };

  const getPriorityColor = (budget: string) => {
    const budgetNum = parseInt(budget.replace(/\D/g, ''));
    if (budgetNum >= 5000) return 'from-purple-600 to-pink-600';
    if (budgetNum >= 2000) return 'from-blue-600 to-purple-600';
    return 'from-green-600 to-blue-600';
  };

  return (
    <>
      <div className="group bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:scale-105 transition-all duration-300 p-4 sm:p-6 overflow-hidden">
        {/* Mobile Layout */}
        <div className="flex flex-col sm:hidden space-y-4">
          {/* Header Row */}
          <div className="flex items-start gap-3">
            <div className={`w-14 h-14 bg-gradient-to-br ${getPriorityColor(jobPost.budget)} rounded-2xl flex items-center justify-center text-white font-bold text-sm shadow-lg shrink-0`}>
              {getInitials(jobPost.title)}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h3 className="text-base font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-1 line-clamp-2">
                    {jobPost.title}
                  </h3>
                  
                  <div className={getStatusBadge(jobPost.status)}>
                    {getStatusIcon(jobPost.status)}
                    <span>{jobPost.status.replace('-', ' ')}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-1">
                  {onToggleFavorite && (
                    <button
                      onClick={() => onToggleFavorite(jobPost.id)}
                      className={`p-1 rounded-full transition-colors duration-200 ${
                        isFavorite ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                    </button>
                  )}
                  
                  <div className="relative">
                    <button 
                      onClick={() => setShowMoreOptions(!showMoreOptions)}
                      className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                    
                    {showMoreOptions && (
                      <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-xl p-1 z-50 min-w-40">
                        <button
                          onClick={() => {
                            onViewProposals(jobPost.id);
                            setShowMoreOptions(false);
                          }}
                          className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded-lg flex items-center gap-2"
                        >
                          <Eye className="w-4 h-4 text-blue-600" />
                          <span>View Proposals</span>
                        </button>
                        <button
                          onClick={() => {
                            onEdit(jobPost.id);
                            setShowMoreOptions(false);
                          }}
                          className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded-lg flex items-center gap-2"
                        >
                          <Edit3 className="w-4 h-4 text-green-600" />
                          <span>Edit Job</span>
                        </button>
                        <button
                          onClick={() => {
                            onDelete(jobPost.id);
                            setShowMoreOptions(false);
                          }}
                          className="w-full text-left px-3 py-2 text-sm hover:bg-red-50 rounded-lg flex items-center gap-2 text-red-600"
                        >
                          <XCircle className="w-4 h-4" />
                          <span>Delete</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
            {jobPost.description}
          </p>

          {/* Stats Row */}
          <div className="grid grid-cols-2 gap-3 text-xs text-gray-600">
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
                className="p-2 bg-blue-100 text-blue-600 hover:bg-blue-200 rounded-xl transition-all duration-200 hover:scale-105"
              >
                <MessageCircle className="w-4 h-4" />
              </button>
              
              <span className="text-xs text-gray-500 font-medium">
                {jobPost.proposals} proposals
              </span>
            </div>
            
            <button
              onClick={() => onEdit(jobPost.id)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-2 rounded-xl font-semibold transition-all duration-200 hover:scale-105 shadow-lg text-sm"
            >
              Edit Job
            </button>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden sm:flex items-start gap-4">
          <div className={`w-16 h-16 bg-gradient-to-br ${getPriorityColor(jobPost.budget)} rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg shrink-0 group-hover:scale-110 transition-transform duration-300`}>
            {getInitials(jobPost.title)}
          </div>
          
          <div className="flex-1">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {jobPost.title}
                  </h3>
                  
                  <div className={getStatusBadge(jobPost.status)}>
                    {getStatusIcon(jobPost.status)}
                    <span>{jobPost.status.replace('-', ' ')}</span>
                  </div>
                </div>
                
                <p className="text-gray-600 text-sm mb-3 leading-relaxed line-clamp-2">
                  {jobPost.description}
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                {onToggleFavorite && (
                  <button
                    onClick={() => onToggleFavorite(jobPost.id)}
                    className={`p-2 rounded-full transition-all duration-200 ${
                      isFavorite ? 'text-red-500' : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                  </button>
                )}
                
                <div className="relative">
                  <button 
                    onClick={() => setShowMoreOptions(!showMoreOptions)}
                    className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors"
                  >
                    <MoreVertical className="w-5 h-5" />
                  </button>
                  
                  {showMoreOptions && (
                    <div className="absolute right-0 top-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl p-2 z-50 min-w-48">
                      <button
                        onClick={() => {
                          onViewProposals(jobPost.id);
                          setShowMoreOptions(false);
                        }}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded-lg flex items-center gap-2"
                      >
                        <Eye className="w-4 h-4 text-blue-600" />
                        <span>View Proposals</span>
                      </button>
                      <button
                        onClick={() => {
                          onEdit(jobPost.id);
                          setShowMoreOptions(false);
                        }}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded-lg flex items-center gap-2"
                      >
                        <Edit3 className="w-4 h-4 text-green-600" />
                        <span>Edit Job</span>
                      </button>
                      <button
                        onClick={() => {
                          onDelete(jobPost.id);
                          setShowMoreOptions(false);
                        }}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-red-50 rounded-lg flex items-center gap-2 text-red-600"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>Delete Job</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <DollarSign className="w-3 h-3 text-emerald-600" />
                    </div>
                    <span className="font-semibold text-emerald-600">{jobPost.budget}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Clock className="w-3 h-3 text-blue-600" />
                    </div>
                    <span>{jobPost.duration}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-3 h-3" />
                  </div>
                  <span>Posted {jobPost.datePosted}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Users className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{jobPost.proposals} Proposals</p>
                  <p className="text-xs text-gray-500">Received so far</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => onViewProposals(jobPost.id)}
                  className="p-3 bg-blue-100 text-blue-600 hover:bg-blue-200 rounded-xl transition-all duration-200 hover:scale-105"
                >
                  <MessageCircle className="w-5 h-5" />
                </button>
                
                <button
                  onClick={() => onEdit(jobPost.id)}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Edit Job
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Hover Effect Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl sm:rounded-3xl"></div>
      </div>

      {showMoreOptions && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowMoreOptions(false)}
        />
      )}
    </>
  );
};

export default JobPostCard;