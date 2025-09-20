import React from 'react';
import { IonIcon, IonButton } from '@ionic/react';
import { eyeOutline, createOutline, trashOutline } from 'ionicons/icons';
import './MasterCard.css';

export interface MasterCardProps {
  id: string;
  title: string;
  subtitle?: string;
  icon: string;
  metaItems: Array<{
    icon: string;
    label: string;
    value: string;
  }>;
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  className?: string;
}

const MasterCard: React.FC<MasterCardProps> = ({
  id,
  title,
  subtitle,
  icon,
  metaItems,
  onView,
  onEdit,
  onDelete,
  className = ''
}) => {
  return (
    <div className={`master-card ${className}`}>
      {/* Purple Banner Header */}
      <div className="master-card-banner">
        <div className="master-card-banner-icon">
          <IonIcon icon={icon} />
        </div>
        <div className="master-card-banner-content">
          <h3 className="master-card-banner-title">{title}</h3>
          {subtitle && <div className="master-card-banner-subtitle">{subtitle}</div>}
        </div>
      </div>
      
      {/* Content Section */}
      <div className="master-card-content">
        {metaItems.map((item, index) => (
          <div key={index} className="master-card-meta">
            <div className="master-card-meta-item">
              <IonIcon icon={item.icon} className="master-card-meta-icon" />
              <span>{item.label}: {item.value}</span>
            </div>
          </div>
        ))}
      </div>
      
      {/* Action Buttons */}
      <div className="master-card-actions">
        {onView && (
          <IonButton
            fill="clear"
            size="small"
            className="master-card-button view"
            onClick={() => onView(id)}
          >
            <IonIcon icon={eyeOutline} slot="start" />
            VIEW
          </IonButton>
        )}
        
        {onEdit && (
          <IonButton
            fill="clear"
            size="small"
            className="master-card-button edit"
            onClick={() => onEdit(id)}
          >
            <IonIcon icon={createOutline} slot="start" />
            EDIT
          </IonButton>
        )}
        
        {onDelete && (
          <IonButton
            fill="clear"
            size="small"
            className="master-card-button delete"
            onClick={() => onDelete(id)}
          >
            <IonIcon icon={trashOutline} slot="start" />
            DELETE
          </IonButton>
        )}
      </div>
    </div>
  );
};

export default MasterCard;
