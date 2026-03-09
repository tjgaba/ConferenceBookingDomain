'use client';
// Button.jsx — A reusable button component with event handling.
//
// 'use client': renders <button onClick={onClick}>. The onClick prop is a
// JavaScript function that executes in the browser — it cannot be attached to
// a DOM element during server rendering.

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
