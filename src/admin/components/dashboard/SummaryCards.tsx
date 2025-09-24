import React from 'react';
import {
  IonGrid,
  IonRow,
  IonCol,
  IonIcon,
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
    { _id: 'Submitted to District Assistant✅', count: 152 },
    { _id: 'Proposal sent to Bank✅', count: 34 },
    { _id: 'Proposal Pending in bank⏳', count: 10 },
    { _id: 'Rejected', count: 16 },
    { _id: 'Sanctioned by Selection Committee✅', count: 1 },
    { _id: 'Proposal Rejected by Bank❌', count: 2 },
    { _id: 'Disbursement Executed✅', count: 12 },
    { _id: 'Loan sanctioned by Bank✅', count: 1 },
    { _id: 'Partially Disbursed', count: 18 },
    { _id: 'pending', count: 2036 },
    { _id: 'Submitted to District Manager✅', count: 79 },
    { _id: 'Disbursed', count: 116 },
    { _id: 'Submitted for Selection Committee review✅', count: 8 },
    { _id: 'Application Received', count: 144 },
    { _id: 'Submitted to Assistant General Manager P1✅', count: 2 },
    { _id: 'Approved for Disbursement✅', count: 12 },
    { _id: 'Submitted to Regional Office✅', count: 24 },
    { _id: 'Submitted to Head Office✅', count: 66 },
    { _id: 'Incomplete Application📝', count: 13 },
    { _id: 'Application Revoked', count: 4 }
  ],
  upcomingEMIs: { count: 145 },
  overdueEMIs: { count: 78 }
};

const SummaryCards: React.FC = () => {
  const summaryData = [
    {
      id: 'totalRequests',
      title: 'Requests',
      value: data.totalLoans.toLocaleString(),
      rawValue: data.totalLoans,
      icon: briefcaseOutline,
      circleColor: '#3b82f6'
    },
    {
      id: 'disbursed',
      title: 'Disbursed',
      value: `₹${data.totalDisbursed.toLocaleString()}`,
      rawValue: data.totalDisbursed,
      icon: cashOutline,
      circleColor: '#1ABC9C'
    },
    {
      id: 'emis',
      title: 'EMIs',
      value: data.upcomingEMIs.count.toString(),
      rawValue: data.upcomingEMIs.count,
      icon: calendarOutline,
      circleColor: '#f59e0b'
    },
    {
      id: 'overdues',
      title: 'Overdues',
      value: data.overdueEMIs.count.toString(),
      rawValue: data.overdueEMIs.count,
      icon: warningOutline,
      circleColor: '#dc2626'
    }
  ];

  const barData = data.statusBreakdown.map((entry, index) => ({
    name: entry._id,
    count: entry.count,
    fill: colors[index % colors.length]
  }));

  const formatNumber = (num: number): string => {
      if (num >= 1_000_000) {
        return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
      }
      if (num >= 1_000) {
        return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
      }
      return num.toString();
    };

  return (
    <div className="summary-cards-container">
      <IonGrid>
        {/* Row with 4 summary boxes */}
        <IonRow className="summary-row">
            {summaryData.map((card) => (
              <IonCol
                key={card.id}
                size="3" 
                className="summary-col"
              >
                <div className="summary-box">
                  <div className="icon-wrapper">
                    <div
                      className="icon-circle"
                      style={{ backgroundColor: card.circleColor }}
                    >
                      <IonIcon icon={card.icon} className="icon" />
                    </div>
                    <div className="icon-badge">{formatNumber(card.rawValue)}</div>
                  </div>
                  <IonLabel className="card-title">{card.title}</IonLabel>
                </div>
              </IonCol>
            ))}
          </IonRow>


        {/* Chart + legend */}
        <IonRow className="chart-row">
          <IonCol size="12" sizeLg="9">
            <div className="chart-box">
              <IonCardHeader>
                <IonCardTitle className="chart-title">🌈 Loan Status Bar Chart</IonCardTitle>
              </IonCardHeader>
              <ResponsiveContainer width="100%" height={360}>
                {/* <ResponsiveContainer className="resContainer" > */}
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
                {/* </ResponsiveContainer> */}
              </ResponsiveContainer>
            </div>
          </IonCol>

          <IonCol size="12" sizeLg="3" className="side-status">
            <div className="status-legend-card">
              <h4>Status Counts</h4>
              <ul className="status-list">
                {barData.map((entry, index) => (
                  <li key={index} className="status-item">
                    <div className="status-color" style={{ backgroundColor: entry.fill }} />
                    <span className="status-name">{entry.name}</span>
                    <span className="status-count">{entry.count}</span>
                  </li>
                ))}
              </ul>
            </div>
          </IonCol>
        </IonRow>
      </IonGrid>
    </div>
  );
};

export default SummaryCards;
