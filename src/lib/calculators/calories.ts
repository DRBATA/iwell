import { BaseCalculator, CalculatorOutputs } from './index';

export class CalorieCalculator extends BaseCalculator {
  calculate(): CalculatorOutputs {
    if (!this.validateInputs()) {
      throw new Error('Invalid inputs for calorie calculation');
    }

    // Calculate BMR using Mifflin-St Jeor Equation
    const bmr = this.inputs.gender === 'male'
      ? (10 * this.inputs.weight) + (6.25 * this.inputs.height) - (5 * this.inputs.age) + 5
      : (10 * this.inputs.weight) + (6.25 * this.inputs.height) - (5 * this.inputs.age) - 161;

    const activityFactor = this.getActivityFactor();
    const tdee = bmr * activityFactor;

    // Calculate macronutrient targets
    const protein = Math.round(tdee * 0.3 / 4); // 30% protein (4 cal/g)
    const carbs = Math.round(tdee * 0.4 / 4);   // 40% carbs (4 cal/g)
    const fats = Math.round(tdee * 0.3 / 9);    // 30% fats (9 cal/g)

    const outputs: CalculatorOutputs = {
      values: {
        bmr: Math.round(bmr),
        tdee: Math.round(tdee),
        protein,
        carbs,
        fats
      },
      recommendations: [
        `Target protein intake: ${protein}g daily`,
        'Spread meals throughout the day',
        'Adjust intake based on hunger and energy levels'
      ],
      targets: {
        dailyCalories: Math.round(tdee),
        proteinRange: `${protein - 10}g - ${protein + 10}g`,
        carbsRange: `${carbs - 20}g - ${carbs + 20}g`,
        fatsRange: `${fats - 5}g - ${fats + 5}g`
      }
    };

    return this.adjustForConditions(outputs);
  }

  protected adjustForConditions(outputs: CalculatorOutputs): CalculatorOutputs {
    const conditions = this.inputs.healthConditions || [];
    
    conditions.forEach(condition => {
      switch(condition.toLowerCase()) {
        case 'diabetes':
          // Adjust macronutrient distribution for diabetes
          const diabeticProtein = Math.round(outputs.values.tdee * 0.35 / 4); // 35% protein
          const diabeticCarbs = Math.round(outputs.values.tdee * 0.35 / 4);   // 35% carbs
          const diabeticFats = Math.round(outputs.values.tdee * 0.30 / 9);    // 30% fats
          
          outputs.values.protein = diabeticProtein;
          outputs.values.carbs = diabeticCarbs;
          outputs.values.fats = diabeticFats;
          
          outputs.recommendations.push(
            'Focus on low glycemic index carbohydrates',
            'Monitor blood glucose response to meals'
          );
          break;

        case 'kidney_disease':
          // Adjust protein intake for kidney disease
          outputs.values.protein = Math.round(this.inputs.weight * 0.6); // 0.6g per kg body weight
          outputs.recommendations.push(
            'Protein intake restricted - follow medical guidance',
            'Monitor kidney function regularly'
          );
          break;

        case 'hypertension':
          outputs.recommendations.push(
            'Limit sodium intake to 1500-2300mg per day',
            'Focus on potassium-rich foods'
          );
          break;
      }
    });

    return outputs;
  }
}
