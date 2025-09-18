import React, { useState, useMemo } from 'react';
import {
  IonPage, IonContent, IonSplitPane, IonHeader, IonToolbar, IonTitle,
  IonButton, IonIcon, IonCard, IonCardContent, IonCardHeader, IonCardTitle,
  IonGrid, IonRow, IonCol, IonSpinner, IonAlert, IonToast, IonSearchbar,
  IonModal, IonItem, IonLabel, IonInput, IonTextarea, IonSelect, IonSelectOption,
  IonButtons
} from '@ionic/react';
import { 
  addOutline, createOutline, trashOutline, searchOutline,
  chevronBackOutline, chevronForwardOutline, closeOutline, checkmarkOutline,
  eyeOutline
} from 'ionicons/icons';
import Sidebar from '../admin/components/sidebar/Sidebar';
import DashboardHeader from '../admin/components/header/DashboardHeader';
import ActionDropdown from '../admin/components/common/ActionDropdown';
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
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewingRole, setViewingRole] = useState<RolesData | null>(null);
  const [editingRole, setEditingRole] = useState<RolesData | null>(null);
  const [addForm, setAddForm] = useState({
    name: ''
  });
  const [editForm, setEditForm] = useState({
    name: ''
  });
  
  const itemsPerPage = 5;

  // State for managing roles data - EXACTLY LIKE MANAGEPAGES
  const [allRoles, setAllRoles] = useState<RolesData[]>(() => mockDataService.getRolesData());
  
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
    setAddForm({ name: '' });
    setShowAddModal(true);
  };

  const handleSaveAdd = () => {
    if (!addForm.name.trim()) {
      setToastMessage('Please enter a role name');
      setShowToast(true);
      return;
    }

    // Check if role name already exists
    if (allRoles.some(role => role.name.toLowerCase() === addForm.name.toLowerCase())) {
      setToastMessage('Role name already exists. Please choose a different name.');
      setShowToast(true);
      return;
    }
    
    // Create new role
    const newRole: RolesData = {
      id: `role_${Date.now()}`,
      name: addForm.name.trim(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Add the new role to the state - EXACTLY LIKE MANAGEPAGES
    setAllRoles(prevRoles => [...prevRoles, newRole]);
    
    setToastMessage(`Role "${addForm.name}" added successfully`);
    setShowToast(true);
    setShowAddModal(false);
    setAddForm({ name: '' });
  };

  const handleCloseAdd = () => {
    setShowAddModal(false);
    setAddForm({ name: '' });
  };

  const handleEdit = (roleId: string) => {
    const role = allRoles.find(r => r.id === roleId);
    if (role) {
      setEditingRole(role);
      setEditForm({ name: role.name });
      setShowEditModal(true);
    }
  };

  const handleSaveEdit = () => {
    if (!editForm.name.trim()) {
      setToastMessage('Please enter a role name');
      setShowToast(true);
      return;
    }

    if (!editingRole) return;

    // Check if role name already exists (excluding current item)
    if (allRoles.some(role => 
      role.id !== editingRole.id && 
      role.name.toLowerCase() === editForm.name.toLowerCase()
    )) {
      setToastMessage('Role name already exists. Please choose a different name.');
      setShowToast(true);
      return;
    }
    
    // Update the role in the state - EXACTLY LIKE MANAGEPAGES
    setAllRoles(prevRoles => 
      prevRoles.map(role => 
        role.id === editingRole.id 
          ? { ...role, name: editForm.name.trim(), updatedAt: new Date().toISOString() }
          : role
      )
    );
    
    setToastMessage(`Role "${editForm.name}" updated successfully`);
    setShowToast(true);
    setShowEditModal(false);
    setEditingRole(null);
    setEditForm({ name: '' });
  };

  const handleCloseEdit = () => {
    setShowEditModal(false);
    setEditingRole(null);
    setEditForm({ name: '' });
  };

  const handleView = (roleId: string) => {
    const role = allRoles.find(r => r.id === roleId);
    if (role) {
      setViewingRole(role);
      setShowViewModal(true);
    }
  };

  const handleCloseView = () => {
    setShowViewModal(false);
    setViewingRole(null);
  };

  const handleDelete = (roleId: string) => {
    setSelectedRoleId(roleId);
    setShowDeleteAlert(true);
  };

  const confirmDelete = () => {
    if (selectedRoleId) {
      // Actually remove the role from the state - EXACTLY LIKE MANAGEPAGES
      setAllRoles(prevRoles => prevRoles.filter(role => role.id !== selectedRoleId));
      
      const roleToDelete = allRoles.find(role => role.id === selectedRoleId);
      setToastMessage(`Role "${roleToDelete?.name || selectedRoleId}" deleted successfully`);
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
                  + ADD ROLE
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
                            <ActionDropdown
                              itemId={role.id}
                              onView={() => handleView(role.id)}
                              onEdit={() => handleEdit(role.id)}
                              onDelete={() => handleDelete(role.id)}
                              showView={true}
                              size="small"
                            />
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

      {/* Add Role Modal */}
      <IonModal isOpen={showAddModal} onDidDismiss={handleCloseAdd}>
        <IonContent className="add-role-modal">
          <div className="modal-header">
            <h2>Add New Role</h2>
            <IonButton fill="clear" onClick={handleCloseAdd}>
              <IonIcon icon={closeOutline} />
            </IonButton>
          </div>
          
          <div className="modal-content">
            <div className="form-group">
              <IonLabel className="form-label">Role Name *</IonLabel>
              <IonInput
                value={addForm.name}
                onIonChange={(e) => setAddForm(prev => ({ ...prev, name: e.detail.value! }))}
                placeholder="Enter role name"
                className="form-input"
              />
            </div>
          </div>
          
          <div className="modal-actions">
            <IonButton 
              fill="solid"
              onClick={handleSaveAdd}
              className="add-button"
            >
              <IonIcon icon={checkmarkOutline} slot="start" />
              ADD ROLE
            </IonButton>
            <IonButton 
              fill="outline"
              onClick={handleCloseAdd}
              className="cancel-button"
            >
              CANCEL
            </IonButton>
          </div>
        </IonContent>
      </IonModal>

      {/* Edit Role Modal */}
      <IonModal isOpen={showEditModal} onDidDismiss={handleCloseEdit}>
        <IonContent className="add-role-modal">
          <div className="modal-header">
            <h2>Edit Role</h2>
            <IonButton fill="clear" onClick={handleCloseEdit}>
              <IonIcon icon={closeOutline} />
            </IonButton>
          </div>
          
          <div className="modal-content">
            <div className="form-group">
              <IonLabel className="form-label">Role Name *</IonLabel>
              <IonInput
                value={editForm.name}
                onIonChange={(e) => setEditForm(prev => ({ ...prev, name: e.detail.value! }))}
                placeholder="Enter role name"
                className="form-input"
              />
            </div>
          </div>
          
          <div className="modal-actions">
            <IonButton 
              fill="solid"
              onClick={handleSaveEdit}
              className="add-button"
            >
              <IonIcon icon={checkmarkOutline} slot="start" />
              UPDATE ROLE
            </IonButton>
            <IonButton 
              fill="outline"
              onClick={handleCloseEdit}
              className="cancel-button"
            >
              CANCEL
            </IonButton>
          </div>
        </IonContent>
      </IonModal>

      {/* View Role Modal */}
      <IonModal isOpen={showViewModal} onDidDismiss={handleCloseView}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Role Details</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={handleCloseView}>
                <IonIcon icon={closeOutline} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="view-modal-content">
          {viewingRole && (
            <div>
              <IonItem>
                <IonLabel>
                  <h2>Role Name</h2>
                  <p>{viewingRole.name}</p>
                </IonLabel>
              </IonItem>
              <IonItem>
                <IonLabel>
                  <h2>Created At</h2>
                  <p>{new Date(viewingRole.createdAt).toLocaleDateString()}</p>
                </IonLabel>
              </IonItem>
              <IonItem>
                <IonLabel>
                  <h2>Updated At</h2>
                  <p>{new Date(viewingRole.updatedAt).toLocaleDateString()}</p>
                </IonLabel>
              </IonItem>
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

export default Roles;
