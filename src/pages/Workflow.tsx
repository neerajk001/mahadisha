import React, { useState } from 'react';
import {
  IonPage, IonContent, IonSplitPane, IonHeader, IonToolbar, IonTitle,
  IonButton, IonIcon, IonCard, IonCardContent, IonCardHeader, IonCardTitle,
  IonFab, IonFabButton
} from '@ionic/react';
import { IonToast } from '@ionic/react';
import { 
  addOutline, textOutline
} from 'ionicons/icons';
import Sidebar from '../admin/components/sidebar/Sidebar';
import DashboardHeader from '../admin/components/header/DashboardHeader';
import { mockDataService } from '../services/api';
import type { WorkflowData } from '../types';
import './Workflow.css';

const Workflow: React.FC = () => {
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Get workflow data from mock service
  const workflowData = mockDataService.getWorkflowData();

  const handleAddTask = (workflowType: string) => {
    setToastMessage(`Add new ${workflowType} task functionality will be implemented`);
    setShowToast(true);
  };

  return (
    <IonPage>
      <IonSplitPane contentId="dashboard-content">
        <Sidebar />
        <div className="main-content" id="dashboard-content">
          <DashboardHeader />
          
          <IonContent className="workflow-content">
            <div className="workflow-container">
              {/* Header Section */}
              <div className="workflow-header">
                <h1>Workflow Management</h1>
                <p>Manage disbursement and status management workflows</p>
              </div>

              {/* Workflow Cards */}
              <div className="workflow-cards">
                {workflowData.map((workflow, index) => (
                  <IonCard key={workflow.id} className="workflow-card">
                    <IonCardHeader className="workflow-card-header">
                      <IonCardTitle className="workflow-title">{workflow.name}</IonCardTitle>
                      <div className="organization-info">
                        Organization: {workflow.organizationId}
                      </div>
                    </IonCardHeader>
                    <IonCardContent className="workflow-card-content">
                      <div className="task-section">
                        <div className="task-item">
                          <div className="task-name">{workflow.taskName}</div>
                          <div className="task-details">
                            <div className="task-id">Task ID: {workflow.taskId}</div>
                            <div className="next-tasks">Next Tasks: {workflow.nextTasks}</div>
                          </div>
                        </div>
                      </div>
                      <div className="workflow-actions">
                        <IonButton 
                          fill="solid" 
                          size="small"
                          className="add-task-button"
                          onClick={() => handleAddTask(workflow.name)}
                        >
                          <IonIcon icon={addOutline} />
                        </IonButton>
                      </div>
                    </IonCardContent>
                  </IonCard>
                ))}
              </div>
            </div>
          </IonContent>
        </div>
      </IonSplitPane>

      {/* Floating Action Button */}
      <IonFab vertical="bottom" horizontal="end" slot="fixed">
        <IonFabButton className="fab-button">
          <IonIcon icon={textOutline} />
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

export default Workflow;
