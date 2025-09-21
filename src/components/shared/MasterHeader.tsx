import React from 'react';
import './MasterHeader.css';

export interface MasterHeaderProps {
  title: string;
  subtitle: string;
  className?: string;
}

const MasterHeader: React.FC<MasterHeaderProps> = ({
  title,
  subtitle,
  className = ''
}) => {
  return (
    <div className={`master-header ${className}`}>
      <h1 className="master-header-title">{title}</h1>
      <p className="master-header-subtitle">{subtitle}</p>
    </div>
  );
};

export default MasterHeader;
