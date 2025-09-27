// types/verification.ts
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