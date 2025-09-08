import { useState, useEffect, useCallback } from 'react';
import { DashboardSummary, ChartData, FilterOptions, ActiveFilters } from '../types';
import { dashboardAPI, filterAPI, mockDataService } from '../services/api';
import { shouldUseMockData } from '../config/environment';

export const useDashboard = (filters?: ActiveFilters) => {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [monthlyChart, setMonthlyChart] = useState<ChartData | null>(null);
  const [districtChart, setDistrictChart] = useState<ChartData | null>(null);
  const [filterOptions, setFilterOptions] = useState<FilterOptions | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (shouldUseMockData()) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Fetch mock data
        const summaryData = mockDataService.getDashboardSummary();
        const monthlyData = mockDataService.getChartData('monthly');
        const districtData = mockDataService.getChartData('district');
        const filterData = mockDataService.getFilterOptions();

        setSummary(summaryData);
        setMonthlyChart(monthlyData);
        setDistrictChart(districtData);
        setFilterOptions(filterData);
      } else {
        // Fetch real API data
        const [summaryResponse, monthlyResponse, districtResponse, filterResponse] = await Promise.all([
          dashboardAPI.getSummary(filters),
          dashboardAPI.getChartData('monthly', filters),
          dashboardAPI.getChartData('district', filters),
          filterAPI.getFilterOptions(),
        ]);

        setSummary(summaryResponse);
        setMonthlyChart(monthlyResponse);
        setDistrictChart(districtResponse);
        setFilterOptions(filterResponse);
      }

      setIsLoading(false);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch dashboard data');
      setIsLoading(false);
    }
  }, [filters]);

  const refreshData = async (newFilters?: ActiveFilters) => {
    await fetchDashboardData();
  };

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return {
    summary,
    monthlyChart,
    districtChart,
    filterOptions,
    isLoading,
    error,
    refreshData,
  };
};
