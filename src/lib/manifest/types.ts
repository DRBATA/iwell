// Core Manifest Type - Just the essential user data and configuration
export interface HSJManifest {
  version: string;
  hsj_id: string;
  created: string;
  lastModified: string;
  configurations: {
    bloodPressure: {
      enabled: boolean;
      monitoring: boolean;
      frequency: string;
      limits: {
        systolic: { min: number; max: number };
        diastolic: { min: number; max: number };
      };
    };
    cognitive: {
      enabled: boolean;
      prompts: boolean;
    };
    diagnostic: {
      enabled: boolean;
      autoAnalysis: boolean;
    };
  };
  features: {
    offline: boolean;
    encryption: boolean;
    sharing: boolean;
  };
}

// Health Data Types - Just the actual user data
export interface HSJHealthData {
  hsj_id: string;
  profile?: {
    age: number;
    gender: 'male' | 'female';
    weight: number; // kg
    height: number; // cm
    activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'extra_active';
    lastUpdated: string; // ISO date
  };
  conditions: Array<{
    id: string;
    name: string;
    diagnosed: string;  // ISO date
    status: 'active' | 'resolved' | 'monitoring';
    severity: 'mild' | 'moderate' | 'severe';
    notes?: string;
  }>;
  medications: Array<{
    id: string;
    name: string;
    dosage: string;
    frequency: string;
    startDate: string;  // ISO date
    endDate?: string;   // ISO date
    status: 'active' | 'discontinued' | 'planned';
    reason: string;
    contraindications?: string[];
    sideEffects?: string[];
  }>;
  bloodPressure?: {
    readings: Array<{
      id: number;
      timestamp: string;
      systolic: number;
      diastolic: number;
      heartRate: number;
      setting?: 'home' | 'clinic';
      position?: 'sitting' | 'standing' | 'lying';
    }>;
    analysis?: {
      trends: string[];
      recommendations: string[];
      lastAnalyzed: string;
    };
  };
  cognitive?: {
    thoughts: Array<{
      id: string;
      timestamp: string;
      automaticThought: string;
      emotion: string;
      intensity: number;
      pattern: string;
      patterns: string[];
      alternativeThought: string;
    }>;
    analysis?: {
      patterns: string[];
      insights: string[];
      lastAnalyzed: string;
    };
  };
  diagnostic?: {
    symptoms: Array<{
      id: string;
      timestamp: string;
      type: string;
      severity: number;
      description: string;
      relatedConditions?: string[];  // References condition IDs
      affectedByMedications?: string[];  // References medication IDs
    }>;
    consultations: Array<{
      id: string;
      timestamp: string;
      reason: string;
      symptoms: string[];
      diagnosis?: {
        conditions: string[];  // References condition IDs
        confidence: number;
        differentials: string[];
      };
      recommendations: Array<{
        type: 'medication' | 'lifestyle' | 'monitoring' | 'referral';
        description: string;
        priority: 'high' | 'medium' | 'low';
        contraindications?: Array<{
          type: 'condition' | 'medication';
          id: string;
          reason: string;
          severity: 'critical' | 'moderate' | 'mild';
        }>;
      }>;
    }>;
    analysis?: {
      conditions: string[];
      recommendations: string[];
      lastAnalyzed: string;
    };
  };
  calculators?: {
    bmi?: {
      lastCalculated: string;
      values: {
        bmi: number;
      };
      targets: {
        idealBMIRange: string;
        category: string;
      };
    };
    calories?: {
      lastCalculated: string;
      values: {
        bmr: number;
        tdee: number;
        protein: number;
        carbs: number;
        fats: number;
      };
      targets: {
        dailyCalories: number;
        proteinRange: string;
        carbsRange: string;
        fatsRange: string;
      };
    };
    fluid?: {
      lastCalculated: string;
      values: {
        dailyFluidNeeds: number;
        hourlyTarget: number;
      };
      targets: {
        minimumDaily: number;
        optimumDaily: number;
        maximumDaily: number;
      };
    };
  };
}

// Export Package Type
export interface HSJExportPackage {
  manifest: HSJManifest;
  healthData: HSJHealthData;
  metadata: {
    exportedAt: string;
    version: string;
    checksum: string;
  };
}

// Memory Cache Types
export interface CacheConfig {
  maxSize: number;
  retention: string;
  cleanupInterval: number;
}

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  accessed: number;
}

// Worker Message Types
export interface WorkerMessage {
  type: 'ANALYZE' | 'UPDATE' | 'SYNC';
  payload: any;
  timestamp: string;
}

export interface WorkerResponse {
  type: 'RESULT' | 'ERROR' | 'STATUS';
  payload: any;
  timestamp: string;
}

// Validation Types
export interface ValidationResult {
  valid: boolean;
  errors?: Array<{
    path: string;
    message: string;
  }>;
}

// Update Types
export type UpdatePath = string; // dot notation path e.g., 'bloodPressure.readings'
export type UpdateOperation = 'add' | 'update' | 'remove';

export interface DataUpdate {
  path: UpdatePath;
  operation: UpdateOperation;
  value: any;
  timestamp: string;
}

// Context Types
export interface HSJContextValue {
  manifest: HSJManifest | null;
  healthData: HSJHealthData | null;
  createHSJ: (data: { postcode: string; dob: string; }) => Promise<{ pin: string; manifest: HSJManifest }>;
  loadHSJ: (hsj_id: string) => Promise<void>;
  updateManifest: (update: Partial<HSJManifest>) => Promise<void>;
  updateHealthData: (update: DataUpdate) => Promise<ValidationResult>;
  ejectData: () => Promise<HSJExportPackage>;
  importData: (data: HSJExportPackage) => Promise<void>;
  verifyPin: (pin: string, hsj_id: string) => Promise<boolean>;
}
