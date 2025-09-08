import { 
  User, 
  LoginCredentials, 
  AuthResponse, 
  ApplicationType, 
  DashboardSummary, 
  ChartData,
  FilterOptions,
  ApiResponse,
  PaginatedResponse,
  ApiError,
  LoanRequest,
  RequestSearchParams,
  RequestFilters,
  LoanRequestDetails,
  PersonalInfo,
  BankingInfo,
  SchemeDetails,
  AddressInfo,
  DocumentInfo,
  GuarantorInfo,
  CollateralInfo,
  Scheme,
  ReportData,
  ReportSummary,
  ReportTableRow,
  PageData,
  BranchData,
  CasteData,
  TalukaData,
  ActionMasterData,
  OrganizationMasterData,
  StatusMasterData,
  PartnerMasterData,
  StatusMappingData,
  RejectionMasterData,
  DatabaseAccessData,
  RolesData,
  WorkflowData,
  AccessMappingData,
  BranchMappingData,
  PincodeMappingData,
  MembersData,
  ConfigData,
  RegionReportData,
  BankData
} from '../types';

// API Configuration
const API_BASE_URL = 'http://localhost:3000/api';
const API_TIMEOUT = 10000;

// HTTP Client Class
class ApiClient {
  private baseURL: string;
  private timeout: number;

  constructor(baseURL: string, timeout: number) {
    this.baseURL = baseURL;
    this.timeout = timeout;
  }

  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const token = localStorage.getItem('authToken');
    
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      signal: AbortSignal.timeout(this.timeout),
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // GET request
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  // POST request
  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // PUT request
  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // DELETE request
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

// Create API client instance
const apiClient = new ApiClient(API_BASE_URL, API_TIMEOUT);

// Authentication API
export const authAPI = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get<User>('/auth/me');
    return response.data;
  },

  refreshToken: async (): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/refresh');
    return response.data;
  },
};

// Application Type API
export const applicationTypeAPI = {
  getAll: async (): Promise<ApplicationType[]> => {
    const response = await apiClient.get<ApplicationType[]>('/application-types');
    return response.data;
  },

  getById: async (id: number): Promise<ApplicationType> => {
    const response = await apiClient.get<ApplicationType>(`/application-types/${id}`);
    return response.data;
  },

  create: async (data: Partial<ApplicationType>): Promise<ApplicationType> => {
    const response = await apiClient.post<ApplicationType>('/application-types', data);
    return response.data;
  },

  update: async (id: number, data: Partial<ApplicationType>): Promise<ApplicationType> => {
    const response = await apiClient.put<ApplicationType>(`/application-types/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/application-types/${id}`);
  },
};

// Dashboard API
export const dashboardAPI = {
  getSummary: async (filters?: any): Promise<DashboardSummary> => {
    const queryParams = filters ? `?${new URLSearchParams(filters).toString()}` : '';
    const response = await apiClient.get<DashboardSummary>(`/dashboard/summary${queryParams}`);
    return response.data;
  },

  getChartData: async (type: 'monthly' | 'district', filters?: any): Promise<ChartData> => {
    const queryParams = filters ? `?${new URLSearchParams(filters).toString()}` : '';
    const response = await apiClient.get<ChartData>(`/dashboard/charts/${type}${queryParams}`);
    return response.data;
  },

  getMonthlyData: async (filters?: any): Promise<any[]> => {
    const queryParams = filters ? `?${new URLSearchParams(filters).toString()}` : '';
    const response = await apiClient.get<any[]>(`/dashboard/monthly${queryParams}`);
    return response.data;
  },

  getDistrictData: async (filters?: any): Promise<any[]> => {
    const queryParams = filters ? `?${new URLSearchParams(filters).toString()}` : '';
    const response = await apiClient.get<any[]>(`/dashboard/districts${queryParams}`);
    return response.data;
  },
};

// Filter Options API
export const filterAPI = {
  getFilterOptions: async (): Promise<FilterOptions> => {
    const response = await apiClient.get<FilterOptions>('/filters/options');
    return response.data;
  },
};

// Loan Requests API
export const loanRequestAPI = {
  getAll: async (params?: RequestSearchParams): Promise<PaginatedResponse<LoanRequest>> => {
    const queryParams = params ? `?${new URLSearchParams(params as any).toString()}` : '';
    const response = await apiClient.get<PaginatedResponse<LoanRequest>>(`/loan-requests${queryParams}`);
    return response.data;
  },

  getById: async (id: string): Promise<LoanRequest> => {
    const response = await apiClient.get<LoanRequest>(`/loan-requests/${id}`);
    return response.data;
  },

  getDetails: async (id: string): Promise<LoanRequestDetails> => {
    const response = await apiClient.get<LoanRequestDetails>(`/loan-requests/${id}/details`);
    return response.data;
  },

  updateStatus: async (id: string, status: string): Promise<LoanRequest> => {
    const response = await apiClient.put<LoanRequest>(`/loan-requests/${id}/status`, { status });
    return response.data;
  },

  sendEmail: async (id: string, emailData: any): Promise<void> => {
    await apiClient.post(`/loan-requests/${id}/send-email`, emailData);
  },

  downloadPDF: async (id: string): Promise<Blob> => {
    const response = await fetch(`${API_BASE_URL}/loan-requests/${id}/pdf`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
      },
    });
    return response.blob();
  },

  getRepaymentSchedule: async (id: string): Promise<any[]> => {
    const response = await apiClient.get<any[]>(`/loan-requests/${id}/repayment-schedule`);
    return response.data;
  },

  updateRepayment: async (id: string, repaymentId: string, data: any): Promise<any> => {
    const response = await apiClient.put<any>(`/loan-requests/${id}/repayment/${repaymentId}`, data);
    return response.data;
  },
};

// User Management API
export const userAPI = {
  getAll: async (page = 1, limit = 10): Promise<PaginatedResponse<User>> => {
    const response = await apiClient.get<PaginatedResponse<User>>(`/users?page=${page}&limit=${limit}`);
    return response.data;
  },

  getById: async (id: string): Promise<User> => {
    const response = await apiClient.get<User>(`/users/${id}`);
    return response.data;
  },

  create: async (data: Partial<User>): Promise<User> => {
    const response = await apiClient.post<User>('/users', data);
    return response.data;
  },

  update: async (id: string, data: Partial<User>): Promise<User> => {
    const response = await apiClient.put<User>(`/users/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/users/${id}`);
  },
};

