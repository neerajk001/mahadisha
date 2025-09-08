import React, { useState, useMemo } from 'react';
import {
  IonPage, IonContent, IonSplitPane, IonHeader, IonToolbar, IonTitle,
  IonButton, IonIcon, IonCard, IonCardContent, IonCardHeader, IonCardTitle,
  IonGrid, IonRow, IonCol, IonSpinner, IonAlert, IonToast, IonSearchbar
} from '@ionic/react';
import { 
  addOutline, createOutline, trashOutline, searchOutline,
  chevronBackOutline, chevronForwardOutline
} from 'ionicons/icons';
import Sidebar from '../admin/components/sidebar/Sidebar';
import DashboardHeader from '../admin/components/header/DashboardHeader';
import { mockDataService } from '../services/api';
import type { AccessMappingData } from '../types';
import './AccessMapping.css';

const AccessMapping: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [selectedMappingId, setSelectedMappingId] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const itemsPerPage = 5;

  // Get access mapping data from mock service
  const allMappings = mockDataService.getAccessMappingData();
  
  // Filter mappings based on search query
  const filteredMappings = useMemo(() => {
    return allMappings.filter(mapping =>
      mapping.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mapping.navbarAccess.some(access => access.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [allMappings, searchQuery]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredMappings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentMappings = filteredMappings.slice(startIndex, endIndex);

  const handleAddMapping = () => {
    setToastMessage('Add new access mapping functionality will be implemented');
    setShowToast(true);
  };

  const handleEdit = (mappingId: string) => {
    setToastMessage('Edit functionality will be implemented');
    setShowToast(true);
  };

  const handleDelete = (mappingId: string) => {
    setSelectedMappingId(mappingId);
    setShowDeleteAlert(true);
  };

  const confirmDelete = () => {
    if (selectedMappingId) {
      setToastMessage(`Delete access mapping ${selectedMappingId} functionality will be implemented`);
      setShowToast(true);
      setSelectedMappingId(null);
    }
    setShowDeleteAlert(false);
  };

  const cancelDelete = () => {
    setSelectedMappingId(null);
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

  const renderNavbarAccess = (accessList: string[]) => {
    return accessList.map((access, index) => (
      <span key={index} className="navbar-access-item">
        {access}
        {index < accessList.length - 1 && ', '}
      </span>
    ));
  };

  return (
    <IonPage>
      <IonSplitPane contentId="dashboard-content">
        <Sidebar />
        <div className="main-content" id="dashboard-content">
          <DashboardHeader />
          
          <IonContent className="access-mapping-content">
            <div className="mappings-container">
              {/* Header Section */}
              <div className="mappings-header">
                <h1>Access Mapping</h1>
                <p>Manage role-based access to navigation and pages</p>
              </div>

              {/* Search and Actions */}
              <div className="mappings-actions">
                <IonSearchbar
                  value={searchQuery}
                  onIonChange={(e) => setSearchQuery(e.detail.value!)}
                  placeholder="Search by role or navbar access..."
                  className="mappings-search"
                />
                <IonButton 
                  fill="solid" 
                  className="add-mapping-button"
                  onClick={handleAddMapping}
                >
                  <IonIcon icon={addOutline} />
                  Add Mapping
                </IonButton>
              </div>

              {/* Mappings Table */}
              <IonCard className="mappings-table-card">
                <IonCardContent className="table-container">
                  <table className="mappings-table">
                    <thead>
                      <tr>
                        <th>
                          <div className="table-header">
                            <span>Role</span>
                            <IonIcon icon={searchOutline} className="filter-icon" />
                          </div>
                        </th>
                        <th>
                          <div className="table-header">
                            <span>Page Access</span>
                          </div>
                        </th>
                        <th>
                          <div className="table-header">
                            <span>Navbar Access</span>
                          </div>
                        </th>
                        <th>
                          <div className="table-header">
                            <span>Actions</span>
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentMappings.map((mapping, index) => (
                        <tr key={mapping.id} className={index % 2 === 0 ? 'even-row' : 'odd-row'}>
                          <td className="role-cell">
                            <span className="role-name">{mapping.role}</span>
                          </td>
                          <td className="page-access-cell">
                            <span className="page-access-text">{mapping.pageAccess || 'N/A'}</span>
                          </td>
                          <td className="navbar-access-cell">
                            <div className="navbar-access">
                              {renderNavbarAccess(mapping.navbarAccess)}
                            </div>
                          </td>
                          <td className="actions-cell">
                            <div className="action-buttons">
                              <IonButton 
                                fill="clear" 
                                size="small" 
                                className="edit-button"
                                onClick={() => handleEdit(mapping.id)}
                              >
                                <IonIcon icon={createOutline} />
                              </IonButton>
                              <IonButton 
                                fill="clear" 
                                size="small" 
                                className="delete-button"
                                onClick={() => handleDelete(mapping.id)}
                              >
                                <IonIcon icon={trashOutline} />
                              </IonButton>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </IonCardContent>
              </IonCard>

              {/* Pagination */}
              <div className="pagination-container">
                <div className="pagination-info">
                  <p>
                    Showing {startIndex + 1} to {Math.min(endIndex, filteredMappings.length)} of {filteredMappings.length} mappings
                  </p>
                </div>
                <div className="pagination-controls">
                  <IonButton 
                    fill="clear" 
                    disabled={currentPage === 1}
                    onClick={handlePreviousPage}
                    className="pagination-button"
                  >
                    <IonIcon icon={chevronBackOutline} />
                    Previous
                  </IonButton>
                  <span className="page-info">
                    Page {currentPage} of {totalPages}
                  </span>
                  <IonButton 
                    fill="clear" 
                    disabled={currentPage === totalPages}
                    onClick={handleNextPage}
                    className="pagination-button"
                  >
                    Next
                    <IonIcon icon={chevronForwardOutline} />
                  </IonButton>
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
        message="Are you sure you want to delete this access mapping? This action cannot be undone."
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

export default AccessMapping;
