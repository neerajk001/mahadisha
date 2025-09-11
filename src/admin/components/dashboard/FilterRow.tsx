import React from 'react';
import {
  IonIcon,
  IonSelect,
  IonSelectOption
} from '@ionic/react';
import {
  chevronDownOutline,
  calendarOutline,
  locationOutline
} from 'ionicons/icons';
import './FilterRow.css';

interface FilterRowProps {
  onFilterChange?: (filters: any) => void;
}

const FilterRow: React.FC<FilterRowProps> = ({ onFilterChange }) => {
  return (
    <div className="filter-row">
      <div className="filter-container">
        <div className="filter-item">
          <IonIcon icon={locationOutline} className="filter-icon" />
          <IonSelect placeholder="Select District" className="filter-select">
            <IonSelectOption value="all">All Districts</IonSelectOption>
            <IonSelectOption value="mumbai">Mumbai</IonSelectOption>
            <IonSelectOption value="pune">Pune</IonSelectOption>
            <IonSelectOption value="nagpur">Nagpur</IonSelectOption>
          </IonSelect>
        </div>

        <div className="filter-item">
          <IonIcon icon={calendarOutline} className="filter-icon" />
          <IonSelect placeholder="All Months" className="filter-select">
            <IonSelectOption value="all">All Months</IonSelectOption>
            <IonSelectOption value="january">January</IonSelectOption>
            <IonSelectOption value="february">February</IonSelectOption>
            <IonSelectOption value="march">March</IonSelectOption>
          </IonSelect>
        </div>

        <div className="filter-item">
          <IonIcon icon={calendarOutline} className="filter-icon" />
          <IonSelect placeholder="Date Range" className="filter-select">
            <IonSelectOption value="today">Today</IonSelectOption>
            <IonSelectOption value="week">This Week</IonSelectOption>
            <IonSelectOption value="month">This Month</IonSelectOption>
            <IonSelectOption value="custom">Custom Range</IonSelectOption>
          </IonSelect>
        </div>
      </div>
    </div>
  );
};

export default FilterRow;
