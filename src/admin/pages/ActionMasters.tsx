import React, { useState, useMemo } from 'react';
import {
  IonPage, IonContent, IonSplitPane, IonHeader, IonToolbar, IonTitle,
  IonButton, IonIcon, IonCard, IonCardContent, IonCardHeader, IonCardTitle,
  IonGrid, IonRow, IonCol, IonSpinner, IonAlert, IonToast, IonSearchbar,
  IonModal, IonButtons, IonInput, IonTextarea, IonSelect, IonSelectOption,
  IonBadge, IonChip
} from '@ionic/react';
import { 
  addOutline, createOutline, trashOutline, searchOutline,
  chevronBackOutline, chevronForwardOutline, closeOutline, checkmarkOutline,
  eyeOutline, settingsOutline, copyOutline, linkOutline, timeOutline,
  peopleOutline, documentTextOutline, globeOutline, locationOutline,
  mapOutline, businessOutline, barChartOutline, fileTrayOutline, accessibilityOutline,
  keyOutline, homeOutline, gitBranchOutline, shieldOutline, shuffleOutline
} from 'ionicons/icons';
import Sidebar from '../components/sidebar/Sidebar';
import DashboardHeader from '../components/header/DashboardHeader';
import ActionDropdown from '../components/common/ActionDropdown';
import { Pagination } from '../components/shared';
import { mockDataService } from '../../services/api';
import type { ActionMasterData } from '../../types';
import './ActionMasters.css';

