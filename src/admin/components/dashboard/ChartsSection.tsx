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
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from "recharts";

import { ResponsiveContainer } from "recharts";
import './ChartsSection.css';

const data = {
  totalLoans: 2750,
  totalDisbursed: 26827942,
  statusBreakdown: [
    { _id: 'Submitted to District Assistant✅', count: 152, lastUpdated: 1757923649217 },
    { _id: 'Proposal sent to Bank✅', count: 34, lastUpdated: 1757938191743 },
    { _id: 'Proposal Pending in bank⏳', count: 10, lastUpdated: 1754561769397 },
    { _id: 'Rejected', count: 16, lastUpdated: 1758199818977 },
    { _id: 'Sanctioned by Selection Committee✅', count: 1, lastUpdated: 1753959896123 },
    { _id: 'Proposal Rejected by Bank❌', count: 2, lastUpdated: 1755075087108 },
    { _id: 'Disbursement Executed✅', count: 12, lastUpdated: 1758195966873 },
    { _id: 'Loan sanctioned by Bank✅', count: 1, lastUpdated: 1757411928174 },
    { _id: 'Partially Disbursed', count: 18, lastUpdated: 1758094159883 },
    { _id: 'pending', count: 2036, lastUpdated: 1758213761739 },
    { _id: 'Submitted to District Manager✅', count: 79, lastUpdated: 1758201834434 },
    { _id: 'Disbursed', count: 116, lastUpdated: 1758199379079 },
    { _id: 'Submitted for Selection Committee review✅', count: 8, lastUpdated: 1758195725414 },
    { _id: 'Application Received', count: 144, lastUpdated: 1758198995204 },
    { _id: 'Submitted to Assistant General Manager P1✅', count: 2, lastUpdated: 1758196444203 },
    { _id: 'Approved for Disbursement✅', count: 12, lastUpdated: 1757413887126 },
    { _id: 'Submitted to Regional Office✅', count: 24, lastUpdated: 1758199190664 },
    { _id: 'Submitted to Head Office✅', count: 66, lastUpdated: 1757584645154 },
    { _id: 'Incomplete Application📝', count: 13, lastUpdated: 1757503648085 },
    { _id: 'Application Revoked', count: 4, lastUpdated: 1756712264590 }
  ],
  upcomingEMIs: { totalDue: 116822.17, count: 145 },
  overdueEMIs: { totalOverdue: 60451.14, count: 78 },
  waivedOff: []
};

const COLORS = ['#5CA8A3', '#E6C17C', '#E08E79', '#3880ff', '#ff6b6b', '#51cf66'];

const ChartsSection: React.FC = () => {
  const total = data.statusBreakdown.reduce((acc, s) => acc + s.count, 0);

  // pie data (top 5 statuses + others)
  const pieData = data.statusBreakdown
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)
    .map(s => ({
      name: s._id,
      value: s.count
    }));

  if (data.statusBreakdown.length > 5) {
    const others = data.statusBreakdown.slice(5).reduce((acc, s) => acc + s.count, 0);
    pieData.push({ name: 'Others', value: others });
  }

  // line data (showing counts by status over index)
  const lineData = data.statusBreakdown.map((s, idx) => ({
    name: s._id,
    count: s.count
  }));

  return (
    <div className="charts-section-container">
      <IonGrid>
        <IonRow>
          {/* Line Chart */}
          <IonCol size="12" size-lg="6">
            <IonCard className="chart-card">
              <IonCardHeader>
                <IonCardTitle className="chart-title">📈 Loan Status Line Chart</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={lineData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="count" stroke="#3880ff" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </IonCardContent>
            </IonCard>
          </IonCol>

          {/* Doughnut / Pie Chart */}
          <IonCol size="12" size-lg="6">
            <IonCard className="chart-card">
              <IonCardHeader>
                <IonCardTitle className="chart-title">🥧 Loan Status Ratio</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      label
                    >
                      {pieData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </IonCardContent>
            </IonCard>
          </IonCol>

          {/* Table Breakdown */}
          <IonCol size="12">
            <IonCard className="chart-card">
              <IonCardHeader>
                <IonCardTitle>📊 Loan Status Breakdown (Table)</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <div style={{ overflowX: 'auto' }}>
                  <table
                    style={{
                      width: '100%',
                      borderCollapse: 'collapse',
                      borderRadius: '8px',
                      minWidth: '600px'
                    }}
                  >
                    <thead>
                      <tr style={{ backgroundColor: '#3880ff', color: 'white' }}>
                        <th style={{ padding: '12px', textAlign: 'left' }}>Status</th>
                        <th style={{ padding: '12px', textAlign: 'right' }}>Count</th>
                        <th style={{ padding: '12px', textAlign: 'right' }}>Percentage</th>
                        <th style={{ padding: '12px', textAlign: 'right' }}>Last Updated</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.statusBreakdown.map((item, idx) => {
                        const percent = ((item.count / total) * 100).toFixed(2);
                        const lastUpdated = item.lastUpdated
                          ? new Date(item.lastUpdated)
                          : null;
                        const daysAgo = lastUpdated
                          ? Math.floor(
                              (Date.now() - lastUpdated.getTime()) /
                                (1000 * 60 * 60 * 24)
                            )
                          : null;

                        return (
                          <tr key={idx}>
                            <td style={{ padding: '12px' }}>{item._id}</td>
                            <td style={{ padding: '12px', textAlign: 'right' }}>
                              {item.count}
                            </td>
                            <td style={{ padding: '12px', textAlign: 'right' }}>
                              {percent}%
                            </td>
                            <td style={{ padding: '12px', textAlign: 'right' }}>
                              {daysAgo !== null
                                ? `${daysAgo} day${daysAgo === 1 ? '' : 's'} ago`
                                : 'N/A'}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
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
