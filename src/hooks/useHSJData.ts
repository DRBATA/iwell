import { useState, useCallback } from 'react';
import { generateFileId } from '../lib/initData';

// Base interfaces
interface BPReading {
  id: number;
  date: Date;
  systolic: number;
  diastolic: number;
  heartRate: number;
}

interface BPAverage {
  id: number;
  date: Date;
  systolic: number;
  diastolic: number;
  heartRate: number;
  readings: BPReading[];
}

interface BPAnalysis {
  medicationEffects: Array<{
    medicationId: number;
    effect: 'lowering' | 'raising' | 'neutral';
    avgChange: number;
  }>;
  risks: {
    level: 'low' | 'medium' | 'high';
    factors: string[];
    lastAssessed: Date;
  };
}

interface SymptomRecord {
  id: string;
  timestamp: Date;
  symptoms: string[];
  intensity: number;
  notes: string;
}

interface AnalysisResult {
  id: string;
  timestamp: Date;
  symptoms: string[];
  conditions: string[];
  recommendations: string[];
}

interface ThoughtEntry {
  id: string;
  timestamp: Date;
  automaticThought: string;
  emotion: string;
  intensity: number;
  pattern?: string;  // Single pattern for backward compatibility
  patterns: string[]; // Array of patterns for new format
  alternativeThought: string;
  type: 'cognition';
  date: Date;
  content: string;
  yOffset: number;
  analysis?: {
    egoState?: 'Parent' | 'Adult' | 'Child';
    emotionalIntelligence?: {
      selfAwareness: number;
      selfRegulation: number;
      empathy: number;
      motivation: number;
      socialSkills: number;
    };
    mindfulness?: {
      presentMomentAwareness: number;
      nonJudgmentalAwareness: number;
      bodyAwareness: number;
    };
    attachmentStyle?: string;
    thoughtPattern?: {
      label: string;
      description: string;
      color: string;
      level: 'ground' | 'first' | 'second' | 'third';
    };
  };
}

interface Medication {
  id: number;
  name: string;
  dosage: string;
  frequency: string;
  timeToTake: string;
  sideEffects: string[];
  startDate: Date;
  endDate: Date | null;
  nextCheck: Date;
}

interface UserCondition {
  name: string;
  bpTarget: {
    systolic: number;
    diastolic: number;
  };
}

interface NotificationSettings {
  medicationReminders: boolean;
  appointmentAlerts: boolean;
  bpCheckReminders: boolean;
  cognitiveInsights: boolean;
  shareWithCaregivers: boolean;
}

interface CustomNotification {
  id: string;
  type: 'medication' | 'appointment' | 'bp_check' | 'alert';
  title: string;
  message: string;
  date: Date;
  priority: 'low' | 'medium' | 'high';
}

interface UserListEntry {
  id: string;
  age: number;
  icon: string;
  lastAccess: Date;
}

interface HSJData {
  pin: string;
  personalInfo: {
    dob: string;
    postcode: string;
    age: number;
    name: string;
  };
  healthData: {
    entries: any[];
    bloodPressure: {
      readings: BPReading[];
      averages: BPAverage[];
      analysis?: BPAnalysis;
    };
    diagnostics: {
      symptoms: SymptomRecord[];
      analyses: AnalysisResult[];
    };
    cognitive: {
      thoughts: ThoughtEntry[];
      patterns: string[];
      beliefs: string[];
      analysis: {
        egoStates: {
          Parent: number;
          Adult: number;
          Child: number;
        };
        emotionalMetrics: any[];
        mindfulness: any[];
        attachmentTrends: string[];
        thoughtPatterns: any[];
      };
    };
  };
  medications: Medication[];
  conditions: UserCondition[];
  trackingData: Record<string, any>;
  notifications: CustomNotification[];
  notificationSettings: NotificationSettings;
}

