import React from 'react';
import { IonCard, IonCardContent } from '@ionic/react';
import './ScrollableTableContainer.css';

export interface ScrollableTableContainerProps {
  children: React.ReactNode;
  className?: string;
  cardClassName?: string;
}

const ScrollableTableContainer: React.FC<ScrollableTableContainerProps> = ({
  children,
  className = '',
  cardClassName = ''
}) => {
  return (
    <IonCard className={`scrollable-table-card ${cardClassName}`}>
      <IonCardContent className={`table-container ${className}`}>
        <div className="mobile-table-wrapper">
          {children}
        </div>
      </IonCardContent>
    </IonCard>
  );
};

export default ScrollableTableContainer;
