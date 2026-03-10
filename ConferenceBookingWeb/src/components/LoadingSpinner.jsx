// LoadingSpinner.jsx - Loading state indicator
//
// COMPONENT PATTERNS:
//   - Conditional rendering based on loading state
//   - CSS animations for visual feedback
//   - Two variants: inline (within content) and overlay (full screen)

import "./LoadingSpinner.css";

/**
 * LoadingSpinner - Shows a spinning indicator during async operations
 * 
 * @param {boolean} overlay - If true, displays as full-screen overlay
 * @param {string} message - Optional loading message text
 */
function LoadingSpinner({ overlay = false, message = "Loading..." }) {
  if (overlay) {
    return (
      <div className="loading-overlay">
        <div className="loading-card">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p className="loading-text">{message}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="loading-spinner">
      <div className="spinner"></div>
      <p className="loading-text">{message}</p>
    </div>
  );
}

export default LoadingSpinner;
