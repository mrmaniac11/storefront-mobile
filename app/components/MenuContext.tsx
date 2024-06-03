// MenuContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface MenuContextProps {
  visibleMenu: string | null;
  setVisibleMenu: (menuId: string | null) => void;
}

interface MenuProviderProps {
  children: ReactNode;
}

const MenuContext = createContext<MenuContextProps | undefined>(undefined);

export const MenuProvider: React.FC<MenuProviderProps> = ({ children }) => {
  const [visibleMenu, setVisibleMenu] = useState<string | null>(null);

  const handleSetVisibleMenu = (menuId: string | null) => {
    setVisibleMenu(menuId);
  };

  return (
    <MenuContext.Provider value={{ visibleMenu, setVisibleMenu: handleSetVisibleMenu }}>
      {children}
    </MenuContext.Provider>
  );
};

export const useMenu = () => {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error('useMenu must be used within a MenuProvider');
  }
  return context;
};