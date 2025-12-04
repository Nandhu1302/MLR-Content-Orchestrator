import { createContext, useContext, useState } from 'react';

const SlideThemeContext = createContext(undefined);

export const useSlideTheme = () => {
  const context = useContext(SlideThemeContext);
  if (!context) {
    throw new Error('useSlideTheme must be used within SlideThemeProvider');
  }
  return context;
};

export const SlideThemeProvider = ({ children }) => {
  const [primaryBrandId, setPrimaryBrandId] = useState(null);
  const [secondaryBrandId, setSecondaryBrandId] = useState(null);

  return (
    <SlideThemeContext.Provider
      value={{
        primaryBrandId,
        secondaryBrandId,
        setPrimaryBrandId,
        setSecondaryBrandId,
      }}
    >
      {children}
    </SlideThemeContext.Provider>
  );
};