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
                      <div className="y-label">30</div>
                      <div className="y-label">25</div>
                      <div className="y-label">20</div>
                      <div className="y-label">15</div>
                      <div className="y-label">10</div>
                      <div className="y-label">5</div>
                      <div className="y-label">0</div>
                    </div>
                    <div className="chart-area">
                      <div className="bar" style={{ height: '96.7%' }}>
                        <div className="bar-value">29</div>
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
                      <div className="center-value">29</div>
                      <div className="center-label">Total</div>
                    </div>
                    <svg className="doughnut-svg" viewBox="0 0 120 120">
                      <circle
                        cx="60"
                        cy="60"
                        r="50"
                        fill="none"
                        stroke="var(--color-secondary)"
                        strokeWidth="20"
                        strokeDasharray="314 6"
                        strokeDashoffset="0"
                        transform="rotate(-90 60 60)"
                      />
                      <circle
                        cx="60"
                        cy="60"
                        r="50"
                        fill="none"
                        stroke="var(--color-primary)"
                        strokeWidth="20"
                        strokeDasharray="6 314"
                        strokeDashoffset="0"
                        transform="rotate(-90 60 60)"
                      />
                    </svg>
                  </div>
                  <div className="chart-legend">
                    <div className="legend-item">
                      <div className="legend-color" style={{ backgroundColor: 'var(--color-secondary)' }}></div>
                      <span className="legend-label">Pending</span>
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
