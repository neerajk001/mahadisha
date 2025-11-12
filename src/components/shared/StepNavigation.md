# StepNavigation Component

A reusable step-by-step navigation component for multi-step forms and wizards.

## Features

- ✅ Previous/Next navigation buttons
- ✅ Submit button for final step
- ✅ Built-in validation state handling
- ✅ Customizable labels
- ✅ Mobile responsive
- ✅ Admin and public layout support
- ✅ Automatic disabled states
- ✅ Validation message display

## Usage

### Basic Example

```tsx
import { StepNavigation } from '../../components/shared';

const MyForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 10;

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleSubmit = () => {
    console.log('Form submitted!');
  };

  const isCurrentStepValid = validateCurrentStep(); // Your validation logic

  return (
    <div>
      {/* Your form content here */}
      
      <StepNavigation
        currentStep={currentStep}
        totalSteps={totalSteps}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onSubmit={handleSubmit}
        isValid={isCurrentStepValid}
        isFinalStep={currentStep === totalSteps}
      />
    </div>
  );
};
```

### Advanced Example with Custom Labels

```tsx
<StepNavigation
  currentStep={currentStep}
  totalSteps={10}
  onPrevious={handlePrevious}
  onNext={handleNext}
  onSubmit={handleSubmit}
  isValid={isCurrentStepValid}
  isFinalStep={currentStep === totalSteps}
  previousLabel="Back"
  nextLabel="Continue"
  submitLabel="Complete Application"
  validationMessage="Please complete all required fields before continuing."
  showValidationMessage={true}
  className="my-custom-class"
/>
```

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `currentStep` | number | ✅ | - | Current step number (1-based) |
| `totalSteps` | number | ✅ | - | Total number of steps |
| `onPrevious` | () => void | ✅ | - | Callback when Previous is clicked |
| `onNext` | () => void | ✅ | - | Callback when Next is clicked |
| `onSubmit` | () => void | ❌ | - | Callback when Submit is clicked (final step) |
| `isValid` | boolean | ✅ | - | Whether current step is valid |
| `isFirstStep` | boolean | ❌ | false | Override first step detection |
| `isFinalStep` | boolean | ❌ | false | Whether this is the final step |
| `previousLabel` | string | ❌ | "Previous" | Label for previous button |
| `nextLabel` | string | ❌ | "Next" | Label for next button |
| `submitLabel` | string | ❌ | "Submit Application" | Label for submit button |
| `showValidationMessage` | boolean | ❌ | true | Show validation message when invalid |
| `validationMessage` | string | ❌ | "Please fill in all..." | Custom validation message |
| `className` | string | ❌ | "" | Additional CSS classes |

## Styling

The component is fully responsive and includes:
- Mobile-optimized button sizes (< 768px)
- Extra small device support (< 480px)
- Admin layout integration
- Smooth animations and transitions

## Migration from Inline Navigation

### Before (Inline)
```tsx
<div className="navigation-buttons">
  <IonButton
    fill="outline"
    className={`nav-button previous-button ${currentStep === 1 ? 'disabled' : ''}`}
    onClick={handlePrevious}
    disabled={currentStep === 1}
  >
    <IonIcon icon={chevronBackOutline} slot="start" />
    Previous
  </IonButton>
  
  {currentStep === 10 ? (
    <IonButton
      className={`nav-button submit-button ${!getCurrentStepValidation() ? 'disabled' : ''}`}
      onClick={handleSubmitApplication}
      disabled={!getCurrentStepValidation()}
    >
      <IonIcon icon={checkmarkCircle} slot="start" />
      Submit Application
    </IonButton>
  ) : (
    <IonButton
      className={`nav-button next-button ${!getCurrentStepValidation() ? 'disabled' : ''}`}
      onClick={handleNext}
      disabled={!getCurrentStepValidation()}
    >
      Next
      <IonIcon icon={chevronForwardOutline} slot="end" />
    </IonButton>
  )}
</div>

{!getCurrentStepValidation() && (
  <div className="validation-message">
    <IonText color="warning">
      <p>⚠️ Please complete all required fields to proceed</p>
    </IonText>
  </div>
)}
```

### After (Using Component)
```tsx
<StepNavigation
  currentStep={currentStep}
  totalSteps={10}
  onPrevious={handlePrevious}
  onNext={handleNext}
  onSubmit={handleSubmitApplication}
  isValid={getCurrentStepValidation()}
  isFinalStep={currentStep === 10}
/>
```

## Benefits

1. **Consistency**: Same navigation UI across all forms
2. **Maintainability**: Update once, reflect everywhere
3. **Accessibility**: Built-in disabled states and ARIA support
4. **Responsive**: Mobile-first design with touch-friendly targets
5. **Customizable**: Flexible props for different use cases
6. **Type-safe**: Full TypeScript support
