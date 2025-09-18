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
  IonToast,
  IonPopover,
  IonList,
  IonItem,
  IonLabel
} from '@ionic/react';
import { 
  refreshOutline,
  chevronDownOutline
} from 'ionicons/icons';
import Sidebar from '../components/sidebar/Sidebar';
import DashboardHeader from '../components/header/DashboardHeader';
// Import RequestCard component
import RequestCardNew from '../../components/requests/RequestCardNew';
import RepaymentModal from '../../components/requests/RepaymentModal';
import StatusLogsModal from '../../components/modals/StatusLogsModal';
import { useLoanRequests } from '../hooks/useLoanRequests';
import { RequestSearchParams, RequestFilters, LoanRequest, EMISchedule } from '../../types';
import { generateMockEmiSchedule } from '../../utils/mockEmiGenerator';
import './NewRequests.css';

const NewRequests: React.FC = () => {
  const history = useHistory();
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
  const [showRepaymentModal, setShowRepaymentModal] = useState(false);
  const [selectedRequestForRepayment, setSelectedRequestForRepayment] = useState<LoanRequest | null>(null);
  const [emiSchedule, setEmiSchedule] = useState<EMISchedule[]>([]);
  
  // Status logs modal state
  const [showStatusLogsModal, setShowStatusLogsModal] = useState(false);
  const [selectedRequestForLogs, setSelectedRequestForLogs] = useState<string | null>(null);
  const [statusLogs, setStatusLogs] = useState<Array<{status: string; user: string; time: string; document?: string}>>([]);

  // District popover state for searchable dropdown
  const [districtPopoverOpen, setDistrictPopoverOpen] = useState(false);
  const [districtPopoverEvent, setDistrictPopoverEvent] = useState<Event | undefined>(undefined);
  const [districtSearch, setDistrictSearch] = useState('');

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
      const request = requests?.find(req => req.id === requestId) || null;
      if (!request) {
        setToastMessage('Request not found');
        setShowToast(true);
        return;
      }

      setSelectedRequestForRepayment(request);

      // For now, generate a mock EMI schedule to populate the modal UI
      const mockSchedule = generateMockEmiSchedule(request);
      setEmiSchedule(mockSchedule);
      setShowRepaymentModal(true);

      // TODO: Replace with actual API data when available
      // const schedule = await getRepaymentSchedule(requestId);
      // setEmiSchedule(schedule);
    } catch (error) {
      setToastMessage('Failed to load repayment schedule');
      setShowToast(true);
    }
  };
  
  const handleViewStatusLogs = (requestId: string) => {
    try {
      const request = requests?.find(req => req.id === requestId);
      if (!request) {
        setToastMessage('Request not found');
        setShowToast(true);
        return;
      }
      
      setSelectedRequestForLogs(requestId);
      
      // Mock status logs data - replace with API call in production
      const mockStatusLogs = [
        {
          status: 'pending',
          user: 'N/A',
          time: '9/8/2025, 5:26:52 PM',
          document: 'No Document',
          fields: {
            'Application ID': 'APP-2025-001',
            'Submitted By': 'John Doe',
            'Contact': '+91 98765 43210'
          }
        },
        {
          status: 'Application Received',
          user: 'Admin',
          time: '9/18/2025, 2:00:14 PM',
          document: 'No Document',
          fields: {
            'Received By': 'District Office',
            'Reference Number': 'REF-2025-001',
            'Priority': 'Normal'
          }
        }
      ];
      
      setStatusLogs(mockStatusLogs);
      setShowStatusLogsModal(true);
    } catch (error) {
      setToastMessage('Failed to load status logs');
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
              <div className="search-filter-bar">
                <IonSearchbar
                  value={searchQuery}
                  onIonInput={(e) => setSearchQuery(e.detail.value!)}
                  placeholder="Search by Loan ID, Name or District"
                  className="request-searchbar"
                />
                
                <IonSelect
                  value={filters.status}
                  onIonChange={(e) => setFilters((prev: RequestFilters) => ({ ...prev, status: e.detail.value }))}
                  placeholder="All Status"
                  className="filter-select-dropdown"
                  interface="popover"
                  interfaceOptions={{ cssClass: 'newreq-select-popover' }}
                >
                  {statusOptions.map(option => (
                    <IonSelectOption key={option.value} value={option.value}>
                      {option.label}
                    </IonSelectOption>
                  ))}
                </IonSelect>
                
                {/* Searchable District Dropdown (Popover) */}
                <button
                  type="button"
                  className="filter-select-trigger"
                  onClick={(e) => {
                    setDistrictPopoverEvent(e.nativeEvent);
                    setDistrictPopoverOpen(true);
                  }}
                >
                  <span>{districtOptions.find(o => o.value === filters.district)?.label || 'All Districts'}</span>
                  <IonIcon icon={chevronDownOutline} />
                </button>
                <IonPopover
                  isOpen={districtPopoverOpen}
                  event={districtPopoverEvent}
                  onDidDismiss={() => setDistrictPopoverOpen(false)}
                  cssClass="newreq-select-popover"
                >
                  <IonContent>
                    <IonSearchbar
                      value={districtSearch}
                      onIonInput={(e) => setDistrictSearch(e.detail.value!)}
                      placeholder="Search districts"
                      className="popover-searchbar"
                    />
                    <IonList>
                      {districtOptions
                        .filter(o => o.label.toLowerCase().includes(districtSearch.toLowerCase()))
                        .map(option => (
                          <IonItem button key={option.value} onClick={() => {
                            setFilters((prev: RequestFilters) => ({ ...prev, district: option.value }));
                            setDistrictPopoverOpen(false);
                          }}>
                            <IonLabel>{option.label}</IonLabel>
                          </IonItem>
                        ))}
                    </IonList>
                  </IonContent>
                </IonPopover>
                
                <IonButton
                  fill="clear"
                  onClick={() => refetch()}
                  className="refresh-btn"
                >
                  <IonIcon slot="icon-only" icon={refreshOutline} />
                  <span className="refresh-text">REFRESH</span>
                </IonButton>
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
                    
                    <RequestCardNew
                      requests={requests || []}
                      onStatusChange={handleStatusChange}
                      onViewDetails={handleViewDetails}
                      onSendEmail={handleSendEmail}
                      onDownloadPDF={handleDownloadPDF}
                      onRepayment={handleRepayment}
                      onViewStatusLogs={handleViewStatusLogs}
                    />
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

      <RepaymentModal
        isOpen={showRepaymentModal}
        onClose={() => {
          setShowRepaymentModal(false);
          setSelectedRequestForRepayment(null);
          setEmiSchedule([]);
        }}
        request={selectedRequestForRepayment}
        emiSchedule={emiSchedule}
      />
      
      {/* Status Logs Modal */}
      <StatusLogsModal
        isOpen={showStatusLogsModal}
        onClose={() => {
          setShowStatusLogsModal(false);
          setSelectedRequestForLogs(null);
        }}
        requestId={selectedRequestForLogs}
        statusLogs={statusLogs}
        onDownloadPDF={handleDownloadPDF}
      />
    </IonPage>
  );
};

export default NewRequests;