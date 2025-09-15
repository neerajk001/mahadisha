import React, { useState } from 'react';
import {
  IonIcon,
  IonPopover,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonSearchbar
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

  // Popover states
  const [districtPopover, setDistrictPopover] = useState<{ open: boolean; event?: Event }>({
    open: false
  });
  const [monthPopover, setMonthPopover] = useState<{ open: boolean; event?: Event }>({
    open: false
  });
  const [datePopover, setDatePopover] = useState<{ open: boolean; event?: Event }>({
    open: false
  });

  // Search states
  const [districtSearch, setDistrictSearch] = useState('');
  const [monthSearch, setMonthSearch] = useState('');

  // Options
  const districtOptions = [
    { value: 'all', label: 'All Districts' },
    { value: 'mumbai', label: 'Mumbai' },
    { value: 'pune', label: 'Pune' },
    { value: 'nagpur', label: 'Nagpur' },
    { value: 'nashik', label: 'Nashik' },
    { value: 'aurangabad', label: 'Aurangabad' },
    { value: 'dhule', label: 'Dhule' },
    { value: 'solapur', label: 'Solapur' },
    { value: 'kolhapur', label: 'Kolhapur' },
    { value: 'satara', label: 'Satara' }
  ];

  const monthOptions = [
    { value: 'all', label: 'All Months' },
    { value: 'january', label: 'January' },
    { value: 'february', label: 'February' },
    { value: 'march', label: 'March' },
    { value: 'april', label: 'April' },
    { value: 'may', label: 'May' },
    { value: 'june', label: 'June' },
    { value: 'july', label: 'July' },
    { value: 'august', label: 'August' },
    { value: 'september', label: 'September' },
    { value: 'october', label: 'October' },
    { value: 'november', label: 'November' },
    { value: 'december', label: 'December' }
  ];

  const dateOptions = [
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'quarter', label: 'This Quarter' },
    { value: 'year', label: 'This Year' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const handleDistrictChange = (value: string) => {
    setDistrict(value);
    onFilterChange?.({ district: value, month, dateRange });
    setDistrictPopover({ open: false });
  };

  const handleMonthChange = (value: string) => {
    setMonth(value);
    onFilterChange?.({ district, month: value, dateRange });
    setMonthPopover({ open: false });
  };

  const handleDateRangeChange = (value: string) => {
    setDateRange(value);
    onFilterChange?.({ district, month, dateRange: value });
    setDatePopover({ open: false });
  };

  return (
    <div className="filter-row-compact">
      <div className="filter-container-compact">
        {/* District Filter */}
        <button
          className="filter-button-compact"
          onClick={(e) => setDistrictPopover({ open: true, event: e.nativeEvent })}
        >
          <IonIcon icon={locationOutline} className="filter-icon-compact" />
          <span>{districtOptions.find(o => o.value === district)?.label}</span>
        </button>
        <IonPopover
          isOpen={districtPopover.open}
          event={districtPopover.event}
          onDidDismiss={() => setDistrictPopover({ open: false })}
          cssClass="dashboard-filter-popover"
        >
          <IonContent>
            <IonSearchbar
              value={districtSearch}
              onIonInput={(e) => setDistrictSearch(e.detail.value!)}
              placeholder="Search districts"
              className="popover-searchbar-compact"
            />
            <IonList className="popover-list-compact">
              {districtOptions
                .filter(o => o.label.toLowerCase().includes(districtSearch.toLowerCase()))
                .map(option => (
                  <IonItem 
                    button 
                    key={option.value} 
                    onClick={() => handleDistrictChange(option.value)}
                    className="popover-item-compact"
                  >
                    <IonLabel>{option.label}</IonLabel>
                  </IonItem>
                ))}
            </IonList>
          </IonContent>
        </IonPopover>

        {/* Month Filter */}
        <button
          className="filter-button-compact"
          onClick={(e) => setMonthPopover({ open: true, event: e.nativeEvent })}
        >
          <IonIcon icon={calendarOutline} className="filter-icon-compact" />
          <span>{monthOptions.find(o => o.value === month)?.label}</span>
        </button>
        <IonPopover
          isOpen={monthPopover.open}
          event={monthPopover.event}
          onDidDismiss={() => setMonthPopover({ open: false })}
          cssClass="dashboard-filter-popover"
        >
          <IonContent>
            <IonSearchbar
              value={monthSearch}
              onIonInput={(e) => setMonthSearch(e.detail.value!)}
              placeholder="Search months"
              className="popover-searchbar-compact"
            />
            <IonList className="popover-list-compact">
              {monthOptions
                .filter(o => o.label.toLowerCase().includes(monthSearch.toLowerCase()))
                .map(option => (
                  <IonItem 
                    button 
                    key={option.value} 
                    onClick={() => handleMonthChange(option.value)}
                    className="popover-item-compact"
                  >
                    <IonLabel>{option.label}</IonLabel>
                  </IonItem>
                ))}
            </IonList>
          </IonContent>
        </IonPopover>

        {/* Date Range Filter */}
        <button
          className="filter-button-compact"
          onClick={(e) => setDatePopover({ open: true, event: e.nativeEvent })}
        >
          <IonIcon icon={calendarOutline} className="filter-icon-compact" />
          <span>{dateOptions.find(o => o.value === dateRange)?.label}</span>
        </button>
        <IonPopover
          isOpen={datePopover.open}
          event={datePopover.event}
          onDidDismiss={() => setDatePopover({ open: false })}
          cssClass="dashboard-filter-popover"
        >
          <IonContent>
            <IonList className="popover-list-compact">
              {dateOptions.map(option => (
                <IonItem 
                  button 
                  key={option.value} 
                  onClick={() => handleDateRangeChange(option.value)}
                  className="popover-item-compact"
                >
                  <IonLabel>{option.label}</IonLabel>
                </IonItem>
              ))}
            </IonList>
          </IonContent>
        </IonPopover>
      </div>
    </div>
  );
};

export default FilterRow;
