// Types for calculator inputs and outputs
export interface CalculatorInputs {
  age: number;
  gender: 'male' | 'female';
  weight: number; // kg
  height: number; // cm
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'extra_active';
  climate?: 'temperate' | 'hot' | 'extremely_hot';
  exerciseHours?: number;
  healthConditions?: string[];
  medications?: string[];
}

export interface CalculatorOutputs {
  values: {
    [key: string]: number;
  };
  recommendations: string[];
  targets: {
    [key: string]: number | string | Record<string, number | string>;
  };
  warnings?: string[];
}

// Base calculator class with common functionality
export class BaseCalculator {
  protected inputs: CalculatorInputs;

  constructor(inputs: CalculatorInputs) {
    this.inputs = inputs;
  }

  protected validateInputs(): boolean {
    if (!this.inputs) return false;
    if (this.inputs.weight <= 0 || this.inputs.height <= 0) return false;
    if (this.inputs.age < 0) return false;
    return true;
  }

  protected getActivityFactor(): number {
    const factors = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      extra_active: 1.9
    };
    return factors[this.inputs.activityLevel] || 1.2;
  }

  protected adjustForConditions(outputs: CalculatorOutputs): CalculatorOutputs {
    const conditions = this.inputs.healthConditions || [];
    const medications = this.inputs.medications || [];
    const warnings: string[] = [];

    // Check for condition-specific adjustments
    conditions.forEach(condition => {
      switch(condition.toLowerCase()) {
        case 'hypertension':
          if (outputs.values.sodium) {
            outputs.values.sodium = Math.min(outputs.values.sodium, 1500);
            outputs.recommendations.push('Maintain sodium intake below 1500mg/day');
          }
          break;
        case 'diabetes':
          outputs.recommendations.push('Monitor blood glucose before and after exercise');
          break;
        case 'kidney_disease':
          warnings.push('Consult healthcare provider for specific fluid and dietary restrictions');
          break;
      }
    });

    // Check for medication interactions
    medications.forEach(medication => {
      switch(medication.toLowerCase()) {
        case 'diuretics':
          if (outputs.values.fluidIntake) {
            outputs.values.fluidIntake *= 1.2; // Increase by 20%
            outputs.recommendations.push('Increase fluid intake to compensate for diuretic medication');
          }
          break;
        case 'beta_blockers':
          outputs.recommendations.push('Maintain moderate intensity exercise, monitor heart rate');
          break;
        case 'ace_inhibitors':
        case 'arbs':
          if (outputs.values.fluidIntake) {
            outputs.recommendations.push('Monitor for signs of dehydration');
            warnings.push('Consider pausing medication if severely dehydrated');
          }
          break;
        case 'nsaids':
          if (outputs.values.fluidIntake) {
            outputs.recommendations.push('Maintain adequate hydration');
            warnings.push('Consider alternative pain relief if dehydrated');
          }
          break;
        case 'metformin':
          warnings.push('Risk of lactic acidosis if severely dehydrated');
          break;
      }
    });

    if (warnings.length > 0) {
      outputs.warnings = warnings;
    }

    return outputs;
  }
}
