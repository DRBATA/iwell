# JSON Data Structure

## Core Data Schema

```json
{
  "user": {
    "auth": {
      "lastLogin": "ISO-DATE",
      "loginAttempts": 0,
      "lockoutUntil": null
    },
    "preferences": {
      "theme": "light|dark",
      "notifications": boolean,
      "autoSave": boolean
    },
    "settings": {
      "language": "string",
      "timezone": "string",
      "units": "metric|imperial"
    },
    "appData": {
      "monitoring": {
        "heartRisk": {},
        "emotionalWellbeing": {},
        "fitness": {}
      },
      "diagnostic": {
        "analysis": {},
        "riskAssessment": {},
        "insights": {}
      },
      "triage": {
        "generalBot": {},
        "strepBot": {},
        "healthAdvisory": {}
      }
    }
  },
  "apps": {
    "monitoring": {
      "enabled": boolean,
      "lastAccess": "ISO-DATE",
      "settings": {}
    },
    "diagnostic": {
      "enabled": boolean,
      "lastAccess": "ISO-DATE",
      "settings": {}
    },
    "free": {
      "enabled": true,
      "lastAccess": "ISO-DATE",
      "settings": {}
    },
    "triage": {
      "enabled": boolean,
      "lastAccess": "ISO-DATE",
      "settings": {}
    },
    "library": {
      "enabled": boolean,
      "lastAccess": "ISO-DATE",
      "settings": {}
    },
    "otc": {
      "enabled": boolean,
      "lastAccess": "ISO-DATE",
      "settings": {}
    }
  },
  "system": {
    "version": "1.0.0",
    "lastUpdated": "ISO-DATE",
    "lastSync": "ISO-DATE"
  }
}
```

## Data Access Patterns

### Local Storage Integration
```typescript
// Save data
const saveUserData = (data: UserData) => {
  localStorage.setItem('easyGP_userData', JSON.stringify(data));
};

// Load data
const loadUserData = (): UserData | null => {
  const data = localStorage.getItem('easyGP_userData');
  return data ? JSON.parse(data) : null;
};
```

### File System Operations
```typescript
// Export data
const exportToFile = async (data: UserData) => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  // Implementation using File System Access API
};

// Import data
const importFromFile = async (file: File) => {
  const text = await file.text();
  return JSON.parse(text);
};
```

### Version Control
- Each data update increments patch version
- Major version changes require migration
- Version history maintained for rollback

## Data Validation

### Schema Validation
```typescript
interface UserData {
  auth: {
    lastLogin: string;
    loginAttempts: number;
    lockoutUntil: string | null;
  };
  preferences: {
    theme: 'light' | 'dark';
    notifications: boolean;
    autoSave: boolean;
  };
  // ... rest of the schema
}
```

### Data Integrity
- Checksums for file operations
- Validation before save/load
- Error handling for corrupt data

## Security Considerations

### Local Storage Security
- Sensitive data encryption
- Session-based access control
- Clear data on logout option

### File System Security
- File access permissions
- Data sanitization on import
- Secure export handling

### Access Control
- Feature-based permissions
- App-specific access rules
- Premium feature validation

## Cross-App Communication

### Data Sharing
- Shared localStorage namespace
- File system coordination
- Version compatibility checks

### Conflict Resolution
1. Last-write-wins strategy
2. Merge conflict detection
3. User prompt for conflicts
4. Automatic conflict resolution rules

## Implementation Guidelines

### Adding New Data Types
1. Update TypeScript interfaces
2. Add validation rules
3. Update migration scripts
4. Document changes

### Data Migration
1. Version check on load
2. Apply necessary transforms
3. Update version number
4. Save migrated data

### Error Handling
1. Validation errors
2. Storage quota errors
3. File system errors
4. Version mismatch errors

## Best Practices

1. **Data Updates**
   - Atomic operations
   - Validation before save
   - Error recovery paths
   - Version management

2. **Storage Management**
   - Regular cleanup
   - Size monitoring
   - Quota management
   - Cache strategies

3. **Security**
   - Data encryption
   - Access control
   - Secure transmission
   - Privacy compliance

4. **Performance**
   - Batch operations
   - Lazy loading
   - Caching strategy
   - Compression when needed
