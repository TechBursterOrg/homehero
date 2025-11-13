import { useState, useEffect } from 'react';
import { 
  Images, 
  Heart, 
  Eye, 
  Calendar, 
  Trash2, 
  Plus, 
  X, 
  Search,
  Star,
  Loader,
  AlertCircle
} from 'lucide-react';

// Type definitions
interface GalleryImage {
  _id: string;
  title: string;
  description?: string;
  category: 'cleaning' | 'handyman' | 'gardening'| 'hair stylist' | 'plumbing' | 'electrical' | 'painting' | 'moving' | 'other'| 'barber' | 'carpentry'| 'pest control';
  featured: boolean;
  imageUrl?: string;
  fullImageUrl?: string;
  views?: number;
  likes?: number;
  createdAt: string;
}

interface UploadForm {
  title: string;
  description: string;
  category: 'cleaning' | 'handyman' | 'gardening'| 'hair stylist' | 'plumbing' | 'electrical' | 'painting' | 'moving' | 'other'| 'barber' | 'carpentry'| 'pest control';
  featured: boolean;
}

// API Configuration
const getApiBaseUrl = () => {
  const hostname = window.location.hostname;
  
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:3001';
  }
  
  return 'https://backendhomeheroes.onrender.com';
};

const API_BASE_URL = getApiBaseUrl();

