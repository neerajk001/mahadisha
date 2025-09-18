import React, { useState, useMemo } from 'react';
import {
  IonPage, IonContent, IonSplitPane, IonHeader, IonToolbar, IonTitle,
  IonButton, IonIcon, IonCard, IonCardContent, IonCardHeader, IonCardTitle,
  IonGrid, IonRow, IonCol, IonSpinner, IonAlert, IonToast, IonSearchbar,
  IonModal, IonItem, IonLabel, IonInput, IonSelect, IonSelectOption
} from '@ionic/react';
import { 
  addOutline, createOutline, trashOutline, searchOutline,
  chevronBackOutline, chevronForwardOutline, closeOutline, checkmarkOutline,
  eyeOutline
} from 'ionicons/icons';
import Sidebar from '../admin/components/sidebar/Sidebar';
import DashboardHeader from '../admin/components/header/DashboardHeader';
import { mockDataService } from '../services/api';
import type { ActionMasterData } from '../types';
import './ActionMasters.css';
import './shared/MasterMobile.css';

const ActionMasters: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [selectedActionId, setSelectedActionId] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingAction, setEditingAction] = useState<ActionMasterData | null>(null);
  const [viewingAction, setViewingAction] = useState<ActionMasterData | null>(null);
  const [editForm, setEditForm] = useState({
    name: '',
    functionName: '',
    priority: ''
  });
  const [addForm, setAddForm] = useState({
    name: '',
    functionName: '',
    priority: ''
  });

  const itemsPerPage = 5;

  // Get action master data from mock service
  const allActions = mockDataService.getActionMasterData();
  
  // Filter actions based on search query
  const filteredActions = useMemo(() => {
    return allActions.filter(action =>
      action.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [allActions, searchQuery]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredActions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentActions = filteredActions.slice(startIndex, endIndex);

  const handleAddAction = () => {
    setShowAddModal(true);
  };

  const handleView = (actionId: string) => {
    const action = allActions.find(a => a.id === actionId);
    if (action) {
      setViewingAction(action);
      setShowViewModal(true);
    }
  };

  const handleSaveAdd = () => {
    setToastMessage(`Action "${addForm.name}" created successfully`);
    setShowToast(true);
    setShowAddModal(false);
    setAddForm({ name: '', functionName: '', priority: '' });
  };

  const handleCloseAdd = () => {
    setShowAddModal(false);
    setAddForm({ name: '', functionName: '', priority: '' });
  };

  const handleEdit = (actionId: string) => {
    const action = allActions.find(a => a.id === actionId);
    if (action) {
      setEditingAction(action);
      setEditForm({
        name: action.name,
        functionName: action.functionName,
        priority: action.priority.toString()
      });
      setShowEditModal(true);
    }
  };

  const handleSaveEdit = () => {
    if (editingAction) {
      setToastMessage(`Action "${editForm.name}" updated successfully`);
      setShowToast(true);
      setShowEditModal(false);
      setEditingAction(null);
      setEditForm({ name: '', functionName: '', priority: '' });
    }
  };

  const handleCloseEdit = () => {
    setShowEditModal(false);
    setEditingAction(null);
    setEditForm({ name: '', functionName: '', priority: '' });
  };

  const handleDelete = (actionId: string) => {
    setSelectedActionId(actionId);
    setShowDeleteAlert(true);
  };

  const confirmDelete = () => {
    if (selectedActionId) {
      const actionToDelete = allActions.find(action => action.id === selectedActionId);
      setToastMessage(`Action "${actionToDelete?.name || selectedActionId}" deleted successfully`);
      setShowToast(true);
      setSelectedActionId(null);
    }
    setShowDeleteAlert(false);
  };

  const cancelDelete = () => {
    setSelectedActionId(null);
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
          
          <IonContent className="action-masters-content">
            <div className="actions-container">
              {/* Header Section */}
              <div className="actions-header">
                <h1>Action Masters</h1>
                <p>Manage action categories and their configurations</p>
              </div>

              {/* Search and Actions */}
              <div className="actions-actions">
                <IonSearchbar
                  value={searchQuery}
                  onIonChange={(e) => setSearchQuery(e.detail.value!)}
                  placeholder="Search actions by name..."
                  className="actions-search"
                />
                <IonButton 
                  fill="solid" 
                  className="add-action-button"
                  onClick={handleAddAction}
                >
                  <IonIcon icon={addOutline} />
                  Add Action
                </IonButton>
              </div>

              {/* Actions Table */}
              <IonCard className="actions-table-card">
                <IonCardContent className="table-container">
                  <div className="mobile-table-wrapper">
                    <table className="actions-table">
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
                            <IonIcon icon={searchOutline} className="filter-icon" />
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentActions.map((action, index) => (
                        <tr key={action.id} className={index % 2 === 0 ? 'even-row' : 'odd-row'}>
                          <td className="action-name-cell">
                            <span className="action-name">{action.name}</span>
                          </td>
                          <td className="actions-cell">
                            <div className="action-buttons">
                              <IonButton 
                                fill="clear" 
                                size="small" 
                                className="view-button"
                                onClick={() => handleView(action.id)}
                              >
                                <IonIcon icon={eyeOutline} />
                              </IonButton>
                              <IonButton 
                                fill="clear" 
                                size="small" 
                                className="edit-button"
                                onClick={() => handleEdit(action.id)}
                              >
                                <IonIcon icon={createOutline} />
                              </IonButton>
                              <IonButton 
                                fill="clear" 
                                size="small" 
                                className="delete-button"
                                onClick={() => handleDelete(action.id)}
                              >
                                <IonIcon icon={trashOutline} />
                              </IonButton>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    </table>
                  </div>
                </IonCardContent>
              </IonCard>

              {/* Pagination */}
              <div className="pagination-container">
                <div className="pagination-info">
                  <p>
                    Showing {startIndex + 1} to {Math.min(endIndex, filteredActions.length)} of {filteredActions.length} actions
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

      {/* Add Modal */}
      <IonModal 
        isOpen={showAddModal} 
        onDidDismiss={handleCloseAdd}
        backdropDismiss={true}
        showBackdrop={true}
      >
        <div className="edit-modal">
          <div className="modal-header">
            <h2>Add Action Master</h2>
            <IonButton fill="clear" onClick={handleCloseAdd} className="close-button">
              <IonIcon icon={closeOutline} />
            </IonButton>
          </div>
          
          <div className="modal-content">
            <IonItem className="form-item">
              <IonLabel position="stacked">Action Master Name</IonLabel>
              <IonInput
                value={addForm.name}
                onIonChange={(e) => setAddForm({...addForm, name: e.detail.value!})}
                placeholder="Enter action master name"
              />
            </IonItem>

            <IonItem className="form-item">
              <IonLabel position="stacked">Enter Function name</IonLabel>
              <IonInput
                value={addForm.functionName}
                onIonChange={(e) => setAddForm({...addForm, functionName: e.detail.value!})}
                placeholder="Enter function name"
              />
            </IonItem>

            <IonItem className="form-item">
              <IonLabel position="stacked">Priority</IonLabel>
              <IonSelect
                value={addForm.priority}
                onIonChange={(e) => setAddForm({...addForm, priority: e.detail.value})}
                placeholder="Select priority"
              >
                <IonSelectOption value="1">1</IonSelectOption>
                <IonSelectOption value="2">2</IonSelectOption>
                <IonSelectOption value="3">3</IonSelectOption>
                <IonSelectOption value="4">4</IonSelectOption>
                <IonSelectOption value="5">5</IonSelectOption>
              </IonSelect>
            </IonItem>
          </div>

          <div className="modal-footer">
            <IonButton 
              fill="solid" 
              className="save-button"
              onClick={handleSaveAdd}
            >
              <IonIcon icon={checkmarkOutline} slot="start" />
              Create Action
            </IonButton>
          </div>
        </div>
      </IonModal>

      {/* View Modal */}
      <IonModal 
        isOpen={showViewModal} 
        onDidDismiss={() => setShowViewModal(false)}
        backdropDismiss={true}
        showBackdrop={true}
      >
        <div className="edit-modal">
          <div className="modal-header">
            <h2>View Action Master Details</h2>
            <IonButton fill="clear" onClick={() => setShowViewModal(false)} className="close-button">
              <IonIcon icon={closeOutline} />
            </IonButton>
          </div>
          
          <div className="modal-content">
            <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="view-field">
                <h3 style={{ color: '#333', marginBottom: '0.5rem', fontSize: '1rem' }}>Action Master Name</h3>
                <div style={{ 
                  padding: '1rem', 
                  background: 'rgba(255, 255, 255, 0.9)', 
                  borderRadius: '12px',
                  border: '1px solid #e0e0e0'
                }}>
                  {viewingAction?.name}
                </div>
              </div>
              
              <div className="view-field">
                <h3 style={{ color: '#333', marginBottom: '0.5rem', fontSize: '1rem' }}>Function Name</h3>
                <div style={{ 
                  padding: '1rem', 
                  background: 'rgba(255, 255, 255, 0.9)', 
                  borderRadius: '12px',
                  border: '1px solid #e0e0e0',
                  fontFamily: 'monospace'
                }}>
                  {viewingAction?.functionName}
                </div>
              </div>
              
              <div className="view-field">
                <h3 style={{ color: '#333', marginBottom: '0.5rem', fontSize: '1rem' }}>Priority</h3>
                <div style={{ 
                  padding: '1rem', 
                  background: 'rgba(255, 255, 255, 0.9)', 
                  borderRadius: '12px',
                  border: '1px solid #e0e0e0'
                }}>
                  {viewingAction?.priority}
                </div>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <IonButton 
              fill="outline" 
              className="close-button-footer"
              onClick={() => setShowViewModal(false)}
            >
              <IonIcon icon={closeOutline} slot="start" />
              Close
            </IonButton>
          </div>
        </div>
      </IonModal>

      {/* Edit Modal */}
      <IonModal 
        isOpen={showEditModal} 
        onDidDismiss={handleCloseEdit}
        backdropDismiss={true}
        showBackdrop={true}
      >
        <div className="edit-modal">
          <div className="modal-header">
            <h2>Edit Action Master</h2>
            <IonButton fill="clear" onClick={handleCloseEdit} className="close-button">
              <IonIcon icon={closeOutline} />
            </IonButton>
          </div>
          
          <div className="modal-content">
            <IonItem className="form-item">
              <IonLabel position="stacked">Action Master Name</IonLabel>
              <IonInput
                value={editForm.name}
                onIonChange={(e) => setEditForm({...editForm, name: e.detail.value!})}
                placeholder="Enter action master name"
              />
            </IonItem>

            <IonItem className="form-item">
              <IonLabel position="stacked">Enter Function name</IonLabel>
              <IonInput
                value={editForm.functionName}
                onIonChange={(e) => setEditForm({...editForm, functionName: e.detail.value!})}
                placeholder="Enter function name"
              />
            </IonItem>

            <IonItem className="form-item">
              <IonLabel position="stacked">Priority</IonLabel>
              <IonSelect
                value={editForm.priority}
                onIonChange={(e) => setEditForm({...editForm, priority: e.detail.value})}
                placeholder="Select priority"
              >
                <IonSelectOption value="1">1</IonSelectOption>
                <IonSelectOption value="2">2</IonSelectOption>
                <IonSelectOption value="3">3</IonSelectOption>
                <IonSelectOption value="4">4</IonSelectOption>
                <IonSelectOption value="5">5</IonSelectOption>
              </IonSelect>
            </IonItem>
          </div>

          <div className="modal-footer">
            <IonButton 
              fill="solid" 
              className="save-button"
              onClick={handleSaveEdit}
            >
              Save Changes
            </IonButton>
          </div>
        </div>
      </IonModal>

      {/* Delete Confirmation Alert */}
      <IonAlert
        isOpen={showDeleteAlert}
        onDidDismiss={cancelDelete}
        header="Confirm Delete"
        message="Are you sure you want to delete this action? This action cannot be undone."
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

export default ActionMasters;
