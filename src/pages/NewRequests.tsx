import React, { useState, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import {
  IonPage,
  IonContent,
  IonSplitPane,
  IonIcon,
  IonSpinner,
  IonSearchbar,
  IonSelect,
  IonSelectOption,
  IonButton,
  IonAlert,
  IonToast
} from '@ionic/react';
import { 
  eyeOutline, 
  mailOutline, 
  documentOutline,
  cardOutline,
  listOutline,
  refreshOutline
} from 'ionicons/icons';
import Sidebar from '../components/sidebar/Sidebar';
import DashboardHeader from '../components/header/DashboardHeader';
// Import RequestCard component
import RequestCard from '../components/requests/RequestCardNew';
import RequestList from '../components/requests/RequestList';
import { useLoanRequests } from '../hooks/useLoanRequests';
import { RequestSearchParams, RequestFilters } from '../types';
import './NewRequests.css';

const NewRequests: React.FC = () => {
  const history = useHistory();
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<RequestFilters>({
    status: 'all',
    district: 'all',
    applicationType: 'all',
    priority: 'all'
  });
  const [showStatusAlert, setShowStatusAlert] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const searchParams: RequestSearchParams = useMemo(() => ({
    query: searchQuery,
    filters,
    page: 1,
    limit: 20,
    sortBy: 'applicationDate',
    sortOrder: 'desc'
  }), [searchQuery, filters]);

  const { 
    data: requests, 
    isLoading, 
    error, 
    pagination,
    refetch,
    updateStatus,
    sendEmail,
    downloadPDF,
    getRepaymentSchedule
  } = useLoanRequests(searchParams);

  const handleStatusChange = (requestId: string, newStatus: string) => {
    setSelectedRequest(requestId);
    setShowStatusAlert(true);
  };

  const confirmStatusChange = async () => {
    if (selectedRequest) {
      try {
        await updateStatus(selectedRequest, filters.status || 'pending');
        setToastMessage('Status updated successfully');
        setShowToast(true);
      } catch (error) {
        setToastMessage('Failed to update status');
        setShowToast(true);
      }
    }
    setShowStatusAlert(false);
    setSelectedRequest(null);
  };

  const handleSendEmail = async (requestId: string) => {
    try {
      const emailData = {
        subject: 'Loan Application Update',
        message: 'Your loan application status has been updated.',
        template: 'status_update'
      };
      await sendEmail(requestId, emailData);
      setToastMessage('Email sent successfully');
      setShowToast(true);
    } catch (error) {
      setToastMessage('Failed to send email');
      setShowToast(true);
    }
  };

  const handleDownloadPDF = async (requestId: string) => {
    try {
      await downloadPDF(requestId);
      setToastMessage('PDF downloaded successfully');
      setShowToast(true);
    } catch (error) {
      setToastMessage('Failed to download PDF');
      setShowToast(true);
    }
  };

  const handleViewDetails = (requestId: string) => {
    history.push(`/view-details/${requestId}`);
  };

  const handleRepayment = async (requestId: string) => {
    try {
      const schedule = await getRepaymentSchedule(requestId);
      console.log('Repayment schedule:', schedule);
      // TODO: Show repayment modal or navigate to repayment page
    } catch (error) {
      setToastMessage('Failed to load repayment schedule');
      setShowToast(true);
    }
  };

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'under_review', label: 'Under Review' },
    { value: 'submitted_to_district_assistant', label: 'Submitted to District Assistant' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'disbursed', label: 'Disbursed' }
  ];

  const districtOptions = [
    { value: 'all', label: 'All Districts' },
    { value: 'Mumbai', label: 'Mumbai' },
    { value: 'Pune', label: 'Pune' },
    { value: 'Nagpur', label: 'Nagpur' },
    { value: 'Nashik', label: 'Nashik' },
    { value: 'Aurangabad', label: 'Aurangabad' },
    { value: 'Dhule', label: 'Dhule' }
  ];

  return (
    <IonPage>
      <IonSplitPane contentId="dashboard-content">
        {/* Sidebar */}
        <Sidebar />
        
        {/* Main Content */}
        <div className="main-content" id="dashboard-content">
          {/* Header */}
          <DashboardHeader />
          
          {/* New Requests Content */}
          <IonContent className="new-requests-content">
            <div className="new-requests-container">
              {/* Search and Filter Section */}
              <div className="search-filter-section">
                <div className="search-section">
                  <IonSearchbar
                    value={searchQuery}
                    onIonInput={(e) => setSearchQuery(e.detail.value!)}
                    placeholder="Search by Loan ID, Name or District"
                    className="request-searchbar"
                  />
                </div>
                
                <div className="filter-section">
                  <div className="filter-group">
                    <label className="filter-label">Status</label>
                    <IonSelect
                      value={filters.status}
                      onIonChange={(e) => setFilters(prev => ({ ...prev, status: e.detail.value }))}
                      placeholder="Select Status"
                      className="filter-select"
                    >
                      {statusOptions.map(option => (
                        <IonSelectOption key={option.value} value={option.value}>
                          {option.label}
                        </IonSelectOption>
                      ))}
                    </IonSelect>
                  </div>
                  
                  <div className="filter-group">
                    <label className="filter-label">District</label>
                    <IonSelect
                      value={filters.district}
                      onIonChange={(e) => setFilters(prev => ({ ...prev, district: e.detail.value }))}
                      placeholder="Select District"
                      className="filter-select"
                    >
                      {districtOptions.map(option => (
                        <IonSelectOption key={option.value} value={option.value}>
                          {option.label}
                        </IonSelectOption>
                      ))}
                    </IonSelect>
                  </div>
                </div>
                
                <div className="view-controls">
                  <div className="view-toggle">
                    <IonButton
                      fill={viewMode === 'card' ? 'solid' : 'outline'}
                      size="small"
                      onClick={() => setViewMode('card')}
                      className="view-button"
                    >
                      <IonIcon icon={cardOutline} slot="start" />
                      Card View
                    </IonButton>
                    <IonButton
                      fill={viewMode === 'list' ? 'solid' : 'outline'}
                      size="small"
                      onClick={() => setViewMode('list')}
                      className="view-button"
                    >
                      <IonIcon icon={listOutline} slot="start" />
                      List View
                    </IonButton>
                  </div>
                  
                  <IonButton
                    fill="clear"
                    size="small"
                    onClick={() => refetch()}
                    className="refresh-button"
                  >
                    <IonIcon icon={refreshOutline} />
                  </IonButton>
                </div>
              </div>

              {/* Results Section */}
              <div className="results-section">
                {isLoading ? (
                  <div className="loading-container">
                    <IonSpinner name="crescent" />
                    <p>Loading loan requests...</p>
                  </div>
                ) : error ? (
                  <div className="error-container">
                    <p>Error: {error}</p>
                    <IonButton fill="outline" onClick={() => refetch()}>
                      Retry
                    </IonButton>
                  </div>
                ) : (
                  <>
                    <div className="results-header">
                      <h2>Loan Requests ({pagination.total})</h2>
                      <p>Showing {requests?.length || 0} of {pagination.total} requests</p>
                    </div>
                    
                        {viewMode === 'card' ? (
                          <RequestCard
                            requests={requests || []}
                            onStatusChange={handleStatusChange}
                            onViewDetails={handleViewDetails}
                            onSendEmail={handleSendEmail}
                            onDownloadPDF={handleDownloadPDF}
                            onRepayment={handleRepayment}
                          />
                        ) : (
                      <RequestList
                        requests={requests || []}
                        onStatusChange={handleStatusChange}
                        onViewDetails={handleViewDetails}
                        onSendEmail={handleSendEmail}
                        onDownloadPDF={handleDownloadPDF}
                        onRepayment={handleRepayment}
                      />
                    )}
                  </>
                )}
              </div>
            </div>
          </IonContent>
        </div>
      </IonSplitPane>

      {/* Status Change Confirmation Alert */}
      <IonAlert
        isOpen={showStatusAlert}
        onDidDismiss={() => setShowStatusAlert(false)}
        header="Confirm Status Change"
        message={`Are you sure you want to change the status to ${filters.status}?`}
        buttons={[
          {
            text: 'Cancel',
            role: 'cancel',
          },
          {
            text: 'Confirm',
            handler: confirmStatusChange
          }
        ]}
      />

      {/* Toast for notifications */}
      <IonToast
        isOpen={showToast}
        onDidDismiss={() => setShowToast(false)}
        message={toastMessage}
        duration={3000}
        position="top"
      />
    </IonPage>
  );
};

export default NewRequests;
