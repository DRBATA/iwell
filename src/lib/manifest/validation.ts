import { HSJManifest, HSJHealthData, ValidationResult, DataUpdate } from './types';

class HSJValidator {
  private static instance: HSJValidator;

  private constructor() {}

  static getInstance(): HSJValidator {
    if (!HSJValidator.instance) {
      HSJValidator.instance = new HSJValidator();
    }
    return HSJValidator.instance;
  }

  validateManifest(manifest: Partial<HSJManifest>): ValidationResult {
    const errors: Array<{ path: string; message: string }> = [];

    // Required fields
    if (!manifest.hsj_id) {
      errors.push({ path: 'hsj_id', message: 'HSJ ID is required' });
    }
    if (!manifest.version) {
      errors.push({ path: 'version', message: 'Version is required' });
    }

    // Validate configurations if present
    if (manifest.configurations) {
      const config = manifest.configurations;

      // Blood pressure configuration
      if (config.bloodPressure) {
        const bp = config.bloodPressure;
        if (bp.limits) {
          if (bp.limits.systolic) {
            if (bp.limits.systolic.min >= bp.limits.systolic.max) {
              errors.push({
                path: 'configurations.bloodPressure.limits.systolic',
                message: 'Min must be less than max'
              });
            }
          }
          if (bp.limits.diastolic) {
            if (bp.limits.diastolic.min >= bp.limits.diastolic.max) {
              errors.push({
                path: 'configurations.bloodPressure.limits.diastolic',
                message: 'Min must be less than max'
              });
            }
          }
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors: errors.length > 0 ? errors : undefined
    };
  }

  validateHealthData(data: Partial<HSJHealthData>): ValidationResult {
    const errors: Array<{ path: string; message: string }> = [];

    // Required fields
    if (!data.hsj_id) {
      errors.push({ path: 'hsj_id', message: 'HSJ ID is required' });
    }

    // Validate blood pressure readings if present
    if (data.bloodPressure?.readings) {
      data.bloodPressure.readings.forEach((reading, index) => {
        if (!reading.timestamp) {
          errors.push({
            path: `bloodPressure.readings[${index}].timestamp`,
            message: 'Timestamp is required'
          });
        }
        if (reading.systolic < 0 || reading.systolic > 300) {
          errors.push({
            path: `bloodPressure.readings[${index}].systolic`,
            message: 'Invalid systolic value'
          });
        }
        if (reading.diastolic < 0 || reading.diastolic > 200) {
          errors.push({
            path: `bloodPressure.readings[${index}].diastolic`,
            message: 'Invalid diastolic value'
          });
        }
      });
    }

    // Validate cognitive thoughts if present
    if (data.cognitive?.thoughts) {
      data.cognitive.thoughts.forEach((thought, index) => {
        if (!thought.timestamp) {
          errors.push({
            path: `cognitive.thoughts[${index}].timestamp`,
            message: 'Timestamp is required'
          });
        }
        if (!thought.automaticThought) {
          errors.push({
            path: `cognitive.thoughts[${index}].automaticThought`,
            message: 'Automatic thought is required'
          });
        }
        if (!thought.emotion) {
          errors.push({
            path: `cognitive.thoughts[${index}].emotion`,
            message: 'Emotion is required'
          });
        }
      });
    }

    return {
      valid: errors.length === 0,
      errors: errors.length > 0 ? errors : undefined
    };
  }

  validateUpdate(update: DataUpdate): ValidationResult {
    const errors: Array<{ path: string; message: string }> = [];

    // Validate path format
    if (!update.path.match(/^[a-zA-Z]+(\.[a-zA-Z]+)*$/)) {
      errors.push({
        path: 'path',
        message: 'Invalid path format'
      });
    }

    // Validate operation
    if (!['add', 'update', 'remove'].includes(update.operation)) {
      errors.push({
        path: 'operation',
        message: 'Invalid operation'
      });
    }

    // Validate timestamp
    if (!update.timestamp || isNaN(Date.parse(update.timestamp))) {
      errors.push({
        path: 'timestamp',
        message: 'Invalid timestamp'
      });
    }

    // Validate value based on operation
    if (update.operation !== 'remove' && update.value === undefined) {
      errors.push({
        path: 'value',
        message: 'Value is required for add/update operations'
      });
    }

    return {
      valid: errors.length === 0,
      errors: errors.length > 0 ? errors : undefined
    };
  }

  validateExportData(manifest: HSJManifest, healthData: HSJHealthData): ValidationResult {
    const manifestValidation = this.validateManifest(manifest);
    const healthDataValidation = this.validateHealthData(healthData);

    const errors = [
      ...(manifestValidation.errors || []),
      ...(healthDataValidation.errors || [])
    ];

    // Additional cross-validation
    if (manifest.hsj_id !== healthData.hsj_id) {
      errors.push({
        path: 'hsj_id',
        message: 'Manifest and health data HSJ IDs do not match'
      });
    }

    return {
      valid: errors.length === 0,
      errors: errors.length > 0 ? errors : undefined
    };
  }
}

export const validator = HSJValidator.getInstance();