const ActionMasters: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [selectedActionId, setSelectedActionId] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingAction, setEditingAction] = useState<ActionMasterData | null>(null);
  const [editForm, setEditForm] = useState({
    name: '',
    functionName: '',
    priority: ''
  });
  
  // Enhanced state for new functionality
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [sortBy, setSortBy] = useState<'name' | 'functionName' | 'priority'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const itemsPerPage = 5;

  // Get action master data from mock service
  const allActions = mockDataService.getActionMasterData();
  
  // Filter and sort actions
  const filteredAndSortedActions = useMemo(() => {
    let filtered = allActions.filter(action =>
      action.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      action.functionName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Sort actions
    filtered.sort((a, b) => {
      const aValue = (a as any)[sortBy];
      const bValue = (b as any)[sortBy];
      
      if (typeof aValue === 'string') {
        return sortOrder === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      return sortOrder === 'asc' 
        ? aValue - bValue 
        : bValue - aValue;
    });

    return filtered;
  }, [allActions, searchQuery, sortBy, sortOrder]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredAndSortedActions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentActions = filteredAndSortedActions.slice(startIndex, endIndex);

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
      case 'settingsOutline': return settingsOutline;
      default: return settingsOutline;
    }
  };

  const handleAddAction = () => {
    setShowAddModal(true);
  };

  const handleView = (action: ActionMasterData) => {
    setToastMessage(`Viewing action: ${action.name}`);
    setShowToast(true);
  };

  const handleCopyName = (actionName: string) => {
    navigator.clipboard.writeText(actionName);
    setToastMessage('Action name copied to clipboard');
    setShowToast(true);
  };

  const handleSaveAction = () => {
    setToastMessage('Action saved successfully');
    setShowToast(true);
    setShowAddModal(false);
    setShowEditModal(false);
    setEditingAction(null);
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
      setToastMessage(`Delete action ${selectedActionId} functionality will be implemented`);
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
      <IonSplitPane contentId="dashboard-content" when="md">
        <Sidebar />
        <div className="main-content" id="dashboard-content">
          <DashboardHeader />
          
          <IonContent className="manage-pages-content">
            <div className="pages-container">
              {/* Header Section */}
              <div className="pages-header">
                <h1>Action Masters</h1>
                <p>Manage action categories and their configurations</p>
              </div>

              {/* Enhanced Search and Actions */}
              <div className="pages-actions">
                <IonSearchbar
                  value={searchQuery}
                  onIonChange={(e) => setSearchQuery(e.detail.value!)}
                  placeholder="Search actions by name or function..."
                  className="pages-search"
                />
                <IonButton 
                  fill="outline" 
                  size="small"
                  onClick={() => setViewMode(viewMode === 'grid' ? 'table' : 'grid')}
                >
                  <IonIcon icon={viewMode === 'grid' ? barChartOutline : eyeOutline} />
                  {viewMode === 'grid' ? 'Table View' : 'Grid View'}
                </IonButton>
                <IonButton 
                  fill="solid" 
                  className="add-page-button"
                  onClick={handleAddAction}
                >
                  <IonIcon icon={addOutline} />
                  Add New Action
                </IonButton>
              </div>

              {/* Actions Grid */}
              {viewMode === 'grid' ? (
                <div className="branches-grid">
                  {currentActions.map((action) => (
                    <div key={action.id} className="branch-card">
                      <div className="branch-card-header">
                        <div className="branch-card-icon">
                          <IonIcon icon={settingsOutline} />
                        </div>
                        <div className="branch-card-title">
                          <h3 className="branch-card-name">{action.name}</h3>
                          <div className="branch-card-type">{action.functionName}</div>
                        </div>
                      </div>
                      
                      <div className="branch-card-content">
                        <div className="branch-card-meta">
                          <div className="branch-card-meta-item">
                            <IonIcon icon={documentTextOutline} className="branch-card-meta-icon" />
                            <span>Priority: {action.priority}</span>
                          </div>
                        </div>
                        
                        <div className="branch-card-meta">
                          <div className="branch-card-meta-item">
                            <IonIcon icon={timeOutline} className="branch-card-meta-icon" />
                            <span>Status: Active</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="branch-card-actions">
                        <IonButton 
                          fill="clear" 
                          size="small" 
                          className="branch-card-button view"
                          onClick={() => handleView(action)}
                        >
                          <IonIcon icon={eyeOutline} />
                          View
                        </IonButton>
                        <IonButton 
                          fill="clear" 
                          size="small" 
                          className="branch-card-button edit"
                          onClick={() => handleEdit(action.id)}
                        >
                          <IonIcon icon={createOutline} />
                          Edit
                        </IonButton>
                        <IonButton 
                          fill="clear" 
                          size="small" 
                          className="branch-card-button delete"
                          onClick={() => handleDelete(action.id)}
                        >
                          <IonIcon icon={trashOutline} />
                          Delete
                        </IonButton>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
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
                              <span>Function Name</span>
                              <IonIcon icon={searchOutline} className="filter-icon" />
                            </div>
                          </th>
                          <th>
                            <div className="table-header">
                              <span>Priority</span>
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
                        {currentActions.map((action, index) => (
                          <tr key={action.id} className={index % 2 === 0 ? 'even-row' : 'odd-row'}>
                            <td className="name-cell">
                              <div className="page-name">
                                <IonIcon icon={settingsOutline} className="page-icon" />
                                <span>{action.name}</span>
                              </div>
                            </td>
                            <td className="url-cell">
                              <code className="url-code">{action.functionName}</code>
                            </td>
                            <td className="url-cell">
                              <code className="url-code">{action.priority}</code>
                            </td>
                            <td className="icon-cell">
                              <div className="icon-display">
                                <IonIcon icon={settingsOutline} className="display-icon" />
                                <span className="icon-name">settingsOutline</span>
                              </div>
                            </td>
                            <td className="actions-cell">
                              <div className="action-buttons">
                                <ActionDropdown
                                  itemId={action.id}
                                  onEdit={() => handleEdit(action.id)}
                                  onDelete={() => handleDelete(action.id)}
                                  size="small"
                                />
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </IonCardContent>
                </IonCard>
              )}

              {/* Pagination */}
              {filteredAndSortedActions.length > 0 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPreviousPage={handlePreviousPage}
                  onNextPage={handleNextPage}
                />
              )}
              
              {/* Bottom spacing for pagination visibility */}
              <div style={{ height: '3rem' }}></div>
            </div>
          </IonContent>
        </div>
      </IonSplitPane>

      {/* Add Action Modal */}
      <IonModal isOpen={showAddModal} onDidDismiss={() => setShowAddModal(false)}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Add New Action</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => setShowAddModal(false)}>
                <IonIcon icon={closeOutline} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="page-modal-content">
          <div style={{ padding: '2rem' }}>
            <h2 style={{ marginBottom: '1.5rem', color: '#667eea' }}>Create New Action</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <IonInput
                label="Action Name"
                labelPlacement="stacked"
                placeholder="Enter action name"
                style={{ '--background': 'rgba(255, 255, 255, 0.9)', '--border-radius': '12px' }}
              />
              <IonInput
                label="Function Name"
                labelPlacement="stacked"
                placeholder="Enter function name"
                style={{ '--background': 'rgba(255, 255, 255, 0.9)', '--border-radius': '12px' }}
              />
              <IonSelect
                label="Priority"
                labelPlacement="stacked"
                placeholder="Select priority"
                style={{ '--background': 'rgba(255, 255, 255, 0.9)', '--border-radius': '12px' }}
              >
                <IonSelectOption value="1">1</IonSelectOption>
                <IonSelectOption value="2">2</IonSelectOption>
                <IonSelectOption value="3">3</IonSelectOption>
                <IonSelectOption value="4">4</IonSelectOption>
                <IonSelectOption value="5">5</IonSelectOption>
              </IonSelect>
              <IonButton 
                expand="block" 
                style={{ 
                  '--background': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  '--color': 'white',
                  '--border-radius': '12px',
                  marginTop: '1rem'
                }}
                onClick={handleSaveAction}
              >
                <IonIcon icon={checkmarkOutline} slot="start" />
                Create Action
              </IonButton>
            </div>
          </div>
        </IonContent>
      </IonModal>

      {/* Edit Action Modal */}
      <IonModal isOpen={showEditModal} onDidDismiss={() => setShowEditModal(false)}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Edit Action</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => setShowEditModal(false)}>
                <IonIcon icon={closeOutline} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="page-modal-content">
          <div style={{ padding: '2rem' }}>
            <h2 style={{ marginBottom: '1.5rem', color: '#667eea' }}>Edit Action: {editingAction?.name}</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <IonInput
                label="Action Name"
                labelPlacement="stacked"
                value={editForm.name}
                onIonChange={(e) => setEditForm({...editForm, name: e.detail.value!})}
                style={{ '--background': 'rgba(255, 255, 255, 0.9)', '--border-radius': '12px' }}
              />
              <IonInput
                label="Function Name"
                labelPlacement="stacked"
                value={editForm.functionName}
                onIonChange={(e) => setEditForm({...editForm, functionName: e.detail.value!})}
                style={{ '--background': 'rgba(255, 255, 255, 0.9)', '--border-radius': '12px' }}
              />
              <IonSelect
                label="Priority"
                labelPlacement="stacked"
                value={editForm.priority}
                onIonChange={(e) => setEditForm({...editForm, priority: e.detail.value})}
                style={{ '--background': 'rgba(255, 255, 255, 0.9)', '--border-radius': '12px' }}
              >
                <IonSelectOption value="1">1</IonSelectOption>
                <IonSelectOption value="2">2</IonSelectOption>
                <IonSelectOption value="3">3</IonSelectOption>
                <IonSelectOption value="4">4</IonSelectOption>
                <IonSelectOption value="5">5</IonSelectOption>
              </IonSelect>
              <IonButton 
                expand="block" 
                style={{ 
                  '--background': 'linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%)',
                  '--color': 'white',
                  '--border-radius': '12px',
                  marginTop: '1rem'
                }}
                onClick={handleSaveEdit}
              >
                <IonIcon icon={checkmarkOutline} slot="start" />
                Update Action
              </IonButton>
            </div>
          </div>
        </IonContent>
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
