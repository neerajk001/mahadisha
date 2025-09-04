import React, { useState } from 'react';
import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonInput,
  IonButton,
  IonIcon,
  IonLabel,
  IonItem,
  IonText,
  IonBackButton,
  IonButtons
} from '@ionic/react';
import { eyeOutline, eyeOffOutline, arrowBackOutline } from 'ionicons/icons';
import './Login.css';

const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Handle login logic here
    console.log('Login attempt:', { username, password });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" icon={arrowBackOutline} />
          </IonButtons>
          <IonTitle>Login</IonTitle>
        </IonToolbar>
      </IonHeader>
      
      <IonContent fullscreen>
        <div className="login-container">
          {/* Left Section - Teal Background with Logo */}
          <div className="login-left-section">
            <div className="login-logo-container">
              <div className="login-logo-placeholder">
                <img src="/mahadisha.png" alt="MAHA-DISHA Logo" className="mahadisha-logo" />
                <div className="logo-text">
                  <h1 className="logo-title">MAHA-DISHA</h1>
                  <p className="logo-subtitle">Digital Integrated System for Holistic Administration</p>
                </div>
              </div>
            </div>
            <div className="login-welcome">
              <h2>Welcome!</h2>
            </div>
          </div>

          {/* Right Section - White Background with Login Form */}
          <div className="login-right-section">
            <div className="login-form-container">
              <h2 className="login-form-title">Login to Your Account</h2>
              
              <form className="login-form" onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
                <div className="input-group">
                  <label className="input-label">Username</label>
                  <IonItem className="login-input-item">
                    <IonInput
                      type="text"
                      placeholder="Enter Your Username / Mobile"
                      value={username}
                      onIonInput={(e) => setUsername(e.detail.value!)}
                      required
                    />
                  </IonItem>
                </div>

                <div className="input-group">
                  <label className="input-label">Password</label>
                  <IonItem className="login-input-item">
                    <IonInput
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter Your Password"
                      value={password}
                      onIonInput={(e) => setPassword(e.detail.value!)}
                      required
                    />
                    <IonButton
                      fill="clear"
                      slot="end"
                      onClick={togglePasswordVisibility}
                      className="password-toggle-btn"
                    >
                      <IonIcon icon={showPassword ? eyeOffOutline : eyeOutline} />
                    </IonButton>
                  </IonItem>
                </div>

                <div className="forgot-password">
                  <IonText color="primary">
                    <a href="/forgot-password" className="forgot-password-link">Forgot Password?</a>
                  </IonText>
                </div>

                <IonButton
                  expand="block"
                  className="login-submit-btn"
                  onClick={handleLogin}
                  type="submit"
                >
                  Login
                </IonButton>

                <div className="create-account">
                  <IonText>
                    Don't have an account?{' '}
                    <a href="/signup" className="create-account-link">Sign In</a>
                  </IonText>
                </div>
              </form>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Login;
