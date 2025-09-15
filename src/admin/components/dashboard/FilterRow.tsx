import React, { useState } from 'react';
import {
  IonIcon
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
  const [district, setDistrict] = useState('all');
  const [month, setMonth] = useState('all');
  const [dateRange, setDateRange] = useState('today');

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setDistrict(value);
    onFilterChange?.({ district: value, month, dateRange });
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setMonth(value);
    onFilterChange?.({ district, month: value, dateRange });
  };

  const handleDateRangeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setDateRange(value);
    onFilterChange?.({ district, month, dateRange: value });
  };

  return (
    <div className="filter-row">
      <div className="filter-container">
        <div className="filter-item">
          <IonIcon icon={locationOutline} className="filter-icon" />
          <select 
            value={district} 
            onChange={handleDistrictChange}
            className="filter-select"
          >
            <option value="all">All Districts</option>
            <option value="mumbai">Mumbai</option>
            <option value="pune">Pune</option>
            <option value="nagpur">Nagpur</option>
          </select>
        </div>

        <div className="filter-item">
          <IonIcon icon={calendarOutline} className="filter-icon" />
          <select 
            value={month} 
            onChange={handleMonthChange}
            className="filter-select"
          >
            <option value="all">All Months</option>
            <option value="january">January</option>
            <option value="february">February</option>
            <option value="march">March</option>
          </select>
        </div>

        <div className="filter-item">
          <IonIcon icon={calendarOutline} className="filter-icon" />
          <select 
            value={dateRange} 
            onChange={handleDateRangeChange}
            className="filter-select"
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="custom">Custom Range</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default FilterRow;
