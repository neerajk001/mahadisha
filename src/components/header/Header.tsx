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
import './header.css'

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const history = useHistory();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navigateToLogin = () => {
    history.push('/login');
    setIsMenuOpen(false);
  };

  const navigateToSignup = () => {
    console.log('Navigating to signup page...');
    history.push('/signup');
    setIsMenuOpen(false);
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
            <IonButton className="nav-button">
              About
            </IonButton>
            <IonButton className="nav-button">
              Schemes
            </IonButton>
            <IonButton className="nav-button" onClick={navigateToSignup}>
              Signup
            </IonButton>
            <IonButton className="login-button" onClick={navigateToLogin}>
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
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </IonItem>
              <IonItem 
                button 
                className="mobile-menu-item"
                onClick={() => setIsMenuOpen(false)}
              >
                Schemes
              </IonItem>
              <IonItem 
                button 
                className="mobile-menu-item"
                onClick={() => { history.push('/signup'); setIsMenuOpen(false); }}
              >
                Signup
              </IonItem>
              <IonItem 
                button 
                className="mobile-menu-item"
                onClick={navigateToLogin}
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
