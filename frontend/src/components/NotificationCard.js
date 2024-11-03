// src/components/NotificationCard.js
import React, { useEffect } from 'react';

function NotificationCard({ message, borderColor, bgColor, textColor, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000); // Hide after 5 seconds

    return () => clearTimeout(timer); // Clear timer on component unmount
  }, [onClose]);

  return (
    <div
      className="fixed bottom-4 left-1/2 transform -translate-x-1/2 text-left flex items-center justify-start px-4"
      style={{
        backgroundColor: bgColor,
        border: `1px solid ${borderColor}`,
        color: textColor,
        width: '357px',
        fontSize: '12px',
        padding: '16px',
        borderRadius: '12px',
      }}
    >
      {message}
    </div>
  );
}

export default NotificationCard;
