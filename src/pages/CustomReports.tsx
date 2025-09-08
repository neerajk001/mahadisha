import React, { useState } from 'react';
import {
  IonPage, IonContent, IonSplitPane, IonHeader, IonToolbar, IonTitle,
  IonButton, IonIcon, IonCard, IonCardContent, IonCardHeader, IonCardTitle,
  IonGrid, IonRow, IonCol, IonChip, IonSpinner, IonAlert, IonToast
} from '@ionic/react';
import { 
  chevronDownOutline, chevronUpOutline, filterOutline, 
  analyticsOutline, downloadOutline, refreshOutline
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

  // Get report data from mock service
  const reportData = mockDataService.getReportData();

  const handleExport = () => {
    setToastMessage('Export functionality will be implemented');
    setShowToast(true);
  };

  const handleRefresh = () => {
    setToastMessage('Data refreshed successfully');
    setShowToast(true);
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
              {/* Filters Section */}
              <IonCard className="section-card">
                <IonCardHeader 
                  className="section-header"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <IonCardTitle className="section-title">
                    <IonIcon icon={filterOutline} className="section-icon" />
                    Filters
                  </IonCardTitle>
                  <IonIcon 
                    icon={showFilters ? chevronUpOutline : chevronDownOutline} 
                    className="chevron-icon"
                  />
                </IonCardHeader>
                {showFilters && (
                  <IonCardContent className="section-content">
                    <div className="filters-grid">
                      <div className="filter-item">
                        <label>Date Range</label>
                        <input type="date" />
                      </div>
                      <div className="filter-item">
                        <label>Scheme</label>
                        <select>
                          <option>All Schemes</option>
                          <option>Margin Money Scheme</option>
                          <option>Education Loan Scheme</option>
                        </select>
                      </div>
                      <div className="filter-item">
                        <label>Status</label>
                        <select>
                          <option>All Status</option>
                          <option>Active</option>
                          <option>Completed</option>
                          <option>Pending</option>
                        </select>
                      </div>
                      <div className="filter-item">
                        <label>District</label>
                        <select>
                          <option>All Districts</option>
                          <option>Mumbai</option>
                          <option>Pune</option>
                          <option>Dhule</option>
                        </select>
                      </div>
                    </div>
                  </IonCardContent>
                )}
              </IonCard>

              {/* AI Insights Section */}
              <IonCard className="section-card">
                <IonCardHeader 
                  className="section-header"
                  onClick={() => setShowAIInsights(!showAIInsights)}
                >
                  <IonCardTitle className="section-title">
                    <IonIcon icon={analyticsOutline} className="section-icon" />
                    AI Insights
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
                              <IonIcon icon={analyticsOutline} />
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
                              <IonIcon icon={analyticsOutline} />
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
                              <IonIcon icon={analyticsOutline} />
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
                              <IonIcon icon={chevronUpOutline} />
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
                              <IonIcon icon={chevronDownOutline} />
                            </div>
                            <div className="insight-content">
                              <h3>Min Group Amount</h3>
                              <p className="insight-value">{formatCurrency(reportData.summary.minGroupAmount)}</p>
                            </div>
                          </div>
                        </IonCol>
                      </IonRow>
                    </div>
                  </IonCardContent>
                )}
              </IonCard>

              {/* Report Table Section */}
              <IonCard className="section-card">
                <IonCardHeader 
                  className="section-header"
                  onClick={() => setShowReportTable(!showReportTable)}
                >
                  <IonCardTitle className="section-title">
                    <IonIcon icon={analyticsOutline} className="section-icon" />
                    Report Table
                  </IonCardTitle>
                  <IonIcon 
                    icon={showReportTable ? chevronUpOutline : chevronDownOutline} 
                    className="chevron-icon"
                  />
                </IonCardHeader>
                {showReportTable && (
                  <IonCardContent className="section-content">
                    <div className="table-actions">
                      <IonButton fill="outline" size="small" onClick={handleExport}>
                        <IonIcon icon={downloadOutline} />
                        Export
                      </IonButton>
                      <IonButton fill="outline" size="small" onClick={handleRefresh}>
                        <IonIcon icon={refreshOutline} />
                        Refresh
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
