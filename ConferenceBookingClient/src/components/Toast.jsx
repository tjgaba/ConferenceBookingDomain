// Toast.jsx — Toast notification component with auto-dismiss
//
// FEATURES:
//   - Auto-dismiss after duration (default 3 seconds)
//   - Manual dismiss with close button
//   - Success/Error variants with icons
//   - Slide-in animation from top
//
// LIFECYCLE:
//   - useEffect sets timer for auto-dismiss
//   - Cleanup function clears timer to prevent memory leaks

import { useEffect } from 'react';
import './Toast.css';

function Toast({ message, type = 'success', duration = 3000, onClose }) {
  // EFFECT: Auto-dismiss toast after duration
  useEffect(() => {
    // Set timer to auto-dismiss
    const timerId = setTimeout(() => {
      onClose();
    }, duration);

    // CLEANUP: Clear timer if component unmounts before duration expires
    return () => {
      clearTimeout(timerId);
    };
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'info':
        return 'ℹ';
      default:
        return '✓';
    }
  };

  return (
    <div className={`toast toast-${type}`}>
      <div className="toast-icon">{getIcon()}</div>
      <div className="toast-message">{message}</div>
      <button 
        className="toast-close" 
        onClick={onClose}
        aria-label="Close notification"
      >
        ×
      </button>
    </div>
  );
}

export default Toast;
