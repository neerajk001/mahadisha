import React, { useState, useEffect } from 'react';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButton,
  IonIcon,
  IonAvatar,
  IonMenuButton,
  IonButtons
} from '@ionic/react';
import { useLocation } from 'react-router-dom';
import './DashboardHeader.css';

const DashboardHeader: React.FC = () => {
  const [userName, setUserName] = useState('Admin');
  const [userInitials, setUserInitials] = useState('AD');
  const location = useLocation();

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserName(user.name || 'Admin');
      setUserInitials(
        user.name
          ? user.name
              .split(' ')
              .map((n: string) => n[0])
              .join('')
              .toUpperCase()
          : 'AD'
      );
    }
  }, []);

  const getBreadcrumb = () => {
    const path = location.pathname;
    switch (path) {
      case '/dashboard':
        return { main: 'LMS', current: 'Dashboard' };
      case '/application-type':
        return { main: 'LMS', current: 'Application Type' };
      // add other routes here...
      default:
        return { main: 'LMS', current: 'Home' };
    }
  };

  const breadcrumb = getBreadcrumb();

  return (
    <IonHeader>
      <IonToolbar
          style={{
            backgroundColor: '#006666', 
            padding: '0',               // remove extra padding
            margin: '0',                // remove extra margin
            height: '56px',             // standard toolbar height
            '--ion-safe-area-top': '0px' // ensure no safe area offset
          }}
        >
        {/* Hamburger Menu + Logo */}
        <IonButtons slot="start">
          <IonMenuButton autoHide={false} color="dark" />
          <img src="/logo2.png" alt="Logo" className="header-logo" />
          <b style={{ padding: '10px' }}>MAHA-DISHA</b>
          <div className="header-left">
          <div className="breadcrumb" style={{ color: '#fff' }}>
            <span className="breadcrumb-link">{breadcrumb.main}</span>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-link active">{breadcrumb.current}</span>
          </div>
        </div>
        </IonButtons>

        {/* Breadcrumb */}
       

        {/* User Info */}
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
    </IonHeader>
  );
};

export default DashboardHeader;
