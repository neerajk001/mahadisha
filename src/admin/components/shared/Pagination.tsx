import React from 'react';
import { IonButton, IonIcon } from '@ionic/react';
import { chevronBackOutline, chevronForwardOutline } from 'ionicons/icons';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPreviousPage: () => void;
  onNextPage: () => void;
  className?: string;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPreviousPage,
  onNextPage,
  className = ''
}) => {
  // Always show pagination for loan sections - don't hide even if only 1 page
  // Only return null if no data at all
  if (totalPages < 1) {
    return null;
  }

  return (
    <div 
      className={`custom-pagination-container ${className}`}
      style={{ 
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '0.75rem',
        margin: '1rem auto',
        maxWidth: '250px',
        padding: '0.5rem 0.75rem',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '12px',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        position: 'relative',
        zIndex: 999
      }}
    >
      <IonButton 
        fill="clear" 
        disabled={currentPage === 1}
        onClick={onPreviousPage}
        style={{
          '--background': currentPage === 1 ? '#e2e8f0' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          '--color': 'white',
          '--border-radius': '50%',
          '--padding-start': '0',
          '--padding-end': '0',
          '--padding-top': '0',
          '--padding-bottom': '0',
          width: '36px',
          height: '36px',
          margin: '0'
        }}
      >
        <IonIcon icon={chevronBackOutline} style={{ fontSize: '1rem' }} />
      </IonButton>
      
      <div style={{ 
        fontSize: '0.75rem', 
        fontWeight: '600',
        color: '#374151',
        padding: '0.25rem 0.5rem',
        background: 'rgba(99, 102, 241, 0.1)',
        borderRadius: '8px',
        border: '1px solid rgba(99, 102, 241, 0.2)',
        minWidth: '75px',
        textAlign: 'center',
        whiteSpace: 'nowrap'
      }}>
        Page {currentPage} of {totalPages}
      </div>
      
      <IonButton 
        fill="clear" 
        disabled={currentPage === totalPages}
        onClick={onNextPage}
        style={{
          '--background': currentPage === totalPages ? '#e2e8f0' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          '--color': 'white',
          '--border-radius': '50%',
          '--padding-start': '0',
          '--padding-end': '0',
          '--padding-top': '0',
          '--padding-bottom': '0',
          width: '36px',
          height: '36px',
          margin: '0'
        }}
      >
        <IonIcon icon={chevronForwardOutline} style={{ fontSize: '1rem' }} />
      </IonButton>
    </div>
  );
};

export default Pagination;
