import React from 'react';
import { IonButton, IonIcon, IonSearchbar } from '@ionic/react';
import { addOutline, filterOutline } from 'ionicons/icons';
import './RBACControls.css';

export interface RBACControlsProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder: string;
  onAddNew: () => void;
  addButtonText: string;
  showFilterButton?: boolean;
  onFilterClick?: () => void;
  className?: string;
}

const RBACControls: React.FC<RBACControlsProps> = ({
  searchQuery,
  onSearchChange,
  searchPlaceholder,
  onAddNew,
  addButtonText,
  showFilterButton = false,
  onFilterClick,
  className = ''
}) => {
  return (
    <div className={`rbac-controls ${className}`}>
      <IonSearchbar
        value={searchQuery}
        onIonChange={(e) => onSearchChange(e.detail.value!)}
        placeholder={searchPlaceholder}
        className="rbac-controls-search"
      />
      
      {showFilterButton && onFilterClick && (
        <IonButton 
          fill="outline" 
          size="small"
          onClick={onFilterClick}
          className="rbac-controls-filter-button"
        >
          <IonIcon icon={filterOutline} />
          <span className="button-text">Filters</span>
        </IonButton>
      )}
      
      <IonButton 
        fill="solid" 
        size="small"
        onClick={onAddNew}
        className="rbac-controls-add-button"
      >
        <IonIcon icon={addOutline} />
        <span className="button-text">{addButtonText}</span>
      </IonButton>
    </div>
  );
};

export default RBACControls;
