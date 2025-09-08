import React, { useState, useMemo } from 'react';
import {
  IonContent,
  IonSearchbar,
  IonSelect,
  IonSelectOption,
  IonGrid,
  IonRow,
  IonCol,
  IonButton,
  IonIcon,
  IonSpinner,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonChip,
  IonBadge,
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonItem,
  IonLabel,
  IonText,
  IonToast
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { 
  searchOutline, 
  filterOutline, 
  checkmarkCircleOutline,
  timeOutline,
  cashOutline,
  businessOutline,
  schoolOutline,
  homeOutline,
  medicalOutline,
  carOutline,
  closeOutline,
  documentTextOutline
} from 'ionicons/icons';
import { mockDataService } from '../../services/api';
import type { Scheme } from '../../types';
import './PublicSchemes.css';

const PublicSchemes: React.FC = () => {
  const history = useHistory();
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedScheme, setSelectedScheme] = useState<Scheme | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Get all schemes from mock data
  const allSchemes = mockDataService.getSchemes();

  // Filter and sort schemes
  const filteredAndSortedSchemes = useMemo(() => {
    let filtered = allSchemes;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(scheme => 
        scheme.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        scheme.marathiName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        scheme.type.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(scheme => scheme.type === typeFilter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'minLoan':
          aValue = a.minimumLoanLimit;
          bValue = b.minimumLoanLimit;
          break;
        case 'maxLoan':
          aValue = a.maximumLoanLimit;
          bValue = b.maximumLoanLimit;
          break;
        case 'subsidy':
          aValue = a.maximumSubsidyAmount;
          bValue = b.maximumSubsidyAmount;
          break;
        default:
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [allSchemes, searchQuery, typeFilter, sortBy, sortOrder]);

  // Get unique types for filter dropdown
  const schemeTypes = useMemo(() => {
    const types = Array.from(new Set(allSchemes.map(scheme => scheme.type)));
    return types;
  }, [allSchemes]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatLoanRange = (min: number, max: number) => {
    if (min === 0) {
      return `₹0 - ${formatCurrency(max).replace('₹', '₹')}`;
    }
    return `${formatCurrency(min)} - ${formatCurrency(max)}`;
  };

  const formatSubsidy = (percentage: number, maxAmount: number) => {
    return `${percentage}% (Max ${formatCurrency(maxAmount)})`;
  };

  const formatTenure = (min: number, max: number) => {
    if (min === 0) {
      return `0 - ${max} years`;
    }
    return `${min} - ${max} years`;
  };

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'education':
        return schoolOutline;
      case 'business':
        return businessOutline;
      case 'housing':
        return homeOutline;
      case 'medical':
        return medicalOutline;
      case 'vehicle':
        return carOutline;
      default:
        return documentTextOutline;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'education':
        return 'primary';
      case 'business':
        return 'secondary';
      case 'housing':
        return 'tertiary';
      case 'medical':
        return 'success';
      case 'vehicle':
        return 'warning';
      default:
        return 'medium';
    }
  };

  const handleApply = (scheme: Scheme) => {
    setSelectedScheme(scheme);
    setShowConfirmationModal(true);
  };

  const handleApplyConfirm = () => {
    setShowConfirmationModal(false);
    history.push('/loan-application');
  };

  const handleCloseConfirmationModal = () => {
    setShowConfirmationModal(false);
    setSelectedScheme(null);
  };

  return (
    <div className="public-schemes">
      {/* Header Section */}
      <div className="schemes-header">
        <div className="header-content">
          <h1 className="schemes-title">Government Schemes</h1>
          <p className="schemes-subtitle">
            Explore and apply for various government schemes designed to support your growth and development
          </p>
        </div>
      </div>

      {/* Filters Section */}
      <div className="filters-section">
        <div className="filters-container">
          <div className="search-filter">
            <IonSearchbar
              value={searchQuery}
              onIonInput={(e) => setSearchQuery(e.detail.value!)}
              placeholder="Search schemes..."
              className="scheme-searchbar"
            />
          </div>
          
          <div className="filter-controls">
            <IonSelect
              value={typeFilter}
              onIonChange={(e) => setTypeFilter(e.detail.value)}
              placeholder="Filter by type"
              className="type-filter"
            >
              <IonSelectOption value="all">All Types</IonSelectOption>
              {schemeTypes.map(type => (
                <IonSelectOption key={type} value={type}>{type}</IonSelectOption>
              ))}
            </IonSelect>

            <IonSelect
              value={`${sortBy}-${sortOrder}`}
              onIonChange={(e) => {
                const [sort, order] = e.detail.value.split('-');
                setSortBy(sort);
                setSortOrder(order as 'asc' | 'desc');
              }}
              placeholder="Sort by"
              className="sort-filter"
            >
              <IonSelectOption value="name-asc">Name (A-Z)</IonSelectOption>
              <IonSelectOption value="name-desc">Name (Z-A)</IonSelectOption>
              <IonSelectOption value="maxLoan-desc">Highest Loan Amount</IonSelectOption>
              <IonSelectOption value="maxLoan-asc">Lowest Loan Amount</IonSelectOption>
              <IonSelectOption value="subsidy-desc">Highest Subsidy</IonSelectOption>
              <IonSelectOption value="subsidy-asc">Lowest Subsidy</IonSelectOption>
            </IonSelect>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="results-info">
        <IonText color="medium">
          Showing {filteredAndSortedSchemes.length} scheme{filteredAndSortedSchemes.length !== 1 ? 's' : ''}
        </IonText>
      </div>

      {/* Schemes Grid */}
      <div className="schemes-grid">
        <IonGrid>
          <IonRow>
            {filteredAndSortedSchemes.map((scheme) => (
              <IonCol size="12" sizeMd="6" sizeLg="4" key={scheme.id}>
                <IonCard className="scheme-card">
                  <IonCardHeader>
                    <div className="scheme-card-header">
                      <div className="scheme-type-badge">
                        <IonChip color={getTypeColor(scheme.type)}>
                          <IonIcon icon={getTypeIcon(scheme.type)} />
                          <IonLabel>{scheme.type}</IonLabel>
                        </IonChip>
                      </div>
                      <IonCardTitle className="scheme-title">{scheme.name}</IonCardTitle>
                      {scheme.marathiName && (
                        <IonText color="medium" className="marathi-name">
                          {scheme.marathiName}
                        </IonText>
                      )}
                    </div>
                  </IonCardHeader>
                  
                  <IonCardContent>
                    <div className="scheme-details">
                      <div className="detail-item">
                        <IonIcon icon={cashOutline} className="detail-icon" />
                        <div className="detail-content">
                          <span className="detail-label">Loan Range</span>
                          <span className="detail-value">{formatLoanRange(scheme.minimumLoanLimit, scheme.maximumLoanLimit)}</span>
                        </div>
                      </div>

                      <div className="detail-item">
                        <IonIcon icon={checkmarkCircleOutline} className="detail-icon" />
                        <div className="detail-content">
                          <span className="detail-label">Subsidy</span>
                          <span className="detail-value">{formatSubsidy(scheme.subsidyLimit, scheme.maximumSubsidyAmount)}</span>
                        </div>
                      </div>

                      <div className="detail-item">
                        <IonIcon icon={timeOutline} className="detail-icon" />
                        <div className="detail-content">
                          <span className="detail-label">Tenure</span>
                          <span className="detail-value">{formatTenure(scheme.minimumTenure, scheme.maximumTenure)}</span>
                        </div>
                      </div>

                      <div className="detail-item">
                        <IonIcon icon={businessOutline} className="detail-icon" />
                        <div className="detail-content">
                          <span className="detail-label">Interest Rate</span>
                          <span className="detail-value">{scheme.vendorInterestYearly}% yearly</span>
                        </div>
                      </div>
                    </div>

                    <div className="scheme-actions">
                      <IonButton 
                        expand="block" 
                        className="apply-button"
                        onClick={() => handleApply(scheme)}
                      >
                        <IonIcon icon={documentTextOutline} slot="start" />
                        Apply Now
                      </IonButton>
                    </div>
                  </IonCardContent>
                </IonCard>
              </IonCol>
            ))}
          </IonRow>
        </IonGrid>
      </div>

      {/* No Results */}
      {filteredAndSortedSchemes.length === 0 && (
        <div className="no-results">
          <IonText color="medium">
            <h3>No schemes found</h3>
            <p>Try adjusting your search criteria or filters</p>
          </IonText>
        </div>
      )}

      {/* Confirmation Modal */}
      <IonModal isOpen={showConfirmationModal} onDidDismiss={handleCloseConfirmationModal}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>{selectedScheme?.name || 'Scheme Application'}</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={handleCloseConfirmationModal}>
                <IonIcon icon={closeOutline} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="confirmation-modal-content">
          {selectedScheme && (
            <div className="confirmation-content">
              <div className="scheme-details-modal">
                <h3>{selectedScheme.name}</h3>
                {selectedScheme.marathiName && (
                  <p className="marathi-name">{selectedScheme.marathiName}</p>
                )}
                
                <div className="scheme-details-grid">
                  <div className="detail-item">
                    <span className="detail-label">Loan Range:</span>
                    <span className="detail-value">{formatLoanRange(selectedScheme.minimumLoanLimit, selectedScheme.maximumLoanLimit)}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Subsidy:</span>
                    <span className="detail-value">{formatSubsidy(selectedScheme.subsidyLimit, selectedScheme.maximumSubsidyAmount)}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Tenure:</span>
                    <span className="detail-value">{formatTenure(selectedScheme.minimumTenure, selectedScheme.maximumTenure)}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Interest Rate:</span>
                    <span className="detail-value">{selectedScheme.vendorInterestYearly}% yearly</span>
                  </div>
                </div>
              </div>

              <div className="confirmation-declaration">
                <h4>Declaration</h4>
                <div className="declaration-text">
                  <p>
                    I hereby solemnly declare that all the above information is true. As per the attached business report, 
                    I will use the requested subsidy/loan strictly for the specified business purpose. I understand that 
                    if misused, I will be liable for legal action. The loan amount, along with interest, may be recovered 
                    from me. I will also be responsible for any further proceedings. No member of my family is currently 
                    employed. I will repay the bank loan regularly. The information I have provided is true. As proof of 
                    this truth, I am providing the names of two individuals as witnesses.
                  </p>
                </div>
              </div>

              <div className="confirmation-buttons">
                <IonButton 
                  fill="outline" 
                  className="cancel-btn"
                  onClick={handleCloseConfirmationModal}
                >
                  Cancel
                </IonButton>
                <IonButton 
                  className="confirm-btn"
                  onClick={handleApplyConfirm}
                >
                  Confirm
                </IonButton>
              </div>
            </div>
          )}
        </IonContent>
      </IonModal>

      {/* Toast */}
      <IonToast
        isOpen={showToast}
        onDidDismiss={() => setShowToast(false)}
        message={toastMessage}
        duration={3000}
        position="top"
      />
    </div>
  );
};

export default PublicSchemes;
