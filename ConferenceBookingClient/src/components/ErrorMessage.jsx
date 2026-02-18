// ErrorMessage.jsx - Error state display with retry capability
//
// COMPONENT PATTERNS:
//   - Error boundary-like display (but not a true Error Boundary)
//   - User action callbacks (retry, dismiss)
//   - Accessible error messaging

import "./ErrorMessage.css";

/**
 * ErrorMessage - Displays error information with retry/dismiss options
 * 
 * @param {Error|string} error - Error object or error message string
 * @param {Function} onRetry - Callback when user clicks retry
 * @param {Function} onDismiss - Callback when user dismisses error
 * @param {boolean} retrying - If true, shows loading state on retry button
 */
function ErrorMessage({ error, onRetry, onDismiss, retrying = false }) {
  const errorMessage = typeof error === 'string' ? error : error?.message || 'An unknown error occurred';

  return (
    <div className="error-message" role="alert">
      <svg className="error-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      
      <div className="error-content">
        <h3 className="error-title">Something went wrong</h3>
        <p className="error-description">{errorMessage}</p>
        
        {(onRetry || onDismiss) && (
          <div className="error-actions">
            {onRetry && (
              <button 
                className="error-retry-btn" 
                onClick={onRetry}
                disabled={retrying}
              >
                {retrying ? 'Retrying...' : 'Try Again'}
              </button>
            )}
            {onDismiss && (
              <button 
                className="error-dismiss-btn" 
                onClick={onDismiss}
              >
                Dismiss
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ErrorMessage;
