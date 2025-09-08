import { useState, useEffect, useCallback } from 'react';
import { ApplicationType, ComponentState } from '../types';
import { applicationTypeAPI, mockDataService } from '../services/api';
import { shouldUseMockData } from '../config/environment';

export const useApplicationTypes = () => {
  const [state, setState] = useState<ComponentState<ApplicationType[]>>({
    data: null,
    isLoading: true,
    error: null,
  });

  const fetchApplicationTypes = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      let data: ApplicationType[];
      
      if (shouldUseMockData()) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        data = mockDataService.getApplicationTypes();
      } else {
        const response = await applicationTypeAPI.getAll();
        data = response;
      }
      
      setState({ data, isLoading: false, error: null });
    } catch (error) {
      setState({
        data: null,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch application types',
      });
    }
  }, []);

  const createApplicationType = async (data: Partial<ApplicationType>) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      let newItem: ApplicationType;
      
      if (shouldUseMockData()) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 300));
        newItem = {
          id: Date.now(), // Simple ID generation for mock
          name: data.name || '',
          isActive: data.isActive ?? true,
          ...data,
        };
        
        // Add to local state
        setState(prev => ({
          ...prev,
          data: prev.data ? [...prev.data, newItem] : [newItem],
          isLoading: false,
        }));
      } else {
        newItem = await applicationTypeAPI.create(data);
        // Refresh the list
        await fetchApplicationTypes();
      }
      
      return newItem;
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to create application type',
      }));
      throw error;
    }
  };

  const updateApplicationType = async (id: number, data: Partial<ApplicationType>) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      let updatedItem: ApplicationType;
      
      if (shouldUseMockData()) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 300));
        updatedItem = { id, ...data } as ApplicationType;
        
        // Update local state
        setState(prev => ({
          ...prev,
          data: prev.data?.map(item => 
            item.id === id ? { ...item, ...data } : item
          ) || null,
          isLoading: false,
        }));
      } else {
        updatedItem = await applicationTypeAPI.update(id, data);
        // Refresh the list
        await fetchApplicationTypes();
      }
      
      return updatedItem;
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to update application type',
      }));
      throw error;
    }
  };

  const deleteApplicationType = async (id: number) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      if (shouldUseMockData()) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Remove from local state
        setState(prev => ({
          ...prev,
          data: prev.data?.filter(item => item.id !== id) || null,
          isLoading: false,
        }));
      } else {
        await applicationTypeAPI.delete(id);
        // Refresh the list
        await fetchApplicationTypes();
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to delete application type',
      }));
      throw error;
    }
  };

  useEffect(() => {
    fetchApplicationTypes();
  }, [fetchApplicationTypes]);

  return {
    ...state,
    refetch: fetchApplicationTypes,
    create: createApplicationType,
    update: updateApplicationType,
    delete: deleteApplicationType,
  };
};
