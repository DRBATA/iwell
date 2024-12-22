// Medical Systems Index with Calculators, Testing Plans, and Nutritional Info

// Types
type AgeGroupName = 'Child' | 'Adolescent' | 'Young Adult' | 'Middle Age Adult' | 'Older Adult';
type CalculatorType = 'bmi' | 'calories' | 'fluid' | 'activity' | 'childFluid' | 'progress';

interface AgeGroup {
  name: AgeGroupName;
  min: number;
  max: number;
}

interface TestingPlan {
  type: string;
  frequency: string;
  parameters: string[];
  normalRanges?: Record<string, string>;
}

interface NutritionalInfo {
  requirements: string[];
  restrictions?: string[];
  recommendations: string[];
  supplements?: string[];
}

interface Condition {
  condition: string;
  medications: string[];
  metrics: string[];
  calculators: CalculatorType[];
  testingPlans: TestingPlan[];
  nutritionalInfo: NutritionalInfo;
}

interface Medication {
  name: string;
  uses: string[];
  sideEffects: string[];
  contraindications: string[];
  monitoring: {
    tests: string[];
    frequency: string;
  };
  nutritionalConsiderations?: {
    interactions: string[];
    supplements: string[];
    timing: string;
  };
}

type ConditionsByAge = {
  [K in AgeGroupName]: Condition[];
};

type MedicationDetails = {
  [key: string]: Medication;
};

// Age Groups Definition
export const AGE_GROUPS: AgeGroup[] = [
  { name: 'Child', min: 0, max: 12 },
  { name: 'Adolescent', min: 13, max: 17 },
  { name: 'Young Adult', min: 18, max: 39 },
  { name: 'Middle Age Adult', min: 40, max: 64 },
  { name: 'Older Adult', min: 65, max: 120 }
];

// Conditions by Age Group with Extended Information
export const CONDITIONS_BY_AGE: ConditionsByAge = {
  'Child': [
    {
      condition: 'Asthma',
      medications: ['Inhaled Corticosteroids', 'Short-Acting Beta Agonists'],
      metrics: ['Peak Flow', 'Symptom Frequency'],
      calculators: ['childFluid', 'activity'],
      testingPlans: [
        {
          type: 'Spirometry',
          frequency: 'Every 6-12 months',
          parameters: ['FEV1', 'FVC', 'PEF'],
          normalRanges: {
            'FEV1': '80-120% predicted',
            'FVC': '80-120% predicted'
          }
        }
      ],
      nutritionalInfo: {
        requirements: ['Adequate Vitamin D', 'Omega-3 fatty acids'],
        recommendations: [
          'Anti-inflammatory foods',
          'Regular hydration'
        ],
        supplements: ['Vitamin D if deficient']
      }
    }
  ],
  'Adolescent': [
    {
      condition: 'Acne',
      medications: ['Topical Retinoids', 'Antibiotics'],
      metrics: ['Lesion Count', 'Severity Index'],
      calculators: ['bmi', 'fluid'],
      testingPlans: [
        {
          type: 'Dermatological Assessment',
          frequency: 'Every 3 months',
          parameters: ['Lesion count', 'Inflammation level']
        }
      ],
      nutritionalInfo: {
        requirements: ['Balanced diet', 'Adequate hydration'],
        recommendations: [
          'Low glycemic foods',
          'Omega-3 rich foods'
        ]
      }
    }
  ],
  'Young Adult': [
    {
      condition: 'Anxiety',
      medications: ['SSRIs', 'Anxiolytics'],
      metrics: ['Anxiety Score', 'Sleep Quality'],
      calculators: ['activity', 'progress'],
      testingPlans: [
        {
          type: 'Mental Health Assessment',
          frequency: 'Monthly',
          parameters: ['GAD-7 score', 'Sleep diary']
        }
      ],
      nutritionalInfo: {
        requirements: ['Regular meals', 'Complex carbohydrates'],
        recommendations: [
          'Limit caffeine',
          'Magnesium-rich foods'
        ],
        supplements: ['B-complex vitamins']
      }
    }
  ],
  'Middle Age Adult': [
    {
      condition: 'Type 2 Diabetes',
      medications: ['Metformin', 'Insulin'],
      metrics: ['Blood Glucose', 'HbA1c'],
      calculators: ['bmi', 'calories', 'activity'],
      testingPlans: [
        {
          type: 'Blood Tests',
          frequency: 'Every 3-6 months',
          parameters: ['HbA1c', 'Fasting glucose', 'Kidney function'],
          normalRanges: {
            'HbA1c': '<48 mmol/mol',
            'Fasting glucose': '4-7 mmol/L'
          }
        }
      ],
      nutritionalInfo: {
        requirements: ['Controlled carbohydrate intake', 'Regular meal timing'],
        restrictions: ['Simple sugars', 'Excessive carbohydrates'],
        recommendations: [
          'Low glycemic index foods',
          'Regular small meals',
          'Carbohydrate counting'
        ]
      }
    }
  ],
  'Older Adult': [
    {
      condition: 'Osteoporosis',
      medications: ['Bisphosphonates', 'Calcium supplements'],
      metrics: ['Bone Density', 'Fall Risk'],
      calculators: ['bmi', 'activity'],
      testingPlans: [
        {
          type: 'DEXA Scan',
          frequency: 'Every 2 years',
          parameters: ['T-score', 'Z-score'],
          normalRanges: {
            'T-score': 'Above -2.5'
          }
        }
      ],
      nutritionalInfo: {
        requirements: ['Calcium', 'Vitamin D'],
        recommendations: [
          'Calcium-rich foods',
          'Vitamin D exposure',
          'Protein-rich diet'
        ],
        supplements: ['Calcium', 'Vitamin D3']
      }
    }
  ]
};

// Helper Functions

export function getConditionsByAge(age: number): Condition[] {
  const ageGroup = AGE_GROUPS.find(group => age >= group.min && age <= group.max);
  if (ageGroup) {
    return CONDITIONS_BY_AGE[ageGroup.name] || [];
  }
  return [];
}

export function getCalculatorsForCondition(condition: string, age: number): CalculatorType[] {
  const conditions = getConditionsByAge(age);
  const matchingCondition = conditions.find(c => c.condition === condition);
  return matchingCondition?.calculators || [];
}

export function getTestingPlanForCondition(condition: string, age: number): TestingPlan[] {
  const conditions = getConditionsByAge(age);
  const matchingCondition = conditions.find(c => c.condition === condition);
  return matchingCondition?.testingPlans || [];
}

export function getNutritionalInfoForCondition(condition: string, age: number): NutritionalInfo | null {
  const conditions = getConditionsByAge(age);
  const matchingCondition = conditions.find(c => c.condition === condition);
  return matchingCondition?.nutritionalInfo || null;
}
