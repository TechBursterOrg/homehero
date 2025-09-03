import React, { useState, useEffect } from 'react';
import { 
  Images, 
  ArrowLeft, 
  Heart, 
  Eye, 
  Calendar, 
  Tag, 
  Share2, 
  Download, 
  Edit3, 
  Trash2, 
  Plus, 
  X, 
  Filter, 
  Search,
  Grid3X3,
  List,
  Star,
  Clock,
  MapPin,
  Camera,
  Sparkles,
  TrendingUp,
  Award,
  Loader,
  AlertCircle
} from 'lucide-react';
import axios from 'axios';

interface GalleryImage {
  _id: string;
  imageUrl: string;
  fullImageUrl?: string;
  title: string;
  category: string;
  description: string;
  createdAt: string;
  views: number;
  likes: number;
  featured: boolean;
  userId?: {
    _id: string;
    name: string;
    profileImage?: string;
  };
  tags?: string[];
  filename?: string;
}

interface Category {
  id: string;
  name: string;
  count: number;
  color: string;
}

// Use the correct API base URL - point to your render backend
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://backendhomeheroes.onrender.com';

const GalleryPage: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    title: '',
    description: '',
    category: 'cleaning',
    tags: '',
    featured: false
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    show: boolean;
    image: GalleryImage | null;
  }>({ show: false, image: null });

  // Fetch gallery images from backend
  useEffect(() => {
    fetchGalleryImages();
  }, [selectedCategory, searchTerm]);

  const fetchGalleryImages = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      
      if (!token) {
        setError('Please log in to view gallery');
        setLoading(false);
        return;
      }
      
      const params: any = { 
        page: 1, 
        limit: 50 
      };
      
      if (selectedCategory !== 'all') {
        params.category = selectedCategory;
      }
      
      if (searchTerm) {
        params.search = searchTerm;
      }
      
      const response = await axios.get(`${API_BASE_URL}/api/gallery`, { 
        params,
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        // Ensure all images have proper URLs
        const imagesWithUrls = response.data.data.docs.map((image: GalleryImage) => {
          // Fix image URLs - handle both relative and absolute URLs
          let fullImageUrl = image.fullImageUrl || image.imageUrl;
          
          // If it's a relative path, prepend the API base URL
          if (fullImageUrl && fullImageUrl.startsWith('/')) {
            fullImageUrl = `${API_BASE_URL}${fullImageUrl}`;
          }
          
          // If it's an HTTP URL but we're on HTTPS, convert it
          if (fullImageUrl && fullImageUrl.startsWith('http://') && window.location.protocol === 'https:') {
            fullImageUrl = fullImageUrl.replace('http://', 'https://');
          }
          
          return {
            ...image,
            fullImageUrl
          };
        });
        
        setGalleryImages(imagesWithUrls || []);
      } else {
        setError('Failed to fetch gallery images');
      }
    } catch (error: any) {
      console.error('Error fetching gallery images:', error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        setError('Your session has expired. Please log in again.');
        // Clear invalid tokens
        localStorage.removeItem('authToken');
        localStorage.removeItem('token');
        localStorage.removeItem('userData');
      } else if (error.response?.status === 404) {
        setError('Gallery endpoint not found. Please try again later.');
      } else {
        setError('Failed to load gallery. Please check your connection and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const categories: Category[] = [
    { id: 'all', name: 'All Projects', count: galleryImages.length, color: 'from-gray-500 to-gray-600' },
    { id: 'cleaning', name: 'Cleaning', count: galleryImages.filter(img => img.category === 'cleaning').length, color: 'from-blue-500 to-blue-600' },
    { id: 'handyman', name: 'Handyman', count: galleryImages.filter(img => img.category === 'handyman').length, color: 'from-purple-500 to-purple-600' },
    { id: 'gardening', name: 'Gardening', count: galleryImages.filter(img => img.category === 'gardening').length, color: 'from-green-500 to-green-600' }
  ];

  const filteredImages = galleryImages.filter(image => {
    const matchesCategory = selectedCategory === 'all' || image.category === selectedCategory;
    const matchesSearch = image.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         image.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (image.tags && image.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));
    return matchesCategory && matchesSearch;
  });

  const featuredImages = galleryImages.filter(img => img.featured);
  const totalViews = galleryImages.reduce((sum, img) => sum + (img.views || 0), 0);
  const totalLikes = galleryImages.reduce((sum, img) => sum + (img.likes || 0), 0);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>, image: GalleryImage) => {
    const target = e.target as HTMLImageElement;
    console.error('Image failed to load:', target.src);
    
    // If this is already a placeholder, don't try again
    if (target.src.includes('via.placeholder.com')) {
      return;
    }
    
    // Try different URL strategies
    if (target.src.includes(API_BASE_URL)) {
      // If API_BASE_URL version failed, try relative path
      const relativePath = target.src.split(API_BASE_URL)[1];
      target.src = relativePath;
    } else if (target.src.startsWith('/')) {
      // If relative path failed, try with API base URL but with HTTPS
      target.src = `https://backendhomeheroes.onrender.com${target.src}`;
    } else {
      // If all else fails, use placeholder
      target.src = 'https://via.placeholder.com/400x300/e2e8f0/64748b?text=Image+Not+Found';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const handleImageClick = async (image: GalleryImage) => {
    setSelectedImage(image);
    
    try {
      await axios.get(`${API_BASE_URL}/api/gallery/${image._id}`);
      fetchGalleryImages();
    } catch (error) {
      console.error('Error updating view count:', error);
    }
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile) {
      setError('Please select an image file');
      return;
    }

    try {
      setUploading(true);
      setError(null);
      
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      
      if (!token) {
        setError('Please log in to upload images');
        setUploading(false);
        return;
      }

      const formData = new FormData();
      formData.append('image', selectedFile);
      formData.append('title', uploadForm.title);
      formData.append('description', uploadForm.description);
      formData.append('category', uploadForm.category);
      formData.append('tags', uploadForm.tags);
      formData.append('featured', uploadForm.featured.toString());

      const response = await axios.post(`${API_BASE_URL}/api/gallery/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        },
        timeout: 30000
      });

      if (response.data.success) {
        setShowUploadModal(false);
        setUploadForm({
          title: '',
          description: '',
          category: 'cleaning',
          tags: '',
          featured: false
        });
        setSelectedFile(null);
        fetchGalleryImages();
      } else {
        setError(response.data.message || 'Failed to upload image');
      }
    } catch (error: any) {
      console.error('Error uploading image:', error);
      
      if (error.code === 'ECONNABORTED') {
        setError('Upload timeout. Please try again with a smaller file.');
      } else if (error.response) {
        if (error.response.status === 401 || error.response.status === 403) {
          localStorage.removeItem('authToken');
          localStorage.removeItem('token');
          localStorage.removeItem('userData');
          setError('Your session has expired. Please log in again.');
          setTimeout(() => {
            window.location.href = '/login';
          }, 2000);
        } else if (error.response.status === 413) {
          setError('File too large. Maximum size is 5MB.');
        } else if (error.response.status === 400) {
          setError(error.response.data.message || 'Invalid form data. Please check your upload.');
        } else {
          setError(error.response.data.message || `Server error: ${error.response.status}`);
        }
      } else if (error.request) {
        setError('No response from server. Please check your connection.');
      } else {
        setError('Failed to upload image. Please try again.');
      }
    } finally {
      setUploading(false);
    }
  };

  const handleLike = async (image: GalleryImage, e: React.MouseEvent) => {
    e.stopPropagation();
    
    try {
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      
      if (!token) {
        setError('Please log in to like images');
        return;
      }

      await axios.post(`${API_BASE_URL}/api/gallery/${image._id}/like`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      setGalleryImages(prev => prev.map(img => 
        img._id === image._id ? { ...img, likes: (img.likes || 0) + 1 } : img
      ));
      
      if (selectedImage && selectedImage._id === image._id) {
        setSelectedImage({ ...selectedImage, likes: (selectedImage.likes || 0) + 1 });
      }
    } catch (error: any) {
      console.error('Error liking image:', error);
      
      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('token');
        localStorage.removeItem('userData');
        setError('Your session has expired. Please log in again.');
      } else {
        setError('Failed to like image. Please try again.');
      }
    }
  };

  const handleShare = async (image: GalleryImage, e: React.MouseEvent) => {
    e.stopPropagation();
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: image.title,
          text: image.description,
          url: window.location.href,
        });
      } else {
        navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  // Delete handlers
  const handleDeleteClick = (image: GalleryImage, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteConfirm({ show: true, image });
  };

  const handleDelete = async (image: GalleryImage, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    
    try {
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      
      if (!token) {
        setError('Please log in to delete images');
        return;
      }

      const response = await axios.delete(`${API_BASE_URL}/api/gallery/${image._id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setGalleryImages(prev => prev.filter(img => img._id !== image._id));
        
        if (selectedImage && selectedImage._id === image._id) {
          setSelectedImage(null);
        }
        
        setError(null);
      } else {
        setError(response.data.message || 'Failed to delete image');
      }
    } catch (error: any) {
      console.error('Error deleting image:', error);
      
      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('token');
        localStorage.removeItem('userData');
        setError('Your session has expired. Please log in again.');
      } else if (error.response?.status === 403) {
        setError('You can only delete your own images');
      } else {
        setError('Failed to delete image. Please try again.');
      }
    }
  };

  const confirmDelete = async () => {
    if (!deleteConfirm.image) return;
    
    await handleDelete(deleteConfirm.image);
    setDeleteConfirm({ show: false, image: null });
  };

  const cancelDelete = () => {
    setDeleteConfirm({ show: false, image: null });
  };

  const clearFilters = () => {
    setSelectedCategory('all');
    setSearchTerm('');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading gallery...</p>
        </div>
      </div>
    );
  }

  if (error && (error.includes('session') || error?.includes('log in'))) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.href = '/login'}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-8">
        
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col space-y-4 sm:space-y-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl sm:rounded-2xl lg:rounded-3xl flex items-center justify-center shadow-lg flex-shrink-0">
                <Images className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-lg sm:text-xl lg:text-3xl xl:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Project Gallery
                </h1>
                <p className="text-gray-600 text-xs sm:text-sm lg:text-base xl:text-lg mt-1">
                  Showcase of professional work and completed projects
                </p>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl">
            <div className="flex justify-between items-center">
              <span>{error}</span>
              <button onClick={() => setError(null)}>
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Gallery Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
          <div className="group bg-white/80 backdrop-blur-sm p-3 sm:p-4 lg:p-6 rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:scale-105 transition-all duration-300">
            <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between mb-2 sm:mb-4 gap-2 sm:gap-0">
              <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
                <Images className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-white" />
              </div>
              <div className="text-blue-600 hidden sm:block">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
            </div>
            <div className="space-y-1 text-center sm:text-left">
              <p className="text-xs sm:text-sm font-medium text-gray-600">Total Projects</p>
              <p className="text-lg sm:text-2xl lg:text-3xl font-bold text-gray-900">{galleryImages.length}</p>
              <p className="text-xs sm:text-sm text-gray-500 hidden sm:block">Professional work</p>
            </div>
          </div>

          <div className="group bg-white/80 backdrop-blur-sm p-3 sm:p-4 lg:p-6 rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:scale-105 transition-all duration-300">
            <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between mb-2 sm:mb-4 gap-2 sm:gap-0">
              <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
                <Eye className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-white" />
              </div>
              <div className="text-emerald-600 hidden sm:block">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
            </div>
            <div className="space-y-1 text-center sm:text-left">
              <p className="text-xs sm:text-sm font-medium text-gray-600">Total Views</p>
              <p className="text-lg sm:text-2xl lg:text-3xl font-bold text-gray-900">{totalViews}</p>
              <p className="text-xs sm:text-sm text-gray-500 hidden sm:block">Gallery engagement</p>
            </div>
          </div>

          <div className="group bg-white/80 backdrop-blur-sm p-3 sm:p-4 lg:p-6 rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:scale-105 transition-all duration-300">
            <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between mb-2 sm:mb-4 gap-2 sm:gap-0">
              <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
                <Heart className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-white" />
              </div>
              <div className="text-pink-600 hidden sm:block">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
            </div>
            <div className="space-y-1 text-center sm:text-left">
              <p className="text-xs sm:text-sm font-medium text-gray-600">Total Likes</p>
              <p className="text-lg sm:text-2xl lg:text-3xl font-bold text-gray-900">{totalLikes}</p>
              <p className="text-xs sm:text-sm text-gray-500 hidden sm:block">Client appreciation</p>
            </div>
          </div>

          <div className="group bg-white/80 backdrop-blur-sm p-3 sm:p-4 lg:p-6 rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:scale-105 transition-all duration-300">
            <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between mb-2 sm:mb-4 gap-2 sm:gap-0">
              <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
                <Award className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-white" />
              </div>
              <div className="text-purple-600 hidden sm:block">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
            </div>
            <div className="space-y-1 text-center sm:text-left">
              <p className="text-xs sm:text-sm font-medium text-gray-600">Featured</p>
              <p className="text-lg sm:text-2xl lg:text-3xl font-bold text-gray-900">{featuredImages.length}</p>
              <p className="text-xs sm:text-sm text-gray-500 hidden sm:block">Best work</p>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 bg-gray-50 border border-gray-200 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                />
              </div>
            </div>

            {/* View Mode Toggle */}
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl border-2 transition-all ${
                  viewMode === 'grid'
                    ? 'bg-blue-50 border-blue-200 text-blue-600'
                    : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Grid3X3 className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl border-2 transition-all ${
                  viewMode === 'list'
                    ? 'bg-blue-50 border-blue-200 text-blue-600'
                    : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                }`}
              >
                <List className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            {/* Add New Button */}
            <button 
              onClick={() => setShowUploadModal(true)}
              className="w-full lg:w-auto bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-semibold transition-all duration-200 hover:scale-105 hover:shadow-xl shadow-lg shadow-blue-200 flex items-center justify-center gap-2 sm:gap-3 text-sm sm:text-base"
            >
              <div className="w-5 h-5 sm:w-6 sm:h-6 bg-white/20 rounded-md sm:rounded-lg flex items-center justify-center">
                <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
              </div>
              <span>Add Image</span>
            </button>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 sm:gap-3 mt-4 sm:mt-6">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl font-medium text-sm sm:text-base transition-all duration-200 ${
                  selectedCategory === category.id
                    ? `bg-gradient-to-r ${category.color} text-white shadow-lg`
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <span>{category.name}</span>
                <span className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-bold ${
                  selectedCategory === category.id
                    ? 'bg-white/20 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {category.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Content */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 sm:p-6 lg:p-8">
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {filteredImages.map((image) => (
                  <div
                    key={image._id}
                    className="group relative bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 cursor-pointer"
                    onClick={() => handleImageClick(image)}
                  >
                    <div className="aspect-[4/3] overflow-hidden">
                      <img
                        src={image.fullImageUrl || `${API_BASE_URL}${image.imageUrl}`}
                        alt={image.title}
                        onError={(e) => handleImageError(e, image)}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    
                    {/* Featured Badge */}
                    {image.featured && (
                      <div className="absolute top-3 right-3">
                        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded-lg flex items-center gap-1 text-xs font-medium">
                          <Star className="w-3 h-3 fill-current" />
                          <span>Featured</span>
                        </div>
                      </div>
                    )}

                    {/* Overlay Actions */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="flex gap-2">
                        <button 
                          className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleImageClick(image);
                          }}
                        >
                          <Eye className="w-5 h-5 text-white" />
                        </button>
                        <button 
                          className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                          onClick={(e) => handleLike(image, e)}
                        >
                          <Heart className="w-5 h-5 text-white" />
                        </button>
                        <button 
                          className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                          onClick={(e) => handleShare(image, e)}
                        >
                          <Share2 className="w-5 h-5 text-white" />
                        </button>
                        {/* Delete button */}
                        <button 
                          className="w-10 h-10 bg-red-500/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-red-600/80 transition-colors"
                          onClick={(e) => handleDeleteClick(image, e)}
                        >
                          <Trash2 className="w-4 h-4 text-white" />
                        </button>
                      </div>
                    </div>

                    <div className="p-4">
                      <div className="mb-2">
                        <h3 className="font-bold text-gray-900 text-sm sm:text-base line-clamp-1">{image.title}</h3>
                        <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 mt-1">{image.description}</p>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            <span>{image.views}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Heart className="w-3 h-3" />
                            <span>{image.likes}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDate(image.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredImages.map((image) => (
                  <div
                    key={image._id}
                    className="group flex gap-4 sm:gap-6 bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 cursor-pointer"
                    onClick={() => handleImageClick(image)}
                  >
                    <div className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 rounded-xl sm:rounded-2xl overflow-hidden flex-shrink-0">
                      <img
                        src={image.fullImageUrl || `${API_BASE_URL}${image.imageUrl}`}
                        alt={image.title}
                        onError={(e) => handleImageError(e, image)}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-gray-900 text-sm sm:text-lg">{image.title}</h3>
                            {image.featured && (
                              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-0.5 rounded-md flex items-center gap-1 text-xs font-medium">
                                <Star className="w-3 h-3 fill-current" />
                                <span>Featured</span>
                              </div>
                            )}
                          </div>
                          <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 mb-3">{image.description}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-xs sm:text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span>{image.views}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Heart className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span>{image.likes}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span>{formatDate(image.createdAt)}</span>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <button 
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleLike(image, e);
                            }}
                          >
                            <Heart className="w-4 h-4 text-gray-600" />
                          </button>
                          <button 
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            onClick={(e) => handleShare(image, e)}
                          >
                            <Share2 className="w-4 h-4 text-gray-600" />
                          </button>
                          {/* Delete button for list view */}
                          <button 
                            className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                            onClick={(e) => handleDeleteClick(image, e)}
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {filteredImages.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Images className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No projects found</h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm ? 'Try adjusting your search terms' : 'No projects match the selected category'}
                </p>
                <button 
                  onClick={clearFilters}
                  className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Image Modal */}
        {selectedImage && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4">
            <div className="bg-white rounded-xl sm:rounded-2xl lg:rounded-3xl w-full h-full sm:w-auto sm:h-auto sm:max-w-[95vw] sm:max-h-[95vh] lg:max-w-6xl xl:max-w-7xl overflow-hidden shadow-2xl flex flex-col sm:flex-row">
              
              {/* Image Section */}
              <div className="relative flex-1 sm:flex-[2] lg:flex-[3] min-h-[50vh] sm:min-h-[60vh] lg:min-h-[70vh]">
                <button
                  onClick={closeModal}
                  className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 w-8 h-8 sm:w-10 sm:h-10 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/60 transition-colors"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                
                <div className="w-full h-full">
                  <img
                    src={selectedImage.fullImageUrl || `${API_BASE_URL}${selectedImage.imageUrl}`}
                    alt={selectedImage.title}
                    onError={(e) => handleImageError(e, selectedImage)}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Content Section */}
              <div className="flex-1 sm:flex-[1] lg:flex-[1] bg-white overflow-y-auto">
                <div className="p-4 sm:p-6 lg:p-8 h-full flex flex-col">
                  {/* Header Section */}
                  <div className="mb-4 lg:mb-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 pr-2">
                        <div className="flex items-center gap-2 mb-2">
                          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 line-clamp-2">{selectedImage.title}</h2>
                          {selectedImage.featured && (
                            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded-md flex items-center gap-1 text-xs font-medium flex-shrink-0">
                              <Star className="w-3 h-3 fill-current" />
                              <span className="hidden sm:inline">Featured</span>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-1 mb-3">
                          <Tag className="w-4 h-4 text-blue-500" />
                          <span className="text-blue-600 font-medium capitalize text-sm">{selectedImage.category}</span>
                        </div>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex gap-1 sm:gap-2 flex-shrink-0">
                        <button className="p-2 sm:p-3 hover:bg-gray-100 rounded-lg transition-colors">
                          <Download className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                        </button>
                        <button 
                          className="p-2 sm:p-3 hover:bg-gray-100 rounded-lg transition-colors"
                          onClick={(e) => handleShare(selectedImage, e)}
                        >
                          <Share2 className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                        </button>
                        <button 
                          className="p-2 sm:p-3 hover:bg-red-100 rounded-lg transition-colors"
                          onClick={(e) => handleDeleteClick(selectedImage, e)}
                        >
                          <Trash2 className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Description */}
                  <div className="mb-4 lg:mb-6 flex-1 overflow-y-auto">
                    <p className="text-gray-700 leading-relaxed text-sm sm:text-base">{selectedImage.description}</p>
                  </div>
                  
                  {/* Stats Grid */}
                  <div className="mb-4 lg:mb-6">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 rounded-xl">
                      <div className="text-center">
                        <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-lg mx-auto mb-1">
                          <Eye className="w-4 h-4 text-blue-600" />
                        </div>
                        <p className="text-sm font-medium text-gray-900">{selectedImage.views}</p>
                        <p className="text-xs text-gray-500">Views</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center w-8 h-8 bg-pink-100 rounded-lg mx-auto mb-1">
                          <Heart className="w-4 h-4 text-pink-600" />
                        </div>
                        <p className="text-sm font-medium text-gray-900">{selectedImage.likes}</p>
                        <p className="text-xs text-gray-500">Likes</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-lg mx-auto mb-1">
                          <Calendar className="w-4 h-4 text-green-600" />
                        </div>
                        <p className="text-xs sm:text-sm font-medium text-gray-900">{formatDate(selectedImage.createdAt)}</p>
                        <p className="text-xs text-gray-500">Created</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center w-8 h-8 bg-purple-100 rounded-lg mx-auto mb-1">
                          <Tag className="w-4 h-4 text-purple-600" />
                        </div>
                        <p className="text-xs sm:text-sm font-medium text-gray-900 capitalize">{selectedImage.category}</p>
                        <p className="text-xs text-gray-500">Category</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 mt-auto">
                    <button 
                      className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 sm:px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 text-sm sm:text-base"
                      onClick={(e) => handleLike(selectedImage, e)}
                    >
                      <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>Like Project</span>
                    </button>
                    <button 
                      className="flex-1 bg-gray-100 text-gray-700 px-4 sm:px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
                      onClick={(e) => handleShare(selectedImage, e)}
                    >
                      <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>Share</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirm.show && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirm Delete</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete "{deleteConfirm.image?.title}"? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={cancelDelete}
                  className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Upload Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl sm:rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="p-6 sm:p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Upload New Image</h2>
                  <button
                    onClick={() => setShowUploadModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <form onSubmit={handleUploadSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Image File *
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                      required
                    />
                    {selectedFile && (
                      <p className="text-sm text-gray-500 mt-1">Selected: {selectedFile.name}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title *
                    </label>
                    <input
                      type="text"
                      value={uploadForm.title}
                      onChange={(e) => setUploadForm({...uploadForm, title: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={uploadForm.description}
                      onChange={(e) => setUploadForm({...uploadForm, description: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                      rows={3}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category *
                    </label>
                    <select
                      value={uploadForm.category}
                      onChange={(e) => setUploadForm({...uploadForm, category: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                      required
                    >
                      <option value="cleaning">Cleaning</option>
                      <option value="handyman">Handyman</option>
                      <option value="gardening">Gardening</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tags (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={uploadForm.tags}
                      onChange={(e) => setUploadForm({...uploadForm, tags: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                      placeholder="e.g., kitchen, renovation, before-after"
                    />
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="featured"
                      checked={uploadForm.featured}
                      onChange={(e) => setUploadForm({...uploadForm, featured: e.target.checked})}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                    <label htmlFor='featured' className="ml-2 text-sm text-gray-700">
                      Mark as featured
                    </label>
                  </div>
                  
                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowUploadModal(false)}
                      className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={uploading}
                      className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center"
                    >
                      {uploading ? (
                        <>
                          <Loader className="w-4 h-4 animate-spin mr-2" />
                          Uploading...
                        </>
                      ) : (
                        'Upload Image'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GalleryPage;