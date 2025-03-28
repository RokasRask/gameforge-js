import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import Button from '../Button/Button';
import './ConfirmModal.scss';

const ConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = 'Confirm Action', 
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isLoading = false
}) => {
  // Close modal on escape key press
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && !isLoading) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent scrolling on the body when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose, isLoading]);

  // Don't render anything if modal is not open
  if (!isOpen) {
    return null;
  }

  // Handle backdrop click (close modal if clicked outside)
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && !isLoading) {
      onClose();
    }
  };

  // Use a portal to render the modal outside the normal DOM hierarchy
  return ReactDOM.createPortal(
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal">
        <div className="modal__header">
          <h3 className="modal__title">{title}</h3>
          {!isLoading && (
            <button className="modal__close" onClick={onClose}>
              <i className="fas fa-times"></i>
            </button>
          )}
        </div>
        <div className="modal__content">
          <p className="modal__message">{message}</p>
        </div>
        <div className="modal__actions">
          <Button 
            type="secondary" 
            onClick={onClose} 
            disabled={isLoading}
          >
            {cancelText}
          </Button>
          <Button 
            type="primary" 
            onClick={onConfirm} 
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="modal__spinner"></span> 
                Logging out...
              </>
            ) : confirmText}
          </Button>
        </div>
      </div>
    </div>,
    document.body // Render directly to the body element
  );
};

export default ConfirmModal;