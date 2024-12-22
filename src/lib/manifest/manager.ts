import { validator } from './validation';
import {
  HSJManifest,
  HSJHealthData,
  HSJExportPackage,
  DataUpdate,
  ValidationResult
} from './types';

class HSJManager {
  private static instance: HSJManager;
  private currentHSJId: string | null = null;

  private constructor() {}

  static getInstance(): HSJManager {
    if (!HSJManager.instance) {
      HSJManager.instance = new HSJManager();
    }
    return HSJManager.instance;
  }

  // Generate a 6-digit PIN from postcode and DOB
  private generatePin(postcode: string, dob: string): string {
    const postcodeDigits = postcode.replace(/\D/g, '');
    const dobDigits = dob.replace(/\D/g, '');
    const allDigits = postcodeDigits + dobDigits;
    let pin = '';
    for (let i = 0; i < 6; i++) {
      const randomIndex = Math.floor(Math.random() * allDigits.length);
      pin += allDigits[randomIndex];
    }
    return pin;
  }

  // Transform PIN into filename through one-way transformation
  private generateFilename(pin: string): string {
    // Simple one-way transformation using factors
    const factors = pin.split('').map(Number).map(n => 
      Array.from({ length: n }, (_, i) => i + 1).filter(i => n % i === 0)
    );
    const factorHash = factors.flat().join('');
    return `hsj_${factorHash}`;
  }

  // Verify if a PIN matches a filename
  async verifyPin(pin: string, filename: string): Promise<boolean> {
    const expectedFilename = this.generateFilename(pin);
    return expectedFilename === filename;
  }

  async createNewHSJ(initialData: {
    postcode: string;
    dob: string;
  }): Promise<{ manifest: HSJManifest; pin: string; healthData: HSJHealthData }> {
    const pin = this.generatePin(initialData.postcode, initialData.dob);
    const filename = this.generateFilename(pin);
    
    const manifest: HSJManifest = {
      version: '1.0',
      hsj_id: filename,
      created: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      configurations: {
        bloodPressure: {
          enabled: false,
          monitoring: false,
          frequency: 'daily',
          limits: {
            systolic: { min: 70, max: 190 },
            diastolic: { min: 40, max: 120 }
          }
        },
        cognitive: {
          enabled: true,
          prompts: true
        },
        diagnostic: {
          enabled: true,
          autoAnalysis: true
        }
      },
      features: {
        offline: true,
        encryption: true,
        sharing: false
      }
    };

    const healthData: HSJHealthData = {
      hsj_id: filename,
      conditions: [],
      medications: [],
      bloodPressure: {
        readings: []
      },
      cognitive: {
        thoughts: [],
        analysis: {
          patterns: [],
          insights: [],
          lastAnalyzed: new Date().toISOString()
        }
      },
      diagnostic: {
        symptoms: [],
        consultations: [],
        analysis: {
          conditions: [],
          recommendations: [],
          lastAnalyzed: new Date().toISOString()
        }
      }
    };

    // Validate initial data
    const validationResult = validator.validateExportData(manifest, healthData);
    if (!validationResult.valid) {
      throw new Error(`Invalid initial data: ${JSON.stringify(validationResult.errors)}`);
    }

    this.currentHSJId = filename;
    return { manifest, pin, healthData };
  }

  // Just validate updates, actual data changes happen in React state
  async validateUpdate(update: DataUpdate): Promise<ValidationResult> {
    return validator.validateUpdate(update);
  }

  // Helper to apply updates (used by context)
  applyUpdate(data: any, update: DataUpdate): any {
    const paths = update.path.split('.');
    const result = { ...data };
    let current = result;

    // Navigate to the correct path
    for (let i = 0; i < paths.length - 1; i++) {
      if (!(paths[i] in current)) {
        current[paths[i]] = {};
      }
      current = current[paths[i]];
    }

    // Apply the update
    const lastPath = paths[paths.length - 1];
    switch (update.operation) {
      case 'add':
      case 'update':
        current[lastPath] = update.value;
        break;
      case 'remove':
        delete current[lastPath];
        break;
    }

    return result;
  }

  getCurrentHSJId(): string | null {
    return this.currentHSJId;
  }

  setCurrentHSJId(id: string | null): void {
    this.currentHSJId = id;
  }
}

export const hsjManager = HSJManager.getInstance();
