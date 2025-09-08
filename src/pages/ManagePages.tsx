import React, { useState, useMemo } from 'react';
import {
  IonPage, IonContent, IonSplitPane, IonHeader, IonToolbar, IonTitle,
  IonButton, IonIcon, IonCard, IonCardContent, IonCardHeader, IonCardTitle,
  IonGrid, IonRow, IonCol, IonSpinner, IonAlert, IonToast, IonSearchbar
} from '@ionic/react';
import { 
  addOutline, createOutline, trashOutline, searchOutline,
  keyOutline, homeOutline, gitBranchOutline, shieldOutline,
  shuffleOutline, barChartOutline, fileTrayOutline, accessibilityOutline,
  chevronBackOutline, chevronForwardOutline
} from 'ionicons/icons';
import Sidebar from '../admin/components/sidebar/Sidebar';
import DashboardHeader from '../admin/components/header/DashboardHeader';
import { mockDataService } from '../services/api';
import type { PageData } from '../types';
import './ManagePages.css';

const ManagePages: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [selectedPageId, setSelectedPageId] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const itemsPerPage = 5;

  // Get page data from mock service
  const allPages = mockDataService.getPageData();
  
  // Filter pages based on search query
  const filteredPages = useMemo(() => {
    return allPages.filter(page =>
      page.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      page.url.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [allPages, searchQuery]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredPages.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPages = filteredPages.slice(startIndex, endIndex);

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'keyOutline': return keyOutline;
      case 'homeOutline': return homeOutline;
      case 'gitBranchOutline': return gitBranchOutline;
      case 'shieldOutline': return shieldOutline;
      case 'shuffleOutline': return shuffleOutline;
      case 'barChartOutline': return barChartOutline;
      case 'fileTrayOutline': return fileTrayOutline;
      case 'accessibilityOutline': return accessibilityOutline;
      default: return homeOutline;
    }
  };

  const handleAddPage = () => {
    setToastMessage('Add new page functionality will be implemented');
    setShowToast(true);
  };

  const handleEdit = (pageId: string) => {
    setToastMessage(`Edit page ${pageId} functionality will be implemented`);
    setShowToast(true);
  };

  const handleDelete = (pageId: string) => {
    setSelectedPageId(pageId);
    setShowDeleteAlert(true);
  };

  const confirmDelete = () => {
    if (selectedPageId) {
      setToastMessage(`Delete page ${selectedPageId} functionality will be implemented`);
      setShowToast(true);
      setSelectedPageId(null);
    }
    setShowDeleteAlert(false);
  };

  const cancelDelete = () => {
    setSelectedPageId(null);
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

  return (
    <IonPage>
      <IonSplitPane contentId="dashboard-content">
        <Sidebar />
        <div className="main-content" id="dashboard-content">
          <DashboardHeader />
          
          <IonContent className="manage-pages-content">
            <div className="pages-container">
              {/* Header Section */}
              <div className="pages-header">
                <h1>Manage Pages</h1>
                <p>Configure and manage system pages, routes, and navigation</p>
              </div>

              {/* Search and Actions */}
              <div className="pages-actions">
                <IonSearchbar
                  value={searchQuery}
                  onIonChange={(e) => setSearchQuery(e.detail.value!)}
                  placeholder="Search pages by name or URL..."
                  className="pages-search"
                />
                <IonButton 
                  fill="solid" 
                  className="add-page-button"
                  onClick={handleAddPage}
                >
                  <IonIcon icon={addOutline} />
                  Add New Page
                </IonButton>
              </div>

              {/* Pages Table */}
              <IonCard className="pages-table-card">
                <IonCardContent className="table-container">
                  <table className="pages-table">
                    <thead>
                      <tr>
                        <th>
                          <div className="table-header">
                            <span>Name</span>
                            <IonIcon icon={searchOutline} className="filter-icon" />
                          </div>
                        </th>
                        <th>
                          <div className="table-header">
                            <span>URL</span>
                            <IonIcon icon={searchOutline} className="filter-icon" />
                          </div>
                        </th>
                        <th>
                          <div className="table-header">
                            <span>Icon</span>
                            <IonIcon icon={searchOutline} className="filter-icon" />
                          </div>
                        </th>
                        <th>
                          <div className="table-header">
                            <span>Actions</span>
                            <IonIcon icon={searchOutline} className="filter-icon" />
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentPages.map((page, index) => (
                        <tr key={page.id} className={index % 2 === 0 ? 'even-row' : 'odd-row'}>
                          <td className="name-cell">
                            <div className="page-name">
                              <IonIcon icon={getIconComponent(page.icon)} className="page-icon" />
                              <span>{page.name}</span>
                            </div>
                          </td>
                          <td className="url-cell">
                            <code className="url-code">{page.url}</code>
                          </td>
                          <td className="icon-cell">
                            <div className="icon-display">
                              <IonIcon icon={getIconComponent(page.icon)} className="display-icon" />
                              <span className="icon-name">{page.icon}</span>
                            </div>
                          </td>
                          <td className="actions-cell">
                            <div className="action-buttons">
                              <IonButton 
                                fill="clear" 
                                size="small" 
                                className="edit-button"
                                onClick={() => handleEdit(page.id)}
                              >
                                <IonIcon icon={createOutline} />
                              </IonButton>
                              <IonButton 
                                fill="clear" 
                                size="small" 
                                className="delete-button"
                                onClick={() => handleDelete(page.id)}
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
                    Showing {startIndex + 1} to {Math.min(endIndex, filteredPages.length)} of {filteredPages.length} pages
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
        message="Are you sure you want to delete this page? This action cannot be undone."
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

export default ManagePages;
