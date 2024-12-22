import { HSJProvider, useHSJ } from './context';
import { hsjManager } from './manager';
import { storage } from './storage';
import { memoryCache } from './cache';
import { validator } from './validation';
import type { 
  HSJManifest,
  HSJHealthData,
  HSJExportPackage,
  HSJContextValue,
  DataUpdate,
  ValidationResult,
  CacheConfig,
  CacheEntry,
  WorkerMessage,
  WorkerResponse
} from './types';

// Export version
export const VERSION = '1.0.0';

// Export core functionality
export { HSJProvider, useHSJ };
export { hsjManager };
export { storage };
export { memoryCache };
export { validator };

// Export types
export type {
  HSJManifest,
  HSJHealthData,
  HSJExportPackage,
  HSJContextValue,
  DataUpdate,
  ValidationResult,
  CacheConfig,
  CacheEntry,
  WorkerMessage,
  WorkerResponse
};
