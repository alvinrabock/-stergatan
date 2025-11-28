// context/ui-context.tsx
'use client';

import React, { createContext, useContext, useState } from 'react';

interface UIContextType {
  isHeroVisible: boolean;
  setIsHeroVisible: (value: boolean) => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export const UIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isHeroVisible, setIsHeroVisible] = useState(false);

  return (
    <UIContext.Provider value={{ isHeroVisible, setIsHeroVisible }}>
      {children}
    </UIContext.Provider>
  );
};

export const useUIContext = (): UIContextType => {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error('useUIContext must be used within a UIProvider');
  }
  return context;
};
