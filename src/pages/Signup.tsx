import React, { useState, useRef } from 'react';
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButton,
  IonItem,
  IonInput,
  IonIcon,
  IonText,
  IonBackButton,
  IonButtons
} from '@ionic/react';
import { personOutline, cameraOutline } from 'ionicons/icons';
import './Signup.css';

const Signup: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [aadhaar, setAadhaar] = useState('');
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [picturePreview, setPicturePreview] = useState<string | null>(null);
  const [aadhaarError, setAadhaarError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateAadhaar = (value: string): string => {
    // Remove any spaces or dashes
    const cleanValue = value.replace(/[\s-]/g, '');
    
    // Check if it contains only digits
    if (!/^\d+$/.test(cleanValue)) {
      return 'Aadhaar number should contain only digits';
    }
    
    // Check if it's exactly 12 digits
    if (cleanValue.length !== 12) {
      return 'Aadhaar number should be exactly 12 digits';
    }
    
    return '';
  };

  const handleAadhaarInput = (event: any) => {
    const value = event.detail.value || '';
    // Remove any non-digit characters
    const cleanValue = value.replace(/\D/g, '');
    
    // Format with spaces every 4 digits
    let formattedValue = '';
    for (let i = 0; i < cleanValue.length; i++) {
      if (i > 0 && i % 4 === 0) {
        formattedValue += ' ';
      }
      formattedValue += cleanValue[i];
    }
    
    setAadhaar(formattedValue);
    
    // Validate and set error
    const error = validateAadhaar(cleanValue);
    setAadhaarError(error);
  };

  const openFileInput = () => {
    fileInputRef.current?.click();
  };

  const handlePictureUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setProfilePicture(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPicturePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSignup = () => {
    // Final validation before submission
    const cleanAadhaar = aadhaar.replace(/[\s-]/g, '');
    const finalError = validateAadhaar(cleanAadhaar);
    
    if (finalError) {
      setAadhaarError(finalError);
      return;
    }
    
    // Proceed with signup logic
    console.log('Signup data:', {
      fullName,
      username,
      aadhaar: cleanAadhaar,
      profilePicture
    });
  };

  const isFormValid = () => {
    const cleanAadhaar = aadhaar.replace(/[\s-]/g, '');
    return fullName && username && cleanAadhaar.length === 12 && !aadhaarError && profilePicture;
  };

  return (
    <>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" />
          </IonButtons>
          <IonTitle>Sign Up</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <div className="signup-container">
          {/* Left Section - Logo */}
          <div className="signup-left-section">
            <div className="logo-container">
              <img src="/mahadisha.png" alt="MAHA-DISHA Logo" className="mahadisha-logo" />
              <div className="welcome-message">
                <h1 className="welcome-title">Welcome!</h1>
                <p className="welcome-subtitle">Join MAHA-DISHA</p>
                <p className="welcome-description">
                  Digital Integrated System for Holistic Administration
                </p>
                <p className="welcome-greeting">
                  We're excited to have you on board! Create your account to access government schemes and services seamlessly.
                </p>
              </div>
            </div>
          </div>

          {/* Right Section - Form */}
          <div className="signup-right-section">
            <div className="signup-form-container">
              <h2 className="signup-form-title">Create Your Account</h2>
              
              <form className="signup-form" onSubmit={(e) => { e.preventDefault(); handleSignup(); }}>
                <div className="form-row">
                  <div className="input-group">
                    <label className="input-label">Full Name (as per Aadhaar)</label>
                    <IonItem className="signup-input-item">
                      <IonInput
                        type="text"
                        placeholder="Enter your full name"
                        value={fullName}
                        onIonInput={(e) => setFullName(e.detail.value!)}
                        required
                      />
                    </IonItem>
                  </div>

                  <div className="input-group">
                    <label className="input-label">Username</label>
                    <IonItem className="signup-input-item">
                      <IonInput
                        type="text"
                        placeholder="Choose a username"
                        value={username}
                        onIonInput={(e) => setUsername(e.detail.value!)}
                        required
                      />
                    </IonItem>
                  </div>
                </div>

                <div className="form-row">
                  <div className="input-group">
                    <label className="input-label">Password</label>
                    <IonItem className="signup-input-item">
                      <IonInput
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onIonInput={(e) => setPassword(e.detail.value!)}
                        required
                      />
                    </IonItem>
                  </div>

                  <div className="input-group">
                    <label className="input-label">Confirm Password</label>
                    <IonItem className="signup-input-item">
                      <IonInput
                        type="password"
                        placeholder="Confirm your password"
                        value={confirmPassword}
                        onIonInput={(e) => setConfirmPassword(e.detail.value!)}
                        required
                      />
                    </IonItem>
                  </div>
                </div>

                <div className="form-row">
                  <div className="input-group">
                    <label className="input-label">Aadhaar Number</label>
                    <IonItem className="signup-input-item">
                      <IonInput
                        type="text"
                        placeholder="---- ---- ----"
                        value={aadhaar}
                        onIonInput={handleAadhaarInput}
                        maxlength={19}
                        required
                      />
                    </IonItem>
                    {aadhaarError && (
                      <div className="error-message">
                        <IonText color="danger">
                          {aadhaarError}
                        </IonText>
                      </div>
                    )}
                  </div>

                  <div className="input-group">
                    <label className="input-label">Profile Picture</label>
                    <div className="picture-upload-section">
                      <div className="picture-preview">
                        {picturePreview ? (
                          <img src={picturePreview} alt="Profile Preview" className="preview-image" />
                        ) : (
                          <div className="upload-placeholder">
                            <IonIcon icon={personOutline} className="placeholder-icon" />
                            <span>No image selected</span>
                          </div>
                        )}
                      </div>
                      <IonButton
                        fill="outline"
                        className="upload-btn"
                        onClick={openFileInput}
                      >
                        <IonIcon icon={cameraOutline} slot="start" />
                        Upload Picture
                      </IonButton>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handlePictureUpload}
                        style={{ display: 'none' }}
                      />
                    </div>
                  </div>
                </div>

                <IonButton
                  expand="block"
                  className="signup-submit-btn"
                  onClick={handleSignup}
                  type="submit"
                  disabled={!isFormValid()}
                >
                  Create Account
                </IonButton>

                <div className="signup-footer">
                  <IonText>
                    Already have an account?{' '}
                    <a href="/login" className="signin-link">Sign In</a>
                  </IonText>
                </div>
              </form>
            </div>
          </div>
        </div>
      </IonContent>
    </>
  );
};

export default Signup;
