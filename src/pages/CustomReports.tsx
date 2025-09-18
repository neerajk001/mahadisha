import React, { useState } from 'react';
import {
  IonPage, IonContent, IonSplitPane, IonHeader, IonToolbar, IonTitle,
  IonButton, IonIcon, IonCard, IonCardContent, IonCardHeader, IonCardTitle,
  IonGrid, IonRow, IonCol, IonChip, IonSpinner, IonAlert, IonToast,
  IonModal, IonButtons, IonSelect, IonSelectOption, IonSearchbar, IonBadge,
  IonFab, IonFabButton
} from '@ionic/react';
import { 
  chevronDownOutline, chevronUpOutline, filterOutline, 
  analyticsOutline, downloadOutline, refreshOutline, addOutline,
  barChartOutline, pieChartOutline, trendingUpOutline, trendingDownOutline,
  eyeOutline, settingsOutline, shareOutline, printOutline, mailOutline,
  calendarOutline, locationOutline, peopleOutline, cashOutline,
  checkmarkCircleOutline, alertCircleOutline, timeOutline, starOutline,
  documentTextOutline, closeOutline, cloudDownloadOutline
} from 'ionicons/icons';
import Sidebar from '../admin/components/sidebar/Sidebar';
import DashboardHeader from '../admin/components/header/DashboardHeader';
import { mockDataService } from '../services/api';
import type { ReportData } from '../types';
import './CustomReports.css';

