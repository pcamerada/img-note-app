import React, { createContext, useContext, useState } from "react";

type AlertType = "error" | "warning" | "info" | "success";

interface Alert {
  type: AlertType;
  message: string;
}

interface HelperContextProps {
  alert: Alert | null;
  showAlert: (alert: Alert) => void;
  hideAlert: () => void;
  loader: boolean;
  showLoader: () => void;
  hideLoader: () => void;
}

const HelperContext = createContext<HelperContextProps | undefined>(undefined);

export const HelperProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [alert, setAlert] = useState<Alert | null>(null);
    const [loader, setLoader] = useState(false);
  
    const showAlert = (alert: Alert) => {
      setAlert(alert);
    };
  
    const hideAlert = () => {
      setAlert(null);
    };
  
    const showLoader = () => {
      setLoader(true);
    };
  
    const hideLoader = () => {
      setLoader(false);
    };
  
    return (
      <HelperContext.Provider
        value={{
          alert,
          showAlert,
          hideAlert,
          loader,
          showLoader,
          hideLoader,
        }}
      >
        {children}
      </HelperContext.Provider>
    );
  };
  
  export const useHelper = (): HelperContextProps => {
    const context = useContext(HelperContext);
    if (!context) {
      throw new Error('useHelper must be used within a HelperProvider');
    }
    return context;
  };