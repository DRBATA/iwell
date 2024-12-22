[Previous content remains...]

## Deep Dive: Three Approaches to Data Structure

When trying to add BP data, we got:
```
ERROR: No HSJ currently loaded
updateHealthData
```

This raises a critical question: How should we handle initial data structure across our three layers?

### Question 1: Add Structure in importData (Context Layer)
```typescript
// In context.tsx
const importData = async (data: HSJExportPackage) => {
  // Option 1: Initialize here
  const initialStructure = {
    manifest: data.manifest,
    healthData: {
      ...data.healthData,
      bloodPressure: data.healthData?.bloodPressure || []  // Default structure
    }
  };
  setManifest(initialStructure.manifest);
  setHealthData(initialStructure.healthData);
};
```
Why Consider:
- Context owns React state
- Direct access to setters
- Keeps initialization with usage

Files Affected:
- src/lib/manifest/context.tsx

### Question 2: Create Structure in Manager (Middle Layer)
```typescript
// In manager.ts
class HSJManager {
  createDataStructure(data: HSJExportPackage) {
    // Option 2: Initialize here
    return {
      manifest: data.manifest,
      healthData: this.initializeHealthData(data.healthData)
    };
  }

  initializeHealthData(data?: any) {
    return {
      bloodPressure: [],
      ...data
    };
  }
}
```
Why Consider:
- Manager coordinates data flow
- Already handles data operations
- Could standardize structure

Files Affected:
- src/lib/manifest/manager.ts
- src/lib/manifest/context.tsx (calls manager)

### Question 3: Initialize in Context (Provider Layer)
```typescript
// In context.tsx
export const HSJProvider = ({ children }) => {
  // Option 3: Initialize at provider level
  const [manifest, setManifest] = useState<HSJManifest | null>(null);
  const [healthData, setHealthData] = useState(() => ({
    bloodPressure: [],
    profile: null,
    // ... other initial structures
  }));
};
```
Why Consider:
- Provider is the root
- Could guarantee structure
- React-native approach

Files Affected:
- src/lib/manifest/context.tsx
- All components get initialized data

### Why This Matters
The error shows we're in a state where:
1. We can load the app (context exists)
2. We can see the UI (components render)
3. But data operations fail (structure missing)

This suggests our data initialization isn't matching our component expectations. Each approach offers different guarantees:

1. importData: Initialize on load
2. Manager: Coordinate structure
3. Provider: Always have structure

The choice affects:
- When data is available
- Where defaults live
- How components can rely on structure

Current State:
- Components expect structure
- But data might be null/undefined
- Need to decide where guarantee comes from
