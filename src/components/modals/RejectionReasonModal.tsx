import React, { useState, useRef } from 'react';
import {
  IonModal,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButton,
  IonButtons,
  IonIcon,
  IonItem,
  IonLabel,
  IonSearchbar,
  IonList,
  IonChip,
  IonFooter
} from '@ionic/react';
import { closeOutline, checkmarkOutline } from 'ionicons/icons';
import './RejectionReasonModal.css';

interface RejectionReasonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => void;
}

const RejectionReasonModal: React.FC<RejectionReasonModalProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const modal = useRef<HTMLIonModalElement>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReason, setSelectedReason] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Predefined rejection reasons
  const rejectionReasons = [
    'User has not paid previous loan',
    'Test Rejection',
    'Testing now',
    'Applicant is not valid',
    'Insufficient documentation provided',
    'Income verification failed',
    'Credit score below minimum requirement',
    'Collateral valuation insufficient',
    'Application incomplete',
    'Age criteria not met',
    'Employment verification failed',
    'Bank account verification failed',
    'Duplicate application found',
    'Scheme eligibility not met',
    'Property documents invalid',
    'KYC verification pending',
    'Guarantor details incomplete',
    'Previous loan default record',
    'Monthly income insufficient',
    'Business verification failed',
    'Address verification failed',
    'Contact verification failed',
    'Document authenticity questioned',
    'Policy compliance issues',
    'Risk assessment unfavorable',
    'External agency verification failed',
    'Background check concerns',
    'Financial stability concerns',
    'Legal clearance pending',
    'Regulatory compliance issues',
    'Technical issues in processing',
    'Data inconsistency found',
    'Third party verification failed',
    'Manual review required',
    'Additional information needed',
    'Timeout in verification process',
    'System error during processing',
    'External dependency failure',
    'Quality check failed'
  ];

  // Filter reasons based on search query
  const filteredReasons = rejectionReasons.filter(reason =>
    reason.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredReasons.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedReasons = filteredReasons.slice(startIndex, endIndex);
  const showingText = `Showing ${Math.min(filteredReasons.length, itemsPerPage * currentPage)} of ${filteredReasons.length} items`;

  const handleReasonSelect = (reason: string) => {
    setSelectedReason(reason);
  };

  const handleSubmit = () => {
    if (selectedReason) {
      onSubmit(selectedReason);
      handleClose();
    }
  };

  const handleClose = () => {
    setSelectedReason('');
    setSearchQuery('');
    setCurrentPage(1);
    onClose();
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    const maxVisibleButtons = 4;
    
    // First button
    buttons.push(
      <IonButton
        key="first"
        fill={currentPage === 1 ? "solid" : "outline"}
        size="small"
        className={`pagination-btn ${currentPage === 1 ? 'active' : ''}`}
        onClick={() => goToPage(1)}
      >
        First
      </IonButton>
    );

    // Previous button
    buttons.push(
      <IonButton
        key="prev"
        fill="outline"
        size="small"
        className="pagination-btn"
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Previous
      </IonButton>
    );

    // Page numbers
    for (let i = 1; i <= Math.min(maxVisibleButtons, totalPages); i++) {
      buttons.push(
        <IonButton
          key={i}
          fill={i === currentPage ? "solid" : "outline"}
          size="small"
          className={`pagination-btn page-number ${i === currentPage ? 'active' : ''}`}
          onClick={() => goToPage(i)}
        >
          {i}
        </IonButton>
      );
    }

    // Next button
    buttons.push(
      <IonButton
        key="next"
        fill="outline"
        size="small"
        className="pagination-btn"
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </IonButton>
    );

    // Last button
    buttons.push(
      <IonButton
        key="last"
        fill={currentPage === totalPages ? "solid" : "outline"}
        size="small"
        className={`pagination-btn ${currentPage === totalPages ? 'active' : ''}`}
        onClick={() => goToPage(totalPages)}
      >
        Last
      </IonButton>
    );

    return buttons;
  };

  return (
    <IonModal ref={modal} isOpen={isOpen} onDidDismiss={handleClose} className="rejection-modal">
      <IonHeader className="modal-header">
        <IonToolbar>
          <IonTitle className="modal-title">Rejection Reason</IonTitle>
          <IonButtons slot="end">
            <IonButton fill="clear" onClick={handleClose} className="close-btn">
              <span className="close-text">Close</span>
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="modal-content">
        <div className="modal-body">
          <div className="reason-section">
            <IonLabel className="reason-label">Reason</IonLabel>
            <div className="searchbar-container">
              <IonSearchbar
                value={searchQuery}
                onIonInput={(e) => {
                  setSearchQuery(e.detail.value!);
                  setCurrentPage(1); // Reset to first page when searching
                }}
                placeholder="Type or select a reason"
                className="reason-searchbar"
                showClearButton="focus"
              />
            </div>
          </div>

          {/* Selected reason chip */}
          {selectedReason && (
            <div className="selected-reason">
              <IonChip color="primary" className="selected-chip">
                <IonIcon icon={checkmarkOutline} />
                <IonLabel>{selectedReason}</IonLabel>
                <IonIcon 
                  icon={closeOutline} 
                  onClick={() => setSelectedReason('')}
                  className="remove-icon"
                />
              </IonChip>
            </div>
          )}

          {/* Reasons list */}
          <IonList className="reasons-list">
            {paginatedReasons.map((reason, index) => (
              <IonItem
                key={`${startIndex + index}`}
                button
                className={`reason-item ${selectedReason === reason ? 'selected' : ''}`}
                onClick={() => handleReasonSelect(reason)}
              >
                <IonLabel className="reason-text">{reason}</IonLabel>
                {selectedReason === reason && (
                  <IonIcon icon={checkmarkOutline} slot="end" color="primary" />
                )}
              </IonItem>
            ))}
          </IonList>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination-section">
              <div className="pagination-controls">
                {renderPaginationButtons()}
              </div>
              <div className="pagination-info">
                <span className="items-per-page">Items per page: {itemsPerPage}</span>
                <span className="showing-text">{showingText}</span>
              </div>
            </div>
          )}
        </div>
      </IonContent>

      <IonFooter className="modal-footer">
        <IonToolbar>
          <div className="footer-actions">
            <IonButton
              fill="clear"
              color="medium"
              onClick={handleClose}
              className="cancel-btn"
            >
              Cancel
            </IonButton>
            <IonButton
              fill="solid"
              color="danger"
              onClick={handleSubmit}
              disabled={!selectedReason}
              className="submit-btn"
            >
              Submit
            </IonButton>
          </div>
        </IonToolbar>
      </IonFooter>
    </IonModal>
  );
};

export default RejectionReasonModal;