const GalleryPage = () => {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadForm, setUploadForm] = useState<UploadForm>({
    title: '',
    description: '',
    category: 'cleaning',
    featured: false
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);

  useEffect(() => {
    fetchGalleryImages();
  }, [selectedCategory, searchTerm]);

  const fetchGalleryImages = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      
      const params = new URLSearchParams({ 
        page: '1', 
        limit: '50' 
      });
      
      if (selectedCategory !== 'all') {
        params.append('category', selectedCategory);
      }
      
      if (searchTerm) {
        params.append('search', searchTerm);
      }
      
      const response = await fetch(`${API_BASE_URL}/api/gallery?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      
      console.log('📦 API Response:', data);
      
      if (data.success) {
        const images = data.data.docs || [];
        console.log('📸 Total images fetched:', images.length);
        
        if (images.length > 0) {
          console.log('🔍 First image structure:', images[0]);
          console.log('🔍 Image fields:', Object.keys(images[0]));
        }
        
        setGalleryImages(images);
      } else {
        setError('Failed to fetch gallery images');
      }
    } catch (error) {
      console.error('Error fetching gallery:', error);
      setError('Cannot connect to server at ' + API_BASE_URL);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (image: any): string | null => {
    if (!image) return null;
    
    console.log('🖼️ Getting URL for image:', {
      id: image._id,
      fields: Object.keys(image)
    });
    
    // Try multiple possible field names from the backend
    const possibleUrls = [
      image.fullImageUrl,
      image.imageUrl,
      image.url,
      image.gcsUrl,
      image.publicUrl,
      image.filePath
    ];
    
    for (const url of possibleUrls) {
      if (url) {
        console.log('✅ Found URL:', url);
        // If it's a full URL, return it directly
        if (url.startsWith('http')) {
          return url;
        }
        // If it's a relative path, prepend the API base URL
        return `${API_BASE_URL}${url}`;
      }
    }
    
    console.warn('❌ No image URL found in image object:', image);
    return null;
  };

  const createPlaceholderImage = (text: string): string => {
    const svg = `
      <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#e2e8f0"/>
        <text x="50%" y="50%" font-family="Arial" font-size="16" fill="#64748b" text-anchor="middle" dy=".3em">${text}</text>
      </svg>
    `;
    return 'data:image/svg+xml;base64,' + btoa(svg);
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>, image: any) => {
    const target = e.currentTarget;
    
    console.error('❌ Image failed to load:', {
      src: target.src,
      imageId: image._id,
      title: image.title,
      fullImageUrl: image.fullImageUrl,
      imageUrl: image.imageUrl
    });
    
    if (target.src.includes('data:image/svg')) {
      return;
    }
    
    // Try fullImageUrl if we haven't already
    if (image.fullImageUrl && target.src !== image.fullImageUrl) {
      console.log('🔄 Trying fullImageUrl:', image.fullImageUrl);
      target.src = image.fullImageUrl;
      return;
    }
    
    // Try imageUrl with API base URL if it's not a full URL
    if (image.imageUrl && !image.imageUrl.startsWith('http')) {
      const altUrl = `${API_BASE_URL}${image.imageUrl}`;
      if (target.src !== altUrl) {
        console.log('🔄 Trying imageUrl with API base:', altUrl);
        target.src = altUrl;
        return;
      }
    }
    
    console.log('⚠️ All attempts failed, showing placeholder');
    target.src = createPlaceholderImage(image.title || 'Image Not Found');
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }
    
    setSelectedFile(file);
    setError(null);
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setFilePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile) {
      setError('Please select an image file');
      return;
    }

    if (!uploadForm.title.trim()) {
      setError('Please enter a title');
      return;
    }

    try {
      setUploading(true);
      setError(null);
      
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      
      const formData = new FormData();
      formData.append('image', selectedFile);
      formData.append('title', uploadForm.title.trim());
      formData.append('description', uploadForm.description.trim());
      formData.append('category', uploadForm.category);
      formData.append('featured', uploadForm.featured.toString());

      const response = await fetch(`${API_BASE_URL}/api/gallery/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        setShowUploadModal(false);
        setUploadForm({
          title: '',
          description: '',
          category: 'cleaning',
          featured: false
        });
        setSelectedFile(null);
        setFilePreview(null);
        fetchGalleryImages();
      } else {
        setError(data.message || 'Upload failed');
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError('Upload failed: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setUploading(false);
    }
  };

  const handleLike = async (image: GalleryImage, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      await fetch(`${API_BASE_URL}/api/gallery/${image._id}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      fetchGalleryImages();
    } catch (error) {
      console.error('Like error:', error);
    }
  };

  const handleDelete = async (image: GalleryImage, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!confirm('Are you sure you want to delete this image?')) {
      return;
    }
    
    try {
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      await fetch(`${API_BASE_URL}/api/gallery/${image._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      fetchGalleryImages();
    } catch (error) {
      console.error('Delete error:', error);
      setError('Failed to delete image');
    }
  };

  const categories = [
    { id: 'all', name: 'All Projects', count: galleryImages.length },
    { id: 'cleaning', name: 'Cleaning', count: galleryImages.filter(i => i.category === 'cleaning').length },
    { id: 'handyman', name: 'Handyman', count: galleryImages.filter(i => i.category === 'handyman').length },
    { id: 'gardening', name: 'Gardening', count: galleryImages.filter(i => i.category === 'gardening').length }
    
  ];

  const filteredImages = galleryImages.filter(image => {
    const matchesCategory = selectedCategory === 'all' || image.category === selectedCategory;
    const matchesSearch = !searchTerm || 
      image.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (image.description && image.description.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading gallery...</p>
          <p className="text-sm text-gray-500 mt-2">{API_BASE_URL}</p>
        </div>
      </div>
    );
  }

  if (error && error.includes('Cannot connect')) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-4">
          <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Connection Error</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button onClick={fetchGalleryImages} className="bg-blue-600 text-white px-6 py-3 rounded-lg">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        <div className="mb-8 flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center">
            <Images className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Project Gallery</h1>
            <p className="text-gray-600">Professional work showcase</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-6 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button onClick={() => setShowUploadModal(true)} className="bg-blue-600 text-white px-6 py-4 rounded-2xl hover:bg-blue-700 flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Add Image
            </button>
          </div>

          {/* <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-3 rounded-xl font-medium ${
                  selectedCategory === category.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {category.name} ({category.count})
              </button>
            ))}
          </div> */}
        </div>

        <div className="bg-white rounded-3xl shadow-sm p-6">
          {filteredImages.length === 0 ? (
            <div className="text-center py-12">
              <Images className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No images found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredImages.map((image) => (
                <div key={image._id} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer" onClick={() => setSelectedImage(image)}>
                  <div className="aspect-[4/3] overflow-hidden relative">
                    <img
                      src={getImageUrl(image) || ''}
                      alt={image.title}
                      onError={(e) => handleImageError(e, image)}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                      loading="lazy"
                    />
                    
                    {image.featured && (
                      <div className="absolute top-3 right-3 bg-yellow-400 text-white px-2 py-1 rounded-lg text-xs flex items-center gap-1">
                        <Star className="w-3 h-3 fill-current" />
                        Featured
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="flex gap-2">
                        <button className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center" onClick={(e) => {e.stopPropagation(); setSelectedImage(image);}}>
                          <Eye className="w-5 h-5 text-white" />
                        </button>
                        <button className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center" onClick={(e) => handleLike(image, e)}>
                          <Heart className="w-5 h-5 text-white" />
                        </button>
                        <button className="w-10 h-10 bg-red-500/80 rounded-full flex items-center justify-center" onClick={(e) => handleDelete(image, e)}>
                          <Trash2 className="w-4 h-4 text-white" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="font-bold line-clamp-1">{image.title}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2 mt-1">{image.description}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500 mt-3">
                      <div className="flex gap-4">
                        <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{image.views || 0}</span>
                        <span className="flex items-center gap-1"><Heart className="w-3 h-3" />{image.likes || 0}</span>
                      </div>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(image.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {showUploadModal && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-2xl w-full p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Upload Image</h2>
                <button onClick={() => setShowUploadModal(false)}><X className="w-5 h-5" /></button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block mb-2">Image File *</label>
                  <input type="file" accept="image/*" onChange={handleFileSelect} className="w-full p-3 border rounded-lg" />
                  {filePreview && <img src={filePreview} alt="Preview" className="mt-2 w-full h-48 object-cover rounded-lg" />}
                </div>
                
                <div>
                  <label className="block mb-2">Title *</label>
                  <input type="text" value={uploadForm.title} onChange={(e) => setUploadForm({...uploadForm, title: e.target.value})} className="w-full p-3 border rounded-lg" />
                </div>
                
                <div>
                  <label className="block mb-2">Description</label>
                  <textarea value={uploadForm.description} onChange={(e) => setUploadForm({...uploadForm, description: e.target.value})} className="w-full p-3 border rounded-lg" rows={4} />
                </div>
                
                <div>
                  <label className="block mb-2">Category *</label>
                  <select value={uploadForm.category} onChange={(e) => setUploadForm({...uploadForm, category: e.target.value as 'cleaning' | 'handyman' | 'gardening'})} className="w-full p-3 border rounded-lg">
                    <option value="cleaning">Cleaning</option>
                    <option value="handyman">Handyman</option>
                    <option value="gardening">Gardening</option>
                     <option value="gardening">Hair stylist</option>
                      <option value="gardening">Barber</option>
                       <option value="gardening">Chef</option>
                    <option value="plumbing">Plumbing</option>
                    <option value="electrical">Electrical</option>
                    <option value="painting">Painting</option>
                    <option value="carpentry">Carpentry</option>
                    <option value="pest control">Pest Control</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                {error && <div className="bg-red-100 text-red-700 p-3 rounded-lg">{error}</div>}
                
                <div className="flex gap-3">
                  <button onClick={() => setShowUploadModal(false)} className="flex-1 bg-gray-200 px-6 py-3 rounded-lg">Cancel</button>
                  <button onClick={handleUploadSubmit} disabled={uploading} className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg disabled:opacity-50">
                    {uploading ? 'Uploading...' : 'Upload'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedImage && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-6xl w-full flex flex-col lg:flex-row">
              <div className="flex-1 relative">
                <button onClick={() => setSelectedImage(null)} className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/40 rounded-full flex items-center justify-center text-white">
                  <X className="w-5 h-5" />
                </button>
                <img src={getImageUrl(selectedImage) || ''} alt={selectedImage.title} onError={(e) => handleImageError(e, selectedImage)} className="w-full h-full object-cover rounded-t-3xl lg:rounded-l-3xl lg:rounded-tr-none" />
              </div>
              <div className="flex-1 p-8">
                <h2 className="text-2xl font-bold mb-4">{selectedImage.title}</h2>
                <p className="text-gray-700 mb-6">{selectedImage.description}</p>
                <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl">
                  <div className="text-center">
                    <Eye className="w-5 h-5 mx-auto mb-1 text-blue-600" />
                    <p className="font-medium">{selectedImage.views || 0}</p>
                    <p className="text-xs text-gray-500">Views</p>
                  </div>
                  <div className="text-center">
                    <Heart className="w-5 h-5 mx-auto mb-1 text-pink-600" />
                    <p className="font-medium">{selectedImage.likes || 0}</p>
                    <p className="text-xs text-gray-500">Likes</p>
                  </div>
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