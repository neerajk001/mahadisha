import React, { useState } from 'react';
import {
  IonPage,
  IonContent,
  IonSplitPane,
  IonIcon,
  IonList,
  IonItem,
  IonLabel,
  IonButton,
  IonGrid,
  IonRow,
  IonCol,
  IonSpinner,
  IonAlert,
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonInput,
  IonTextarea,
  IonToggle,
  IonBadge,
  IonSearchbar,
  IonSelect,
  IonSelectOption
} from '@ionic/react';
import { createOutline, trashOutline, filterOutline, addOutline, closeOutline, checkmarkOutline, eyeOutline } from 'ionicons/icons';
import Sidebar from '../components/sidebar/Sidebar';
import DashboardHeader from '../components/header/DashboardHeader';
import ScrollableTableContainer from '../../components/shared/ScrollableTableContainer';
import MasterControls from '../../components/shared/MasterControls';
import { useApplicationTypes } from '../hooks/useApplicationTypes';
import type { ApplicationType } from '../../types';
import './ApplicationType.css';

const ApplicationType: React.FC = () => {
  const { data: applicationTypes, isLoading, error, delete: deleteApplicationType, create, update } = useApplicationTypes();
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingType, setEditingType] = useState<ApplicationType | null>(null);
  
  // Form states
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isActive: true
  });
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Form handlers
  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      isActive: true
    });
  };

  // Add new application type
  const handleAddNew = () => {
    resetForm();
    setShowAddModal(true);
  };

  const handleSubmitAdd = async () => {
    try {
      await create(formData);
      setShowAddModal(false);
      resetForm();
    } catch (error) {
      console.error('Failed to create application type:', error);
    }
  };

  // Edit application type
  const handleEdit = (type: ApplicationType) => {
    setEditingType(type);
    setFormData({
      name: type.name,
      description: type.description || '',
      isActive: type.isActive
    });
    setShowEditModal(true);
  };

  const handleSubmitEdit = async () => {
    if (!editingType) return;
    
    try {
      await update(editingType.id, formData);
      setShowEditModal(false);
      setEditingType(null);
      resetForm();
    } catch (error) {
      console.error('Failed to update application type:', error);
    }
  };

  const handleDelete = (id: number) => {
    setSelectedId(id);
    setShowDeleteAlert(true);
  };

  // Toggle status
  const handleToggleStatus = async (type: ApplicationType) => {
    try {
      await update(type.id, { ...type, isActive: !type.isActive });
    } catch (error) {
      console.error('Failed to toggle status:', error);
    }
  };

  const confirmDelete = async () => {
    if (selectedId) {
      try {
        await deleteApplicationType(selectedId);
        setShowDeleteAlert(false);
        setSelectedId(null);
      } catch (error) {
        console.error('Failed to delete application type:', error);
      }
    }
  };

  const cancelDelete = () => {
    setShowDeleteAlert(false);
    setSelectedId(null);
  };

  // Filter and search logic
  const filteredApplicationTypes = applicationTypes?.filter(type => {
    const matchesSearch = searchTerm === '' || 
                         type.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (type.description && type.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (type.isActive && 'active'.includes(searchTerm.toLowerCase())) ||
                         (!type.isActive && 'inactive'.includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && type.isActive) ||
                         (statusFilter === 'inactive' && !type.isActive);
    
    return matchesSearch && matchesStatus;
  }) || [];

  return (
    <IonPage>
      <IonSplitPane contentId="dashboard-content" when="md">
        {/* Sidebar */}
        <Sidebar />
        
        {/* Main Content */}
        <div className="main-content" id="dashboard-content">
          {/* Header */}
          <DashboardHeader />
          
          {/* Application Type Content */}
          <IonContent className="application-type-content">
            <div className="application-type-container">
              {/* Page Header */}
              <div className="page-header">
                <h1 className="page-title">
                  <span className="title-line">Application</span>
                  <span className="title-line">Types</span>
                </h1>
              </div>

              {/* Master Controls */}
              <MasterControls
                searchQuery={searchTerm}
                onSearchChange={setSearchTerm}
                searchPlaceholder="Search by name, description, or status..."
                onAddNew={handleAddNew}
                addButtonText="Add New"
                showFilterButton={true}
                onFilterClick={() => {
                  // Toggle between filter options
                  const options = ['all', 'active', 'inactive'];
                  const currentIndex = options.indexOf(statusFilter);
                  const nextIndex = (currentIndex + 1) % options.length;
                  setStatusFilter(options[nextIndex]);
                }}
                filterButtonText={statusFilter === 'all' ? 'All Status' : 
                                 statusFilter === 'active' ? 'Active Only' : 'Inactive Only'}
                className="application-type-controls"
              />

              {/* Results Counter */}
              {filteredApplicationTypes.length !== applicationTypes?.length && (
                <div className="results-info">
                  <span className="results-count">
                    Showing {filteredApplicationTypes.length} of {applicationTypes?.length || 0} application types
                  </span>
                  {searchTerm && (
                    <span className="search-term">for "{searchTerm}"</span>
                  )}
                </div>
              )}

              {/* Application Types Table */}
              <ScrollableTableContainer className="application-types-table">
                {isLoading ? (
                  <div className="loading-container">
                    <IonSpinner name="crescent" />
                    <p>Loading application types...</p>
                  </div>
                ) : error ? (
                  <div className="error-container">
                    <p>Error: {error}</p>
                    <IonButton fill="outline" onClick={() => {
                      // SDK-friendly refresh approach
                      if (typeof window !== 'undefined') {
                        window.location.reload();
                      }
                    }}>
                      Retry
                    </IonButton>
                  </div>
                ) : filteredApplicationTypes.length === 0 ? (
                  <div className="no-results-container">
                    <IonIcon icon={documentTextOutline} />
                    <p>No application types found</p>
                    {searchTerm || statusFilter !== 'all' ? (
                      <p className="no-results-suggestion">
                        Try adjusting your search terms or filters
                      </p>
                    ) : null}
                  </div>
                ) : (
                  <table className="application-types-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredApplicationTypes.map((type) => (
                        <tr key={type.id} className="application-type-row">
                          <td className="name-column">
                            <span className="application-type-name">{type.name}</span>
                          </td>
                          <td className="description-column">
                            <span className="application-type-description">
                              {type.description || 'No description'}
                            </span>
                          </td>
                          <td className="status-column">
                            <div className="status-controls">
                              <IonBadge 
                                color={type.isActive ? 'success' : 'medium'}
                                className="status-badge"
                              >
                                {type.isActive ? 'Active' : 'Inactive'}
                              </IonBadge>
                              <IonToggle
                                checked={type.isActive}
                                onIonChange={() => handleToggleStatus(type)}
                                className="status-toggle"
                              />
                            </div>
                          </td>
                          <td className="actions-column">
                            <div className="action-buttons">
                              <IonButton 
                                fill="clear" 
                                size="small" 
                                className="edit-button"
                                onClick={() => handleEdit(type)}
                              >
                                <IonIcon icon={createOutline} />
                              </IonButton>
                              <IonButton 
                                fill="clear" 
                                size="small" 
                                className="delete-button"
                                onClick={() => handleDelete(type.id)}
                              >
                                <IonIcon icon={trashOutline} />
                              </IonButton>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </ScrollableTableContainer>
            </div>
          </IonContent>
        </div>
      </IonSplitPane>

      {/* Add New Application Type Modal */}
      <IonModal isOpen={showAddModal} onDidDismiss={() => setShowAddModal(false)}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Add New Application Type</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => setShowAddModal(false)}>
                <IonIcon icon={closeOutline} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="modal-content">
          <div className="form-container">
            <IonItem>
              <IonLabel position="stacked">Name *</IonLabel>
              <IonInput
                value={formData.name}
                onIonInput={(e) => handleInputChange('name', e.detail.value!)}
                placeholder="Enter application type name"
                required
              />
            </IonItem>
            
            <IonItem>
              <IonLabel position="stacked">Description</IonLabel>
              <IonTextarea
                value={formData.description}
                onIonInput={(e) => handleInputChange('description', e.detail.value!)}
                placeholder="Enter description (optional)"
                rows={3}
              />
            </IonItem>
            
            <IonItem>
              <IonLabel>Active Status</IonLabel>
              <IonToggle
                checked={formData.isActive}
                onIonChange={(e) => handleInputChange('isActive', e.detail.checked)}
                slot="end"
              />
            </IonItem>
            
            <div className="modal-actions">
              <IonButton fill="outline" onClick={() => setShowAddModal(false)}>
                Cancel
              </IonButton>
              <IonButton onClick={handleSubmitAdd} disabled={!formData.name.trim()}>
                <IonIcon icon={checkmarkOutline} slot="start" />
                Add Application Type
              </IonButton>
            </div>
          </div>
        </IonContent>
      </IonModal>

      {/* Edit Application Type Modal */}
      <IonModal isOpen={showEditModal} onDidDismiss={() => setShowEditModal(false)}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Edit Application Type</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => setShowEditModal(false)}>
                <IonIcon icon={closeOutline} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="modal-content">
          <div className="form-container">
            <IonItem>
              <IonLabel position="stacked">Name *</IonLabel>
              <IonInput
                value={formData.name}
                onIonInput={(e) => handleInputChange('name', e.detail.value!)}
                placeholder="Enter application type name"
                required
              />
            </IonItem>
            
            <IonItem>
              <IonLabel position="stacked">Description</IonLabel>
              <IonTextarea
                value={formData.description}
                onIonInput={(e) => handleInputChange('description', e.detail.value!)}
                placeholder="Enter description (optional)"
                rows={3}
              />
            </IonItem>
            
            <IonItem>
              <IonLabel>Active Status</IonLabel>
              <IonToggle
                checked={formData.isActive}
                onIonChange={(e) => handleInputChange('isActive', e.detail.checked)}
                slot="end"
              />
            </IonItem>
            
            <div className="modal-actions">
              <IonButton fill="outline" onClick={() => setShowEditModal(false)}>
                Cancel
              </IonButton>
              <IonButton onClick={handleSubmitEdit} disabled={!formData.name.trim()}>
                <IonIcon icon={checkmarkOutline} slot="start" />
                Update Application Type
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
        message="Are you sure you want to delete this application type? This action cannot be undone."
        buttons={[
          {
            text: 'Cancel',
            role: 'cancel',
            handler: cancelDelete
          },
          {
            text: 'Delete',
            role: 'destructive',
            handler: confirmDelete
          }
        ]}
      />
    </IonPage>
  );
};

export default ApplicationType;
