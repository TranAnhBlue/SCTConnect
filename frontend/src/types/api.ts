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

export type OrganizationType =
  | 'mttq'
  | 'youth'
  | 'women'
  | 'veterans'
  | 'farmers'
  | 'union';

export interface IUserOrganization {
  id?: string;
  orgId: string;
  orgCode: string;
  orgName: string;
  titleName: string;
  roleCode: string;
  isPrimary: boolean;
}

export interface IUser {
  id: string;
  _id?: string;
  fullName: string;
  phone: string;
  email?: string;
  role: UserRole;
  userType?: 'citizen' | 'officer' | 'admin';
  organization?: OrganizationType;
  titleName?: string;
  department?: string;
  commune?: string;
  district?: string;
  avatarUrl?: string;
  isActive?: boolean;
  isVerified?: boolean;
  activeOrganization?: IUserOrganization;
  organizations?: IUserOrganization[];
  permissions?: string[];
}

export type FeedbackCategory =
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

export type FeedbackStatus = 'pending' | 'processing' | 'done' | 'rejected';
export type FeedbackPriority = 'normal' | 'urgent';

export interface IUbndResponse {
  officerName: string;
  department: string;
  officialContent: string;
  documentNumber?: string;
  responseDate: string;
  resultImageUrl?: string;
}

export interface IStatusHistory {
  status: FeedbackStatus;
  changedBy: string;
  changedByRole?: string;
  changedAt: string;
  note?: string;
}

export interface IFeedback {
  id: string;
  _id?: string;
  reportCode: string;
  title: string;
  description: string;
  address: string;
  category: FeedbackCategory;
  targetOrganization?: OrganizationType;
  departmentAssigned?: string;
  assignedOfficerName?: string;
  status: FeedbackStatus;
  priority: FeedbackPriority;
  deadline?: string;
  isOverdue?: boolean;
  statusHistory: IStatusHistory[];
  imageUrls: string[];
  gps?: {
    lat: number;
    lng: number;
  };
  isAnonymous: boolean;
  reporterName?: string;
  reporterPhone?: string;
  ubndResponse?: IUbndResponse;
  satisfactionRating?: number;
  satisfactionComment?: string;
  likes: number;
  comments: number;
  createdAt: string;
  updatedAt?: string;
}

export interface IFeedbackStats {
  total: number;
  pending: number;
  processing: number;
  done: number;
  rejected: number;
  resolutionRate: number;
  satisfactionAvg: number;
  overdueCount: number;
  byCategory: { category: string; count: number; name: string }[];
  byOrganization: { org: string; count: number; name: string }[];
}

export interface IDistrictReport {
  districtName: string;
  total: number;
  done: number;
  pending: number;
  processing: number;
  lat: number;
  lng: number;
}

export interface IPostPollOption {
  id: string;
  optionText: string;
  votes: number;
}

export interface IPost {
  id: string;
  _id?: string;
  authorName: string;
  authorRole: string;
  authorAvatar?: string;
  organization?: OrganizationType;
  title: string;
  content: string;
  images: string[];
  isPinned?: boolean;
  postType: 'announcement' | 'discussion' | 'poll';
  pollOptions?: IPostPollOption[];
  userVotedOptionId?: string;
  likes: number;
  liked?: boolean;
  commentsCount: number;
  createdAt: string;
}

export interface ICitizenReception {
  id: string;
  _id?: string;
  code: string;
  citizenName: string;
  citizenPhone: string;
  citizenIdCard?: string;
  address: string;
  receptionDate: string;
  timeSlot: string;
  topic: string;
  content: string;
  hostLeaderName: string;
  hostLeaderTitle: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  note?: string;
  createdAt: string;
}

export interface IPublicService {
  id: string;
  _id?: string;
  name: string;
  code: string;
  category: string;
  department: string;
  processingTimeDays: number;
  fee: number;
  description: string;
  requiredDocuments: string[];
  steps: string[];
  onlineSubmissionAvailable: boolean;
}

export interface INotification {
  id: string;
  _id?: string;
  title: string;
  message: string;
  type: 'feedback_update' | 'new_announcement' | 'reception_reminder' | 'system';
  isRead: boolean;
  relatedId?: string;
  createdAt: string;
}

export interface IMessage {
  id: string;
  _id?: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  senderAvatar?: string;
  content: string;
  createdAt: string;
}

export interface IConversation {
  id: string;
  participantName: string;
  participantRole: string;
  participantAvatar?: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  relatedReportCode?: string;
}
