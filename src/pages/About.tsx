import React from 'react';
import { IonPage, IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton } from '@ionic/react';
import { 
  IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonIcon, IonGrid, IonRow, IonCol,
  IonChip, IonText, IonButton, IonList, IonItem, IonLabel, IonBadge
} from '@ionic/react';
import { 
  schoolOutline, businessOutline, homeOutline, medicalOutline, carOutline,
  peopleOutline, checkmarkCircleOutline, starOutline, heartOutline,
  shieldCheckmarkOutline, trendingUpOutline, giftOutline, cashOutline,
  timeOutline, locationOutline, documentTextOutline, calculatorOutline
} from 'ionicons/icons';
import Header from '../components/header/Header';
import './About.css';

const About: React.FC = () => {
  const schemes = [
    {
      id: 1,
      name: 'Education Loan Scheme (NSFDC I)',
      marathiName: 'शिक्षण कर्ज योजना (NSFDC I)',
      type: 'Education',
      icon: schoolOutline,
      color: 'primary',
      loanRange: '₹0 - ₹30,00,000',
      subsidy: '100% (Max ₹50,000)',
      tenure: '10 - 12 years',
      interest: '6% yearly',
      benefits: [
        'Complete education funding for higher studies',
        'No collateral required for loans up to ₹10 lakhs',
        'Interest subsidy for meritorious students',
        'Flexible repayment options',
        'Support for professional courses'
      ]
    },
    {
      id: 2,
      name: 'Green Business Scheme (NSKFDC)',
      marathiName: 'हरित व्यवसाय योजना (NSKFDC)',
      type: 'Business',
      icon: businessOutline,
      color: 'secondary',
      loanRange: '₹0 - ₹7,50,000',
      subsidy: '100% (Max ₹50,000)',
      tenure: '0 - 10 years',
      interest: '6% yearly',
      benefits: [
        'Support for eco-friendly businesses',
        'Green technology adoption',
        'Sustainable livelihood creation',
        'Environmental impact reduction',
        'Modern business practices training'
      ]
    },
    {
      id: 3,
      name: 'Education Loan Scheme (NSFDC A)',
      marathiName: 'शिक्षण कर्ज योजना (NSFDC A)',
      type: 'Education',
      icon: schoolOutline,
      color: 'primary',
      loanRange: '₹0 - ₹40,00,000',
      subsidy: '100% (Max ₹50,000)',
      tenure: '10 - 12 years',
      interest: '6.5% yearly',
      benefits: [
        'Advanced education funding',
        'International study support',
        'Research and development funding',
        'Skill development programs',
        'Career guidance and counseling'
      ]
    },
    {
      id: 4,
      name: 'Margin Money Scheme (State)',
      marathiName: 'मार्जिन मनी योजना (राज्य)',
      type: 'Business',
      icon: businessOutline,
      color: 'secondary',
      loanRange: '₹0 - ₹50,000',
      subsidy: '100% (Max ₹25,000)',
      tenure: '0 - 3 years',
      interest: '0%',
      benefits: [
        'Zero interest margin money',
        'Quick business setup support',
        'Micro-enterprise development',
        'Local employment generation',
        'Entrepreneurship training'
      ]
    },
    {
      id: 5,
      name: 'Housing Loan Scheme',
      marathiName: 'गृह कर्ज योजना',
      type: 'Housing',
      icon: homeOutline,
      color: 'tertiary',
      loanRange: '₹0 - ₹15,00,000',
      subsidy: '100% (Max ₹75,000)',
      tenure: '15 - 20 years',
      interest: '4% yearly',
      benefits: [
        'Affordable housing for all',
        'Rural and urban housing support',
        'Home improvement loans',
        'Construction material support',
        'Legal documentation assistance'
      ]
    },
    {
      id: 6,
      name: 'Medical Emergency Scheme',
      marathiName: 'चिकित्सा आणीबाणी योजना',
      type: 'Medical',
      icon: medicalOutline,
      color: 'success',
      loanRange: '₹0 - ₹5,00,000',
      subsidy: '100% (Max ₹1,00,000)',
      tenure: '0 - 5 years',
      interest: '3% yearly',
      benefits: [
        'Emergency medical funding',
        'Critical illness support',
        'Health insurance coverage',
        'Medical equipment loans',
        'Healthcare access improvement'
      ]
    }
  ];

  const benefits = [
    {
      title: 'Financial Empowerment',
      icon: cashOutline,
      description: 'Access to low-interest loans and subsidies to start businesses, pursue education, and improve living standards.',
      details: [
        'Interest rates as low as 0-6%',
        'Subsidy up to 100% on eligible schemes',
        'No collateral required for small loans',
        'Flexible repayment terms'
      ]
    },
    {
      title: 'Educational Advancement',
      icon: schoolOutline,
      description: 'Comprehensive support for education from primary to higher studies, including professional courses.',
      details: [
        'Complete education funding',
        'Scholarship programs',
        'Skill development training',
        'Career guidance and placement'
      ]
    },
    {
      title: 'Business Development',
      icon: businessOutline,
      description: 'Support for entrepreneurship and business growth with training, funding, and mentorship.',
      details: [
        'Startup funding and support',
        'Business training programs',
        'Market linkage assistance',
        'Technology adoption support'
      ]
    },
    {
      title: 'Social Security',
      icon: shieldCheckmarkOutline,
      description: 'Comprehensive social security measures including healthcare, housing, and emergency support.',
      details: [
        'Health insurance coverage',
        'Housing assistance programs',
        'Emergency financial support',
        'Legal aid and counseling'
      ]
    }
  ];

  const statistics = [
    { label: 'Schemes Available', value: '50+', icon: documentTextOutline },
    { label: 'Beneficiaries Served', value: '2.5L+', icon: peopleOutline },
    { label: 'Loan Amount Disbursed', value: '₹500Cr+', icon: cashOutline },
    { label: 'Success Rate', value: '95%', icon: trendingUpOutline }
  ];

  return (
    <IonPage>
      <Header />
      <IonContent fullscreen>
        {/* Hero Section */}
        <div className="about-hero">
          <div className="about-hero-content">
            <h1 className="about-hero-title">About MAHA-DISHA</h1>
            <p className="about-hero-subtitle">
              Empowering Backward Classes Through Digital Access to Government Schemes
            </p>
            <div className="about-hero-stats">
              {statistics.map((stat, index) => (
                <div key={index} className="stat-item">
                  <IonIcon icon={stat.icon} className="stat-icon" />
                  <div className="stat-content">
                    <div className="stat-value">{stat.value}</div>
                    <div className="stat-label">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mission Section */}
        <div className="about-mission">
          <div className="container">
            <div className="mission-content">
              <h2 className="section-title">Our Mission</h2>
              <p className="mission-text">
                MAHA-DISHA (Maharashtra Digital Integrated System for Holistic Administration) is committed to 
                bridging the digital divide and ensuring equitable access to government schemes for all backward 
                classes in Maharashtra. We believe that every citizen deserves equal opportunities for growth, 
                education, and prosperity.
              </p>
              <div className="mission-values">
                <div className="value-item">
                  <IonIcon icon={heartOutline} className="value-icon" />
                  <h3>Inclusive Growth</h3>
                  <p>Ensuring no one is left behind in the journey of development</p>
                </div>
                <div className="value-item">
                  <IonIcon icon={shieldCheckmarkOutline} className="value-icon" />
                  <h3>Transparency</h3>
                  <p>Complete transparency in scheme implementation and fund utilization</p>
                </div>
                <div className="value-item">
                  <IonIcon icon={starOutline} className="value-icon" />
                  <h3>Excellence</h3>
                  <p>Delivering world-class services with efficiency and quality</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="about-benefits">
          <div className="container">
            <h2 className="section-title">Benefits for Backward Classes</h2>
            <IonGrid>
              <IonRow>
                {benefits.map((benefit, index) => (
                  <IonCol size="12" sizeMd="6" key={index}>
                    <IonCard className="benefit-card">
                      <IonCardHeader>
                        <div className="benefit-header">
                          <IonIcon icon={benefit.icon} className="benefit-icon" />
                          <IonCardTitle>{benefit.title}</IonCardTitle>
                        </div>
                      </IonCardHeader>
                      <IonCardContent>
                        <p className="benefit-description">{benefit.description}</p>
                        <IonList className="benefit-list">
                          {benefit.details.map((detail, detailIndex) => (
                            <IonItem key={detailIndex} className="benefit-item">
                              <IonIcon icon={checkmarkCircleOutline} slot="start" color="success" />
                              <IonLabel>{detail}</IonLabel>
                            </IonItem>
                          ))}
                        </IonList>
                      </IonCardContent>
                    </IonCard>
                  </IonCol>
                ))}
              </IonRow>
            </IonGrid>
          </div>
        </div>

        {/* Schemes Section */}
        <div className="about-schemes">
          <div className="container">
            <h2 className="section-title">Available Schemes</h2>
            <p className="section-subtitle">
              Explore our comprehensive range of government schemes designed specifically for the upliftment 
              of backward classes in Maharashtra.
            </p>
            <IonGrid>
              <IonRow>
                {schemes.map((scheme) => (
                  <IonCol size="12" sizeMd="6" sizeLg="4" key={scheme.id}>
                    <IonCard className="scheme-card">
                      <IonCardHeader>
                        <div className="scheme-header">
                          <IonChip color={scheme.color} className="scheme-chip">
                            <IonIcon icon={scheme.icon} />
                            <IonLabel>{scheme.type}</IonLabel>
                          </IonChip>
                          <IonCardTitle className="scheme-title">{scheme.name}</IonCardTitle>
                          <IonText color="medium" className="scheme-marathi">
                            {scheme.marathiName}
                          </IonText>
                        </div>
                      </IonCardHeader>
                      <IonCardContent>
                        <div className="scheme-details">
                          <div className="detail-row">
                            <IonIcon icon={cashOutline} className="detail-icon" />
                            <div className="detail-content">
                              <span className="detail-label">Loan Range</span>
                              <span className="detail-value">{scheme.loanRange}</span>
                            </div>
                          </div>
                          <div className="detail-row">
                            <IonIcon icon={giftOutline} className="detail-icon" />
                            <div className="detail-content">
                              <span className="detail-label">Subsidy</span>
                              <span className="detail-value">{scheme.subsidy}</span>
                            </div>
                          </div>
                          <div className="detail-row">
                            <IonIcon icon={timeOutline} className="detail-icon" />
                            <div className="detail-content">
                              <span className="detail-label">Tenure</span>
                              <span className="detail-value">{scheme.tenure}</span>
                            </div>
                          </div>
                          <div className="detail-row">
                            <IonIcon icon={calculatorOutline} className="detail-icon" />
                            <div className="detail-content">
                              <span className="detail-label">Interest Rate</span>
                              <span className="detail-value">{scheme.interest}</span>
                            </div>
                          </div>
                        </div>
                        <div className="scheme-benefits">
                          <h4>Key Benefits:</h4>
                          <IonList className="benefits-list">
                            {scheme.benefits.map((benefit, benefitIndex) => (
                              <IonItem key={benefitIndex} className="benefit-item">
                                <IonIcon icon={checkmarkCircleOutline} slot="start" color="success" />
                                <IonLabel>{benefit}</IonLabel>
                              </IonItem>
                            ))}
                          </IonList>
                        </div>
                      </IonCardContent>
                    </IonCard>
                  </IonCol>
                ))}
              </IonRow>
            </IonGrid>
          </div>
        </div>

        {/* Impact Section */}
        <div className="about-impact">
          <div className="container">
            <h2 className="section-title">Our Impact</h2>
            <div className="impact-grid">
              <div className="impact-item">
                <div className="impact-number">2.5L+</div>
                <div className="impact-label">Families Empowered</div>
                <p>Through education, business, and housing schemes</p>
              </div>
              <div className="impact-item">
                <div className="impact-number">₹500Cr+</div>
                <div className="impact-label">Funds Disbursed</div>
                <p>In loans and subsidies to beneficiaries</p>
              </div>
              <div className="impact-item">
                <div className="impact-number">95%</div>
                <div className="impact-label">Success Rate</div>
                <p>Of scheme applications and implementations</p>
              </div>
              <div className="impact-item">
                <div className="impact-number">36</div>
                <div className="impact-label">Districts Covered</div>
                <p>Across Maharashtra with local support centers</p>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="about-cta">
          <div className="container">
            <div className="cta-content">
              <h2>Ready to Transform Your Future?</h2>
              <p>
                Join thousands of families who have already benefited from our schemes. 
                Start your journey towards financial independence and social upliftment today.
              </p>
              <div className="cta-buttons">
                <IonButton size="large" className="cta-primary">
                  <IonIcon icon={documentTextOutline} slot="start" />
                  Apply for Schemes
                </IonButton>
                <IonButton size="large" fill="outline" className="cta-secondary">
                  <IonIcon icon={peopleOutline} slot="start" />
                  Contact Support
                </IonButton>
              </div>
            </div>
          </div>
        </div>

      </IonContent>
    </IonPage>
  );
};

export default About;
