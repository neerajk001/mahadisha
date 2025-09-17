import React, { useState, useEffect } from 'react';
import {
  IonPage, IonContent, IonSplitPane, IonHeader, IonToolbar, IonTitle,
  IonSegment, IonSegmentButton, IonLabel, IonIcon, IonSpinner, IonButton,
  IonBackButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardTitle,
  IonGrid, IonRow, IonCol, IonItem, IonText, IonChip, IonAlert, IonToast
} from '@ionic/react';
import { 
  clipboardOutline, folderOutline, personOutline, homeOutline, 
  documentTextOutline, shieldCheckmarkOutline, businessOutline,
  arrowBackOutline, downloadOutline, mailOutline, refreshOutline,
  checkmarkCircleOutline, closeCircleOutline, warningOutline
} from 'ionicons/icons';
import { useParams, useHistory } from 'react-router-dom';
import Sidebar from '../admin/components/sidebar/Sidebar';
import RejectionReasonModal from '../components/modals/RejectionReasonModal';
import IncompleteReasonModal from '../components/modals/IncompleteReasonModal';
import { loanRequestAPI, mockDataService } from '../services/api';
import { shouldUseMockData } from '../config/environment';
import type { LoanRequestDetails } from '../types';
import './ViewDetails.css';

const ViewDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const [activeTab, setActiveTab] = useState('scheme');
  const [requestDetails, setRequestDetails] = useState<LoanRequestDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showActionAlert, setShowActionAlert] = useState(false);
  const [selectedAction, setSelectedAction] = useState<string>('');
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [showIncompleteModal, setShowIncompleteModal] = useState(false);

  useEffect(() => {
    fetchRequestDetails();
  }, [id]);

  // Handle scroll indicators
  useEffect(() => {
    const tabsContainer = document.querySelector('.tabs-container');
    if (tabsContainer) {
      const handleScroll = () => {
        tabsContainer.classList.add('scrolled');
      };
      
      tabsContainer.addEventListener('scroll', handleScroll, { passive: true });
      tabsContainer.addEventListener('touchstart', handleScroll, { passive: true });
      
      return () => {
        tabsContainer.removeEventListener('scroll', handleScroll);
        tabsContainer.removeEventListener('touchstart', handleScroll);
      };
    }
  }, [requestDetails]);

  const fetchRequestDetails = async () => {
    try {
      setIsLoading(true);
      setError(null);

      let details: LoanRequestDetails;
      if (shouldUseMockData()) {
        details = mockDataService.getLoanRequestDetails(id);
      } else {
        details = await loanRequestAPI.getDetails(id);
      }

      setRequestDetails(details);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch request details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadDocument = (documentId: string, documentName: string) => {
    setToastMessage(`Downloading ${documentName}...`);
    setShowToast(true);
    // Implement actual download logic here
  };

  const handleSendEmail = () => {
    setAlertMessage('Email functionality will be implemented');
    setShowAlert(true);
  };

  const handleAction = (action: string) => {
    setSelectedAction(action);
    if (action === 'reject') {
      setShowRejectionModal(true);
    } else if (action === 'incomplete') {
      setShowIncompleteModal(true);
    } else {
      setShowActionAlert(true);
    }
  };

  const confirmAction = async () => {
    try {
      // Here you would make the API call to update the request status
      let newStatus = '';
      let message = '';
      
      switch (selectedAction) {
        case 'next_action':
          newStatus = 'under_review';
          message = 'Request moved to next action successfully';
          break;
      }
      
      // TODO: Replace with actual API call
      // await updateRequestStatus(id, newStatus);
      
      setToastMessage(message);
      setShowToast(true);
      
      // Refresh the data after action
      await fetchRequestDetails();
      
    } catch (error) {
      setToastMessage('Failed to perform action. Please try again.');
      setShowToast(true);
    } finally {
      setShowActionAlert(false);
      setSelectedAction('');
    }
  };

  const handleRejectionSubmit = async (reason: string) => {
    try {
      // TODO: Replace with actual API call to reject the request with reason
      // await rejectRequest(id, reason);
      
      console.log('Request rejected with reason:', reason);
      setToastMessage(`Request has been rejected. Reason: ${reason}`);
      setShowToast(true);
      
      // Refresh the data after rejection
      await fetchRequestDetails();
      
    } catch (error) {
      setToastMessage('Failed to reject request. Please try again.');
      setShowToast(true);
    } finally {
      setShowRejectionModal(false);
    }
  };

  const handleIncompleteSubmit = async (reason: string) => {
    try {
      // TODO: Replace with actual API call to mark request as incomplete with reason
      // await markIncomplete(id, reason);
      
      console.log('Request marked as incomplete with reason:', reason);
      setToastMessage(`Request marked as incomplete. Reason: ${reason}`);
      setShowToast(true);
      
      // Refresh the data after marking incomplete
      await fetchRequestDetails();
      
    } catch (error) {
      setToastMessage('Failed to mark request as incomplete. Please try again.');
      setShowToast(true);
    } finally {
      setShowIncompleteModal(false);
    }
  };

  const getActionAlertMessage = () => {
    switch (selectedAction) {
      case 'next_action':
        return 'Are you sure you want to move this request to the next action?';
      default:
        return '';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'under_review': return 'primary';
      case 'approved': return 'success';
      case 'rejected': return 'danger';
      case 'disbursed': return 'secondary';
      case 'submitted_to_district_assistant': return 'success';
      default: return 'medium';
    }
  };

  const formatStatus = (status: string) => {
    switch (status) {
      case 'submitted_to_district_assistant':
        return 'Submitted to District Assistant';
      case 'under_review':
        return 'Under Review';
      default:
        return status.replace('_', ' ').toUpperCase();
    }
  };

  const renderSchemeDetails = () => {
    if (!requestDetails) return null;

    const { schemeDetails } = requestDetails;

    return (
      <div className="details-content">
        <IonGrid>
          <IonRow>
            <IonCol size="12" size-md="6">
              <IonCard className="info-card">
                <IonCardHeader>
                  <IonCardTitle className="card-title">
                    <IonIcon icon={clipboardOutline} className="title-icon" />
                    Basic Info
                  </IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <div className="info-list">
                    <div className="info-item">
                      <IonIcon icon={personOutline} className="info-icon" />
                      <span className="info-label">Name:</span>
                      <span className="info-value">{schemeDetails.name}</span>
                    </div>
                    <div className="info-item">
                      <IonIcon icon={folderOutline} className="info-icon" />
                      <span className="info-label">Type:</span>
                      <span className="info-value">{schemeDetails.type}</span>
                    </div>
                    <div className="info-item">
                      <IonIcon icon={documentTextOutline} className="info-icon" />
                      <span className="info-label">Marathi Name:</span>
                      <span className="info-value">{schemeDetails.marathiName}</span>
                    </div>
                    <div className="info-item">
                      <IonIcon icon={businessOutline} className="info-icon" />
                      <span className="info-label">Minimum Loan Limit:</span>
                      <span className="info-value">{formatCurrency(schemeDetails.minimumLoanLimit)}</span>
                    </div>
                    <div className="info-item">
                      <IonIcon icon={businessOutline} className="info-icon" />
                      <span className="info-label">Maximum Loan Limit:</span>
                      <span className="info-value">{formatCurrency(schemeDetails.maximumLoanLimit)}</span>
                    </div>
                    <div className="info-item">
                      <IonIcon icon={businessOutline} className="info-icon" />
                      <span className="info-label">Subsidy Limit:</span>
                      <span className="info-value">{schemeDetails.subsidyLimit}%</span>
                    </div>
                    <div className="info-item">
                      <IonIcon icon={businessOutline} className="info-icon" />
                      <span className="info-label">Maximum Subsidy Amount:</span>
                      <span className="info-value">{formatCurrency(schemeDetails.maximumSubsidyAmount)}</span>
                    </div>
                    <div className="info-item">
                      <IonIcon icon={businessOutline} className="info-icon" />
                      <span className="info-label">Down Payment (%):</span>
                      <span className="info-value">{schemeDetails.downPaymentPercent}%</span>
                    </div>
                  </div>
                </IonCardContent>
              </IonCard>
            </IonCol>

            <IonCol size="12" size-md="6">
              <IonCard className="info-card">
                <IonCardHeader>
                  <IonCardTitle className="card-title">
                    <IonIcon icon={folderOutline} className="title-icon" />
                    Additional Info
                  </IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <div className="info-list">
                    <div className="info-item">
                      <IonIcon icon={businessOutline} className="info-icon" />
                      <span className="info-label">Loan % by Vendor:</span>
                      <span className="info-value">{schemeDetails.loanPercentByVendor}%</span>
                    </div>
                    <div className="info-item">
                      <IonIcon icon={businessOutline} className="info-icon" />
                      <span className="info-label">Loan % by Partner:</span>
                      <span className="info-value">{schemeDetails.loanPercentByPartner}%</span>
                    </div>
                    <div className="info-item">
                      <IonIcon icon={businessOutline} className="info-icon" />
                      <span className="info-label">Vendor Interest (Yearly):</span>
                      <span className="info-value">{schemeDetails.vendorInterestYearly}%</span>
                    </div>
                    <div className="info-item">
                      <IonIcon icon={businessOutline} className="info-icon" />
                      <span className="info-label">Minimum Tenure:</span>
                      <span className="info-value">{schemeDetails.minimumTenure} years</span>
                    </div>
                    <div className="info-item">
                      <IonIcon icon={businessOutline} className="info-icon" />
                      <span className="info-label">Maximum Tenure:</span>
                      <span className="info-value">{schemeDetails.maximumTenure} years</span>
                    </div>
                    <div className="info-item">
                      <IonIcon icon={businessOutline} className="info-icon" />
                      <span className="info-label">Guarantee Amount:</span>
                      <span className="info-value">{formatCurrency(schemeDetails.guaranteeAmount * 100000)}</span>
                    </div>
                    <div className="info-item">
                      <IonIcon icon={businessOutline} className="info-icon" />
                      <span className="info-label">Interest Type:</span>
                      <span className="info-value">{schemeDetails.interestType}</span>
                    </div>
                  </div>
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>
        </IonGrid>
      </div>
    );
  };

  const renderPersonalInfo = () => {
    if (!requestDetails) return null;

    const { personalInfo } = requestDetails;

    return (
      <IonCard className="info-card">
          <IonCardHeader>
            <IonCardTitle className="card-title">
              <IonIcon icon={personOutline} className="title-icon" />
              Personal Information
            </IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <div className="info-list">
              <div className="info-item">
                <IonIcon icon={documentTextOutline} className="info-icon" />
                <span className="info-label">Aadhaar:</span>
                <span className="info-value">{personalInfo.aadhaar}</span>
              </div>
              <div className="info-item">
                <IonIcon icon={personOutline} className="info-icon" />
                <span className="info-label">First Name:</span>
                <span className="info-value">{personalInfo.firstName}</span>
              </div>
              <div className="info-item">
                <IonIcon icon={personOutline} className="info-icon" />
                <span className="info-label">Last Name:</span>
                <span className="info-value">{personalInfo.lastName}</span>
              </div>
              <div className="info-item">
                <IonIcon icon={personOutline} className="info-icon" />
                <span className="info-label">Gender:</span>
                <span className="info-value">{personalInfo.gender}</span>
              </div>
              <div className="info-item">
                <IonIcon icon={businessOutline} className="info-icon" />
                <span className="info-label">DOB:</span>
                <span className="info-value">{personalInfo.dob}</span>
              </div>
              <div className="info-item">
                <IonIcon icon={businessOutline} className="info-icon" />
                <span className="info-label">Mobile:</span>
                <span className="info-value">{personalInfo.mobile}</span>
              </div>
            </div>
          </IonCardContent>
        </IonCard>
    );
  };

  const renderBankingInfo = () => {
    if (!requestDetails) return null;

    const { bankingInfo } = requestDetails;

    return (
      <IonCard className="info-card">
          <IonCardHeader>
            <IonCardTitle className="card-title">
              <IonIcon icon={businessOutline} className="title-icon" />
              Banking Information
            </IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <div className="info-list">
              <div className="info-item">
                <IonIcon icon={personOutline} className="info-icon" />
                <span className="info-label">Bank Name:</span>
                <span className="info-value">{bankingInfo.bankName}</span>
              </div>
              <div className="info-item">
                <IonIcon icon={documentTextOutline} className="info-icon" />
                <span className="info-label">Account Number:</span>
                <span className="info-value">{bankingInfo.accountNumber}</span>
              </div>
              <div className="info-item">
                <IonIcon icon={documentTextOutline} className="info-icon" />
                <span className="info-label">IFSC:</span>
                <span className="info-value">{bankingInfo.ifsc}</span>
              </div>
              <div className="info-item">
                <IonIcon icon={personOutline} className="info-icon" />
                <span className="info-label">Account Holder Name:</span>
                <span className="info-value">{bankingInfo.accountHolderName}</span>
              </div>
              <div className="info-item">
                <IonIcon icon={mailOutline} className="info-icon" />
                <span className="info-label">Email:</span>
                <span className="info-value">{bankingInfo.email}</span>
              </div>
            </div>
          </IonCardContent>
        </IonCard>
    );
  };

  const renderUserMetadata = () => {
    if (!requestDetails) return null;

    const { personalInfo } = requestDetails;

    return (
      <IonCard className="info-card">
          <IonCardHeader>
            <IonCardTitle className="card-title">
              <IonIcon icon={shieldCheckmarkOutline} className="title-icon" />
              User Metadata
            </IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <div className="info-list">
              <div className="info-item">
                <IonIcon icon={personOutline} className="info-icon" />
                <span className="info-label">Username:</span>
                <span className="info-value">{personalInfo.email}</span>
              </div>
              <div className="info-item">
                <IonIcon icon={mailOutline} className="info-icon" />
                <span className="info-label">Email:</span>
                <span className="info-value">{personalInfo.email}</span>
              </div>
              <div className="info-item">
                <IonIcon icon={businessOutline} className="info-icon" />
                <span className="info-label">Mobile:</span>
                <span className="info-value">{personalInfo.mobile}</span>
              </div>
              <div className="info-item">
                <IonIcon icon={homeOutline} className="info-icon" />
                <span className="info-label">District:</span>
                <span className="info-value">{requestDetails.district}</span>
              </div>
              <div className="info-item">
                <IonIcon icon={personOutline} className="info-icon" />
                <span className="info-label">Father Name:</span>
                <span className="info-value">{personalInfo.fatherName}</span>
              </div>
              <div className="info-item">
                <IonIcon icon={personOutline} className="info-icon" />
                <span className="info-label">Mother Name:</span>
                <span className="info-value">{personalInfo.motherName}</span>
              </div>
              <div className="info-item">
                <IonIcon icon={homeOutline} className="info-icon" />
                <span className="info-label">Village:</span>
                <span className="info-value">{personalInfo.village}</span>
              </div>
              <div className="info-item">
                <IonIcon icon={personOutline} className="info-icon" />
                <span className="info-label">Sub Caste:</span>
                <span className="info-value">{personalInfo.subCaste}</span>
              </div>
              <div className="info-item">
                <IonIcon icon={personOutline} className="info-icon" />
                <span className="info-label">Under Caste:</span>
                <span className="info-value">{personalInfo.underCaste}</span>
              </div>
              <div className="info-item">
                <IonIcon icon={documentTextOutline} className="info-icon" />
                <span className="info-label">Aadhaar:</span>
                <span className="info-value">{personalInfo.aadhaar}</span>
              </div>
              <div className="info-item">
                <IonIcon icon={shieldCheckmarkOutline} className="info-icon" />
                <span className="info-label">Role:</span>
                <span className="info-value">{personalInfo.role}</span>
              </div>
              <div className="info-item">
                <IonIcon icon={businessOutline} className="info-icon" />
                <span className="info-label">Created At:</span>
                <span className="info-value">{personalInfo.createdAt}</span>
              </div>
              <div className="info-item">
                <IonIcon icon={businessOutline} className="info-icon" />
                <span className="info-label">Updated At:</span>
                <span className="info-value">{personalInfo.updatedAt}</span>
              </div>
            </div>
          </IonCardContent>
        </IonCard>
    );
  };

  const handleAddressAction = (action: 'verify' | 'reject') => {
    console.log(`Address ${action}ed`);
    setToastMessage(`Address ${action}ed successfully`);
    setShowToast(true);
    // TODO: Implement actual API call
  };

  const handleGuarantorAction = (guarantorId: string, action: 'verify' | 'reject') => {
    console.log(`Guarantor ${guarantorId} ${action}ed`);
    setToastMessage(`Guarantor ${action}ed successfully`);
    setShowToast(true);
    // TODO: Implement actual API call
  };

  const renderAddressInfo = () => {
    if (!requestDetails) return null;

    const { addressInfo } = requestDetails;

    return (
      <div className="details-content">
        <IonCard className="info-card">
          <IonCardHeader>
            <IonCardTitle className="card-title">
              <IonIcon icon={homeOutline} className="title-icon" />
              Address Information
            </IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <div className="info-list">
              <div className="info-item">
                <IonIcon icon={homeOutline} className="info-icon" />
                <span className="info-label">Current Address:</span>
                <span className="info-value">{addressInfo.currentAddress}</span>
              </div>
              <div className="info-item">
                <IonIcon icon={homeOutline} className="info-icon" />
                <span className="info-label">Permanent Address:</span>
                <span className="info-value">{addressInfo.permanentAddress}</span>
              </div>
              <div className="info-item">
                <IonIcon icon={homeOutline} className="info-icon" />
                <span className="info-label">Pincode:</span>
                <span className="info-value">{addressInfo.pincode}</span>
              </div>
              <div className="info-item">
                <IonIcon icon={homeOutline} className="info-icon" />
                <span className="info-label">State:</span>
                <span className="info-value">{addressInfo.state}</span>
              </div>
              <div className="info-item">
                <IonIcon icon={homeOutline} className="info-icon" />
                <span className="info-label">District:</span>
                <span className="info-value">{addressInfo.district}</span>
              </div>
              <div className="info-item">
                <IonIcon icon={homeOutline} className="info-icon" />
                <span className="info-label">Taluka:</span>
                <span className="info-value">{addressInfo.taluka}</span>
              </div>
              <div className="info-item">
                <IonIcon icon={homeOutline} className="info-icon" />
                <span className="info-label">Village:</span>
                <span className="info-value">{addressInfo.village}</span>
              </div>
            </div>
            
            {/* Address Action Buttons */}
            <div className="address-action-buttons">
              <IonButton 
                className="action-button verify-address-button"
                onClick={() => handleAddressAction('verify')}
                disabled={requestDetails.status === 'approved' || requestDetails.status === 'rejected'}
              >
                <IonIcon icon={checkmarkCircleOutline} slot="start" />
                Verify Address
              </IonButton>
              
              <IonButton 
                className="action-button reject-address-button"
                onClick={() => handleAddressAction('reject')}
                disabled={requestDetails.status === 'approved' || requestDetails.status === 'rejected'}
              >
                <IonIcon icon={closeCircleOutline} slot="start" />
                Reject Address
              </IonButton>
            </div>
          </IonCardContent>
        </IonCard>
      </div>
    );
  };

  const renderDocuments = () => {
    if (!requestDetails) return null;

    // All required document types
    const requiredDocuments = [
      { id: 'bank-passbook', name: 'Bank Passbook', category: 'Financial' },
      { id: 'caste-certificate', name: 'Caste Certificate', category: 'Identity' },
      { id: 'witness1-address', name: 'Witness 1 Address Proof', category: 'Witness' },
      { id: 'income-certificate', name: 'Income Certificate', category: 'Financial' },
      { id: 'witness1-photo-id', name: 'Witness 1 Photo ID', category: 'Witness' },
      { id: 'other-documents', name: 'Other Documents', category: 'Miscellaneous' },
      { id: 'pan', name: 'PAN', category: 'Identity' },
      { id: 'passport-photo', name: 'Passport Photo', category: 'Identity' },
      { id: 'bonafide-certificates', name: 'Bonafide Certificates', category: 'Educational' },
      { id: 'witness2-photo-id', name: 'Witness 2 Photo ID', category: 'Witness' },
      { id: 'aadhaar', name: 'Aadhaar', category: 'Identity' },
      { id: 'residential-proof', name: 'Residential Proof', category: 'Address' },
      { id: 'witness2-address', name: 'Witness 2 Address Proof', category: 'Witness' }
    ];

    // Mock uploaded documents with some sample data
    const uploadedDocuments = [
      { id: 'pan', uploadDate: '9/8/2025', status: 'uploaded', verificationStatus: 'pending' },
      { id: 'aadhaar', uploadDate: '9/8/2025', status: 'uploaded', verificationStatus: 'pending' }
    ];

    const getDocumentStatus = (docId: string) => {
      const uploaded = uploadedDocuments.find(doc => doc.id === docId);
      return uploaded || null;
    };

    const handleDocumentAction = (docId: string, action: 'verify' | 'reject') => {
      console.log(`Document ${docId} ${action}ed`);
      setToastMessage(`Document ${action}ed successfully`);
      setShowToast(true);
      // TODO: Implement actual API call
    };

    return (
      <div className="details-content">
        <IonCard className="info-card">
          <IonCardHeader>
            <IonCardTitle className="card-title">
              <IonIcon icon={documentTextOutline} className="title-icon" />
              Documents
            </IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <div className="documents-grid">
              {requiredDocuments.map((doc) => {
                const documentStatus = getDocumentStatus(doc.id);
                const isUploaded = documentStatus !== null;

                return (
                  <div key={doc.id} className="document-card">
                    <div className="document-header">
                      <h3 className="document-title">{doc.name}</h3>
                      {isUploaded && (
                        <div className="document-actions">
                          <IonButton
                            fill="solid"
                            size="small"
                            color="success"
                            className="verify-btn"
                            onClick={() => handleDocumentAction(doc.id, 'verify')}
                          >
                            Verify
                          </IonButton>
                          <IonButton
                            fill="solid"
                            size="small"
                            color="danger"
                            className="reject-btn"
                            onClick={() => handleDocumentAction(doc.id, 'reject')}
                          >
                            Reject
                          </IonButton>
                        </div>
                      )}
                    </div>
                    
                    <div className="document-content">
                      {isUploaded ? (
                        <div className="document-uploaded">
                          <div className="document-info-row">
                            <span className="info-label">Document</span>
                            <IonButton
                              fill="clear"
                              size="small"
                              className="view-document-btn"
                              onClick={() => handleDownloadDocument(doc.id, doc.name)}
                            >
                              <IonIcon icon={documentTextOutline} slot="start" />
                              View
                            </IonButton>
                          </div>
                          <div className="document-info-row">
                            <span className="info-label">Date:</span>
                            <span className="info-value">{documentStatus.uploadDate}</span>
                          </div>
                        </div>
                      ) : (
                        <div className="document-not-found">
                          <span className="not-found-text">Document not found!</span>
                          <IonButton
                            fill="solid"
                            size="small"
                            color="warning"
                            className="upload-btn"
                          >
                            Upload Document
                          </IonButton>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </IonCardContent>
        </IonCard>
      </div>
    );
  };

  const renderGuarantors = () => {
    if (!requestDetails) return null;

    const { guarantors } = requestDetails;

    return (
      <div className="details-content">
        <IonCard className="info-card">
          <IonCardHeader>
            <IonCardTitle className="card-title">
              <IonIcon icon={shieldCheckmarkOutline} className="title-icon" />
              Guarantors
            </IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <div className="guarantors-list">
              {guarantors.map((guarantor) => (
                <div key={guarantor.id} className="guarantor-item">
                  <div className="guarantor-info">
                    <IonIcon icon={personOutline} className="guarantor-icon" />
                    <div className="guarantor-details">
                      <span className="guarantor-name">{guarantor.name}</span>
                      <span className="guarantor-relationship">{guarantor.relationship}</span>
                      <span className="guarantor-mobile">{guarantor.mobile}</span>
                    </div>
                  </div>
                  
                  {/* Guarantor Action Buttons */}
                  <div className="guarantor-actions">
                    <IonButton 
                      fill="solid"
                      size="small"
                      color="success"
                      className="verify-btn"
                      onClick={() => handleGuarantorAction(guarantor.id, 'verify')}
                      disabled={requestDetails.status === 'approved' || requestDetails.status === 'rejected'}
                    >
                      <IonIcon icon={checkmarkCircleOutline} slot="start" />
                      Verify
                    </IonButton>
                    <IonButton 
                      fill="solid"
                      size="small"
                      color="danger"
                      className="reject-btn"
                      onClick={() => handleGuarantorAction(guarantor.id, 'reject')}
                      disabled={requestDetails.status === 'approved' || requestDetails.status === 'rejected'}
                    >
                      <IonIcon icon={closeCircleOutline} slot="start" />
                      Reject
                    </IonButton>
                  </div>
                </div>
              ))}
            </div>
          </IonCardContent>
        </IonCard>
      </div>
    );
  };

  const renderCollaterals = () => {
    if (!requestDetails) return null;

    const { collaterals } = requestDetails;

    return (
      <div className="details-content">
        <IonCard className="info-card">
          <IonCardHeader>
            <IonCardTitle className="card-title">
              <IonIcon icon={businessOutline} className="title-icon" />
              Collaterals
            </IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            {collaterals && collaterals.length > 0 ? (
              <div className="collaterals-list">
                {collaterals.map((collateral) => (
                  <div key={collateral.id} className="collateral-item">
                    <div className="collateral-info">
                      <IonIcon icon={businessOutline} className="collateral-icon" />
                      <div className="collateral-details">
                        <span className="collateral-type">{collateral.type}</span>
                        <span className="collateral-description">{collateral.description}</span>
                        <span className="collateral-value">{formatCurrency(collateral.value)}</span>
                        <span className="collateral-location">{collateral.location}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-collaterals">
                <p>No Collaterals provided.</p>
              </div>
            )}
            
            {/* Action Buttons in Collaterals Section */}
            <div className="collateral-action-buttons">
              <IonButton 
                className="action-button next-action-button"
                onClick={() => handleAction('next_action')}
                disabled={requestDetails.status === 'approved' || requestDetails.status === 'rejected'}
              >
                <IonIcon icon={checkmarkCircleOutline} slot="start" />
                Next Action
              </IonButton>
              
              <IonButton 
                className="action-button reject-button"
                onClick={() => handleAction('reject')}
                disabled={requestDetails.status === 'approved' || requestDetails.status === 'rejected'}
              >
                <IonIcon icon={closeCircleOutline} slot="start" />
                Reject
              </IonButton>
              
              <IonButton 
                className="action-button incomplete-button"
                onClick={() => handleAction('incomplete')}
                disabled={requestDetails.status === 'approved' || requestDetails.status === 'rejected'}
              >
                <IonIcon icon={warningOutline} slot="start" />
                Incomplete Application
              </IonButton>
            </div>
          </IonCardContent>
        </IonCard>
      </div>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'scheme':
        return renderSchemeDetails();
      case 'applicant':
        return (
          <div className="three-card-layout">
            {renderPersonalInfo()}
            {renderBankingInfo()}
            {renderUserMetadata()}
          </div>
        );
      case 'address':
        return renderAddressInfo();
      case 'documents':
        return renderDocuments();
      case 'guarantors':
        return renderGuarantors();
      case 'collaterals':
        return renderCollaterals();
      default:
        return renderSchemeDetails();
    }
  };

  if (isLoading) {
    return (
      <IonPage>
        <IonSplitPane contentId="dashboard-content">
          <Sidebar />
          <div className="main-content" id="dashboard-content">
            <div className="loading-container">
              <IonSpinner name="crescent" />
              <p>Loading request details...</p>
            </div>
          </div>
        </IonSplitPane>
      </IonPage>
    );
  }

  if (error) {
    return (
      <IonPage>
        <IonSplitPane contentId="dashboard-content">
          <Sidebar />
          <div className="main-content" id="dashboard-content">
            <div className="error-container">
              <p>Error: {error}</p>
              <IonButton fill="outline" onClick={fetchRequestDetails}>
                <IonIcon icon={refreshOutline} slot="start" />
                Retry
              </IonButton>
            </div>
          </div>
        </IonSplitPane>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonSplitPane contentId="dashboard-content">
        <Sidebar />
        <div className="main-content" id="dashboard-content">
          <IonHeader className="view-details-header">
            <IonToolbar>
              <IonButtons slot="start">
                <IonBackButton defaultHref="/new-requests" />
              </IonButtons>
              <IonTitle className="page-title">
                {requestDetails?.loanId ? `${requestDetails.loanId} Details` : 'Request Details'}
              </IonTitle>
              <IonButtons slot="end">
                <IonButton fill="clear" onClick={handleSendEmail}>
                  <IonIcon icon={mailOutline} />
                </IonButton>
                <IonButton fill="clear" onClick={fetchRequestDetails}>
                  <IonIcon icon={refreshOutline} />
                </IonButton>
              </IonButtons>
            </IonToolbar>
            
            {requestDetails && (
              <div className="request-summary">
                <div className="summary-info">
                  <h2>{requestDetails.applicantName}</h2>
                  <p>{requestDetails.district} • {requestDetails.applicationType}</p>
                  <IonChip color={getStatusColor(requestDetails.status)} className="status-chip">
                    {formatStatus(requestDetails.status)}
                  </IonChip>
                </div>
                <div className="summary-amount">
                  <span className="amount-label">Loan Amount</span>
                  <span className="amount-value">{formatCurrency(requestDetails.loanAmount)}</span>
                </div>
              </div>
            )}

            <div className="tabs-container">
              <IonSegment value={activeTab} onIonChange={(e) => setActiveTab(e.detail.value as string)}>
                <IonSegmentButton value="scheme">
                  <IonLabel>Scheme</IonLabel>
                </IonSegmentButton>
                <IonSegmentButton value="applicant">
                  <IonLabel>Applicant</IonLabel>
                </IonSegmentButton>
                <IonSegmentButton value="address">
                  <IonLabel>Address</IonLabel>
                </IonSegmentButton>
                <IonSegmentButton value="documents">
                  <IonLabel>Documents</IonLabel>
                </IonSegmentButton>
                <IonSegmentButton value="guarantors">
                  <IonLabel>Guarantors</IonLabel>
                </IonSegmentButton>
                <IonSegmentButton value="collaterals">
                  <IonLabel>Collaterals</IonLabel>
                </IonSegmentButton>
              </IonSegment>
            </div>
          </IonHeader>

          <IonContent className="view-details-content">
            {renderTabContent()}
          </IonContent>
        </div>
      </IonSplitPane>

      <IonAlert
        isOpen={showAlert}
        onDidDismiss={() => setShowAlert(false)}
        header="Information"
        message={alertMessage}
        buttons={['OK']}
      />

      <IonAlert
        isOpen={showActionAlert}
        onDidDismiss={() => setShowActionAlert(false)}
        header="Confirm Action"
        message={getActionAlertMessage()}
        buttons={[
          {
            text: 'Cancel',
            role: 'cancel'
          },
          {
            text: 'Confirm',
            handler: confirmAction
          }
        ]}
      />

      <IonToast
        isOpen={showToast}
        onDidDismiss={() => setShowToast(false)}
        message={toastMessage}
        duration={2000}
        position="bottom"
      />

      <RejectionReasonModal
        isOpen={showRejectionModal}
        onClose={() => setShowRejectionModal(false)}
        onSubmit={handleRejectionSubmit}
      />

      <IncompleteReasonModal
        isOpen={showIncompleteModal}
        onClose={() => setShowIncompleteModal(false)}
        onSubmit={handleIncompleteSubmit}
      />
    </IonPage>
  );
};

export default ViewDetails;
