import React, { useState, useMemo } from 'react';
import {
  IonPage, IonContent, IonSplitPane, IonHeader, IonToolbar, IonTitle,
  IonSearchbar, IonButton, IonIcon, IonSelect, IonSelectOption, IonGrid, IonRow, IonCol,
  IonSpinner, IonAlert, IonToast
} from '@ionic/react';
import { 
  chevronBackOutline, chevronForwardOutline, searchOutline, 
  createOutline, trashOutline
} from 'ionicons/icons';
import Sidebar from '../components/sidebar/Sidebar';
import DashboardHeader from '../components/header/DashboardHeader';
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
                  <IonSelect
                    value={typeFilter}
                    onIonChange={(e) => setTypeFilter(e.detail.value)}
                    placeholder="All"
                    className="filter-select"
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
                  >
                    <IonSelectOption value="name">Name</IonSelectOption>
                    <IonSelectOption value="minLoan">Min Loan</IonSelectOption>
                    <IonSelectOption value="maxLoan">Max Loan</IonSelectOption>
                    <IonSelectOption value="subsidy">Subsidy</IonSelectOption>
                  </IonSelect>
                </div>

                <div className="filter-group">
                  <label className="filter-label">Min Loan</label>
                  <IonButton
                    fill="outline"
                    size="small"
                    onClick={() => handleSortChange('minLoan')}
                    className="sort-button"
                  >
                    {sortBy === 'minLoan' ? (sortOrder === 'asc' ? '↑ Asc' : '↓ Desc') : 'Min Loan'}
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
