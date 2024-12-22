import { BaseCalculator, CalculatorOutputs } from './index';

export class BMICalculator extends BaseCalculator {
  calculate(): CalculatorOutputs {
    if (!this.validateInputs()) {
      throw new Error('Invalid inputs for BMI calculation');
    }

    const bmi = this.inputs.weight / Math.pow(this.inputs.height / 100, 2);
    
    const getCategory = (bmi: number) => {
      if (bmi < 18.5) return 'Underweight';
      if (bmi < 25) return 'Normal';
      if (bmi < 30) return 'Overweight';
      return 'Obese';
    };

    const getRecommendations = (bmi: number) => {
      if (bmi < 18.5) return [
        'Consider increasing caloric intake',
        'Focus on nutrient-dense foods',
        'Regular strength training recommended'
      ];
      if (bmi < 25) return [
        'Maintain current healthy habits',
        'Regular exercise recommended',
        'Continue balanced diet'
      ];
      return [
        'Gradual weight reduction recommended',
        'Increase physical activity',
        'Consider dietary modifications'
      ];
    };

    const category = getCategory(bmi);
    const recommendations = getRecommendations(bmi);

    const outputs: CalculatorOutputs = {
      values: {
        bmi: parseFloat(bmi.toFixed(1))
      },
      recommendations,
      targets: {
        idealBMIRange: '18.5-24.9',
        category
      }
    };

    return this.adjustForConditions(outputs);
  }
}
