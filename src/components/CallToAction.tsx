import React, { useEffect, useRef, useState } from 'react';
import { IonButton, IonIcon } from '@ionic/react';
import { personAddOutline, sparklesOutline } from 'ionicons/icons';

const CallToAction: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div 
      ref={sectionRef}
      style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
        color: 'white',
        padding: 'clamp(1.5rem, 3vw, 2rem) clamp(1rem, 3vw, 2rem)',
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 'clamp(1rem, 2vw, 1.5rem)',
        width: '100%',
        maxWidth: '100%',
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      {/* Animated background elements */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.8) 0%, rgba(118, 75, 162, 0.6) 50%, rgba(240, 147, 251, 0.8) 100%)',
        zIndex: 1
      }} />
      
      {/* Floating particles */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '10%',
        width: '4px',
        height: '4px',
        background: 'rgba(255, 255, 255, 0.6)',
        borderRadius: '50%',
        animation: 'float 3s ease-in-out infinite',
        zIndex: 2
      }} />
      <div style={{
        position: 'absolute',
        top: '60%',
        right: '15%',
        width: '6px',
        height: '6px',
        background: 'rgba(255, 255, 255, 0.4)',
        borderRadius: '50%',
        animation: 'float 4s ease-in-out infinite 1s',
        zIndex: 2
      }} />
      <div style={{
        position: 'absolute',
        top: '30%',
        right: '30%',
        width: '3px',
        height: '3px',
        background: 'rgba(255, 255, 255, 0.8)',
        borderRadius: '50%',
        animation: 'float 5s ease-in-out infinite 2s',
        zIndex: 2
      }} />

      <div 
        style={{
          position: 'relative',
          zIndex: 3,
          flex: 1,
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
          transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '50px',
          padding: '0.4rem 0.8rem',
          marginBottom: '0.75rem',
          fontSize: '0.85rem',
          fontWeight: '500'
        }}>
          <IonIcon icon={sparklesOutline} style={{ fontSize: '1rem', color: '#ffd700' }} />
          <span>Join Our Community</span>
        </div>
        
        <h2 style={{
          fontSize: 'clamp(1.25rem, 3vw, 2rem)',
          fontWeight: '800',
          margin: 0,
          color: 'white',
          lineHeight: '1.2',
          textAlign: isMobile ? 'center' : 'left',
          textShadow: '2px 2px 8px rgba(0, 0, 0, 0.3)'
        }}>
          Start your journey with{' '}
          <span style={{
            background: 'linear-gradient(135deg, #ffd700, #ffed4e)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Maha-Disha
          </span>
        </h2>
        
        <p style={{
          fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
          margin: '0.75rem 0 0 0',
          color: 'rgba(255, 255, 255, 0.9)',
          lineHeight: '1.5',
          textAlign: isMobile ? 'center' : 'left',
          maxWidth: '500px'
        }}>
          Empower your community with seamless access to government schemes and support.
        </p>
      </div>
      
      <div 
        style={{
          position: 'relative',
          zIndex: 3,
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
          transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.3s'
        }}
      >
        <IonButton 
          size="default" 
          style={{
            '--background': '#ff6b35',
            '--color': 'black',
            '--background-hover': '#ff8c42',
            '--color-hover': 'black',
            '--padding-start': '1.5rem',
            '--padding-end': '1.5rem',
            '--padding-top': '0.75rem',
            '--padding-bottom': '0.75rem',
            '--border-radius': '50px',
            '--border': 'none',
            '--box-shadow': '0 8px 32px rgba(255, 107, 53, 0.3)',
            minHeight: '48px',
            flexShrink: 0,
            fontWeight: '600',
            fontSize: '1rem',
            backdropFilter: 'blur(10px)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            position: 'relative',
            overflow: 'hidden'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-3px) scale(1.05)';
            e.currentTarget.style.boxShadow = '0 12px 40px rgba(255, 107, 53, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
            e.currentTarget.style.boxShadow = '0 8px 32px rgba(255, 107, 53, 0.3)';
          }}
        >
          <IonIcon icon={personAddOutline} slot="start" />
          Register Now
        </IonButton>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          25% {
            transform: translateY(-10px) rotate(5deg);
          }
          50% {
            transform: translateY(-5px) rotate(-5deg);
          }
          75% {
            transform: translateY(-15px) rotate(3deg);
          }
        }
      `}</style>
    </div>
  );
};

export default CallToAction;
