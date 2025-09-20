import { Request } from 'express';
import { User } from '@prisma/client';

// Extend Express Request type to include user
export interface AuthenticatedRequest extends Request {
  user?: User;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Auth types
export interface LoginRequest {
  loginId: string;
  password: string;
}

export interface SignupRequest {
  loginId: string;
  email: string;
  password: string;
  name?: string;
  role?: 'ADMIN' | 'MANAGER' | 'OPERATOR' | 'INVENTORY';
  department?: string;
  phone?: string;
}

export interface AuthResponse {
  user: Omit<User, 'password'>;
  token: string;
  refreshToken: string;
}

// Manufacturing Order types
export interface CreateManufacturingOrderRequest {
  item: string;
  productId: string;
  quantity: number;
  deadline: string;
  assignee?: string;
  notes?: string;
}

export interface UpdateManufacturingOrderRequest {
  item?: string;
  productId?: string;
  quantity?: number;
  status?: 'PLANNED' | 'IN_PROGRESS' | 'DONE' | 'CANCELED';
  deadline?: string;
  progress?: number;
  assignee?: string;
  notes?: string;
}

// Work Order types
export interface CreateWorkOrderRequest {
  manufacturingOrderId: string;
  item: string;
  operation: string;
  assignedTo?: string;
  estimatedHours: number;
}

export interface UpdateWorkOrderRequest {
  item?: string;
  operation?: string;
  assignedTo?: string;
  status?: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'ON_HOLD';
  estimatedHours?: number;
  actualHours?: number;
}

// BOM types
export interface CreateBOMRequest {
  productName: string;
  productCode: string;
  components: CreateBOMComponentRequest[];
}

export interface CreateBOMComponentRequest {
  productId: string;
  quantity: number;
  unit: string;
  operation: string;
}

// Stock Movement types
export interface CreateStockMovementRequest {
  productId: string;
  type: 'IN' | 'OUT';
  quantity: number;
  reference?: string;
  notes?: string;
}

// Product types
export interface CreateProductRequest {
  name: string;
  category?: string;
  description?: string;
  unitPrice: number;
  stockQuantity?: number;
  minStockLevel?: number;
}

export interface UpdateProductRequest {
  name?: string;
  category?: string;
  description?: string;
  unitPrice?: number;
  stockQuantity?: number;
  minStockLevel?: number;
}

// Work Center types
export interface CreateWorkCenterRequest {
  name: string;
  location?: string;
  description?: string;
  costPerHour: number;
  capacity: number;
}

export interface UpdateWorkCenterRequest {
  name?: string;
  location?: string;
  description?: string;
  costPerHour?: number;
  capacity?: number;
  utilization?: number;
  status?: 'ACTIVE' | 'MAINTENANCE' | 'INACTIVE';
}

// User Management types
export interface CreateUserRequest {
  loginId: string;
  email: string;
  password: string;
  name?: string;
  role: 'ADMIN' | 'MANAGER' | 'OPERATOR' | 'INVENTORY';
  department?: string;
  phone?: string;
}

export interface UpdateUserRequest {
  loginId?: string;
  email?: string;
  name?: string;
  role?: 'ADMIN' | 'MANAGER' | 'OPERATOR' | 'INVENTORY';
  department?: string;
  status?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  phone?: string;
}

// Query parameters
export interface PaginationQuery {
  page?: string;
  limit?: string;
}

export interface SearchQuery {
  search?: string;
  status?: string;
  category?: string;
  role?: string;
}
