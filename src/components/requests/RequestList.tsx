import React from 'react';
import {
  IonList,
  IonItem,
  IonLabel,
  IonButton,
  IonIcon,
  IonChip,
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
import './RequestList.css';

interface RequestListProps {
  requests: LoanRequest[];
  onStatusChange: (requestId: string, status: string) => void;
  onViewDetails: (requestId: string) => void;
  onSendEmail: (requestId: string) => void;
  onDownloadPDF: (requestId: string) => void;
  onRepayment: (requestId: string) => void;
}

const RequestList: React.FC<RequestListProps> = ({
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
    <div className="request-list-container">
      <IonList className="request-list">
        {requests.map((request) => (
          <IonItem key={request.id} className="request-list-item">
            <div className="request-list-content">
              <div className="request-main-info">
                <div className="request-header">
                  <h3 className="loan-id">{request.loanId}</h3>
                  <div className="request-badges">
                    <IonChip color={getStatusColor(request.status)} className="status-chip">
                      {formatStatus(request.status)}
                    </IonChip>
                    <IonChip color={getPriorityColor(request.priority)} className="priority-chip">
                      {request.priority.toUpperCase()}
                    </IonChip>
                  </div>
                </div>
                
                <div className="request-details">
                  <div className="detail-item">
                    <span className="detail-text">Activity: {request.activity}</span>
                  </div>
                  
                  <div className="detail-item">
                    <IonIcon icon={locationOutline} className="detail-icon" />
                    <span className="detail-text">District: {request.district}</span>
                  </div>
                  
                  <div className="detail-item">
                    <IonIcon icon={cashOutline} className="detail-icon" />
                    <span className="detail-text amount">Loan Amount: {formatCurrency(request.loanAmount)}</span>
                  </div>
                  
                  <div className="detail-item">
                    <span className="detail-text">Loan Term: {request.loanTerm} years</span>
                  </div>
                  
                  <div className="detail-item">
                    <span className="detail-text">Interest Rate: {request.interestRate}%</span>
                  </div>
                  
                  <div className="detail-item">
                    <span className="detail-text">Subsidy: Up to {formatCurrency(request.subsidy)}</span>
                  </div>
                  
                  <div className="detail-item">
                    <IonIcon icon={calendarOutline} className="detail-icon" />
                    <span className="detail-text">Applied: {formatDate(request.applicationDate)}</span>
                  </div>
                </div>
              </div>
              
              <div className="request-actions">
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
            </div>
          </IonItem>
        ))}
      </IonList>
    </div>
  );
};

export default RequestList;