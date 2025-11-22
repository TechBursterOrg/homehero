import React, { useState, useEffect } from 'react';
import { Search, Filter, CheckCircle, XCircle, Eye, Download, User, Shield, AlertCircle, FileText, Loader } from 'lucide-react';

interface VerificationRequest {
  _id: string;
  userId: string;
  user: {
    name: string;
    email: string;
    phoneNumber?: string;
    userType: string;
    createdAt: string;
  };
  verificationData: {
    nin: string;
    selfieUrl: string;
    nepaBillUrl?: string;
    verificationStatus: string;
    verificationSubmittedAt: string;
    isNinVerified: boolean;
    isSelfieVerified: boolean;
    isNepaVerified: boolean;
    verificationNotes?: string;
    verificationReviewedAt?: string;
  };
}

const AdminVerificationPanel: React.FC = () => {
  const [verificationRequests, setVerificationRequests] = useState<VerificationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState('pending'); // pending, approved, rejected, all
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<VerificationRequest | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageLoading, setImageLoading] = useState<{[key: string]: boolean}>({});
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

  useEffect(() => {
    fetchVerificationRequests();
  }, [filter]);

  const fetchVerificationRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      
      if (!token) {
        setError('Authentication required. Please log in.');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/admin/verification-requests?status=${filter}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error('Admin access required');
        } else if (response.status === 404) {
          throw new Error('Verification endpoint not found');
        } else {
          throw new Error(`Server error: ${response.status}`);
        }
      }

      const result = await response.json();
      
      if (result.success) {
        console.log('📦 Verification requests:', result.data);
        setVerificationRequests(result.data || []);
      } else {
        throw new Error(result.message || 'Failed to fetch verification requests');
      }
    } catch (error) {
      console.error('Error fetching verification requests:', error);
      setError(error instanceof Error ? error.message : 'Failed to load verification requests');
      setVerificationRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const handleVerificationAction = async (userId: string, action: 'approve' | 'reject', notes?: string) => {
    try {
      setActionLoading(action);
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      
      console.log('🔄 Sending verification action:', { userId, action, notes });

      const response = await fetch(`${API_BASE_URL}/api/admin/verify-provider`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          action,
          notes: notes || `${action === 'approve' ? 'Approved' : 'Rejected'} by admin`,
        }),
      });

      const result = await response.json();
      
      if (!response.ok) {
        console.error('❌ Server response error:', result);
        throw new Error(result.message || `HTTP error! status: ${response.status}`);
      }

      if (result.success) {
        console.log('✅ Verification action successful:', result);
        await fetchVerificationRequests();
        setIsModalOpen(false);
        setSelectedRequest(null);
        alert(`Provider verification ${action === 'approve' ? 'approved' : 'rejected'} successfully!`);
      } else {
        throw new Error(result.message || 'Failed to update verification status');
      }
    } catch (error) {
      console.error('❌ Error updating verification:', error);
      alert(error instanceof Error ? error.message : 'Error updating verification status');
    } finally {
      setActionLoading(null);
    }
  };

  const getImageUrl = (url: string): string => {
    if (!url) return '';
    
    // If it's already a full URL, return it
    if (url.startsWith('http')) {
      return url;
    }
    
    // If it's a relative path, prepend the API base URL
    return `${API_BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
  };

  const handleImageLoad = (imageId: string) => {
    setImageLoading(prev => ({ ...prev, [imageId]: false }));
  };

  const handleImageError = (imageId: string, e: React.SyntheticEvent<HTMLImageElement>) => {
    console.error(`Failed to load image: ${imageId}`);
    setImageLoading(prev => ({ ...prev, [imageId]: false }));
    e.currentTarget.src = 'https://via.placeholder.com/300x200?text=Image+Not+Found';
    e.currentTarget.alt = 'Failed to load image';
  };

  const filteredRequests = verificationRequests.filter(request =>
    request.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.verificationData.nin.includes(searchTerm)
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <AlertCircle className="w-4 h-4" />;
      case 'approved': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      default: return <Shield className="w-4 h-4" />;
    }
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-red-800 mb-2">Error Loading Verification Requests</h3>
          <p className="text-red-700 mb-4">{error}</p>
          <button
            onClick={fetchVerificationRequests}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Provider Verification</h1>
        <p className="text-gray-600">Review and verify provider identity documents</p>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by name, email, or NIN..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Requests</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
            <button
              onClick={fetchVerificationRequests}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Loader className={`w-4 h-4 ${loading ? 'animate-spin' : 'hidden'}`} />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Requests</p>
              <p className="text-2xl font-bold text-gray-900">{verificationRequests.length}</p>
            </div>
            <Shield className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">
                {verificationRequests.filter(r => r.verificationData.verificationStatus === 'pending').length}
              </p>
            </div>
            <AlertCircle className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-green-600">
                {verificationRequests.filter(r => r.verificationData.verificationStatus === 'approved').length}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Rejected</p>
              <p className="text-2xl font-bold text-red-600">
                {verificationRequests.filter(r => r.verificationData.verificationStatus === 'rejected').length}
              </p>
            </div>
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
        </div>
      </div>

      {/* Verification Requests Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Provider
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  NIN
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Documents
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Submitted
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRequests.map((request) => (
                <tr key={request._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {request.user.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {request.user.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {request.user.email}
                        </div>
                        {request.user.phoneNumber && (
                          <div className="text-sm text-gray-500">
                            {request.user.phoneNumber}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                    {request.verificationData.nin}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex flex-wrap gap-1">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                        Selfie
                      </span>
                      {request.verificationData.nepaBillUrl && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                          Utility Bill
                        </span>
                      )}
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
                        NIN
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(request.verificationData.verificationSubmittedAt).toLocaleDateString()}
                    <br />
                    <span className="text-xs text-gray-400">
                      {new Date(request.verificationData.verificationSubmittedAt).toLocaleTimeString()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(request.verificationData.verificationStatus)}`}>
                      {getStatusIcon(request.verificationData.verificationStatus)}
                      <span className="ml-1 capitalize">
                        {request.verificationData.verificationStatus}
                      </span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setSelectedRequest(request);
                          setIsModalOpen(true);
                        }}
                        className="text-blue-600 hover:text-blue-900 flex items-center px-3 py-1 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Review
                      </button>
                      {request.verificationData.verificationStatus === 'pending' && (
                        <>
                          <button
                            onClick={() => handleVerificationAction(request.userId, 'approve')}
                            disabled={actionLoading === 'approve'}
                            className="text-green-600 hover:text-green-900 flex items-center px-3 py-1 border border-green-600 rounded-lg hover:bg-green-50 transition-colors disabled:opacity-50"
                          >
                            {actionLoading === 'approve' ? (
                              <Loader className="w-4 h-4 mr-1 animate-spin" />
                            ) : (
                              <CheckCircle className="w-4 h-4 mr-1" />
                            )}
                            Approve
                          </button>
                          <button
                            onClick={() => handleVerificationAction(request.userId, 'reject')}
                            disabled={actionLoading === 'reject'}
                            className="text-red-600 hover:text-red-900 flex items-center px-3 py-1 border border-red-600 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
                          >
                            {actionLoading === 'reject' ? (
                              <Loader className="w-4 h-4 mr-1 animate-spin" />
                            ) : (
                              <XCircle className="w-4 h-4 mr-1" />
                            )}
                            Reject
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredRequests.length === 0 && (
          <div className="text-center py-12">
            <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No verification requests found</p>
            <p className="text-gray-400 mt-2">
              {filter === 'pending' 
                ? 'No pending verification requests at the moment.'
                : 'No verification requests match your criteria.'
              }
            </p>
          </div>
        )}
      </div>

      {/* Review Modal */}
      {isModalOpen && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">Review Verification - {selectedRequest.user.name}</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Provider Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Provider Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p className="font-medium">{selectedRequest.user.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email Address</p>
                    <p className="font-medium">{selectedRequest.user.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone Number</p>
                    <p className="font-medium">{selectedRequest.user.phoneNumber || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">User Type</p>
                    <p className="font-medium capitalize">{selectedRequest.user.userType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">NIN Number</p>
                    <p className="font-medium font-mono">{selectedRequest.verificationData.nin}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Account Created</p>
                    <p className="font-medium">
                      {new Date(selectedRequest.user.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Verification Timeline */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Verification Timeline</h3>
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="ml-2">Submitted: {new Date(selectedRequest.verificationData.verificationSubmittedAt).toLocaleString()}</span>
                  </div>
                  {selectedRequest.verificationData.verificationReviewedAt && (
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="ml-2">Reviewed: {new Date(selectedRequest.verificationData.verificationReviewedAt).toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Documents */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Verification Documents</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Selfie */}
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Selfie Photo</p>
                    <div className="border rounded-lg p-4">
                      {selectedRequest.verificationData.selfieUrl ? (
                        <div className="relative">
                          {imageLoading[`selfie-${selectedRequest._id}`] && (
                            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded">
                              <Loader className="w-8 h-8 text-blue-600 animate-spin" />
                            </div>
                          )}
                          <img
                            src={getImageUrl(selectedRequest.verificationData.selfieUrl)}
                            alt="Selfie verification"
                            className={`w-full h-64 object-contain rounded ${
                              imageLoading[`selfie-${selectedRequest._id}`] ? 'opacity-0' : 'opacity-100'
                            }`}
                            onLoad={() => handleImageLoad(`selfie-${selectedRequest._id}`)}
                            onError={(e) => handleImageError(`selfie-${selectedRequest._id}`, e)}
                          />
                        </div>
                      ) : (
                        <div className="w-full h-64 bg-gray-100 rounded flex items-center justify-center">
                          <AlertCircle className="w-12 h-12 text-gray-400 mb-2" />
                          <p className="text-gray-500">No selfie image available</p>
                        </div>
                      )}
                      <div className="mt-2 flex justify-between items-center">
                        <span className="text-sm text-gray-500">Identity Confirmation</span>
                        {selectedRequest.verificationData.selfieUrl && (
                          <a
                            href={getImageUrl(selectedRequest.verificationData.selfieUrl)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 flex items-center text-sm"
                          >
                            <Download className="w-4 h-4 mr-1" />
                            Open Full Size
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Utility Bill */}
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      Utility Bill {!selectedRequest.verificationData.nepaBillUrl && '(Not Provided)'}
                    </p>
                    {selectedRequest.verificationData.nepaBillUrl ? (
                      <div className="border rounded-lg p-4">
                        {selectedRequest.verificationData.nepaBillUrl.endsWith('.pdf') ? (
                          <div className="w-full h-64 bg-gray-100 rounded flex items-center justify-center">
                            <div className="text-center">
                              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                              <p className="text-sm text-gray-500">PDF Document</p>
                              <a
                                href={getImageUrl(selectedRequest.verificationData.nepaBillUrl)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 text-sm"
                              >
                                View PDF
                              </a>
                            </div>
                          </div>
                        ) : (
                          <div className="relative">
                            {imageLoading[`nepa-${selectedRequest._id}`] && (
                              <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded">
                                <Loader className="w-8 h-8 text-blue-600 animate-spin" />
                              </div>
                            )}
                            <img
                              src={getImageUrl(selectedRequest.verificationData.nepaBillUrl)}
                              alt="Utility bill"
                              className={`w-full h-64 object-contain rounded ${
                                imageLoading[`nepa-${selectedRequest._id}`] ? 'opacity-0' : 'opacity-100'
                              }`}
                              onLoad={() => handleImageLoad(`nepa-${selectedRequest._id}`)}
                              onError={(e) => handleImageError(`nepa-${selectedRequest._id}`, e)}
                            />
                          </div>
                        )}
                        <div className="mt-2 flex justify-between items-center">
                          <span className="text-sm text-gray-500">Address Verification</span>
                          <a
                            href={getImageUrl(selectedRequest.verificationData.nepaBillUrl)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 flex items-center text-sm"
                          >
                            <Download className="w-4 h-4 mr-1" />
                            {selectedRequest.verificationData.nepaBillUrl.endsWith('.pdf') ? 'View PDF' : 'Open Full Size'}
                          </a>
                        </div>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                        <AlertCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">No utility bill provided</p>
                        <p className="text-xs text-gray-400 mt-1">Utility bill is optional for verification</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Verification Status */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Verification Status</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className={`p-4 rounded-lg ${
                    selectedRequest.verificationData.isNinVerified ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'
                  }`}>
                    <p className="font-medium">NIN Verification</p>
                    <p className={`text-sm ${selectedRequest.verificationData.isNinVerified ? 'text-green-700' : 'text-yellow-700'}`}>
                      {selectedRequest.verificationData.isNinVerified ? 'Verified' : 'Pending'}
                    </p>
                  </div>
                  <div className={`p-4 rounded-lg ${
                    selectedRequest.verificationData.isSelfieVerified ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'
                  }`}>
                    <p className="font-medium">Selfie Verification</p>
                    <p className={`text-sm ${selectedRequest.verificationData.isSelfieVerified ? 'text-green-700' : 'text-yellow-700'}`}>
                      {selectedRequest.verificationData.isSelfieVerified ? 'Verified' : 'Pending'}
                    </p>
                  </div>
                  <div className={`p-4 rounded-lg ${
                    selectedRequest.verificationData.isNepaVerified ? 'bg-green-50 border border-green-200' : 
                    selectedRequest.verificationData.nepaBillUrl ? 'bg-yellow-50 border border-yellow-200' : 'bg-gray-50 border border-gray-200'
                  }`}>
                    <p className="font-medium">Utility Bill Verification</p>
                    <p className={`text-sm ${
                      selectedRequest.verificationData.isNepaVerified ? 'text-green-700' : 
                      selectedRequest.verificationData.nepaBillUrl ? 'text-yellow-700' : 'text-gray-700'
                    }`}>
                      {selectedRequest.verificationData.isNepaVerified ? 'Verified' : 
                       selectedRequest.verificationData.nepaBillUrl ? 'Pending' : 'Not Provided'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              {selectedRequest.verificationData.verificationStatus === 'pending' && (
                <div className="flex space-x-4 pt-6 border-t">
                  <button
                    onClick={() => handleVerificationAction(selectedRequest.userId, 'reject', 'Documents do not meet verification requirements')}
                    disabled={actionLoading === 'reject'}
                    className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                  >
                    {actionLoading === 'reject' ? (
                      <Loader className="w-5 h-5 text-white mr-2 animate-spin" />
                    ) : (
                      <XCircle className="w-5 h-5 mr-2" />
                    )}
                    Reject Verification
                  </button>
                  <button
                    onClick={() => handleVerificationAction(selectedRequest.userId, 'approve')}
                    disabled={actionLoading === 'approve'}
                    className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                  >
                    {actionLoading === 'approve' ? (
                      <Loader className="w-5 h-5 text-white mr-2 animate-spin" />
                    ) : (
                      <CheckCircle className="w-5 h-5 mr-2" />
                    )}
                    Approve Verification
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminVerificationPanel; 