[Previous content remains...]

## Fix: Return HealthData from Creation

Found why BP updates fail:

1. Data Flow Before:
```typescript
createNewHSJ() -> { manifest, pin }
  -> context only gets manifest
  -> App shows HealthJournal (manifest exists)
  -> try to add BP
  -> ❌ Error: No HSJ loaded (healthData missing)
```

2. Data Flow After:
```typescript
createNewHSJ() -> { manifest, pin, healthData }
  -> context gets both manifest AND healthData
  -> App shows HealthJournal
  -> try to add BP
  -> ✅ Works (healthData has structure)
```

### Changes Made

1. Archived Files:
- src/lib/manifest/manager.ts.archive
- src/lib/manifest/context.tsx.archive

2. Updated manager.ts:
```typescript
// Before
async createNewHSJ(): Promise<{ manifest, pin }> {
  return { manifest, pin };  // Missing healthData
}

// After
async createNewHSJ(): Promise<{ manifest, pin, healthData }> {
  return { manifest, pin, healthData };  // Complete data
}
```

3. Updated context.tsx:
```typescript
// Before
const createHSJ = async () => {
  const result = await hsjManager.createNewHSJ(data);
  return result;  // Just manifest/pin
};

// After
const createHSJ = async () => {
  const result = await hsjManager.createNewHSJ(data);
  setHealthData(result.healthData);  // Set healthData immediately
  return result;
};
```

### Why This Works

1. Manager creates full structure:
```typescript
const healthData = {
  bloodPressure: { readings: [] },
  cognitive: { thoughts: [] },
  // ... full structure
};
```

2. Context gets it immediately:
```typescript
setHealthData(result.healthData);
```

3. Components have data:
```typescript
const { healthData } = useHSJ();
// healthData exists with structure
```

This ensures components always have the data structure they expect.
