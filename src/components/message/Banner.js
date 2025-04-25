"use client";

import { useState } from "react";
import { FaTimes } from "react-icons/fa";

export default function BaseBanner({
  title,
  message,
  onConfirm,
  onDismiss,
  confirmText = "Confirm",
  dismissText = "Dismiss",
  className = "",
  children,
}) {
  const [visible, setVisible] = useState(true);

  const handleDismiss = () => {
    setVisible(false);
    onDismiss?.(); // optional callback
  };

  if (!visible) return null;
  return (
    <div
      className={`relative fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-[var(--secondary-dark)] backdrop-blur-md text-[var(--primary-cmpmt)] shadow-xl border border-gray-300 rounded-lg px-6 py-4 z-50 w-[90%] max-w-md animate-fade-in-up ${className}`}
    >
      {/* Close Button */}
      <button
        onClick={handleDismiss}
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 transition"
        aria-label="Dismiss banner"
      >
        <FaTimes className="text-lg" />
      </button>

      <div>
        {title && <h4 className="text-lg font-semibold">{title}</h4>}
        {message && <p className="text-sm text-gray-700">{message}</p>}
        {children}
      </div>

      {(onConfirm || onDismiss) && (
        <div className="mt-4 flex space-x-3 justify-end">
          {onConfirm && (
            <button
              onClick={onConfirm}
              className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600 transition"
            >
              {confirmText}
            </button>
          )}
          {onDismiss && (
            <button
              onClick={handleDismiss}
              className="text-gray-500 hover:text-gray-800 transition"
            >
              {dismissText}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
