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
  IonButtons,
  IonAlert
} from '@ionic/react';
import { eyeOutline, eyeOffOutline, arrowBackOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import './Login.css';

const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const history = useHistory();

  // Test credentials for admin login
  const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'admin123'
  };

  const handleLogin = () => {
    // Check if credentials match test admin credentials
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      // Store user information in localStorage
      const userInfo = {
        name: 'Admin User',
        role: 'Admin',
        level: 'Master Admin',
        username: username
      };
      localStorage.setItem('currentUser', JSON.stringify(userInfo));
      
      // Successful login - redirect to dashboard
      console.log('Admin login successful');
      history.push('/dashboard');
    } else {
      // Invalid credentials
      setAlertMessage('Invalid username or password. Please use admin/admin123 for testing.');
      setShowAlert(true);
    }
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
                    <IonButton fill="clear" size="small" onClick={() => history.push('/forgot-password')}>
                      Forgot Password?
                    </IonButton>
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
                    <IonButton fill="clear" size="small" onClick={() => history.push('/signup')}>
                      Sign up
                    </IonButton>
                  </IonText>
                </div>
              </form>
            </div>
          </div>
        </div>
      </IonContent>

      {/* Alert for invalid credentials */}
      <IonAlert
        isOpen={showAlert}
        onDidDismiss={() => setShowAlert(false)}
        header="Login Failed"
        message={alertMessage}
        buttons={['OK']}
      />
    </IonPage>
  );
};

export default Login;
