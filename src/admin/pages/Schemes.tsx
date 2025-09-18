import React, { useState, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import {
  IonPage, IonContent, IonSplitPane, IonHeader, IonToolbar, IonTitle,
  IonSearchbar, IonButton, IonButtons, IonIcon, IonSelect, IonSelectOption, IonGrid, IonRow, IonCol,
  IonSpinner, IonAlert, IonToast, IonCard, IonCardContent, IonCardHeader, IonCardTitle,
  IonModal, IonCheckbox, IonRange, IonDatetime, IonBadge, IonChip, IonText,
  IonPopover, IonList, IonItem, IonLabel, IonToggle, IonTextarea, IonInput
} from '@ionic/react';
import { 
  chevronBackOutline, chevronForwardOutline, searchOutline, 
  createOutline, trashOutline,
  filterOutline, closeOutline, checkmarkOutline, eyeOutline,
  informationCircleOutline, starOutline, timeOutline,
  peopleOutline, cashOutline, calendarOutline, refreshOutline
} from 'ionicons/icons';
import Sidebar from '../components/sidebar/Sidebar';
import DashboardHeader from '../components/header/DashboardHeader';
import { mockDataService } from '../../services/api';
import type { Scheme, SchemeFilters } from '../../types';
import './Schemes.css';

const Schemes: React.FC = () => {
  const history = useHistory();
  const [searchQuery, setSearchQuery] = useState('');
  // Set default values since UI controls are removed  
  const [sortBy] = useState('name'); // Always sort by name
  const [sortOrder] = useState<'asc' | 'desc'>('asc'); // Always ascending
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [selectedSchemeId, setSelectedSchemeId] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Advanced filtering states
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState<SchemeFilters>({});
  const [selectedSchemes, setSelectedSchemes] = useState<string[]>([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [showSchemeDetails, setShowSchemeDetails] = useState(false);
  const [selectedSchemeForDetails, setSelectedSchemeForDetails] = useState<Scheme | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingScheme, setEditingScheme] = useState<Scheme | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<Scheme>>({});

  const cardsPerPage = 6;

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
        (scheme.description && scheme.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (scheme.tags && scheme.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
      );
    }

    // Apply type filter from advanced filters
    if (advancedFilters.type && advancedFilters.type.length > 0) {
      filtered = filtered.filter(scheme => advancedFilters.type!.includes(scheme.type));
    }

    // Apply advanced filters
    if (advancedFilters.status && advancedFilters.status.length > 0) {
      filtered = filtered.filter(scheme => advancedFilters.status!.includes(scheme.status));
    }

    if (advancedFilters.priority && advancedFilters.priority.length > 0) {
      filtered = filtered.filter(scheme => advancedFilters.priority!.includes(scheme.priority));
    }

    if (advancedFilters.loanAmountRange) {
      filtered = filtered.filter(scheme => 
        scheme.minimumLoanLimit >= advancedFilters.loanAmountRange!.min &&
        scheme.maximumLoanLimit <= advancedFilters.loanAmountRange!.max
      );
    }

    if (advancedFilters.interestRateRange) {
      filtered = filtered.filter(scheme => 
        scheme.vendorInterestYearly >= advancedFilters.interestRateRange!.min &&
        scheme.vendorInterestYearly <= advancedFilters.interestRateRange!.max
      );
    }

    if (advancedFilters.tenureRange) {
      filtered = filtered.filter(scheme => 
        scheme.minimumTenure >= advancedFilters.tenureRange!.min &&
        scheme.maximumTenure <= advancedFilters.tenureRange!.max
      );
    }

    if (advancedFilters.subsidyRange) {
      filtered = filtered.filter(scheme => 
        scheme.subsidyLimit >= advancedFilters.subsidyRange!.min &&
        scheme.subsidyLimit <= advancedFilters.subsidyRange!.max
      );
    }

    if (advancedFilters.tags && advancedFilters.tags.length > 0) {
      filtered = filtered.filter(scheme => 
        scheme.tags && scheme.tags.some(tag => advancedFilters.tags!.includes(tag))
      );
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
  }, [allSchemes, searchQuery, advancedFilters, sortBy, sortOrder]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredAndSortedSchemes.length / cardsPerPage);
  const startIndex = (currentPage - 1) * cardsPerPage;
  const endIndex = startIndex + cardsPerPage;
  const currentSchemes = filteredAndSortedSchemes.slice(startIndex, endIndex);


  const handleApply = (schemeId: string) => {
    // Navigate to Loan Application page and pass the schemeId
    history.push(`/loan-application?schemeId=${schemeId}`);
  };

  const handleEdit = (schemeId: string) => {
    const schemeToEdit = allSchemes.find(scheme => scheme.id === schemeId);
    if (schemeToEdit) {
      setEditingScheme(schemeToEdit);
      setEditFormData({
        name: schemeToEdit.name,
        marathiName: schemeToEdit.marathiName,
        type: schemeToEdit.type,
        description: schemeToEdit.description,
        minimumLoanLimit: schemeToEdit.minimumLoanLimit,
        maximumLoanLimit: schemeToEdit.maximumLoanLimit,
        subsidyLimit: schemeToEdit.subsidyLimit,
        maximumSubsidyAmount: schemeToEdit.maximumSubsidyAmount,
        downPaymentPercent: schemeToEdit.downPaymentPercent,
        vendorInterestYearly: schemeToEdit.vendorInterestYearly,
        minimumTenure: schemeToEdit.minimumTenure,
        maximumTenure: schemeToEdit.maximumTenure,
        status: schemeToEdit.status,
        priority: schemeToEdit.priority
      });
      setShowEditModal(true);
    }
  };

  const handleDelete = (schemeId: string) => {
    setSelectedSchemeId(schemeId);
    setShowDeleteAlert(true);
  };

  const confirmDelete = () => {
    if (selectedSchemeId) {
      setToastMessage('Delete functionality will be implemented');
      setShowToast(true);
      setSelectedSchemeId(null);
    }
    setShowDeleteAlert(false);
  };

  const cancelDelete = () => {
    setSelectedSchemeId(null);
    setShowDeleteAlert(false);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };


  // Advanced filtering handlers
  const handleAdvancedFilterChange = (filterType: keyof SchemeFilters, value: any) => {
    setAdvancedFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const clearAdvancedFilters = () => {
    setAdvancedFilters({});
  };

  // Bulk operations handlers
  const handleSchemeSelection = (schemeId: string, isSelected: boolean) => {
    if (isSelected) {
      setSelectedSchemes(prev => [...prev, schemeId]);
    } else {
      setSelectedSchemes(prev => prev.filter(id => id !== schemeId));
    }
  };

  const handleSelectAll = () => {
    if (selectedSchemes.length === currentSchemes.length) {
      setSelectedSchemes([]);
    } else {
      setSelectedSchemes(currentSchemes.map(scheme => scheme.id));
    }
  };

  const handleBulkStatusChange = (status: string) => {
    setToastMessage(`Bulk status change to ${status} will be implemented`);
    setShowToast(true);
    setSelectedSchemes([]);
    setShowBulkActions(false);
  };

  const handleBulkDelete = () => {
    setToastMessage(`Bulk delete for ${selectedSchemes.length} schemes will be implemented`);
    setShowToast(true);
    setSelectedSchemes([]);
    setShowBulkActions(false);
  };

  // Edit form handlers
  const handleEditFormChange = (field: keyof Scheme, value: any) => {
    setEditFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveEdit = () => {
    if (editingScheme && editFormData) {
      // TODO: Replace with actual API call to update scheme
      console.log('Saving scheme:', { ...editingScheme, ...editFormData });
      setToastMessage(`Scheme "${editFormData.name || editingScheme.name}" updated successfully`);
      setShowToast(true);
      setShowEditModal(false);
      setEditingScheme(null);
      setEditFormData({});
    }
  };

  const handleCancelEdit = () => {
    setShowEditModal(false);
    setEditingScheme(null);
    setEditFormData({});
  };

  // Scheme details handler
  const handleViewDetails = (scheme: Scheme) => {
    setSelectedSchemeForDetails(scheme);
    setShowSchemeDetails(true);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatRange = (min: number, max: number) => {
    return `${formatCurrency(min)} - ${formatCurrency(max)}`;
  };

  // Helper functions
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'medium';
      case 'under_review': return 'warning';
      case 'archived': return 'dark';
      default: return 'medium';
    }
  };

  const getPriorityBadgeColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'danger';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'medium';
    }
  };

  // Get unique values for filters
  const uniqueStatuses = useMemo(() => {
    return Array.from(new Set(allSchemes.map(scheme => scheme.status)));
  }, [allSchemes]);

  const uniquePriorities = useMemo(() => {
    return Array.from(new Set(allSchemes.map(scheme => scheme.priority)));
  }, [allSchemes]);

  const uniqueTags = useMemo(() => {
    const allTags = allSchemes.flatMap(scheme => scheme.tags || []);
    return Array.from(new Set(allTags));
  }, [allSchemes]);

  const uniqueTypes = useMemo(() => {
    return Array.from(new Set(allSchemes.map(scheme => scheme.type)));
  }, [allSchemes]);

  return (
    <IonPage>
      <IonSplitPane contentId="dashboard-content" when="md">
        <Sidebar />
        <div className="main-content" id="dashboard-content">
          <DashboardHeader />
          
          <IonContent className="schemes-content">
            <div className="schemes-container">
              {/* Search and Filter Bar */}
              <div className="schemes-navigation">
                <IonSearchbar
                  value={searchQuery}
                  onIonChange={(e) => setSearchQuery(e.detail.value!)}
                  placeholder="Search schemes, descriptions, tags..."
                  className="schemes-search"
                />

                <IonButton 
                  fill="outline"
                  onClick={() => setShowAdvancedFilters(true)}
                  className="filter-toggle-button"
                >
                  <IonIcon icon={filterOutline} />
                  <span className="filter-text">Filters</span>
                  {Object.keys(advancedFilters).length > 0 && (
                    <IonBadge color="primary" className="filter-badge">
                      {Object.keys(advancedFilters).length}
                    </IonBadge>
                  )}
                </IonButton>
              </div>


              {/* Bulk Actions */}
              {selectedSchemes.length > 0 && (
                <div className="bulk-actions-bar">
                  <div className="bulk-actions-info">
                    <IonText color="primary">
                      <strong>{selectedSchemes.length}</strong> scheme{selectedSchemes.length > 1 ? 's' : ''} selected
                    </IonText>
                  </div>
                  <div className="bulk-actions-buttons">
                    <IonButton 
                      fill="outline" 
                      size="small"
                      onClick={() => handleBulkStatusChange('active')}
                    >
                      <IonIcon icon={checkmarkOutline} />
                      Activate
                    </IonButton>
                    <IonButton 
                      fill="outline" 
                      size="small"
                      onClick={() => handleBulkStatusChange('inactive')}
                    >
                      <IonIcon icon={closeOutline} />
                      Deactivate
                    </IonButton>
                    <IonButton 
                      fill="outline" 
                      size="small"
                      color="warning"
                      onClick={() => handleBulkStatusChange('archived')}
                    >
                      <IonIcon icon={timeOutline} />
                      Archive
                    </IonButton>
                    <IonButton 
                      fill="outline" 
                      size="small"
                      color="danger"
                      onClick={handleBulkDelete}
                    >
                      <IonIcon icon={trashOutline} />
                      Delete
                    </IonButton>
                    <IonButton 
                      fill="clear" 
                      size="small"
                      onClick={() => setSelectedSchemes([])}
                    >
                      <IonIcon icon={closeOutline} />
                      Clear
                    </IonButton>
                  </div>
                </div>
              )}

              {/* Schemes Grid */}
              <div className="schemes-grid">
                <IonGrid>
                  <IonRow>
                    {currentSchemes.map((scheme) => (
                      <IonCol size="12" size-md="6" size-lg="6" key={scheme.id}>
                        <IonCard className="scheme-card">
                          <IonCardHeader className="scheme-header">
                            <div className="scheme-header-content">
                              <div className="scheme-title-section">
                                <IonCardTitle className="scheme-title">{scheme.name}</IonCardTitle>
                                <div className="scheme-badges">
                                  <IonBadge color={getStatusBadgeColor(scheme.status)} className="status-badge">
                                    {scheme.status.replace('_', ' ')}
                                  </IonBadge>
                                  <IonBadge color={getPriorityBadgeColor(scheme.priority)} className="priority-badge">
                                    {scheme.priority}
                                  </IonBadge>
                                </div>
                              </div>
                              <div className="scheme-header-actions">
                                <IonCheckbox
                                  checked={selectedSchemes.includes(scheme.id)}
                                  onIonChange={(e) => handleSchemeSelection(scheme.id, e.detail.checked)}
                                  className="scheme-checkbox"
                                />
                              </div>
                            </div>
                          </IonCardHeader>
                          <IonCardContent className="scheme-content">
                            <div className="scheme-details">
                              <div className="detail-row">
                                <span className="detail-label">Loan Range:</span>
                                <span className="detail-value">{formatRange(scheme.minimumLoanLimit, scheme.maximumLoanLimit)}</span>
                              </div>
                              <div className="detail-row">
                                <span className="detail-label">Subsidy:</span>
                                <span className="detail-value">{scheme.subsidyLimit}% (Max {formatCurrency(scheme.maximumSubsidyAmount)})</span>
                              </div>
                              <div className="detail-row">
                                <span className="detail-label">Own Contribution:</span>
                                <span className="detail-value">{scheme.downPaymentPercent}%</span>
                              </div>
                              <div className="detail-row">
                                <span className="detail-label">MPBCDC Interest:</span>
                                <span className="detail-value">{scheme.vendorInterestYearly}% yearly</span>
                              </div>
                              <div className="detail-row">
                                <span className="detail-label">Bank Share:</span>
                                <span className="detail-value">{scheme.loanPercentByPartner}%</span>
                              </div>
                              <div className="detail-row">
                                <span className="detail-label">Tenure:</span>
                                <span className="detail-value">{scheme.minimumTenure} - {scheme.maximumTenure} years</span>
                              </div>
                              <div className="detail-row">
                                <span className="detail-label">Interest:</span>
                                <span className="detail-value">{scheme.interestType}</span>
                              </div>
                              <div className="detail-row">
                                <span className="detail-label">Partner Involvement:</span>
                                <span className="detail-value">{scheme.partnerInvolvement ? 'Yes' : 'No'}</span>
                              </div>
                              <div className="detail-row">
                                <span className="detail-label">Recovery by Partner:</span>
                                <span className="detail-value">{scheme.recoveryByPartner ? 'Yes' : 'No'}</span>
                              </div>
                              {scheme.usageCount > 0 && (
                                <div className="detail-row">
                                  <span className="detail-label">Usage Count:</span>
                                  <span className="detail-value">{scheme.usageCount} applications</span>
                                </div>
                              )}
                            </div>
                            <div className="scheme-actions">
                              <IonButton 
                                fill="solid" 
                                className="apply-button"
                                onClick={() => handleApply(scheme.id)}
                              >
                                Apply
                              </IonButton>
                              <div className="admin-actions">
                                <IonButton 
                                  fill="clear" 
                                  size="small" 
                                  className="view-details-button"
                                  onClick={() => handleViewDetails(scheme)}
                                >
                                  <IonIcon icon={eyeOutline} />
                                  <span>View</span>
                                </IonButton>
                                <IonButton 
                                  fill="clear" 
                                  size="small" 
                                  className="edit-button"
                                  onClick={() => handleEdit(scheme.id)}
                                >
                                  <IonIcon icon={createOutline} />
                                  <span>Edit</span>
                                </IonButton>
                                <IonButton 
                                  fill="clear" 
                                  size="small" 
                                  className="delete-button"
                                  onClick={() => handleDelete(scheme.id)}
                                >
                                  <IonIcon icon={trashOutline} />
                                  <span>Delete</span>
                                </IonButton>
                              </div>
                            </div>
                          </IonCardContent>
                        </IonCard>
                      </IonCol>
                    ))}
                  </IonRow>
                </IonGrid>
              </div>

              {/* Pagination Navigation */}
              <div className="pagination-container">
                <div className="pagination-info">
                  <p>
                    Showing {startIndex + 1} to {Math.min(endIndex, filteredAndSortedSchemes.length)} of {filteredAndSortedSchemes.length} schemes
                  </p>
                </div>
                
                <div className="pagination-controls">
                  <div className="page-numbers">
                    {Array.from({ length: totalPages }, (_, index) => {
                      const pageNumber = index + 1;
                      const isCurrentPage = pageNumber === currentPage;
                      const showPage = totalPages <= 5 || 
                                      pageNumber === 1 || 
                                      pageNumber === totalPages ||
                                      Math.abs(pageNumber - currentPage) <= 1;
                      
                      if (!showPage && pageNumber !== 2 && pageNumber !== totalPages - 1) {
                        return null;
                      }
                      
                      if (!showPage) {
                        return <span key={pageNumber} className="page-ellipsis">...</span>;
                      }
                      
                      return (
                        <IonButton
                          key={pageNumber}
                          fill={isCurrentPage ? "solid" : "clear"}
                          size="small"
                          className={`page-number ${isCurrentPage ? 'active' : ''}`}
                          onClick={() => setCurrentPage(pageNumber)}
                        >
                          {pageNumber}
                        </IonButton>
                      );
                    })}
                  </div>
                  
                  <div className="pagination-nav-buttons">
                    <IonButton 
                      fill="outline" 
                      disabled={currentPage === 1}
                      onClick={handlePreviousPage}
                      className="pagination-button"
                      size="small"
                      aria-label="Previous Page"
                    >
                      <IonIcon icon={chevronBackOutline} />
                    </IonButton>
                    
                    <IonButton 
                      fill="outline" 
                      disabled={currentPage === totalPages}
                      onClick={handleNextPage}
                      className="pagination-button"
                      size="small"
                      aria-label="Next Page"
                    >
                      <IonIcon icon={chevronForwardOutline} />
                    </IonButton>
                  </div>
                </div>
              </div>
            </div>
          </IonContent>

        </div>
      </IonSplitPane>

      {/* Delete Confirmation Alert */}
      <IonAlert
        isOpen={showDeleteAlert}
        onDidDismiss={cancelDelete}
        header="Confirm Delete"
        message="Are you sure you want to delete this scheme? This action cannot be undone."
        buttons={[
          { text: 'Cancel', role: 'cancel', handler: cancelDelete },
          { text: 'Delete', role: 'destructive', handler: confirmDelete }
        ]}
      />

      {/* Advanced Filters Modal */}
      <IonModal isOpen={showAdvancedFilters} onDidDismiss={() => setShowAdvancedFilters(false)}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Advanced Filters</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => setShowAdvancedFilters(false)}>
                <IonIcon icon={closeOutline} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="advanced-filters-content">
          <div className="filters-container">
            {/* Type Filter */}
            <div className="filter-section">
              <IonText color="primary">
                <h3>Type</h3>
              </IonText>
              <div className="filter-options">
                {uniqueTypes.map(type => (
                  <IonItem key={type}>
                    <IonCheckbox
                      checked={advancedFilters.type?.includes(type) || false}
                      onIonChange={(e) => {
                        const currentTypes = advancedFilters.type || [];
                        const newTypes = e.detail.checked
                          ? [...currentTypes, type]
                          : currentTypes.filter(t => t !== type);
                        handleAdvancedFilterChange('type', newTypes);
                      }}
                    />
                    <IonLabel>{type}</IonLabel>
                  </IonItem>
                ))}
              </div>
            </div>

            {/* Status Filter */}
            <div className="filter-section">
              <IonText color="primary">
                <h3>Status</h3>
              </IonText>
              <div className="filter-options">
                {uniqueStatuses.map(status => (
                  <IonItem key={status}>
                    <IonCheckbox
                      checked={advancedFilters.status?.includes(status) || false}
                      onIonChange={(e) => {
                        const currentStatuses = advancedFilters.status || [];
                        const newStatuses = e.detail.checked
                          ? [...currentStatuses, status]
                          : currentStatuses.filter(s => s !== status);
                        handleAdvancedFilterChange('status', newStatuses);
                      }}
                    />
                    <IonLabel>{status.replace('_', ' ')}</IonLabel>
                  </IonItem>
                ))}
              </div>
            </div>

            {/* Priority Filter */}
            <div className="filter-section">
              <IonText color="primary">
                <h3>Priority</h3>
              </IonText>
              <div className="filter-options">
                {uniquePriorities.map(priority => (
                  <IonItem key={priority}>
                    <IonCheckbox
                      checked={advancedFilters.priority?.includes(priority) || false}
                      onIonChange={(e) => {
                        const currentPriorities = advancedFilters.priority || [];
                        const newPriorities = e.detail.checked
                          ? [...currentPriorities, priority]
                          : currentPriorities.filter(p => p !== priority);
                        handleAdvancedFilterChange('priority', newPriorities);
                      }}
                    />
                    <IonLabel>{priority}</IonLabel>
                  </IonItem>
                ))}
              </div>
            </div>

            {/* Loan Amount Range */}
            <div className="filter-section">
              <IonText color="primary">
                <h3>Loan Amount Range (₹)</h3>
              </IonText>
              <IonRange
                dual-knobs={true}
                min={0}
                max={10000000}
                step={100000}
                value={{
                  lower: advancedFilters.loanAmountRange?.min || 0,
                  upper: advancedFilters.loanAmountRange?.max || 10000000
                }}
                onIonChange={(e) => {
                  const value = e.detail.value as { lower: number; upper: number };
                  handleAdvancedFilterChange('loanAmountRange', {
                    min: value.lower,
                    max: value.upper
                  });
                }}
              />
              <div className="range-labels">
                <span>₹{advancedFilters.loanAmountRange?.min?.toLocaleString() || '0'}</span>
                <span>₹{advancedFilters.loanAmountRange?.max?.toLocaleString() || '10,000,000'}</span>
              </div>
            </div>

            {/* Interest Rate Range */}
            <div className="filter-section">
              <IonText color="primary">
                <h3>Interest Rate Range (%)</h3>
              </IonText>
              <IonRange
                dual-knobs={true}
                min={0}
                max={30}
                step={0.5}
                value={{
                  lower: advancedFilters.interestRateRange?.min || 0,
                  upper: advancedFilters.interestRateRange?.max || 30
                }}
                onIonChange={(e) => {
                  const value = e.detail.value as { lower: number; upper: number };
                  handleAdvancedFilterChange('interestRateRange', {
                    min: value.lower,
                    max: value.upper
                  });
                }}
              />
              <div className="range-labels">
                <span>{advancedFilters.interestRateRange?.min || '0'}%</span>
                <span>{advancedFilters.interestRateRange?.max || '30'}%</span>
              </div>
            </div>

            {/* Tags Filter */}
            {uniqueTags.length > 0 && (
              <div className="filter-section">
                <IonText color="primary">
                  <h3>Tags</h3>
                </IonText>
                <div className="filter-options">
                  {uniqueTags.map(tag => (
                    <IonItem key={tag}>
                      <IonCheckbox
                        checked={advancedFilters.tags?.includes(tag) || false}
                        onIonChange={(e) => {
                          const currentTags = advancedFilters.tags || [];
                          const newTags = e.detail.checked
                            ? [...currentTags, tag]
                            : currentTags.filter(t => t !== tag);
                          handleAdvancedFilterChange('tags', newTags);
                        }}
                      />
                      <IonLabel>{tag}</IonLabel>
                    </IonItem>
                  ))}
                </div>
              </div>
            )}

            {/* Filter Actions */}
            <div className="filter-actions">
              <IonButton fill="outline" onClick={clearAdvancedFilters}>
                Clear All
              </IonButton>
              <IonButton fill="solid" onClick={() => setShowAdvancedFilters(false)}>
                Apply Filters
              </IonButton>
            </div>
          </div>
        </IonContent>
      </IonModal>

      {/* Scheme Details Modal */}
      <IonModal isOpen={showSchemeDetails} onDidDismiss={() => setShowSchemeDetails(false)}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Scheme Details</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => setShowSchemeDetails(false)}>
                <IonIcon icon={closeOutline} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="scheme-details-content">
          {selectedSchemeForDetails && (
            <div className="scheme-details-container">
              <div className="scheme-details-header">
                <h2>{selectedSchemeForDetails.name}</h2>
                <div className="scheme-details-badges">
                  <IonBadge color={getStatusBadgeColor(selectedSchemeForDetails.status)}>
                    {selectedSchemeForDetails.status.replace('_', ' ')}
                  </IonBadge>
                  <IonBadge color={getPriorityBadgeColor(selectedSchemeForDetails.priority)}>
                    {selectedSchemeForDetails.priority} Priority
                  </IonBadge>
                </div>
              </div>

              {selectedSchemeForDetails.description && (
                <div className="scheme-details-section">
                  <h3>Description</h3>
                  <p>{selectedSchemeForDetails.description}</p>
                </div>
              )}

              <div className="scheme-details-section">
                <h3>Financial Details</h3>
                <div className="details-grid">
                  <div className="detail-item">
                    <span className="detail-label">Loan Range:</span>
                    <span className="detail-value">{formatRange(selectedSchemeForDetails.minimumLoanLimit, selectedSchemeForDetails.maximumLoanLimit)}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Subsidy:</span>
                    <span className="detail-value">{selectedSchemeForDetails.subsidyLimit}% (Max {formatCurrency(selectedSchemeForDetails.maximumSubsidyAmount)})</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Interest Rate:</span>
                    <span className="detail-value">{selectedSchemeForDetails.vendorInterestYearly}% yearly</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Tenure:</span>
                    <span className="detail-value">{selectedSchemeForDetails.minimumTenure} - {selectedSchemeForDetails.maximumTenure} years</span>
                  </div>
                </div>
              </div>

              {selectedSchemeForDetails.eligibilityCriteria && selectedSchemeForDetails.eligibilityCriteria.length > 0 && (
                <div className="scheme-details-section">
                  <h3>Eligibility Criteria</h3>
                  <ul>
                    {selectedSchemeForDetails.eligibilityCriteria.map((criteria, index) => (
                      <li key={index}>{criteria}</li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedSchemeForDetails.requiredDocuments && selectedSchemeForDetails.requiredDocuments.length > 0 && (
                <div className="scheme-details-section">
                  <h3>Required Documents</h3>
                  <ul>
                    {selectedSchemeForDetails.requiredDocuments.map((doc, index) => (
                      <li key={index}>{doc}</li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedSchemeForDetails.faq && selectedSchemeForDetails.faq.length > 0 && (
                <div className="scheme-details-section">
                  <h3>Frequently Asked Questions</h3>
                  {selectedSchemeForDetails.faq.map((faq, index) => (
                    <div key={index} className="faq-item">
                      <h4>{faq.question}</h4>
                      <p>{faq.answer}</p>
                    </div>
                  ))}
                </div>
              )}

              <div className="scheme-details-section">
                <h3>Usage Statistics</h3>
                <div className="details-grid">
                  <div className="detail-item">
                    <span className="detail-label">Total Applications:</span>
                    <span className="detail-value">{selectedSchemeForDetails.usageCount}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Last Used:</span>
                    <span className="detail-value">{selectedSchemeForDetails.lastUsed || 'Never'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Created:</span>
                    <span className="detail-value">{new Date(selectedSchemeForDetails.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Last Updated:</span>
                    <span className="detail-value">{new Date(selectedSchemeForDetails.updatedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </IonContent>
      </IonModal>

      {/* Edit Scheme Modal */}
      <IonModal isOpen={showEditModal} onDidDismiss={handleCancelEdit}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Edit Scheme</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={handleCancelEdit}>
                <IonIcon icon={closeOutline} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="edit-scheme-content">
          {editingScheme && (
            <div className="edit-form-container">
              {/* Basic Information */}
              <div className="edit-section">
                <h3>Basic Information</h3>
                <IonItem>
                  <IonLabel position="stacked">Scheme Name</IonLabel>
                  <IonInput
                    value={editFormData.name || ''}
                    onIonInput={(e) => handleEditFormChange('name', e.detail.value!)}
                    placeholder="Enter scheme name"
                  />
                </IonItem>
                <IonItem>
                  <IonLabel position="stacked">Marathi Name</IonLabel>
                  <IonInput
                    value={editFormData.marathiName || ''}
                    onIonInput={(e) => handleEditFormChange('marathiName', e.detail.value!)}
                    placeholder="Enter Marathi name"
                  />
                </IonItem>
                <IonItem>
                  <IonLabel position="stacked">Type</IonLabel>
                  <IonSelect
                    value={editFormData.type || ''}
                    onIonChange={(e) => handleEditFormChange('type', e.detail.value)}
                    placeholder="Select type"
                  >
                    {uniqueTypes.map(type => (
                      <IonSelectOption key={type} value={type}>{type}</IonSelectOption>
                    ))}
                  </IonSelect>
                </IonItem>
                <IonItem>
                  <IonLabel position="stacked">Description</IonLabel>
                  <IonTextarea
                    value={editFormData.description || ''}
                    onIonInput={(e) => handleEditFormChange('description', e.detail.value!)}
                    placeholder="Enter description"
                    rows={3}
                  />
                </IonItem>
              </div>

              {/* Financial Details */}
              <div className="edit-section">
                <h3>Financial Details</h3>
                <IonItem>
                  <IonLabel position="stacked">Minimum Loan Limit (₹)</IonLabel>
                  <IonInput
                    type="number"
                    value={editFormData.minimumLoanLimit?.toString() || ''}
                    onIonInput={(e) => handleEditFormChange('minimumLoanLimit', parseInt(e.detail.value!) || 0)}
                    placeholder="0"
                  />
                </IonItem>
                <IonItem>
                  <IonLabel position="stacked">Maximum Loan Limit (₹)</IonLabel>
                  <IonInput
                    type="number"
                    value={editFormData.maximumLoanLimit?.toString() || ''}
                    onIonInput={(e) => handleEditFormChange('maximumLoanLimit', parseInt(e.detail.value!) || 0)}
                    placeholder="0"
                  />
                </IonItem>
                <IonItem>
                  <IonLabel position="stacked">Subsidy Limit (%)</IonLabel>
                  <IonInput
                    type="number"
                    value={editFormData.subsidyLimit?.toString() || ''}
                    onIonInput={(e) => handleEditFormChange('subsidyLimit', parseFloat(e.detail.value!) || 0)}
                    placeholder="0"
                  />
                </IonItem>
                <IonItem>
                  <IonLabel position="stacked">Maximum Subsidy Amount (₹)</IonLabel>
                  <IonInput
                    type="number"
                    value={editFormData.maximumSubsidyAmount?.toString() || ''}
                    onIonInput={(e) => handleEditFormChange('maximumSubsidyAmount', parseInt(e.detail.value!) || 0)}
                    placeholder="0"
                  />
                </IonItem>
                <IonItem>
                  <IonLabel position="stacked">Interest Rate (% yearly)</IonLabel>
                  <IonInput
                    type="number"
                    value={editFormData.vendorInterestYearly?.toString() || ''}
                    onIonInput={(e) => handleEditFormChange('vendorInterestYearly', parseFloat(e.detail.value!) || 0)}
                    placeholder="0"
                  />
                </IonItem>
                <IonItem>
                  <IonLabel position="stacked">Minimum Tenure (years)</IonLabel>
                  <IonInput
                    type="number"
                    value={editFormData.minimumTenure?.toString() || ''}
                    onIonInput={(e) => handleEditFormChange('minimumTenure', parseInt(e.detail.value!) || 0)}
                    placeholder="0"
                  />
                </IonItem>
                <IonItem>
                  <IonLabel position="stacked">Maximum Tenure (years)</IonLabel>
                  <IonInput
                    type="number"
                    value={editFormData.maximumTenure?.toString() || ''}
                    onIonInput={(e) => handleEditFormChange('maximumTenure', parseInt(e.detail.value!) || 0)}
                    placeholder="0"
                  />
                </IonItem>
              </div>

              {/* Status and Priority */}
              <div className="edit-section">
                <h3>Status & Priority</h3>
                <IonItem>
                  <IonLabel position="stacked">Status</IonLabel>
                  <IonSelect
                    value={editFormData.status || ''}
                    onIonChange={(e) => handleEditFormChange('status', e.detail.value)}
                    placeholder="Select status"
                  >
                    {uniqueStatuses.map(status => (
                      <IonSelectOption key={status} value={status}>
                        {status.replace('_', ' ')}
                      </IonSelectOption>
                    ))}
                  </IonSelect>
                </IonItem>
                <IonItem>
                  <IonLabel position="stacked">Priority</IonLabel>
                  <IonSelect
                    value={editFormData.priority || ''}
                    onIonChange={(e) => handleEditFormChange('priority', e.detail.value)}
                    placeholder="Select priority"
                  >
                    {uniquePriorities.map(priority => (
                      <IonSelectOption key={priority} value={priority}>{priority}</IonSelectOption>
                    ))}
                  </IonSelect>
                </IonItem>
              </div>

              {/* Action Buttons */}
              <div className="edit-actions">
                <IonButton fill="outline" onClick={handleCancelEdit}>
                  <IonIcon icon={closeOutline} slot="start" />
                  Cancel
                </IonButton>
                <IonButton fill="solid" onClick={handleSaveEdit}>
                  <IonIcon icon={checkmarkOutline} slot="start" />
                  Save Changes
                </IonButton>
              </div>
            </div>
          )}
        </IonContent>
      </IonModal>

      {/* Toast for notifications */}
      <IonToast
        isOpen={showToast}
        onDidDismiss={() => setShowToast(false)}
        message={toastMessage}
        duration={3000}
        position="bottom"
      />
    </IonPage>
  );
};

export default Schemes;
