// Environment Configuration
export const config = {
  // API Configuration
  api: {
    baseURL: 'http://localhost:3000/api',
    timeout: 10000,
  },
  
  // Development Settings
  development: {
    useMockData: true, // Set to false when backend is ready
    enableLogging: true,
    enableDevTools: true,
  },
  
  // Feature Flags
  features: {
    enableFilters: true,
    enableCharts: true,
    enableExport: false,
    enableNotifications: false,
  },
  
  // App Settings
  app: {
    name: 'MAHA-DISHA Admin',
    version: '1.0.0',
    defaultPageSize: 10,
    maxPageSize: 100,
  },
};

// Helper function to check if we should use mock data
export const shouldUseMockData = (): boolean => {
  return config.development.useMockData;
};

// Helper function to get API base URL
export const getApiBaseUrl = (): string => {
  return config.api.baseURL;
};

export default config;
