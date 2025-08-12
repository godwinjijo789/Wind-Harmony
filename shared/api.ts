/**
 * Shared code between client and server
 * Types and interfaces for two-tier architecture
 */

// User Management
export interface User {
  id: string;
  email: string;
  name: string;
  licenseType: "free" | "trial" | "professional" | "enterprise";
  expiryDate: string;
  status: "active" | "expired" | "suspended";
  isAdmin: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthRequest {
  email: string;
  password: string;
  name?: string;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  token?: string;
  message?: string;
}

// Project Management
export interface Project {
  id: string;
  userId: string;
  name: string;
  description?: string;
  tracks: number;
  duration: string;
  genre: string;
  collaborators: number;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectRequest {
  name: string;
  description?: string;
  genre?: string;
  isPublic?: boolean;
}

// Music Composition
export interface MusicLayer {
  id: string;
  projectId: string;
  instrument: string;
  track: string[];
  volume: number;
  muted: boolean;
  solo: boolean;
  createdAt: string;
}

export interface CompositionSettings {
  defaultKey: string;
  timeSignature: string;
  tempo: number;
  metronomeSound: string;
  autoHarmonize: boolean;
  scaleSnapping: boolean;
  chordSuggestions: boolean;
}

// Feedback System
export interface Feedback {
  id: string;
  userId?: string;
  email: string;
  category: string;
  message: string;
  rating: number;
  source: string;
  wouldRecommend: boolean;
  status: "pending" | "reviewed" | "resolved";
  createdAt: string;
  updatedAt: string;
}

export interface FeedbackRequest {
  email: string;
  category: string;
  message: string;
  rating?: number;
  source?: string;
  wouldRecommend?: boolean;
}

// Payment System
export interface Payment {
  id: string;
  userId: string;
  transactionId: string;
  plan: "professional" | "enterprise";
  amount: number;
  paymentMethod: string;
  status: "pending" | "completed" | "failed" | "refunded";
  refundAmount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentRequest {
  plan: "professional" | "enterprise";
  paymentMethod: string;
  amount: number;
}

// Admin Management
export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalProjects: number;
  totalRevenue: number;
  pendingPayments: number;
  totalFeedback: number;
}

export interface BankDetails {
  accountName: string;
  accountNumber: string;
  routingNumber: string;
  bankName: string;
  swiftCode: string;
  isActive: boolean;
}

export interface PaymentMethods {
  paytm: {
    merchantId: string;
    phoneNumber: string;
    isActive: boolean;
  };
  upi: {
    upiId: string;
    qrCode: string;
    isActive: boolean;
  };
  crypto: {
    bitcoinAddress: string;
    ethereumAddress: string;
    isActive: boolean;
  };
  netBanking: {
    supportedBanks: string[];
    isActive: boolean;
  };
}

// Terms and Conditions
export interface TermsSection {
  id: string;
  title: string;
  content: string;
  lastUpdated: string;
}

export interface TermsContent {
  effectiveDate: string;
  sections: TermsSection[];
}

// Generic API Response
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  timestamp: string;
}

// Demo Response (existing)
export interface DemoResponse {
  message: string;
}

// Pagination
export interface PaginationRequest {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}
