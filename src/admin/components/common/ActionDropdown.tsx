import React, { useState, useRef } from 'react';
import {
  IonButton,
  IonIcon,
  IonPopover,
  IonList,
  IonItem,
  IonLabel
} from '@ionic/react';
import {
  ellipsisHorizontalOutline,
  createOutline,
  trashOutline,
  eyeOutline,
  chevronDownOutline
} from 'ionicons/icons';
import './ActionDropdown.css';

export interface ActionDropdownProps {
  onEdit?: () => void;
  onDelete?: () => void;
  onView?: () => void;
  itemId: string;
  showView?: boolean;
  disabled?: boolean;
  size?: 'small' | 'default' | 'large';
}

const ActionDropdown: React.FC<ActionDropdownProps> = ({
  onEdit,
  onDelete,
  onView,
  itemId,
  showView = false,
  disabled = false,
  size = 'small'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLIonPopoverElement>(null);
  const triggerRef = useRef<HTMLIonButtonElement>(null);

  const handleEdit = () => {
    if (onEdit) {
      onEdit();
    }
    setIsOpen(false);
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete();
    }
    setIsOpen(false);
  };

  const handleView = () => {
    if (onView) {
      onView();
    }
    setIsOpen(false);
  };

  return (
    <div className="action-dropdown-container">
      <IonButton
        ref={triggerRef}
        fill="clear"
        size={size}
        className="action-dropdown-trigger"
        onClick={() => setIsOpen(true)}
        disabled={disabled}
        id={`action-trigger-${itemId}`}
      >
        <IonIcon icon={ellipsisHorizontalOutline} />
        <span className="action-dropdown-text">ACTIONS</span>
        <IonIcon icon={chevronDownOutline} className="action-dropdown-chevron" />
      </IonButton>

      <IonPopover
        ref={popoverRef}
        trigger={`action-trigger-${itemId}`}
        isOpen={isOpen}
        onDidDismiss={() => setIsOpen(false)}
        showBackdrop={true}
        dismissOnSelect={true}
        className="action-dropdown-popover"
      >
        <IonList className="action-dropdown-list">
          {showView && onView && (
            <IonItem
              button
              className="action-dropdown-item view-item"
              onClick={handleView}
            >
              <IonIcon icon={eyeOutline} slot="start" className="action-dropdown-icon" />
              <IonLabel>View</IonLabel>
            </IonItem>
          )}
          
          {onEdit && (
            <IonItem
              button
              className="action-dropdown-item edit-item"
              onClick={handleEdit}
            >
              <IonIcon icon={createOutline} slot="start" className="action-dropdown-icon" />
              <IonLabel>Edit</IonLabel>
            </IonItem>
          )}
          
          {onDelete && (
            <IonItem
              button
              className="action-dropdown-item delete-item"
              onClick={handleDelete}
            >
              <IonIcon icon={trashOutline} slot="start" className="action-dropdown-icon" />
              <IonLabel>Delete</IonLabel>
            </IonItem>
          )}
        </IonList>
      </IonPopover>
    </div>
  );
};

export default ActionDropdown;
