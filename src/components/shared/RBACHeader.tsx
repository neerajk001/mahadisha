import React from 'react';
import './RBACHeader.css';

interface RBACHeaderProps {
  title: string;
  subtitle: string;
  className?: string;
}

const RBACHeader: React.FC<RBACHeaderProps> = ({ title, subtitle, className = '' }) => {
  return (
    <div className={`rbac-header ${className}`}>
      <h1 className="rbac-header-title">{title}</h1>
      <p className="rbac-header-subtitle">{subtitle}</p>
    </div>
  );
};

export default RBACHeader;
