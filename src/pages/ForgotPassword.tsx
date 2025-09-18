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
  IonBackButton,
  IonButtons,
  IonText
} from '@ionic/react';
import { arrowBackOutline, arrowForwardOutline } from 'ionicons/icons';
import './ForgotPassword.css';

const ForgotPassword: React.FC = () => {
  const [aadhaar, setAadhaar] = useState('');

  const handleSendOTP = () => {
    // Handle OTP sending logic here
    console.log('Sending OTP for Aadhaar:', aadhaar);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/login" icon={arrowBackOutline} />
          </IonButtons>
          <IonTitle>Forgot Password</IonTitle>
        </IonToolbar>
      </IonHeader>
      
      <IonContent fullscreen>
        <div className="forgot-password-container">
          {/* Left Section - Image */}
          <div className="forgot-password-left">
            <div className="image-container">
              <img src="/forget.png" alt="Forgot Password" className="forgot-image" />
            </div>
          </div>

          {/* Right Section - Form */}
          <div className="forgot-password-right">
            <div className="form-card">
              <h2 className="form-title">Enter Your Aadhaar</h2>
              
              <div className="input-group">
                <label className="input-label">Aadhaar Number</label>
                <IonInput
                  type="text"
                  placeholder="---- ---- ----"
                  value={aadhaar}
                  onIonInput={(e) => setAadhaar(e.detail.value!)}
                  className="aadhaar-input"
                  maxlength={12}
                  required
                />
              </div>

              <IonButton
                expand="block"
                className="send-otp-btn"
                onClick={handleSendOTP}
                disabled={aadhaar.length < 12}
              >
                Send OTP
              </IonButton>

              <div className="form-footer">
                <IonIcon icon={arrowForwardOutline} className="arrow-icon" />
              </div>
               
               <div className="signup-link-section">
                 <IonText>
                   Don't have an account?{' '}
                   <IonButton fill="clear" size="small" onClick={() => history.push('/signup')}>
                     Sign Up
                   </IonButton>
                 </IonText>
               </div>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default ForgotPassword;
