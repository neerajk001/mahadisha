import React from 'react';
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonIcon,
  IonChip,
  IonList,
  IonItem,
  IonLabel
} from '@ionic/react';
import { closeOutline, downloadOutline } from 'ionicons/icons';
import './StatusLogsModal.css';

interface StatusField {
  label: string;
  value: string;
}

interface StatusLog {
  status: string;
  user: string;
  time: string;
  document?: string;
  fields?: Record<string, string>; // Additional fields specific to each status
}

interface StatusLogsModalProps {
  isOpen: boolean;
  onClose: () => void;
  requestId: string | null;
  statusLogs: StatusLog[];
  onDownloadPDF: (requestId: string) => void;
}

const StatusLogsModal: React.FC<StatusLogsModalProps> = ({
  isOpen,
  onClose,
  requestId,
  statusLogs,
  onDownloadPDF
}) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'warning';
      case 'under_review': return 'primary';
      case 'approved': return 'success';
      case 'rejected': return 'danger';
      case 'disbursed': return 'secondary';
      case 'application received': return 'tertiary';
      default: return 'medium';
    }
  };

  const getStatusSpecificFields = (status: string): StatusField[] => {
    switch (status.toLowerCase()) {
      case 'pending':
        return [
          { label: 'Application ID', value: 'APP-2025-001' },
          { label: 'Submitted By', value: 'John Doe' },
          { label: 'Contact', value: '+91 98765 43210' }
        ];
      case 'application received':
        return [
          { label: 'Received By', value: 'District Office' },
          { label: 'Reference Number', value: 'REF-2025-001' },
          { label: 'Priority', value: 'Normal' }
        ];
      case 'under_review':
        return [
          { label: 'Reviewer', value: 'Jane Smith' },
          { label: 'Department', value: 'Loan Processing' },
          { label: 'Expected Completion', value: '10/15/2025' }
        ];
      case 'approved':
        return [
          { label: 'Approved By', value: 'District Manager' },
          { label: 'Approval Date', value: '10/25/2025' },
          { label: 'Loan Amount', value: '₹50,000' },
          { label: 'Interest Rate', value: '8.5%' }
        ];
      case 'rejected':
        return [
          { label: 'Rejected By', value: 'Credit Committee' },
          { label: 'Rejection Date', value: '10/20/2025' },
          { label: 'Reason', value: 'Insufficient Documentation' },
          { label: 'Appeal Allowed', value: 'Yes, within 30 days' }
        ];
      case 'disbursed':
        return [
          { label: 'Disbursed By', value: 'Finance Department' },
          { label: 'Disbursement Date', value: '11/05/2025' },
          { label: 'Account Number', value: 'XXXX-XXXX-1234' },
          { label: 'Transaction ID', value: 'TXN-2025-5678' }
        ];
      default:
        return [];
    }
  };

  const handleDownload = () => {
    if (requestId) {
      onDownloadPDF(requestId);
    }
  };

  return (
    <IonModal isOpen={isOpen} onDidDismiss={onClose} className="status-logs-modal">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Loan Application Status Logs</IonTitle>
          <IonButton slot="end" fill="clear" onClick={onClose}>
            <IonIcon icon={closeOutline} />
          </IonButton>
        </IonToolbar>
      </IonHeader>
      <IonContent className="status-logs-content">
        {statusLogs && statusLogs.length > 0 ? (
          <IonList>
            {statusLogs.map((log, index) => (
            <div key={index} className="status-log-item">
              <div className="status-log-bullet"></div>
              <div className="status-log-content">
                <div className="status-log-header">
                  <IonChip color={getStatusColor(log.status)} className="status-chip">
                    {log.status}
                  </IonChip>
                  <div className="status-log-meta">
                    <div className="status-log-user">User: {log.user}</div>
                    <div className="status-log-time">Time: {log.time}</div>
                  </div>
                </div>
                
                {/* Display fields from the data if available, otherwise use status-specific fields */}
                <div className="status-log-fields">
                  {(log.fields && Object.keys(log.fields).length > 0
                    ? Object.entries(log.fields).map(([key, value]) => (
                        <div key={key} className="status-log-field-item">
                          <span className="field-label">{key}:</span> {value}
                        </div>
                      ))
                    : getStatusSpecificFields(log.status).map((field, i) => (
                        <div key={i} className="status-log-field-item">
                          <span className="field-label">{field.label}:</span> {field.value}
                        </div>
                      ))
                  )}
                </div>
                
                <div className="status-log-document">
                  {log.document ? log.document : 'No Document'}
                </div>
              </div>
            </div>
          ))}
          </IonList>
        ) : (
          <div className="no-status-logs">
            <p>No status logs available for this request.</p>
          </div>
        )}
        <div className="status-logs-actions">
          <IonButton 
            expand="block" 
            onClick={handleDownload}
            disabled={!requestId}
          >
            <IonIcon slot="start" icon={downloadOutline} />
            Download PDF
          </IonButton>
        </div>
      </IonContent>
    </IonModal>
  );
};

export default StatusLogsModal;