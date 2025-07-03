import { useEffect } from "react";

export function Notification ({ message, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return <div className="notification">{message}</div>;
};
