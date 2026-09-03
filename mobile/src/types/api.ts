// =============================================
// USER & AUTH TYPES
// =============================================

export type UserRole =
  | 'citizen'
  | 'officer'
  | 'admin'
  | 'mttq_president'
  | 'mttq_officer'
  | 'youth_leader'
  | 'women_leader'
  | 'veteran_leader'
  | 'farmer_leader'
  | 'union_leader';

export interface IVillage {
  id: string;
  code: string;
  name: string;
  isActive: boolean;
}

export interface IOrganization {
  id: string;
  code: string;
  name: string;
  type?: 'fatherland_front' | 'union' | 'other';
  isActive: boolean;
}

export interface ICategory {
  id: string;
  code: string;
  name: string;
  description?: string | null;
  isActive: boolean;
}

export interface IUser {
  id: string;
  fullName: string;
  phone: string;
  role: UserRole;
  userType: 'citizen' | 'officer' | 'admin';
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
}

// =============================================
// FEEDBACK TYPES (ĐỒNG BỘ BACKEND & FRONTEND)
// =============================================

export type FeedbackStatus = 'pending' | 'received' | 'rejected';

export interface IFeedbackAttachment {
  id: string;
  fileUrl: string;
  fileType: string;
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

export interface ICreateFeedbackPayload {
  targetOrganizationId: string;
  incidentVillageId: string;
  categoryId: string;
  address?: string;
  title: string;
  content: string;
  attachments?: string[];
}
