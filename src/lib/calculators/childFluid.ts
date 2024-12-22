import { BaseCalculator, CalculatorOutputs } from './index';

export class ChildFluidCalculator extends BaseCalculator {
  calculate(): CalculatorOutputs {
    if (!this.validateInputs()) {
      throw new Error('Invalid inputs for child fluid calculation');
    }

    const weight = this.inputs.weight;
    let maintenanceVolume: number;
    let rehydrationVolume: number = 0;

    // Calculate maintenance fluid volume based on weight
    if (weight <= 10) {
      maintenanceVolume = weight * 100; // 100 mL/kg/day
    } else if (weight <= 20) {
      maintenanceVolume = 1000 + ((weight - 10) * 50); // 1000 mL + 50 mL/kg for each kg over 10
    } else {
      maintenanceVolume = 1500 + ((weight - 20) * 20); // 1500 mL + 20 mL/kg for each kg over 20
    }

    // Calculate rehydration volume if needed (based on age)
    const age = this.inputs.age;
    if (age <= 5) {
      rehydrationVolume = weight * 50; // 50 mL/kg for deficit replacement
    }

    // Calculate ORS volumes after loose stools
    const orsPerStool = age <= 5 ? `${Math.round(weight * 5)} mL` :
                       age <= 11 ? '200 mL' :
                       '200-400 mL';

    const outputs: CalculatorOutputs = {
      values: {
        maintenanceVolume: Math.round(maintenanceVolume),
        rehydrationVolume: Math.round(rehydrationVolume),
        hourlyMaintenance: Math.round(maintenanceVolume / 24)
      },
      recommendations: [
        `Daily maintenance fluid needs: ${Math.round(maintenanceVolume)} mL/day`,
        `Target hourly intake: ${Math.round(maintenanceVolume / 24)} mL/hour`,
        `After each loose stool: ${orsPerStool} ORS solution`
      ],
      targets: {
        dailyVolume: Math.round(maintenanceVolume),
        hourlyVolume: Math.round(maintenanceVolume / 24),
        orsPerStool: orsPerStool
      }
    };

    // Add rehydration recommendations if applicable
    if (age <= 5) {
      outputs.recommendations.push(
        `If dehydrated: ${Math.round(rehydrationVolume)} mL ORS over 4 hours`,
        'Continue breastfeeding if applicable',
        'Avoid other fluids during rehydration'
      );
      outputs.targets.rehydrationVolume = Math.round(rehydrationVolume);
    }

    return this.adjustForConditions(outputs);
  }

  protected adjustForConditions(outputs: CalculatorOutputs): CalculatorOutputs {
    const conditions = this.inputs.healthConditions || [];
    
    conditions.forEach(condition => {
      switch(condition.toLowerCase()) {
        case 'diarrhea':
          outputs.recommendations.push(
            'Monitor for signs of dehydration',
            'Replace fluid losses with ORS after each loose stool',
            'Seek medical advice if unable to maintain hydration'
          );
          break;

        case 'fever':
          // Increase maintenance by 12% per degree C over 38
          const feverAdjustment = 1.12;
          outputs.values.maintenanceVolume = Math.round(outputs.values.maintenanceVolume * feverAdjustment);
          outputs.values.hourlyMaintenance = Math.round(outputs.values.hourlyMaintenance * feverAdjustment);
          outputs.recommendations.push(
            'Increased fluid needs due to fever',
            'Monitor temperature and hydration status'
          );
          break;

        case 'vomiting':
          outputs.recommendations.push(
            'Start with small sips frequently',
            'Use ice chips if needed',
            'Gradually increase volume as tolerated'
          );
          break;
      }
    });

    return outputs;
  }
}
