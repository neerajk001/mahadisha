import React from 'react';
import { IonCard, IonCardContent, IonButton, IonIcon } from '@ionic/react';
import { createOutline, trashOutline } from 'ionicons/icons';
import type { Scheme } from '../../types';
import './SchemeCard.css';

interface SchemeCardProps {
  scheme: Scheme;
  onApply: (schemeId: string) => void;
  onEdit: (schemeId: string) => void;
  onDelete: (schemeId: string) => void;
}

const SchemeCard: React.FC<SchemeCardProps> = ({ scheme, onApply, onEdit, onDelete }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatLoanRange = (min: number, max: number) => {
    if (min === 0) {
      return `₹0 - ${formatCurrency(max).replace('₹', '₹')}`;
    }
    return `${formatCurrency(min)} - ${formatCurrency(max)}`;
  };

  const formatSubsidy = (percentage: number, maxAmount: number) => {
    return `${percentage}% (Max ${formatCurrency(maxAmount)})`;
  };

  const formatTenure = (min: number, max: number) => {
    if (min === 0) {
      return `0 - ${max} years`;
    }
    return `${min} - ${max} years`;
  };

  return (
    <IonCard className="scheme-card">
      <IonCardContent className="scheme-card-content">
        <div className="scheme-header">
          <h3 className="scheme-title">{scheme.name}</h3>
        </div>

        <div className="scheme-details">
          <div className="detail-row">
            <span className="detail-label">Loan Range:</span>
            <span className="detail-value">{formatLoanRange(scheme.minimumLoanLimit, scheme.maximumLoanLimit)}</span>
          </div>

          <div className="detail-row">
            <span className="detail-label">Subsidy:</span>
            <span className="detail-value">{formatSubsidy(scheme.subsidyLimit, scheme.maximumSubsidyAmount)}</span>
          </div>

          <div className="detail-row">
            <span className="detail-label">Own Contribution:</span>
            <span className="detail-value">{scheme.downPaymentPercent}%</span>
          </div>

          <div className="detail-row">
            <span className="detail-label">MPBCDC Interest:</span>
            <span className="detail-value">{scheme.vendorInterestYearly}% yearly</span>
          </div>

          <div className="detail-row">
            <span className="detail-label">Bank Share:</span>
            <span className="detail-value">{scheme.loanPercentByPartner}%</span>
          </div>

          <div className="detail-row">
            <span className="detail-label">Tenure:</span>
            <span className="detail-value">{formatTenure(scheme.minimumTenure, scheme.maximumTenure)}</span>
          </div>

          <div className="detail-row">
            <span className="detail-label">Interest:</span>
            <span className="detail-value">{scheme.interestType}</span>
          </div>

          <div className="detail-row">
            <span className="detail-label">Partner Involvement:</span>
            <span className="detail-value">{scheme.partnerInvolvement ? 'Yes' : 'No'}</span>
          </div>

          <div className="detail-row">
            <span className="detail-label">Recovery by Partner:</span>
            <span className="detail-value">{scheme.recoveryByPartner ? 'Yes' : 'No'}</span>
          </div>
        </div>

        <div className="scheme-actions">
          <IonButton 
            expand="block" 
            className="apply-button"
            onClick={() => onApply(scheme.id)}
          >
            Apply
          </IonButton>
        </div>

        <div className="scheme-footer">
          <button 
            className="footer-action edit-action"
            onClick={() => onEdit(scheme.id)}
          >
            <IonIcon icon={createOutline} className="action-icon" />
            Edit
          </button>
          <button 
            className="footer-action delete-action"
            onClick={() => onDelete(scheme.id)}
          >
            <IonIcon icon={trashOutline} className="action-icon" />
            Delete
          </button>
        </div>
      </IonCardContent>
    </IonCard>
  );
};

export default SchemeCard;
