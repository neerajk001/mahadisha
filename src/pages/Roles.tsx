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
import type { RolesData } from '../types';
import './Roles.css';

const Roles: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const itemsPerPage = 5;

  // Get roles data from mock service
  const allRoles = mockDataService.getRolesData();
  
  // Filter roles based on search query
  const filteredRoles = useMemo(() => {
    return allRoles.filter(role =>
      role.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [allRoles, searchQuery]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredRoles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentRoles = filteredRoles.slice(startIndex, endIndex);

  const handleAddRole = () => {
    setToastMessage('Add new role functionality will be implemented');
    setShowToast(true);
  };

  const handleEdit = (roleId: string) => {
    setToastMessage('Edit functionality will be implemented');
    setShowToast(true);
  };

  const handleDelete = (roleId: string) => {
    setSelectedRoleId(roleId);
    setShowDeleteAlert(true);
  };

  const confirmDelete = () => {
    if (selectedRoleId) {
      setToastMessage(`Delete role ${selectedRoleId} functionality will be implemented`);
      setShowToast(true);
      setSelectedRoleId(null);
    }
    setShowDeleteAlert(false);
  };

  const cancelDelete = () => {
    setSelectedRoleId(null);
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
          
          <IonContent className="roles-content">
            <div className="roles-container">
              {/* Header Section */}
              <div className="roles-header">
                <h1>Roles</h1>
                <p>Manage district roles and their permissions</p>
              </div>

              {/* Search and Actions */}
              <div className="roles-actions">
                <IonSearchbar
                  value={searchQuery}
                  onIonChange={(e) => setSearchQuery(e.detail.value!)}
                  placeholder="Search roles by name..."
                  className="roles-search"
                />
                <IonButton 
                  fill="solid" 
                  className="add-role-button"
                  onClick={handleAddRole}
                >
                  <IonIcon icon={addOutline} />
                  Add Role
                </IonButton>
              </div>

              {/* Roles Table */}
              <IonCard className="roles-table-card">
                <IonCardContent className="table-container">
                  <table className="roles-table">
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
                            <span>Actions</span>
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentRoles.map((role, index) => (
                        <tr key={role.id} className={index % 2 === 0 ? 'even-row' : 'odd-row'}>
                          <td className="role-name-cell">
                            <span className="role-name">{role.name}</span>
                          </td>
                          <td className="actions-cell">
                            <div className="action-buttons">
                              <IonButton 
                                fill="clear" 
                                size="small" 
                                className="edit-button"
                                onClick={() => handleEdit(role.id)}
                              >
                                <IonIcon icon={createOutline} />
                              </IonButton>
                              <IonButton 
                                fill="clear" 
                                size="small" 
                                className="delete-button"
                                onClick={() => handleDelete(role.id)}
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
                    Showing {startIndex + 1} to {Math.min(endIndex, filteredRoles.length)} of {filteredRoles.length} roles
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
        message="Are you sure you want to delete this role? This action cannot be undone."
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

export default Roles;
