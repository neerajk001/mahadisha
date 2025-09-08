import React, { useState, useEffect } from 'react';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButton,
  IonIcon,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonAvatar,
  IonMenuButton
} from '@ionic/react';
import {
  chevronDownOutline,
  calendarOutline,
  locationOutline
} from 'ionicons/icons';
import { useLocation } from 'react-router-dom';
import './DashboardHeader.css';

const DashboardHeader: React.FC = () => {
  const [userName, setUserName] = useState('Admin');
  const [userInitials, setUserInitials] = useState('AD');
  const location = useLocation();

  useEffect(() => {
    // Get user info from localStorage or context
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserName(user.name || 'Admin');
      setUserInitials(user.name ? user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase() : 'AD');
    }
  }, []);

  const getBreadcrumb = () => {
    const path = location.pathname;
    switch (path) {
      case '/dashboard':
        return { main: 'LMS', current: 'Dashboard' };
      case '/application-type':
        return { main: 'LMS', current: 'Application Type' };
      case '/new-requests':
        return { main: 'LMS', current: 'New Requests' };
      case '/admin/schemes':
        return { main: 'LMS', current: 'Schemes' };
      case '/custom-reports':
        return { main: 'LMS', current: 'Custom Reports' };
      case '/manage-pages':
        return { main: 'LMS', current: 'Manage Pages' };
      case '/branch-master':
        return { main: 'LMS', current: 'Branch Master' };
      case '/caste-master':
        return { main: 'LMS', current: 'Caste Master' };
      case '/taluka-master':
        return { main: 'LMS', current: 'Taluka Master' };
      case '/action-masters':
        return { main: 'LMS', current: 'Action Masters' };
      case '/organization-masters':
        return { main: 'LMS', current: 'Organization Masters' };
      case '/status-master':
        return { main: 'LMS', current: 'Status Master' };
      case '/partner-master':
        return { main: 'LMS', current: 'Partner Master' };
      case '/status-mapping':
        return { main: 'LMS', current: 'Status Mapping' };
      case '/rejection-masters':
        return { main: 'LMS', current: 'Rejection Masters' };
      case '/database-access':
        return { main: 'LMS', current: 'Database Access' };
      case '/roles':
        return { main: 'LMS', current: 'Roles' };
      case '/workflow':
        return { main: 'LMS', current: 'Workflow' };
      case '/access-mapping':
        return { main: 'LMS', current: 'Access Mapping' };
      case '/branch-mapping':
        return { main: 'LMS', current: 'Branch Mapping' };
      case '/pincode-mapping':
        return { main: 'LMS', current: 'Pincode Mapping' };
      case '/members':
        return { main: 'LMS', current: 'Members' };
      case '/config':
        return { main: 'LMS', current: 'Config' };
      case '/reports':
        return { main: 'LMS', current: 'Reports' };
      case '/others':
        return { main: 'LMS', current: 'Others' };
      default:
        return { main: 'LMS', current: 'Home' };
    }
  };

  const breadcrumb = getBreadcrumb();

  return (
    <IonHeader className="dashboard-header">
      {/* Top Dark Bar */}
      <div className="top-dark-bar"></div>
      
      <IonToolbar className="dashboard-toolbar">
        {/* Left Side - Breadcrumb */}
        <div className="header-left">
          <div className="breadcrumb">
            <span className="breadcrumb-link">{breadcrumb.main}</span>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-link active">{breadcrumb.current}</span>
          </div>
        </div>

        {/* Right Side - User Info */}
        <div className="header-right">
          <div className="user-info">
            <div className="user-details">
              <div className="user-role">{userName}</div>
              <div className="user-level">Master Admin</div>
            </div>
            <IonAvatar className="user-avatar">
              <div className="avatar-text">{userInitials}</div>
            </IonAvatar>
          </div>
        </div>
      </IonToolbar>

      {/* Filter Row - Only show on dashboard */}
      {location.pathname === '/dashboard' && (
        <div className="filter-row">
          <div className="filter-container">
            <div className="filter-item">
              <IonIcon icon={locationOutline} className="filter-icon" />
              <div className="filter-content">
                <div className="filter-label">Select District</div>
                <IonSelect placeholder="All Districts" className="filter-select">
                  <IonSelectOption value="all">All Districts</IonSelectOption>
                  <IonSelectOption value="mumbai">Mumbai</IonSelectOption>
                  <IonSelectOption value="pune">Pune</IonSelectOption>
                  <IonSelectOption value="nagpur">Nagpur</IonSelectOption>
                </IonSelect>
              </div>
              <IonIcon icon={chevronDownOutline} className="dropdown-icon" />
            </div>

            <div className="filter-item">
              <IonIcon icon={calendarOutline} className="filter-icon" />
              <div className="filter-content">
                <div className="filter-label">All Months</div>
                <IonSelect placeholder="All Months" className="filter-select">
                  <IonSelectOption value="all">All Months</IonSelectOption>
                  <IonSelectOption value="january">January</IonSelectOption>
                  <IonSelectOption value="february">February</IonSelectOption>
                  <IonSelectOption value="march">March</IonSelectOption>
                </IonSelect>
              </div>
              <IonIcon icon={chevronDownOutline} className="dropdown-icon" />
            </div>

            <div className="filter-item">
              <IonIcon icon={calendarOutline} className="filter-icon" />
              <div className="filter-content">
                <div className="filter-label">Select Date Range</div>
                <IonSelect placeholder="Date Range" className="filter-select">
                  <IonSelectOption value="today">Today</IonSelectOption>
                  <IonSelectOption value="week">This Week</IonSelectOption>
                  <IonSelectOption value="month">This Month</IonSelectOption>
                  <IonSelectOption value="custom">Custom Range</IonSelectOption>
                </IonSelect>
              </div>
              <IonIcon icon={chevronDownOutline} className="dropdown-icon" />
            </div>
          </div>
        </div>
      )}
    </IonHeader>
  );
};

export default DashboardHeader;
