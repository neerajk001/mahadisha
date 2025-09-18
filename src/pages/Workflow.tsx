import React, { useState, useMemo } from 'react';
import {
  IonPage, IonContent, IonSplitPane, IonHeader, IonToolbar, IonTitle,
  IonButton, IonIcon, IonCard, IonCardContent, IonCardHeader, IonCardTitle,
  IonFab, IonFabButton, IonModal, IonItem, IonLabel, IonInput, IonTextarea,
  IonSelect, IonSelectOption, IonBadge, IonChip, IonSearchbar, IonGrid,
  IonRow, IonCol, IonProgressBar, IonAlert, IonButtons
} from '@ionic/react';
import { IonToast } from '@ionic/react';
import { 
  addOutline, textOutline, playOutline, pauseOutline, stopOutline,
  checkmarkOutline, closeOutline, createOutline, trashOutline, eyeOutline,
  timeOutline, personOutline, flagOutline, analyticsOutline, notificationsOutline,
  refreshOutline, filterOutline, searchOutline, listOutline, barChartOutline,
  settingsOutline, playCircleOutline, pauseCircleOutline, stopCircleOutline
} from 'ionicons/icons';
import Sidebar from '../admin/components/sidebar/Sidebar';
import DashboardHeader from '../admin/components/header/DashboardHeader';
import ActionDropdown from '../admin/components/common/ActionDropdown';
import { mockDataService } from '../services/api';
import type { WorkflowData } from '../types';
import './Workflow.css';

// Extended interfaces for enhanced functionality
interface TaskData {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  assignedTo: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate: string;
  workflowId: string;
  createdAt: string;
  updatedAt: string;
}

interface WorkflowInstance {
  id: string;
  workflowId: string;
  status: 'running' | 'paused' | 'completed' | 'stopped';
  progress: number;
  currentTask: string;
  startedAt: string;
  completedAt?: string;
}

