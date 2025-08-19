import React from 'react';
import { Sparkles, ArrowRight, Heart, Star, MapPin } from 'lucide-react';
import ProviderCard from '../customercomponents/ProviderCard';
import { providers } from '../data/mockData';

interface FavoritesPageProps {
  favorites: string[];
  onToggleFavorite: (providerId: string) => void;
  onBook: (provider: any) => void;
  onMessage: (provider: any) => void;
  onCall: (provider: any) => void;
}

const FavoritesPage: React.FC<FavoritesPageProps> = ({ 
  favorites, 
  onToggleFavorite,
  onBook,
  onMessage,
  onCall
}) => {
  const favoriteProviders = providers.filter(p => favorites.includes(p.id));

  return (
    <div className="space-y-8">
      {/* Enhanced Header Section with Background */}
      <div className="relative overflow-hidden bg-gradient-to-br from-rose-50 via-pink-50 to-red-50 rounded-3xl p-8">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-rose-400 to-pink-600 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-pink-400 to-red-600 rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2"></div>
        </div>
        
        <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Heart className="w-6 h-6 text-white fill-current" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-rose-800 to-pink-800 bg-clip-text text-transparent">
                Favorite Providers
              </h1>
            </div>
            <p className="text-gray-700 text-lg font-medium max-w-md">
              Your saved service providers for easy access and quick booking
            </p>
          </div>
          
          {favoriteProviders.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-3">
              <button className="group bg-white/80 backdrop-blur-sm border border-white/50 text-gray-700 px-6 py-3 rounded-2xl hover:bg-white hover:shadow-xl transition-all duration-300 flex items-center space-x-2 font-semibold">
                <MapPin className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                <span>View on Map</span>
              </button>
              
              <button className="group bg-gradient-to-r from-rose-500 via-pink-600 to-red-600 text-white px-8 py-3 rounded-2xl hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center space-x-2 font-semibold shadow-lg">
                <Star className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                <span>Sort by Rating</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {favoriteProviders.length > 0 ? (
        <>
          {/* Stats Section */}
          {/* <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-6 border border-rose-100">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-pink-600 rounded-xl flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white fill-current" />
                </div>
                <span className="text-2xl font-bold text-rose-600">{favoriteProviders.length}</span>
              </div>
              <h3 className="font-semibold text-gray-900">Total Favorites</h3>
              <p className="text-sm text-gray-600">Saved providers</p>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl p-6 border border-amber-100">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-xl flex items-center justify-center">
                  <Star className="w-5 h-5 text-white fill-current" />
                </div>
                <span className="text-2xl font-bold text-amber-600">
                  {(favoriteProviders.reduce((acc, p) => acc + p.rating, 0) / favoriteProviders.length).toFixed(1)}
                </span>
              </div>
              <h3 className="font-semibold text-gray-900">Avg Rating</h3>
              <p className="text-sm text-gray-600">Of favorites</p>
            </div>

            <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-6 border border-emerald-100">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="text-2xl font-bold text-emerald-600">
                  {favoriteProviders.filter(p => p.isAvailableNow).length}
                </span>
              </div>
              <h3 className="font-semibold text-gray-900">Available Now</h3>
              <p className="text-sm text-gray-600">Ready to serve</p>
            </div>
          </div> */}

          {/* Providers Grid */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                Your Favorite Providers
              </h2>
              <div className="flex items-center gap-3">
                <select className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-rose-500">
                  <option>All Services</option>
                  <option>Plumbing</option>
                  <option>Cleaning</option>
                  <option>Electrical</option>
                  <option>Gardening</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {favoriteProviders.map((provider, index) => (
                <div
                  key={provider.id}
                  className="animate-in fade-in slide-in-from-bottom-4 duration-700"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <ProviderCard
                    provider={provider}
                    serviceType="immediate" // Fixed: using valid ServiceType
                    onBook={onBook}
                    onToggleFavorite={onToggleFavorite}
                    onMessage={onMessage}
                    onCall={onCall}
                    isFavorite={true}
                  />
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-16">
          <div className="relative">
            <div className="w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
              <Heart className="w-16 h-16 text-gray-400" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-rose-400 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
          </div>
          
          <h3 className="text-2xl font-bold text-gray-900 mb-3">No favorites yet</h3>
          <p className="text-gray-600 mb-8 max-w-md mx-auto text-lg">
            Save providers you like to easily find them later. Look for the heart icon on any provider card.
          </p>
          
          <div className="space-y-4">
            <button className="bg-gradient-to-r from-rose-500 to-pink-600 text-white px-8 py-4 rounded-2xl hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center mx-auto space-x-3 text-lg font-semibold">
              <ArrowRight className="w-5 h-5" />
              <span>Browse Services</span>
            </button>
            
            <p className="text-sm text-gray-500">
              Tip: Click the ❤️ on any provider to add them to your favorites
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;