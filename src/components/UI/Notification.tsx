// src/components/UI/Notification.tsx
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // Import the component

interface NotificationProps {
  message: string;
}

const Notification: React.FC<NotificationProps> = ({ message }) => {
  // This component will likely be controlled by state in App.tsx
  // For now, it just renders the message passed in
  // In a real implementation, App.tsx would manage the show/hide logic and message
  return (
    <div className="notification show">
      <FontAwesomeIcon icon="check-circle" />
      &nbsp; {/* Use the component */}
      <span>{message}</span>
    </div>
  );
};

export default Notification;
