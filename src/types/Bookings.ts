export interface Booking {
  _id?: string;
  id?: string;
  providerId: string;
  providerName: string;
  providerEmail: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  serviceType: string;
  description: string;
  location: string;
  timeframe: string;
  budget: string | number;
  specialRequests: string;
  bookingType: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  requestedAt: string | Date;
  acceptedAt?: string | Date;
  completedAt?: string | Date;
  updatedAt?: string | Date;
  rating?: number; // Add this
  ratingStatus?: { // Add this
    customerRated: boolean;
    providerRated: boolean;
  };
}