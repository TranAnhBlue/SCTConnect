export type ReportStatus = 'pending' | 'processing' | 'done' | 'rejected';

export type ReportCategory =
  | 'all'
  | 'security'
  | 'construction'
  | 'civilization'
  | 'environment'
  | 'traffic';

export interface UbndFeedbackResponse {
  officerName: string;
  department: string;
  officialContent: string;
  documentNumber?: string;
  responseDate: string;
  resultImageUrl?: string;
}

export interface FieldReport {
  id: string;
  title: string;
  description: string;
  address: string;
  category: ReportCategory;
  status: ReportStatus;
  imageUrl?: string;
  createdAt: string; // ISO string
  timeAgo: string;
  likes: number;
  comments: number;
  departmentAssigned?: string;
  ubndResponse?: UbndFeedbackResponse;
  satisfactionRating?: number;
}

export interface AdminProcedureReport {
  id: string;
  title: string;
  reporterName: string;
  status: ReportStatus;
  createdAt: string;
  timeAgo: string;
}

export interface DistrictReport {
  id: string;
  name: string;
  total: number;
  overdue: number;
  pending: number;
  processing: number;
  done: number;
  rejected: number;
  dissatisfied: number;
  veryDissatisfied: number;
}

export interface ReportStats {
  pending: number;
  processing: number;
  done: number;
  rejected: number;
}