const CustomReports: React.FC = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [showAIInsights, setShowAIInsights] = useState(false);
  const [showReportTable, setShowReportTable] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  
  // Enhanced state for new functionality
  const [showExportModal, setShowExportModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('totalAmount');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  // Get report data from mock service
  const reportData = mockDataService.getReportData();

  const handleExport = (format: 'pdf' | 'excel' | 'csv') => {
    setToastMessage(`${format.toUpperCase()} export started successfully`);
    setShowToast(true);
    setShowExportModal(false);
  };

  const handleRefresh = () => {
    setToastMessage('Data refreshed successfully');
    setShowToast(true);
  };

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-IN').format(num);
  };

  return (
    <IonPage>
      <IonSplitPane contentId="dashboard-content">
        <Sidebar />
        <div className="main-content" id="dashboard-content">
          <DashboardHeader />
          
          <IonContent className="custom-reports-content">
            <div className="reports-container">
              {/* Enhanced Filters Section */}
              <IonCard className="section-card">
                <IonCardHeader 
                  className="section-header"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <IonCardTitle className="section-title">
                    <IonIcon icon={filterOutline} className="section-icon" />
                    Advanced Filters
                    <IonBadge color="primary" style={{ marginLeft: '0.5rem' }}>
                      {searchQuery ? '1' : '0'}
                    </IonBadge>
                  </IonCardTitle>
                  <IonIcon 
                    icon={showFilters ? chevronUpOutline : chevronDownOutline} 
                    className="chevron-icon"
                  />
                </IonCardHeader>
                {showFilters && (
                  <IonCardContent className="section-content">
                    {/* Search Bar */}
                    <IonSearchbar
                      value={searchQuery}
                      onIonChange={(e) => setSearchQuery(e.detail.value!)}
                      placeholder="Search schemes, users, amounts..."
                      className="custom-search"
                      style={{ marginBottom: '1.5rem' }}
                    />
                    
                    <div className="filters-grid">
                      <div className="filter-item">
                        <label><IonIcon icon={calendarOutline} style={{ marginRight: '0.5rem' }} />Date Range</label>
                        <input type="date" />
                      </div>
                      <div className="filter-item">
                        <label><IonIcon icon={documentTextOutline} style={{ marginRight: '0.5rem' }} />Scheme</label>
                        <select>
                          <option>All Schemes</option>
                          <option>Margin Money Scheme</option>
                          <option>Education Loan Scheme</option>
                          <option>Business Loan Scheme</option>
                          <option>Agriculture Loan Scheme</option>
                        </select>
                      </div>
                      <div className="filter-item">
                        <label><IonIcon icon={checkmarkCircleOutline} style={{ marginRight: '0.5rem' }} />Status</label>
                        <select>
                          <option>All Status</option>
                          <option>Active</option>
                          <option>Completed</option>
                          <option>Pending</option>
                          <option>Rejected</option>
                        </select>
                      </div>
                      <div className="filter-item">
                        <label><IonIcon icon={locationOutline} style={{ marginRight: '0.5rem' }} />District</label>
                        <select>
                          <option>All Districts</option>
                          <option>Mumbai</option>
                          <option>Pune</option>
                          <option>Dhule</option>
                          <option>Nashik</option>
                          <option>Nagpur</option>
                        </select>
                      </div>
                      <div className="filter-item">
                        <label><IonIcon icon={cashOutline} style={{ marginRight: '0.5rem' }} />Amount Range</label>
                        <select>
                          <option>All Amounts</option>
                          <option>0 - 50,000</option>
                          <option>50,000 - 1,00,000</option>
                          <option>1,00,000 - 5,00,000</option>
                          <option>5,00,000+</option>
                        </select>
                      </div>
                      <div className="filter-item">
                        <label><IonIcon icon={timeOutline} style={{ marginRight: '0.5rem' }} />Loan Term</label>
                        <select>
                          <option>All Terms</option>
                          <option>0-1 years</option>
                          <option>1-3 years</option>
                          <option>3-5 years</option>
                          <option>5+ years</option>
                        </select>
                      </div>
                    </div>
                  </IonCardContent>
                )}
              </IonCard>

              {/* Enhanced AI Insights Section */}
              <IonCard className="section-card">
                <IonCardHeader 
                  className="section-header"
                  onClick={() => setShowAIInsights(!showAIInsights)}
                >
                  <IonCardTitle className="section-title">
                    <IonIcon icon={analyticsOutline} className="section-icon" />
                    AI Insights & Analytics
                    <IonBadge color="success" style={{ marginLeft: '0.5rem' }}>
                      Live
                    </IonBadge>
                  </IonCardTitle>
                  <IonIcon 
                    icon={showAIInsights ? chevronUpOutline : chevronDownOutline} 
                    className="chevron-icon"
                  />
                </IonCardHeader>
                {showAIInsights && (
                  <IonCardContent className="section-content">
                    <div className="insights-grid">
                      <IonRow>
                        <IonCol size="12" size-md="4">
                          <div className="insight-card">
                            <div className="insight-icon">
                              <IonIcon icon={cashOutline} />
                            </div>
                            <div className="insight-content">
                              <h3>Total Loan Amount</h3>
                              <p className="insight-value">{formatCurrency(reportData.summary.totalLoanAmount)}</p>
                            </div>
                          </div>
                        </IonCol>
                        <IonCol size="12" size-md="4">
                          <div className="insight-card">
                            <div className="insight-icon">
                              <IonIcon icon={peopleOutline} />
                            </div>
                            <div className="insight-content">
                              <h3>Average per Group</h3>
                              <p className="insight-value">{formatCurrency(reportData.summary.averagePerGroup)}</p>
                            </div>
                          </div>
                        </IonCol>
                        <IonCol size="12" size-md="4">
                          <div className="insight-card">
                            <div className="insight-icon">
                              <IonIcon icon={documentTextOutline} />
                            </div>
                            <div className="insight-content">
                              <h3>Total Loans</h3>
                              <p className="insight-value">{reportData.summary.totalLoans}</p>
                            </div>
                          </div>
                        </IonCol>
                      </IonRow>
                      <IonRow>
                        <IonCol size="12" size-md="6">
                          <div className="insight-card">
                            <div className="insight-icon trend-up">
                              <IonIcon icon={trendingUpOutline} />
                            </div>
                            <div className="insight-content">
                              <h3>Max Group Amount</h3>
                              <p className="insight-value">{formatCurrency(reportData.summary.maxGroupAmount)}</p>
                            </div>
                          </div>
                        </IonCol>
                        <IonCol size="12" size-md="6">
                          <div className="insight-card">
                            <div className="insight-icon trend-down">
                              <IonIcon icon={trendingDownOutline} />
                            </div>
                            <div className="insight-content">
                              <h3>Min Group Amount</h3>
                              <p className="insight-value">{formatCurrency(reportData.summary.minGroupAmount)}</p>
                            </div>
                          </div>
                        </IonCol>
                      </IonRow>
                      <IonRow>
                        <IonCol size="12" size-md="4">
                          <div className="insight-card">
                            <div className="insight-icon">
                              <IonIcon icon={barChartOutline} />
                            </div>
                            <div className="insight-content">
                              <h3>Completion Rate</h3>
                              <p className="insight-value">87.5%</p>
                            </div>
                          </div>
                        </IonCol>
                        <IonCol size="12" size-md="4">
                          <div className="insight-card">
                            <div className="insight-icon">
                              <IonIcon icon={pieChartOutline} />
                            </div>
                            <div className="insight-content">
                              <h3>Active Schemes</h3>
                              <p className="insight-value">12</p>
                            </div>
                          </div>
                        </IonCol>
                        <IonCol size="12" size-md="4">
                          <div className="insight-card">
                            <div className="insight-icon">
                              <IonIcon icon={starOutline} />
                            </div>
                            <div className="insight-content">
                              <h3>Success Rate</h3>
                              <p className="insight-value">94.2%</p>
                            </div>
                          </div>
                        </IonCol>
                      </IonRow>
                    </div>
                  </IonCardContent>
                )}
              </IonCard>

              {/* Enhanced Report Table Section */}
              <IonCard className="section-card">
                <IonCardHeader 
                  className="section-header"
                  onClick={() => setShowReportTable(!showReportTable)}
                >
                  <IonCardTitle className="section-title">
                    <IonIcon icon={analyticsOutline} className="section-icon" />
                    Report Table
                    <IonBadge color="warning" style={{ marginLeft: '0.5rem' }}>
                      {reportData.tableData.length} records
                    </IonBadge>
                  </IonCardTitle>
                  <IonIcon 
                    icon={showReportTable ? chevronUpOutline : chevronDownOutline} 
                    className="chevron-icon"
                  />
                </IonCardHeader>
                {showReportTable && (
                  <IonCardContent className="section-content">
                    <div className="table-actions">
                      <IonButton fill="solid" size="small" onClick={() => setShowExportModal(true)}>
                        <IonIcon icon={downloadOutline} />
                        Export
                      </IonButton>
                      <IonButton fill="solid" size="small" onClick={handleRefresh}>
                        <IonIcon icon={refreshOutline} />
                        Refresh
                      </IonButton>
                      <IonButton fill="outline" size="small" onClick={() => setViewMode(viewMode === 'table' ? 'cards' : 'table')}>
                        <IonIcon icon={viewMode === 'table' ? eyeOutline : barChartOutline} />
                        {viewMode === 'table' ? 'Card View' : 'Table View'}
                      </IonButton>
                      <IonButton fill="outline" size="small">
                        <IonIcon icon={settingsOutline} />
                        Settings
                      </IonButton>
                    </div>
                    
                    <div className="table-container">
                      <table className="report-table">
                        <thead>
                          <tr>
                            <th>Loan Count</th>
                            <th>Total Amount (₹)</th>
                            <th>Scheme</th>
                            <th>User</th>
                            <th>Total Disbursed</th>
                            <th>Amount To Be Disbursed</th>
                            <th>Subsidy Amount</th>
                            <th>Own Contribution</th>
                            <th>Subsidy Limit</th>
                            <th>Loan % By MPBCDC</th>
                            <th>Loan % By Partner</th>
                            <th>Partner Recovery</th>
                            <th>Principle Amount</th>
                            <th>Loan Term</th>
                            <th>Total Interest</th>
                            <th>Interest Type</th>
                            <th>Interest</th>
                            <th>Waived Count</th>
                            <th>Waived Off Principle</th>
                            <th>Waived Off Interest</th>
                            <th>Waived Off Both</th>
                            <th>Split Count</th>
                            <th>Settled Count</th>
                            <th>Total Recovered</th>
                            <th>Total Pending Recovery</th>
                            <th>Total Penalty</th>
                            <th>EMI Paid</th>
                            <th>EMI Unpaid</th>
                            <th>EMI Overdue</th>
                            <th>Pending</th>
                          </tr>
                        </thead>
                        <tbody>
                          {reportData.tableData.map((row, index) => (
                            <tr key={index}>
                              <td>{row.loanCount}</td>
                              <td>{formatNumber(row.totalAmount)}</td>
                              <td>{row.scheme}</td>
                              <td>{row.user}</td>
                              <td>{formatNumber(row.totalDisbursed)}</td>
                              <td>{formatNumber(row.amountToBeDisbursed)}</td>
                              <td>{formatNumber(row.subsidyAmount)}</td>
                              <td>{row.ownContribution}%</td>
                              <td>{row.subsidyLimit}%</td>
                              <td>{row.loanPercentByMPBCDC}%</td>
                              <td>{row.loanPercentByPartner}%</td>
                              <td>{row.partnerRecovery ? 'Yes' : 'No'}</td>
                              <td>{formatNumber(row.principleAmount)}</td>
                              <td>{row.loanTerm} years</td>
                              <td>{formatNumber(row.totalInterest)}</td>
                              <td>{row.interestType}</td>
                              <td>{row.interest}%</td>
                              <td>{row.waivedCount}</td>
                              <td>{formatNumber(row.waivedOffPrinciple)}</td>
                              <td>{formatNumber(row.waivedOffInterest)}</td>
                              <td>{row.waivedOffBoth ? 'Yes' : 'No'}</td>
                              <td>{row.splitCount}</td>
                              <td>{row.settledCount}</td>
                              <td>{formatNumber(row.totalRecovered)}</td>
                              <td>{formatNumber(row.totalPendingRecovery)}</td>
                              <td>{formatNumber(row.totalPenalty)}</td>
                              <td>{row.emiPaid}</td>
                              <td>{row.emiUnpaid}</td>
                              <td>{row.emiOverdue}</td>
                              <td>
                                <IonChip color={row.pending ? 'warning' : 'success'}>
                                  {row.pending ? 'Pending' : 'Completed'}
                                </IonChip>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </IonCardContent>
                )}
              </IonCard>
            </div>
          </IonContent>

        </div>
      </IonSplitPane>

      {/* Export Modal */}
      <IonModal isOpen={showExportModal} onDidDismiss={() => setShowExportModal(false)}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Export Report</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => setShowExportModal(false)}>
                <IonIcon icon={closeOutline} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="export-modal-content">
          <div style={{ padding: '2rem' }}>
            <h2 style={{ marginBottom: '1.5rem', color: '#667eea' }}>Choose Export Format</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <IonButton 
                expand="block" 
                fill="outline" 
                onClick={() => handleExport('pdf')}
                style={{ '--background': 'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)', '--color': 'white' }}
              >
                <IonIcon icon={documentTextOutline} slot="start" />
                Export as PDF
              </IonButton>
              <IonButton 
                expand="block" 
                fill="outline" 
                onClick={() => handleExport('excel')}
                style={{ '--background': 'linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%)', '--color': 'white' }}
              >
                <IonIcon icon={barChartOutline} slot="start" />
                Export as Excel
              </IonButton>
              <IonButton 
                expand="block" 
                fill="outline" 
                onClick={() => handleExport('csv')}
                style={{ '--background': 'linear-gradient(135deg, #45b7d1 0%, #96ceb4 100%)', '--color': 'white' }}
              >
                <IonIcon icon={cloudDownloadOutline} slot="start" />
                Export as CSV
              </IonButton>
            </div>
          </div>
        </IonContent>
      </IonModal>

      {/* Floating Action Button */}
      <IonFab vertical="bottom" horizontal="end" slot="fixed">
        <IonFabButton className="fab-add-report">
          <IonIcon icon={addOutline} />
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

export default CustomReports;
