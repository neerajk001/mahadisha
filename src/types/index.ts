// User and Authentication Types
export interface User {
  id: string;
  name: string;
  username: string;
  email?: string;
  role: string;
  level: string;
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  expiresIn: number;
}

// Application Type Types
export interface ApplicationType {
  id: number;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Loan Request Types
export interface LoanRequest {
  id: string;
  loanId: string;
  applicantName: string;
  district: string;
  applicationType: string;
  activity: string;
  loanAmount: number;
  loanTerm: number; // in years
  interestRate: number; // percentage
  subsidy: number; // subsidy amount
  status: 'pending' | 'approved' | 'rejected' | 'under_review' | 'disbursed' | 'submitted_to_district_assistant';
  applicationDate: string;
  lastUpdated: string;
  priority: 'low' | 'medium' | 'high';
  documents: Document[];
  contactInfo: ContactInfo;
  repaymentSchedule?: RepaymentSchedule[];
  scheme?: string;
  secondaryLoanId?: string;
}

export interface Document {
  id: string;
  name: string;
  type: 'pdf' | 'image' | 'document';
  url: string;
  uploadedAt: string;
  size: number;
}

export interface ContactInfo {
  email: string;
  phone: string;
  address: string;
}

export interface RepaymentSchedule {
  id: string;
  dueDate: string;
  amount: number;
  status: 'pending' | 'paid' | 'overdue';
  paidDate?: string;
}

export interface EMISchedule {
  id: string;
  dueDate: string;
  emiAmount: number;
  interest: number;
  principal: number;
  balance: number;
  penalty: number;
  status: 'Paid' | 'Unpaid' | 'Overdue';
  remarks?: string;
}

export interface RequestFilters {
  status?: string;
  district?: string;
  applicationType?: string;
  dateRange?: string;
  priority?: string;
}

// Advanced Scheme Filters
export interface SchemeFilters {
  status?: string[];
  type?: string[];
  priority?: string[];
  loanAmountRange?: {
    min: number;
    max: number;
  };
  interestRateRange?: {
    min: number;
    max: number;
  };
  tenureRange?: {
    min: number;
    max: number;
  };
  subsidyRange?: {
    min: number;
    max: number;
  };
  tags?: string[];
  dateRange?: {
    start: string;
    end: string;
  };
  usageCount?: {
    min: number;
    max: number;
  };
}

export interface RequestSearchParams {
  query?: string;
  filters?: RequestFilters;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Detailed View Types
export interface PersonalInfo {
  aadhaar: string;
  firstName: string;
  lastName: string;
  gender: 'Male' | 'Female' | 'Other';
  dob: string;
  mobile: string;
  email: string;
  fatherName: string;
  motherName: string;
  village: string;
  subCaste: string;
  underCaste: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface BankingInfo {
  bankName: string;
  accountNumber: string;
  ifsc: string;
  accountHolderName: string;
  email: string;
}

export interface SchemeDetails {
  name: string;
  type: string;
  marathiName: string;
  minimumLoanLimit: number;
  maximumLoanLimit: number;
  subsidyLimit: number;
  maximumSubsidyAmount: number;
  downPaymentPercent: number;
  loanPercentByVendor: number;
  loanPercentByPartner: number;
  vendorInterestYearly: number;
  minimumTenure: number;
  maximumTenure: number;
  guaranteeAmount: number;
  interestType: string;
}

// Scheme Types for Schemes Page
export interface Scheme {
  id: string;
  name: string;
  type: string;
  marathiName: string;
  minimumLoanLimit: number;
  maximumLoanLimit: number;
  subsidyLimit: number;
  maximumSubsidyAmount: number;
  downPaymentPercent: number;
  loanPercentByVendor: number;
  loanPercentByPartner: number;
  vendorInterestYearly: number;
  minimumTenure: number;
  maximumTenure: number;
  guaranteeAmount: number;
  interestType: string;
  partnerInvolvement: boolean;
  recoveryByPartner: boolean;
  status: 'active' | 'inactive' | 'under_review' | 'archived';
  description?: string;
  eligibilityCriteria?: string[];
  requiredDocuments?: string[];
  faq?: { question: string; answer: string }[];
  documents?: DocumentInfo[];
  priority: 'low' | 'medium' | 'high';
  tags?: string[];
  usageCount: number;
  lastUsed?: string;
  createdAt: string;
  updatedAt: string;
}

// Custom Reports Types
export interface ReportSummary {
  totalLoanAmount: number;
  averagePerGroup: number;
  totalLoans: number;
  maxGroupAmount: number;
  minGroupAmount: number;
}

export interface ReportTableRow {
  loanCount: number;
  totalAmount: number;
  scheme: string;
  user: string;
  totalDisbursed: number;
  amountToBeDisbursed: number;
  subsidyAmount: number;
  ownContribution: number;
  subsidyLimit: number;
  loanPercentByMPBCDC: number;
  loanPercentByPartner: number;
  partnerRecovery: boolean;
  principleAmount: number;
  loanTerm: number;
  totalInterest: number;
  interestType: string;
  interest: number;
  waivedCount: number;
  waivedOffPrinciple: number;
  waivedOffInterest: number;
  waivedOffBoth: boolean;
  splitCount: number;
  settledCount: number;
  totalRecovered: number;
  totalPendingRecovery: number;
  totalPenalty: number;
  emiPaid: number;
  emiUnpaid: number;
  emiOverdue: number;
  pending: boolean;
}

export interface ReportData {
  summary: ReportSummary;
  tableData: ReportTableRow[];
}

// Manage Pages Types
export interface PageData {
  id: string;
  name: string;
  url: string;
  icon: string;
  createdAt: string;
  updatedAt: string;
}

// Branch Master Types
export interface BranchData {
  id: string;
  officeName: string;
  officeType: string;
  createdAt: string;
  updatedAt: string;
}

// Caste Master Types
export interface CasteData {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

// Taluka Master Types
export interface TalukaData {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

// Action Master Types
export interface ActionMasterData {
  id: string;
  name: string;
  functionName: string;
  priority: number;
  createdAt: string;
  updatedAt: string;
}

// Organization Master Types
export interface OrganizationMasterData {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

// Status Master Types
export interface StatusMasterData {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

// Partner Master Types
export interface PartnerMasterData {
  id: string;
  name: string;
  address: string;
  contact: string;
  createdAt: string;
  updatedAt: string;
}

// Status Mapping Types
export interface StatusMappingData {
  id: string;
  status: string;
  role: string;
  visibleFields: string[];
  nextPossibleStatuses: string[];
  createdAt: string;
  updatedAt: string;
}

// Rejection Master Types
export interface RejectionMasterData {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

// Database Access Types
export interface DatabaseAccessData {
  id: string;
  name: string;
  permissions: string;
  createdAt: string;
  updatedAt: string;
}

// Roles Types
export interface RolesData {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

// Workflow Types
export interface WorkflowData {
  id: string;
  name: string;
  organizationId: string;
  taskName: string;
  taskId: string;
  nextTasks: string;
  createdAt: string;
  updatedAt: string;
}

// Access Mapping Types
export interface AccessMappingData {
  id: string;
  role: string;
  pageAccess?: string;
  navbarAccess: string[];
  createdAt: string;
  updatedAt: string;
}

// Branch Mapping Types
export interface BranchMappingData {
  id: string;
  region: string;
  districts: string[];
  createdAt: string;
  updatedAt: string;
}

// Pincode Mapping Types
export interface PincodeMappingData {
  id: string;
  district: string;
  pincodes: string[];
  state?: string;
  region?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

// Enhanced Pincode Mapping Types
export interface PincodeMappingFormData {
  district: string;
  pincodes: string[];
  state: string;
  region: string;
  description: string;
}

export interface PincodeValidation {
  isValid: boolean;
  errors: string[];
  suggestions?: string[];
}

export interface PincodeFilters {
  state: string;
  region: string;
  pincodeRange: {
    start: string;
    end: string;
  };
  districtType: 'urban' | 'rural' | 'mixed' | '';
  pincodeCount: {
    min: number;
    max: number;
  };
}

export interface BulkImportResult {
  success: number;
  failed: number;
  errors: string[];
  warnings: string[];
}

// Members Types
export interface MembersData {
  id: string;
  name: string;
  email: string;
  phone: string;
  district: string;
  role: string;
  status: 'Active' | 'Suspended' | 'Inactive' | 'Deleted';
  roleHistoryCount: number;
  createdAt: string;
  updatedAt: string;
}

// Config Types
export interface ConfigData {
  id: string;
  key: string;
  value: string;
  originalValue?: string;
  description?: string;
  type: 'text' | 'number' | 'boolean' | 'email';
  createdAt: string;
  updatedAt: string;
}

// Reports Types
export interface BankData {
  srNo: number;
  bankName: string;
  target: {
    phy: number;
    fin: number;
  };
  previousYearPending: {
    phy: number;
    fin: number;
  };
  proposalsSent: {
    phy: number;
    fin: number;
  };
  loansSanctioned: {
    phy: number;
    fin: number;
  };
  loansDisbursed: {
    phy: number;
    fin: number;
  };
  proposalsReturned: {
    phy: number;
    fin: number;
  };
  proposalsRejected: {
    phy: number;
    fin: number;
  };
  proposalsPending: {
    phy: number;
    fin: number;
  };
}

export interface RegionReportData {
  regionName: string;
  banks: BankData[];
}

export interface AddressInfo {
  currentAddress: string;
  permanentAddress: string;
  pincode: string;
  state: string;
  district: string;
  taluka: string;
  village: string;
}

export interface DocumentInfo {
  id: string;
  name: string;
  type: 'pdf' | 'image' | 'document';
  url: string;
  uploadedAt: string;
  size: number;
  category: 'personal' | 'banking' | 'scheme' | 'address' | 'guarantor' | 'collateral';
}

export interface GuarantorInfo {
  id: string;
  name: string;
  relationship: string;
  aadhaar: string;
  mobile: string;
  address: string;
  documents: DocumentInfo[];
}

export interface CollateralInfo {
  id: string;
  type: string;
  description: string;
  value: number;
  location: string;
  documents: DocumentInfo[];
}

export interface LoanRequestDetails extends LoanRequest {
  personalInfo: PersonalInfo;
  bankingInfo: BankingInfo;
  schemeDetails: SchemeDetails;
  addressInfo: AddressInfo;
  documents: DocumentInfo[];
  guarantors: GuarantorInfo[];
  collaterals: CollateralInfo[];
}

// Dashboard Summary Types
export interface DashboardSummary {
  totalApplications: number;
  pendingApplications: number;
  approvedApplications: number;
  rejectedApplications: number;
  totalUsers: number;
  activeUsers: number;
  totalSchemes: number;
  activeSchemes: number;
}

// Chart Data Types
export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string[];
    borderColor?: string[];
    borderWidth?: number;
  }[];
}

export interface MonthlyData {
  month: string;
  applications: number;
  approvals: number;
  rejections: number;
}

export interface DistrictData {
  district: string;
  applications: number;
  approvals: number;
  pending: number;
}

// Filter Types
export interface FilterOptions {
  districts: string[];
  months: string[];
  dateRanges: {
    label: string;
    value: string;
  }[];
}

export interface ActiveFilters {
  district: string;
  month: string;
  dateRange: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Menu and Navigation Types
export interface MenuItem {
  id: string;
  label: string;
  icon: string;
  route?: string;
  subItems?: SubMenuItem[];
}

export interface SubMenuItem {
  name: string;
  route: string;
  icon: string;
}

// Form Types
export interface ApplicationTypeForm {
  name: string;
  description?: string;
}

// Error Types
export interface ApiError {
  code: string;
  message: string;
  details?: any;
}

// Loading and State Types
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

export interface ComponentState<T> extends LoadingState {
  data: T | null;
}
