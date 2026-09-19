import React from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

export default function ToastNotification({ message, type = 'success', onClose }) {
  if (!message) return null;

  const isWarning = type === 'warning' || message.includes('⚠️');
  const isError = type === 'error';

  return (
    <div
      className="toast-container"
      role="alert"
      aria-live="polite"
    >
      <div className={`toast-card toast-${type}`}>
        <div className="toast-icon">
          {isWarning ? (
            <AlertCircle size={20} color="#f59e0b" />
          ) : isError ? (
            <AlertCircle size={20} color="#ef4444" />
          ) : (
            <CheckCircle size={20} color="#10b981" />
          )}
        </div>
        <div className="toast-message">{message}</div>
        <button
          className="toast-close-btn"
          onClick={onClose}
          aria-label="Cerrar notificación"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
