import React, { createContext, useContext, useState, useEffect } from 'react';

export type AppMode = 'biodata' | 'resume';

interface AppModeContextType {
  appMode: AppMode;
  setAppMode: (mode: AppMode) => void;
}

const AppModeContext = createContext<AppModeContextType | undefined>(undefined);

const STORAGE_KEY_APP_MODE = 'biodata_app_mode';

export const AppModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [appMode, setAppModeState] = useState<AppMode>(() => {
    return (localStorage.getItem(STORAGE_KEY_APP_MODE) as AppMode) || 'biodata';
  });

  const setAppMode = (mode: AppMode) => {
    setAppModeState(mode);
    localStorage.setItem(STORAGE_KEY_APP_MODE, mode);
  };

  return (
    <AppModeContext.Provider value={{ appMode, setAppMode }}>
      {children}
    </AppModeContext.Provider>
  );
};

export function useAppMode(): AppModeContextType {
  const context = useContext(AppModeContext);
  if (!context) {
    throw new Error('useAppMode must be used within an AppModeProvider');
  }
  return context;
}
