// =============================================
// USER TYPES
// =============================================

export type UserRole =
  | 'citizen'
  | 'mttq_president'
  | 'mttq_officer'
  | 'youth_leader'
  | 'women_leader'
  | 'veteran_leader'
  | 'farmer_leader'
  | 'union_leader'
  | 'ubnd_officer';

export interface IVillage {
  id: string;
  code: string;
  name: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface IOrganization {
  id: string;
  code: string;
  name: string;
  type: 'fatherland_front' | 'union' | 'other';
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
  children?: IOrganization[];
}

export interface ICategory {
  id: string;
  code: string;
  name: string;
  description?: string | null;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface IUser {
  id: string;
  fullName: string;
  phone: string;
  role: UserRole;
  userType?: 'citizen' | 'officer' | 'admin';
  villageId?: string | null;
  village?: { id: string; code: string; name: string } | null;
  organizationId?: string | null;
  organization?: { id: string; code: string; name: string; type?: string } | null;
  titleName?: string;
  department?: string;
  avatarUrl?: string;
  isActive?: boolean;
  lastLoginAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

// =============================================
// FEEDBACK TYPES
// =============================================

export type FeedbackStatus = 'pending' | 'received' | 'rejected';

export interface IFeedbackAttachment {
  id: string;
  fileUrl: string;
  fileType: string;
  createdAt?: string;
}

export interface IFeedback {
  id: string;
  code: string;
  userId: string;
  user?: { id: string; fullName: string; phone: string } | null;
  targetOrganizationId: string;
  targetOrganization?: { id: string; code: string; name: string; type?: string } | null;
  incidentVillageId: string;
  incidentVillage?: { id: string; code: string; name: string } | null;
  categoryId: string;
  category?: { id: string; code: string; name: string } | null;
  address?: string | null;
  title: string;
  content: string;
  status: FeedbackStatus;
  attachments: IFeedbackAttachment[];
  createdAt: string;
  updatedAt?: string;
}

export interface IPaginatedFeedbacks {
  items: IFeedback[];
  pagination: {
    currentPage: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
}

export interface IFeedbackStatistics {
  totalFeedbacks: number;
  totalPending: number;
  totalReceived: number;
  totalRejected: number;
  byOrganizations: { key: string; name: string; count: number }[];
  byVillages: { key: string; name: string; count: number }[];
  byCategories: { key: string; name: string; count: number }[];
}

// =============================================
// UPLOAD
// =============================================

export interface IUploadImageResponse {
  fileUrl: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
}

// =============================================
// PAGINATION
// =============================================

export interface IPagination {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface INotification {
  id: string;
  title: string;
  message: string;
  type: 'feedback_update' | 'new_announcement' | 'system';
  isRead: boolean;
  relatedId?: string;
  createdAt: string;
}
