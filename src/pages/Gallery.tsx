import React, { useState } from 'react';
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
  Award
} from 'lucide-react';

interface GalleryImage {
  id: number;
  url: string;
  title: string;
  category: string;
  description: string;
  date: string;
  views?: number;
  likes?: number;
  featured?: boolean;
}

const GalleryPage: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const galleryImages: GalleryImage[] = [
    {
      id: 1,
      url: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&h=600&fit=crop',
      title: 'Modern Kitchen Deep Clean',
      category: 'cleaning',
      description: 'Complete deep cleaning of a modern kitchen including appliances and countertops. Used specialized cleaning products to restore the kitchen to pristine condition.',
      date: '2024-08-15',
      views: 124,
      likes: 18,
      featured: true
    },
    {
      id: 2,
      url: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&h=600&fit=crop',
      title: 'Luxury Bathroom Renovation',
      category: 'handyman',
      description: 'Full bathroom renovation including plumbing, tiling, and fixture installation. Transformed an outdated bathroom into a modern luxury space.',
      date: '2024-08-10',
      views: 89,
      likes: 22,
      featured: true
    },
    {
      id: 3,
      url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop',
      title: 'Living Room Transformation',
      category: 'cleaning',
      description: 'Professional cleaning and organization of spacious living area. Deep cleaned carpets, furniture, and all surfaces for a fresh new look.',
      date: '2024-08-08',
      views: 156,
      likes: 31
    },
    {
      id: 4,
      url: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800&h=600&fit=crop',
      title: 'Garden Landscape Design',
      category: 'gardening',
      description: 'Complete garden makeover with new plantings and landscaping. Created a beautiful outdoor space with seasonal flowers and plants.',
      date: '2024-08-05',
      views: 203,
      likes: 45,
      featured: true
    },
    {
      id: 5,
      url: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=800&h=600&fit=crop',
      title: 'Kitchen Plumbing Repair',
      category: 'handyman',
      description: 'Professional sink and faucet installation with new plumbing. Fixed leaks and upgraded to modern, efficient fixtures.',
      date: '2024-07-30',
      views: 78,
      likes: 12
    },
    {
      id: 6,
      url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop',
      title: 'Bedroom Deep Clean',
      category: 'cleaning',
      description: 'Thorough cleaning and sanitizing of master bedroom. Organized closets and cleaned all surfaces for a peaceful environment.',
      date: '2024-07-28',
      views: 95,
      likes: 16
    },
    {
      id: 7,
      url: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=600&fit=crop',
      title: 'Backyard Garden Maintenance',
      category: 'gardening',
      description: 'Regular maintenance and pruning of backyard garden. Kept the garden healthy and beautiful throughout the growing season.',
      date: '2024-07-25',
      views: 167,
      likes: 28
    },
    {
      id: 8,
      url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
      title: 'Interior Painting Project',
      category: 'handyman',
      description: 'Professional interior painting of multiple rooms. Used premium paint and techniques for a flawless finish.',
      date: '2024-07-20',
      views: 143,
      likes: 25
    },
    {
      id: 9,
      url: 'https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?w=800&h=600&fit=crop',
      title: 'Professional House Cleaning',
      category: 'cleaning',
      description: 'Complete residential cleaning service including vacuuming, dusting, and sanitizing. Left the home spotless and fresh.',
      date: '2024-07-18',
      views: 112,
      likes: 19
    },
    {
      id: 10,
      url: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&h=600&fit=crop',
      title: 'Deck Restoration',
      category: 'handyman',
      description: 'Full deck restoration including sanding, staining, and repair work. Brought an old deck back to life with proper treatment.',
      date: '2024-07-12',
      views: 198,
      likes: 34
    },
    {
      id: 11,
      url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
      title: 'Office Deep Clean',
      category: 'cleaning',
      description: 'Professional office cleaning and organization service. Sanitized workstations, meeting rooms, and common areas for a healthy workplace.',
      date: '2024-07-10',
      views: 87,
      likes: 14
    },
    {
      id: 12,
      url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop',
      title: 'Bathroom Tile Cleaning',
      category: 'cleaning',
      description: 'Deep cleaning and restoration of bathroom tiles and grout. Removed years of buildup to reveal like-new surfaces.',
      date: '2024-07-08',
      views: 134,
      likes: 21
    },
    {
      id: 13,
      url: 'https://images.unsplash.com/photo-1503387837-b154d5074bd2?w=800&h=600&fit=crop',
      title: 'Kitchen Cabinet Painting',
      category: 'handyman',
      description: 'Professional kitchen cabinet refinishing project. Transformed old cabinets with high-quality paint and new hardware.',
      date: '2024-07-05',
      views: 176,
      likes: 29
    },
    {
      id: 14,
      url: 'https://images.unsplash.com/photo-1585128792020-803d29415281?w=800&h=600&fit=crop',
      title: 'Garden Bed Preparation',
      category: 'gardening',
      description: 'Prepared new garden beds with proper soil amendments and drainage. Ready for seasonal plantings and landscaping.',
      date: '2024-07-03',
      views: 145,
      likes: 26
    },
    {
      id: 15,
      url: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=800&h=600&fit=crop',
      title: 'Ceiling Fan Installation',
      category: 'handyman',
      description: 'Professional ceiling fan installation with proper electrical connections. Improved air circulation and energy efficiency.',
      date: '2024-06-30',
      views: 92,
      likes: 15
    }
  ];

  const categories = [
    { id: 'all', name: 'All Projects', count: galleryImages.length, color: 'from-gray-500 to-gray-600' },
    { id: 'cleaning', name: 'Cleaning', count: galleryImages.filter(img => img.category === 'cleaning').length, color: 'from-blue-500 to-blue-600' },
    { id: 'handyman', name: 'Handyman', count: galleryImages.filter(img => img.category === 'handyman').length, color: 'from-purple-500 to-purple-600' },
    { id: 'gardening', name: 'Gardening', count: galleryImages.filter(img => img.category === 'gardening').length, color: 'from-green-500 to-green-600' }
  ];

  const filteredImages = galleryImages.filter(image => {
    const matchesCategory = selectedCategory === 'all' || image.category === selectedCategory;
    const matchesSearch = image.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         image.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredImages = galleryImages.filter(img => img.featured);
  const totalViews = galleryImages.reduce((sum, img) => sum + (img.views || 0), 0);
  const totalLikes = galleryImages.reduce((sum, img) => sum + (img.likes || 0), 0);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    target.src = 'https://via.placeholder.com/400x400/e2e8f0/64748b?text=Image';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const handleImageClick = (image: GalleryImage) => {
    setSelectedImage(image);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-8">
        
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col space-y-4 sm:space-y-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <button className="w-10 h-10 sm:w-12 sm:h-12 bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-gray-200 flex items-center justify-center hover:bg-white transition-colors shadow-sm">
                <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
              </button>
              <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl sm:rounded-2xl lg:rounded-3xl flex items-center justify-center shadow-lg flex-shrink-0">
                <Images className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-lg sm:text-xl lg:text-3xl xl:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Project Gallery 📸
                </h1>
                <p className="text-gray-600 text-xs sm:text-sm lg:text-base xl:text-lg mt-1">
                  Showcase of professional work and completed projects
                </p>
              </div>
            </div>
          </div>
        </div>

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
            <button className="w-full lg:w-auto bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-semibold transition-all duration-200 hover:scale-105 hover:shadow-xl shadow-lg shadow-blue-200 flex items-center justify-center gap-2 sm:gap-3 text-sm sm:text-base">
              <div className="w-5 h-5 sm:w-6 sm:h-6 bg-white/20 rounded-md sm:rounded-lg flex items-center justify-center">
                <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
              </div>
              <span>Add Project</span>
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

        {/* Gallery Grid */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 sm:p-6 lg:p-8">
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {filteredImages.map((image) => (
                  <div
                    key={image.id}
                    className="group relative bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 cursor-pointer"
                    onClick={() => handleImageClick(image)}
                  >
                    <div className="aspect-[4/3] overflow-hidden">
                      <img
                        src={image.url}
                        alt={image.title}
                        onError={handleImageError}
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
                        <button className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
                          <Eye className="w-5 h-5 text-white" />
                        </button>
                        <button className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
                          <Heart className="w-5 h-5 text-white" />
                        </button>
                        <button className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
                          <Share2 className="w-5 h-5 text-white" />
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
                          <span>{formatDate(image.date)}</span>
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
                    key={image.id}
                    className="group flex gap-4 sm:gap-6 bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 cursor-pointer"
                    onClick={() => handleImageClick(image)}
                  >
                    <div className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 rounded-xl sm:rounded-2xl overflow-hidden flex-shrink-0">
                      <img
                        src={image.url}
                        alt={image.title}
                        onError={handleImageError}
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
                            <span>{formatDate(image.date)}</span>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <Edit3 className="w-4 h-4 text-gray-600" />
                          </button>
                          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <Share2 className="w-4 h-4 text-gray-600" />
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
                <button className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors">
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Image Modal */}
        {selectedImage && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl sm:rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
              <div className="relative">
                <button
                  onClick={closeModal}
                  className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/40 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
                
                <div className="aspect-[4/3] max-h-[60vh] overflow-hidden">
                  <img
                    src={selectedImage.url}
                    alt={selectedImage.title}
                    onError={handleImageError}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              
              <div className="p-6 sm:p-8">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{selectedImage.title}</h2>
                      {selectedImage.featured && (
                        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-lg flex items-center gap-1 text-sm font-medium">
                          <Star className="w-4 h-4 fill-current" />
                          <span>Featured</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-1 mb-3">
                      <Tag className="w-4 h-4 text-blue-500" />
                      <span className="text-blue-600 font-medium capitalize">{selectedImage.category}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button className="p-3 hover:bg-gray-100 rounded-xl transition-colors">
                      <Download className="w-5 h-5 text-gray-600" />
                    </button>
                    <button className="p-3 hover:bg-gray-100 rounded-xl transition-colors">
                      <Share2 className="w-5 h-5 text-gray-600" />
                    </button>
                    <button className="p-3 hover:bg-gray-100 rounded-xl transition-colors">
                      <Edit3 className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                </div>
                
                <p className="text-gray-700 leading-relaxed mb-6">{selectedImage.description}</p>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-xl">
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
                    <p className="text-sm font-medium text-gray-900">{formatDate(selectedImage.date)}</p>
                    <p className="text-xs text-gray-500">Created</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center w-8 h-8 bg-purple-100 rounded-lg mx-auto mb-1">
                      <Tag className="w-4 h-4 text-purple-600" />
                    </div>
                    <p className="text-sm font-medium text-gray-900 capitalize">{selectedImage.category}</p>
                    <p className="text-xs text-gray-500">Category</p>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 mt-6">
                  <button className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2">
                    <Heart className="w-5 h-5" />
                    <span>Like Project</span>
                  </button>
                  <button className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                    <Share2 className="w-5 h-5" />
                    <span>Share</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GalleryPage;