// Hook implementation
export function useHSJData() {
  const [data, setData] = useState<HSJData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const loadUserData = useCallback((pin: string) => {
    try {
      const fileId = generateFileId(pin);
      const storedData = localStorage.getItem(fileId);
      
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        // Convert date strings back to Date objects
        if (parsedData.healthData?.bloodPressure?.readings) {
          parsedData.healthData.bloodPressure.readings = parsedData.healthData.bloodPressure.readings.map(
            (reading: any) => ({ ...reading, date: new Date(reading.date) })
          );
        }
        if (parsedData.healthData?.cognitive?.thoughts) {
          parsedData.healthData.cognitive.thoughts = parsedData.healthData.cognitive.thoughts.map(
            (thought: any) => ({
              ...thought,
              timestamp: new Date(thought.timestamp),
              date: new Date(thought.date)
            })
          );
        }
        if (parsedData.medications) {
          parsedData.medications = parsedData.medications.map(
            (med: any) => ({
              ...med,
              startDate: new Date(med.startDate),
              endDate: med.endDate ? new Date(med.endDate) : null,
              nextCheck: new Date(med.nextCheck)
            })
          );
        }
        if (parsedData.notifications) {
          parsedData.notifications = parsedData.notifications.map(
            (notif: any) => ({
              ...notif,
              date: new Date(notif.date)
            })
          );
        }
        setData(parsedData);
        setIsAuthenticated(true);
      }
      setLoading(false);
    } catch (err) {
      setError('Failed to load health data');
      setLoading(false);
    }
  }, []);

  const saveData = useCallback((newData: HSJData) => {
    try {
      const fileId = generateFileId(newData.pin);
      localStorage.setItem(fileId, JSON.stringify({
        ...newData,
        lastAccess: new Date()
      }));
      setData(newData);
    } catch (err) {
      setError('Failed to save health data');
    }
  }, []);

  const getUserList = useCallback((): UserListEntry[] => {
    const users: UserListEntry[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('hsj_')) {
        const userData = JSON.parse(localStorage.getItem(key) || '{}');
        users.push({
          id: key.replace('hsj_', ''),
          age: userData.personalInfo.age,
          icon: '👤',
          lastAccess: new Date(userData.lastAccess)
        });
      }
    }
    return users;
  }, []);

  const addBPReading = useCallback((reading: BPReading) => {
    if (!data || !isAuthenticated) return;
    const newData = {
      ...data,
      healthData: {
        ...data.healthData,
        bloodPressure: {
          ...data.healthData.bloodPressure,
          readings: [...(data.healthData.bloodPressure?.readings || []), reading]
        }
      }
    };
    saveData(newData);
  }, [data, isAuthenticated, saveData]);

  const addThoughtEntry = useCallback((thought: ThoughtEntry) => {
    if (!data || !isAuthenticated) return;
    const newData = {
      ...data,
      healthData: {
        ...data.healthData,
        cognitive: {
          ...data.healthData.cognitive,
          thoughts: [...(data.healthData.cognitive?.thoughts || []), thought]
        }
      }
    };
    saveData(newData);
  }, [data, isAuthenticated, saveData]);

  const addSymptomRecord = useCallback((symptom: SymptomRecord) => {
    if (!data || !isAuthenticated) return;
    const newData = {
      ...data,
      healthData: {
        ...data.healthData,
        diagnostics: {
          ...data.healthData.diagnostics,
          symptoms: [...(data.healthData.diagnostics?.symptoms || []), symptom]
        }
      }
    };
    saveData(newData);
  }, [data, isAuthenticated, saveData]);

  const getNotifications = useCallback(() => {
    if (!data || !data.notifications || !data.notificationSettings) return [];
    
    return data.notifications.filter((notification: CustomNotification) => {
      switch (notification.type) {
        case 'medication':
          return data.notificationSettings.medicationReminders;
        case 'appointment':
          return data.notificationSettings.appointmentAlerts;
        case 'bp_check':
          return data.notificationSettings.bpCheckReminders;
        case 'alert':
          return true;
        default:
          return false;
      }
    });
  }, [data]);

  const ejectUser = useCallback(() => {
    setData(null);
    setIsAuthenticated(false);
  }, []);

  return {
    data,
    loading,
    error,
    isAuthenticated,
    loadUserData,
    saveData,
    addBPReading,
    addThoughtEntry,
    addSymptomRecord,
    getUserList,
    getNotifications,
    ejectUser,
  };
}

// Export types
export type { 
  HSJData,
  BPReading,
  BPAverage,
  SymptomRecord,
  AnalysisResult,
  ThoughtEntry,
  Medication,
  UserCondition,
  CustomNotification as Notification,
  NotificationSettings,
  UserListEntry,
  BPAnalysis
};
