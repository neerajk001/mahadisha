import React from 'react';
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonButton,
  IonIcon,
  IonChip,
  IonGrid,
  IonRow,
  IonCol,
  IonBadge,
  IonAvatar
} from '@ionic/react';
import {
  eyeOutline,
  mailOutline,
  documentOutline,
  refreshOutline,
  locationOutline,
  calendarOutline,
  personOutline,
  cashOutline,
  idCardOutline,
  chevronForwardOutline
} from 'ionicons/icons';
import type { LoanRequest } from '../../types';
import './RequestCard.css';

interface RequestCardProps {
  requests: LoanRequest[];
  onStatusChange: (requestId: string, status: string) => void;
  onViewDetails: (requestId: string) => void;
  onSendEmail: (requestId: string) => void;
  onDownloadPDF: (requestId: string) => void;
  onRepayment: (requestId: string) => void;
  onViewStatusLogs: (requestId: string) => void;
}

const RequestCardNew: React.FC<RequestCardProps> = ({
  requests,
  onStatusChange,
  onViewDetails,
  onSendEmail,
  onDownloadPDF,
  onRepayment,
  onViewStatusLogs
}) => {
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'danger';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'medium';
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
      month: 'short',
      day: 'numeric'
    });
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

  return (
    <div className="request-cards-container">
      <IonGrid>
        <IonRow>
          {requests.map((request) => (
            <IonCol size="12" size-md="6" size-lg="6" key={request.id}>
              <IonCard className="request-card-new">
                <IonCardHeader className="card-header-new">
                  {/* Applicant Profile Section */}
                  <div className="applicant-profile">
                    <IonAvatar className="applicant-avatar">
                      <IonIcon icon={idCardOutline} className="avatar-icon" />
                      <span className="avatar-label">Aadhar</span>
                    </IonAvatar>
                    <div className="applicant-info">
                      <div className="scheme-info">
                        <span className="scheme-label">Scheme:</span>
                        <span className="scheme-name">{request.scheme || 'Margin Money Scheme (State)'}</span>
                      </div>
                      <div className="loan-id-line">
                        <span className="loan-id-label">Loan ID :</span>
                        <span className="loan-id-value">{request.loanId}</span>
                      </div>
                      <div className="applicant-name-line">
                        <span className="applicant-label">Applicant:</span>
                        <span className="applicant-name">{request.applicantName}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="status-row">
                    <IonChip 
                      color={getStatusColor(request.status)} 
                      className="status-chip-new"
                    >
                      {formatStatus(request.status)}
                    </IonChip>
                    <IonChip 
                      color={getPriorityColor(request.priority)} 
                      className="priority-chip-new"
                    >
                      {request.priority.toUpperCase()}
                    </IonChip>
                  </div>
                </IonCardHeader>

                <IonCardContent className="card-content-new">
                  <div className="info-section">
                    <div className="info-item">
                      <span className="info-label">ACTIVITY:</span>
                      <span className="info-value">{request.activity}</span>
                    </div>
                    
                    <div className="info-item">
                      <span className="info-label">DISTRICT:</span>
                      <span className="info-value">{request.district}</span>
                    </div>
                    
                    <div className="info-item">
                      <span className="info-label">LOAN AMOUNT:</span>
                      <span className="info-value amount">{formatCurrency(request.loanAmount)}</span>
                    </div>
                    
                    <div className="info-item">
                      <span className="info-label">LOAN TERM:</span>
                      <span className="info-value">{request.loanTerm} years</span>
                    </div>
                    
                    <div className="info-item">
                      <span className="info-label">INTEREST RATE:</span>
                      <span className="info-value">{request.interestRate}%</span>
                    </div>
                    
                    <div className="info-item">
                      <span className="info-label">SUBSIDY:</span>
                      <span className="info-value">Up to {formatCurrency(request.subsidy)}</span>
                    </div>
                    
                    <div className="info-item">
                      <span className="info-label">STATUS:</span>
                      <div className="info-value status-row status-clickable" 
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          onViewStatusLogs(request.id);
                        }}>
                        <IonChip 
                          color={getStatusColor(request.status)} 
                          className="status-chip-inline"
                        >
                          {formatStatus(request.status)}
                        </IonChip>
                        <IonIcon 
                          icon={chevronForwardOutline} 
                          className="status-forward-icon"
                        />
                      </div>
                    </div>
                    
                    <div className="info-item">
                      <span className="info-label">APPLIED:</span>
                      <span className="info-value">{formatDate(request.applicationDate)}</span>
                    </div>
                  </div>

                  <div className="action-buttons-horizontal">
                    <IonButton
                      fill="solid"
                      className="action-btn repayment-btn"
                      onClick={() => onRepayment(request.id)}
                    >
                      <IonIcon slot="start" icon={refreshOutline} />
                      Repayments
                    </IonButton>
                    
                    <IonButton
                      fill="solid"
                      className="action-btn view-btn"
                      onClick={() => onViewDetails(request.id)}
                    >
                      <IonIcon slot="start" icon={eyeOutline} />
                      View Details
                    </IonButton>
                    
                    <IonButton
                      fill="solid"
                      className="action-btn email-btn"
                      onClick={() => onSendEmail(request.id)}
                    >
                      <IonIcon slot="start" icon={mailOutline} />
                      Send Email
                    </IonButton>
                    
                    <IonButton
                      fill="solid"
                      className="action-btn pdf-btn"
                      onClick={() => onDownloadPDF(request.id)}
                    >
                      <IonIcon slot="start" icon={documentOutline} />
                      View PDF
                    </IonButton>
                  </div>
                </IonCardContent>
              </IonCard>
            </IonCol>
          ))}
        </IonRow>
      </IonGrid>
    </div>
  );
};

export default RequestCardNew;

