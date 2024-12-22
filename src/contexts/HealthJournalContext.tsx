import React, { createContext, useContext, useState, useEffect } from 'react';

interface HealthJournalContextType {
  healthData: any;
  updateHealthData: (section: string, data: any) => void;
  initializeHealthJournal: (data: { 
    pin: string;
    fileId: string;
    healthProfile?: any;
  }) => void;
  exportData: () => string;
  importData: (jsonData: string) => void;
}

const HealthJournalContext = createContext<HealthJournalContextType | undefined>(undefined);

export function HealthJournalProvider({ children }: { children: React.ReactNode }) {
  const [healthData, setHealthData] = useState<any>(null);

  // Load data from localStorage on mount
  useEffect(() => {
    const storedData = localStorage.getItem('healthData');
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        // Only load if it's a valid HSJ (has hsj_id)
        if (parsedData.hsj_id) {
          setHealthData(parsedData);
        }
      } catch (error) {
        console.error('Failed to load health data:', error);
      }
    }
  }, []);

  const updateHealthData = (section: string, data: any) => {
    if (!healthData?.hsj_id) return;

    const updatedData = section ? {
      ...healthData,
      [section]: data
    } : data; // If no section provided, update entire profile

    setHealthData(updatedData);
    localStorage.setItem('healthData', JSON.stringify(updatedData));
  };

  const initializeHealthJournal = (data: { 
    pin: string;
    fileId: string;
    healthProfile?: any;
  }) => {
    if (!data.healthProfile?.hsj_id) return;

    // Store in localStorage with fileId
    localStorage.setItem(data.fileId, JSON.stringify(data.healthProfile));
    localStorage.setItem('healthData', JSON.stringify(data.healthProfile));
    
    setHealthData(data.healthProfile);
  };

  const exportData = () => {
    if (!healthData?.hsj_id) return '';
    return JSON.stringify(healthData);
  };

  const importData = (jsonData: string) => {
    try {
      const parsedData = JSON.parse(jsonData);
      // Verify this is a valid HSJ
      if (!parsedData.hsj_id) {
        throw new Error('Invalid health journal format');
      }
      setHealthData(parsedData);
      localStorage.setItem('healthData', jsonData);
    } catch (error) {
      console.error('Failed to import data:', error);
    }
  };

  return (
    <HealthJournalContext.Provider 
      value={{ 
        healthData, 
        updateHealthData, 
        initializeHealthJournal,
        exportData,
        importData
      }}
    >
      {children}
    </HealthJournalContext.Provider>
  );
}

export function useHealthJournal() {
  const context = useContext(HealthJournalContext);
  if (context === undefined) {
    throw new Error('useHealthJournal must be used within a HealthJournalProvider');
  }
  return context;
}

export default HealthJournalContext;
