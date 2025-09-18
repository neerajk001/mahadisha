import React from 'react';
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonGrid,
  IonRow,
  IonCol
} from '@ionic/react';
import type { ChartData } from '../../../types';
import './ChartsSection.css';

interface ChartsSectionProps {
  monthlyData?: ChartData | null;
  districtData?: ChartData | null;
}

const ChartsSection: React.FC<ChartsSectionProps> = ({ monthlyData, districtData }) => {
  return (
    <div className="charts-section-container">
      <IonGrid>
        <IonRow>
          {/* Bar Chart */}
          <IonCol size="12" size-lg="4">
            <IonCard className="chart-card">
              <IonCardHeader>
                <IonCardTitle className="chart-title">Bar Chart</IonCardTitle>
              </IonCardHeader>
              <IonCardContent className="chart-content">
                <div className="chart-container">
                  <div className="chart-header">
                    <span className="chart-label">Loan Status Count</span>
                  </div>
                  <div className="bar-chart">
                    <div className="chart-y-axis">
                      <div className="y-label">100</div>
                      <div className="y-label">80</div>
                      <div className="y-label">60</div>
                      <div className="y-label">40</div>
                      <div className="y-label">20</div>
                      <div className="y-label">0</div>
                    </div>
                    <div className="chart-area">
                      <div className="bar-group">
                        <div className="bar approved" style={{ height: '95%' }}>
                          <div className="bar-value">95</div>
                          <div className="bar-label">Approved</div>
                        </div>
                        <div className="bar pending" style={{ height: '18%' }}>
                          <div className="bar-value">18</div>
                          <div className="bar-label">Pending</div>
                        </div>
                        <div className="bar rejected" style={{ height: '12%' }}>
                          <div className="bar-value">12</div>
                          <div className="bar-label">Rejected</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </IonCardContent>
            </IonCard>
          </IonCol>

          {/* Line Chart */}
          <IonCol size="12" size-lg="4">
            <IonCard className="chart-card">
              <IonCardHeader>
                <IonCardTitle className="chart-title">Loan Status Line Chart</IonCardTitle>
              </IonCardHeader>
              <IonCardContent className="chart-content">
                <div className="chart-container">
                  <div className="chart-header">
                    <span className="chart-label">Loan Status Distribution</span>
                  </div>
                  <div className="line-chart">
                    <div className="chart-y-axis">
                      <div className="y-label">30.5</div>
                      <div className="y-label">29.5</div>
                      <div className="y-label">28.5</div>
                      <div className="y-label">27.5</div>
                    </div>
                    <div className="chart-area">
                      <svg className="line-chart-svg" viewBox="0 0 200 100">
                        <circle cx="100" cy="20" r="4" fill="var(--color-secondary)" />
                        <text x="100" y="15" textAnchor="middle" className="data-point-label">29.0</text>
                      </svg>
                    </div>
                  </div>
                </div>
              </IonCardContent>
            </IonCard>
          </IonCol>

          {/* Doughnut Chart */}
          <IonCol size="12" size-lg="4">
            <IonCard className="chart-card">
              <IonCardHeader>
                <IonCardTitle className="chart-title">Loan Status Ratio</IonCardTitle>
              </IonCardHeader>
              <IonCardContent className="chart-content">
                <div className="chart-container">
                  <div className="doughnut-chart">
                    <div className="chart-center">
                      <div className="center-value">125</div>
                      <div className="center-label">Total</div>
                    </div>
                    <svg className="doughnut-svg" viewBox="0 0 120 120">
                      <circle
                        cx="60"
                        cy="60"
                        r="50"
                        fill="none"
                        stroke="#5CA8A3"
                        strokeWidth="20"
                        strokeDasharray="251.2 62.8"
                        strokeDashoffset="0"
                        transform="rotate(-90 60 60)"
                      />
                      <circle
                        cx="60"
                        cy="60"
                        r="50"
                        fill="none"
                        stroke="#E6C17C"
                        strokeWidth="20"
                        strokeDasharray="45.2 268.8"
                        strokeDashoffset="-251.2"
                        transform="rotate(-90 60 60)"
                      />
                      <circle
                        cx="60"
                        cy="60"
                        r="50"
                        fill="none"
                        stroke="#E08E79"
                        strokeWidth="20"
                        strokeDasharray="30.1 283.9"
                        strokeDashoffset="-296.4"
                        transform="rotate(-90 60 60)"
                      />
                    </svg>
                  </div>
                  <div className="chart-legend">
                    <div className="legend-item">
                      <div className="legend-color" style={{ backgroundColor: '#5CA8A3' }}></div>
                      <span className="legend-label">Approved (76%)</span>
                    </div>
                    <div className="legend-item">
                      <div className="legend-color" style={{ backgroundColor: '#E6C17C' }}></div>
                      <span className="legend-label">Pending (14%)</span>
                    </div>
                    <div className="legend-item">
                      <div className="legend-color" style={{ backgroundColor: '#E08E79' }}></div>
                      <span className="legend-label">Rejected (10%)</span>
                    </div>
                  </div>
                </div>
              </IonCardContent>
            </IonCard>
          </IonCol>
        </IonRow>
      </IonGrid>
    </div>
  );
};

export default ChartsSection;
