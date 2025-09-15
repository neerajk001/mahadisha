import React, { useState, useMemo } from 'react';
import {
  IonPage, IonContent, IonSplitPane, IonHeader, IonToolbar, IonTitle,
  IonSearchbar, IonButton, IonIcon, IonSelect, IonSelectOption, IonGrid, IonRow, IonCol,
  IonSpinner, IonAlert, IonToast, IonPopover, IonList, IonItem, IonLabel
} from '@ionic/react';
import { 
  chevronBackOutline, chevronForwardOutline, searchOutline, 
  createOutline, trashOutline, chevronDownOutline
} from 'ionicons/icons';
import Sidebar from '../admin/components/sidebar/Sidebar';
import DashboardHeader from '../admin/components/header/DashboardHeader';
import SchemeCard from '../components/schemes/SchemeCard';
import { mockDataService } from '../services/api';
import type { Scheme } from '../types';
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
  
  // Searchable dropdown states
  const [showTypePopover, setShowTypePopover] = useState(false);
  const [showSortPopover, setShowSortPopover] = useState(false);
  const [typeSearchQuery, setTypeSearchQuery] = useState('');
  const [sortSearchQuery, setSortSearchQuery] = useState('');
  const [schemeSearchQuery, setSchemeSearchQuery] = useState('');

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
        scheme.marathiName.toLowerCase().includes(searchQuery.toLowerCase())
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

  // Filtered options for searchable dropdowns
  const filteredTypes = useMemo(() => {
    if (!typeSearchQuery) return schemeTypes;
    return schemeTypes.filter(type => 
      type.toLowerCase().includes(typeSearchQuery.toLowerCase())
    );
  }, [schemeTypes, typeSearchQuery]);

  const sortOptions = [
    { value: 'name', label: 'Name' },
    { value: 'minLoan', label: 'Min Loan' },
    { value: 'maxLoan', label: 'Max Loan' },
    { value: 'subsidy', label: 'Subsidy' }
  ];

  const filteredSortOptions = useMemo(() => {
    if (!sortSearchQuery) return sortOptions;
    return sortOptions.filter(option => 
      option.label.toLowerCase().includes(sortSearchQuery.toLowerCase())
    );
  }, [sortSearchQuery]);

  // Filtered schemes for search within dropdown
  const filteredSchemesForSearch = useMemo(() => {
    if (!schemeSearchQuery) return allSchemes.slice(0, 10); // Show first 10 schemes
    return allSchemes.filter(scheme => 
      scheme.name.toLowerCase().includes(schemeSearchQuery.toLowerCase()) ||
      scheme.marathiName.toLowerCase().includes(schemeSearchQuery.toLowerCase()) ||
      scheme.type.toLowerCase().includes(schemeSearchQuery.toLowerCase())
    ).slice(0, 10); // Limit to 10 results
  }, [allSchemes, schemeSearchQuery]);

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

  // Handler functions for searchable dropdowns
  const handleTypeSelect = (type: string) => {
    setTypeFilter(type);
    setShowTypePopover(false);
    setTypeSearchQuery('');
  };

  const handleSortSelect = (sortValue: string) => {
    handleSortChange(sortValue);
    setShowSortPopover(false);
    setSortSearchQuery('');
  };

  const getTypeDisplayValue = () => {
    return typeFilter === 'all' ? 'All' : typeFilter;
  };

  const getSortDisplayValue = () => {
    const option = sortOptions.find(opt => opt.value === sortBy);
    return option ? option.label : 'Name';
  };

  const handleSchemeSelect = (schemeId: string) => {
    // Navigate to scheme details or apply filter
    setToastMessage(`Selected scheme: ${schemeId}`);
    setShowToast(true);
    setShowTypePopover(false);
    setSchemeSearchQuery('');
  };

  return (
    <IonPage>
      <IonSplitPane contentId="dashboard-content">
        <Sidebar />
        <div className="main-content" id="dashboard-content">
          <DashboardHeader />
          
          <IonContent className="schemes-content">
            <div className="schemes-container">
              {/* Navigation Bar */}
              <div className="schemes-navigation">
                <IonButton 
                  fill="clear" 
                  disabled={currentPage === 1}
                  onClick={handlePreviousPage}
                  className="nav-button"
                >
                  <IonIcon icon={chevronBackOutline} />
                  Previous
                </IonButton>

                <IonSearchbar
                  value={searchQuery}
                  onIonChange={(e) => setSearchQuery(e.detail.value!)}
                  placeholder="Search by name or Marathi name"
                  className="schemes-search"
                />

                <IonButton 
                  fill="clear" 
                  disabled={currentPage === totalPages}
                  onClick={handleNextPage}
                  className="nav-button"
                >
                  Next
                  <IonIcon icon={chevronForwardOutline} />
                </IonButton>
              </div>

              {/* Filters and Sort */}
              <div className="schemes-filters">
                <div className="filter-group">
                  <label className="filter-label">Type</label>
                  <IonButton
                    id="type-popover-trigger"
                    fill="outline"
                    className="searchable-select"
                    expand="block"
                    onClick={() => setShowTypePopover(true)}
                  >
                    {getTypeDisplayValue()}
                    <IonIcon icon={chevronDownOutline} slot="end" />
                  </IonButton>
                  <IonPopover
                    trigger="type-popover-trigger"
                    isOpen={showTypePopover}
                    onDidDismiss={() => {
                      setShowTypePopover(false);
                      setTypeSearchQuery('');
                    }}
                    className="searchable-popover"
                  >
                    <div className="popover-content">
                      <IonSearchbar
                        value={typeSearchQuery}
                        onIonInput={(e) => setTypeSearchQuery(e.detail.value!)}
                        placeholder="Search scheme types..."
                        className="popover-search"
                      />
                      <IonList className="popover-list">
                        <IonItem 
                          button 
                          onClick={() => handleTypeSelect('all')}
                          className={typeFilter === 'all' ? 'selected-item' : ''}
                        >
                          <IonLabel>All Types</IonLabel>
                        </IonItem>
                        {filteredTypes.map(type => (
                          <IonItem 
                            key={type} 
                            button 
                            onClick={() => handleTypeSelect(type)}
                            className={typeFilter === type ? 'selected-item' : ''}
                          >
                            <IonLabel>{type}</IonLabel>
                          </IonItem>
                        ))}
                        {filteredTypes.length === 0 && typeSearchQuery && (
                          <IonItem>
                            <IonLabel>No types found</IonLabel>
                          </IonItem>
                        )}
                      </IonList>
                      
                      {/* Search All Schemes Section */}
                      <div className="scheme-search-section">
                        <div className="section-divider"></div>
                        <IonSearchbar
                          value={schemeSearchQuery}
                          onIonInput={(e) => setSchemeSearchQuery(e.detail.value!)}
                          placeholder="Search all schemes..."
                          className="popover-search"
                        />
                        <IonList className="popover-list">
                          {filteredSchemesForSearch.map(scheme => (
                            <IonItem 
                              key={scheme.id} 
                              button 
                              onClick={() => handleSchemeSelect(scheme.id)}
                            >
                              <IonLabel>
                                <h3>{scheme.name}</h3>
                                <p>{scheme.type} • {scheme.marathiName}</p>
                              </IonLabel>
                            </IonItem>
                          ))}
                          {filteredSchemesForSearch.length === 0 && schemeSearchQuery && (
                            <IonItem>
                              <IonLabel>No schemes found</IonLabel>
                            </IonItem>
                          )}
                        </IonList>
                      </div>
                    </div>
                  </IonPopover>
                </div>

                <div className="filter-group">
                  <label className="filter-label">Sort By</label>
                  <IonButton
                    id="sort-popover-trigger"
                    fill="outline"
                    className="searchable-select"
                    expand="block"
                    onClick={() => setShowSortPopover(true)}
                  >
                    {getSortDisplayValue()}
                    <IonIcon icon={chevronDownOutline} slot="end" />
                  </IonButton>
                  <IonPopover
                    trigger="sort-popover-trigger"
                    isOpen={showSortPopover}
                    onDidDismiss={() => {
                      setShowSortPopover(false);
                      setSortSearchQuery('');
                    }}
                    className="searchable-popover"
                  >
                    <div className="popover-content">
                      <IonSearchbar
                        value={sortSearchQuery}
                        onIonInput={(e) => setSortSearchQuery(e.detail.value!)}
                        placeholder="Search sort options..."
                        className="popover-search"
                      />
                      <IonList className="popover-list">
                        {filteredSortOptions.map(option => (
                          <IonItem 
                            key={option.value} 
                            button 
                            onClick={() => handleSortSelect(option.value)}
                            className={sortBy === option.value ? 'selected-item' : ''}
                          >
                            <IonLabel>{option.label}</IonLabel>
                          </IonItem>
                        ))}
                        {filteredSortOptions.length === 0 && sortSearchQuery && (
                          <IonItem>
                            <IonLabel>No options found</IonLabel>
                          </IonItem>
                        )}
                      </IonList>
                    </div>
                  </IonPopover>
                </div>

                <div className="filter-group">
                  <label className="filter-label">Order</label>
                  <IonButton
                    fill="outline"
                    size="small"
                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                    className="sort-button"
                  >
                    {sortOrder === 'asc' ? '↑ Asc' : '↓ Desc'}
                  </IonButton>
                </div>
              </div>

              {/* Schemes Grid */}
              <div className="schemes-grid">
                <IonGrid>
                  <IonRow>
                    {currentSchemes.map((scheme) => (
                      <IonCol size="12" size-md="6" size-lg="4" key={scheme.id}>
                        <SchemeCard
                          scheme={scheme}
                          onApply={handleApply}
                          onEdit={handleEdit}
                          onDelete={handleDelete}
                        />
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
