import { useState, useEffect, useCallback } from 'react';
import { LoanRequest, ComponentState, RequestSearchParams, RequestFilters } from '../types';
import { loanRequestAPI, mockDataService } from '../services/api';
import { shouldUseMockData } from '../config/environment';
import { Capacitor } from '@capacitor/core';

export const useLoanRequests = (searchParams?: RequestSearchParams) => {
  const [state, setState] = useState<ComponentState<LoanRequest[]>>({
    data: null,
    isLoading: true,
    error: null,
  });

  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });

  const fetchLoanRequests = useCallback(async (params?: RequestSearchParams) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      let data: LoanRequest[];
      let total = 0;
      
      if (shouldUseMockData()) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const allRequests = mockDataService.getLoanRequests();
        
        // Apply search and filters
        let filteredRequests = allRequests;
        
        if (params?.query) {
          const query = params.query.toLowerCase();
          filteredRequests = filteredRequests.filter(request =>
            request.loanId.toLowerCase().includes(query) ||
            request.applicantName.toLowerCase().includes(query) ||
            request.district.toLowerCase().includes(query)
          );
        }
        
        if (params?.filters?.status && params.filters.status !== 'all') {
          filteredRequests = filteredRequests.filter(request =>
            request.status === params.filters?.status
          );
        }
        
        if (params?.filters?.district && params.filters.district !== 'all') {
          filteredRequests = filteredRequests.filter(request =>
            request.district === params.filters?.district
          );
        }
        
        // Apply pagination
        const page = params?.page || 1;
        const limit = params?.limit || 10;
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        
        data = filteredRequests.slice(startIndex, endIndex);
        total = filteredRequests.length;
        
        setPagination({
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        });
      } else {
        const response = await loanRequestAPI.getAll(params);
        data = response.data;
        total = response.total;
        
        setPagination({
          total: response.total,
          page: response.page,
          limit: response.limit,
          totalPages: response.totalPages,
        });
      }
      
      setState({ data, isLoading: false, error: null });
    } catch (error) {
      setState({
        data: null,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch loan requests',
      });
    }
  }, []);

  const updateRequestStatus = async (id: string, status: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      if (shouldUseMockData()) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Update local state
        setState(prev => ({
          ...prev,
          data: prev.data?.map(request => 
            request.id === id ? { ...request, status: status as any, lastUpdated: new Date().toISOString().split('T')[0] } : request
          ) || null,
          isLoading: false,
        }));
      } else {
        await loanRequestAPI.updateStatus(id, status);
        // Refresh the list
        await fetchLoanRequests(searchParams);
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to update request status',
      }));
      throw error;
    }
  };

  const sendEmail = async (id: string, emailData: any) => {
    try {
      if (shouldUseMockData()) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        console.log('Email sent:', emailData);
      } else {
        await loanRequestAPI.sendEmail(id, emailData);
      }
    } catch (error) {
      throw error;
    }
  };

  const downloadPDF = async (id: string) => {
    try {
      if (shouldUseMockData()) {
        // Simulate PDF download
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log('PDF downloaded for request:', id);
        // In a real app, you would trigger a file download
      } else {
        const blob = await loanRequestAPI.downloadPDF(id);
        
        // SDK-friendly download approach
        if (Capacitor.isNativePlatform()) {
          // For mobile apps, use Capacitor Filesystem plugin
          // This would require @capacitor/filesystem plugin
          console.log('Native download not implemented yet');
        } else {
          // For web, use browser APIs
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `loan-request-${id}.pdf`;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
        }
      }
    } catch (error) {
      throw error;
    }
  };

  const getRepaymentSchedule = async (id: string) => {
    try {
      if (shouldUseMockData()) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 300));
        const request = mockDataService.getLoanRequests().find(r => r.id === id);
        return request?.repaymentSchedule || [];
      } else {
        return await loanRequestAPI.getRepaymentSchedule(id);
      }
    } catch (error) {
      throw error;
    }
  };

  const updateRepayment = async (id: string, repaymentId: string, data: any) => {
    try {
      if (shouldUseMockData()) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 300));
        console.log('Repayment updated:', { id, repaymentId, data });
      } else {
        return await loanRequestAPI.updateRepayment(id, repaymentId, data);
      }
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    fetchLoanRequests(searchParams);
  }, [fetchLoanRequests, searchParams]);

  return {
    ...state,
    pagination,
    refetch: fetchLoanRequests,
    updateStatus: updateRequestStatus,
    sendEmail,
    downloadPDF,
    getRepaymentSchedule,
    updateRepayment,
  };
};
