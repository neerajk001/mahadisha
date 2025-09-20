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
  showView = true,
  disabled = false,
  size = 'small'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLIonPopoverElement>(null);
  const triggerRef = useRef<HTMLIonButtonElement>(null);

  const handleEdit = (event?: Event) => {
    event?.stopPropagation();
    setIsOpen(false);
    if (onEdit) {
      setTimeout(() => onEdit(), 100);
    }
  };

  const handleDelete = (event?: Event) => {
    event?.stopPropagation();
    setIsOpen(false);
    if (onDelete) {
      setTimeout(() => onDelete(), 100);
    }
  };

  const handleView = (event?: Event) => {
    event?.stopPropagation();
    setIsOpen(false);
    if (onView) {
      setTimeout(() => onView(), 100);
    }
  };

  const handlePopoverOpen = () => {
    setIsOpen(true);
    // Ensure proper positioning after a small delay
    setTimeout(() => {
      if (popoverRef.current) {
        const popover = popoverRef.current as any;
        if (popover.reposition) {
          popover.reposition();
        }
      }
    }, 50);
  };


  return (
    <div className="action-dropdown-container">
      <IonButton
        ref={triggerRef}
        fill="clear"
        size={size}
        className="action-dropdown-trigger"
        onClick={handlePopoverOpen}
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
        onDidDismiss={(event) => {
          setIsOpen(false);
          event.stopPropagation();
        }}
        onWillDismiss={() => setIsOpen(false)}
        showBackdrop={true}
        dismissOnSelect={true}
        backdropDismiss={true}
        side="bottom"
        alignment="center"
        className="action-dropdown-popover"
        keepContentsMounted={true}
      >
        <IonList className="action-dropdown-list">
          {showView && onView && (
            <IonItem
              button
              className="action-dropdown-item view-item"
              onClick={(e) => handleView(e.nativeEvent)}
            >
              <IonIcon icon={eyeOutline} slot="start" className="action-dropdown-icon" />
              <IonLabel>View</IonLabel>
            </IonItem>
          )}
          
          
          {onEdit && (
            <IonItem
              button
              className="action-dropdown-item edit-item"
              onClick={(e) => handleEdit(e.nativeEvent)}
            >
              <IonIcon icon={createOutline} slot="start" className="action-dropdown-icon" />
              <IonLabel>Edit</IonLabel>
            </IonItem>
          )}
          
          {onDelete && (
            <IonItem
              button
              className="action-dropdown-item delete-item"
              onClick={(e) => handleDelete(e.nativeEvent)}
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
