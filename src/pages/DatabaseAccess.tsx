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
import { mockDataService } from '../services/api';
import type { DatabaseAccessData } from '../types';
import './DatabaseAccess.css';

const DatabaseAccess: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [selectedAccessId, setSelectedAccessId] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  
  // RBAC modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewingAccess, setViewingAccess] = useState<DatabaseAccessData | null>(null);
  const [editingAccess, setEditingAccess] = useState<DatabaseAccessData | null>(null);
  const [addForm, setAddForm] = useState({
    name: '',
    permissions: ''
  });
  const [editForm, setEditForm] = useState({
    name: '',
    permissions: ''
  });

  const itemsPerPage = 5;

  // Get database access data from mock service
  const allAccess = mockDataService.getDatabaseAccessData();
  
  // Filter access based on search query
  const filteredAccess = useMemo(() => {
    return allAccess.filter(access =>
      access.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      access.permissions.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [allAccess, searchQuery]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredAccess.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentAccess = filteredAccess.slice(startIndex, endIndex);

  // RBAC handlers
  const handleAddAccess = () => {
    setAddForm({ name: '', permissions: '' });
    setShowAddModal(true);
  };

  const handleSaveAdd = () => {
    if (!addForm.name.trim() || !addForm.permissions.trim()) {
      setToastMessage('Please fill in all required fields');
      setShowToast(true);
      return;
    }
    
    setToastMessage('Database access added successfully');
    setShowToast(true);
    setShowAddModal(false);
    setAddForm({ name: '', permissions: '' });
  };

  const handleCloseAdd = () => {
    setShowAddModal(false);
    setAddForm({ name: '', permissions: '' });
  };

  const handleEdit = (accessId: string) => {
    const access = allAccess.find(a => a.id === accessId);
    if (access) {
      setEditingAccess(access);
      setEditForm({ name: access.name, permissions: access.permissions });
      setShowEditModal(true);
    }
  };

  const handleSaveEdit = () => {
    if (!editForm.name.trim() || !editForm.permissions.trim()) {
      setToastMessage('Please fill in all required fields');
      setShowToast(true);
      return;
    }
    
    setToastMessage('Database access updated successfully');
    setShowToast(true);
    setShowEditModal(false);
    setEditingAccess(null);
    setEditForm({ name: '', permissions: '' });
  };

  const handleCloseEdit = () => {
    setShowEditModal(false);
    setEditingAccess(null);
    setEditForm({ name: '', permissions: '' });
  };

  const handleView = (accessId: string) => {
    const access = allAccess.find(a => a.id === accessId);
    if (access) {
      setViewingAccess(access);
      setShowViewModal(true);
    }
  };

  const handleCloseView = () => {
    setShowViewModal(false);
    setViewingAccess(null);
  };

  const handleDelete = (accessId: string) => {
    setSelectedAccessId(accessId);
    setShowDeleteAlert(true);
  };

  const confirmDelete = () => {
    if (selectedAccessId) {
      setToastMessage(`Database access ${selectedAccessId} deleted successfully`);
      setShowToast(true);
      setSelectedAccessId(null);
    }
    setShowDeleteAlert(false);
  };

  const cancelDelete = () => {
    setSelectedAccessId(null);
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
          
          <IonContent className="database-access-content">
            <div className="access-container">
              {/* Header Section */}
              <div className="access-header">
                <h1>Database Access</h1>
                <p>Manage database access permissions and roles</p>
              </div>

              {/* Search and Actions */}
              <div className="access-actions">
                <IonSearchbar
                  value={searchQuery}
                  onIonChange={(e) => setSearchQuery(e.detail.value!)}
                  placeholder="Search by name or permissions..."
                  className="access-search"
                />
                <IonButton 
                  fill="solid" 
                  className="add-access-button"
                  onClick={handleAddAccess}
                >
                  <IonIcon icon={addOutline} />
                  + ADD ACCESS
                </IonButton>
              </div>

              {/* Access Table */}
              <IonCard className="access-table-card">
                <IonCardContent className="table-container">
                  <table className="access-table">
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
                            <span>Permissions</span>
                            <IonIcon icon={searchOutline} className="filter-icon" />
                          </div>
                        </th>
                        <th>
                          <div className="table-header">
                            <span>Action</span>
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentAccess.map((access, index) => (
                        <tr key={access.id} className={index % 2 === 0 ? 'even-row' : 'odd-row'}>
                          <td className="access-name-cell">
                            <span className="access-name">{access.name}</span>
                          </td>
                          <td className="permissions-cell">
                            <span className="permissions-text">{access.permissions}</span>
                          </td>
                          <td className="actions-cell">
                            <div className="action-buttons">
                              <IonButton 
                                fill="clear" 
                                size="small" 
                                className="view-button"
                                onClick={() => handleView(access.id)}
                              >
                                <IonIcon icon={eyeOutline} />
                              </IonButton>
                              <IonButton 
                                fill="clear" 
                                size="small" 
                                className="edit-button"
                                onClick={() => handleEdit(access.id)}
                              >
                                <IonIcon icon={createOutline} />
                              </IonButton>
                              <IonButton 
                                fill="clear" 
                                size="small" 
                                className="delete-button"
                                onClick={() => handleDelete(access.id)}
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
                    Showing {startIndex + 1} to {Math.min(endIndex, filteredAccess.length)} of {filteredAccess.length} access records
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
        message="Are you sure you want to delete this database access? This action cannot be undone."
        buttons={[
          { text: 'Cancel', role: 'cancel', handler: cancelDelete },
          { text: 'Delete', role: 'destructive', handler: confirmDelete }
        ]}
      />

      {/* Add Access Modal */}
      <IonModal isOpen={showAddModal} onDidDismiss={handleCloseAdd}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Add New Database Access</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={handleCloseAdd}>
                <IonIcon icon={closeOutline} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="modal-content">
          <IonItem>
            <IonLabel position="stacked">Name *</IonLabel>
            <IonInput
              value={addForm.name}
              onIonChange={(e) => setAddForm(prev => ({ ...prev, name: e.detail.value! }))}
              placeholder="Enter access name"
            />
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">Permissions *</IonLabel>
            <IonSelect
              value={addForm.permissions}
              onIonChange={(e) => setAddForm(prev => ({ ...prev, permissions: e.detail.value }))}
              placeholder="Select permissions"
            >
              <IonSelectOption value="Read Only">Read Only</IonSelectOption>
              <IonSelectOption value="Read/Write">Read/Write</IonSelectOption>
              <IonSelectOption value="Full Access">Full Access</IonSelectOption>
              <IonSelectOption value="Admin">Admin</IonSelectOption>
            </IonSelect>
          </IonItem>
          <div className="modal-actions">
            <IonButton 
              expand="block" 
              fill="solid"
              onClick={handleSaveAdd}
            >
              <IonIcon icon={checkmarkOutline} slot="start" />
              Add Access
            </IonButton>
            <IonButton 
              expand="block" 
              fill="outline"
              onClick={handleCloseAdd}
            >
              Cancel
            </IonButton>
          </div>
        </IonContent>
      </IonModal>

      {/* Edit Access Modal */}
      <IonModal isOpen={showEditModal} onDidDismiss={handleCloseEdit}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Edit Database Access</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={handleCloseEdit}>
                <IonIcon icon={closeOutline} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="modal-content">
          <IonItem>
            <IonLabel position="stacked">Name *</IonLabel>
            <IonInput
              value={editForm.name}
              onIonChange={(e) => setEditForm(prev => ({ ...prev, name: e.detail.value! }))}
              placeholder="Enter access name"
            />
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">Permissions *</IonLabel>
            <IonSelect
              value={editForm.permissions}
              onIonChange={(e) => setEditForm(prev => ({ ...prev, permissions: e.detail.value }))}
              placeholder="Select permissions"
            >
              <IonSelectOption value="Read Only">Read Only</IonSelectOption>
              <IonSelectOption value="Read/Write">Read/Write</IonSelectOption>
              <IonSelectOption value="Full Access">Full Access</IonSelectOption>
              <IonSelectOption value="Admin">Admin</IonSelectOption>
            </IonSelect>
          </IonItem>
          <div className="modal-actions">
            <IonButton 
              expand="block" 
              fill="solid"
              onClick={handleSaveEdit}
            >
              <IonIcon icon={checkmarkOutline} slot="start" />
              Update Access
            </IonButton>
            <IonButton 
              expand="block" 
              fill="outline"
              onClick={handleCloseEdit}
            >
              Cancel
            </IonButton>
          </div>
        </IonContent>
      </IonModal>

      {/* View Access Modal */}
      <IonModal isOpen={showViewModal} onDidDismiss={handleCloseView}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Database Access Details</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={handleCloseView}>
                <IonIcon icon={closeOutline} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="view-modal-content">
          {viewingAccess && (
            <div>
              <IonItem>
                <IonLabel>
                  <h2>Name</h2>
                  <p>{viewingAccess.name}</p>
                </IonLabel>
              </IonItem>
              <IonItem>
                <IonLabel>
                  <h2>Permissions</h2>
                  <p>{viewingAccess.permissions}</p>
                </IonLabel>
              </IonItem>
              <IonItem>
                <IonLabel>
                  <h2>Created At</h2>
                  <p>{new Date(viewingAccess.createdAt).toLocaleDateString()}</p>
                </IonLabel>
              </IonItem>
              <IonItem>
                <IonLabel>
                  <h2>Updated At</h2>
                  <p>{new Date(viewingAccess.updatedAt).toLocaleDateString()}</p>
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

export default DatabaseAccess;
