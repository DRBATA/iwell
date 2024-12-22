// Age Groups Definition
export const AGE_GROUPS = [
  { name: 'Child', min: 0, max: 12 },
  { name: 'Adolescent', min: 13, max: 17 },
  { name: 'Young Adult', min: 18, max: 39 },
  { name: 'Middle Age Adult', min: 40, max: 64 },
  { name: 'Older Adult', min: 65, max: 120 },
] as const;

export type AgeGroup = typeof AGE_GROUPS[number]['name'];

// Types for health data
export interface HealthCondition {
  condition: string;
  medications: string[];
  metrics: string[];
}

export interface MedicationDetails {
  name: string;
  uses: string[];
  sideEffects: string[];
  contraindications: string[];
}

// Conditions and Medications Data
export const CONDITIONS_BY_AGE: Record<AgeGroup, HealthCondition[]> = {
  'Child': [
    {
      condition: 'Asthma',
      medications: ['Inhaled Corticosteroids', 'Short-Acting Beta Agonists'],
      metrics: ['Peak Flow', 'Symptom Frequency'],
    },
    {
      condition: 'Allergies',
      medications: ['Antihistamines'],
      metrics: ['Allergen Exposure', 'Reaction Severity'],
    },
  ],
  'Adolescent': [
    {
      condition: 'Acne',
      medications: ['Topical Retinoids', 'Antibiotics'],
      metrics: ['Lesion Count', 'Severity Index'],
    },
    {
      condition: 'Depression',
      medications: ['SSRIs', 'Counseling'],
      metrics: ['Mood Rating', 'Therapy Sessions'],
    },
  ],
  'Young Adult': [
    {
      condition: 'Anxiety',
      medications: ['Anxiolytics', 'CBT'],
      metrics: ['Anxiety Level', 'Trigger Events'],
    },
    {
      condition: 'Hypertension',
      medications: ['ACE Inhibitors', 'Lifestyle Changes'],
      metrics: ['Blood Pressure', 'Heart Rate'],
    },
  ],
  'Middle Age Adult': [
    {
      condition: 'Type 2 Diabetes',
      medications: ['Metformin', 'Insulin'],
      metrics: ['Blood Glucose', 'HbA1c'],
    },
    {
      condition: 'High Cholesterol',
      medications: ['Statins', 'Diet Modification'],
      metrics: ['Lipid Profile', 'BMI'],
    },
  ],
  'Older Adult': [
    {
      condition: 'Arthritis',
      medications: ['NSAIDs', 'Physical Therapy'],
      metrics: ['Pain Scale', 'Mobility Index'],
    },
    {
      condition: 'Osteoporosis',
      medications: ['Calcium Supplements', 'Bisphosphonates'],
      metrics: ['Bone Density', 'Fracture History'],
    },
  ],
};

// Medications Details
export const MEDICATIONS: Record<string, MedicationDetails> = {
  'Inhaled Corticosteroids': {
    name: 'Inhaled Corticosteroids',
    uses: ['Asthma'],
    sideEffects: ['Oral Thrush', 'Hoarseness'],
    contraindications: ['Allergy to Corticosteroids'],
  },
  'Short-Acting Beta Agonists': {
    name: 'Short-Acting Beta Agonists',
    uses: ['Asthma Relief'],
    sideEffects: ['Tremors', 'Palpitations'],
    contraindications: ['Cardiac Arrhythmias'],
  },
  'Metformin': {
    name: 'Metformin',
    uses: ['Type 2 Diabetes'],
    sideEffects: ['Gastrointestinal Upset', 'Lactic Acidosis'],
    contraindications: ['Renal Impairment'],
  },
};

// Helper function to get conditions by age
export const getConditionsByAge = (age: number): HealthCondition[] => {
  const ageGroup = AGE_GROUPS.find(
    (group) => age >= group.min && age <= group.max
  );
  if (ageGroup) {
    return CONDITIONS_BY_AGE[ageGroup.name] || [];
  }
  return [];
};

// Type for HSJ Data
export interface HSJData {
  pin: string;
  personalInfo: {
    dob: string;
    postcode: string;
    age: number;
  };
  healthData: Record<string, any>;
  medications: string[];
  conditions: string[];
  trackingData: Record<string, any>;
}
