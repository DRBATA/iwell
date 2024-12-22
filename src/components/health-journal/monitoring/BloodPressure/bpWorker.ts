import { HSJData, BPReading, Medication, BPAnalysis } from '../../../../hooks/useHSJData';

export function analyzeBPAndUpdateJSON(userData: HSJData): HSJData {
  // Get current data from JSON
  const readings = userData.healthData.bloodPressure.readings;
  const medications = userData.medications;
  const conditions = userData.conditions;
  const age = userData.personalInfo.age;

  // Do analysis
  const analysis: BPAnalysis = {
    medicationEffects: analyzeMedicationEffects(readings, medications),
    risks: assessRisks(readings, medications, age)
  };

  // Return updated JSON with analysis
  return {
    ...userData,
    healthData: {
      ...userData.healthData,
      bloodPressure: {
        ...userData.healthData.bloodPressure,
        analysis
      }
    }
  };
}

function analyzeMedicationEffects(readings: BPReading[], medications: Medication[]): BPAnalysis['medicationEffects'] {
  return medications.map(med => {
    const readingsOnMed = readings.filter(r => 
      r.date >= med.startDate && 
      (!med.endDate || r.date <= med.endDate)
    );

    if (readingsOnMed.length < 5) {
      return {
        medicationId: med.id,
        effect: 'neutral' as const,
        avgChange: 0
      };
    }

    const baselineReadings = readings
      .filter(r => r.date < med.startDate)
      .slice(-5);

    if (baselineReadings.length === 0) {
      return {
        medicationId: med.id,
        effect: 'neutral' as const,
        avgChange: 0
      };
    }

    const avgBefore = baselineReadings.reduce((sum, r) => sum + r.systolic, 0) / baselineReadings.length;
    const avgAfter = readingsOnMed.slice(-5).reduce((sum, r) => sum + r.systolic, 0) / 5;
    const avgChange = avgAfter - avgBefore;

    return {
      medicationId: med.id,
      effect: avgChange < -5 ? 'lowering' as const :
              avgChange > 5 ? 'raising' as const :
              'neutral' as const,
      avgChange
    };
  });
}

function assessRisks(
  readings: BPReading[], 
  medications: Medication[],
  age: number
): BPAnalysis['risks'] {
  const factors: string[] = [];
  const recentReadings = readings.slice(-7);

  // Check for low readings
  if (recentReadings.some(r => r.systolic < 110)) {
    factors.push('low_bp');
  }

  // Check medication risks
  const riskMeds = medications.filter(m => 
    m.sideEffects.includes('dizziness') || 
    m.sideEffects.includes('hypotension')
  );
  if (riskMeds.length > 0) {
    factors.push('medication_risk');
  }

  // Age consideration
  if (age >= 75) {
    factors.push('age_risk');
  }

  return {
    level: factors.length >= 3 ? 'high' as const :
           factors.length >= 1 ? 'medium' as const :
           'low' as const,
    factors,
    lastAssessed: new Date()
  };
}
