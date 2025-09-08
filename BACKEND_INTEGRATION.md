# Backend Integration Guide

This guide explains how to integrate the MAHA-DISHA admin panel with real backend APIs, replacing the current mock data with live data from your database.

## 📁 **Key Files for Backend Integration**

### 1. **API Service Layer**
**File**: `src/services/api.ts`
- **Purpose**: Central API service that handles all HTTP requests
- **Current State**: Contains `mockDataService` with dummy data
- **Integration**: Replace mock functions with real API calls

### 2. **Type Definitions**
**File**: `src/types/index.ts`
- **Purpose**: TypeScript interfaces for all data structures
- **Current State**: Defines types for all entities (Scheme, LoanRequest, etc.)
- **Integration**: Ensure backend API responses match these interfaces

### 3. **Custom Hooks**
**Directory**: `src/admin/hooks/`
- **Files**: `useDashboard.ts`, `useLoanRequests.ts`, `useApplicationTypes.ts`
- **Purpose**: Data fetching and state management hooks
- **Integration**: Update to use real API endpoints

## 🔧 **Integration Steps**

### Step 1: Update API Service (`src/services/api.ts`)

Replace the `mockDataService` with real API calls:

```typescript
// Before (Mock Data)
export const mockDataService = {
  getSchemes: () => Promise.resolve(mockSchemes),
  getLoanRequests: () => Promise.resolve(mockLoanRequests),
  // ... other mock functions
};

// After (Real API)
export const apiService = {
  getSchemes: async (): Promise<Scheme[]> => {
    const response = await fetch('/api/schemes');
    return response.json();
  },
  
  getLoanRequests: async (): Promise<LoanRequest[]> => {
    const response = await fetch('/api/loan-requests');
    return response.json();
  },
  
  // Add authentication headers
  getAuthenticatedRequest: async (url: string) => {
    const token = localStorage.getItem('authToken');
    return fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
  }
};
```

### Step 2: Update Custom Hooks

**File**: `src/admin/hooks/useDashboard.ts`
```typescript
// Replace mock data calls with real API calls
const fetchDashboardData = async () => {
  try {
    const [summary, charts, activities] = await Promise.all([
      apiService.getDashboardSummary(),
      apiService.getDashboardCharts(),
      apiService.getRecentActivities()
    ]);
    
    setDashboardData({ summary, charts, activities });
  } catch (error) {
    console.error('Failed to fetch dashboard data:', error);
  }
};
```

### Step 3: Environment Configuration

