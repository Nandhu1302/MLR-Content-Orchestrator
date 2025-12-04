import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  industryProblems,
  clientPainPoints,
  hiddenCosts,
  earlyAdopterResults,
  demoProofPoints,
  competitiveFeatures,
  riskMatrix,
  implementationPhases,
  successMetrics,
  securityCompliance,
  integrationSystems,
} from '@/utils/marketingDeckData';

const MarketingDeckContext = createContext(undefined);

export const useMarketingDeck = () => {
  const context = useContext(MarketingDeckContext);
  if (!context) {
    throw new Error('useMarketingDeck must be used within MarketingDeckProvider');
  }
  return context;
};

const getDefaultData = () => ({
  title: {
    heading: 'Content Orchestrator',
    subheading: 'Intelligence-Driven Pharmaceutical Content Operations',
    valueProposition: 'Strategy → Content → Compliance → Global',
    valueAmount: '$4.3M Annual Value',
    tagline: 'Strategic Business Case & Implementation Roadmap',
    confidentialNote: 'Confidential - For Discussion Purposes Only',
  },
  industryProblems,
  clientPainPoints,
  hiddenCosts,
  earlyAdopterResults,
  demoProofPoints,
  competitiveFeatures,
  riskMatrix,
  implementationPhases,
  successMetrics,
  securityCompliance,
  integrationSystems,
});

export const MarketingDeckProvider = ({ children }) => {
  const [slideData, setSlideData] = useState(getDefaultData);
  const [isDirty, setIsDirty] = useState(false);
  const [language, setLanguage] = useState('en');

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('marketingDeckData');
    if (saved) {
      try {
        setSlideData(JSON.parse(saved));
        setIsDirty(true);
      } catch (e) {
        console.error('Failed to load saved deck data:', e);
      }
    }
  }, []);

  // Save to localStorage when data changes
  useEffect(() => {
    if (isDirty) {
      localStorage.setItem('marketingDeckData', JSON.stringify(slideData));
    }
  }, [slideData, isDirty]);

  const updateSlideData = (path, value) => {
    setSlideData((prev) => {
      const newData = { ...prev };
      const keys = path.split('.');
      let current = newData;
      
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      return newData;
    });
    setIsDirty(true);
  };

  const resetToDefaults = () => {
    setSlideData(getDefaultData());
    setIsDirty(false);
    localStorage.removeItem('marketingDeckData');
  };

  return (
    <MarketingDeckContext.Provider
      value={{
        slideData,
        isDirty,
        language,
        updateSlideData,
        resetToDefaults,
        setLanguage,
      }}
    >
      {children}
    </MarketingDeckContext.Provider>
  );
};