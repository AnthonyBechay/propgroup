// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// User types
export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  country?: string;
  role: 'USER' | 'AGENT' | 'ADMIN' | 'SUPER_ADMIN';
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

// Property types
export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  propertyType: 'APARTMENT' | 'VILLA' | 'TOWNHOUSE' | 'PENTHOUSE' | 'STUDIO' | 'DUPLEX' | 'LAND' | 'COMMERCIAL' | 'OFFICE';
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  areaUnit?: string;
  location: string;
  city: string;
  state: string;
  country: string;
  zipCode?: string;
  latitude?: number;
  longitude?: number;
  images?: string[];
  features?: string[];
  amenities?: string[];
  nearbyFacilities?: string;
  yearBuilt?: number;
  parkingSpaces?: number;
  views: number;
  isActive: boolean;
  isFeatured: boolean;
  agentId?: string;
  agent?: User;
  createdAt: string;
  updatedAt: string;
  _count?: {
    propertyInquiries?: number;
    favoriteProperties?: number;
  };
  favoriteProperties?: any[];
}

// Portfolio types
export interface OwnedProperty {
  id: string;
  customName: string;
  purchasePrice: number;
  purchaseDate: string;
  initialMortgage?: number;
  currentRent?: number;
  notes?: string;
  propertyId?: string;
  property?: Property;
  userId: string;
  user?: User;
  createdAt: string;
  updatedAt: string;
}

// Inquiry types
export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message?: string;
  propertyId?: string;
  property?: Property;
  userId?: string;
  user?: User;
  status: 'PENDING' | 'CONTACTED' | 'INTERESTED' | 'NOT_INTERESTED';
  createdAt: string;
  updatedAt: string;
}

// Dashboard stats types
export interface DashboardStats {
  totalProperties: number;
  totalInquiries: number;
  totalViews: number;
  estimatedCommission: number;
  recentInquiries: Inquiry[];
  topProperties: Property[];
}

export interface AgentDashboardStats {
  totalProperties: number;
  totalInquiries: number;
  totalViews: number;
  estimatedCommission: number;
  recentInquiries: Inquiry[];
  topProperties: Property[];
}

export interface AdminDashboardStats {
  totalUsers: number;
  totalProperties: number;
  totalInquiries: number;
  totalRevenue: number;
  recentProperties: Property[];
  recentUsers: User[];
}

// Form validation types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface SignupFormData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
}

export interface ContactFormData {
  email: string;
  name: string;
  phone?: string;
  propertyId?: string;
  message?: string;
}

export interface ProfileFormData {
  firstName: string;
  lastName: string;
  phone?: string;
  country?: string;
}

export interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface PropertyFormData {
  title: string;
  description: string;
  price: number;
  currency: string;
  propertyType: 'APARTMENT' | 'VILLA' | 'TOWNHOUSE' | 'PENTHOUSE' | 'STUDIO' | 'DUPLEX' | 'LAND' | 'COMMERCIAL' | 'OFFICE';
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  areaUnit?: string;
  location: string;
  city: string;
  state: string;
  country: string;
  zipCode?: string;
  latitude?: number;
  longitude?: number;
  images?: string[];
  features?: string[];
  amenities?: string[];
  nearbyFacilities?: string;
  yearBuilt?: number;
  parkingSpaces?: number;
  isActive?: boolean;
  isFeatured?: boolean;
}

export interface PortfolioFormData {
  customName: string;
  purchasePrice: number;
  purchaseDate: string;
  initialMortgage?: number;
  currentRent?: number;
  notes?: string;
  propertyId?: string;
}

export interface InviteAdminFormData {
  email: string;
  role: 'ADMIN' | 'SUPER_ADMIN';
}

// Calculator types
export interface CalculatorFormData {
  downPaymentPercent: number;
  interestRate: number;
  loanTermYears: number;
  propertyPrice: number;
}
