import React, { useState, useMemo } from 'react';
import {
  IonPage, IonContent, IonSplitPane, IonHeader, IonToolbar, IonTitle,
  IonButton, IonIcon, IonCard, IonCardContent, IonCardHeader, IonCardTitle,
  IonGrid, IonRow, IonCol, IonSpinner, IonAlert, IonToast, IonSearchbar,
  IonModal, IonItem, IonLabel, IonInput, IonSelect, IonSelectOption,
  IonChip, IonText
} from '@ionic/react';
import { 
  addOutline, createOutline, trashOutline, searchOutline,
  chevronBackOutline, chevronForwardOutline, closeOutline,
  checkmarkOutline, documentTextOutline, closeCircleOutline,
  swapVerticalOutline
} from 'ionicons/icons';
import Sidebar from '../admin/components/sidebar/Sidebar';
import DashboardHeader from '../admin/components/header/DashboardHeader';
import { mockDataService } from '../services/api';
import type { StatusMappingData } from '../types';
import './StatusMapping.css';

const StatusMapping: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [selectedMappingId, setSelectedMappingId] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingMapping, setEditingMapping] = useState<StatusMappingData | null>(null);
  const [formData, setFormData] = useState({
    currentStatus: '',
    role: '',
    visibleFields: [] as string[],
    nextPossibleStatuses: [] as string[]
  });

  const itemsPerPage = 5;

  // Get status mapping data from mock service
  const allMappings = mockDataService.getStatusMappingData();
  
  // Filter mappings based on search query
  const filteredMappings = useMemo(() => {
    return allMappings.filter(mapping =>
      mapping.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mapping.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mapping.visibleFields.some(field => field.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [allMappings, searchQuery]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredMappings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentMappings = filteredMappings.slice(startIndex, endIndex);

  const handleAddNewMapping = () => {
    setFormData({
      currentStatus: '',
      role: '',
      visibleFields: [],
      nextPossibleStatuses: []
    });
    setShowAddModal(true);
  };

  const handleEdit = (mappingId: string) => {
    const mapping = allMappings.find(m => m.id === mappingId);
    if (mapping) {
      setEditingMapping(mapping);
      setFormData({
        currentStatus: mapping.status,
        role: mapping.role,
        visibleFields: mapping.visibleFields,
        nextPossibleStatuses: mapping.nextPossibleStatuses
      });
      setShowEditModal(true);
    }
  };

  const handleSaveMapping = () => {
    if (editingMapping) {
      setToastMessage(`Status mapping "${formData.currentStatus}" updated successfully`);
    } else {
      setToastMessage(`New status mapping "${formData.currentStatus}" created successfully`);
    }
    setShowToast(true);
    setShowAddModal(false);
    setShowEditModal(false);
    setEditingMapping(null);
    setFormData({
      currentStatus: '',
      role: '',
      visibleFields: [],
      nextPossibleStatuses: []
    });
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setEditingMapping(null);
    setFormData({
      currentStatus: '',
      role: '',
      visibleFields: [],
      nextPossibleStatuses: []
    });
  };

  const handleDelete = (mappingId: string) => {
    setSelectedMappingId(mappingId);
    setShowDeleteAlert(true);
  };

  const confirmDelete = () => {
    if (selectedMappingId) {
      setToastMessage(`Delete status mapping ${selectedMappingId} functionality will be implemented`);
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

  const getStatusIcon = (status: string) => {
    if (status.includes('Submitted') || status.includes('Sanctioned')) {
      return <IonIcon icon={checkmarkOutline} className="status-icon success" />;
    } else if (status.includes('Rejected') || status.includes('Incomplete')) {
      return <IonIcon icon={closeCircleOutline} className="status-icon error" />;
    } else if (status.includes('Incomplete')) {
      return <IonIcon icon={documentTextOutline} className="status-icon warning" />;
    }
    return null;
  };

  const renderVisibleFields = (fields: string[]) => {
    return fields.map((field, index) => (
      <span key={index} className="visible-field">
        {field}
        {getStatusIcon(field)}
        {index < fields.length - 1 && ', '}
      </span>
    ));
  };

  return (
    <IonPage>
      <IonSplitPane contentId="dashboard-content">
        <Sidebar />
        <div className="main-content" id="dashboard-content">
          <DashboardHeader />
          
          <IonContent className="status-mapping-content">
            <div className="mappings-container">
              {/* Header Section */}
              <div className="mappings-header">
                <h1>Status Mapping</h1>
                <p>Manage workflow status mappings and role assignments</p>
              </div>

              {/* Actions */}
              <div className="mappings-actions">
                <IonButton 
                  fill="solid" 
                  className="add-mapping-button"
                  onClick={handleAddNewMapping}
                >
                  <IonIcon icon={addOutline} />
                  Add New Mapping
                </IonButton>
                <IonText className="clear-filters-text">Clear Filters</IonText>
              </div>

              {/* Mappings Table */}
              <IonCard className="mappings-table-card">
                <IonCardContent className="table-container">
                  <table className="mappings-table">
                    <thead>
                      <tr>
                        <th>
                          <div className="table-header">
                            <span>Status</span>
                            <IonIcon icon={searchOutline} className="filter-icon" />
                          </div>
                        </th>
                        <th>
                          <div className="table-header">
                            <span>Role</span>
                            <IonIcon icon={searchOutline} className="filter-icon" />
                          </div>
                        </th>
                        <th>
                          <div className="table-header">
                            <span>Visible Fields</span>
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
                          <td className="status-cell">
                            <span className="status-text">
                              {mapping.status}
                              {getStatusIcon(mapping.status)}
                            </span>
                          </td>
                          <td className="role-cell">
                            <span className="role-text">{mapping.role}</span>
                          </td>
                          <td className="visible-fields-cell">
                            <div className="visible-fields">
                              {renderVisibleFields(mapping.visibleFields)}
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

      {/* Add/Edit Mapping Modal */}
      <IonModal 
        isOpen={showAddModal || showEditModal} 
        onDidDismiss={handleCloseModal}
        backdropDismiss={true}
        showBackdrop={true}
      >
        <div className="mapping-modal">
          <div className="modal-header">
            <h2>{showEditModal ? 'Edit Mapping' : 'Add Mapping'}</h2>
            <IonButton fill="clear" onClick={handleCloseModal} className="close-button">
              <IonIcon icon={closeOutline} />
            </IonButton>
          </div>
          
          <div className="modal-content">
            {/* Current Status Section */}
            <div className="form-section">
              <IonLabel className="section-label">Current Status</IonLabel>
              <IonItem className="form-item">
                <IonInput
                  value={formData.currentStatus}
                  onIonChange={(e) => setFormData({...formData, currentStatus: e.detail.value!})}
                  placeholder="Search and select status"
                />
              </IonItem>
            </div>

            {/* Role Section */}
            <div className="form-section">
              <IonLabel className="section-label">Role</IonLabel>
              <IonItem className="form-item">
                <IonInput
                  value={formData.role}
                  onIonChange={(e) => setFormData({...formData, role: e.detail.value!})}
                  placeholder="Search and select role"
                />
              </IonItem>
            </div>

            {/* Visible Fields Section */}
            <div className="form-section">
              <IonLabel className="section-label">Visible Fields</IonLabel>
              <div className="visible-fields-section">
                <div className="search-field">
                  <IonLabel className="sub-label">Search Field</IonLabel>
                  <IonItem className="form-item">
                    <IonInput
                      placeholder="Search by field name"
                    />
                  </IonItem>
                </div>
                <div className="visible-fields-list">
                  <IonLabel className="sub-label">Visible Fields</IonLabel>
                  <IonIcon icon={swapVerticalOutline} className="reorder-icon" />
                </div>
              </div>
            </div>

            {/* Next Possible Statuses Section */}
            <div className="form-section">
              <IonLabel className="section-label">Next Possible Statuses</IonLabel>
              <IonItem className="form-item">
                <IonInput
                  value={formData.nextPossibleStatuses.join(', ')}
                  onIonChange={(e) => setFormData({...formData, nextPossibleStatuses: e.detail.value!.split(', ').filter(s => s.trim())})}
                  placeholder="Search and select next statuses"
                />
              </IonItem>
            </div>
          </div>

          <div className="modal-footer">
            <IonButton 
              fill="solid" 
              className="save-button"
              onClick={handleSaveMapping}
            >
              Save Mapping
            </IonButton>
            <IonButton 
              fill="clear" 
              className="cancel-button"
              onClick={handleCloseModal}
            >
              Cancel
            </IonButton>
          </div>
        </div>
      </IonModal>

      {/* Delete Confirmation Alert */}
      <IonAlert
        isOpen={showDeleteAlert}
        onDidDismiss={cancelDelete}
        header="Confirm Delete"
        message="Are you sure you want to delete this status mapping? This action cannot be undone."
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

export default StatusMapping;
