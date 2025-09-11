import React, { useState, useMemo } from 'react';
import {
  IonPage, IonContent, IonSplitPane, IonHeader, IonToolbar, IonTitle,
  IonSearchbar, IonButton, IonButtons, IonIcon, IonSelect, IonSelectOption, IonGrid, IonRow, IonCol,
  IonSpinner, IonAlert, IonToast, IonCard, IonCardContent, IonCardHeader, IonCardTitle,
  IonModal, IonCheckbox, IonRange, IonDatetime, IonBadge, IonChip, IonText,
  IonPopover, IonList, IonItem, IonLabel, IonToggle, IonTextarea, IonInput
} from '@ionic/react';
import { 
  chevronBackOutline, chevronForwardOutline, searchOutline, 
  createOutline, trashOutline, arrowUpOutline, arrowDownOutline,
  filterOutline, closeOutline, checkmarkOutline, eyeOutline,
  documentOutline, informationCircleOutline, starOutline, timeOutline,
  peopleOutline, cashOutline, calendarOutline, refreshOutline,
  gridOutline, appsOutline
} from 'ionicons/icons';
import Sidebar from '../components/sidebar/Sidebar';
import DashboardHeader from '../components/header/DashboardHeader';
import { mockDataService } from '../../services/api';
import type { Scheme, SchemeFilters } from '../../types';
import './Schemes.css';

const Schemes: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
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
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

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

    // Apply type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(scheme => scheme.type === typeFilter);
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
  }, [allSchemes, searchQuery, typeFilter, sortBy, sortOrder]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredAndSortedSchemes.length / cardsPerPage);
  const startIndex = (currentPage - 1) * cardsPerPage;
  const endIndex = startIndex + cardsPerPage;
  const currentSchemes = filteredAndSortedSchemes.slice(startIndex, endIndex);

  // Get unique types for filter dropdown
  const schemeTypes = useMemo(() => {
    const types = Array.from(new Set(allSchemes.map(scheme => scheme.type)));
    return types;
  }, [allSchemes]);

  const handleApply = (schemeId: string) => {
    setToastMessage('Apply functionality will be implemented');
    setShowToast(true);
  };

  const handleEdit = (schemeId: string) => {
    setToastMessage('Edit functionality will be implemented');
    setShowToast(true);
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

  const handleSortChange = (newSortBy: string) => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('asc');
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

  return (
    <IonPage>
      <IonSplitPane contentId="dashboard-content" when="md">
        <Sidebar />
        <div className="main-content" id="dashboard-content">
          <DashboardHeader />
          
          <IonContent className="schemes-content">
            <div className="schemes-container">
              {/* Navigation Bar */}
              <div className="schemes-navigation">
                <IonButton 
                  fill="solid" 
                  disabled={currentPage === 1}
                  onClick={handlePreviousPage}
                  className="nav-button prev-button"
                >
                  <IonIcon icon={chevronBackOutline} />
                  Previous
                </IonButton>

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
                  Filters
                  {Object.keys(advancedFilters).length > 0 && (
                    <IonBadge color="primary" className="filter-badge">
                      {Object.keys(advancedFilters).length}
                    </IonBadge>
                  )}
                </IonButton>

                <IonButton 
                  fill="outline"
                  onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                  className="view-toggle-button"
                >
                  <IonIcon icon={viewMode === 'grid' ? documentOutline : appsOutline} />
                  {viewMode === 'grid' ? 'List' : 'Grid'}
                </IonButton>

                <IonButton 
                  fill="solid" 
                  disabled={currentPage === totalPages}
                  onClick={handleNextPage}
                  className="nav-button next-button"
                >
                  Next
                  <IonIcon icon={chevronForwardOutline} />
                </IonButton>
              </div>

              {/* Filters and Sort */}
              <div className="schemes-filters">
                <div className="filter-group">
                  <label className="filter-label">Type</label>
                  <IonSelect
                    value={typeFilter}
                    onIonChange={(e) => setTypeFilter(e.detail.value)}
                    placeholder="All"
                    className="filter-select"
                    interface="popover"
                  >
                    <IonSelectOption value="all">All</IonSelectOption>
                    {schemeTypes.map(type => (
                      <IonSelectOption key={type} value={type}>{type}</IonSelectOption>
                    ))}
                  </IonSelect>
                </div>

                <div className="filter-group">
                  <label className="filter-label">Sort By</label>
                  <IonSelect
                    value={sortBy}
                    onIonChange={(e) => handleSortChange(e.detail.value)}
                    placeholder="Name"
                    className="filter-select"
                    interface="popover"
                  >
                    <IonSelectOption value="name">Name</IonSelectOption>
                    <IonSelectOption value="minLoan">Min Loan</IonSelectOption>
                    <IonSelectOption value="maxLoan">Max Loan</IonSelectOption>
                    <IonSelectOption value="subsidy">Subsidy</IonSelectOption>
                  </IonSelect>
                </div>

                <div className="filter-group">
                  <IonButton
                    fill="outline"
                    size="small"
                    onClick={() => handleSortChange(sortBy)}
                    className="sort-order-button"
                  >
                    <IonIcon icon={sortOrder === 'asc' ? arrowUpOutline : arrowDownOutline} />
                    {sortOrder === 'asc' ? 'Asc' : 'Desc'}
                  </IonButton>
                </div>
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
                      <IonCol size="12" size-md="6" size-lg="4" key={scheme.id}>
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
                              {scheme.tags && scheme.tags.length > 0 && (
                                <div className="detail-row">
                                  <span className="detail-label">Tags:</span>
                                  <div className="scheme-tags">
                                    {scheme.tags.slice(0, 3).map((tag, index) => (
                                      <IonChip key={index} className="scheme-tag">
                                        <IonLabel>{tag}</IonLabel>
                                      </IonChip>
                                    ))}
                                    {scheme.tags.length > 3 && (
                                      <IonChip className="scheme-tag-more">
                                        <IonLabel>+{scheme.tags.length - 3}</IonLabel>
                                      </IonChip>
                                    )}
                                  </div>
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

              {/* Pagination Info */}
              <div className="pagination-info">
                <p>
                  Showing {startIndex + 1} to {Math.min(endIndex, filteredAndSortedSchemes.length)} of {filteredAndSortedSchemes.length} schemes
                </p>
                <p>Page {currentPage} of {totalPages}</p>
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