// Mock Data Service (for development)
export const mockDataService = {
  // Mock Application Types
  getApplicationTypes: (): ApplicationType[] => [
    { id: 1, name: 'Computer Training', isActive: true },
    { id: 2, name: 'Fashion Designing', isActive: true },
    { id: 3, name: 'Utensils Shops', isActive: true },
    { id: 4, name: 'Motor Winding', isActive: true },
    { id: 5, name: 'Paintings (Automobiles)', isActive: true },
    { id: 6, name: 'Readymade Garment Business', isActive: true },
    { id: 7, name: 'Automobile Repairing Service Center (2/3/4 Wheeler)', isActive: true },
  ],

  // Mock Dashboard Summary
  getDashboardSummary: (): DashboardSummary => ({
    totalApplications: 1250,
    pendingApplications: 180,
    approvedApplications: 950,
    rejectedApplications: 120,
    totalUsers: 450,
    activeUsers: 380,
    totalSchemes: 25,
    activeSchemes: 22,
  }),

  // Mock Chart Data
  getChartData: (type: 'monthly' | 'district'): ChartData => {
    if (type === 'monthly') {
      return {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
          label: 'Applications',
          data: [65, 59, 80, 81, 56, 55],
          backgroundColor: ['#4CAF50', '#2196F3', '#FF9800', '#F44336', '#9C27B0', '#00BCD4'],
        }],
      };
    } else {
      return {
        labels: ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Aurangabad'],
        datasets: [{
          label: 'Applications by District',
          data: [120, 95, 80, 65, 45],
          backgroundColor: ['#4CAF50', '#2196F3', '#FF9800', '#F44336', '#9C27B0'],
        }],
      };
    }
  },

  // Mock Filter Options
  getFilterOptions: (): FilterOptions => ({
    districts: ['All Districts', 'Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Aurangabad'],
    months: ['All Months', 'January', 'February', 'March', 'April', 'May', 'June'],
    dateRanges: [
      { label: 'All Time', value: 'all' },
      { label: 'Today', value: 'today' },
      { label: 'This Week', value: 'week' },
      { label: 'This Month', value: 'month' },
      { label: 'Custom Range', value: 'custom' },
    ],
  }),

  // Mock Loan Requests
  getLoanRequests: (): LoanRequest[] => [
    {
      id: '1',
      loanId: 'LOAN-2024-001',
      applicantName: 'Rajesh Kumar',
      district: 'Mumbai',
      applicationType: 'Computer Training',
      activity: 'New Type',
      loanAmount: 100000,
      loanTerm: 5,
      interestRate: 4,
      subsidy: 50000,
      status: 'submitted_to_district_assistant',
      applicationDate: '2024-01-15',
      lastUpdated: '2024-01-20',
      priority: 'high',
      documents: [
        { id: '1', name: 'Application Form.pdf', type: 'pdf', url: '/documents/app-form.pdf', uploadedAt: '2024-01-15', size: 1024 },
        { id: '2', name: 'ID Proof.jpg', type: 'image', url: '/documents/id-proof.jpg', uploadedAt: '2024-01-15', size: 512 },
      ],
      contactInfo: {
        email: 'rajesh.kumar@email.com',
        phone: '+91 98765 43210',
        address: '123, Andheri West, Mumbai - 400058',
      },
      repaymentSchedule: [
        { id: '1', dueDate: '2024-04-15', amount: 12500, status: 'pending' },
        { id: '2', dueDate: '2024-05-15', amount: 12500, status: 'pending' },
        { id: '3', dueDate: '2024-06-15', amount: 12500, status: 'pending' },
        { id: '4', dueDate: '2024-07-15', amount: 12500, status: 'pending' },
      ],
    },
    {
      id: '2',
      loanId: 'LOAN-2024-002',
      applicantName: 'Priya Sharma',
      district: 'Pune',
      applicationType: 'Fashion Designing',
      activity: 'New Type',
      loanAmount: 75000,
      loanTerm: 3,
      interestRate: 4,
      subsidy: 37500,
      status: 'under_review',
      applicationDate: '2024-01-18',
      lastUpdated: '2024-01-22',
      priority: 'medium',
      documents: [
        { id: '3', name: 'Application Form.pdf', type: 'pdf', url: '/documents/app-form-2.pdf', uploadedAt: '2024-01-18', size: 1024 },
        { id: '4', name: 'Business Plan.pdf', type: 'pdf', url: '/documents/business-plan.pdf', uploadedAt: '2024-01-18', size: 2048 },
      ],
      contactInfo: {
        email: 'priya.sharma@email.com',
        phone: '+91 98765 43211',
        address: '456, Koregaon Park, Pune - 411001',
      },
      repaymentSchedule: [
        { id: '5', dueDate: '2024-05-18', amount: 18750, status: 'pending' },
        { id: '6', dueDate: '2024-06-18', amount: 18750, status: 'pending' },
        { id: '7', dueDate: '2024-07-18', amount: 18750, status: 'pending' },
        { id: '8', dueDate: '2024-08-18', amount: 18750, status: 'pending' },
      ],
    },
    {
      id: '3',
      loanId: 'LOAN-2024-003',
      applicantName: 'Amit Patel',
      district: 'Nagpur',
      applicationType: 'Motor Winding',
      activity: 'New Type',
      loanAmount: 30000,
      loanTerm: 2,
      interestRate: 4,
      subsidy: 15000,
      status: 'approved',
      applicationDate: '2024-01-10',
      lastUpdated: '2024-01-25',
      priority: 'low',
      documents: [
        { id: '5', name: 'Application Form.pdf', type: 'pdf', url: '/documents/app-form-3.pdf', uploadedAt: '2024-01-10', size: 1024 },
        { id: '6', name: 'Technical Certificate.pdf', type: 'pdf', url: '/documents/tech-cert.pdf', uploadedAt: '2024-01-10', size: 1536 },
      ],
      contactInfo: {
        email: 'amit.patel@email.com',
        phone: '+91 98765 43212',
        address: '789, Civil Lines, Nagpur - 440001',
      },
      repaymentSchedule: [
        { id: '9', dueDate: '2024-04-10', amount: 7500, status: 'pending' },
        { id: '10', dueDate: '2024-05-10', amount: 7500, status: 'pending' },
        { id: '11', dueDate: '2024-06-10', amount: 7500, status: 'pending' },
        { id: '12', dueDate: '2024-07-10', amount: 7500, status: 'pending' },
      ],
    },
    {
      id: '4',
      loanId: 'LOAN-2024-004',
      applicantName: 'Sunita Devi',
      district: 'Mumbai',
      applicationType: 'Utensils Shops',
      activity: 'New Type',
      loanAmount: 40000,
      loanTerm: 3,
      interestRate: 4,
      subsidy: 20000,
      status: 'disbursed',
      applicationDate: '2024-01-05',
      lastUpdated: '2024-01-28',
      priority: 'medium',
      documents: [
        { id: '7', name: 'Application Form.pdf', type: 'pdf', url: '/documents/app-form-4.pdf', uploadedAt: '2024-01-05', size: 1024 },
        { id: '8', name: 'Shop License.pdf', type: 'pdf', url: '/documents/shop-license.pdf', uploadedAt: '2024-01-05', size: 768 },
      ],
      contactInfo: {
        email: 'sunita.devi@email.com',
        phone: '+91 98765 43213',
        address: '321, Borivali East, Mumbai - 400066',
      },
      repaymentSchedule: [
        { id: '13', dueDate: '2024-04-05', amount: 10000, status: 'paid', paidDate: '2024-04-05' },
        { id: '14', dueDate: '2024-05-05', amount: 10000, status: 'pending' },
        { id: '15', dueDate: '2024-06-05', amount: 10000, status: 'pending' },
        { id: '16', dueDate: '2024-07-05', amount: 10000, status: 'pending' },
      ],
    },
    {
      id: '5',
      loanId: 'LOAN-2024-005',
      applicantName: 'Vikram Singh',
      district: 'Nashik',
      applicationType: 'Automobile Repairing Service Center',
      activity: 'New Type',
      loanAmount: 100000,
      loanTerm: 5,
      interestRate: 4,
      subsidy: 50000,
      status: 'rejected',
      applicationDate: '2024-01-12',
      lastUpdated: '2024-01-30',
      priority: 'high',
      documents: [
        { id: '9', name: 'Application Form.pdf', type: 'pdf', url: '/documents/app-form-5.pdf', uploadedAt: '2024-01-12', size: 1024 },
        { id: '10', name: 'Workshop Photos.jpg', type: 'image', url: '/documents/workshop-photos.jpg', uploadedAt: '2024-01-12', size: 3072 },
      ],
      contactInfo: {
        email: 'vikram.singh@email.com',
        phone: '+91 98765 43214',
        address: '654, College Road, Nashik - 422005',
      },
    },
    {
      id: '6',
      loanId: 'LOAN-2024-006',
      applicantName: 'Dhule Applicant',
      district: 'Dhule',
      applicationType: 'New Type',
      activity: 'New Type',
      loanAmount: 100000,
      loanTerm: 5,
      interestRate: 4,
      subsidy: 50000,
      status: 'submitted_to_district_assistant',
      applicationDate: '2024-02-01',
      lastUpdated: '2024-02-01',
      priority: 'high',
      documents: [
        { id: '11', name: 'Application Form.pdf', type: 'pdf', url: '/documents/app-form-6.pdf', uploadedAt: '2024-02-01', size: 1024 },
        { id: '12', name: 'ID Proof.jpg', type: 'image', url: '/documents/id-proof-6.jpg', uploadedAt: '2024-02-01', size: 512 },
      ],
      contactInfo: {
        email: 'dhule.applicant@email.com',
        phone: '+91 98765 43215',
        address: '123, Dhule City, Dhule - 424001',
      },
      repaymentSchedule: [
        { id: '17', dueDate: '2024-05-01', amount: 20000, status: 'pending' },
        { id: '18', dueDate: '2024-06-01', amount: 20000, status: 'pending' },
        { id: '19', dueDate: '2024-07-01', amount: 20000, status: 'pending' },
        { id: '20', dueDate: '2024-08-01', amount: 20000, status: 'pending' },
        { id: '21', dueDate: '2024-09-01', amount: 20000, status: 'pending' },
      ],
    },
  ],

  // Mock Detailed Loan Request Data
  getLoanRequestDetails: (id: string): LoanRequestDetails => {
    const baseRequest = mockDataService.getLoanRequests().find(req => req.id === id);
    if (!baseRequest) {
      throw new Error('Loan request not found');
    }

    return {
      ...baseRequest,
      personalInfo: {
        aadhaar: '937458904835',
        firstName: 'Vaishali Sambhaji',
        lastName: 'Bagul',
        gender: 'Female',
        dob: '1st January 1995',
        mobile: '9766147558',
        email: 'vaishalibagul@gmail.com',
        fatherName: 'Dilip Pawar',
        motherName: 'Seema',
        village: '424308',
        subCaste: 'Mahar',
        underCaste: 'Schedule Cast',
        role: 'Beneficiary',
        createdAt: '4th September 2025',
        updatedAt: '4th September 2025'
      },
      bankingInfo: {
        bankName: 'Central Bank of India',
        accountNumber: '3505804644',
        ifsc: 'CBIN0281666',
        accountHolderName: 'Vaishali Sambhaji Bagul',
        email: 'vaishalibagul@gmail.com'
      },
      schemeDetails: {
        name: 'Margin Money Scheme (State)',
        type: 'State',
        marathiName: 'Beej Bhandval',
        minimumLoanLimit: 50001,
        maximumLoanLimit: 500000,
        subsidyLimit: 100,
        maximumSubsidyAmount: 50000,
        downPaymentPercent: 5,
        loanPercentByVendor: 20,
        loanPercentByPartner: 75,
        vendorInterestYearly: 4,
        minimumTenure: 3,
        maximumTenure: 5,
        guaranteeAmount: 0.5,
        interestType: 'Simple Interest'
      },
      addressInfo: {
        currentAddress: '123, Dhule City, Dhule - 424001',
        permanentAddress: '123, Dhule City, Dhule - 424001',
        pincode: '424001',
        state: 'Maharashtra',
        district: 'Dhule',
        taluka: 'Dhule',
        village: '424308'
      },
      documents: [
        { id: '1', name: 'Aadhaar Card.pdf', type: 'pdf', url: '/documents/aadhaar.pdf', uploadedAt: '2024-01-15', size: 1024, category: 'personal' },
        { id: '2', name: 'Bank Statement.pdf', type: 'pdf', url: '/documents/bank-statement.pdf', uploadedAt: '2024-01-15', size: 2048, category: 'banking' },
        { id: '3', name: 'Application Form.pdf', type: 'pdf', url: '/documents/application.pdf', uploadedAt: '2024-01-15', size: 1536, category: 'scheme' },
        { id: '4', name: 'Address Proof.pdf', type: 'pdf', url: '/documents/address-proof.pdf', uploadedAt: '2024-01-15', size: 768, category: 'address' }
      ],
      guarantors: [
        {
          id: '1',
          name: 'Dilip Pawar',
          relationship: 'Father',
          aadhaar: '937458904836',
          mobile: '9766147559',
          address: '123, Dhule City, Dhule - 424001',
          documents: [
            { id: '5', name: 'Guarantor Aadhaar.pdf', type: 'pdf', url: '/documents/guarantor-aadhaar.pdf', uploadedAt: '2024-01-15', size: 1024, category: 'guarantor' }
          ]
        }
      ],
      collaterals: [
        {
          id: '1',
          type: 'Property',
          description: 'Residential Property in Dhule',
          value: 200000,
          location: 'Dhule, Maharashtra',
          documents: [
            { id: '6', name: 'Property Documents.pdf', type: 'pdf', url: '/documents/property-docs.pdf', uploadedAt: '2024-01-15', size: 3072, category: 'collateral' }
          ]
        }
      ]
    };
  },

  // Mock Schemes Data
  getSchemes: (): Scheme[] => [
    {
      id: '1', name: 'Education Loan Scheme (NSFDC I)', type: 'Education', marathiName: 'शिक्षण कर्ज योजना (NSFDC I)',
      minimumLoanLimit: 0, maximumLoanLimit: 3000000, subsidyLimit: 100, maximumSubsidyAmount: 50000,
      downPaymentPercent: 10, loanPercentByVendor: 20, loanPercentByPartner: 90, vendorInterestYearly: 6,
      minimumTenure: 10, maximumTenure: 12, guaranteeAmount: 0.5, interestType: 'Written Down Value',
      partnerInvolvement: true, recoveryByPartner: true, createdAt: '2024-01-01', updatedAt: '2024-01-01'
    },
    {
      id: '2', name: 'Green Business Scheme (NSKFDC)', type: 'Business', marathiName: 'हरित व्यवसाय योजना (NSKFDC)',
      minimumLoanLimit: 0, maximumLoanLimit: 750000, subsidyLimit: 100, maximumSubsidyAmount: 50000,
      downPaymentPercent: 10, loanPercentByVendor: 20, loanPercentByPartner: 90, vendorInterestYearly: 6,
      minimumTenure: 0, maximumTenure: 10, guaranteeAmount: 0.5, interestType: 'Written Down Value',
      partnerInvolvement: true, recoveryByPartner: true, createdAt: '2024-01-02', updatedAt: '2024-01-02'
    },
    {
      id: '3', name: 'Education Loan Scheme (NSFDC A)', type: 'Education', marathiName: 'शिक्षण कर्ज योजना (NSFDC A)',
      minimumLoanLimit: 0, maximumLoanLimit: 4000000, subsidyLimit: 100, maximumSubsidyAmount: 50000,
      downPaymentPercent: 10, loanPercentByVendor: 20, loanPercentByPartner: 90, vendorInterestYearly: 6.5,
      minimumTenure: 10, maximumTenure: 12, guaranteeAmount: 0.5, interestType: 'Written Down Value',
      partnerInvolvement: true, recoveryByPartner: true, createdAt: '2024-01-03', updatedAt: '2024-01-03'
    },
    {
      id: '4', name: 'Margin Money Scheme (State)', type: 'State', marathiName: 'बीज भांडवल योजना (राज्य)',
      minimumLoanLimit: 50001, maximumLoanLimit: 500000, subsidyLimit: 100, maximumSubsidyAmount: 50000,
      downPaymentPercent: 5, loanPercentByVendor: 20, loanPercentByPartner: 75, vendorInterestYearly: 4,
      minimumTenure: 3, maximumTenure: 5, guaranteeAmount: 0.5, interestType: 'Simple Interest',
      partnerInvolvement: true, recoveryByPartner: true, createdAt: '2024-01-04', updatedAt: '2024-01-04'
    },
    {
      id: '5', name: 'Computer Training Scheme', type: 'Training', marathiName: 'संगणक प्रशिक्षण योजना',
      minimumLoanLimit: 25000, maximumLoanLimit: 100000, subsidyLimit: 100, maximumSubsidyAmount: 25000,
      downPaymentPercent: 15, loanPercentByVendor: 25, loanPercentByPartner: 85, vendorInterestYearly: 5,
      minimumTenure: 2, maximumTenure: 3, guaranteeAmount: 0.3, interestType: 'Simple Interest',
      partnerInvolvement: true, recoveryByPartner: false, createdAt: '2024-01-05', updatedAt: '2024-01-05'
    },
    {
      id: '6', name: 'Fashion Designing Scheme', type: 'Training', marathiName: 'फॅशन डिझायनिंग योजना',
      minimumLoanLimit: 30000, maximumLoanLimit: 150000, subsidyLimit: 100, maximumSubsidyAmount: 30000,
      downPaymentPercent: 12, loanPercentByVendor: 22, loanPercentByPartner: 88, vendorInterestYearly: 5.5,
      minimumTenure: 2, maximumTenure: 4, guaranteeAmount: 0.4, interestType: 'Simple Interest',
      partnerInvolvement: true, recoveryByPartner: true, createdAt: '2024-01-06', updatedAt: '2024-01-06'
    },
    {
      id: '7', name: 'Motor Winding Scheme', type: 'Technical', marathiName: 'मोटर वाइंडिंग योजना',
      minimumLoanLimit: 20000, maximumLoanLimit: 80000, subsidyLimit: 100, maximumSubsidyAmount: 20000,
      downPaymentPercent: 20, loanPercentByVendor: 30, loanPercentByPartner: 80, vendorInterestYearly: 6,
      minimumTenure: 1, maximumTenure: 2, guaranteeAmount: 0.2, interestType: 'Simple Interest',
      partnerInvolvement: false, recoveryByPartner: false, createdAt: '2024-01-07', updatedAt: '2024-01-07'
    },
    {
      id: '8', name: 'Utensils Shop Scheme', type: 'Business', marathiName: 'भांडी दुकान योजना',
      minimumLoanLimit: 40000, maximumLoanLimit: 200000, subsidyLimit: 100, maximumSubsidyAmount: 40000,
      downPaymentPercent: 8, loanPercentByVendor: 18, loanPercentByPartner: 82, vendorInterestYearly: 4.5,
      minimumTenure: 3, maximumTenure: 5, guaranteeAmount: 0.6, interestType: 'Simple Interest',
      partnerInvolvement: true, recoveryByPartner: true, createdAt: '2024-01-08', updatedAt: '2024-01-08'
    },
    {
      id: '9', name: 'Automobile Repair Scheme', type: 'Technical', marathiName: 'ऑटोमोबाईल दुरुस्ती योजना',
      minimumLoanLimit: 50000, maximumLoanLimit: 300000, subsidyLimit: 100, maximumSubsidyAmount: 50000,
      downPaymentPercent: 10, loanPercentByVendor: 20, loanPercentByPartner: 90, vendorInterestYearly: 6,
      minimumTenure: 3, maximumTenure: 7, guaranteeAmount: 0.7, interestType: 'Written Down Value',
      partnerInvolvement: true, recoveryByPartner: true, createdAt: '2024-01-09', updatedAt: '2024-01-09'
    },
    {
      id: '10', name: 'Agriculture Equipment Scheme', type: 'Agriculture', marathiName: 'कृषी उपकरण योजना',
      minimumLoanLimit: 100000, maximumLoanLimit: 500000, subsidyLimit: 100, maximumSubsidyAmount: 100000,
      downPaymentPercent: 5, loanPercentByVendor: 15, loanPercentByPartner: 85, vendorInterestYearly: 3,
      minimumTenure: 5, maximumTenure: 10, guaranteeAmount: 1.0, interestType: 'Simple Interest',
      partnerInvolvement: true, recoveryByPartner: true, createdAt: '2024-01-10', updatedAt: '2024-01-10'
    },
    {
      id: '11', name: 'Dairy Farming Scheme', type: 'Agriculture', marathiName: 'दुग्ध व्यवसाय योजना',
      minimumLoanLimit: 75000, maximumLoanLimit: 400000, subsidyLimit: 100, maximumSubsidyAmount: 75000,
      downPaymentPercent: 7, loanPercentByVendor: 17, loanPercentByPartner: 83, vendorInterestYearly: 3.5,
      minimumTenure: 4, maximumTenure: 8, guaranteeAmount: 0.8, interestType: 'Simple Interest',
      partnerInvolvement: true, recoveryByPartner: true, createdAt: '2024-01-11', updatedAt: '2024-01-11'
    },
    {
      id: '12', name: 'Poultry Farming Scheme', type: 'Agriculture', marathiName: 'पोल्ट्री फार्मिंग योजना',
      minimumLoanLimit: 60000, maximumLoanLimit: 350000, subsidyLimit: 100, maximumSubsidyAmount: 60000,
      downPaymentPercent: 8, loanPercentByVendor: 18, loanPercentByPartner: 82, vendorInterestYearly: 4,
      minimumTenure: 3, maximumTenure: 6, guaranteeAmount: 0.6, interestType: 'Simple Interest',
      partnerInvolvement: true, recoveryByPartner: true, createdAt: '2024-01-12', updatedAt: '2024-01-12'
    },
    {
      id: '13', name: 'Beauty Parlor Scheme', type: 'Service', marathiName: 'ब्युटी पार्लर योजना',
      minimumLoanLimit: 35000, maximumLoanLimit: 180000, subsidyLimit: 100, maximumSubsidyAmount: 35000,
      downPaymentPercent: 12, loanPercentByVendor: 22, loanPercentByPartner: 88, vendorInterestYearly: 5.5,
      minimumTenure: 2, maximumTenure: 4, guaranteeAmount: 0.4, interestType: 'Simple Interest',
      partnerInvolvement: true, recoveryByPartner: false, createdAt: '2024-01-13', updatedAt: '2024-01-13'
    },
    {
      id: '14', name: 'Tailoring Shop Scheme', type: 'Service', marathiName: 'शिवणकाम दुकान योजना',
      minimumLoanLimit: 25000, maximumLoanLimit: 120000, subsidyLimit: 100, maximumSubsidyAmount: 25000,
      downPaymentPercent: 15, loanPercentByVendor: 25, loanPercentByPartner: 85, vendorInterestYearly: 5,
      minimumTenure: 2, maximumTenure: 3, guaranteeAmount: 0.3, interestType: 'Simple Interest',
      partnerInvolvement: false, recoveryByPartner: false, createdAt: '2024-01-14', updatedAt: '2024-01-14'
    },
    {
      id: '15', name: 'Mobile Repair Scheme', type: 'Technical', marathiName: 'मोबाइल दुरुस्ती योजना',
      minimumLoanLimit: 30000, maximumLoanLimit: 100000, subsidyLimit: 100, maximumSubsidyAmount: 30000,
      downPaymentPercent: 18, loanPercentByVendor: 28, loanPercentByPartner: 82, vendorInterestYearly: 6.5,
      minimumTenure: 1, maximumTenure: 2, guaranteeAmount: 0.2, interestType: 'Simple Interest',
      partnerInvolvement: false, recoveryByPartner: false, createdAt: '2024-01-15', updatedAt: '2024-01-15'
    },
    {
      id: '16', name: 'Photography Studio Scheme', type: 'Service', marathiName: 'फोटोग्राफी स्टुडिओ योजना',
      minimumLoanLimit: 80000, maximumLoanLimit: 250000, subsidyLimit: 100, maximumSubsidyAmount: 80000,
      downPaymentPercent: 10, loanPercentByVendor: 20, loanPercentByPartner: 90, vendorInterestYearly: 6,
      minimumTenure: 3, maximumTenure: 5, guaranteeAmount: 0.5, interestType: 'Simple Interest',
      partnerInvolvement: true, recoveryByPartner: true, createdAt: '2024-01-16', updatedAt: '2024-01-16'
    },
    {
      id: '17', name: 'Grocery Store Scheme', type: 'Business', marathiName: 'किराणा दुकान योजना',
      minimumLoanLimit: 50000, maximumLoanLimit: 300000, subsidyLimit: 100, maximumSubsidyAmount: 50000,
      downPaymentPercent: 8, loanPercentByVendor: 18, loanPercentByPartner: 82, vendorInterestYearly: 4.5,
      minimumTenure: 3, maximumTenure: 6, guaranteeAmount: 0.6, interestType: 'Simple Interest',
      partnerInvolvement: true, recoveryByPartner: true, createdAt: '2024-01-17', updatedAt: '2024-01-17'
    },
    {
      id: '18', name: 'Restaurant Scheme', type: 'Business', marathiName: 'रेस्टॉरंट योजना',
      minimumLoanLimit: 100000, maximumLoanLimit: 500000, subsidyLimit: 100, maximumSubsidyAmount: 100000,
      downPaymentPercent: 5, loanPercentByVendor: 15, loanPercentByPartner: 85, vendorInterestYearly: 4,
      minimumTenure: 5, maximumTenure: 8, guaranteeAmount: 0.8, interestType: 'Simple Interest',
      partnerInvolvement: true, recoveryByPartner: true, createdAt: '2024-01-18', updatedAt: '2024-01-18'
    }
  ],

  // Mock Report Data
  getReportData: (): ReportData => ({
    summary: {
      totalLoanAmount: 260000,
      averagePerGroup: 260000,
      totalLoans: 1,
      maxGroupAmount: 260000,
      minGroupAmount: 260000
    },
    tableData: [
      {
        loanCount: 1,
        totalAmount: 260000,
        scheme: 'Margin Money Scheme (State)',
        user: 'Aditya Aditya Aditya',
        totalDisbursed: 0,
        amountToBeDisbursed: 260000,
        subsidyAmount: 50000,
        ownContribution: 5,
        subsidyLimit: 100,
        loanPercentByMPBCDC: 20,
        loanPercentByPartner: 75,
        partnerRecovery: true,
        principleAmount: 260000,
        loanTerm: 5,
        totalInterest: 52000,
        interestType: 'Simple Interest',
        interest: 4,
        waivedCount: 0,
        waivedOffPrinciple: 0,
        waivedOffInterest: 0,
        waivedOffBoth: false,
        splitCount: 0,
        settledCount: 0,
        totalRecovered: 0,
        totalPendingRecovery: 260000,
        totalPenalty: 0,
        emiPaid: 0,
        emiUnpaid: 60,
        emiOverdue: 0,
        pending: true
      },
      {
        loanCount: 1,
        totalAmount: 150000,
        scheme: 'Computer Training Scheme',
        user: 'Rajesh Kumar',
        totalDisbursed: 150000,
        amountToBeDisbursed: 0,
        subsidyAmount: 25000,
        ownContribution: 15,
        subsidyLimit: 100,
        loanPercentByMPBCDC: 25,
        loanPercentByPartner: 85,
        partnerRecovery: false,
        principleAmount: 150000,
        loanTerm: 3,
        totalInterest: 22500,
        interestType: 'Simple Interest',
        interest: 5,
        waivedCount: 0,
        waivedOffPrinciple: 0,
        waivedOffInterest: 0,
        waivedOffBoth: false,
        splitCount: 0,
        settledCount: 0,
        totalRecovered: 45000,
        totalPendingRecovery: 105000,
        totalPenalty: 0,
        emiPaid: 15,
        emiUnpaid: 21,
        emiOverdue: 0,
        pending: false
      },
      {
        loanCount: 1,
        totalAmount: 300000,
        scheme: 'Education Loan Scheme (NSFDC I)',
        user: 'Priya Sharma',
        totalDisbursed: 0,
        amountToBeDisbursed: 300000,
        subsidyAmount: 50000,
        ownContribution: 10,
        subsidyLimit: 100,
        loanPercentByMPBCDC: 20,
        loanPercentByPartner: 90,
        partnerRecovery: true,
        principleAmount: 300000,
        loanTerm: 10,
        totalInterest: 120000,
        interestType: 'Written Down Value',
        interest: 6,
        waivedCount: 0,
        waivedOffPrinciple: 0,
        waivedOffInterest: 0,
        waivedOffBoth: false,
        splitCount: 0,
        settledCount: 0,
        totalRecovered: 0,
        totalPendingRecovery: 300000,
        totalPenalty: 0,
        emiPaid: 0,
        emiUnpaid: 120,
        emiOverdue: 0,
        pending: true
      }
    ]
  }),

  // Mock Page Data
  getPageData: (): PageData[] => [
    {
      id: '1',
      name: 'Database Access',
      url: '/access-list',
      icon: 'keyOutline',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01'
    },
    {
      id: '2',
      name: 'Status Master',
      url: '/status-master',
      icon: 'homeOutline',
      createdAt: '2024-01-02',
      updatedAt: '2024-01-02'
    },
    {
      id: '3',
      name: 'Status Mapping',
      url: '/status-mapping',
      icon: 'gitBranchOutline',
      createdAt: '2024-01-03',
      updatedAt: '2024-01-03'
    },
    {
      id: '4',
      name: 'Roles',
      url: '/roles',
      icon: 'shieldOutline',
      createdAt: '2024-01-04',
      updatedAt: '2024-01-04'
    },
    {
      id: '5',
      name: 'Workflow',
      url: '/workflow',
      icon: 'shuffleOutline',
      createdAt: '2024-01-05',
      updatedAt: '2024-01-05'
    },
    {
      id: '6',
      name: 'Reports',
      url: '/reports',
      icon: 'barChartOutline',
      createdAt: '2024-01-06',
      updatedAt: '2024-01-06'
    },
    {
      id: '7',
      name: 'Schemes',
      url: '/schemes',
      icon: 'fileTrayOutline',
      createdAt: '2024-01-07',
      updatedAt: '2024-01-07'
    },
    {
      id: '8',
      name: 'Pincode Mapping',
      url: '/pincode-mapping',
      icon: 'accessibilityOutline',
      createdAt: '2024-01-08',
      updatedAt: '2024-01-08'
    },
    {
      id: '9',
      name: 'Dashboard',
      url: '/home',
      icon: 'homeOutline',
      createdAt: '2024-01-09',
      updatedAt: '2024-01-09'
    },
    {
      id: '10',
      name: 'Access Mapping',
      url: '/access-mapping',
      icon: 'accessibilityOutline',
      createdAt: '2024-01-10',
      updatedAt: '2024-01-10'
    }
  ],

  // Mock Branch Data
  getBranchData: (): BranchData[] => [
    {
      id: '1',
      officeName: 'Dhule',
      officeType: 'District',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01'
    },
    {
      id: '2',
      officeName: 'Mumbai Suburban',
      officeType: 'District',
      createdAt: '2024-01-02',
      updatedAt: '2024-01-02'
    },
    {
      id: '3',
      officeName: 'Latur',
      officeType: 'District',
      createdAt: '2024-01-03',
      updatedAt: '2024-01-03'
    },
    {
      id: '4',
      officeName: 'Nashik',
      officeType: 'District',
      createdAt: '2024-01-04',
      updatedAt: '2024-01-04'
    },
    {
      id: '5',
      officeName: 'Amravati',
      officeType: 'District',
      createdAt: '2024-01-05',
      updatedAt: '2024-01-05'
    },
    {
      id: '6',
      officeName: 'Ghatkopar Region',
      officeType: 'Region',
      createdAt: '2024-01-06',
      updatedAt: '2024-01-06'
    },
    {
      id: '7',
      officeName: 'Nanded',
      officeType: 'District',
      createdAt: '2024-01-07',
      updatedAt: '2024-01-07'
    },
    {
      id: '8',
      officeName: 'Amravati Region',
      officeType: 'Region',
      createdAt: '2024-01-08',
      updatedAt: '2024-01-08'
    },
    {
      id: '9',
      officeName: 'Amrut Nagar',
      officeType: 'District',
      createdAt: '2024-01-09',
      updatedAt: '2024-01-09'
    },
    {
      id: '10',
      officeName: 'Ratnagiri',
      officeType: 'District',
      createdAt: '2024-01-10',
      updatedAt: '2024-01-10'
    }
  ],

  // Mock Caste Data
  getCasteData: (): CasteData[] => [
    {
      id: '1',
      name: 'Bedar',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01'
    },
    {
      id: '2',
      name: 'Chalvadi, Channayya',
      createdAt: '2024-01-02',
      updatedAt: '2024-01-02'
    },
    {
      id: '3',
      name: 'Pasi',
      createdAt: '2024-01-03',
      updatedAt: '2024-01-03'
    },
    {
      id: '4',
      name: 'Bhangi, Mehtar, Olgana, Rukhi, Malk...',
      createdAt: '2024-01-04',
      updatedAt: '2024-01-04'
    },
    {
      id: '5',
      name: 'Halsar, Haslar, Hulasvar, Halasvar',
      createdAt: '2024-01-05',
      updatedAt: '2024-01-05'
    },
    {
      id: '6',
      name: 'Mukri',
      createdAt: '2024-01-06',
      updatedAt: '2024-01-06'
    },
    {
      id: '7',
      name: 'Aray Mala',
      createdAt: '2024-01-07',
      updatedAt: '2024-01-07'
    },
    {
      id: '8',
      name: 'Bahna, Bahana',
      createdAt: '2024-01-08',
      updatedAt: '2024-01-08'
    },
    {
      id: '9',
      name: 'Mala Sale, Netkani',
      createdAt: '2024-01-09',
      updatedAt: '2024-01-09'
    },
    {
      id: '10',
      name: 'Tirgar, Tirbanda',
      createdAt: '2024-01-10',
      updatedAt: '2024-01-10'
    }
  ],

  // Mock Taluka Data
  getTalukaData: (): TalukaData[] => [
    {
      id: '1',
      name: 'Kalmeshwar',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01'
    },
    {
      id: '2',
      name: 'Gadchiroli',
      createdAt: '2024-01-02',
      updatedAt: '2024-01-02'
    },
    {
      id: '3',
      name: 'Wardha',
      createdAt: '2024-01-03',
      updatedAt: '2024-01-03'
    },
    {
      id: '4',
      name: 'Malabar Hill',
      createdAt: '2024-01-04',
      updatedAt: '2024-01-04'
    },
    {
      id: '5',
      name: 'Medha',
      createdAt: '2024-01-05',
      updatedAt: '2024-01-05'
    },
    {
      id: '6',
      name: 'Panhala',
      createdAt: '2024-01-06',
      updatedAt: '2024-01-06'
    },
    {
      id: '7',
      name: 'Gandhiganj',
      createdAt: '2024-01-07',
      updatedAt: '2024-01-07'
    }
  ],

  // Mock Action Master Data
  getActionMasterData: (): ActionMasterData[] => [
    {
      id: '1',
      name: 'change_application_status',
      functionName: 'change_application_status',
      priority: 2,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01'
    },
    {
      id: '2',
      name: 'check_application',
      functionName: 'check_application',
      priority: 1,
      createdAt: '2024-01-02',
      updatedAt: '2024-01-02'
    },
    {
      id: '3',
      name: 'send_notification',
      functionName: 'send_notification',
      priority: 3,
      createdAt: '2024-01-03',
      updatedAt: '2024-01-03'
    },
    {
      id: '4',
      name: 'pass_process',
      functionName: 'pass_process',
      priority: 4,
      createdAt: '2024-01-04',
      updatedAt: '2024-01-04'
    },
    {
      id: '5',
      name: 'check_rbac',
      functionName: 'check_rbac',
      priority: 5,
      createdAt: '2024-01-05',
      updatedAt: '2024-01-05'
    },
    {
      id: '6',
      name: 'check_applicant',
      functionName: 'check_applicant',
      priority: 1,
      createdAt: '2024-01-06',
      updatedAt: '2024-01-06'
    }
  ],

  // Mock Organization Master Data
  getOrganizationMasterData: (): OrganizationMasterData[] => [
    {
      id: '1',
      name: 'MPBCDC',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01'
    },
    {
      id: '2',
      name: 'Aaryahub',
      createdAt: '2024-01-02',
      updatedAt: '2024-01-02'
    }
  ],

  // Mock Status Master Data
  getStatusMasterData: (): StatusMasterData[] => [
    {
      id: '1',
      name: 'Cleared by AGM - Finance ✅',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01'
    },
    {
      id: '2',
      name: 'Submitted to Head Office✅',
      createdAt: '2024-01-02',
      updatedAt: '2024-01-02'
    },
    {
      id: '3',
      name: 'Cleared by GM Finance ✅',
      createdAt: '2024-01-03',
      updatedAt: '2024-01-03'
    },
    {
      id: '4',
      name: 'Submitted to General Manager P2✅',
      createdAt: '2024-01-04',
      updatedAt: '2024-01-04'
    },
    {
      id: '5',
      name: 'Disbursement Executed✅',
      createdAt: '2024-01-05',
      updatedAt: '2024-01-05'
    },
    {
      id: '6',
      name: 'Submitted to Managing Director✅',
      createdAt: '2024-01-06',
      updatedAt: '2024-01-06'
    },
    {
      id: '7',
      name: 'Cleared by DGM - Finance ✅',
      createdAt: '2024-01-07',
      updatedAt: '2024-01-07'
    },
    {
      id: '8',
      name: 'Defaulted',
      createdAt: '2024-01-08',
      updatedAt: '2024-01-08'
    },
    {
      id: '9',
      name: 'Submitted to Regional Office✅',
      createdAt: '2024-01-09',
      updatedAt: '2024-01-09'
    },
    {
      id: '10',
      name: 'Proposal sent to Bank✅',
      createdAt: '2024-01-10',
      updatedAt: '2024-01-10'
    }
  ],

  // Mock Partner Master Data (50+ records for 10+ pages)
  getPartnerMasterData: (): PartnerMasterData[] => [
    // Original 9 records from the image
    { id: '1', name: 'Kotak Bank', address: 'Andheri', contact: '1231231233', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
    { id: '2', name: 'NSFDC', address: 'Andheri', contact: '1234567890', createdAt: '2024-01-02', updatedAt: '2024-01-02' },
    { id: '3', name: 'NSKFDC', address: 'Andheri', contact: '1234567890', createdAt: '2024-01-03', updatedAt: '2024-01-03' },
    { id: '4', name: 'Allahabad Bank/Indian Bank', address: 'Andheri', contact: '11111111111', createdAt: '2024-01-04', updatedAt: '2024-01-04' },
    { id: '5', name: 'Andhra Bank/Union Bank of India', address: 'Andheri', contact: '3123112321', createdAt: '2024-01-05', updatedAt: '2024-01-05' },
    { id: '6', name: 'Bank of Baroda/Dena/Vijaya Bank', address: 'Andheri', contact: '11111111111', createdAt: '2024-01-06', updatedAt: '2024-01-06' },
    { id: '7', name: 'Bank of India', address: 'Andheri', contact: '11111111111', createdAt: '2024-01-07', updatedAt: '2024-01-07' },
    { id: '8', name: 'Bank of Maharashtra', address: 'Andheri', contact: '9898989898', createdAt: '2024-01-08', updatedAt: '2024-01-08' },
    { id: '9', name: 'CBI', address: 'Andheri', contact: '9898989898', createdAt: '2024-01-09', updatedAt: '2024-01-09' },
    
    // Additional records to reach 50+ (10+ pages)
    { id: '10', name: 'HDFC Bank', address: 'Mumbai', contact: '9876543210', createdAt: '2024-01-10', updatedAt: '2024-01-10' },
    { id: '11', name: 'ICICI Bank', address: 'Delhi', contact: '9876543211', createdAt: '2024-01-11', updatedAt: '2024-01-11' },
    { id: '12', name: 'State Bank of India', address: 'Bangalore', contact: '9876543212', createdAt: '2024-01-12', updatedAt: '2024-01-12' },
    { id: '13', name: 'Axis Bank', address: 'Chennai', contact: '9876543213', createdAt: '2024-01-13', updatedAt: '2024-01-13' },
    { id: '14', name: 'Punjab National Bank', address: 'Kolkata', contact: '9876543214', createdAt: '2024-01-14', updatedAt: '2024-01-14' },
    { id: '15', name: 'Canara Bank', address: 'Hyderabad', contact: '9876543215', createdAt: '2024-01-15', updatedAt: '2024-01-15' },
    { id: '16', name: 'Union Bank of India', address: 'Pune', contact: '9876543216', createdAt: '2024-01-16', updatedAt: '2024-01-16' },
    { id: '17', name: 'Bank of Baroda', address: 'Ahmedabad', contact: '9876543217', createdAt: '2024-01-17', updatedAt: '2024-01-17' },
    { id: '18', name: 'Indian Bank', address: 'Jaipur', contact: '9876543218', createdAt: '2024-01-18', updatedAt: '2024-01-18' },
    { id: '19', name: 'Central Bank of India', address: 'Lucknow', contact: '9876543219', createdAt: '2024-01-19', updatedAt: '2024-01-19' },
    { id: '20', name: 'Syndicate Bank', address: 'Bhopal', contact: '9876543220', createdAt: '2024-01-20', updatedAt: '2024-01-20' },
    { id: '21', name: 'UCO Bank', address: 'Chandigarh', contact: '9876543221', createdAt: '2024-01-21', updatedAt: '2024-01-21' },
    { id: '22', name: 'Oriental Bank of Commerce', address: 'Indore', contact: '9876543222', createdAt: '2024-01-22', updatedAt: '2024-01-22' },
    { id: '23', name: 'Corporation Bank', address: 'Coimbatore', contact: '9876543223', createdAt: '2024-01-23', updatedAt: '2024-01-23' },
    { id: '24', name: 'Vijaya Bank', address: 'Kochi', contact: '9876543224', createdAt: '2024-01-24', updatedAt: '2024-01-24' },
    { id: '25', name: 'Dena Bank', address: 'Vadodara', contact: '9876543225', createdAt: '2024-01-25', updatedAt: '2024-01-25' },
    { id: '26', name: 'Andhra Bank', address: 'Visakhapatnam', contact: '9876543226', createdAt: '2024-01-26', updatedAt: '2024-01-26' },
    { id: '27', name: 'Allahabad Bank', address: 'Kanpur', contact: '9876543227', createdAt: '2024-01-27', updatedAt: '2024-01-27' },
    { id: '28', name: 'Bank of Maharashtra', address: 'Nagpur', contact: '9876543228', createdAt: '2024-01-28', updatedAt: '2024-01-28' },
    { id: '29', name: 'Indian Overseas Bank', address: 'Madurai', contact: '9876543229', createdAt: '2024-01-29', updatedAt: '2024-01-29' },
    { id: '30', name: 'IDBI Bank', address: 'Mysore', contact: '9876543230', createdAt: '2024-01-30', updatedAt: '2024-01-30' },
    { id: '31', name: 'Federal Bank', address: 'Thiruvananthapuram', contact: '9876543231', createdAt: '2024-02-01', updatedAt: '2024-02-01' },
    { id: '32', name: 'South Indian Bank', address: 'Thrissur', contact: '9876543232', createdAt: '2024-02-02', updatedAt: '2024-02-02' },
    { id: '33', name: 'Karnataka Bank', address: 'Mangalore', contact: '9876543233', createdAt: '2024-02-03', updatedAt: '2024-02-03' },
    { id: '34', name: 'Karur Vysya Bank', address: 'Karur', contact: '9876543234', createdAt: '2024-02-04', updatedAt: '2024-02-04' },
    { id: '35', name: 'Lakshmi Vilas Bank', address: 'Karur', contact: '9876543235', createdAt: '2024-02-05', updatedAt: '2024-02-05' },
    { id: '36', name: 'Tamilnad Mercantile Bank', address: 'Tuticorin', contact: '9876543236', createdAt: '2024-02-06', updatedAt: '2024-02-06' },
    { id: '37', name: 'City Union Bank', address: 'Kumbakonam', contact: '9876543237', createdAt: '2024-02-07', updatedAt: '2024-02-07' },
    { id: '38', name: 'DCB Bank', address: 'Mumbai', contact: '9876543238', createdAt: '2024-02-08', updatedAt: '2024-02-08' },
    { id: '39', name: 'RBL Bank', address: 'Mumbai', contact: '9876543239', createdAt: '2024-02-09', updatedAt: '2024-02-09' },
    { id: '40', name: 'Yes Bank', address: 'Mumbai', contact: '9876543240', createdAt: '2024-02-10', updatedAt: '2024-02-10' },
    { id: '41', name: 'IndusInd Bank', address: 'Mumbai', contact: '9876543241', createdAt: '2024-02-11', updatedAt: '2024-02-11' },
    { id: '42', name: 'Bandhan Bank', address: 'Kolkata', contact: '9876543242', createdAt: '2024-02-12', updatedAt: '2024-02-12' },
    { id: '43', name: 'IDFC First Bank', address: 'Mumbai', contact: '9876543243', createdAt: '2024-02-13', updatedAt: '2024-02-13' },
    { id: '44', name: 'AU Small Finance Bank', address: 'Jaipur', contact: '9876543244', createdAt: '2024-02-14', updatedAt: '2024-02-14' },
    { id: '45', name: 'Equitas Small Finance Bank', address: 'Chennai', contact: '9876543245', createdAt: '2024-02-15', updatedAt: '2024-02-15' },
    { id: '46', name: 'Ujjivan Small Finance Bank', address: 'Bangalore', contact: '9876543246', createdAt: '2024-02-16', updatedAt: '2024-02-16' },
    { id: '47', name: 'ESAF Small Finance Bank', address: 'Thrissur', contact: '9876543247', createdAt: '2024-02-17', updatedAt: '2024-02-17' },
    { id: '48', name: 'Jana Small Finance Bank', address: 'Bangalore', contact: '9876543248', createdAt: '2024-02-18', updatedAt: '2024-02-18' },
    { id: '49', name: 'Suryoday Small Finance Bank', address: 'Navi Mumbai', contact: '9876543249', createdAt: '2024-02-19', updatedAt: '2024-02-19' },
    { id: '50', name: 'Utkarsh Small Finance Bank', address: 'Varanasi', contact: '9876543250', createdAt: '2024-02-20', updatedAt: '2024-02-20' },
    { id: '51', name: 'Fincare Small Finance Bank', address: 'Bangalore', contact: '9876543251', createdAt: '2024-02-21', updatedAt: '2024-02-21' },
    { id: '52', name: 'Shivalik Small Finance Bank', address: 'Meerut', contact: '9876543252', createdAt: '2024-02-22', updatedAt: '2024-02-22' }
  ],

  // Mock Status Mapping Data
  getStatusMappingData: (): StatusMappingData[] => [
    {
      id: '1',
      status: 'Application Received',
      role: 'Sindhudurg_District Scrutiny Clerk',
      visibleFields: ['Submitted to District Assistant', 'Incomplete Application', 'Rejected'],
      nextPossibleStatuses: ['Submitted to District Assistant', 'Incomplete Application', 'Rejected'],
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01'
    },
    {
      id: '2',
      status: 'Submitted to District Assistant',
      role: 'Sindhudurg_District Assistant',
      visibleFields: ['Submitted to District Manager', 'Incomplete Application', 'Rejected'],
      nextPossibleStatuses: ['Submitted to District Manager', 'Incomplete Application', 'Rejected'],
      createdAt: '2024-01-02',
      updatedAt: '2024-01-02'
    },
    {
      id: '3',
      status: 'Submitted for Selection Committee review',
      role: 'Sindhudurg_District Manager',
      visibleFields: ['Sanctioned by Selection Committee', 'Rejected by Selection Committee'],
      nextPossibleStatuses: ['Sanctioned by Selection Committee', 'Rejected by Selection Committee'],
      createdAt: '2024-01-03',
      updatedAt: '2024-01-03'
    },
    {
      id: '4',
      status: 'Rejected',
      role: 'Sindhudurg_District Manager',
      visibleFields: ['Rejected'],
      nextPossibleStatuses: ['Rejected'],
      createdAt: '2024-01-04',
      updatedAt: '2024-01-04'
    },
    {
      id: '5',
      status: 'Incomplete Application',
      role: 'Sindhudurg_District Scrutiny Clerk',
      visibleFields: ['Application Received', 'Rejected'],
      nextPossibleStatuses: ['Application Received', 'Rejected'],
      createdAt: '2024-01-05',
      updatedAt: '2024-01-05'
    },
    {
      id: '6',
      status: 'Submitted to District Manager',
      role: 'Sindhudurg_District Manager',
      visibleFields: ['Submitted for Selection Committee review', 'Rejected'],
      nextPossibleStatuses: ['Submitted for Selection Committee review', 'Rejected'],
      createdAt: '2024-01-06',
      updatedAt: '2024-01-06'
    },
    {
      id: '7',
      status: 'Sanctioned by Selection Committee',
      role: 'Sindhudurg_District Manager',
      visibleFields: ['Disbursement Executed', 'Rejected'],
      nextPossibleStatuses: ['Disbursement Executed', 'Rejected'],
      createdAt: '2024-01-07',
      updatedAt: '2024-01-07'
    },
    {
      id: '8',
      status: 'Rejected by Selection Committee',
      role: 'Sindhudurg_District Manager',
      visibleFields: ['Rejected'],
      nextPossibleStatuses: ['Rejected'],
      createdAt: '2024-01-08',
      updatedAt: '2024-01-08'
    },
    {
      id: '9',
      status: 'Disbursement Executed',
      role: 'Sindhudurg_District Manager',
      visibleFields: ['Loan Active', 'Defaulted'],
      nextPossibleStatuses: ['Loan Active', 'Defaulted'],
      createdAt: '2024-01-09',
      updatedAt: '2024-01-09'
    },
    {
      id: '10',
      status: 'Loan Active',
      role: 'Sindhudurg_District Manager',
      visibleFields: ['Loan Closed', 'Defaulted'],
      nextPossibleStatuses: ['Loan Closed', 'Defaulted'],
      createdAt: '2024-01-10',
      updatedAt: '2024-01-10'
    }
  ],

  // Mock Rejection Master Data
  getRejectionMasterData: (): RejectionMasterData[] => [
    { id: '1', name: 'User has not paid previous loan', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
    { id: '2', name: 'Test Rejection', createdAt: '2024-01-02', updatedAt: '2024-01-02' },
    { id: '3', name: 'Testing now', createdAt: '2024-01-03', updatedAt: '2024-01-03' },
    { id: '4', name: 'Applicant is not valid', createdAt: '2024-01-04', updatedAt: '2024-01-04' }
  ],

  // Mock Database Access Data
  getDatabaseAccessData: (): DatabaseAccessData[] => [
    { id: '1', name: 'Members', permissions: 'add, edit, delete, view', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
    { id: '2', name: 'Branch Master', permissions: 'add, edit, delete, view', createdAt: '2024-01-02', updatedAt: '2024-01-02' },
    { id: '3', name: 'Branch Master', permissions: 'add, edit, delete, view', createdAt: '2024-01-03', updatedAt: '2024-01-03' },
    { id: '4', name: 'New Loan', permissions: 'add, edit, delete, view', createdAt: '2024-01-04', updatedAt: '2024-01-04' },
    { id: '5', name: 'Manage Pages', permissions: 'add, edit, delete, view', createdAt: '2024-01-05', updatedAt: '2024-01-05' },
    { id: '6', name: 'Reports', permissions: 'add, edit, delete, view', createdAt: '2024-01-06', updatedAt: '2024-01-06' },
    { id: '7', name: 'Database Access', permissions: 'add, edit, delete, view', createdAt: '2024-01-07', updatedAt: '2024-01-07' },
    { id: '8', name: 'Roles', permissions: 'add, edit, delete, view', createdAt: '2024-01-08', updatedAt: '2024-01-08' },
    { id: '9', name: 'Dashboard', permissions: 'add, edit, delete, view', createdAt: '2024-01-09', updatedAt: '2024-01-09' }
  ],

  // Mock Roles Data
  getRolesData: (): RolesData[] => [
    { id: '1', name: 'Wardha_District Accountant', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
    { id: '2', name: 'Dhule_District Scrutiny Clerk', createdAt: '2024-01-02', updatedAt: '2024-01-02' },
    { id: '3', name: 'Palghar_District Accountant', createdAt: '2024-01-03', updatedAt: '2024-01-03' },
    { id: '4', name: 'Nandurbar_District Assistant', createdAt: '2024-01-04', updatedAt: '2024-01-04' },
    { id: '5', name: 'Hingoli_District Accountant', createdAt: '2024-01-05', updatedAt: '2024-01-05' },
    { id: '6', name: 'Nanded_District Assistant', createdAt: '2024-01-06', updatedAt: '2024-01-06' },
    { id: '7', name: 'Washim_District Accountant', createdAt: '2024-01-07', updatedAt: '2024-01-07' },
    { id: '8', name: 'Gondia_District Accountant', createdAt: '2024-01-08', updatedAt: '2024-01-08' }
  ],

  // Mock Workflow Data
  getWorkflowData: (): WorkflowData[] => [
    {
      id: '1',
      name: 'Disbursement',
      organizationId: '67daa1597142b9b6c14aa76b',
      taskName: 'DisburseTask',
      taskId: 'T1',
      nextTasks: 'N/A',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01'
    },
    {
      id: '2',
      name: 'Status Management',
      organizationId: '67daa1597142b9b6c14aa76b',
      taskName: 'Pre task',
      taskId: 'T1',
      nextTasks: 'N/A',
      createdAt: '2024-01-02',
      updatedAt: '2024-01-02'
    }
  ],

  // Mock Access Mapping Data
  getAccessMappingData: (): AccessMappingData[] => [
    {
      id: '1',
      role: 'Bhandara_District Scrutiny Clerk',
      pageAccess: '',
      navbarAccess: ['Dashboard', 'Schemes', 'New Requests'],
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01'
    },
    {
      id: '2',
      role: 'Amravati Region_Regional Accountant',
      pageAccess: '',
      navbarAccess: ['Dashboard', 'New Requests', 'Reports'],
      createdAt: '2024-01-02',
      updatedAt: '2024-01-02'
    },
    {
      id: '3',
      role: 'Ahilyanagar_District Assistant',
      pageAccess: '',
      navbarAccess: ['Dashboard', 'New Requests', 'Reports'],
      createdAt: '2024-01-03',
      updatedAt: '2024-01-03'
    },
    {
      id: '4',
      role: 'Kolhapur_District Accountant',
      pageAccess: '',
      navbarAccess: ['Dashboard', 'Reports'],
      createdAt: '2024-01-04',
      updatedAt: '2024-01-04'
    }
  ],

  // Mock Branch Mapping Data
  getBranchMappingData: (): BranchMappingData[] => [
    {
      id: '1',
      region: 'Pune Region',
      districts: ['Satara', 'Pune', 'Sangli', 'Kolhapur', 'Solapur'],
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01'
    },
    {
      id: '2',
      region: 'Mumbai region',
      districts: ['Sindhudurg', 'Thane', 'Palghar', 'Raigad', 'Mumbai City', 'Mumbai Suburban', 'Ratnagiri'],
      createdAt: '2024-01-02',
      updatedAt: '2024-01-02'
    },
    {
      id: '3',
      region: 'Aurangabad (Chh.Sambhaji Nagar) Region',
      districts: ['Beed', 'Jalna', 'Nanded', 'Parbhani', 'Hingoli', 'Latur', 'Dharashiv', 'Aurangabad(Chh. Sambhaji Nagar)'],
      createdAt: '2024-01-03',
      updatedAt: '2024-01-03'
    }
  ],

  // Mock Pincode Mapping Data
  getPincodeMappingData: (): PincodeMappingData[] => [
    {
      id: '1',
      district: 'Latur',
      pincodes: ['413515', '413522', '413520', '413511', '413513', '413519', '413532', '413607', '413516', '413523', '413524', '413521', '413530', '431522', '413527', '413544', '413514', '413531', '413517', '413518', '413512', '413529', '413510', '413581'],
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01'
    },
    {
      id: '2',
      district: 'Akola',
      pincodes: ['444126', '444101', '444511', '444302', '444401', '444102', '444111', '444004', '444103', '444005', '444405', '444106', '444107', '444501', '444407', '444006', '444108', '444502', '444109', '444002', '444311', '444001', '444104', '444117', '444003', '444007'],
      createdAt: '2024-01-02',
      updatedAt: '2024-01-02'
    },
    {
      id: '3',
      district: 'Raigad',
      pincodes: ['410206', '400707', '410201', '410221', '410220', '410208', '402302', '402403', '402102', '402103', '402401', '402209', '402104', '402105', '402309', '402305', '410205', '402107', '402303', '402108', '402208', '402202', '402109', '402122', '402110', '402112', '402306', '402113', '402201', '410216', '410222', '410203', '402404', '402106', '402125', '402301', '402111', '402207', '402115', '410101', '410207', '400702', '402101', '402308', '402203', '402304', '402204', '402120', '402126', '402307', '410218', '410210', '410204', '402402', '410202', '400704', '402114', '402116', '410102', '415213', '402117', '410209'],
      createdAt: '2024-01-03',
      updatedAt: '2024-01-03'
    }
  ],

  // Mock Members Data
  getMembersData: (): MembersData[] => [
    {
      id: '1',
      name: 'DM',
      email: 'd@d.com',
      phone: '0987654322',
      district: 'Sindhudurga',
      role: 'Sindhudurga_DM',
      status: 'Deleted',
      roleHistoryCount: 0,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01'
    },
    {
      id: '2',
      name: 'Scrutiny Clerk',
      email: 'ss@s.com',
      phone: '9022741235',
      district: 'Sindhudurga',
      role: 'Sindhudurga_Scrutiny Clerk',
      status: 'Active',
      roleHistoryCount: 0,
      createdAt: '2024-01-02',
      updatedAt: '2024-01-02'
    },
    {
      id: '3',
      name: 'member 28th May',
      email: 'do@do.com',
      phone: '1111111111',
      district: '',
      role: 'Nashik_District Assistant',
      status: 'Deleted',
      roleHistoryCount: 0,
      createdAt: '2024-01-03',
      updatedAt: '2024-01-03'
    }
  ],

  // Mock Config Data
  getConfigData: (): ConfigData[] => [
    {
      id: '1',
      key: 'RM_limit',
      value: '50000',
      originalValue: '500000',
      type: 'number',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01'
    },
    {
      id: '2',
      key: 'RM',
      value: 'regional manager',
      type: 'text',
      createdAt: '2024-01-02',
      updatedAt: '2024-01-02'
    },
    {
      id: '3',
      key: 'GM_PERMISSION_AMT',
      value: '1500000',
      type: 'number',
      createdAt: '2024-01-03',
      updatedAt: '2024-01-03'
    },
    {
      id: '4',
      key: 'GM_ROLE',
      value: 'general manager',
      type: 'text',
      createdAt: '2024-01-04',
      updatedAt: '2024-01-04'
    },
    {
      id: '5',
      key: 'DEBUG',
      value: 'false',
      type: 'boolean',
      createdAt: '2024-01-05',
      updatedAt: '2024-01-05'
    },
    {
      id: '6',
      key: 'Testing_email',
      value: 'kishan.km408@gmail.com',
      type: 'email',
      createdAt: '2024-01-06',
      updatedAt: '2024-01-06'
    },
    {
      id: '7',
      key: 'SIGNATURE',
      value: 'Aaryahub Pvt. Ltd. | www.aaryahub.com',
      type: 'text',
      createdAt: '2024-01-07',
      updatedAt: '2024-01-07'
    },
    {
      id: '8',
      key: 'HEAD_OFFICE_ROLES',
      value: 'HEAD_OFFICE_ROLES=Managing Director,General Manager,Project Manager,Mumbai Admin,Head Office Assistant,Assistant Gene',
      type: 'text',
      createdAt: '2024-01-08',
      updatedAt: '2024-01-08'
    },
    {
      id: '9',
      key: 'REGIONAL_LEVEL_ROLES',
      value: 'Regional Manager,Regional Office Assistant,Regional Accountant,Regional Assistant,Amravati Region_Regional Clerk',
      type: 'text',
      createdAt: '2024-01-09',
      updatedAt: '2024-01-09'
    },
    {
      id: '10',
      key: 'PRE_DISBURSEMENT_STATUS',
      value: 'Approved for Disbursement',
      type: 'text',
      createdAt: '2024-01-10',
      updatedAt: '2024-01-10'
    },
    {
      id: '11',
      key: 'POST_DISBURSEMENT_STATUS',
      value: 'Disbursed',
      type: 'text',
      createdAt: '2024-01-11',
      updatedAt: '2024-01-11'
    },
    {
      id: '12',
      key: 'STATUS_TO_EMAIL',
      value: 'Rejected,Incomplete,Approved for Disbursement,Failed,Disbursed,Partially Disbursed,Sanction',
      type: 'text',
      createdAt: '2024-01-12',
      updatedAt: '2024-01-12'
    }
  ],

  // Mock Reports Data
  getRegionReportData: (): RegionReportData[] => [
    {
      regionName: 'NASHIK REGION',
      banks: [
        {
          srNo: 1,
          bankName: 'State Bank of India',
          target: { phy: 100, fin: 5000000 },
          previousYearPending: { phy: 25, fin: 1250000 },
          proposalsSent: { phy: 75, fin: 3750000 },
          loansSanctioned: { phy: 60, fin: 3000000 },
          loansDisbursed: { phy: 45, fin: 2250000 },
          proposalsReturned: { phy: 5, fin: 250000 },
          proposalsRejected: { phy: 10, fin: 500000 },
          proposalsPending: { phy: 15, fin: 750000 }
        },
        {
          srNo: 2,
          bankName: 'Bank of Maharashtra',
          target: { phy: 80, fin: 4000000 },
          previousYearPending: { phy: 20, fin: 1000000 },
          proposalsSent: { phy: 60, fin: 3000000 },
          loansSanctioned: { phy: 50, fin: 2500000 },
          loansDisbursed: { phy: 40, fin: 2000000 },
          proposalsReturned: { phy: 3, fin: 150000 },
          proposalsRejected: { phy: 7, fin: 350000 },
          proposalsPending: { phy: 10, fin: 500000 }
        }
      ]
    },
    {
      regionName: 'PUNE REGION',
      banks: [
        {
          srNo: 1,
          bankName: 'Punjab National Bank',
          target: { phy: 120, fin: 6000000 },
          previousYearPending: { phy: 30, fin: 1500000 },
          proposalsSent: { phy: 90, fin: 4500000 },
          loansSanctioned: { phy: 75, fin: 3750000 },
          loansDisbursed: { phy: 60, fin: 3000000 },
          proposalsReturned: { phy: 8, fin: 400000 },
          proposalsRejected: { phy: 7, fin: 350000 },
          proposalsPending: { phy: 15, fin: 750000 }
        },
        {
          srNo: 2,
          bankName: 'Canara Bank',
          target: { phy: 90, fin: 4500000 },
          previousYearPending: { phy: 22, fin: 1100000 },
          proposalsSent: { phy: 68, fin: 3400000 },
          loansSanctioned: { phy: 55, fin: 2750000 },
          loansDisbursed: { phy: 45, fin: 2250000 },
          proposalsReturned: { phy: 4, fin: 200000 },
          proposalsRejected: { phy: 9, fin: 450000 },
          proposalsPending: { phy: 13, fin: 650000 }
        }
      ]
    },
    {
      regionName: 'MUMBAI REGION',
      banks: [
        {
          srNo: 1,
          bankName: 'HDFC Bank',
          target: { phy: 150, fin: 7500000 },
          previousYearPending: { phy: 35, fin: 1750000 },
          proposalsSent: { phy: 115, fin: 5750000 },
          loansSanctioned: { phy: 95, fin: 4750000 },
          loansDisbursed: { phy: 80, fin: 4000000 },
          proposalsReturned: { phy: 10, fin: 500000 },
          proposalsRejected: { phy: 10, fin: 500000 },
          proposalsPending: { phy: 20, fin: 1000000 }
        },
        {
          srNo: 2,
          bankName: 'ICICI Bank',
          target: { phy: 110, fin: 5500000 },
          previousYearPending: { phy: 28, fin: 1400000 },
          proposalsSent: { phy: 82, fin: 4100000 },
          loansSanctioned: { phy: 70, fin: 3500000 },
          loansDisbursed: { phy: 60, fin: 3000000 },
          proposalsReturned: { phy: 6, fin: 300000 },
          proposalsRejected: { phy: 6, fin: 300000 },
          proposalsPending: { phy: 12, fin: 600000 }
        }
      ]
    },
    {
      regionName: 'AMRAVATI REGION',
      banks: [
        {
          srNo: 1,
          bankName: 'Union Bank of India',
          target: { phy: 70, fin: 3500000 },
          previousYearPending: { phy: 18, fin: 900000 },
          proposalsSent: { phy: 52, fin: 2600000 },
          loansSanctioned: { phy: 42, fin: 2100000 },
          loansDisbursed: { phy: 35, fin: 1750000 },
          proposalsReturned: { phy: 3, fin: 150000 },
          proposalsRejected: { phy: 7, fin: 350000 },
          proposalsPending: { phy: 10, fin: 500000 }
        }
      ]
    },
    {
      regionName: 'NAGPUR REGION',
      banks: [
        {
          srNo: 1,
          bankName: 'Central Bank of India',
          target: { phy: 85, fin: 4250000 },
          previousYearPending: { phy: 25, fin: 1250000 },
          proposalsSent: { phy: 60, fin: 3000000 },
          loansSanctioned: { phy: 50, fin: 2500000 },
          loansDisbursed: { phy: 40, fin: 2000000 },
          proposalsReturned: { phy: 5, fin: 250000 },
          proposalsRejected: { phy: 5, fin: 250000 },
          proposalsPending: { phy: 10, fin: 500000 }
        }
      ]
    }
  ]
};

export default apiClient;
