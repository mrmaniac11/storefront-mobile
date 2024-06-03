// NotificationContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

type Notification = {
  message: string;
  type: 'success' | 'error' | 'info'; // Define the types of notifications
};

type NotificationContextType = {
  notification: Notification | null;
  showNotification: (message: string, type: 'success' | 'error' | 'info') => void;
  successNotification: (message: string) => void;
  errorNotification: (message: string) => void;
  InfoNotification: (message: string) => void;

  hideNotification: () => void;
};

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notification, setNotification] = useState<Notification | null>(null);

  const showNotification = (message: string, type: 'success' | 'error' | 'info') => {
    setNotification({ message, type });
    setTimeout(() => {
      hideNotification();
    }, 3000); // Automatically hide after 3 seconds
  };

  const successNotification = (message: string) => {
    showNotification( message, 'success' );
  };

  const errorNotification = (message: string) => {
    showNotification(message, 'error' );
  };

  const InfoNotification = (message: string) => {
    showNotification(message, 'info' );
  };

  const hideNotification = () => {
    setNotification(null);
  };

  return (
    <NotificationContext.Provider value={{ notification, showNotification, successNotification, errorNotification, InfoNotification, hideNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};


// NotificationContext.tsx
// import React, { createContext, useContext, useState, ReactNode } from 'react';

// type Notification = {
//   message: string;
//   type: 'success' | 'error' | 'info'; // Define the types of notifications
// };

// type NotificationContextType = {
//   notification: Notification | null;
//   showNotification: (message: string, type: 'success' | 'error' | 'info') => void;
//   hideNotification: () => void;
// };

// const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// export const NotificationProvider = ({ children }: { children: ReactNode }) => {
//   const [notification, setNotification] = useState<Notification | null>(null);

//   const showNotification = (message: string, type: 'success' | 'error' | 'info') => {
//     setNotification({ message, type });
//     setTimeout(() => {
//       hideNotification();
//     }, 3000); // Automatically hide after 3 seconds
//   };

//   const hideNotification = () => {
//     setNotification(null);
//   };

//   return (
//     <NotificationContext.Provider value={{ notification, showNotification, hideNotification }}>
//       {children}
//     </NotificationContext.Provider>
//   );
// };

// export const useNotification = () => {
//   const context = useContext(NotificationContext);
//   if (!context) {
//     throw new Error('useNotification must be used within a NotificationProvider');
//   }
//   return context;
// };
