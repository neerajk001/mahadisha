import React, { useState, useRef } from 'react';
import {
  IonModal,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButton,
  IonButtons,
  IonLabel,
  IonTextarea,
  IonFooter
} from '@ionic/react';
import './IncompleteReasonModal.css';

interface IncompleteReasonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => void;
}

const IncompleteReasonModal: React.FC<IncompleteReasonModalProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const modal = useRef<HTMLIonModalElement>(null);
  const [reason, setReason] = useState('');


  const handleSubmit = () => {
    if (reason.trim()) {
      onSubmit(reason.trim());
      handleClose();
    }
  };

  const handleClose = () => {
    setReason('');
    onClose();
  };

  return (
    <IonModal ref={modal} isOpen={isOpen} onDidDismiss={handleClose} className="incomplete-modal">
      <IonHeader className="modal-header">
        <IonToolbar>
          <IonTitle className="modal-title">Incomplete Application</IonTitle>
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
            <div className="textarea-container">
              <IonTextarea
                value={reason}
                onIonInput={(e) => setReason(e.detail.value!)}
                placeholder="Add Incomplete Checklist..."
                className="reason-textarea"
                rows={6}
                maxlength={500}
                counter={true}
                autoGrow={true}
                fill="outline"
              />
            </div>
          </div>
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
              color="warning"
              onClick={handleSubmit}
              disabled={!reason.trim()}
              className="submit-btn incomplete-submit"
            >
              Submit
            </IonButton>
          </div>
        </IonToolbar>
      </IonFooter>
    </IonModal>
  );
};

export default IncompleteReasonModal;
