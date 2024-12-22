export interface BPReading {
  id: number;
  timestamp: string;
  systolic: number;
  diastolic: number;
  heartRate: number;
  setting?: 'home' | 'clinic';
  position?: 'sitting' | 'standing' | 'lying';
}

export interface BPValidationLimits {
  systolic: { min: number; max: number };
  diastolic: { min: number; max: number };
}

export interface BPChartProps {
  readings: BPReading[];
  onReadingClick: (reading: BPReading) => void;
  validationLimits: BPValidationLimits;
}

export interface BPEntryFormProps {
  onSubmit: (reading: Omit<BPReading, 'id' | 'timestamp'>) => void;
  mode: 'quick' | 'standard';
  requireChecks: boolean;
  validationLimits: BPValidationLimits;
}

export interface BloodPressureProps {
  healthData: {
    bloodPressure?: {
      readings: BPReading[];
    };
  };
  onUpdate: (data: { readings: BPReading[] }) => void;
}
