import { BaseCalculator, CalculatorOutputs } from './index';

type ActivityTargets = {
  [key: string]: number | string | undefined;
} & {
  moderateMinutes: number;
  vigorousMinutes: number;
  strengthDays: number;
  stretchingMinutes: number;
  sessionDuration?: number;
  maxHeartRate?: number;
  glucoseCheckInterval?: number;
};

export class ActivityCalculator extends BaseCalculator {
  calculate(): CalculatorOutputs {
    if (!this.validateInputs()) {
      throw new Error('Invalid inputs for activity calculation');
    }

    // Calculate base activity targets
    const weeklyMinutes = this.inputs.activityLevel === 'sedentary' ? 150 :
                         this.inputs.activityLevel === 'light' ? 180 :
                         this.inputs.activityLevel === 'moderate' ? 210 :
                         240; // active/extra_active

    // Calculate calorie burn targets based on MET values
    // MET values: Light = 3, Moderate = 5, Vigorous = 7
    const caloriesPerMinute = (this.inputs.weight * 3.5) / 200; // Basic MET calculation
    const weeklyCaloriesBurn = Math.round(caloriesPerMinute * weeklyMinutes * 5); // Average MET of 5

    const targets: ActivityTargets = {
      moderateMinutes: Math.round(weeklyMinutes * 0.7), // 70% moderate intensity
      vigorousMinutes: Math.round(weeklyMinutes * 0.3), // 30% vigorous intensity
      strengthDays: 2, // WHO recommendation
      stretchingMinutes: 10 // Daily flexibility work
    };

    const outputs: CalculatorOutputs = {
      values: {
        weeklyMinutes,
        dailyMinutes: Math.round(weeklyMinutes / 7),
        weeklyCaloriesBurn,
        dailyCaloriesBurn: Math.round(weeklyCaloriesBurn / 7)
      },
      recommendations: [
        `Aim for ${Math.round(weeklyMinutes / 7)} minutes of activity daily`,
        'Include both cardio and strength training',
        'Take rest days as needed'
      ],
      targets: targets as { [key: string]: number | string | Record<string, number | string> }
    };

    return this.adjustForConditions(outputs);
  }

  protected adjustForConditions(outputs: CalculatorOutputs): CalculatorOutputs {
    const conditions = this.inputs.healthConditions || [];
    const medications = this.inputs.medications || [];
    const targets = outputs.targets as ActivityTargets;
    
    conditions.forEach(condition => {
      switch(condition.toLowerCase()) {
        case 'hypertension':
          outputs.recommendations = [
            'Focus on moderate-intensity activities',
            'Avoid holding breath during exercise',
            'Monitor blood pressure before and after activity',
            'Start slowly and progress gradually'
          ];
          const reducedVigorous = Math.round(targets.vigorousMinutes * 0.5);
          targets.vigorousMinutes = reducedVigorous;
          targets.moderateMinutes += reducedVigorous;
          break;

        case 'diabetes':
          outputs.recommendations.push(
            'Check blood glucose before and after exercise',
            'Carry fast-acting carbohydrates during activity',
            'Exercise with a partner when possible'
          );
          targets.sessionDuration = 30; // Max minutes per session
          break;

        case 'arthritis':
          outputs.recommendations = [
            'Focus on low-impact activities',
            'Include range-of-motion exercises',
            'Listen to your body and avoid overexertion',
            'Consider water-based exercises'
          ];
          targets.stretchingMinutes = 15;
          targets.strengthDays = 3;
          break;

        case 'heart_disease':
          outputs.recommendations = [
            'Start with short sessions and progress slowly',
            'Monitor heart rate during activity',
            'Stop if experiencing chest pain or dizziness',
            'Exercise during cooler parts of the day'
          ];
          outputs.warnings = outputs.warnings || [];
          outputs.warnings.push('Consult healthcare provider before starting new activities');
          targets.maxHeartRate = Math.round(220 - this.inputs.age * 0.7);
          break;
      }
    });

    medications.forEach(medication => {
      switch(medication.toLowerCase()) {
        case 'beta_blockers':
          outputs.recommendations.push(
            'Use perceived exertion rather than heart rate',
            'Avoid sudden changes in intensity'
          );
          targets.maxHeartRate = Math.round((220 - this.inputs.age) * 0.6);
          break;

        case 'blood_thinners':
          outputs.recommendations.push(
            'Avoid activities with high risk of falling',
            'Wear protective gear during activities'
          );
          outputs.warnings = outputs.warnings || [];
          outputs.warnings.push('Higher risk of bleeding - avoid contact sports');
          break;

        case 'insulin':
          outputs.recommendations.push(
            'Monitor blood glucose more frequently during exercise',
            'Adjust insulin dosage as recommended by healthcare provider'
          );
          targets.glucoseCheckInterval = 30; // minutes
          break;
      }
    });

    outputs.targets = targets as { [key: string]: number | string | Record<string, number | string> };
    return outputs;
  }
}
