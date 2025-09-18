import React, { useState } from 'react';
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonButtons,
  IonIcon,
  IonCard,
  IonCardContent,
  IonGrid,
  IonRow,
  IonCol,
  IonText,
  IonBadge,
  IonItem,
  IonLabel
} from '@ionic/react';
import {
  closeOutline,
  calendarOutline,
  cashOutline,
  documentTextOutline,
  filterOutline,
  chevronBackOutline,
  chevronForwardOutline
} from 'ionicons/icons';
import type { LoanRequest, EMISchedule } from '../../types';
import './RepaymentModal.css';

interface RepaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: LoanRequest | null;
  emiSchedule: EMISchedule[];
}

const RepaymentModal: React.FC<RepaymentModalProps> = ({
  isOpen,
  onClose,
  request,
  emiSchedule
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Filter EMI schedule based on status
  const filteredSchedule = React.useMemo(() => {
    if (filterStatus === 'All') return emiSchedule;
    return emiSchedule.filter(emi => emi.status === filterStatus);
  }, [emiSchedule, filterStatus]);

  // Paginate filtered results
  const totalPages = Math.ceil(filteredSchedule.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentEMIs = filteredSchedule.slice(startIndex, endIndex);

  // Calculate totals
  const paidEMIs = emiSchedule.filter(emi => emi.status === 'Paid').length;
  const totalEMIs = emiSchedule.length;
  const unpaidEMIs = totalEMIs - paidEMIs;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid': return 'success';
      case 'Unpaid': return 'danger';
      case 'Overdue': return 'warning';
      default: return 'medium';
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  if (!request) return null;

  return (
    <IonModal isOpen={isOpen} onDidDismiss={onClose} className="repayment-modal">
      <IonHeader>
        <IonToolbar className="repayment-toolbar">
          <IonTitle>Loan Repayment Details</IonTitle>
          <IonButtons slot="end">
            <IonButton fill="clear" onClick={onClose}>
              <IonIcon icon={closeOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="repayment-content">
        {/* Loan Information Header */}
        <IonCard className="loan-info-card">
          <IonCardContent>
            <IonGrid>
              <IonRow>
                <IonCol size="12" size-md="6">
                  <div className="loan-info-item">
                    <IonIcon icon={documentTextOutline} className="info-icon" />
                    <div>
                      <div className="info-label">Scheme:</div>
                      <div className="info-value">{request.scheme || 'Margin Money Scheme (State)'}</div>
                      <div className="info-loan-id">Loan ID : {request.loanId}</div>
                      <div className="info-applicant">Applicant: {request.applicantName}</div>
                    </div>
                  </div>
                </IonCol>
                <IonCol size="12" size-md="6">
                  <div className="loan-info-item">
                    <IonIcon icon={cashOutline} className="info-icon" />
                    <div>
                      <div className="info-label">Scheme:</div>
                      <div className="info-value">Subsidy Scheme (State)</div>
                      <div className="info-loan-id">Loan ID : {request.secondaryLoanId || 'QFE94FJQA2'}</div>
                      <div className="info-applicant">Applicant: {request.applicantName}</div>
                    </div>
                  </div>
                </IonCol>
              </IonRow>

              <IonRow className="loan-details-row">
                <IonCol size="6" size-md="3">
                  <div className="detail-item">
                    <div className="detail-label">Activity:</div>
                    <div className="detail-value">{request.activity}</div>
                  </div>
                </IonCol>
                <IonCol size="6" size-md="3">
                  <div className="detail-item">
                    <div className="detail-label">District:</div>
                    <div className="detail-value">{request.district}</div>
                  </div>
                </IonCol>
                <IonCol size="6" size-md="3">
                  <div className="detail-item">
                    <div className="detail-label">Loan Amount:</div>
                    <div className="detail-value">{formatCurrency(request.loanAmount)}</div>
                  </div>
                </IonCol>
                <IonCol size="6" size-md="3">
                  <div className="detail-item">
                    <div className="detail-label">Loan Term:</div>
                    <div className="detail-value">{request.loanTerm} years</div>
                  </div>
                </IonCol>
                <IonCol size="6" size-md="3">
                  <div className="detail-item">
                    <div className="detail-label">Interest Rate:</div>
                    <div className="detail-value">{request.interestRate}%</div>
                  </div>
                </IonCol>
                <IonCol size="6" size-md="3">
                  <div className="detail-item">
                    <div className="detail-label">Subsidy:</div>
                    <div className="detail-value">Up to {formatCurrency(request.subsidy)}</div>
                  </div>
                </IonCol>
                <IonCol size="12" size-md="6">
                  <div className="detail-item">
                    <div className="detail-label">Status:</div>
                    <IonBadge color={request.status === 'disbursed' ? 'success' : 'warning'} className="status-badge">
                      {request.status === 'disbursed' ? 'Submitted to District Assistant ✓' : 'Pending'}
                    </IonBadge>
                  </div>
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonCardContent>
        </IonCard>

        {/* EMI Status Summary */}
        <div className="emi-status-section">
          <div className="emi-status-header">
            <h2 className="emi-count">{paidEMIs} / {totalEMIs} EMIs Paid</h2>
            <div className="filter-section">
              <IonText>Filter by Status</IonText>
              <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="status-filter"
              >
                <option value="All">All</option>
                <option value="Paid">Paid</option>
                <option value="Unpaid">Unpaid</option>
                <option value="Overdue">Overdue</option>
              </select>
            </div>
          </div>

          {/* Restructure Loan Button */}
          <IonButton 
            expand="block" 
            className="restructure-button"
            color="warning"
          >
            Restructure Loan
          </IonButton>
        </div>

        {/* EMI Schedule Table */}
        <IonCard className="emi-table-card">
          <IonCardContent>
            <div className="table-header">
              <div className="table-cell">#</div>
              <div className="table-cell">Due Date</div>
              <div className="table-cell">EMI</div>
              <div className="table-cell">Interest</div>
              <div className="table-cell">Principal</div>
              <div className="table-cell">Balance</div>
              <div className="table-cell">Penalty</div>
              <div className="table-cell">Status</div>
              <div className="table-cell">Remarks</div>
            </div>
            
            {currentEMIs.map((emi, index) => (
              <div key={emi.id} className="table-row">
                <div className="table-cell">{startIndex + index + 1}</div>
                <div className="table-cell">{formatDate(emi.dueDate)}</div>
                <div className="table-cell">{formatCurrency(emi.emiAmount)}</div>
                <div className="table-cell">{formatCurrency(emi.interest)}</div>
                <div className="table-cell">{formatCurrency(emi.principal)}</div>
                <div className="table-cell">{formatCurrency(emi.balance)}</div>
                <div className="table-cell">{formatCurrency(emi.penalty)}</div>
                <div className="table-cell">
                  <IonBadge color={getStatusColor(emi.status)}>
                    {emi.status}
                  </IonBadge>
                </div>
                <div className="table-cell">{emi.remarks || '-'}</div>
              </div>
            ))}
          </IonCardContent>
        </IonCard>

        {/* Pagination */}
        <div className="pagination-section">
          <div className="pagination-info">
            <IonText>Page {currentPage} of {totalPages}</IonText>
          </div>
          <div className="pagination-controls">
            <IonButton 
              fill="clear" 
              disabled={currentPage === 1}
              onClick={handlePreviousPage}
              className="pagination-button"
            >
              <IonIcon icon={chevronBackOutline} />
              Previous
            </IonButton>
            <IonButton 
              fill="clear" 
              disabled={currentPage === totalPages}
              onClick={handleNextPage}
              className="pagination-button"
            >
              Next
              <IonIcon icon={chevronForwardOutline} />
            </IonButton>
          </div>
        </div>

        {/* Submit Changes Button */}
        <IonButton 
          expand="block" 
          className="submit-changes-button"
          color="primary"
        >
          Submit Changes
        </IonButton>
      </IonContent>
    </IonModal>
  );
};

export default RepaymentModal;
