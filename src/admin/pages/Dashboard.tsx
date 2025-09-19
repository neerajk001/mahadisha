import React, { useState } from 'react';
import {
  IonPage,
  IonContent,
  IonSplitPane,
  IonSpinner
} from '@ionic/react';
import Sidebar from '../components/sidebar/Sidebar';
import DashboardHeader from '../components/header/DashboardHeader';
import FilterRow from '../components/dashboard/FilterRow';
import SummaryCards from '../components/dashboard/SummaryCards';
import ChartsSection from '../components/dashboard/ChartsSection';
import { useDashboard } from '../hooks/useDashboard';
import { ActiveFilters } from '../../types';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const [filters, setFilters] = useState<ActiveFilters>({
    district: 'all',
    month: 'all',
    dateRange: 'all'
  });

  const { 
    summary, 
    monthlyChart, 
    districtChart, 
    filterOptions, 
    isLoading, 
    error, 
    refreshData 
  } = useDashboard(filters);

  const handleFilterChange = (newFilters: Partial<ActiveFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  return (
    <IonPage>
      <IonSplitPane contentId="dashboard-content" when="md">
        {/* Sidebar */}
        <Sidebar />
        
        {/* Main Content */}
        <div className="main-content" id="dashboard-content">
          {/* Header */}
          <DashboardHeader />
          
          {/* Dashboard Content */}
          <IonContent className="dashboard-content">
            {isLoading ? (
              <div className="dashboard-loading">
                <IonSpinner name="crescent" />
                <p>Loading dashboard data...</p>
              </div>
            ) : error ? (
              <div className="dashboard-error">
                <p>Error: {error}</p>
                <button onClick={() => refreshData()}>Retry</button>
              </div>
            ) : (
              <>
                {/* Filter Row */}
                <FilterRow onFilterChange={handleFilterChange} />
                
                {/* Summary Cards */}
                <SummaryCards data={summary} />
                
                {/* Charts Section */}
                <ChartsSection 
                  monthlyData={monthlyChart} 
                  districtData={districtChart}
                />
              </>
            )}
          </IonContent>
          
          // removed Floating Action Button
          
        </div>
      </IonSplitPane>
    </IonPage>
  );
};

export default Dashboard;
