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
import Sidebar from '../components/sidebar/Sidebar';
import DashboardHeader from '../components/header/DashboardHeader';
import { mockDataService } from '../../services/api';
import type { BranchData } from '../../types';
import './BranchMaster.css';

const BranchMaster: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [selectedBranchId, setSelectedBranchId] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const itemsPerPage = 5;

  // Get branch data from mock service
  const allBranches = mockDataService.getBranchData();
  
  // Filter branches based on search query
  const filteredBranches = useMemo(() => {
    return allBranches.filter(branch =>
      branch.officeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      branch.officeType.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [allBranches, searchQuery]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredBranches.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentBranches = filteredBranches.slice(startIndex, endIndex);

  const handleAddBranch = () => {
    setToastMessage('Add new branch functionality will be implemented');
    setShowToast(true);
  };

  const handleEdit = (branchId: string) => {
    setToastMessage(`Edit branch ${branchId} functionality will be implemented`);
    setShowToast(true);
  };

  const handleDelete = (branchId: string) => {
    setSelectedBranchId(branchId);
    setShowDeleteAlert(true);
  };

  const confirmDelete = () => {
    if (selectedBranchId) {
      setToastMessage(`Delete branch ${selectedBranchId} functionality will be implemented`);
      setShowToast(true);
      setSelectedBranchId(null);
    }
    setShowDeleteAlert(false);
  };

  const cancelDelete = () => {
    setSelectedBranchId(null);
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
      <IonSplitPane contentId="dashboard-content" when="md">
        <Sidebar />
        <div className="main-content" id="dashboard-content">
          <DashboardHeader />
          
          <IonContent className="branch-master-content">
            <div className="branches-container">
              {/* Header Section */}
              <div className="branches-header">
                <h1>Branch Master</h1>
                <p>Manage office branches and their types</p>
              </div>

              {/* Search and Actions */}
              <div className="branches-actions">
                <IonSearchbar
                  value={searchQuery}
                  onIonChange={(e) => setSearchQuery(e.detail.value!)}
                  placeholder="Search branches by name or type..."
                  className="branches-search"
                />
                <IonButton 
                  fill="solid" 
                  className="add-branch-button"
                  onClick={handleAddBranch}
                >
                  <IonIcon icon={addOutline} />
                  Add Branch
                </IonButton>
              </div>

              {/* Branches Table */}
              <IonCard className="branches-table-card">
                <IonCardContent className="table-container">
                  <table className="branches-table">
                    <thead>
                      <tr>
                        <th>
                          <div className="table-header">
                            <span>Office Name</span>
                            <IonIcon icon={searchOutline} className="filter-icon" />
                          </div>
                        </th>
                        <th>
                          <div className="table-header">
                            <span>Office Type</span>
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
                      {currentBranches.map((branch, index) => (
                        <tr key={branch.id} className={index % 2 === 0 ? 'even-row' : 'odd-row'}>
                          <td className="office-name-cell">
                            <span className="office-name">{branch.officeName}</span>
                          </td>
                          <td className="office-type-cell">
                            <span className="office-type">{branch.officeType}</span>
                          </td>
                          <td className="actions-cell">
                            <div className="action-buttons">
                              <IonButton 
                                fill="clear" 
                                size="small" 
                                className="edit-button"
                                onClick={() => handleEdit(branch.id)}
                              >
                                <IonIcon icon={createOutline} />
                              </IonButton>
                              <IonButton 
                                fill="clear" 
                                size="small" 
                                className="delete-button"
                                onClick={() => handleDelete(branch.id)}
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
                    Showing {startIndex + 1} to {Math.min(endIndex, filteredBranches.length)} of {filteredBranches.length} branches
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
        message="Are you sure you want to delete this branch? This action cannot be undone."
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

export default BranchMaster;