**File**: `src/config/environment.ts` (create if doesn't exist)
```typescript
export const config = {
  apiBaseUrl: process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001/api',
  useMockData: process.env.REACT_APP_USE_MOCK_DATA === 'true',
  authTokenKey: 'mahadisha_auth_token'
};
```

### Step 4: Authentication Integration

**File**: `src/services/auth.ts` (create if doesn't exist)
```typescript
export const authService = {
  login: async (credentials: LoginCredentials) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    
    if (response.ok) {
      const { token, user } = await response.json();
      localStorage.setItem('authToken', token);
      return { token, user };
    }
    throw new Error('Login failed');
  },
  
  logout: () => {
    localStorage.removeItem('authToken');
  },
  
  getCurrentUser: async () => {
    const token = localStorage.getItem('authToken');
    if (!token) return null;
    
    const response = await fetch('/api/auth/me', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    return response.ok ? response.json() : null;
  }
};
```

## 📋 **Required Backend API Endpoints**

### Authentication
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - User logout

### Dashboard
- `GET /api/dashboard/summary` - Dashboard summary cards
- `GET /api/dashboard/charts` - Chart data
- `GET /api/dashboard/activities` - Recent activities

### Schemes
- `GET /api/schemes` - Get all schemes
- `POST /api/schemes` - Create new scheme
- `PUT /api/schemes/:id` - Update scheme
- `DELETE /api/schemes/:id` - Delete scheme

### Loan Requests
- `GET /api/loan-requests` - Get all loan requests
- `GET /api/loan-requests/:id` - Get specific loan request
- `PUT /api/loan-requests/:id/status` - Update request status
- `POST /api/loan-requests/:id/email` - Send email notification

### Master Data
- `GET /api/branches` - Branch master data
- `GET /api/castes` - Caste master data
- `GET /api/talukas` - Taluka master data
- `GET /api/actions` - Action master data
- `GET /api/organizations` - Organization master data
- `GET /api/statuses` - Status master data
- `GET /api/partners` - Partner master data

### RBAC
- `GET /api/rbac/database-access` - Database access permissions
- `GET /api/rbac/roles` - User roles
- `GET /api/rbac/workflows` - Workflow configurations
- `GET /api/rbac/access-mappings` - Access mappings
- `GET /api/rbac/branch-mappings` - Branch mappings
- `GET /api/rbac/pincode-mappings` - Pincode mappings

### User Management
- `GET /api/users/members` - Get all members
- `PUT /api/users/members/:id/status` - Update member status
- `DELETE /api/users/members/:id` - Delete member

### Reports
- `GET /api/reports/progress` - Progress reports
- `GET /api/reports/custom` - Custom reports

### Configuration
- `GET /api/config` - Get configuration settings
- `PUT /api/config` - Update configuration settings

## 🔄 **Data Flow Architecture**

```
Frontend Components → Custom Hooks → API Service → Backend API → Database
```

1. **Components** call custom hooks for data
2. **Custom Hooks** use API service to fetch data
3. **API Service** makes HTTP requests to backend
4. **Backend API** processes requests and queries database
5. **Database** returns data back through the chain

## 🛠️ **Implementation Checklist**

### Phase 1: Basic Integration
- [ ] Set up API service layer
- [ ] Configure environment variables
- [ ] Implement authentication service
- [ ] Update login/logout functionality

### Phase 2: Core Data
- [ ] Integrate dashboard data
- [ ] Connect schemes management
- [ ] Integrate loan requests
- [ ] Update master data pages

### Phase 3: Advanced Features
- [ ] Implement RBAC functionality
- [ ] Connect user management
- [ ] Integrate reporting system
- [ ] Add configuration management

### Phase 4: Testing & Optimization
- [ ] Add error handling
- [ ] Implement loading states
- [ ] Add data validation
- [ ] Performance optimization

## 🚨 **Important Notes**

### Error Handling
```typescript
// Always wrap API calls in try-catch blocks
try {
  const data = await apiService.getSchemes();
  setSchemes(data);
} catch (error) {
  console.error('Failed to fetch schemes:', error);
  // Show user-friendly error message
  setError('Failed to load schemes. Please try again.');
}
```

### Loading States
```typescript
// Implement loading states for better UX
const [loading, setLoading] = useState(false);

const fetchData = async () => {
  setLoading(true);
  try {
    const data = await apiService.getData();
    setData(data);
  } finally {
    setLoading(false);
  }
};
```

### Authentication Headers
```typescript
// Always include authentication headers
const authenticatedRequest = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('authToken');
  return fetch(url, {
    ...options,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options.headers
    }
  });
};
```

## 📝 **Environment Variables**

Create a `.env` file in the project root:

```env
REACT_APP_API_BASE_URL=http://localhost:3001/api
REACT_APP_USE_MOCK_DATA=false
REACT_APP_APP_NAME=MAHA-DISHA
REACT_APP_VERSION=1.0.0
```

## 🔍 **Testing Backend Integration**

1. **Start with mock data enabled** to ensure UI works
2. **Gradually replace mock services** with real API calls
3. **Test each endpoint** individually
4. **Verify data flow** from backend to frontend
5. **Test error scenarios** (network failures, invalid data, etc.)

## 📞 **Support**

For backend integration support:
- Check the API service layer in `src/services/api.ts`
- Review type definitions in `src/types/index.ts`
- Examine custom hooks in `src/admin/hooks/`
- Test with mock data first before switching to real APIs

---

**Note**: This admin panel is designed to be backend-agnostic and can work with any REST API that follows the specified endpoint structure and data formats.
