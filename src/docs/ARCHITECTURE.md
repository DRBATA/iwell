# EasyGP Architecture Documentation

## Core Principles
- Component-based structure
- Local-first data approach
- PWA-ready design
- Seamless user experience flow

## Application Flow Architecture

### 1. Landing Page Flow (EasyGPLanding.tsx)
- Acts as main controller component
- Manages authentication state
- Renders marketing content when not authenticated
- Switches to AppSuite when authenticated

### 2. Authentication Flow (LoginModal.tsx)
- Handles user access verification
- Demo access code: 'DEMO2024'
- Manages login attempts and lockout
- Extension points:
  - JSON data upload/download integration
  - Additional authentication methods
  - User preferences storage

### 3. Transition Animation (SparklingParticleLogoAnimation.tsx)
- Canvas-based particle system
- EasyGP branded colors (#00CED1, #40E0D0, #FFD700)
- Sequence:
  1. Particle burst animation
  2. Logo appearance and rotation
  3. Transition to app suite
- Customization points:
  - Particle effects and colors
  - Animation timing
  - Transition effects

### 4. App Suite (AppSuite.tsx)
- Main application interface
- Grid-based app card layout
- Categories:
  - Monitoring Apps
  - Diagnostic Apps
  - Free Apps
  - Triage Bots
  - Health Library
  - OTC Medication Apps
- Extension points:
  - New app category integration
  - Card content customization
  - Feature access control

## Project Foundation
- Next.js application with React components
- TypeScript implementation
- PWA-ready architecture planned

## Directory Structure

src/
├── components/
│ ├── landing/ # Landing page components
│ │ └── sections/ # Landing page sections
│ ├── auth/ # Authentication components
│ ├── shared/ # Shared components
│ └── ui/ # UI components
├── hooks/ # Custom React hooks
├── utils/ # Utility functions
├── types/ # TypeScript definitions
└── docs/ # Project documentation

## Common Modifications Guide

### Adding New App Cards
1. Locate the grid section in AppSuite.tsx
2. Follow existing card structure:
```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.X }}
>
  <Card className="bg-white/90 backdrop-blur-sm hover:shadow-lg transition-shadow">
    <CardContent className="p-6">
      <h3 className="text-xl font-semibold text-[#00CED1] mb-4">App Name</h3>
      <ul className="space-y-2 mb-4">
        <li>• Feature 1</li>
        <li>• Feature 2</li>
        <li>• Feature 3</li>
      </ul>
      <Button 
        onClick={onShowPayment}
        className="w-full bg-[#00CED1] hover:bg-[#00CED1]/90 text-white"
      >
        Get Access
      </Button>
    </CardContent>
  </Card>
</motion.div>
```

### Integrating JSON Data Features
1. Add JSON handlers to LoginModal.tsx:
```tsx
const handleJsonUpload = (file: File) => {
  // Implementation
}

const handleJsonDownload = () => {
  // Implementation
}
```
2. Add UI elements to modal content
3. Connect to local storage system

### Modifying Login Flow
1. Update authentication logic in LoginModal.tsx
2. Modify localStorage handling in EasyGPLanding.tsx
3. Update isAuthenticated state management

## Data Architecture
### Local-First Approach
- User data stored in local JSON files
- No central database required
- Privacy-focused design

### Cross-App Communication
- Multiple PWAs will share access to user's JSON
- File System Access API for reading/writing local data
- Offline-capable functionality

## Development Environment
Different terminals for different purposes:
- **PowerShell**: Windows commands
- **Git Bash**: Version control
- **Node Terminal**: npm commands
- **Command Prompt**: Basic Windows operations

## Key Technical Decisions
1. **Framework**: Next.js (React-based) with TypeScript
2. **Data Storage**: Local JSON files
3. **PWA Support**: Using next-pwa when ready
4. **File Access**: File System Access API for JSON handling
5. **Animation**: Canvas-based particle system with Framer Motion

## Styling Guidelines
- Primary color: #00CED1 (Turquoise)
- Secondary color: #FFD700 (Gold)
- Background: bg-white/90 with backdrop-blur-sm
- Card styling: hover:shadow-lg transition-shadow
- Button variants:
  - Primary: bg-[#00CED1] hover:bg-[#00CED1]/90 text-white
  - Secondary: bg-[#FFD700] hover:bg-[#FFD700]/90 text-[#00CED1]

## Future Considerations
- File versioning system
- Conflict resolution between apps
- Offline sync mechanisms
- Security implementations
- Enhanced animation transitions
- Additional authentication methods
- Extended JSON data management
