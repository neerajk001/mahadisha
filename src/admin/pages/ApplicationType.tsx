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
    const matchesSearch = type.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (type.description && type.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
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
                <h1 className="page-title">Application Types</h1>
                <div className="page-actions">
                  <IonButton fill="outline" size="small" onClick={handleAddNew}>
                    <IonIcon icon={addOutline} slot="start" />
                    Add New
                  </IonButton>
                </div>
              </div>

              {/* Search and Filter Bar */}
              <div className="search-filter-container">
                <IonSearchbar
                  value={searchTerm}
                  onIonInput={(e) => setSearchTerm(e.detail.value!)}
                  placeholder="Search application types..."
                  className="admin-search"
                />
                <IonSelect
                  value={statusFilter}
                  onIonChange={(e) => setStatusFilter(e.detail.value)}
                  placeholder="Filter by status"
                  className="status-filter"
                >
                  <IonSelectOption value="all">All Status</IonSelectOption>
                  <IonSelectOption value="active">Active Only</IonSelectOption>
                  <IonSelectOption value="inactive">Inactive Only</IonSelectOption>
                </IonSelect>
              </div>

              {/* Application Types List */}
              <div className="list-container">
                <div className="list-header">
                  <div className="header-row">
                    <div className="header-column name-column">
                      <span>Name</span>
                    </div>
                    <div className="header-column description-column">
                      <span>Description</span>
                    </div>
                    <div className="header-column status-column">
                      <span>Status</span>
                    </div>
                    <div className="header-column usage-column">
                      <span>Usage</span>
                    </div>
                    <div className="header-column actions-column">
                      <span>Actions</span>
                    </div>
                  </div>
                </div>

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
                ) : (
                  <IonList className="application-types-list">
                    {filteredApplicationTypes.map((type) => (
                      <IonItem key={type.id} className="application-type-item">
                        <div className="item-content">
                          <div className="item-column name-column">
                            <span className="application-type-name">{type.name}</span>
                          </div>
                          <div className="item-column description-column">
                            <span className="application-type-description">
                              {type.description || 'No description'}
                            </span>
                          </div>
                          <div className="item-column status-column">
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
                          <div className="item-column usage-column">
                            <span className="usage-count">
                              {/* TODO: Get actual usage count from API */}
                              {Math.floor(Math.random() * 50)} apps
                            </span>
                          </div>
                          <div className="item-column actions-column">
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
                          </div>
                        </div>
                      </IonItem>
                    ))}
                  </IonList>
                )}
              </div>
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
