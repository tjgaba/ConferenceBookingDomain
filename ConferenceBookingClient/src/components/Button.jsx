// Button.jsx — A reusable button component with event handling.
// This component is "configurable via props" — the parent decides what the button says and does.
// Reusability is a core benefit of component-based architecture:
// instead of writing <button> tags everywhere, we create one Button component
// and use it wherever we need a button, passing different labels and onClick handlers.
//
// Event Handlers:
//   - Functions passed as props that get called when events occur (e.g., onClick)
//   - The parent component controls what happens when the button is clicked
//   - This is part of "lifting state up" — the button doesn't manage its own logic

import "./Button.css";

function Button({ label, onClick, variant = "primary", disabled = false }) {
  // variant allows different button styles: "primary", "secondary", "danger"
  // disabled prevents interaction when true
  
  return (
    <button 
      className={`button button-${variant}`}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  );
}

export default Button;
