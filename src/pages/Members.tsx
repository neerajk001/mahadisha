import React, { useState, useMemo } from 'react';
import {
  IonPage, IonContent, IonSplitPane, IonHeader, IonToolbar, IonTitle,
  IonButton, IonIcon, IonCard, IonCardContent, IonCardHeader, IonCardTitle,
  IonChip, IonFab, IonFabButton, IonToast
} from '@ionic/react';
import { 
  downloadOutline, searchOutline, accessibilityOutline,
  createOutline, trashOutline, checkmarkOutline, pauseOutline
} from 'ionicons/icons';
import Sidebar from '../admin/components/sidebar/Sidebar';
import DashboardHeader from '../admin/components/header/DashboardHeader';
import { mockDataService } from '../services/api';
import type { MembersData } from '../types';
import './Members.css';

const Members: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Get members data from mock service
  const allMembers = mockDataService.getMembersData();
  
  // Filter members based on search query
  const filteredMembers = useMemo(() => {
    return allMembers.filter(member =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.phone.includes(searchQuery) ||
      member.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.status.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [allMembers, searchQuery]);

  const handleExportToExcel = () => {
    setToastMessage('Export to Excel functionality will be implemented');
    setShowToast(true);
  };

  const handleRoleHistory = (memberId: string) => {
    setToastMessage(`Role History for member ${memberId} will be implemented`);
    setShowToast(true);
  };

  const handleActivate = (memberId: string) => {
    setToastMessage(`Activate member ${memberId} functionality will be implemented`);
    setShowToast(true);
  };

  const handleSuspend = (memberId: string) => {
    setToastMessage(`Suspend member ${memberId} functionality will be implemented`);
    setShowToast(true);
  };

  const handleEdit = (memberId: string) => {
    setToastMessage(`Edit member ${memberId} functionality will be implemented`);
    setShowToast(true);
  };

  const handleDelete = (memberId: string) => {
    setToastMessage(`Delete member ${memberId} functionality will be implemented`);
    setShowToast(true);
  };

  const getStatusColor = (status: string) => {
    return status === 'Active' ? 'success' : 'danger';
  };

  return (
    <IonPage>
      <IonSplitPane contentId="dashboard-content">
        <Sidebar />
        <div className="main-content" id="dashboard-content">
          <DashboardHeader />
          
          <IonContent className="members-content">
            <div className="members-container">
              {/* Header Section */}
              <div className="members-header">
                <h1>Members</h1>
                <IonButton 
                  fill="solid" 
                  className="export-button"
                  onClick={handleExportToExcel}
                >
                  <IonIcon icon={downloadOutline} />
                  Export to Excel
                </IonButton>
              </div>

              {/* Members Table */}
              <IonCard className="members-table-card">
                <IonCardContent className="table-container">
                  <table className="members-table">
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
                            <span>Email</span>
                            <IonIcon icon={searchOutline} className="filter-icon" />
                          </div>
                        </th>
                        <th>
                          <div className="table-header">
                            <span>Phone</span>
                            <IonIcon icon={searchOutline} className="filter-icon" />
                          </div>
                        </th>
                        <th>
                          <div className="table-header">
                            <span>District</span>
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
                            <span>Status</span>
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
                      {filteredMembers.map((member, index) => (
                        <tr key={member.id} className={index % 2 === 0 ? 'even-row' : 'odd-row'}>
                          <td className="name-cell">
                            <span className="member-name">{member.name}</span>
                          </td>
                          <td className="email-cell">
                            <span className="member-email">{member.email}</span>
                          </td>
                          <td className="phone-cell">
                            <span className="member-phone">{member.phone}</span>
                          </td>
                          <td className="district-cell">
                            <span className="member-district">{member.district || '-'}</span>
                          </td>
                          <td className="role-cell">
                            <div className="role-section">
                              <span className="member-role">{member.role}</span>
                              <IonButton 
                                fill="solid" 
                                size="small" 
                                className="role-history-button"
                                onClick={() => handleRoleHistory(member.id)}
                              >
                                Role History ({member.roleHistoryCount})
                              </IonButton>
                            </div>
                          </td>
                          <td className="status-cell">
                            <IonChip 
                              color={getStatusColor(member.status)}
                              className="status-chip"
                            >
                              {member.status}
                            </IonChip>
                          </td>
                          <td className="actions-cell">
                            <div className="actions-section">
                              {member.status === 'Active' ? (
                                <>
                                  <IonButton 
                                    fill="solid" 
                                    size="small" 
                                    className="suspend-button"
                                    onClick={() => handleSuspend(member.id)}
                                  >
                                    <IonIcon icon={pauseOutline} />
                                    Suspend
                                  </IonButton>
                                  <div className="icon-buttons">
                                    <IonButton 
                                      fill="solid" 
                                      size="small" 
                                      className="edit-button"
                                      onClick={() => handleEdit(member.id)}
                                    >
                                      <IonIcon icon={createOutline} />
                                    </IonButton>
                                    <IonButton 
                                      fill="solid" 
                                      size="small" 
                                      className="delete-button"
                                      onClick={() => handleDelete(member.id)}
                                    >
                                      <IonIcon icon={trashOutline} />
                                    </IonButton>
                                  </div>
                                </>
                              ) : (
                                <IonButton 
                                  fill="solid" 
                                  size="small" 
                                  className="activate-button"
                                  onClick={() => handleActivate(member.id)}
                                >
                                  <IonIcon icon={checkmarkOutline} />
                                  Activate
                                </IonButton>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </IonCardContent>
              </IonCard>
            </div>
          </IonContent>
        </div>
      </IonSplitPane>

      {/* Floating Action Button */}
      <IonFab vertical="bottom" horizontal="end" slot="fixed">
        <IonFabButton className="fab-button">
          <IonIcon icon={accessibilityOutline} />
        </IonFabButton>
      </IonFab>

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

export default Members;
