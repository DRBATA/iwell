import { BaseCalculator, CalculatorOutputs } from './index';

interface DailyData {
  calories: number;
  activityMinutes: number;
  fluidIntake: number;
  steps?: number;
  mood?: number;
  sleep?: number;
}

export class WeeklyProgressCalculator extends BaseCalculator {
  private dailyData: DailyData[];

  constructor(inputs: any, dailyData: DailyData[]) {
    super(inputs);
    this.dailyData = dailyData;
  }

  calculate(): CalculatorOutputs {
    if (!this.validateInputs()) {
      throw new Error('Invalid inputs for progress calculation');
    }

    // Calculate averages
    const totals = this.dailyData.reduce((acc, day) => ({
      calories: acc.calories + day.calories,
      activity: acc.activity + day.activityMinutes,
      fluid: acc.fluid + day.fluidIntake,
      steps: acc.steps + (day.steps || 0),
      mood: acc.mood + (day.mood || 0),
      sleep: acc.sleep + (day.sleep || 0),
      daysWithMood: acc.daysWithMood + (day.mood ? 1 : 0),
      daysWithSleep: acc.daysWithSleep + (day.sleep ? 1 : 0)
    }), {
      calories: 0,
      activity: 0,
      fluid: 0,
      steps: 0,
      mood: 0,
      sleep: 0,
      daysWithMood: 0,
      daysWithSleep: 0
    });

    const numDays = this.dailyData.length;

    const averages = {
      calories: totals.calories / numDays,
      activity: totals.activity / numDays,
      fluid: totals.fluid / numDays,
      steps: totals.steps / numDays,
      mood: totals.daysWithMood ? totals.mood / totals.daysWithMood : undefined,
      sleep: totals.daysWithSleep ? totals.sleep / totals.daysWithSleep : undefined
    };

    // Calculate trends (compare to previous week if available)
    const trends = {
      caloriesTrend: 'stable',
      activityTrend: 'stable',
      fluidTrend: 'stable'
    };

    // Generate recommendations based on averages and trends
    const recommendations: string[] = [];

    if (averages.activity < 30) {
      recommendations.push('Try to increase daily activity to at least 30 minutes');
    } else {
      recommendations.push('Good job maintaining regular activity!');
    }

    if (averages.fluid < 2) {
      recommendations.push('Consider increasing daily fluid intake');
    }

    if (averages.sleep && averages.sleep < 7) {
      recommendations.push('Focus on improving sleep duration');
    }

    const outputs: CalculatorOutputs = {
      values: {
        averageCalories: Math.round(averages.calories),
        averageActivity: Math.round(averages.activity),
        averageFluid: parseFloat(averages.fluid.toFixed(2)),
        averageSteps: Math.round(averages.steps),
        averageMood: averages.mood ? parseFloat(averages.mood.toFixed(1)) : 0,
        averageSleep: averages.sleep ? parseFloat(averages.sleep.toFixed(1)) : 0
      },
      recommendations,
      targets: {
        nextWeekCalories: Math.round(averages.calories),
        nextWeekActivity: Math.max(30, Math.round(averages.activity)),
        nextWeekFluid: parseFloat(averages.fluid.toFixed(2)),
        trends
      }
    };

    return this.adjustForConditions(outputs);
  }

  protected adjustForConditions(outputs: CalculatorOutputs): CalculatorOutputs {
    const conditions = this.inputs.healthConditions || [];
    
    conditions.forEach(condition => {
      switch(condition.toLowerCase()) {
        case 'hypertension':
          if (outputs.values.averageActivity < 30) {
            outputs.recommendations.push(
              'Gradually increase activity to help manage blood pressure',
              'Focus on consistent, moderate exercise'
            );
          }
          break;

        case 'diabetes':
          outputs.recommendations.push(
            'Monitor blood glucose patterns around exercise',
            'Keep activity times consistent to help manage blood sugar'
          );
          break;

        case 'heart_disease':
          if (outputs.values.averageActivity > 45) {
            outputs.recommendations.push(
              'Consider splitting activity into smaller sessions',
              'Monitor intensity levels carefully'
            );
          }
          break;
      }
    });

    return outputs;
  }

  protected validateInputs(): boolean {
    return super.validateInputs() && Array.isArray(this.dailyData) && this.dailyData.length > 0;
  }
}
