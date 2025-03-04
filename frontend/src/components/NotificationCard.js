import React, { useEffect } from 'react';

function NotificationCard({ message, variant = 'error', onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => onClose(), 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const variantClass = variant === 'error' 
    ? 'notificationCard-error' 
    : 'notificationCard-success';

  return (
    <div className={`notificationCard ${variantClass}`}>
      {message}
    </div>
  );
}

export default NotificationCard;
