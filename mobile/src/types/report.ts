export type ReportStatus = 'pending' | 'processing' | 'done' | 'rejected';
export type ReportTypeCategory = 'incident' | 'petition' | 'suggestion' | 'environment_order';

export type ReportCategory =
  | 'all'
  | 'supervision'
  | 'welfare'
  | 'ethnicity_religion'
  | 'youth_field'
  | 'women_field'
  | 'veterans_field'
  | 'union_field'
  | 'farmer_field'
  | 'security'
  | 'environment'
  | 'construction'
  | 'civilization'
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
  reporterName?: string;
  reporterPhone?: string;
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
