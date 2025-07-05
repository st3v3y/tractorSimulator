import { useEffect } from "react";
import styled from 'styled-components';

const NotificationBox = styled.div.attrs({
  className: 'fixed top-20 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg z-[1001] animate-slideIn'
})``;


export function Notification ({ message, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return <NotificationBox>{message}</NotificationBox>;
};
