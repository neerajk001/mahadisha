import React, { useState } from 'react';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonList,
  IonItem
} from '@ionic/react';
import { personOutline, chevronDownOutline, chevronUpOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { useIonRouter } from '@ionic/react';
import './header.css'

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const history = useHistory();
  const ionRouter = useIonRouter();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navigateToLogin = () => {
    console.log('Navigating to login page...');
    try {
      // Try Ionic router first
      ionRouter.push('/login');
      setIsMenuOpen(false);
      console.log('Ionic navigation to login successful');
    } catch (error) {
      console.error('Ionic navigation error:', error);
      // Fallback to React Router
      try {
        history.push('/login');
        setIsMenuOpen(false);
        console.log('React Router navigation to login successful');
      } catch (fallbackError) {
        console.error('React Router navigation error:', fallbackError);
      }
    }
  };

  const navigateToSignup = () => {
    console.log('Navigating to signup page...');
    try {
      // Try Ionic router first
      ionRouter.push('/signup');
      setIsMenuOpen(false);
      console.log('Ionic navigation to signup successful');
    } catch (error) {
      console.error('Ionic navigation error:', error);
      // Fallback to React Router
      try {
        history.push('/signup');
        setIsMenuOpen(false);
        console.log('React Router navigation to signup successful');
      } catch (fallbackError) {
        console.error('React Router navigation error:', fallbackError);
        // Final fallback to window.location
        try {
          window.location.href = '/signup';
          console.log('Window location navigation to signup successful');
        } catch (windowError) {
          console.error('Window location navigation error:', windowError);
        }
      }
    }
  };

  return (
    <>
      <IonHeader className="custom-header">
        <IonToolbar className="custom-toolbar">
          <IonTitle slot="start" className="custom-title">
            <div className="title-container">
              <div>
                <img src="/mahadisha.png" alt="" className="logo-image" />
              </div>
            </div>
          </IonTitle>
          
          {/* Desktop Navigation */}
          <IonButtons slot="end" className="desktop-nav">
            <IonButton className="nav-button" onClick={() => history.push('/about')}>
              About
            </IonButton>
            <IonButton className="nav-button" onClick={() => history.push('/schemes')}>
              Schemes
            </IonButton>
            <IonButton 
              className="nav-button" 
              onClick={() => {
                console.log('Desktop signup button clicked');
                try {
                  ionRouter.push('/signup');
                  console.log('IonRouter navigation to signup successful');
                } catch (error) {
                  console.error('IonRouter navigation error:', error);
                  try {
                    history.push('/signup');
                    console.log('History navigation to signup successful');
                  } catch (historyError) {
                    console.error('History navigation error:', historyError);
                    // Final fallback
                    window.location.href = '/signup';
                  }
                }
              }}
            >
              Signup
            </IonButton>
            <IonButton className="login-button" onClick={() => history.push('/login')}>
              <IonIcon icon={personOutline} slot="start" />
              Login
            </IonButton>
          </IonButtons>
          
          {/* Mobile Menu Button */}
          <IonButtons slot="end" className="mobile-nav">
            <IonButton className="mobile-menu-button" onClick={toggleMenu}>
              <IonIcon icon={isMenuOpen ? chevronUpOutline : chevronDownOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
        
        {/* Mobile Dropdown Menu */}
        {isMenuOpen && (
          <div className="mobile-dropdown">
            <IonList className="mobile-menu-list">
              <IonItem 
                button 
                className="mobile-menu-item"
                onClick={() => {
                  history.push('/about');
                  setIsMenuOpen(false);
                }}
              >
                About
              </IonItem>
              <IonItem 
                button 
                className="mobile-menu-item"
                onClick={() => {
                  history.push('/schemes');
                  setIsMenuOpen(false);
                }}
              >
                Schemes
              </IonItem>
              <IonItem 
                button 
                className="mobile-menu-item"
                onClick={() => {
                  console.log('Mobile signup button clicked');
                  try {
                    ionRouter.push('/signup');
                    console.log('Mobile IonRouter navigation to signup successful');
                    setIsMenuOpen(false);
                  } catch (error) {
                    console.error('Mobile IonRouter navigation error:', error);
                    try {
                      history.push('/signup');
                      console.log('Mobile history navigation to signup successful');
                      setIsMenuOpen(false);
                    } catch (historyError) {
                      console.error('Mobile history navigation error:', historyError);
                      // Final fallback
                      window.location.href = '/signup';
                      setIsMenuOpen(false);
                    }
                  }
                }}
              >
                Signup
              </IonItem>
              <IonItem 
                button 
                className="mobile-menu-item"
                onClick={() => {
                  history.push('/login');
                  setIsMenuOpen(false);
                }}
              >
                <IonIcon icon={personOutline} slot="start" />
                Login
              </IonItem>
            </IonList>
          </div>
        )}
      </IonHeader>
    </>
  );
};

export default Header;
