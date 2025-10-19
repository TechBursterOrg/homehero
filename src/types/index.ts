export interface Service {
  id: string;
  name: string;
  description: string;
  icon: string;
  averagePrice: string;
  providers: number;
}


// In your types.ts file
export interface Provider {
  _id?: string;
  id: string;
  name: string;
  email: string;
  services: string[];
  hourlyRate: number;
  averageRating?: number;
  city: string;
  state: string;
  country: string;
  profileImage?: string;
  profilePicture?: string;
  isAvailableNow: boolean;
  experience: string;
  distance?: number;
  phoneNumber?: string;
  address?: string;
  rating?: number;
  reviewCount?: number;
  location?: string;
  priceRange?: string;
  coordinates?: [number, number];
  responseTime?: string;
  isVerified?: boolean;
  isTopRated?: boolean;
  completedJobs?: number;
  avatar?: string;
}
export interface Booking {
  id: string;
  service: string;
  description: string;
  date: string;
  time: string;
  location: string;
  price: string;
  status: 'completed' | 'cancelled' | 'upcoming' | 'in-progress';
  provider: string;
  customer: string;
  specialRequests: string;
  timeframe: string;
  rating?: number; // Add this
  ratingStatus?: { // Add this
    customerRated: boolean;
    providerRated: boolean;
  };
}

export interface IdentityVerification {
  nin: string;
  nepaBillUrl?: string;
  isNinVerified: boolean;
  isNepaVerified: boolean;
  verificationStatus: 'unverified' | 'pending' | 'verified' | 'rejected';
  verificationSubmittedAt?: Date;
  verificationReviewedAt?: Date;
  verificationNotes?: string;
}

export interface UserVerification {
  isNinVerified: boolean;
  isNepaVerified: boolean;
  verificationStatus: string;
  hasSubmittedVerification: boolean;
}

export interface JobPost {
  id: string;
  title: string;
  description: string;
  budget: string;
  duration: string;
  proposals: number;
  status: 'open' | 'in-progress' | 'completed';
  datePosted: string;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  address: string;
  bio: string;
  avatar: string | null;
  role?: string;
}


export interface LocationData {
  address: string;
  coordinates: [number, number];
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'image' | 'file';
  status: 'sent' | 'delivered' | 'read';
}

export interface Conversation {
  id: string;
  providerId: string;
  providerName: string;
  providerAvatar: string;
  providerService: string;
  lastMessage: Message;
  unreadCount: number;
  isOnline: boolean;
  lastSeen?: Date;
}

export interface ChatState {
  conversations: Conversation[];
  activeConversation: string | null;
  messages: { [conversationId: string]: Message[] };
}

export type ServiceType = 'immediate' | 'long-term';
export type ActiveTab = 'services' | 'bookings' | 'jobs' | 'favorites' | 'profile' | 'messages';