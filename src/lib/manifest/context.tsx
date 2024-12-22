import React, { createContext, useContext, useCallback } from 'react';
import { hsjManager } from './manager';
import { 
  HSJManifest, 
  HSJHealthData, 
  HSJExportPackage,
  HSJContextValue,
  DataUpdate
} from './types';

const HSJContext = createContext<HSJContextValue | null>(null);

export const useHSJ = () => {
  const context = useContext(HSJContext);
  if (!context) {
    throw new Error('useHSJ must be used within a HSJProvider');
  }
  return context;
};

interface HSJProviderProps {
  children: React.ReactNode;
}

export const HSJProvider: React.FC<HSJProviderProps> = ({ children }) => {
  const [manifest, setManifest] = React.useState<HSJManifest | null>(null);
  const [healthData, setHealthData] = React.useState<HSJHealthData | null>(null);

  // Create new HSJ
  const createHSJ = useCallback(async (data: { postcode: string; dob: string; }) => {
    const result = await hsjManager.createNewHSJ(data);
    setManifest(result.manifest);
    setHealthData(result.healthData);
    return result;
  }, []);

  // Load HSJ from file
  const loadHSJ = useCallback(async (data: HSJExportPackage) => {
    setManifest(data.manifest);
    setHealthData(data.healthData);
    hsjManager.setCurrentHSJId(data.manifest.hsj_id);
  }, []);

  // Update health data
  const updateHealthData = useCallback(async (update: DataUpdate) => {
    if (!healthData) {
      throw new Error('No HSJ currently loaded');
    }

    const result = await hsjManager.validateUpdate(update);
    if (result.valid) {
      const updatedData = hsjManager.applyUpdate(healthData, update);
      setHealthData(updatedData);
    }
    return result;
  }, [healthData]);

  // Update manifest
  const updateManifest = useCallback(async (update: Partial<HSJManifest>) => {
    if (!manifest) {
      throw new Error('No HSJ currently loaded');
    }
    const updatedManifest = { ...manifest, ...update };
    setManifest(updatedManifest);
  }, [manifest]);

  // Eject data
  const ejectData = useCallback(async () => {
    if (!manifest || !healthData) {
      throw new Error('No HSJ currently loaded');
    }

    const exportPackage: HSJExportPackage = {
      manifest,
      healthData,
      metadata: {
        exportedAt: new Date().toISOString(),
        version: manifest.version,
        checksum: 'not-implemented' // We removed storage which did checksums
      }
    };

    setManifest(null);
    setHealthData(null);
    hsjManager.setCurrentHSJId(null);

    return exportPackage;
  }, [manifest, healthData]);

  // Import data
  const importData = useCallback(async (data: HSJExportPackage) => {
    setManifest(data.manifest);
    setHealthData(data.healthData);
    hsjManager.setCurrentHSJId(data.manifest.hsj_id);
  }, []);

  // Verify PIN
  const verifyPin = useCallback(async (pin: string, hsj_id: string) => {
    return hsjManager.verifyPin(pin, hsj_id);
  }, []);

  const value = React.useMemo(() => ({
    manifest,
    healthData,
    setManifest,
    createHSJ,
    loadHSJ,
    updateManifest,
    updateHealthData,
    ejectData,
    importData,
    verifyPin
  }), [
    manifest,
    healthData,
    createHSJ,
    loadHSJ,
    updateManifest,
    updateHealthData,
    ejectData,
    importData,
    verifyPin
  ]);

  return (
    <HSJContext.Provider value={value}>
      {children}
    </HSJContext.Provider>
  );
};
