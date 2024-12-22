interface QuantumState {
  amplitude: number;
  phase: number;
}

interface Condition {
  name: string;
  symptoms: string[];
  matrix: (string | number)[][];
  color: string;
  criticalSymptoms?: string[];
  description?: string;
  signature?: { [key: string]: number };
  mustNotMiss?: boolean;
}

// Quantum states representing symptom correlations
const quantumStates: { [key: string]: QuantumState } = {
  a: { amplitude: 0.9, phase: 0 },           // Strong positive correlation
  b: { amplitude: 0.7, phase: Math.PI / 4 }, // Moderate positive correlation
  c: { amplitude: 0.5, phase: Math.PI / 2 }, // Neutral correlation
  d: { amplitude: 0.3, phase: 3 * Math.PI / 4 }, // Moderate negative correlation
  e: { amplitude: 0.1, phase: Math.PI }      // Strong negative correlation
};

// Condition definitions with correlation matrices
export const conditions: Condition[] = [
  {
    name: "Viral Pharyngitis (Flu)",
    symptoms: ["Wet Chesty Cough", "Green Discharge", "Muscle Ache"],
    matrix: [
      ["0", "a", "b"],
      ["a", "0", "c"],
      ["b", "c", "0"]
    ],
    color: "#3B82F6",
    criticalSymptoms: ["Muscle Ache"],
    signature: { N1: 3, N2: 2, N3: 1, N4: 1, N5: 2 }
  },
  {
    name: "Viral Pharyngitis (COVID)",
    symptoms: ["Wet Chesty Cough", "Green Discharge", "Fatigue"],
    matrix: [
      ["0", "a", "a"],
      ["a", "0", "b"],
      ["a", "b", "0"]
    ],
    color: "#EF4444",
    criticalSymptoms: ["Fatigue"],
    signature: { N1: 2, N2: 2, N3: 2, N4: 0, N5: 3 },
    mustNotMiss: true
  }
];

interface SymptomVector {
  id: string;
  intensity: number;
  type: 'i' | 'j';
}

interface PhaseResult {
  N1: number;
  N2: number;
  N3: number;
  N4: number;
  N5: number;
  criticalSymptomCount: number;
  relatedGroups: [string, string, number][];
}

export interface MatchResult {
  condition: string;
  matchStrength: number;
  matchCategory: 'Most Likely' | 'Possible' | 'Must Not Miss' | 'Unlikely';
  warningMessage: string | null;
  description: string | undefined;
  phaseDifference: number;
  relationshipStrength: number;
}

export const calculateCosineSimilarity = (vectorA: number[], vectorB: number[]): number => {
  const dotProduct = vectorA.reduce((sum, a, i) => sum + a * vectorB[i], 0);
  const magnitudeA = Math.sqrt(vectorA.reduce((sum, a) => sum + a * a, 0));
  const magnitudeB = Math.sqrt(vectorB.reduce((sum, b) => sum + b * b, 0));
  return dotProduct / (magnitudeA * magnitudeB || 1);
};

export const createSymptomVector = (symptomId: string): number[] => {
  return conditions.map(condition => 
    condition.criticalSymptoms?.includes(symptomId) ? 1 : 0
  );
};

export const findRelatedSymptoms = (symptoms: SymptomVector[]): [string, string, number][] => {
  const similarityGroups: [string, string, number][] = [];
  const threshold = 0.8;

  symptoms.forEach((symptomA, i) => {
    symptoms.slice(i + 1).forEach(symptomB => {
      const vectorA = createSymptomVector(symptomA.id);
      const vectorB = createSymptomVector(symptomB.id);
      const similarity = calculateCosineSimilarity(vectorA, vectorB);

      if (similarity >= threshold) {
        similarityGroups.push([symptomA.id, symptomB.id, similarity]);
      }
    });
  });

  return similarityGroups;
};

export const calculatePhase = (selectedSymptoms: SymptomVector[]): PhaseResult => {
  const nodeCounts = { N1: 0, N2: 0, N3: 0, N4: 0, N5: 0 };
  let criticalSymptomCount = 0;

  selectedSymptoms.forEach((symptom) => {
    const nodeIndex = symptom.type === 'i' ? 'N1' : 'N2';
    nodeCounts[nodeIndex] += symptom.intensity;

    conditions.forEach(condition => {
      if (condition.criticalSymptoms?.includes(symptom.id)) {
        criticalSymptomCount++;
      }
    });
  });

  const relatedGroups = findRelatedSymptoms(selectedSymptoms);
  
  relatedGroups.forEach(([, , similarity]) => {
    const multiplier = 1 + (similarity - 0.8);
    nodeCounts.N3 += multiplier;
  });

  return {
    N1: Math.pow(nodeCounts.N1, 1),
    N2: Math.pow(nodeCounts.N2, 1),
    N3: Math.pow(nodeCounts.N3, 1),
    N4: Math.pow(Math.abs(nodeCounts.N1 - nodeCounts.N2), 1),
    N5: Math.pow(2 * nodeCounts.N1 + nodeCounts.N2, 1),
    criticalSymptomCount,
    relatedGroups
  };
};

export const comparePhases = (userPhase: PhaseResult): MatchResult[] => {
  return conditions.map(condition => {
    const phaseDifference = Math.sqrt(
      Object.keys(userPhase)
        .filter(key => key !== 'relatedGroups' && key !== 'criticalSymptomCount')
        .reduce((sum, node) => {
          const nodeKey = node as keyof PhaseResult;
          const conditionValue = condition.signature?.[nodeKey] || 0;
          return sum + Math.pow((userPhase[nodeKey] as number) - conditionValue, 2);
        }, 0)
    );

    let relationshipBonus = 0;
    if (userPhase.relatedGroups.length > 0) {
      relationshipBonus = userPhase.relatedGroups.reduce((sum, [, , similarity]) => 
        sum + (similarity - 0.8), 0) / userPhase.relatedGroups.length;
    }

    let matchCategory: MatchResult['matchCategory'] = 'Unlikely';
    let warningMessage: string | null = null;
    
    if (condition.mustNotMiss && userPhase.criticalSymptomCount > 0) {
      matchCategory = 'Must Not Miss';
      warningMessage = `Critical: ${condition.description}`;
    } else if (phaseDifference < 2 - relationshipBonus) {
      matchCategory = 'Most Likely';
    } else if (phaseDifference < 4 - relationshipBonus) {
      matchCategory = 'Possible';
    }

    return {
      condition: condition.name,
      matchStrength: 10 - phaseDifference + relationshipBonus,
      matchCategory,
      warningMessage,
      description: condition.description,
      phaseDifference,
      relationshipStrength: relationshipBonus
    };
  }).sort((a, b) => b.matchStrength - a.matchStrength);
};
