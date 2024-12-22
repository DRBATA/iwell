interface SymptomConditionMap {
  [condition: string]: number | string;
}

interface SymptomMap {
  [symptom: string]: SymptomConditionMap;
}

interface MedicationData {
  symptoms: SymptomMap;
  special_notes?: string;
  type?: string;
}

interface MedicationMatrix {
  [medication: string]: MedicationData;
}

interface MedicationRecommendation {
  medication: string;
  score: number;
  matching_symptoms: string[];
  special_notes?: string;
}

export class MedicationRecommendationMatrix {
  private medication_matrix: MedicationMatrix = {
    "BIOGLAN": {
      "symptoms": {
        "sore_throat": {"flu": 0, "cold": 0, "cough": 0, "strep": 0, "mono": 1},
        "cough": {"flu": 0, "cold": 0, "cough": 1, "strep": 1, "mono": 1},
        "rash": {"flu": 0, "cold": 0, "cough": 0, "strep": 0, "mono": 0},
        "glands/tonsils": {"flu": 1, "cold": 0, "cough": 0, "strep": 1, "mono": 1},
        "unwell": {"flu": 0, "cold": 0, "cough": 1, "strep": 1, "mono": 1}
      },
      "special_notes": "Gateway medication to antibiotics (probiotic)",
      "type": "probiotic"
    },
    "BUSCOPAN": {
      "symptoms": {
        "tummy_cramp": {"irritable_bowel": 0, "coeliac": 0, "inflamed_bowel": 0, "bowel_cancer": 0, "diverticulitis": 1},
        "reflux": {"irritable_bowel": 0, "coeliac": 0, "inflamed_bowel": 1},
        "diarrhea/constipation": {"irritable_bowel": 1, "coeliac": 1},
        "blood_in_bowel": {"diverticulitis": 1}
      }
    },
    "GAVISCON_DOUBLE_ACTION": {
      "symptoms": {
        "sore_throat": {"gastritis": 1},
        "cough": {"gastritis": 1},
        "rash": {"gastritis": 0},
        "glands/tonsils": {"gastritis": 1},
        "unwell": {"gastritis": 0}
      }
    },
    "CETIRIZINE": {
      "symptoms": {
        "sore_throat": {"flu": 0, "cold": 0, "cough": 0, "strep": 0, "mono": 0, "allergy": 1},
        "cough": {"flu": 1, "cold": 1, "cough": 1, "strep": 0, "mono": 0, "allergy": 1},
        "rash": {"flu": 0, "cold": 0, "cough": 0, "strep": 0, "mono": 0, "allergy": 1},
        "glands/tonsils": {"flu": 1, "cold": 0, "cough": 0, "strep": 0, "mono": 0, "allergy": 0}
      }
    },
    "NEXIUM": {
      "symptoms": {
        "reflux_sore_throat": {"cold": 1, "cough": 0},
        "gastritis_taste": {"cold": 0, "cough": 1},
        "on_ibuprofen": {"cold": 0, "cough": 0, "mono": 1}
      }
    },
    "PARACETAMOL": {
      "symptoms": {
        "sore_throat": {"flu": 1, "cold": 1, "cough": "DRY", "strep": "SORE", "mono": 0, "covid": 1},
        "cough": {"flu": "WET", "cold": "WET", "dry": "DRY"},
        "rash": {"flu": 0, "blanching": "Blanching Red", "migrating": "Blotchy migrating transient blanching"},
        "glands": {"flu": "ENLARGED", "strep": 1},
        "unwell": {"flu": 1, "cold": 1},
        "body_aches": {"flu": 1, "cold": 0},
        "headache": {"flu": 1, "cold": 1},
        "fever": {"flu": 1, "cold": 1},
        "blocked_nose": {"flu": 1, "cold": 1}
      }
    },
    "VIX_FIRST_DEFENCE": {
      "symptoms": {
        "sore_throat": {"flu": 1, "cold": 1, "cough": 0, "strep": 0, "mono": 0},
        "cough": {"flu": 1, "cold": 1, "cough": 0},
        "rash": {"flu": 0, "cold": 0, "cough": 0},
        "glands/tonsils": {"flu": 0, "cold": 1, "cough": 0},
        "unwell": {"flu": 1, "cold": 1, "cough": 0}
      },
      "special_notes": "Early intervention to prevent progression"
    }
  };

  getRecommendedMedications(symptoms: string[], conditions: string[]): MedicationRecommendation[] {
    const recommendations: MedicationRecommendation[] = [];

    for (const [med_name, med_data] of Object.entries(this.medication_matrix)) {
      let score = 0;
      const matches: string[] = [];

      for (const symptom of symptoms) {
        if (med_data.symptoms[symptom]) {
          for (const condition of conditions) {
            const value = med_data.symptoms[symptom][condition];
            if (value === 1 || typeof value === 'string') {
              score += 1;
              matches.push(`${symptom} with ${condition}`);
            }
          }
        }
      }

      if (score > 0) {
        recommendations.push({
          medication: med_name,
          score,
          matching_symptoms: matches,
          special_notes: med_data.special_notes
        });
      }
    }

    return recommendations.sort((a, b) => b.score - a.score);
  }

  isConditionCombinationValid(medication: string, conditions: string[]): boolean {
    const invalidCombinations: { [key: string]: string[][] } = {
      "NEXIUM": [["cold", "mono"]],
      "BUSCOPAN": [["irritable_bowel", "bowel_cancer"]]
    };

    if (medication in invalidCombinations) {
      return !invalidCombinations[medication].some(combo => 
        combo.every(c => conditions.includes(c))
      );
    }
    return true;
  }
}

export const medicationMatrix = new MedicationRecommendationMatrix();
