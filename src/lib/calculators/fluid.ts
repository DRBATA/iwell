import { BaseCalculator, CalculatorOutputs } from './index';

export class FluidCalculator extends BaseCalculator {
  calculate(): CalculatorOutputs {
    if (!this.validateInputs()) {
      throw new Error('Invalid inputs for fluid calculation');
    }

    // Base fluid calculation (in liters)
    let fluidNeeds = this.inputs.weight * 0.033;

    // Adjust for activity
    if (this.inputs.exerciseHours) {
      switch (this.inputs.activityLevel) {
        case 'moderate':
          fluidNeeds += 0.35 * this.inputs.exerciseHours;
          break;
        case 'active':
        case 'extra_active':
          fluidNeeds += 0.7 * this.inputs.exerciseHours;
          break;
      }
    }

    // Adjust for climate
    if (this.inputs.climate === 'hot') {
      fluidNeeds *= 1.1; // Increase by 10%
    } else if (this.inputs.climate === 'extremely_hot') {
      fluidNeeds *= 1.2; // Increase by 20%
    }

    const outputs: CalculatorOutputs = {
      values: {
        dailyFluidNeeds: parseFloat(fluidNeeds.toFixed(2)),
        hourlyTarget: parseFloat((fluidNeeds / 16).toFixed(2)) // Assuming 16 waking hours
      },
      recommendations: [
        'Drink water consistently throughout the day',
        'Monitor urine color (pale yellow indicates good hydration)',
        'Increase intake during physical activity'
      ],
      targets: {
        minimumDaily: parseFloat((fluidNeeds * 0.8).toFixed(2)),
        optimumDaily: parseFloat(fluidNeeds.toFixed(2)),
        maximumDaily: parseFloat((fluidNeeds * 1.2).toFixed(2))
      }
    };

    return this.adjustForConditions(outputs);
  }

  protected adjustForConditions(outputs: CalculatorOutputs): CalculatorOutputs {
    const conditions = this.inputs.healthConditions || [];
    const medications = this.inputs.medications || [];
    
    conditions.forEach(condition => {
      switch(condition.toLowerCase()) {
        case 'heart_failure':
          outputs.values.dailyFluidNeeds = Math.min(outputs.values.dailyFluidNeeds, 1.5);
          outputs.recommendations.unshift('Fluid intake restricted - follow medical guidance');
          outputs.warnings = outputs.warnings || [];
          outputs.warnings.push('Heart condition detected - fluid restriction may apply');
          break;

        case 'kidney_disease':
          outputs.recommendations.unshift('Follow specific fluid guidelines from healthcare provider');
          outputs.warnings = outputs.warnings || [];
          outputs.warnings.push('Kidney condition detected - specific fluid restrictions may apply');
          break;

        case 'hypertension':
          outputs.recommendations.push('Consider sodium content in beverages');
          break;
      }
    });

    medications.forEach(medication => {
      switch(medication.toLowerCase()) {
        case 'diuretics':
          const adjustedNeeds = outputs.values.dailyFluidNeeds * 1.2;
          outputs.values.dailyFluidNeeds = adjustedNeeds;
          outputs.targets.optimumDaily = adjustedNeeds;
          outputs.recommendations.push(
            'Increased fluid needs due to diuretic medication',
            'Monitor for signs of dehydration'
          );
          break;

        case 'lithium':
          outputs.recommendations.push(
            'Maintain consistent daily fluid intake',
            'Avoid sudden changes in fluid consumption'
          );
          break;
      }
    });

    return outputs;
  }
}
