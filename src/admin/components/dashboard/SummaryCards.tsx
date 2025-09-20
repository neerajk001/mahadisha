import React from 'react';
import {
  IonCard,
  IonCardContent,
  IonIcon,
  IonGrid,
  IonRow,
  IonCol,
  IonLabel,
  IonCardHeader,
  IonCardTitle
} from '@ionic/react';
import {
  briefcaseOutline,
  cashOutline,
  calendarOutline,
  warningOutline
} from 'ionicons/icons';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  Legend
} from 'recharts';
import './SummaryCards.css';

const colors = [
  "#FF6384","#36A2EB","#FFCE56","#4BC0C0","#9966FF","#FF9F40",
  "#2ecc71","#e74c3c","#3498db","#f1c40f","#9b59b6","#1abc9c",
  "#e67e22","#d35400","#7f8c8d","#16a085","#2980b9","#c0392b",
  "#8e44ad","#27ae60","#f39c12","#d35400","#34495e","#2c3e50",
  "#95a5a6","#bdc3c7","#e84393","#0984e3","#00b894","#fd79a8"
];

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

const SummaryCards: React.FC = () => {

  const summaryData = [
    {
      title: 'Total Requests',
      value: data.totalLoans.toLocaleString(),
      icon: briefcaseOutline,
      bgColor: '#ffffff',
      textColor: '#333333',
      iconColor: '#3b82f6'
    },
    {
      title: 'Disbursed',
      value: `₹${data.totalDisbursed.toLocaleString()}`,
      icon: cashOutline,
      bgColor: '#1ABC9C',
      textColor: '#ffffff',
      iconColor: '#ffffff'
    },
    {
      title: 'EMIs',
      value: data.upcomingEMIs.count.toString(),
      icon: calendarOutline,
      bgColor: '#ffffff',
      textColor: '#333333',
      iconColor: '#3b82f6'
    },
    {
      title: 'Overdues',
      value: data.overdueEMIs.count.toString(),
      icon: warningOutline,
      bgColor: '#dc2626',
      textColor: '#ffffff',
      iconColor: '#ffffff'
    }
  ];

  // Format data for BarChart
  const barData = data.statusBreakdown.map((entry, index) => ({
    name: entry._id,
    count: entry.count,
    fill: colors[index % colors.length]
  }));

  return (
    <div className="summary-cards-container">
      <IonGrid>
        <IonRow>

          {/* Multicolor Bar Chart */}
          

          {/* Summary Cards */}
          <IonCol size="12" size-lg="3">
            <IonRow>
              {summaryData.map((card, index) => (
                <IonCol size-xs="6" size-md="6" size-lg="12" key={index}>
                  <IonCard
                    className="summary-card"
                    style={{
                      backgroundColor: card.bgColor,
                      color: card.textColor
                    }}
                  >
                    <IonCardContent className="summary-card-content">
                      <div className="card-icon" style={{ color: card.iconColor }}>
                        <IonIcon icon={card.icon} className="icon" />
                        <IonLabel style={{ color: card.textColor }} className="card-title">
                          {card.title}
                        </IonLabel>
                      </div>
                      <div className="card-value" style={{ color: card.textColor }}>
                        {card.value}
                      </div>
                    </IonCardContent>
                  </IonCard>
                </IonCol>
              ))}
            </IonRow>
          </IonCol>
          

          {/* Side Legend */}
          <IonCol className='side-status' size="12" size-lg="3">
            <div style={{ padding: '1rem' }}>
              <h4>Status Counts</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {barData.map((entry, index) => (
                  <li
                    key={index}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      marginBottom: '0.5rem',
                      gap: '0.5rem',
                    }}
                  >
                    <div
                      style={{
                        width: '16px',
                        height: '16px',
                        backgroundColor: entry.fill,
                        borderRadius: '4px',
                      }}
                    ></div>
                    <span style={{ fontWeight: 600 }}>{entry.name}</span>
                    <span style={{ marginLeft: 'auto' }}>{entry.count}</span>
                  </li>
                ))}
              </ul>
            </div>
          </IonCol>
          <IonCol size="12" size-lg="6">
            <IonCard className="chart-card">
              <IonCardHeader>
                <IonCardTitle className="chart-title">🌈 Loan Status Bar Chart</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <ResponsiveContainer className="resContainer" >
                  <BarChart
                    data={barData}
                    margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis scale="log" domain={['auto', 'auto']} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count">
                      {barData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </IonCardContent>
            </IonCard>
          </IonCol>

        </IonRow>
      </IonGrid>
    </div>
  );
};

export default SummaryCards;
