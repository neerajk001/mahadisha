import React from 'react';
import { IonButton, IonIcon, IonText } from '@ionic/react';
import { chevronBackOutline, chevronForwardOutline, checkmarkCircle } from 'ionicons/icons';
import './StepNavigation.css';

interface StepNavigationProps {
  currentStep: number;
  totalSteps: number;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit?: () => void;
  isValid: boolean;
  isFirstStep?: boolean;
  isFinalStep?: boolean;
  previousLabel?: string;
  nextLabel?: string;
  submitLabel?: string;
  showValidationMessage?: boolean;
  validationMessage?: string;
  className?: string;
}

const StepNavigation: React.FC<StepNavigationProps> = ({
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
  onSubmit,
  isValid,
  isFirstStep = false,
  isFinalStep = false,
  previousLabel = 'Previous',
  nextLabel = 'Next',
  submitLabel = 'Submit Application',
  showValidationMessage = true,
  validationMessage = 'Please fill in all required fields before proceeding to the next step.',
  className = ''
}) => {
  const handleNextClick = () => {
    if (isFinalStep && onSubmit) {
      onSubmit();
    } else {
      onNext();
    }
  };

  return (
    <>
      {/* Navigation Buttons */}
      <div className={`step-navigation-buttons ${className}`}>
        <IonButton
          fill="outline"
          className={`step-nav-button step-previous-button ${isFirstStep || currentStep === 1 ? 'disabled' : ''}`}
          onClick={onPrevious}
          disabled={isFirstStep || currentStep === 1}
        >
          <IonIcon icon={chevronBackOutline} slot="start" />
          {previousLabel}
        </IonButton>
        
        {isFinalStep ? (
          <IonButton
            className={`step-nav-button step-submit-button ${!isValid ? 'disabled' : ''}`}
            onClick={handleNextClick}
            disabled={!isValid}
          >
            <IonIcon icon={checkmarkCircle} slot="start" />
            {submitLabel}
          </IonButton>
        ) : (
          <IonButton
            className={`step-nav-button step-next-button ${!isValid ? 'disabled' : ''}`}
            onClick={handleNextClick}
            disabled={!isValid}
          >
            {nextLabel}
            <IonIcon icon={chevronForwardOutline} slot="end" />
          </IonButton>
        )}
      </div>
      
      {/* Validation Status Indicator */}
      {showValidationMessage && !isValid && (
        <div className="step-validation-message">
          <IonText color="warning">
            <p>⚠️ {validationMessage}</p>
          </IonText>
        </div>
      )}
    </>
  );
};

export default StepNavigation;
