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
  IonBadge
} from '@ionic/react';
import {
  eyeOutline,
  mailOutline,
  documentOutline,
  refreshOutline,
  locationOutline,
  calendarOutline,
  personOutline,
  cashOutline
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
}

const RequestCardNew: React.FC<RequestCardProps> = ({
  requests,
  onStatusChange,
  onViewDetails,
  onSendEmail,
  onDownloadPDF,
  onRepayment
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
            <IonCol size="12" size-md="6" size-lg="4" key={request.id}>
              <IonCard className="request-card">
                <IonCardHeader>
                  <div className="card-header">
                    <div className="request-info">
                      <IonCardTitle className="loan-id">{request.loanId}</IonCardTitle>
                      <div className="request-meta">
                        <IonChip color={getStatusColor(request.status)} className="status-chip">
                          {formatStatus(request.status)}
                        </IonChip>
                        <IonChip color={getPriorityColor(request.priority)} className="priority-chip">
                          {request.priority.toUpperCase()}
                        </IonChip>
                      </div>
                    </div>
                  </div>
                </IonCardHeader>

                <IonCardContent className="request-card-content">
                  <div className="request-details">
                    <div className="detail-row">
                      <span className="detail-label">Activity:</span>
                      <span className="detail-value">{request.activity}</span>
                    </div>
                    
                    <div className="detail-row">
                      <IonIcon icon={locationOutline} className="detail-icon" />
                      <span className="detail-label">District:</span>
                      <span className="detail-value">{request.district}</span>
                    </div>
                    
                    <div className="detail-row">
                      <IonIcon icon={cashOutline} className="detail-icon" />
                      <span className="detail-label">Loan Amount:</span>
                      <span className="detail-value amount">{formatCurrency(request.loanAmount)}</span>
                    </div>
                    
                    <div className="detail-row">
                      <span className="detail-label">Loan Term:</span>
                      <span className="detail-value">{request.loanTerm} years</span>
                    </div>
                    
                    <div className="detail-row">
                      <span className="detail-label">Interest Rate:</span>
                      <span className="detail-value">{request.interestRate}%</span>
                    </div>
                    
                    <div className="detail-row">
                      <span className="detail-label">Subsidy:</span>
                      <span className="detail-value">Up to {formatCurrency(request.subsidy)}</span>
                    </div>
                    
                    <div className="detail-row">
                      <IonIcon icon={calendarOutline} className="detail-icon" />
                      <span className="detail-label">Applied:</span>
                      <span className="detail-value">{formatDate(request.applicationDate)}</span>
                    </div>
                  </div>

                  <div className="action-buttons">
                    <IonButton
                      fill="clear"
                      size="small"
                      className="action-button view-button"
                      onClick={() => onViewDetails(request.id)}
                    >
                      <IonIcon icon={eyeOutline} />
                      <span>View Details</span>
                    </IonButton>
                    
                    <IonButton
                      fill="clear"
                      size="small"
                      className="action-button email-button"
                      onClick={() => onSendEmail(request.id)}
                    >
                      <IonIcon icon={mailOutline} />
                      <span>Send Email</span>
                    </IonButton>
                    
                    <IonButton
                      fill="clear"
                      size="small"
                      className="action-button pdf-button"
                      onClick={() => onDownloadPDF(request.id)}
                    >
                      <IonIcon icon={documentOutline} />
                      <span>View PDF</span>
                    </IonButton>
                    
                    {request.status === 'disbursed' && (
                      <IonButton
                        fill="clear"
                        size="small"
                        className="action-button repayment-button"
                        onClick={() => onRepayment(request.id)}
                      >
                        <IonIcon icon={refreshOutline} />
                        <span>Repayment</span>
                      </IonButton>
                    )}
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
