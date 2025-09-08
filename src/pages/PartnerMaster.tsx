import React, { useState, useMemo } from 'react';
import {
  IonPage, IonContent, IonSplitPane, IonHeader, IonToolbar, IonTitle,
  IonButton, IonIcon, IonCard, IonCardContent, IonCardHeader, IonCardTitle,
  IonGrid, IonRow, IonCol, IonSpinner, IonAlert, IonToast, IonSearchbar,
  IonModal, IonItem, IonLabel, IonInput
} from '@ionic/react';
import { 
  addOutline, createOutline, trashOutline, searchOutline,
  chevronBackOutline, chevronForwardOutline, closeOutline
} from 'ionicons/icons';
import Sidebar from '../admin/components/sidebar/Sidebar';
import DashboardHeader from '../admin/components/header/DashboardHeader';
import { mockDataService } from '../services/api';
import type { PartnerMasterData } from '../types';
import './PartnerMaster.css';

const PartnerMaster: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [selectedPartnerId, setSelectedPartnerId] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingPartner, setEditingPartner] = useState<PartnerMasterData | null>(null);
  const [editForm, setEditForm] = useState({
    name: '',
    address: '',
    contact: ''
  });

  const itemsPerPage = 5;

  // Get partner master data from mock service
  const allPartners = mockDataService.getPartnerMasterData();
  
  // Filter partners based on search query
  const filteredPartners = useMemo(() => {
    return allPartners.filter(partner =>
      partner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      partner.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      partner.contact.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [allPartners, searchQuery]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredPartners.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPartners = filteredPartners.slice(startIndex, endIndex);

  const handleAddPartner = () => {
    setToastMessage('Add new partner functionality will be implemented');
    setShowToast(true);
  };

  const handleEdit = (partnerId: string) => {
    const partner = allPartners.find(p => p.id === partnerId);
    if (partner) {
      setEditingPartner(partner);
      setEditForm({
        name: partner.name,
        address: partner.address,
        contact: partner.contact
      });
      setShowEditModal(true);
    }
  };

  const handleSaveEdit = () => {
    if (editingPartner) {
      setToastMessage(`Partner "${editForm.name}" updated successfully`);
      setShowToast(true);
      setShowEditModal(false);
      setEditingPartner(null);
      setEditForm({ name: '', address: '', contact: '' });
    }
  };

  const handleCloseEdit = () => {
    setShowEditModal(false);
    setEditingPartner(null);
    setEditForm({ name: '', address: '', contact: '' });
  };

  const handleDelete = (partnerId: string) => {
    setSelectedPartnerId(partnerId);
    setShowDeleteAlert(true);
  };

  const confirmDelete = () => {
    if (selectedPartnerId) {
      setToastMessage(`Delete partner ${selectedPartnerId} functionality will be implemented`);
      setShowToast(true);
      setSelectedPartnerId(null);
    }
    setShowDeleteAlert(false);
  };

  const cancelDelete = () => {
    setSelectedPartnerId(null);
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
          
          <IonContent className="partner-master-content">
            <div className="partners-container">
              {/* Header Section */}
              <div className="partners-header">
                <h1>Partner Master</h1>
                <p>Manage partner organizations and their details</p>
              </div>

              {/* Search and Actions */}
              <div className="partners-actions">
                <IonSearchbar
                  value={searchQuery}
                  onIonChange={(e) => setSearchQuery(e.detail.value!)}
                  placeholder="Search partners by name, address, or contact..."
                  className="partners-search"
                />
                <IonButton 
                  fill="solid" 
                  className="add-partner-button"
                  onClick={handleAddPartner}
                >
                  <IonIcon icon={addOutline} />
                  Add Partner
                </IonButton>
              </div>

              {/* Partners Table */}
              <IonCard className="partners-table-card">
                <IonCardContent className="table-container">
                  <table className="partners-table">
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
                            <span>Address</span>
                            <IonIcon icon={searchOutline} className="filter-icon" />
                          </div>
                        </th>
                        <th>
                          <div className="table-header">
                            <span>Contact</span>
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
                      {currentPartners.map((partner, index) => (
                        <tr key={partner.id} className={index % 2 === 0 ? 'even-row' : 'odd-row'}>
                          <td className="partner-name-cell">
                            <span className="partner-name">{partner.name}</span>
                          </td>
                          <td className="partner-address-cell">
                            <span className="partner-address">{partner.address}</span>
                          </td>
                          <td className="partner-contact-cell">
                            <span className="partner-contact">{partner.contact}</span>
                          </td>
                          <td className="actions-cell">
                            <div className="action-buttons">
                              <IonButton 
                                fill="clear" 
                                size="small" 
                                className="edit-button"
                                onClick={() => handleEdit(partner.id)}
                              >
                                <IonIcon icon={createOutline} />
                              </IonButton>
                              <IonButton 
                                fill="clear" 
                                size="small" 
                                className="delete-button"
                                onClick={() => handleDelete(partner.id)}
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
                    Showing {startIndex + 1} to {Math.min(endIndex, filteredPartners.length)} of {filteredPartners.length} partners
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

      {/* Edit Modal */}
      <IonModal 
        isOpen={showEditModal} 
        onDidDismiss={handleCloseEdit}
        backdropDismiss={true}
        showBackdrop={true}
      >
        <div className="edit-modal">
          <div className="modal-header">
            <h2>Edit Partner</h2>
            <IonButton fill="clear" onClick={handleCloseEdit} className="close-button">
              <IonIcon icon={closeOutline} />
            </IonButton>
          </div>
          
          <div className="modal-content">
            <IonItem className="form-item">
              <IonLabel position="stacked">Partner Name</IonLabel>
              <IonInput
                value={editForm.name}
                onIonChange={(e) => setEditForm({...editForm, name: e.detail.value!})}
                placeholder="Enter partner name"
              />
            </IonItem>

            <IonItem className="form-item">
              <IonLabel position="stacked">Address</IonLabel>
              <IonInput
                value={editForm.address}
                onIonChange={(e) => setEditForm({...editForm, address: e.detail.value!})}
                placeholder="Enter address"
              />
            </IonItem>

            <IonItem className="form-item">
              <IonLabel position="stacked">Contact</IonLabel>
              <IonInput
                value={editForm.contact}
                onIonChange={(e) => setEditForm({...editForm, contact: e.detail.value!})}
                placeholder="Enter contact number"
              />
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
        message="Are you sure you want to delete this partner? This action cannot be undone."
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

export default PartnerMaster;
