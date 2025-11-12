import React, { useState, useEffect } from 'react';
import { IonPage, IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton } from '@ionic/react';
import { 
  IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonText, IonInput, 
  IonSelect, IonSelectOption, IonButton, IonItem, IonLabel, IonIcon, IonModal, IonCheckbox, IonChip, IonToast, IonLoading 
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { searchOutline, chevronDownOutline, checkmarkCircle } from 'ionicons/icons';
import Header from '../components/header/Header';
import { StepNavigation } from '../components/shared';
import './LoanApplication.css';

const LoanApplication: React.FC = () => {
  const history = useHistory();
  const [currentStep, setCurrentStep] = useState(1);
  const [loanAmount, setLoanAmount] = useState('');
  const [applicationType, setApplicationType] = useState('');
  const [loanTenure, setLoanTenure] = useState('3');
  const [loanAmountError, setLoanAmountError] = useState('');
  
  // Application Type Search state
  const [appTypeSearchTerm, setAppTypeSearchTerm] = useState('');
  const [showAppTypeDropdown, setShowAppTypeDropdown] = useState(false);
  const [filteredAppTypes, setFilteredAppTypes] = useState<string[]>([]);
  const [selectedDropdownIndex, setSelectedDropdownIndex] = useState(-1);
  
  // Undercaste Search state
  const [undercasteSearchTerm, setUndercasteSearchTerm] = useState('');
  const [showUndercasteDropdown, setShowUndercasteDropdown] = useState(false);
  const [filteredUndercaste, setFilteredUndercaste] = useState<string[]>([]);
  const [selectedUndercasteIndex, setSelectedUndercasteIndex] = useState(-1);
  
  // KYC Details state
  const [aadharDigits, setAadharDigits] = useState(['', '', '', '', '', '', '', '', '', '', '', '']);
  const [aadhaarError, setAadhaarError] = useState('');
  const [showOTPPopup, setShowOTPPopup] = useState(false);
  const [otp, setOtp] = useState('');
  const [aadhaarVerified, setAadhaarVerified] = useState(false);
  const [showValidating, setShowValidating] = useState(false);
  const [toast, setToast] = useState<{open: boolean; message: string}>({open: false, message: ''});
  const [personalDetails, setPersonalDetails] = useState({
    name: '',
    dob: '',
    gender: '',
    profilePicture: 'https://via.placeholder.com/80x80/4F46E5/FFFFFF?text=N'
  });
  const [kycData, setKycData] = useState({
    pan: '',
    bankName: '',
    accountNumber: '',
    confirmAccountNumber: '',
    ifscCode: '',
    accountHolderName: ''
  });

  // Basic Details state
  const [basicDetails, setBasicDetails] = useState({
    firstName: '',
    lastName: '',
    middleName: '',
    gender: '',
    age: '',
    fatherHusbandName: '',
    motherFullName: '',
    basicEducation: '',
    mobile: '',
    dob: '',
    rationCardType: '',
    email: '',
    subcaste: '',
    undercaste: '',
    safaiKarmachariId: ''
  });

  // Address Details state
  const [addressDetails, setAddressDetails] = useState({
    currentAddress: {
      address: '',
      city: '',
      state: '',
      pincode: '',
      district: '',
      taluka: '',
      village: '',
      landmark: ''
    },
    permanentAddress: {
      address: '',
      city: '',
      state: '',
      pincode: '',
      district: '',
      taluka: '',
      village: '',
      landmark: ''
    },
    sameAsCurrent: false
  });

  // Collaterals state
  const [collateralDetails, setCollateralDetails] = useState({
    collateralType: '',
    goldDetails: {
      weight: '',
      purity: '',
      description: ''
    },
    landDetails: {
      area: '',
      location: '',
      surveyNumber: '',
      description: ''
    },
    carDetails: {
      make: '',
      model: '',
      year: '',
      registrationNumber: '',
      description: ''
    },
    otherDetails: {
      description: '',
      value: ''
    }
  });

  // Guarantors state
  const [guarantorDetails, setGuarantorDetails] = useState({
    guarantorType: 'Individual',
    aadharDigits: ['', '', '', '', '', '', '', '', '', '', '', ''],
    firstName: '',
    lastName: '',
    relationship: '',
    mobile: '',
    email: '',
    address: '',
    guaranteeAmount: ''
  });
  
  // Guarantor Aadhaar verification state
  const [guarantorAadhaarError, setGuarantorAadhaarError] = useState('');
  const [showGuarantorOTPPopup, setShowGuarantorOTPPopup] = useState(false);
  const [guarantorOtp, setGuarantorOtp] = useState('');
  const [guarantorAadhaarVerified, setGuarantorAadhaarVerified] = useState(false);
  const [showGuarantorValidating, setShowGuarantorValidating] = useState(false);

  // Witnesses state
  const [witnesses, setWitnesses] = useState([
    {
      id: 1,
      name: '',
      relation: '',
      contact: '',
      email: ''
    }
  ]);

  // Documents state
  const [documents, setDocuments] = useState([
    { id: 1, type: '', file: null, fileName: '' }
  ]);

  // Family Details state
  const [familyMembers, setFamilyMembers] = useState([
    {
      id: 1,
      personName: '',
      relation: '',
      email: '',
      age: '',
      memberContact: '',
      occupation: ''
    }
  ]);

  // Vendor Details state
  const [vendorDetails, setVendorDetails] = useState({
    vendorType: '',
    vendorName: '',
    vendorContact: '',
    vendorAddress: '',
    vendorPincode: '',
    vendorPAN: '',
    gstNo: '',
    amountToBePaid: ''
  });

  const steps = [
    { number: 1, title: 'Loan', active: currentStep === 1 },
    { number: 2, title: 'KYC Details', active: currentStep === 2 },
    { number: 3, title: 'Basic Details', active: currentStep === 3 },
    { number: 4, title: 'Address Details', active: currentStep === 4 },
    { number: 5, title: 'Family Details', active: currentStep === 5 },
    { number: 6, title: 'Collaterals', active: currentStep === 6 },
    { number: 7, title: 'Guarantors', active: currentStep === 7 },
    { number: 8, title: 'Witnesses', active: currentStep === 8 },
    { number: 9, title: 'Documents', active: currentStep === 9 },
    { number: 10, title: 'Vendor', active: currentStep === 10 }
  ];

  const applicationTypes = [
    'Computer Training',
    'Fashion Designing',
    'Utensils Shops',
    'Motor Winding',
    'Paintings (Automobiles)',
    'Readymade Garment Business',
    'Automobile Repairing Service Center (2/3/4 Wheeler)'
  ];

  // Initialize filtered app types
  useEffect(() => {
    setFilteredAppTypes(applicationTypes);
    setFilteredUndercaste(undercasteOptions);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.searchable-select-container')) {
        setShowAppTypeDropdown(false);
        setSelectedDropdownIndex(-1);
        setShowUndercasteDropdown(false);
        setSelectedUndercasteIndex(-1);
      }
    };

    if (showAppTypeDropdown || showUndercasteDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showAppTypeDropdown, showUndercasteDropdown]);

  // Handle application type dropdown toggle
  const handleAppTypeDropdownToggle = () => {
    const newState = !showAppTypeDropdown;
    setShowAppTypeDropdown(newState);
    setSelectedDropdownIndex(-1);
    setAppTypeSearchTerm(''); // Clear search when opening
    setFilteredAppTypes(applicationTypes); // Show all options initially
  };

  // Handle application type search within dropdown
  const handleAppTypeSearch = (searchValue: string) => {
    setAppTypeSearchTerm(searchValue);
    setSelectedDropdownIndex(-1);
    
    if (!searchValue.trim()) {
      setFilteredAppTypes(applicationTypes);
    } else {
      const filtered = applicationTypes.filter(type => 
        type.toLowerCase().includes(searchValue.toLowerCase())
      );
      setFilteredAppTypes(filtered);
    }
  };

  const handleAppTypeSelect = (selectedType: string) => {
    setApplicationType(selectedType);
    setAppTypeSearchTerm('');
    setShowAppTypeDropdown(false);
    setSelectedDropdownIndex(-1);
  };

  const handleAppTypeKeyDown = (e: any) => {
    if (!showAppTypeDropdown) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedDropdownIndex(prev => 
          prev < filteredAppTypes.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedDropdownIndex(prev => 
          prev > 0 ? prev - 1 : filteredAppTypes.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedDropdownIndex >= 0 && filteredAppTypes[selectedDropdownIndex]) {
          handleAppTypeSelect(filteredAppTypes[selectedDropdownIndex]);
        }
        break;
      case 'Escape':
        setShowAppTypeDropdown(false);
        setSelectedDropdownIndex(-1);
        break;
    }
  };


  // Basic Details dropdown options
  const rationCardTypes = ['Orange', 'Blue', 'Green', 'Yellow', 'White'];
  const subcasteOptions = ['Chalvadi, Channayya', 'Koli', 'Bhandari', 'Kunbi', 'Maratha', 'Other'];
  const undercasteOptions = ['Hindu Undivided Family', 'Scheduled Caste', 'Scheduled Tribe', 'Other Backward Class', 'General'];

  // Collateral dropdown options
  const collateralTypes = ['Gold', 'Land', 'Car', 'Other'];

  // Guarantor dropdown options
  const guarantorTypes = ['Individual', 'Company', 'Institution', 'Other'];

  // Witness relation options
  const witnessRelations = ['Wife', 'Husband', 'Father', 'Mother', 'Brother', 'Sister', 'Friend', 'Neighbor', 'Colleague', 'Other'];

  const convertNumberToWords = (num: number): string => {
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];

    if (num === 0) return 'Zero';
    if (num < 10) return ones[num];
    if (num < 20) return teens[num - 10];
    if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 ? ' ' + ones[num % 10] : '');
    if (num < 1000) return ones[Math.floor(num / 100)] + ' Hundred' + (num % 100 ? ' ' + convertNumberToWords(num % 100) : '');
    if (num < 100000) return convertNumberToWords(Math.floor(num / 1000)) + ' Thousand' + (num % 1000 ? ' ' + convertNumberToWords(num % 1000) : '');
    if (num < 10000000) return convertNumberToWords(Math.floor(num / 100000)) + ' Lakh' + (num % 100000 ? ' ' + convertNumberToWords(num % 100000) : '');
    return convertNumberToWords(Math.floor(num / 10000000)) + ' Crore' + (num % 10000000 ? ' ' + convertNumberToWords(num % 10000000) : '');
  };

  const handleLoanAmountChange = (value: string) => {
    setLoanAmount(value);
    const amount = parseInt(value) || 0;
    if (amount > 50000) {
      setLoanAmountError('Requested Loan amount should be between ₹0 and ₹50,000');
    } else {
      setLoanAmountError('');
    }
  };

  // Step validation functions
  const validateStep1 = (): boolean => {
    if (!loanAmount || loanAmount === '0') return false;
    if (!applicationType) return false;
    if (!loanTenure) return false;
    if (loanAmountError) return false;
    return true;
  };

  const validateStep2 = (): boolean => {
    // Check if Aadhaar is filled and verified
    const aadhaarFilled = aadharDigits.every(digit => digit !== '');
    if (!aadhaarFilled || !aadhaarVerified) return false;
    
    // Check KYC details
    if (!kycData.pan || !kycData.bankName || !kycData.accountNumber || 
        !kycData.confirmAccountNumber || !kycData.ifscCode || !kycData.accountHolderName) return false;
    
    // Check if account numbers match
    if (kycData.accountNumber !== kycData.confirmAccountNumber) return false;
    
    return true;
  };

  const validateStep3 = (): boolean => {
    if (!basicDetails.firstName || !basicDetails.lastName || !basicDetails.gender || 
        !basicDetails.age || !basicDetails.fatherHusbandName || !basicDetails.motherFullName ||
        !basicDetails.basicEducation || !basicDetails.mobile || !basicDetails.dob ||
        !basicDetails.email) return false;
    return true;
  };

  const validateStep4 = (): boolean => {
    const { currentAddress, permanentAddress } = addressDetails;
    
    // Validate current address
    if (!currentAddress.address || !currentAddress.city || !currentAddress.state ||
        !currentAddress.pincode || !currentAddress.district || !currentAddress.taluka) return false;
    
    // If not same as current, validate permanent address
    if (!addressDetails.sameAsCurrent) {
      if (!permanentAddress.address || !permanentAddress.city || !permanentAddress.state ||
          !permanentAddress.pincode || !permanentAddress.district || !permanentAddress.taluka) return false;
    }
    
    return true;
  };

  const validateStep5 = (): boolean => {
    // At least one family member with required fields
    return familyMembers.some(member => 
      member.personName && member.relation && member.age && member.occupation
    );
  };

  const validateStep6 = (): boolean => {
    if (!collateralDetails.collateralType) return false;
    
    // Validate specific collateral details based on type
    switch (collateralDetails.collateralType) {
      case 'Gold':
        return !!(collateralDetails.goldDetails.weight && collateralDetails.goldDetails.purity);
      case 'Land':
        return !!(collateralDetails.landDetails.area && collateralDetails.landDetails.location);
      case 'Car':
        return !!(collateralDetails.carDetails.make && collateralDetails.carDetails.model && 
                 collateralDetails.carDetails.year && collateralDetails.carDetails.registrationNumber);
      case 'Other':
        return !!(collateralDetails.otherDetails.description && collateralDetails.otherDetails.value);
      default:
        return false;
    }
  };

  const validateStep7 = (): boolean => {
    // Check if guarantor Aadhaar is filled and verified
    const guarantorAadhaarFilled = guarantorDetails.aadharDigits.every(digit => digit !== '');
    if (!guarantorAadhaarFilled || !guarantorAadhaarVerified) return false;
    
    // Check guarantor basic details
    if (!guarantorDetails.firstName || !guarantorDetails.lastName || !guarantorDetails.relationship ||
        !guarantorDetails.mobile || !guarantorDetails.address || !guarantorDetails.guaranteeAmount) return false;
    
    return true;
  };

  const validateStep8 = (): boolean => {
    // At least one witness with required fields
    return witnesses.some(witness => 
      witness.name && witness.relation && witness.contact
    );
  };

  const validateStep9 = (): boolean => {
    // At least one document uploaded
    return documents.some(doc => doc.type && doc.file);
  };

  const validateStep10 = (): boolean => {
    if (!vendorDetails.vendorType || !vendorDetails.vendorName || !vendorDetails.vendorContact ||
        !vendorDetails.vendorAddress || !vendorDetails.vendorPincode || !vendorDetails.amountToBePaid) return false;
    return true;
  };

  // Get validation function for current step
  const getCurrentStepValidation = (): boolean => {
    switch (currentStep) {
      case 1: return validateStep1();
      case 2: return validateStep2();
      case 3: return validateStep3();
      case 4: return validateStep4();
      case 5: return validateStep5();
      case 6: return validateStep6();
      case 7: return validateStep7();
      case 8: return validateStep8();
      case 9: return validateStep9();
      case 10: return validateStep10();
      default: return true;
    }
  };

  const handleNext = () => {
    if (currentStep < 10) {
      const isCurrentStepValid = getCurrentStepValidation();
      if (!isCurrentStepValid) {
        setToast({
          open: true,
          message: 'Please fill in all required fields before proceeding to the next step.'
        });
        return;
      }
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Handle undercaste dropdown toggle
  const handleUndercasteDropdownToggle = () => {
    const newState = !showUndercasteDropdown;
    setShowUndercasteDropdown(newState);
    setSelectedUndercasteIndex(-1);
    setUndercasteSearchTerm(''); // Clear search when opening
    setFilteredUndercaste(undercasteOptions); // Show all options initially
  };

  // Handle undercaste search within dropdown
  const handleUndercasteSearch = (searchValue: string) => {
    setUndercasteSearchTerm(searchValue);
    setSelectedUndercasteIndex(-1);
    
    if (!searchValue.trim()) {
      setFilteredUndercaste(undercasteOptions);
    } else {
      const filtered = undercasteOptions.filter(caste => 
        caste.toLowerCase().includes(searchValue.toLowerCase())
      );
      setFilteredUndercaste(filtered);
    }
  };

  const handleUndercasteSelect = (selectedCaste: string) => {
    handleBasicDetailsChange('undercaste', selectedCaste);
    setUndercasteSearchTerm('');
    setShowUndercasteDropdown(false);
    setSelectedUndercasteIndex(-1);
  };

  const handleUndercasteKeyDown = (e: any) => {
    if (!showUndercasteDropdown) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedUndercasteIndex(prev => 
          prev < filteredUndercaste.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedUndercasteIndex(prev => 
          prev > 0 ? prev - 1 : filteredUndercaste.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedUndercasteIndex >= 0 && filteredUndercaste[selectedUndercasteIndex]) {
          handleUndercasteSelect(filteredUndercaste[selectedUndercasteIndex]);
        }
        break;
      case 'Escape':
        setShowUndercasteDropdown(false);
        setSelectedUndercasteIndex(-1);
        break;
    }
  };

  // Aadhar input handling
  const handleAadharDigitChange = (index: number, value: string) => {
    // Clear error message when user starts typing
    setAadhaarError('');
    
    // If empty value, allow it (for backspace/delete)
    if (value === '') {
      const newDigits = [...aadharDigits];
      newDigits[index] = '';
      setAadharDigits(newDigits);
      return;
    }
    
    // If more than 1 character, take only the last character
    const lastChar = value.slice(-1);
    
    // Validate: only single numeric digit allowed
    if (/^[0-9]$/.test(lastChar)) {
      const newDigits = [...aadharDigits];
      newDigits[index] = lastChar;
      setAadharDigits(newDigits);

      // Auto-focus next input when valid digit is entered
      if (index < 11) {
        setTimeout(() => {
          const nextInput = document.querySelector(`#aadhar-${index + 1} input`) as HTMLInputElement;
          if (nextInput) {
            nextInput.focus();
          }
        }, 50);
      }
      
      // Open validating overlay when all 12 digits are filled, then OTP modal
      if (newDigits.every(digit => digit !== '') && newDigits.length === 12) {
        setShowValidating(true);
        setTimeout(() => {
          setShowValidating(false);
          setShowOTPPopup(true);
        }, 1000);
      }
    } else {
      // Invalid character entered, show error but don't update state
      setAadhaarError('Only digits (0-9) are allowed for Aadhaar.');
      // Clear the error after 2 seconds
      setTimeout(() => {
        setAadhaarError('');
      }, 2000);
    }
  };

  const handleAadharKeyDown = (index: number, e: any) => {
    // Clear error when user interacts with input
    setAadhaarError('');
    
    if (e.key === 'Backspace') {
      e.preventDefault();
      const newDigits = [...aadharDigits];
      
      if (newDigits[index] !== '') {
        // Clear current digit
        newDigits[index] = '';
        setAadharDigits(newDigits);
      } else if (index > 0) {
        // Move to previous input and clear it
        newDigits[index - 1] = '';
        setAadharDigits(newDigits);
        setTimeout(() => {
          const prevInput = document.querySelector(`#aadhar-${index - 1} input`) as HTMLInputElement;
          if (prevInput) {
            prevInput.focus();
            prevInput.setSelectionRange(1, 1); // Position cursor at end
          }
        }, 50);
      }
    } else if (e.key === 'Delete') {
      e.preventDefault();
      const newDigits = [...aadharDigits];
      newDigits[index] = '';
      setAadharDigits(newDigits);
    } else if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault();
      const prevInput = document.querySelector(`#aadhar-${index - 1} input`) as HTMLInputElement;
      if (prevInput) {
        prevInput.focus();
      }
    } else if (e.key === 'ArrowRight' && index < 11) {
      e.preventDefault();
      const nextInput = document.querySelector(`#aadhar-${index + 1} input`) as HTMLInputElement;
      if (nextInput) {
        nextInput.focus();
      }
    }
  };

  // PAN input handling with auto-formatting
  const handlePANChange = (value: string) => {
    // Remove any non-alphanumeric characters and convert to uppercase
    const cleanValue = value.replace(/[^A-Z0-9]/gi, '').toUpperCase();
    
    // Limit to 10 characters
    if (cleanValue.length <= 10) {
      handleKycDataChange('pan', cleanValue);
      
      // Auto-focus next field when PAN is complete
      if (cleanValue.length === 10) {
        setTimeout(() => {
          const bankNameInput = document.getElementById('bank-name');
          bankNameInput?.focus();
        }, 100);
      }
    }
  };

  // Bank Name input handling
  const handleBankNameChange = (value: string) => {
    // Only allow letters, spaces, and common bank name characters
    const cleanValue = value.replace(/[^A-Za-z\s&.-]/g, '');
    handleKycDataChange('bankName', cleanValue);
    
    // Auto-focus next field when bank name is entered
    if (cleanValue.length >= 3) {
      setTimeout(() => {
        const accountNumberInput = document.getElementById('account-number');
        accountNumberInput?.focus();
      }, 100);
    }
  };

  // Account Number input handling
  const handleAccountNumberChange = (value: string) => {
    // Only allow numbers
    const cleanValue = value.replace(/[^0-9]/g, '');
    handleKycDataChange('accountNumber', cleanValue);
    
    // Auto-focus next field when account number is entered
    if (cleanValue.length >= 10) {
      setTimeout(() => {
        const confirmAccountInput = document.getElementById('confirm-account-number');
        confirmAccountInput?.focus();
      }, 100);
    }
  };

  // Confirm Account Number input handling
  const handleConfirmAccountNumberChange = (value: string) => {
    // Only allow numbers
    const cleanValue = value.replace(/[^0-9]/g, '');
    handleKycDataChange('confirmAccountNumber', cleanValue);
    
    // Auto-focus next field when confirmed
    if (cleanValue.length >= 10) {
      setTimeout(() => {
        const ifscInput = document.getElementById('ifsc-code');
        ifscInput?.focus();
      }, 100);
    }
  };

  // IFSC Code input handling
  const handleIFSCChange = (value: string) => {
    // Only allow alphanumeric characters and convert to uppercase
    const cleanValue = value.replace(/[^A-Z0-9]/gi, '').toUpperCase();
    
    // Limit to 11 characters
    if (cleanValue.length <= 11) {
      handleKycDataChange('ifscCode', cleanValue);
      
      // Auto-focus next field when IFSC is complete
      if (cleanValue.length === 11) {
        setTimeout(() => {
          const accountHolderInput = document.getElementById('account-holder-name');
          accountHolderInput?.focus();
        }, 100);
      }
    }
  };

  // Account Holder Name input handling
  const handleAccountHolderNameChange = (value: string) => {
    // Only allow letters and spaces
    const cleanValue = value.replace(/[^A-Za-z\s]/g, '');
    handleKycDataChange('accountHolderName', cleanValue);
  };

  // Basic Details handling
  const handleBasicDetailsChange = (field: string, value: string) => {
    setBasicDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Mobile number validation
  const handleMobileChange = (value: string) => {
    // Only allow numbers and limit to 10 digits
    const cleanValue = value.replace(/[^0-9]/g, '').slice(0, 10);
    handleBasicDetailsChange('mobile', cleanValue);
  };

  // Email validation
  const handleEmailChange = (value: string) => {
    // Basic email validation
    const cleanValue = value.toLowerCase();
    handleBasicDetailsChange('email', cleanValue);
  };

  // Age validation
  const handleAgeChange = (value: string) => {
    // Only allow numbers and limit to 3 digits
    const cleanValue = value.replace(/[^0-9]/g, '').slice(0, 3);
    handleBasicDetailsChange('age', cleanValue);
  };

  // Name validation (letters and spaces only)
  const handleNameChange = (field: string, value: string) => {
    const cleanValue = value.replace(/[^A-Za-z\s]/g, '');
    handleBasicDetailsChange(field, cleanValue);
  };

  // Address Details handling
  const handleAddressChange = (addressType: 'currentAddress' | 'permanentAddress', field: string, value: string) => {
    setAddressDetails(prev => ({
      ...prev,
      [addressType]: {
        ...prev[addressType],
        [field]: value
      }
    }));
  };

  // Pincode validation
  const handlePincodeChange = (addressType: 'currentAddress' | 'permanentAddress', value: string) => {
    // Only allow numbers and limit to 6 digits
    const cleanValue = value.replace(/[^0-9]/g, '').slice(0, 6);
    handleAddressChange(addressType, 'pincode', cleanValue);
  };

  // Address text validation
  const handleAddressTextChange = (addressType: 'currentAddress' | 'permanentAddress', field: string, value: string) => {
    // Allow letters, numbers, spaces, commas, and common address characters
    const cleanValue = value.replace(/[^A-Za-z0-9\s,.-]/g, '');
    handleAddressChange(addressType, field, cleanValue);
  };

  // Handle "Same as Current Address" checkbox
  const handleSameAsCurrentChange = (checked: boolean) => {
    setAddressDetails(prev => ({
      ...prev,
      sameAsCurrent: checked,
      permanentAddress: checked ? prev.currentAddress : prev.permanentAddress
    }));
  };

  // Collateral Details handling
  const handleCollateralChange = (field: string, value: string) => {
    setCollateralDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCollateralDetailsChange = (type: string, field: string, value: string) => {
    setCollateralDetails(prev => ({
      ...prev,
      [`${type}Details`]: {
        ...(prev[`${type}Details` as keyof typeof prev] as any),
        [field]: value
      }
    }));
  };

  // Numeric validation for collateral fields
  const handleNumericChange = (type: string, field: string, value: string) => {
    const cleanValue = value.replace(/[^0-9]/g, '');
    handleCollateralDetailsChange(type, field, cleanValue);
  };

  // Text validation for collateral fields
  const handleTextChange = (type: string, field: string, value: string) => {
    const cleanValue = value.replace(/[^A-Za-z0-9\s,.-]/g, '');
    handleCollateralDetailsChange(type, field, cleanValue);
  };

  // Guarantor Details handling
  const handleGuarantorChange = (field: string, value: string) => {
    setGuarantorDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Guarantor Aadhar input handling
  const handleGuarantorAadharDigitChange = (index: number, value: string) => {
    // Validate: only single numeric digit allowed
    if (value === '' || (/^\d$/.test(value) && value.length <= 1)) {
      const newDigits = [...guarantorDetails.aadharDigits];
      newDigits[index] = value;
      setGuarantorDetails(prev => ({ ...prev, aadharDigits: newDigits }));
      setGuarantorAadhaarError('');

      // Auto-focus next input when valid digit is entered
      if (value && index < 11) {
        setTimeout(() => {
          const nextInput = document.querySelector(`#guarantor-aadhar-${index + 1} input`) as HTMLInputElement;
          if (nextInput) {
            nextInput.focus();
          }
        }, 100);
      }
      
      // Open validating overlay when all 12 digits are filled, then OTP modal
      if (newDigits.every(digit => digit !== '') && newDigits.length === 12) {
        setShowGuarantorValidating(true);
        setTimeout(() => {
          setShowGuarantorValidating(false);
          setShowGuarantorOTPPopup(true);
        }, 1000);
      }
    } else {
      setGuarantorAadhaarError('Only digits (0-9) are allowed for Aadhaar.');
    }
  };
  
  const handleGuarantorAadharKeyDown = (index: number, e: any) => {
    if (e.key === 'Backspace') {
      const newDigits = [...guarantorDetails.aadharDigits];
      
      if (newDigits[index] !== '') {
        // Clear current digit
        newDigits[index] = '';
        setGuarantorDetails(prev => ({ ...prev, aadharDigits: newDigits }));
        setGuarantorAadhaarError('');
      } else if (index > 0) {
        // Move to previous input and clear it
        newDigits[index - 1] = '';
        setGuarantorDetails(prev => ({ ...prev, aadharDigits: newDigits }));
        setTimeout(() => {
          const prevInput = document.querySelector(`#guarantor-aadhar-${index - 1} input`) as HTMLInputElement;
          if (prevInput) {
            prevInput.focus();
          }
        }, 100);
      }
      e.preventDefault();
    }
  };

  // Guarantor mobile validation
  const handleGuarantorMobileChange = (value: string) => {
    // Only allow numbers and limit to 10 digits
    const cleanValue = value.replace(/[^0-9]/g, '').slice(0, 10);
    handleGuarantorChange('mobile', cleanValue);
  };

  // Guarantor email validation
  const handleGuarantorEmailChange = (value: string) => {
    // Basic email validation
    const cleanValue = value.toLowerCase();
    handleGuarantorChange('email', cleanValue);
  };

  // Guarantor name validation
  const handleGuarantorNameChange = (field: string, value: string) => {
    const cleanValue = value.replace(/[^A-Za-z\s]/g, '');
    handleGuarantorChange(field, cleanValue);
  };

  // Guarantee amount validation
  const handleGuaranteeAmountChange = (value: string) => {
    // Only allow numbers
    const cleanValue = value.replace(/[^0-9]/g, '');
    handleGuarantorChange('guaranteeAmount', cleanValue);
  };

  // Witness handling
  const handleWitnessChange = (id: number, field: string, value: string) => {
    setWitnesses(prev => prev.map(witness => 
      witness.id === id ? { ...witness, [field]: value } : witness
    ));
  };

  const addWitness = () => {
    const newWitness = {
      id: witnesses.length + 1,
      name: '',
      relation: 'Wife',
      contact: '',
      email: ''
    };
    setWitnesses(prev => [...prev, newWitness]);
  };

  const removeWitness = (id: number) => {
    if (witnesses.length > 1) {
      setWitnesses(prev => prev.filter(witness => witness.id !== id));
    }
  };

  // Witness name validation
  const handleWitnessNameChange = (id: number, value: string) => {
    const cleanValue = value.replace(/[^A-Za-z\s]/g, '');
    handleWitnessChange(id, 'name', cleanValue);
  };

  // Witness contact validation
  const handleWitnessContactChange = (id: number, value: string) => {
    const cleanValue = value.replace(/[^0-9]/g, '').slice(0, 10);
    handleWitnessChange(id, 'contact', cleanValue);
  };

  // Witness email validation
  const handleWitnessEmailChange = (id: number, value: string) => {
    const cleanValue = value.toLowerCase();
    handleWitnessChange(id, 'email', cleanValue);
  };

  // Document handling
  const handleDocumentTypeChange = (id: number, value: string) => {
    setDocuments(prev => prev.map(doc => 
      doc.id === id ? { ...doc, type: value } : doc
    ));
  };

  const handleFileUpload = (id: number, event: any) => {
    const file = event.target.files[0];
    if (file) {
      setDocuments(prev => prev.map(doc => 
        doc.id === id ? { ...doc, file: file, fileName: file.name } : doc
      ));
    }
  };

  const addDocument = () => {
    const newDocument = {
      id: documents.length + 1,
      type: 'Custom Document',
      file: null,
      fileName: ''
    };
    setDocuments(prev => [...prev, newDocument]);
  };

  const removeDocument = (id: number) => {
    if (documents.length > 1) {
      setDocuments(prev => prev.filter(doc => doc.id !== id));
    }
  };

  // Family Details handling
  const handleFamilyMemberChange = (id: number, field: string, value: string) => {
    setFamilyMembers(prev => prev.map(member => 
      member.id === id ? { ...member, [field]: value } : member
    ));
  };

  const handleFamilyMemberContactChange = (id: number, value: string) => {
    const cleanValue = value.replace(/[^0-9]/g, '').slice(0, 10);
    handleFamilyMemberChange(id, 'memberContact', cleanValue);
  };

  const handleFamilyMemberEmailChange = (id: number, value: string) => {
    const cleanValue = value.toLowerCase();
    handleFamilyMemberChange(id, 'email', cleanValue);
  };

  const handleFamilyMemberAgeChange = (id: number, value: string) => {
    const cleanValue = value.replace(/[^0-9]/g, '').slice(0, 3);
    handleFamilyMemberChange(id, 'age', cleanValue);
  };

  const addFamilyMember = () => {
    const newMember = {
      id: familyMembers.length + 1,
      personName: '',
      relation: 'Brother',
      email: '',
      age: '',
      memberContact: '',
      occupation: ''
    };
    setFamilyMembers(prev => [...prev, newMember]);
  };

  const removeFamilyMember = (id: number) => {
    if (familyMembers.length > 1) {
      setFamilyMembers(prev => prev.filter(member => member.id !== id));
    }
  };

  // Vendor Details handling
  const handleVendorDetailsChange = (field: string, value: string) => {
    setVendorDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleVendorContactChange = (value: string) => {
    const cleanValue = value.replace(/[^0-9]/g, '').slice(0, 10);
    handleVendorDetailsChange('vendorContact', cleanValue);
  };

  const handleVendorPincodeChange = (value: string) => {
    const cleanValue = value.replace(/[^0-9]/g, '').slice(0, 6);
    handleVendorDetailsChange('vendorPincode', cleanValue);
  };

  const handleVendorPANChange = (value: string) => {
    const cleanValue = value.replace(/[^A-Z0-9]/g, '').slice(0, 10).toUpperCase();
    handleVendorDetailsChange('vendorPAN', cleanValue);
  };

  const handleGSTChange = (value: string) => {
    const cleanValue = value.replace(/[^A-Z0-9]/g, '').slice(0, 15).toUpperCase();
    handleVendorDetailsChange('gstNo', cleanValue);
  };

  const handleAmountChange = (value: string) => {
    const cleanValue = value.replace(/[^0-9.]/g, '');
    handleVendorDetailsChange('amountToBePaid', cleanValue);
  };

  const handleSubmitApplication = () => {
    // Here you would typically submit the application to your backend
    console.log('Application submitted with all data:', {
      loanDetails: { loanAmount, applicationType, loanTenure },
      kycData,
      basicDetails,
      addressDetails,
      collateralDetails,
      guarantorDetails,
      witnesses,
      documents,
      vendorDetails
    });
    
    // Show success message or redirect
    alert('Application submitted successfully!');
  };

  // OTP handling
  // Helper to compute age from YYYY-MM-DD
  const getAgeFromDOB = (dobISO: string) => {
    const dobDate = new Date(dobISO);
    const diff = Date.now() - dobDate.getTime();
    const ageDate = new Date(diff);
    return Math.abs(ageDate.getUTCFullYear() - 1970).toString();
  };

  const handleOTPSubmit = () => {
    if (otp.length === 6) {
      // Simulated Aadhaar payload
      const simulated = {
        name: 'Aarav Ramesh Sharma',
        dobISO: '1997-08-21',
        gender: 'Male',
        photo: 'https://i.pravatar.cc/120?img=12',
        address: {
          address: 'B-402, Lotus Residency, Andheri East',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400069',
          district: 'Mumbai',
          taluka: 'Andheri',
          village: 'Andheri',
          landmark: 'Near Metro Station'
        }
      };

      // Update personal details card
      const [first, middle = '', last = ''] = simulated.name.split(' ');
      setPersonalDetails({
        name: simulated.name,
        dob: new Date(simulated.dobISO).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }),
        gender: simulated.gender,
        profilePicture: simulated.photo
      });

      // Prefill basic details and addresses
      setBasicDetails(prev => ({
        ...prev,
        firstName: first,
        middleName: middle,
        lastName: last,
        gender: simulated.gender,
        dob: new Date(simulated.dobISO).toLocaleDateString('en-IN'),
        age: getAgeFromDOB(simulated.dobISO)
      }));

      setAddressDetails(prev => ({
        ...prev,
        currentAddress: { ...simulated.address },
        permanentAddress: { ...simulated.address },
        sameAsCurrent: true
      }));

      setAadhaarVerified(true);
      setShowOTPPopup(false);
      setOtp('');
      setToast({open: true, message: 'Aadhaar verified. Details fetched successfully.'});
    }
  };

  const handleOTPCancel = () => {
    setShowOTPPopup(false);
    setOtp('');
  };

  // Guarantor OTP handling
  const handleGuarantorOTPSubmit = () => {
    if (guarantorOtp.length === 6) {
      // Simulated Guarantor Aadhaar payload
      const simulatedGuarantor = {
        firstName: 'Pooja',
        lastName: 'Kushwaha',
        mobile: '6209694689',
        email: 'pooja@gmail.com',
        address: 'Room No B-04, Makar Apartment, Central Park, Near Shiv Sena Office, Vasai, Nallosapara E, Va'
      };

      // Prefill guarantor details
      setGuarantorDetails(prev => ({
        ...prev,
        firstName: simulatedGuarantor.firstName,
        lastName: simulatedGuarantor.lastName,
        mobile: simulatedGuarantor.mobile,
        email: simulatedGuarantor.email,
        address: simulatedGuarantor.address,
        relationship: 'Sister'
      }));

      setGuarantorAadhaarVerified(true);
      setShowGuarantorOTPPopup(false);
      setGuarantorOtp('');
      setToast({open: true, message: 'Guarantor Aadhaar verified. Details fetched successfully.'});
    }
  };

  const handleGuarantorOTPCancel = () => {
    setShowGuarantorOTPPopup(false);
    setGuarantorOtp('');
  };

  // KYC data handling
  const handleKycDataChange = (field: string, value: string) => {
    setKycData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <IonPage>
      <Header />
      <IonContent fullscreen>
        <div className="loan-application">
          <div className="container">
            {/* Header with Loan Name and Subsidy */}
            <div className="application-header">
              <h1>Subsidy Scheme (State)</h1>
              <div className="subsidy-info">
                <span className="subsidy-label">Subsidy:</span>
                <span className="subsidy-amount">25000</span>
              </div>
            </div>

            {/* Progress Steps */}
            <div className="progress-steps">
              {steps.map((step) => (
                <div key={step.number} className={`step ${step.active ? 'active' : ''}`}>
                  <div className="step-number">{step.number}</div>
                  <div className="step-title">{step.title}</div>
                </div>
              ))}
            </div>

            {/* Form Content */}
            <IonCard className="application-card">
              <IonCardHeader>
                <IonCardTitle>Step {currentStep} of 10: {steps[currentStep - 1].title}</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                {currentStep === 1 && (
                  <div className="step-content">
                    <div className="section-title">Loan Details</div>
                    
                    <div className="form-grid">
                      <div className="form-column">
                        <IonItem className="form-item">
                          <IonLabel position="stacked">Loan Amount</IonLabel>
                          <IonInput
                            type="number"
                            value={loanAmount}
                            onIonInput={(e) => handleLoanAmountChange(e.detail.value!)}
                            placeholder="Enter loan amount"
                            className="loan-amount-input"
                          />
                          <div className="amount-in-words">
                            In words: {convertNumberToWords(parseInt(loanAmount) || 0)}
                          </div>
                          {loanAmountError && (
                            <div className="error-message">{loanAmountError}</div>
                          )}
                        </IonItem>
                      </div>

                      <div className="form-column">
                        <div className="form-item">
                          <label className="form-label">Application Type</label>
                          <div className="searchable-select-container">
                            <button 
                              className="dropdown-trigger" 
                              onClick={handleAppTypeDropdownToggle}
                              type="button"
                            >
                              <span className={`dropdown-value ${!applicationType ? 'placeholder' : ''}`}>
                                {applicationType || 'Select application type'}
                              </span>
                              <IonIcon 
                                icon={chevronDownOutline} 
                                className={`dropdown-arrow ${showAppTypeDropdown ? 'open' : ''}`} 
                              />
                            </button>
                            
                            {showAppTypeDropdown && (
                              <div className="search-dropdown">
                                <div className="search-dropdown-header">
                                  <div className="search-input-container">
                                    <IonInput
                                      value={appTypeSearchTerm}
                                      onIonInput={(e) => handleAppTypeSearch(e.detail.value!)}
                                      onKeyDown={handleAppTypeKeyDown}
                                      placeholder="Search application types..."
                                      className="dropdown-search-input"
                                      clearInput
                                    />
                                  </div>
                                </div>
                                <div className="search-dropdown-list">
                                  {filteredAppTypes.length > 0 ? (
                                    filteredAppTypes.map((type, index) => (
                                      <div
                                        key={type}
                                        className={`search-dropdown-item ${index === selectedDropdownIndex ? 'selected' : ''}`}
                                        onClick={() => handleAppTypeSelect(type)}
                                        onMouseEnter={() => setSelectedDropdownIndex(index)}
                                      >
                                        {type}
                                      </div>
                                    ))
                                  ) : (
                                    <div className="search-dropdown-item no-results">
                                      No results found
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="form-grid">
                      <div className="form-column">
                        <IonItem className="form-item">
                          <IonLabel position="stacked">Loan Tenure</IonLabel>
                          <IonInput
                            type="number"
                            value={loanTenure}
                            readonly
                            className="loan-tenure-input readonly"
                          />
                        </IonItem>
                      </div>

                      <div className="form-column">
                        {/* Empty column for spacing */}
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="step-content">
                    <div className="section-title">KYC Details</div>
                    
                    {/* Personal Details Section: visible only after Aadhaar verification */}
                    {aadhaarVerified && (
                    <div className="personal-details-card">
                      <div className="personal-info">
                        <div className="profile-picture">
                          <img src={personalDetails.profilePicture} alt="Profile" />
                          {aadhaarVerified && (
                            <IonChip color="success" className="aadhaar-chip">Verified</IonChip>
                          )}
                        </div>
                        <div className="personal-info-text">
                          <div className="info-row">
                            <span className="label">Name:</span>
                            <span className="value">{personalDetails.name}</span>
                          </div>
                          <div className="info-row">
                            <span className="label">DOB:</span>
                            <span className="value">{personalDetails.dob}</span>
                          </div>
                          <div className="info-row">
                            <span className="label">GENDER:</span>
                            <span className="value">{personalDetails.gender}</span>
                          </div>
                        </div>
                        <div className="subsidy-info">
                          <div className="subsidy-title">Subsidy Scheme (State)</div>
                          <div className="subsidy-amount">Subsidy: 25000</div>
                        </div>
                      </div>
                    </div>
                    )}

                    {/* Aadhar Input */}
                    <div className="form-grid">
                      <div className="form-column">
                        <IonItem className="form-item">
                          <IonLabel position="stacked">Aadhar</IonLabel>
                          <div className={`aadhar-input-container ${aadhaarError ? 'invalid' : ''}`}>
                            {aadharDigits.map((digit, index) => (
                              <IonInput
                                key={index}
                                id={`aadhar-${index}`}
                                type="text"
                                inputMode="numeric"
                                maxlength={1}
                                value={digit}
                                disabled={index > 0 && aadharDigits.slice(0, index).some(d => d === '')}
                                onIonInput={(e) => handleAadharDigitChange(index, e.detail.value!)}
                                onKeyDown={(e) => handleAadharKeyDown(index, e)}
                                className="aadhar-digit-input"
                              />
                            ))}
                          </div>
                          {aadhaarError && (
                            <div className="aadhaar-error">{aadhaarError}</div>
                          )}
                        </IonItem>
                      </div>
                      <div className="form-column">
                        {/* Empty column for spacing */}
                      </div>
                    </div>

                    {/* Other KYC Fields */}
                    <div className="form-grid">
                      <div className="form-column">
                        <IonItem className="form-item">
                          <IonLabel position="stacked">PAN</IonLabel>
                          <IonInput
                            id="pan-number"
                            type="text"
                            value={kycData.pan}
                            onIonInput={(e) => handlePANChange(e.detail.value!)}
                            placeholder="ABCDE1234F"
                            className="kyc-input pan-input"
                            maxlength={10}
                          />
                        </IonItem>
                      </div>
                      <div className="form-column">
                        <IonItem className="form-item">
                          <IonLabel position="stacked">Bank Name</IonLabel>
                          <IonInput
                            id="bank-name"
                            type="text"
                            value={kycData.bankName}
                            onIonInput={(e) => handleBankNameChange(e.detail.value!)}
                            placeholder="Enter bank name"
                            className="kyc-input bank-input"
                          />
                        </IonItem>
                      </div>
                    </div>

                    <div className="form-grid">
                      <div className="form-column">
                        <IonItem className="form-item">
                          <IonLabel position="stacked">A/C Number</IonLabel>
                          <IonInput
                            id="account-number"
                            type="text"
                            inputMode="numeric"
                            value={kycData.accountNumber}
                            onIonInput={(e) => handleAccountNumberChange(e.detail.value!)}
                            placeholder="Enter account number"
                            className="kyc-input account-input"
                          />
                        </IonItem>
                      </div>
                      <div className="form-column">
                        <IonItem className="form-item">
                          <IonLabel position="stacked">Confirm A/C Number</IonLabel>
                          <IonInput
                            id="confirm-account-number"
                            type="text"
                            inputMode="numeric"
                            value={kycData.confirmAccountNumber}
                            onIonInput={(e) => handleConfirmAccountNumberChange(e.detail.value!)}
                            placeholder="Confirm account number"
                            className="kyc-input account-input"
                          />
                        </IonItem>
                      </div>
                    </div>

                    <div className="form-grid">
                      <div className="form-column">
                        <IonItem className="form-item">
                          <IonLabel position="stacked">IFSC Code</IonLabel>
                          <IonInput
                            id="ifsc-code"
                            type="text"
                            value={kycData.ifscCode}
                            onIonInput={(e) => handleIFSCChange(e.detail.value!)}
                            placeholder="SBIN0001234"
                            className="kyc-input ifsc-input"
                            maxlength={11}
                          />
                        </IonItem>
                      </div>
                      <div className="form-column">
                        <IonItem className="form-item">
                          <IonLabel position="stacked">Account Holder Name</IonLabel>
                          <IonInput
                            id="account-holder-name"
                            type="text"
                            value={kycData.accountHolderName}
                            onIonInput={(e) => handleAccountHolderNameChange(e.detail.value!)}
                            placeholder="Enter account holder name"
                            className="kyc-input name-input"
                          />
                        </IonItem>
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="step-content">
                    <div className="section-title">Basic Details</div>
                    
                    {/* Personal Information Fields */}
                    <div className="form-grid">
                      <div className="form-column">
                        <IonItem className="form-item">
                          <IonLabel position="stacked">First Name</IonLabel>
                          <IonInput
                            id="first-name"
                            type="text"
                            value={basicDetails.firstName}
                            onIonInput={(e) => handleNameChange('firstName', e.detail.value!)}
                            placeholder="Enter first name"
                            className="basic-input name-input"
                          />
                        </IonItem>
                      </div>
                      <div className="form-column">
                        <IonItem className="form-item">
                          <IonLabel position="stacked">Middle Name</IonLabel>
                          <IonInput
                            id="middle-name"
                            type="text"
                            value={basicDetails.middleName}
                            onIonInput={(e) => handleNameChange('middleName', e.detail.value!)}
                            placeholder="Enter middle name"
                            className="basic-input name-input"
                          />
                        </IonItem>
                      </div>
                    </div>

                    <div className="form-grid">
                      <div className="form-column">
                        <IonItem className="form-item">
                          <IonLabel position="stacked">Last Name</IonLabel>
                          <IonInput
                            id="last-name"
                            type="text"
                            value={basicDetails.lastName}
                            onIonInput={(e) => handleNameChange('lastName', e.detail.value!)}
                            placeholder="Enter last name"
                            className="basic-input name-input"
                          />
                        </IonItem>
                      </div>
                      <div className="form-column">
                        <IonItem className="form-item">
                          <IonLabel position="stacked">Age</IonLabel>
                          <IonInput
                            id="age"
                            type="text"
                            inputMode="numeric"
                            value={basicDetails.age}
                            onIonInput={(e) => handleAgeChange(e.detail.value!)}
                            placeholder="Enter age"
                            className="basic-input age-input"
                            maxlength={3}
                          />
                        </IonItem>
                      </div>
                    </div>

                    <div className="form-grid">
                      <div className="form-column">
                        <IonItem className="form-item">
                          <IonLabel position="stacked">Gender</IonLabel>
                          <IonInput
                            id="gender"
                            type="text"
                            value={basicDetails.gender}
                            readonly
                            className="basic-input readonly-input"
                          />
                        </IonItem>
                      </div>
                      <div className="form-column">
                        <IonItem className="form-item">
                          <IonLabel position="stacked">Father/Husband's full name</IonLabel>
                          <IonInput
                            id="father-husband-name"
                            type="text"
                            value={basicDetails.fatherHusbandName}
                            readonly
                            className="basic-input readonly-input"
                          />
                        </IonItem>
                      </div>
                    </div>

                    <div className="form-grid">
                      <div className="form-column">
                        <IonItem className="form-item">
                          <IonLabel position="stacked">Mother's full name</IonLabel>
                          <IonInput
                            id="mother-name"
                            type="text"
                            value={basicDetails.motherFullName}
                            onIonInput={(e) => handleNameChange('motherFullName', e.detail.value!)}
                            placeholder="Enter mother's name"
                            className="basic-input name-input"
                          />
                        </IonItem>
                      </div>
                      <div className="form-column">
                        <IonItem className="form-item">
                          <IonLabel position="stacked">Basic Education</IonLabel>
                          <IonInput
                            id="basic-education"
                            type="text"
                            value={basicDetails.basicEducation}
                            onIonInput={(e) => handleBasicDetailsChange('basicEducation', e.detail.value!)}
                            placeholder="Enter education level"
                            className="basic-input education-input"
                          />
                        </IonItem>
                      </div>
                    </div>

                    <div className="form-grid">
                      <div className="form-column">
                        <IonItem className="form-item">
                          <IonLabel position="stacked">Ration card type</IonLabel>
                          <IonSelect
                            value={basicDetails.rationCardType}
                            onIonChange={(e) => handleBasicDetailsChange('rationCardType', e.detail.value)}
                            placeholder="Select ration card type"
                            className="basic-select"
                          >
                            {rationCardTypes.map((type) => (
                              <IonSelectOption key={type} value={type}>
                                {type}
                              </IonSelectOption>
                            ))}
                          </IonSelect>
                        </IonItem>
                      </div>
                      <div className="form-column">
                        <IonItem className="form-item">
                          <IonLabel position="stacked">Mobile</IonLabel>
                          <IonInput
                            id="mobile"
                            type="text"
                            inputMode="numeric"
                            value={basicDetails.mobile}
                            onIonInput={(e) => handleMobileChange(e.detail.value!)}
                            placeholder="Enter mobile number"
                            className="basic-input mobile-input"
                            maxlength={10}
                          />
                        </IonItem>
                      </div>
                    </div>

                    <div className="form-grid">
                      <div className="form-column">
                        <IonItem className="form-item">
                          <IonLabel position="stacked">Email</IonLabel>
                          <IonInput
                            id="email"
                            type="email"
                            value={basicDetails.email}
                            onIonInput={(e) => handleEmailChange(e.detail.value!)}
                            placeholder="Enter email address"
                            className="basic-input email-input"
                          />
                        </IonItem>
                      </div>
                      <div className="form-column">
                        <IonItem className="form-item">
                          <IonLabel position="stacked">DOB</IonLabel>
                          <IonInput
                            id="dob"
                            type="text"
                            value={basicDetails.dob}
                            readonly
                            className="basic-input readonly-input"
                          />
                        </IonItem>
                      </div>
                    </div>

                    <div className="form-grid">
                      <div className="form-column">
                        <IonItem className="form-item">
                          <IonLabel position="stacked">Subcaste</IonLabel>
                          <IonSelect
                            value={basicDetails.subcaste}
                            onIonChange={(e) => handleBasicDetailsChange('subcaste', e.detail.value)}
                            placeholder="Select subcaste"
                            className="basic-select"
                          >
                            {subcasteOptions.map((caste) => (
                              <IonSelectOption key={caste} value={caste}>
                                {caste}
                              </IonSelectOption>
                            ))}
                          </IonSelect>
                        </IonItem>
                      </div>
                      <div className="form-column">
                        <div className="form-item">
                          <label className="form-label">Undercaste</label>
                          <div className="searchable-select-container">
                            <button 
                              className="dropdown-trigger" 
                              onClick={handleUndercasteDropdownToggle}
                              type="button"
                            >
                              <span className={`dropdown-value ${!basicDetails.undercaste ? 'placeholder' : ''}`}>
                                {basicDetails.undercaste || 'Select undercaste'}
                              </span>
                              <IonIcon 
                                icon={chevronDownOutline} 
                                className={`dropdown-arrow ${showUndercasteDropdown ? 'open' : ''}`} 
                              />
                            </button>
                            
                            {showUndercasteDropdown && (
                              <div className="search-dropdown">
                                <div className="search-dropdown-header">
                                  <div className="search-input-container">
                                    <IonInput
                                      value={undercasteSearchTerm}
                                      onIonInput={(e) => handleUndercasteSearch(e.detail.value!)}
                                      onKeyDown={handleUndercasteKeyDown}
                                      placeholder="Search undercaste options..."
                                      className="dropdown-search-input"
                                      clearInput
                                    />
                                  </div>
                                </div>
                                <div className="search-dropdown-list">
                                  {filteredUndercaste.length > 0 ? (
                                    filteredUndercaste.map((caste, index) => (
                                      <div
                                        key={caste}
                                        className={`search-dropdown-item ${index === selectedUndercasteIndex ? 'selected' : ''}`}
                                        onClick={() => handleUndercasteSelect(caste)}
                                        onMouseEnter={() => setSelectedUndercasteIndex(index)}
                                      >
                                        {caste}
                                      </div>
                                    ))
                                  ) : (
                                    <div className="search-dropdown-item no-results">
                                      No results found
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="form-grid">
                      <div className="form-column">
                        <IonItem className="form-item">
                          <IonLabel position="stacked">Safai Karmachari ID</IonLabel>
                          <IonInput
                            id="safai-karmachari-id"
                            type="text"
                            value={basicDetails.safaiKarmachariId}
                            onIonInput={(e) => handleBasicDetailsChange('safaiKarmachariId', e.detail.value!)}
                            placeholder="Enter Safai Karmachari ID"
                            className="basic-input id-input"
                          />
                        </IonItem>
                      </div>
                      <div className="form-column">
                        {/* Empty column for spacing */}
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 4 && (
                  <div className="step-content">
                    <div className="section-title">Address Details</div>
                    
                    {/* Current Address Section */}
                    <div className="address-section">
                      <div className="address-section-title">Current Address</div>
                      
                      <div className="form-grid">
                        <div className="form-column">
                          <IonItem className="form-item">
                            <IonLabel position="stacked">Address</IonLabel>
                            <IonInput
                              id="current-address"
                              type="text"
                              value={addressDetails.currentAddress.address}
                              onIonInput={(e) => handleAddressTextChange('currentAddress', 'address', e.detail.value!)}
                              placeholder="Enter current address"
                              className="address-input"
                            />
                          </IonItem>
                        </div>
                        <div className="form-column">
                          <IonItem className="form-item">
                            <IonLabel position="stacked">City</IonLabel>
                            <IonInput
                              id="current-city"
                              type="text"
                              value={addressDetails.currentAddress.city}
                              onIonInput={(e) => handleAddressTextChange('currentAddress', 'city', e.detail.value!)}
                              placeholder="Enter city"
                              className="address-input"
                            />
                          </IonItem>
                        </div>
                      </div>

                      <div className="form-grid">
                        <div className="form-column">
                          <IonItem className="form-item">
                            <IonLabel position="stacked">State</IonLabel>
                            <IonInput
                              id="current-state"
                              type="text"
                              value={addressDetails.currentAddress.state}
                              onIonInput={(e) => handleAddressTextChange('currentAddress', 'state', e.detail.value!)}
                              placeholder="Enter state"
                              className="address-input"
                            />
                          </IonItem>
                        </div>
                        <div className="form-column">
                          <IonItem className="form-item">
                            <IonLabel position="stacked">Pincode</IonLabel>
                            <IonInput
                              id="current-pincode"
                              type="text"
                              inputMode="numeric"
                              value={addressDetails.currentAddress.pincode}
                              onIonInput={(e) => handlePincodeChange('currentAddress', e.detail.value!)}
                              placeholder="Enter pincode"
                              className="address-input pincode-input"
                              maxlength={6}
                            />
                          </IonItem>
                        </div>
                      </div>

                      <div className="form-grid">
                        <div className="form-column">
                          <IonItem className="form-item">
                            <IonLabel position="stacked">District</IonLabel>
                            <IonInput
                              id="current-district"
                              type="text"
                              value={addressDetails.currentAddress.district}
                              onIonInput={(e) => handleAddressTextChange('currentAddress', 'district', e.detail.value!)}
                              placeholder="Enter district"
                              className="address-input"
                            />
                          </IonItem>
                        </div>
                        <div className="form-column">
                          <IonItem className="form-item">
                            <IonLabel position="stacked">Taluka</IonLabel>
                            <IonInput
                              id="current-taluka"
                              type="text"
                              value={addressDetails.currentAddress.taluka}
                              onIonInput={(e) => handleAddressTextChange('currentAddress', 'taluka', e.detail.value!)}
                              placeholder="Enter taluka"
                              className="address-input"
                            />
                          </IonItem>
                        </div>
                      </div>

                      <div className="form-grid">
                        <div className="form-column">
                          <IonItem className="form-item">
                            <IonLabel position="stacked">Village</IonLabel>
                            <IonInput
                              id="current-village"
                              type="text"
                              value={addressDetails.currentAddress.village}
                              onIonInput={(e) => handleAddressTextChange('currentAddress', 'village', e.detail.value!)}
                              placeholder="Enter village"
                              className="address-input"
                            />
                          </IonItem>
                        </div>
                        <div className="form-column">
                          <IonItem className="form-item">
                            <IonLabel position="stacked">Landmark</IonLabel>
                            <IonInput
                              id="current-landmark"
                              type="text"
                              value={addressDetails.currentAddress.landmark}
                              onIonInput={(e) => handleAddressTextChange('currentAddress', 'landmark', e.detail.value!)}
                              placeholder="Enter landmark"
                              className="address-input"
                            />
                          </IonItem>
                        </div>
                      </div>
                    </div>

                    {/* Same as Current Address Checkbox */}
                    <div className="same-address-section">
                      <IonItem className="checkbox-item">
                        <IonLabel>Same as Current Address</IonLabel>
                        <IonCheckbox
                          checked={addressDetails.sameAsCurrent}
                          onIonChange={(e) => handleSameAsCurrentChange(e.detail.checked)}
                          slot="end"
                        />
                      </IonItem>
                    </div>

                    {/* Permanent Address Section */}
                    <div className="address-section">
                      <div className="address-section-title">Permanent Address</div>
                      
                      <div className="form-grid">
                        <div className="form-column">
                          <IonItem className="form-item">
                            <IonLabel position="stacked">Address</IonLabel>
                            <IonInput
                              id="permanent-address"
                              type="text"
                              value={addressDetails.permanentAddress.address}
                              onIonInput={(e) => handleAddressTextChange('permanentAddress', 'address', e.detail.value!)}
                              placeholder="Enter permanent address"
                              className="address-input"
                              disabled={addressDetails.sameAsCurrent}
                            />
                          </IonItem>
                        </div>
                        <div className="form-column">
                          <IonItem className="form-item">
                            <IonLabel position="stacked">City</IonLabel>
                            <IonInput
                              id="permanent-city"
                              type="text"
                              value={addressDetails.permanentAddress.city}
                              onIonInput={(e) => handleAddressTextChange('permanentAddress', 'city', e.detail.value!)}
                              placeholder="Enter city"
                              className="address-input"
                              disabled={addressDetails.sameAsCurrent}
                            />
                          </IonItem>
                        </div>
                      </div>

                      <div className="form-grid">
                        <div className="form-column">
                          <IonItem className="form-item">
                            <IonLabel position="stacked">State</IonLabel>
                            <IonInput
                              id="permanent-state"
                              type="text"
                              value={addressDetails.permanentAddress.state}
                              onIonInput={(e) => handleAddressTextChange('permanentAddress', 'state', e.detail.value!)}
                              placeholder="Enter state"
                              className="address-input"
                              disabled={addressDetails.sameAsCurrent}
                            />
                          </IonItem>
                        </div>
                        <div className="form-column">
                          <IonItem className="form-item">
                            <IonLabel position="stacked">Pincode</IonLabel>
                            <IonInput
                              id="permanent-pincode"
                              type="text"
                              inputMode="numeric"
                              value={addressDetails.permanentAddress.pincode}
                              onIonInput={(e) => handlePincodeChange('permanentAddress', e.detail.value!)}
                              placeholder="Enter pincode"
                              className="address-input pincode-input"
                              maxlength={6}
                              disabled={addressDetails.sameAsCurrent}
                            />
                          </IonItem>
                        </div>
                      </div>

                      <div className="form-grid">
                        <div className="form-column">
                          <IonItem className="form-item">
                            <IonLabel position="stacked">District</IonLabel>
                            <IonInput
                              id="permanent-district"
                              type="text"
                              value={addressDetails.permanentAddress.district}
                              onIonInput={(e) => handleAddressTextChange('permanentAddress', 'district', e.detail.value!)}
                              placeholder="Enter district"
                              className="address-input"
                              disabled={addressDetails.sameAsCurrent}
                            />
                          </IonItem>
                        </div>
                        <div className="form-column">
                          <IonItem className="form-item">
                            <IonLabel position="stacked">Taluka</IonLabel>
                            <IonInput
                              id="permanent-taluka"
                              type="text"
                              value={addressDetails.permanentAddress.taluka}
                              onIonInput={(e) => handleAddressTextChange('permanentAddress', 'taluka', e.detail.value!)}
                              placeholder="Enter taluka"
                              className="address-input"
                              disabled={addressDetails.sameAsCurrent}
                            />
                          </IonItem>
                        </div>
                      </div>

                      <div className="form-grid">
                        <div className="form-column">
                          <IonItem className="form-item">
                            <IonLabel position="stacked">Village</IonLabel>
                            <IonInput
                              id="permanent-village"
                              type="text"
                              value={addressDetails.permanentAddress.village}
                              onIonInput={(e) => handleAddressTextChange('permanentAddress', 'village', e.detail.value!)}
                              placeholder="Enter village"
                              className="address-input"
                              disabled={addressDetails.sameAsCurrent}
                            />
                          </IonItem>
                        </div>
                        <div className="form-column">
                          <IonItem className="form-item">
                            <IonLabel position="stacked">Landmark</IonLabel>
                            <IonInput
                              id="permanent-landmark"
                              type="text"
                              value={addressDetails.permanentAddress.landmark}
                              onIonInput={(e) => handleAddressTextChange('permanentAddress', 'landmark', e.detail.value!)}
                              placeholder="Enter landmark"
                              className="address-input"
                              disabled={addressDetails.sameAsCurrent}
                            />
                          </IonItem>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 5 && (
                  <div className="step-content">
                    <div className="section-title">
                      Family Details
                      <IonButton
                        fill="clear"
                        size="small"
                        className="add-family-member-btn"
                        onClick={addFamilyMember}
                      >
                        <IonIcon icon="add" slot="icon-only" />
                      </IonButton>
                    </div>
                    
                    {/* Family Members List */}
                    <div className="family-members-list">
                      {familyMembers.map((member, index) => (
                        <div key={member.id} className="family-member-row">
                          <div className="form-grid">
                            {/* Left Column */}
                            <div className="form-item">
                              <IonLabel className="form-label">Person Name</IonLabel>
                              <IonInput
                                value={member.personName}
                                onIonInput={(e) => handleFamilyMemberChange(member.id, 'personName', e.detail.value!)}
                                placeholder="Enter person name"
                                className="family-input"
                              />
                            </div>

                            <div className="form-item">
                              <IonLabel className="form-label">Relation</IonLabel>
                              <IonSelect
                                value={member.relation}
                                onIonChange={(e) => handleFamilyMemberChange(member.id, 'relation', e.detail.value)}
                                className="family-select"
                                interface="popover"
                              >
                                <IonSelectOption value="Father">Father</IonSelectOption>
                                <IonSelectOption value="Mother">Mother</IonSelectOption>
                                <IonSelectOption value="Brother">Brother</IonSelectOption>
                                <IonSelectOption value="Sister">Sister</IonSelectOption>
                                <IonSelectOption value="Son">Son</IonSelectOption>
                                <IonSelectOption value="Daughter">Daughter</IonSelectOption>
                                <IonSelectOption value="Husband">Husband</IonSelectOption>
                                <IonSelectOption value="Wife">Wife</IonSelectOption>
                                <IonSelectOption value="Grandfather">Grandfather</IonSelectOption>
                                <IonSelectOption value="Grandmother">Grandmother</IonSelectOption>
                                <IonSelectOption value="Uncle">Uncle</IonSelectOption>
                                <IonSelectOption value="Aunt">Aunt</IonSelectOption>
                                <IonSelectOption value="Cousin">Cousin</IonSelectOption>
                                <IonSelectOption value="Other">Other</IonSelectOption>
                              </IonSelect>
                            </div>

                            <div className="form-item">
                              <IonLabel className="form-label">Email</IonLabel>
                              <IonInput
                                type="email"
                                value={member.email}
                                onIonInput={(e) => handleFamilyMemberEmailChange(member.id, e.detail.value!)}
                                placeholder="Enter email address"
                                className="family-input"
                              />
                            </div>

                            {/* Right Column */}
                            <div className="form-item">
                              <IonLabel className="form-label">Age</IonLabel>
                              <IonInput
                                type="tel"
                                value={member.age}
                                onIonInput={(e) => handleFamilyMemberAgeChange(member.id, e.detail.value!)}
                                placeholder="Enter age"
                                className="family-input"
                              />
                            </div>

                            <div className="form-item">
                              <IonLabel className="form-label">Member Contact</IonLabel>
                              <IonInput
                                type="tel"
                                value={member.memberContact}
                                onIonInput={(e) => handleFamilyMemberContactChange(member.id, e.detail.value!)}
                                placeholder="Enter contact number"
                                className="family-input"
                              />
                            </div>

                            <div className="form-item">
                              <IonLabel className="form-label">Occupation</IonLabel>
                              <IonInput
                                value={member.occupation}
                                onIonInput={(e) => handleFamilyMemberChange(member.id, 'occupation', e.detail.value!)}
                                placeholder="Enter occupation"
                                className="family-input"
                              />
                            </div>
                          </div>
                          
                          {familyMembers.length > 1 && (
                            <div className="family-member-remove">
                              <IonButton
                                fill="clear"
                                size="small"
                                color="danger"
                                className="remove-family-member-btn"
                                onClick={() => removeFamilyMember(member.id)}
                              >
                                <IonIcon icon="close" slot="icon-only" />
                              </IonButton>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {currentStep === 6 && (
                  <div className="step-content">
                    <div className="section-title">Collaterals</div>
                    
                    {/* Collateral Type Selection */}
                    <div className="form-grid">
                      <div className="form-column">
                        <IonItem className="form-item">
                          <IonLabel position="stacked">Collateral Type</IonLabel>
                          <IonSelect
                            value={collateralDetails.collateralType}
                            onIonChange={(e) => handleCollateralChange('collateralType', e.detail.value)}
                            placeholder="Select collateral type"
                            className="collateral-select"
                          >
                            {collateralTypes.map((type) => (
                              <IonSelectOption key={type} value={type}>
                                {type}
                              </IonSelectOption>
                            ))}
                          </IonSelect>
                        </IonItem>
                      </div>
                      <div className="form-column">
                        {/* Empty column for spacing */}
                      </div>
                    </div>

                    {/* Gold Details */}
                    {collateralDetails.collateralType === 'Gold' && (
                      <div className="collateral-section">
                        <div className="collateral-section-title">Gold Details</div>
                        
                        <div className="form-grid">
                          <div className="form-column">
                            <IonItem className="form-item">
                              <IonLabel position="stacked">Weight (grams)</IonLabel>
                              <IonInput
                                id="gold-weight"
                                type="text"
                                inputMode="numeric"
                                value={collateralDetails.goldDetails.weight}
                                onIonInput={(e) => handleNumericChange('gold', 'weight', e.detail.value!)}
                                placeholder="Enter weight in grams"
                                className="collateral-input"
                              />
                            </IonItem>
                          </div>
                          <div className="form-column">
                            <IonItem className="form-item">
                              <IonLabel position="stacked">Purity (karat)</IonLabel>
                              <IonInput
                                id="gold-purity"
                                type="text"
                                inputMode="numeric"
                                value={collateralDetails.goldDetails.purity}
                                onIonInput={(e) => handleNumericChange('gold', 'purity', e.detail.value!)}
                                placeholder="Enter purity (e.g., 22)"
                                className="collateral-input"
                              />
                            </IonItem>
                          </div>
                        </div>

                        <div className="form-grid">
                          <div className="form-column">
                            <IonItem className="form-item">
                              <IonLabel position="stacked">Description</IonLabel>
                              <IonInput
                                id="gold-description"
                                type="text"
                                value={collateralDetails.goldDetails.description}
                                onIonInput={(e) => handleTextChange('gold', 'description', e.detail.value!)}
                                placeholder="Describe the gold items"
                                className="collateral-input"
                              />
                            </IonItem>
                          </div>
                          <div className="form-column">
                            {/* Empty column for spacing */}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Land Details */}
                    {collateralDetails.collateralType === 'Land' && (
                      <div className="collateral-section">
                        <div className="collateral-section-title">Land Details</div>
                        
                        <div className="form-grid">
                          <div className="form-column">
                            <IonItem className="form-item">
                              <IonLabel position="stacked">Area (sq ft)</IonLabel>
                              <IonInput
                                id="land-area"
                                type="text"
                                inputMode="numeric"
                                value={collateralDetails.landDetails.area}
                                onIonInput={(e) => handleNumericChange('land', 'area', e.detail.value!)}
                                placeholder="Enter area in square feet"
                                className="collateral-input"
                              />
                            </IonItem>
                          </div>
                          <div className="form-column">
                            <IonItem className="form-item">
                              <IonLabel position="stacked">Location</IonLabel>
                              <IonInput
                                id="land-location"
                                type="text"
                                value={collateralDetails.landDetails.location}
                                onIonInput={(e) => handleTextChange('land', 'location', e.detail.value!)}
                                placeholder="Enter land location"
                                className="collateral-input"
                              />
                            </IonItem>
                          </div>
                        </div>

                        <div className="form-grid">
                          <div className="form-column">
                            <IonItem className="form-item">
                              <IonLabel position="stacked">Survey Number</IonLabel>
                              <IonInput
                                id="land-survey"
                                type="text"
                                value={collateralDetails.landDetails.surveyNumber}
                                onIonInput={(e) => handleTextChange('land', 'surveyNumber', e.detail.value!)}
                                placeholder="Enter survey number"
                                className="collateral-input"
                              />
                            </IonItem>
                          </div>
                          <div className="form-column">
                            <IonItem className="form-item">
                              <IonLabel position="stacked">Description</IonLabel>
                              <IonInput
                                id="land-description"
                                type="text"
                                value={collateralDetails.landDetails.description}
                                onIonInput={(e) => handleTextChange('land', 'description', e.detail.value!)}
                                placeholder="Describe the land"
                                className="collateral-input"
                              />
                            </IonItem>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Car Details */}
                    {collateralDetails.collateralType === 'Car' && (
                      <div className="collateral-section">
                        <div className="collateral-section-title">Car Details</div>
                        
                        <div className="form-grid">
                          <div className="form-column">
                            <IonItem className="form-item">
                              <IonLabel position="stacked">Make</IonLabel>
                              <IonInput
                                id="car-make"
                                type="text"
                                value={collateralDetails.carDetails.make}
                                onIonInput={(e) => handleTextChange('car', 'make', e.detail.value!)}
                                placeholder="Enter car make"
                                className="collateral-input"
                              />
                            </IonItem>
                          </div>
                          <div className="form-column">
                            <IonItem className="form-item">
                              <IonLabel position="stacked">Model</IonLabel>
                              <IonInput
                                id="car-model"
                                type="text"
                                value={collateralDetails.carDetails.model}
                                onIonInput={(e) => handleTextChange('car', 'model', e.detail.value!)}
                                placeholder="Enter car model"
                                className="collateral-input"
                              />
                            </IonItem>
                          </div>
                        </div>

                        <div className="form-grid">
                          <div className="form-column">
                            <IonItem className="form-item">
                              <IonLabel position="stacked">Year</IonLabel>
                              <IonInput
                                id="car-year"
                                type="text"
                                inputMode="numeric"
                                value={collateralDetails.carDetails.year}
                                onIonInput={(e) => handleNumericChange('car', 'year', e.detail.value!)}
                                placeholder="Enter manufacturing year"
                                className="collateral-input"
                                maxlength={4}
                              />
                            </IonItem>
                          </div>
                          <div className="form-column">
                            <IonItem className="form-item">
                              <IonLabel position="stacked">Registration Number</IonLabel>
                              <IonInput
                                id="car-registration"
                                type="text"
                                value={collateralDetails.carDetails.registrationNumber}
                                onIonInput={(e) => handleTextChange('car', 'registrationNumber', e.detail.value!)}
                                placeholder="Enter registration number"
                                className="collateral-input"
                              />
                            </IonItem>
                          </div>
                        </div>

                        <div className="form-grid">
                          <div className="form-column">
                            <IonItem className="form-item">
                              <IonLabel position="stacked">Description</IonLabel>
                              <IonInput
                                id="car-description"
                                type="text"
                                value={collateralDetails.carDetails.description}
                                onIonInput={(e) => handleTextChange('car', 'description', e.detail.value!)}
                                placeholder="Describe the car"
                                className="collateral-input"
                              />
                            </IonItem>
                          </div>
                          <div className="form-column">
                            {/* Empty column for spacing */}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Other Details */}
                    {collateralDetails.collateralType === 'Other' && (
                      <div className="collateral-section">
                        <div className="collateral-section-title">Other Collateral Details</div>
                        
                        <div className="form-grid">
                          <div className="form-column">
                            <IonItem className="form-item">
                              <IonLabel position="stacked">Description</IonLabel>
                              <IonInput
                                id="other-description"
                                type="text"
                                value={collateralDetails.otherDetails.description}
                                onIonInput={(e) => handleTextChange('other', 'description', e.detail.value!)}
                                placeholder="Describe the collateral"
                                className="collateral-input"
                              />
                            </IonItem>
                          </div>
                          <div className="form-column">
                            <IonItem className="form-item">
                              <IonLabel position="stacked">Estimated Value (₹)</IonLabel>
                              <IonInput
                                id="other-value"
                                type="text"
                                inputMode="numeric"
                                value={collateralDetails.otherDetails.value}
                                onIonInput={(e) => handleNumericChange('other', 'value', e.detail.value!)}
                                placeholder="Enter estimated value"
                                className="collateral-input"
                              />
                            </IonItem>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {currentStep === 7 && (
                  <div className="step-content">
                    <div className="section-title">Guarantors</div>
                    
                    {/* Guarantor Type Selection */}
                    <div className="form-grid">
                      <div className="form-column">
                        <IonItem className="form-item">
                          <IonLabel position="stacked">Guarantor Type</IonLabel>
                          <IonSelect
                            value={guarantorDetails.guarantorType}
                            onIonChange={(e) => handleGuarantorChange('guarantorType', e.detail.value)}
                            placeholder="Select guarantor type"
                            className="guarantor-select"
                          >
                            {guarantorTypes.map((type) => (
                              <IonSelectOption key={type} value={type}>
                                {type}
                              </IonSelectOption>
                            ))}
                          </IonSelect>
                        </IonItem>
                      </div>
                      <div className="form-column">
                        {/* Empty column for spacing */}
                      </div>
                    </div>

                    {/* Aadhar Input */}
                    <div className="form-grid">
                      <div className="form-column">
                        <IonItem className="form-item">
                          <IonLabel position="stacked">
                            Guarantor Aadhar
                            {guarantorAadhaarVerified && (
                              <IonChip color="success" className="verified-chip">
                                <IonIcon icon={checkmarkCircle} />
                                Verified
                              </IonChip>
                            )}
                          </IonLabel>
                          <div className={`aadhar-input-container ${guarantorAadhaarError ? 'invalid' : ''}`}>
                            {guarantorDetails.aadharDigits.map((digit, index) => {
                              const isDisabled = !guarantorAadhaarVerified && index > 0 && !guarantorDetails.aadharDigits[index - 1];
                              return (
                                <IonInput
                                  key={index}
                                  id={`guarantor-aadhar-${index}`}
                                  type="text"
                                  inputMode="numeric"
                                  maxlength={1}
                                  value={digit}
                                  onIonInput={(e) => handleGuarantorAadharDigitChange(index, e.detail.value!)}
                                  onKeyDown={(e) => handleGuarantorAadharKeyDown(index, e)}
                                  className="aadhar-digit-input"
                                  disabled={isDisabled || guarantorAadhaarVerified}
                                />
                              );
                            })}
                          </div>
                          {guarantorAadhaarError && (
                            <div className="aadhaar-error">{guarantorAadhaarError}</div>
                          )}
                        </IonItem>
                      </div>
                      <div className="form-column">
                        {/* Empty column for spacing */}
                      </div>
                    </div>

                    {/* Guarantor Details - Only show after Aadhaar verification */}
                    {guarantorAadhaarVerified && (
                    <>
                    <div className="form-grid">
                      <div className="form-column">
                        <IonItem className="form-item">
                          <IonLabel position="stacked">Guarantor First Name</IonLabel>
                          <IonInput
                            id="guarantor-first-name"
                            type="text"
                            value={guarantorDetails.firstName}
                            onIonInput={(e) => handleGuarantorNameChange('firstName', e.detail.value!)}
                            placeholder="Enter guarantor first name"
                            className="guarantor-input"
                          />
                        </IonItem>
                      </div>
                      <div className="form-column">
                        <IonItem className="form-item">
                          <IonLabel position="stacked">Guarantor Last Name</IonLabel>
                          <IonInput
                            id="guarantor-last-name"
                            type="text"
                            value={guarantorDetails.lastName}
                            onIonInput={(e) => handleGuarantorNameChange('lastName', e.detail.value!)}
                            placeholder="Enter guarantor last name"
                            className="guarantor-input"
                          />
                        </IonItem>
                      </div>
                    </div>

                    <div className="form-grid">
                      <div className="form-column">
                        <IonItem className="form-item">
                          <IonLabel position="stacked">Relationship</IonLabel>
                          <IonInput
                            id="guarantor-relationship"
                            type="text"
                            value={guarantorDetails.relationship}
                            onIonInput={(e) => handleGuarantorNameChange('relationship', e.detail.value!)}
                            placeholder="Enter relationship"
                            className="guarantor-input"
                          />
                        </IonItem>
                      </div>
                      <div className="form-column">
                        <IonItem className="form-item">
                          <IonLabel position="stacked">Guarantor Mobile</IonLabel>
                          <IonInput
                            id="guarantor-mobile"
                            type="text"
                            inputMode="numeric"
                            value={guarantorDetails.mobile}
                            onIonInput={(e) => handleGuarantorMobileChange(e.detail.value!)}
                            placeholder="Enter guarantor mobile"
                            className="guarantor-input"
                            maxlength={10}
                          />
                        </IonItem>
                      </div>
                    </div>

                    <div className="form-grid">
                      <div className="form-column">
                        <IonItem className="form-item">
                          <IonLabel position="stacked">Guarantor Email</IonLabel>
                          <IonInput
                            id="guarantor-email"
                            type="email"
                            value={guarantorDetails.email}
                            onIonInput={(e) => handleGuarantorEmailChange(e.detail.value!)}
                            placeholder="Enter guarantor email"
                            className="guarantor-input"
                          />
                        </IonItem>
                      </div>
                      <div className="form-column">
                        <IonItem className="form-item">
                          <IonLabel position="stacked">Guarantee Amount</IonLabel>
                          <IonInput
                            id="guarantee-amount"
                            type="text"
                            inputMode="numeric"
                            value={guarantorDetails.guaranteeAmount}
                            onIonInput={(e) => handleGuaranteeAmountChange(e.detail.value!)}
                            placeholder="Enter guarantee amount"
                            className="guarantor-input guarantee-amount-input"
                          />
                          <div className="amount-in-words">
                            In words: {convertNumberToWords(parseInt(guarantorDetails.guaranteeAmount) || 0)}
                          </div>
                        </IonItem>
                      </div>
                    </div>

                    <div className="form-grid">
                      <div className="form-column full-width">
                        <IonItem className="form-item">
                          <IonLabel position="stacked">Guarantor Address</IonLabel>
                          <IonInput
                            id="guarantor-address"
                            type="text"
                            value={guarantorDetails.address}
                            onIonInput={(e) => handleGuarantorChange('address', e.detail.value!)}
                            placeholder="Enter guarantor address"
                            className="guarantor-input address-input"
                          />
                        </IonItem>
                      </div>
                    </div>
                    </>
                    )}
                  </div>
                )}

                {currentStep === 8 && (
                  <div className="step-content">
                    <div className="section-title">
                      Witnesses
                      <IonButton
                        fill="clear"
                        size="small"
                        className="add-witness-btn"
                        onClick={addWitness}
                      >
                        <IonIcon icon="add" slot="icon-only" />
                      </IonButton>
                    </div>
                    
                    {witnesses.map((witness, index) => (
                      <div key={witness.id} className="witness-section">
                        <div className="witness-section-header">
                          <h4>Witness {index + 1}</h4>
                          {witnesses.length > 1 && (
                            <IonButton
                              fill="clear"
                              size="small"
                              color="danger"
                              className="remove-witness-btn"
                              onClick={() => removeWitness(witness.id)}
                            >
                              <IonIcon icon="close" slot="icon-only" />
                            </IonButton>
                          )}
                        </div>
                        
                        <div className="form-grid">
                          <div className="form-column">
                            <IonItem className="form-item">
                              <IonLabel position="stacked">Witness Name</IonLabel>
                              <IonInput
                                id={`witness-name-${witness.id}`}
                                type="text"
                                value={witness.name}
                                onIonInput={(e) => handleWitnessNameChange(witness.id, e.detail.value!)}
                                placeholder="Enter witness name"
                                className="witness-input"
                              />
                            </IonItem>
                          </div>
                          <div className="form-column">
                            <IonItem className="form-item">
                              <IonLabel position="stacked">Relation with the witness</IonLabel>
                              <IonSelect
                                value={witness.relation}
                                onIonChange={(e) => handleWitnessChange(witness.id, 'relation', e.detail.value)}
                                placeholder="Select relation"
                                className="witness-select"
                              >
                                {witnessRelations.map((relation) => (
                                  <IonSelectOption key={relation} value={relation}>
                                    {relation}
                                  </IonSelectOption>
                                ))}
                              </IonSelect>
                            </IonItem>
                          </div>
                        </div>

                        <div className="form-grid">
                          <div className="form-column">
                            <IonItem className="form-item">
                              <IonLabel position="stacked">Witness Contact</IonLabel>
                              <IonInput
                                id={`witness-contact-${witness.id}`}
                                type="text"
                                inputMode="numeric"
                                value={witness.contact}
                                onIonInput={(e) => handleWitnessContactChange(witness.id, e.detail.value!)}
                                placeholder="Enter witness contact"
                                className="witness-input"
                                maxlength={10}
                              />
                            </IonItem>
                          </div>
                          <div className="form-column">
                            <IonItem className="form-item">
                              <IonLabel position="stacked">Witness Email</IonLabel>
                              <IonInput
                                id={`witness-email-${witness.id}`}
                                type="email"
                                value={witness.email}
                                onIonInput={(e) => handleWitnessEmailChange(witness.id, e.detail.value!)}
                                placeholder="Enter witness email"
                                className="witness-input"
                              />
                            </IonItem>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {currentStep === 9 && (
                  <div className="step-content">
                    <div className="section-title">
                      Documents
                      <IonButton
                        fill="clear"
                        size="small"
                        className="add-document-btn"
                        onClick={addDocument}
                      >
                        <IonIcon icon="add" slot="icon-only" />
                      </IonButton>
                    </div>
                    
                    {/* Warning Message */}
                    <div className="warning-message">
                      <IonText color="danger">
                        <p>If your image is not clear the application shall be rejected.</p>
                      </IonText>
                    </div>
                    
                    {/* Documents List */}
                    <div className="documents-list">
                      {documents.map((document, index) => (
                        <div key={document.id} className="document-row">
                          <div className="document-type-column">
                            <IonLabel className="document-label">Document Type</IonLabel>
                            <IonInput
                              value={document.type}
                              onIonInput={(e) => handleDocumentTypeChange(document.id, e.detail.value!)}
                              placeholder="Enter document type"
                              className="document-type-input"
                            />
                          </div>
                          
                          <div className="document-upload-column">
                            <IonLabel className="document-label">Attachment</IonLabel>
                            <div className="upload-section">
                              <input
                                type="file"
                                id={`file-upload-${document.id}`}
                                className="file-input"
                                onChange={(e) => handleFileUpload(document.id, e)}
                                accept="image/*,.pdf,.doc,.docx"
                              />
                              <IonButton
                                fill="solid"
                                className="upload-btn"
                                onClick={() => {
                                  const fileInput = window.document.getElementById(`file-upload-${document.id}`) as HTMLInputElement;
                                  if (fileInput) fileInput.click();
                                }}
                              >
                                <IonIcon icon="cloud-upload-outline" slot="start" />
                                Upload File
                              </IonButton>
                              {document.fileName && (
                                <div className="file-name">
                                  {document.fileName}
                                </div>
                              )}
                            </div>
                          </div>
                          
                          {documents.length > 1 && (
                            <div className="document-remove-column">
                              <IonButton
                                fill="clear"
                                size="small"
                                color="danger"
                                className="remove-document-btn"
                                onClick={() => removeDocument(document.id)}
                              >
                                <IonIcon icon="close" slot="icon-only" />
                              </IonButton>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {currentStep === 10 && (
                  <div className="step-content">
                    <div className="section-title">
                      Vendor Details
                    </div>
                    
                    <div className="vendor-form">
                      <div className="form-grid">
                        {/* Left Column */}
                        <div className="form-item">
                          <IonLabel className="form-label">Vendor Type</IonLabel>
                          <IonSelect
                            value={vendorDetails.vendorType}
                            onIonChange={(e) => handleVendorDetailsChange('vendorType', e.detail.value)}
                            placeholder="Select"
                            className="vendor-select"
                            interface="popover"
                          >
                            <IonSelectOption value="Individual">Individual</IonSelectOption>
                            <IonSelectOption value="Sole Proprietor">Sole Proprietor</IonSelectOption>
                            <IonSelectOption value="Company">Company</IonSelectOption>
                            <IonSelectOption value="Other">Other</IonSelectOption>
                          </IonSelect>
                        </div>

                        <div className="form-item">
                          <IonLabel className="form-label">Vendor Contact</IonLabel>
                          <IonInput
                            type="tel"
                            value={vendorDetails.vendorContact}
                            onIonInput={(e) => handleVendorContactChange(e.detail.value!)}
                            placeholder="Enter vendor contact number"
                            className="vendor-input"
                          />
                        </div>

                        <div className="form-item">
                          <IonLabel className="form-label">Vendor Pincode</IonLabel>
                          <IonInput
                            type="tel"
                            value={vendorDetails.vendorPincode}
                            onIonInput={(e) => handleVendorPincodeChange(e.detail.value!)}
                            placeholder="Enter pincode"
                            className="vendor-input"
                          />
                        </div>

                        <div className="form-item">
                          <IonLabel className="form-label">GST No.</IonLabel>
                          <IonInput
                            value={vendorDetails.gstNo}
                            onIonInput={(e) => handleGSTChange(e.detail.value!)}
                            placeholder="Enter GST number"
                            className="vendor-input"
                          />
                        </div>

                        {/* Right Column */}
                        <div className="form-item">
                          <IonLabel className="form-label">Vendor Name</IonLabel>
                          <IonInput
                            value={vendorDetails.vendorName}
                            onIonInput={(e) => handleVendorDetailsChange('vendorName', e.detail.value!)}
                            placeholder="Enter vendor name"
                            className="vendor-input"
                          />
                        </div>

                        <div className="form-item">
                          <IonLabel className="form-label">Vendor Address</IonLabel>
                          <IonInput
                            value={vendorDetails.vendorAddress}
                            onIonInput={(e) => handleVendorDetailsChange('vendorAddress', e.detail.value!)}
                            placeholder="Enter vendor address"
                            className="vendor-input"
                          />
                        </div>

                        <div className="form-item">
                          <IonLabel className="form-label">Vendor PAN</IonLabel>
                          <IonInput
                            value={vendorDetails.vendorPAN}
                            onIonInput={(e) => handleVendorPANChange(e.detail.value!)}
                            placeholder="Enter PAN number"
                            className="vendor-input"
                          />
                        </div>

                        <div className="form-item">
                          <IonLabel className="form-label">Amount to be paid</IonLabel>
                          <IonInput
                            type="number"
                            value={vendorDetails.amountToBePaid}
                            onIonInput={(e) => handleAmountChange(e.detail.value!)}
                            placeholder="Enter amount"
                            className="vendor-input"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {currentStep > 10 && (
                  <div className="step-content">
                    <div className="coming-soon">
                      <IonText color="primary">
                        <h3>Step {currentStep} - {steps[currentStep - 1].title}</h3>
                        <p>This step is coming soon!</p>
                      </IonText>
                    </div>
                  </div>
                )}
              </IonCardContent>
            </IonCard>

            {/* Navigation Buttons */}
            <StepNavigation
              currentStep={currentStep}
              totalSteps={10}
              onPrevious={handlePrevious}
              onNext={handleNext}
              onSubmit={handleSubmitApplication}
              isValid={getCurrentStepValidation()}
              isFinalStep={currentStep === 10}
            />
          </div>
        </div>

        {/* OTP Popup Modal */}
        <IonModal isOpen={showOTPPopup} onDidDismiss={handleOTPCancel}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Enter OTP</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={handleOTPCancel}>
                  <IonIcon icon="close" />
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent className="otp-modal-content">
            <div className="otp-content">
              <div className="otp-header">
                <h3>Verify Aadhaar</h3>
                <p>Enter the 6-digit OTP sent to your mobile linked with Aadhaar to fetch your details.</p>
              </div>
              
              <div className="otp-input-container">
                <IonInput
                  type="text"
                  inputMode="numeric"
                  maxlength={6}
                  value={otp}
                  onIonInput={(e) => setOtp(e.detail.value!)}
                  placeholder="Enter OTP"
                  className="otp-input"
                />
              </div>

              <div className="otp-actions">
                <IonButton
                  fill="outline"
                  className="otp-cancel-btn"
                  onClick={handleOTPCancel}
                >
                  Cancel
                </IonButton>
                <IonButton
                  className="otp-submit-btn"
                  onClick={handleOTPSubmit}
                  disabled={otp.length !== 6}
                >
                  Verify OTP
                </IonButton>
              </div>
            </div>
          </IonContent>
        </IonModal>

        {/* Guarantor OTP Popup Modal */}
        <IonModal isOpen={showGuarantorOTPPopup} onDidDismiss={handleGuarantorOTPCancel}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Enter Guarantor OTP</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={handleGuarantorOTPCancel}>
                  <IonIcon icon="close" />
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent className="otp-modal-content">
            <div className="otp-content">
              <div className="otp-header">
                <h3>Verify Guarantor Aadhaar</h3>
                <p>Enter the 6-digit OTP sent to the mobile linked with guarantor's Aadhaar to fetch their details.</p>
              </div>
              
              <div className="otp-input-container">
                <IonInput
                  type="text"
                  inputMode="numeric"
                  maxlength={6}
                  value={guarantorOtp}
                  onIonInput={(e) => setGuarantorOtp(e.detail.value!)}
                  placeholder="Enter OTP"
                  className="otp-input"
                />
              </div>

              <div className="otp-actions">
                <IonButton
                  fill="outline"
                  className="otp-cancel-btn"
                  onClick={handleGuarantorOTPCancel}
                >
                  Cancel
                </IonButton>
                <IonButton
                  className="otp-submit-btn"
                  onClick={handleGuarantorOTPSubmit}
                  disabled={guarantorOtp.length !== 6}
                >
                  Verify OTP
                </IonButton>
              </div>
            </div>
          </IonContent>
        </IonModal>

      {/* Validating overlays */}
      <IonLoading isOpen={showValidating} message="Validating Aadhaar..." spinner="circles" duration={0} />
      <IonLoading isOpen={showGuarantorValidating} message="Validating Guarantor Aadhaar..." spinner="circles" duration={0} />

      {/* Success Toast */}
      <IonToast
        isOpen={toast.open}
        message={toast.message}
        duration={2500}
        position="bottom"
        onDidDismiss={() => setToast({open: false, message: ''})}
      />
      </IonContent>
    </IonPage>
  );
};

export default LoanApplication;
