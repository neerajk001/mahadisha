import React from 'react';
import { IonButton, IonIcon, IonSearchbar } from '@ionic/react';
import { addOutline, barChartOutline, eyeOutline, cardOutline, listOutline, refreshOutline, filterOutline } from 'ionicons/icons';
import './MasterControls.css';

export interface MasterControlsProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder: string;
  className?: string;
  // Optional view mode controls
  viewMode?: 'grid' | 'table' | 'card' | 'list';
  onViewModeToggle?: () => void;
  viewModeLabels?: {
    primary: string;
    secondary: string;
  };
  // Optional add button
  onAddNew?: () => void;
  addButtonText?: string;
  // Optional filter button
  onFilterClick?: () => void;
  showFilterButton?: boolean;
  filterButtonText?: string;
  // Optional refresh button
  onRefresh?: () => void;
  showRefreshButton?: boolean;
}

const MasterControls: React.FC<MasterControlsProps> = ({
  searchQuery,
  onSearchChange,
  searchPlaceholder,
  className = '',
  viewMode,
  onViewModeToggle,
  viewModeLabels = { primary: 'Grid View', secondary: 'Table View' },
  onAddNew,
  addButtonText = 'Add New',
  onFilterClick,
  showFilterButton = false,
  filterButtonText = 'Filter',
  onRefresh,
  showRefreshButton = false
}) => {
  const getViewModeIcon = () => {
    if (viewMode === 'card') return listOutline;
    if (viewMode === 'list') return cardOutline;
    if (viewMode === 'grid') return barChartOutline;
    return eyeOutline;
  };

  const getViewModeText = () => {
    if (viewMode === 'card') return 'List View';
    if (viewMode === 'list') return 'Card View';
    if (viewMode === 'grid') return viewModeLabels.secondary;
    return viewModeLabels.primary;
  };

  return (
    <div className={`master-controls ${className}`}>
      <IonSearchbar
        value={searchQuery}
        onIonChange={(e) => onSearchChange(e.detail.value!)}
        placeholder={searchPlaceholder}
        className="master-controls-search"
      />
      
      <div className="master-controls-actions">
        {showFilterButton && onFilterClick && (
          <IonButton 
            fill="outline" 
            size="small"
            onClick={onFilterClick}
            className="master-controls-filter-button"
          >
            <IonIcon icon={filterOutline} />
            <span className="button-text">{filterButtonText}</span>
          </IonButton>
        )}
        
        {viewMode && onViewModeToggle && (
          <IonButton 
            fill="outline" 
            size="small"
            onClick={onViewModeToggle}
            className="master-controls-view-toggle"
          >
            <IonIcon icon={getViewModeIcon()} />
            <span className="button-text">{getViewModeText()}</span>
          </IonButton>
        )}
        
        {showRefreshButton && onRefresh && (
          <IonButton 
            fill="clear" 
            size="small"
            onClick={onRefresh}
            className="master-controls-refresh-button"
          >
            <IonIcon icon={refreshOutline} />
            <span className="button-text">Refresh</span>
          </IonButton>
        )}
        
        {onAddNew && (
          <IonButton 
            fill="solid" 
            size="small"
            onClick={onAddNew}
            className="master-controls-add-button"
          >
            <IonIcon icon={addOutline} />
            <span className="button-text">{addButtonText}</span>
          </IonButton>
        )}
      </div>
    </div>
  );
};

export default MasterControls;