const Workflow: React.FC = () => {
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [activeTab, setActiveTab] = useState('workflows');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Task Management States
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [showEditTaskModal, setShowEditTaskModal] = useState(false);
  const [showViewTaskModal, setShowViewTaskModal] = useState(false);
  const [selectedWorkflowId, setSelectedWorkflowId] = useState<string>('');
  const [editingTask, setEditingTask] = useState<TaskData | null>(null);
  const [viewingTask, setViewingTask] = useState<TaskData | null>(null);
  const [taskForm, setTaskForm] = useState({
    name: '',
    description: '',
    assignedTo: '',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent',
    dueDate: ''
  });

  // Workflow Execution States
  const [workflowInstances, setWorkflowInstances] = useState<WorkflowInstance[]>([]);
  const [showExecutionModal, setShowExecutionModal] = useState(false);
  const [selectedWorkflowForExecution, setSelectedWorkflowForExecution] = useState<WorkflowData | null>(null);

  // Analytics States
  const [analyticsData, setAnalyticsData] = useState({
    totalWorkflows: 0,
    activeInstances: 0,
    completedTasks: 0,
    pendingTasks: 0,
    averageCompletionTime: 0
  });

  // Task Management State
  const [tasks, setTasks] = useState<TaskData[]>([
    {
      id: 'task_1',
      name: 'Review Application',
      description: 'Review loan application documents',
      status: 'in-progress',
      assignedTo: 'John Doe',
      priority: 'high',
      dueDate: '2024-01-15',
      workflowId: 'workflow_1',
      createdAt: '2024-01-10T10:00:00Z',
      updatedAt: '2024-01-10T10:00:00Z'
    },
    {
      id: 'task_2',
      name: 'Credit Check',
      description: 'Perform credit verification',
      status: 'pending',
      assignedTo: 'Jane Smith',
      priority: 'medium',
      dueDate: '2024-01-16',
      workflowId: 'workflow_1',
      createdAt: '2024-01-10T10:00:00Z',
      updatedAt: '2024-01-10T10:00:00Z'
    },
    {
      id: 'task_3',
      name: 'Approval Decision',
      description: 'Make final approval decision',
      status: 'completed',
      assignedTo: 'Mike Johnson',
      priority: 'urgent',
      dueDate: '2024-01-14',
      workflowId: 'workflow_2',
      createdAt: '2024-01-10T10:00:00Z',
      updatedAt: '2024-01-12T15:30:00Z'
    }
  ]);

  // State for managing workflow data - EXACTLY LIKE MANAGEPAGES
  const [workflowData, setWorkflowData] = useState<WorkflowData[]>(() => mockDataService.getWorkflowData());

  // Filter tasks based on search query
  const filteredTasks = useMemo(() => {
    return tasks.filter(task =>
      task.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.assignedTo.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [tasks, searchQuery]);

  // Calculate analytics data
  const calculateAnalytics = () => {
    const totalWorkflows = workflowData.length;
    const activeInstances = workflowInstances.filter(instance => instance.status === 'running').length;
    const completedTasks = tasks.filter(task => task.status === 'completed').length;
    const pendingTasks = tasks.filter(task => task.status === 'pending' || task.status === 'in-progress').length;
    const averageCompletionTime = 2.5; // Mock data

    setAnalyticsData({
      totalWorkflows,
      activeInstances,
      completedTasks,
      pendingTasks,
      averageCompletionTime
    });
  };

  // Initialize analytics on component mount
  React.useEffect(() => {
    calculateAnalytics();
  }, [workflowInstances, tasks]);

  // Task Management Handlers
  const handleAddTask = (workflowId: string) => {
    setSelectedWorkflowId(workflowId);
    setTaskForm({
      name: '',
      description: '',
      assignedTo: '',
      priority: 'medium',
      dueDate: ''
    });
    setShowAddTaskModal(true);
  };

  const handleSaveTask = () => {
    if (!taskForm.name.trim() || !taskForm.assignedTo.trim()) {
      setToastMessage('Please fill in all required fields');
      setShowToast(true);
      return;
    }

    const newTask: TaskData = {
      id: `task_${Date.now()}`,
      name: taskForm.name.trim(),
      description: taskForm.description.trim(),
      status: 'pending',
      assignedTo: taskForm.assignedTo.trim(),
      priority: taskForm.priority,
      dueDate: taskForm.dueDate,
      workflowId: selectedWorkflowId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setTasks(prev => [...prev, newTask]);
    setToastMessage(`Task "${taskForm.name}" added successfully`);
    setShowToast(true);
    setShowAddTaskModal(false);
  };

  const handleEditTask = (task: TaskData) => {
    setEditingTask(task);
    setTaskForm({
      name: task.name,
      description: task.description,
      assignedTo: task.assignedTo,
      priority: task.priority,
      dueDate: task.dueDate
    });
    setShowEditTaskModal(true);
  };

  const handleUpdateTask = () => {
    if (!editingTask) return;

    setTasks(prev => prev.map(task => 
      task.id === editingTask.id 
        ? { ...task, ...taskForm, updatedAt: new Date().toISOString() }
        : task
    ));

    setToastMessage(`Task "${taskForm.name}" updated successfully`);
    setShowToast(true);
    setShowEditTaskModal(false);
    setEditingTask(null);
  };

  const handleViewTask = (task: TaskData) => {
    setViewingTask(task);
    setShowViewTaskModal(true);
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
    setToastMessage('Task deleted successfully');
    setShowToast(true);
  };

  const handleUpdateTaskStatus = (taskId: string, status: TaskData['status']) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { ...task, status, updatedAt: new Date().toISOString() }
        : task
    ));
    setToastMessage(`Task status updated to ${status}`);
    setShowToast(true);
  };

  // Workflow Execution Handlers
  const handleStartWorkflow = (workflow: WorkflowData) => {
    setSelectedWorkflowForExecution(workflow);
    setShowExecutionModal(true);
  };

  const handleExecuteWorkflow = () => {
    if (!selectedWorkflowForExecution) return;

    const newInstance: WorkflowInstance = {
      id: `instance_${Date.now()}`,
      workflowId: selectedWorkflowForExecution.id,
      status: 'running',
      progress: 0,
      currentTask: selectedWorkflowForExecution.taskName,
      startedAt: new Date().toISOString()
    };

    setWorkflowInstances(prev => [...prev, newInstance]);
    setToastMessage(`Workflow "${selectedWorkflowForExecution.name}" started successfully`);
    setShowToast(true);
    setShowExecutionModal(false);
  };

  const handleControlWorkflow = (instanceId: string, action: 'pause' | 'resume' | 'stop') => {
    setWorkflowInstances(prev => prev.map(instance => {
      if (instance.id === instanceId) {
        let newStatus = instance.status;
        let newProgress = instance.progress;

        switch (action) {
          case 'pause':
            newStatus = 'paused';
            break;
          case 'resume':
            newStatus = 'running';
            break;
          case 'stop':
            newStatus = 'stopped';
            newProgress = 0;
            break;
        }

        return { ...instance, status: newStatus, progress: newProgress };
      }
      return instance;
    }));

    setToastMessage(`Workflow ${action}ed successfully`);
    setShowToast(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'success';
      case 'paused': return 'warning';
      case 'completed': return 'primary';
      case 'stopped': return 'danger';
      case 'pending': return 'medium';
      case 'in-progress': return 'warning';
      case 'failed': return 'danger';
      default: return 'medium';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'danger';
      case 'high': return 'warning';
      case 'medium': return 'primary';
      case 'low': return 'medium';
      default: return 'medium';
    }
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

              {/* Analytics Dashboard */}
              <div className="analytics-section">
                <IonGrid>
                  <IonRow>
                    <IonCol size="12" sizeMd="3">
                      <IonCard className="analytics-card">
                        <IonCardContent>
                          <div className="analytics-item">
                            <IonIcon icon={listOutline} className="analytics-icon" />
                            <div className="analytics-content">
                              <h3>{analyticsData.totalWorkflows}</h3>
                              <p>Total Workflows</p>
                            </div>
                          </div>
                        </IonCardContent>
                      </IonCard>
                    </IonCol>
                    <IonCol size="12" sizeMd="3">
                      <IonCard className="analytics-card">
                        <IonCardContent>
                          <div className="analytics-item">
                            <IonIcon icon={playCircleOutline} className="analytics-icon" />
                            <div className="analytics-content">
                              <h3>{analyticsData.activeInstances}</h3>
                              <p>Active Instances</p>
                            </div>
                          </div>
                        </IonCardContent>
                      </IonCard>
                    </IonCol>
                    <IonCol size="12" sizeMd="3">
                      <IonCard className="analytics-card">
                        <IonCardContent>
                          <div className="analytics-item">
                            <IonIcon icon={checkmarkOutline} className="analytics-icon" />
                            <div className="analytics-content">
                              <h3>{analyticsData.completedTasks}</h3>
                              <p>Completed Tasks</p>
                            </div>
                          </div>
                        </IonCardContent>
                      </IonCard>
                    </IonCol>
                    <IonCol size="12" sizeMd="3">
                      <IonCard className="analytics-card">
                        <IonCardContent>
                          <div className="analytics-item">
                            <IonIcon icon={timeOutline} className="analytics-icon" />
                            <div className="analytics-content">
                              <h3>{analyticsData.averageCompletionTime}h</h3>
                              <p>Avg. Completion Time</p>
                            </div>
                          </div>
                        </IonCardContent>
                      </IonCard>
                    </IonCol>
                  </IonRow>
                </IonGrid>
              </div>

              {/* Custom Tab Navigation */}
              <div className="custom-tab-bar">
                <IonButton 
                  fill={activeTab === 'workflows' ? 'solid' : 'outline'}
                  onClick={() => setActiveTab('workflows')}
                  className="tab-button"
                >
                  <IonIcon icon={listOutline} slot="start" />
                  Workflows
                </IonButton>
                <IonButton 
                  fill={activeTab === 'tasks' ? 'solid' : 'outline'}
                  onClick={() => setActiveTab('tasks')}
                  className="tab-button"
                >
                  <IonIcon icon={checkmarkOutline} slot="start" />
                  Tasks
                </IonButton>
                <IonButton 
                  fill={activeTab === 'instances' ? 'solid' : 'outline'}
                  onClick={() => setActiveTab('instances')}
                  className="tab-button"
                >
                  <IonIcon icon={playCircleOutline} slot="start" />
                  Instances
                </IonButton>
              </div>

              {/* Tab Content */}
              <div className="tab-content">
                {/* Workflows Tab */}
                {activeTab === 'workflows' && (
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
                              className="start-workflow-button"
                              onClick={() => handleStartWorkflow(workflow)}
                            >
                              <IonIcon icon={playOutline} />
                            </IonButton>
                        <IonButton 
                          fill="solid" 
                          size="small"
                          className="add-task-button"
                              onClick={() => handleAddTask(workflow.id)}
                        >
                          <IonIcon icon={addOutline} />
                        </IonButton>
                      </div>
                    </IonCardContent>
                  </IonCard>
                ))}
                  </div>
                )}

                {/* Tasks Tab */}
                {activeTab === 'tasks' && (
                  <div className="task-management-section">
                    <div className="task-header">
                      <IonSearchbar
                        value={searchQuery}
                        onIonChange={(e) => setSearchQuery(e.detail.value!)}
                        placeholder="Search tasks..."
                        className="task-search"
                      />
                    </div>

                    <div className="task-list">
                      {filteredTasks.map((task) => (
                        <IonCard key={task.id} className="task-card">
                          <IonCardContent>
                            <div className="task-card-content">
                              <div className="task-info">
                                <div className="task-name-row">
                                  <h3>{task.name}</h3>
                                  <IonBadge color={getStatusColor(task.status)}>
                                    {task.status.replace('-', ' ')}
                                  </IonBadge>
                                </div>
                                <p className="task-description">{task.description}</p>
                                <div className="task-meta">
                                  <IonChip color={getPriorityColor(task.priority)}>
                                    <IonIcon icon={flagOutline} />
                                    <IonLabel>{task.priority}</IonLabel>
                                  </IonChip>
                                  <IonChip>
                                    <IonIcon icon={personOutline} />
                                    <IonLabel>{task.assignedTo}</IonLabel>
                                  </IonChip>
                                  <IonChip>
                                    <IonIcon icon={timeOutline} />
                                    <IonLabel>{new Date(task.dueDate).toLocaleDateString()}</IonLabel>
                                  </IonChip>
                                </div>
                              </div>
                              <div className="task-actions">
                                <ActionDropdown
                                  itemId={task.id}
                                  onView={() => handleViewTask(task)}
                                  onEdit={() => handleEditTask(task)}
                                  onDelete={() => handleDeleteTask(task.id)}
                                  showView={true}
                                  size="small"
                                />
                              </div>
                            </div>
                          </IonCardContent>
                        </IonCard>
                      ))}
                    </div>
                  </div>
                )}

                {/* Instances Tab */}
                {activeTab === 'instances' && (
                  <div className="instances-section">
                    <div className="instances-list">
                      {workflowInstances.map((instance) => {
                        const workflow = workflowData.find(w => w.id === instance.workflowId);
                        return (
                          <IonCard key={instance.id} className="instance-card">
                            <IonCardContent>
                              <div className="instance-content">
                                <div className="instance-info">
                                  <h3>{workflow?.name || 'Unknown Workflow'}</h3>
                                  <div className="instance-meta">
                                    <IonBadge color={getStatusColor(instance.status)}>
                                      {instance.status}
                                    </IonBadge>
                                    <span>Started: {new Date(instance.startedAt).toLocaleString()}</span>
                                  </div>
                                  <div className="progress-section">
                                    <IonProgressBar value={instance.progress / 100} />
                                    <span>{instance.progress}% Complete</span>
                                  </div>
                                  <p>Current Task: {instance.currentTask}</p>
                                </div>
                                <div className="instance-actions">
                                  {instance.status === 'running' && (
                                    <IonButton 
                                      fill="outline" 
                                      size="small"
                                      onClick={() => handleControlWorkflow(instance.id, 'pause')}
                                    >
                                      <IonIcon icon={pauseOutline} />
                                    </IonButton>
                                  )}
                                  {instance.status === 'paused' && (
                                    <IonButton 
                                      fill="outline" 
                                      size="small"
                                      onClick={() => handleControlWorkflow(instance.id, 'resume')}
                                    >
                                      <IonIcon icon={playOutline} />
                                    </IonButton>
                                  )}
                                  <IonButton 
                                    fill="outline" 
                                    size="small"
                                    color="danger"
                                    onClick={() => handleControlWorkflow(instance.id, 'stop')}
                                  >
                                    <IonIcon icon={stopOutline} />
                                  </IonButton>
                                </div>
                              </div>
                            </IonCardContent>
                          </IonCard>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </IonContent>
        </div>
      </IonSplitPane>

      {/* Add Task Modal */}
      <IonModal isOpen={showAddTaskModal} onDidDismiss={() => setShowAddTaskModal(false)}>
        <IonContent className="add-task-modal">
          <div className="modal-header">
            <h2>Add New Task</h2>
            <IonButton fill="clear" onClick={() => setShowAddTaskModal(false)}>
              <IonIcon icon={closeOutline} />
            </IonButton>
          </div>
          
          <div className="modal-content">
            <div className="form-group">
              <IonLabel className="form-label">Task Name *</IonLabel>
              <IonInput
                value={taskForm.name}
                onIonChange={(e) => setTaskForm(prev => ({ ...prev, name: e.detail.value! }))}
                placeholder="Enter task name"
                className="form-input"
              />
            </div>
            
            <div className="form-group">
              <IonLabel className="form-label">Description</IonLabel>
              <IonTextarea
                value={taskForm.description}
                onIonChange={(e) => setTaskForm(prev => ({ ...prev, description: e.detail.value! }))}
                placeholder="Enter task description"
                className="form-textarea"
              />
            </div>

            <div className="form-group">
              <IonLabel className="form-label">Assigned To *</IonLabel>
              <IonInput
                value={taskForm.assignedTo}
                onIonChange={(e) => setTaskForm(prev => ({ ...prev, assignedTo: e.detail.value! }))}
                placeholder="Enter assignee name"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <IonLabel className="form-label">Priority</IonLabel>
              <IonSelect
                value={taskForm.priority}
                onIonChange={(e) => setTaskForm(prev => ({ ...prev, priority: e.detail.value }))}
                className="form-select"
              >
                <IonSelectOption value="low">Low</IonSelectOption>
                <IonSelectOption value="medium">Medium</IonSelectOption>
                <IonSelectOption value="high">High</IonSelectOption>
                <IonSelectOption value="urgent">Urgent</IonSelectOption>
              </IonSelect>
            </div>

            <div className="form-group">
              <IonLabel className="form-label">Due Date</IonLabel>
              <IonInput
                type="date"
                value={taskForm.dueDate}
                onIonChange={(e) => setTaskForm(prev => ({ ...prev, dueDate: e.detail.value! }))}
                className="form-input"
              />
            </div>
          </div>
          
          <div className="modal-actions">
            <IonButton 
              fill="solid"
              onClick={handleSaveTask}
              className="add-button"
            >
              <IonIcon icon={checkmarkOutline} slot="start" />
              ADD TASK
            </IonButton>
            <IonButton 
              fill="outline"
              onClick={() => setShowAddTaskModal(false)}
              className="cancel-button"
            >
              CANCEL
            </IonButton>
          </div>
        </IonContent>
      </IonModal>

      {/* Edit Task Modal */}
      <IonModal isOpen={showEditTaskModal} onDidDismiss={() => setShowEditTaskModal(false)}>
        <IonContent className="add-task-modal">
          <div className="modal-header">
            <h2>Edit Task</h2>
            <IonButton fill="clear" onClick={() => setShowEditTaskModal(false)}>
              <IonIcon icon={closeOutline} />
            </IonButton>
          </div>
          
          <div className="modal-content">
            <div className="form-group">
              <IonLabel className="form-label">Task Name *</IonLabel>
              <IonInput
                value={taskForm.name}
                onIonChange={(e) => setTaskForm(prev => ({ ...prev, name: e.detail.value! }))}
                placeholder="Enter task name"
                className="form-input"
              />
            </div>
            
            <div className="form-group">
              <IonLabel className="form-label">Description</IonLabel>
              <IonTextarea
                value={taskForm.description}
                onIonChange={(e) => setTaskForm(prev => ({ ...prev, description: e.detail.value! }))}
                placeholder="Enter task description"
                className="form-textarea"
              />
            </div>

            <div className="form-group">
              <IonLabel className="form-label">Assigned To *</IonLabel>
              <IonInput
                value={taskForm.assignedTo}
                onIonChange={(e) => setTaskForm(prev => ({ ...prev, assignedTo: e.detail.value! }))}
                placeholder="Enter assignee name"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <IonLabel className="form-label">Priority</IonLabel>
              <IonSelect
                value={taskForm.priority}
                onIonChange={(e) => setTaskForm(prev => ({ ...prev, priority: e.detail.value }))}
                className="form-select"
              >
                <IonSelectOption value="low">Low</IonSelectOption>
                <IonSelectOption value="medium">Medium</IonSelectOption>
                <IonSelectOption value="high">High</IonSelectOption>
                <IonSelectOption value="urgent">Urgent</IonSelectOption>
              </IonSelect>
            </div>

            <div className="form-group">
              <IonLabel className="form-label">Due Date</IonLabel>
              <IonInput
                type="date"
                value={taskForm.dueDate}
                onIonChange={(e) => setTaskForm(prev => ({ ...prev, dueDate: e.detail.value! }))}
                className="form-input"
              />
            </div>
          </div>
          
          <div className="modal-actions">
            <IonButton 
              fill="solid"
              onClick={handleUpdateTask}
              className="add-button"
            >
              <IonIcon icon={checkmarkOutline} slot="start" />
              UPDATE TASK
            </IonButton>
            <IonButton 
              fill="outline"
              onClick={() => setShowEditTaskModal(false)}
              className="cancel-button"
            >
              CANCEL
            </IonButton>
          </div>
        </IonContent>
      </IonModal>

      {/* View Task Modal */}
      <IonModal isOpen={showViewTaskModal} onDidDismiss={() => setShowViewTaskModal(false)}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Task Details</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => setShowViewTaskModal(false)}>
                <IonIcon icon={closeOutline} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="view-modal-content">
          {viewingTask && (
            <div>
              <IonItem>
                <IonLabel>
                  <h2>Task Name</h2>
                  <p>{viewingTask.name}</p>
                </IonLabel>
              </IonItem>
              <IonItem>
                <IonLabel>
                  <h2>Description</h2>
                  <p>{viewingTask.description}</p>
                </IonLabel>
              </IonItem>
              <IonItem>
                <IonLabel>
                  <h2>Status</h2>
                  <p>{viewingTask.status}</p>
                </IonLabel>
              </IonItem>
              <IonItem>
                <IonLabel>
                  <h2>Assigned To</h2>
                  <p>{viewingTask.assignedTo}</p>
                </IonLabel>
              </IonItem>
              <IonItem>
                <IonLabel>
                  <h2>Priority</h2>
                  <p>{viewingTask.priority}</p>
                </IonLabel>
              </IonItem>
              <IonItem>
                <IonLabel>
                  <h2>Due Date</h2>
                  <p>{new Date(viewingTask.dueDate).toLocaleDateString()}</p>
                </IonLabel>
              </IonItem>
              <IonItem>
                <IonLabel>
                  <h2>Created At</h2>
                  <p>{new Date(viewingTask.createdAt).toLocaleString()}</p>
                </IonLabel>
              </IonItem>
            </div>
          )}
        </IonContent>
      </IonModal>

      {/* Workflow Execution Modal */}
      <IonModal isOpen={showExecutionModal} onDidDismiss={() => setShowExecutionModal(false)}>
        <IonContent className="add-task-modal">
          <div className="modal-header">
            <h2>Start Workflow</h2>
            <IonButton fill="clear" onClick={() => setShowExecutionModal(false)}>
              <IonIcon icon={closeOutline} />
            </IonButton>
          </div>
          
          <div className="modal-content">
            {selectedWorkflowForExecution && (
              <div>
                <h3>{selectedWorkflowForExecution.name}</h3>
                <p>Organization: {selectedWorkflowForExecution.organizationId}</p>
                <p>Initial Task: {selectedWorkflowForExecution.taskName}</p>
                <p>Are you sure you want to start this workflow?</p>
              </div>
            )}
          </div>
          
          <div className="modal-actions">
            <IonButton 
              fill="solid"
              onClick={handleExecuteWorkflow}
              className="add-button"
            >
              <IonIcon icon={playOutline} slot="start" />
              START WORKFLOW
            </IonButton>
            <IonButton 
              fill="outline"
              onClick={() => setShowExecutionModal(false)}
              className="cancel-button"
            >
              CANCEL
            </IonButton>
          </div>
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

export default Workflow;