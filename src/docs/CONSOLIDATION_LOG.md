[Previous content remains unchanged...]

## Data Flow Analysis (2024-01)

### Current Implementation Structure

1. Data Types & Interfaces (useHSJData.ts):
- Comprehensive type system
- Covers all health data aspects:
  * Blood pressure readings
  * Cognitive journal entries
  * Symptom records
  * Medications
  * Notifications
- Well-structured but scattered usage

2. File Generation (useFileGeneration.ts):
- Separate from main data flow
- Creates initial state
- Minimal structure differs from HSJData interface
- Potential consistency issues

3. PIN & File Management (initData.ts):
- PIN generation from postcode/DOB
- One-way filename transformation
- Age calculation (privacy-focused)
- Clean initialization structure

### Current Data Flow Issues

1. Storage Inconsistencies:
- localStorage used in multiple places:
  * HealthJournalContext
  * useHSJData hook
  * Direct component access
- No consistent save/load pattern

2. Multiple Initialization Paths:
- useFileGeneration.ts creates one structure
- initData.ts creates different structure
- HealthJournalContext has third pattern

3. PIN/File Handling:
- PIN generation in multiple places
- Inconsistent file naming
- Mixed authentication approaches

### Working Features to Preserve

1. Data Structure:
- Comprehensive HSJData interface
- Privacy-focused age storage
- Clean type system

2. File Operations:
- Export functionality
- File-based backup
- PIN verification concept

3. Component Updates:
- Clean update patterns in hooks
- Type-safe data modifications
- Proper error handling

### Proposed Consolidation

1. Core Data Management:
```typescript
// Single source of truth for HSJ structure
interface HSJData {
  fileId: string;  // Generated from PIN
  created: string;
  lastAccessed: string;
  profile: {
    ageAtCreation: number;  // No DOB stored
    // ... other profile data
  };
  healthData: {
    bloodPressure: {...};
    cognitive: {...};
    diagnostics: {...};
  };
}
```

2. File Operations:
```typescript
interface FileOperations {
  saveHSJ: (data: HSJData) => Promise<void>;
  loadHSJ: (pin: string) => Promise<HSJData>;
  exportHSJ: (data: HSJData) => void;
  verifyHSJ: (pin: string, fileId: string) => boolean;
}
```

3. Component Integration:
```typescript
// Example usage in components
function BloodPressure() {
  const { data, updateSection } = useHSJ();
  
  const addReading = (reading: BPReading) => {
    updateSection('bloodPressure.readings', [...readings, reading]);
  };
}
```

### Migration Steps

1. Phase 1 - Core Structure:
- Consolidate HSJData interface
- Create single file operations module
- Remove localStorage usage

2. Phase 2 - Component Updates:
- Update all components to new pattern
- Remove direct JSON manipulation
- Implement proper error handling

3. Phase 3 - Security:
- Implement proper PIN handling
- Add file verification
- Clean up authentication flow

[Progress tables remain unchanged...]
