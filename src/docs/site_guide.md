# Site Guide

## Application Flow
1. Marketing Landing Page
2. Authentication Modal
3. Transition Animation
4. App Suite Dashboard

## Component Structure
```typescript
EasyGPLanding
├── Landing Content (when not authenticated)
│ ├── Hero
│ ├── Features
│ ├── About
│ ├── Testimonials
│ ├── CTA
│ └── Footer
├── LoginModal
│ ├── Animated Logo
│ ├── Access Code Input
│ └── Error Handling
└── AppSuite (when authenticated)
    ├── SparklingParticleLogoAnimation
    └── App Grid
        ├── Monitoring Apps
        ├── Diagnostic Apps
        ├── Free Apps
        ├── Triage Bots
        ├── Health Library
        └── OTC Medication Apps
```

## State Management
- Authentication state in EasyGPLanding
- Local storage for persistence
- Modal states for login/payment
- Animation states for transitions

## User Flow
1. **Initial Landing**
   - Marketing content visible
   - Login button in navigation
   - CTA sections throughout

2. **Authentication**
   - Click login button
   - Enter access code (DEMO2024)
   - Handle success/failure states

3. **Post-Login Animation**
   - Particle effect animation
   - Logo rotation
   - Transition to app suite

4. **App Suite Dashboard**
   - Grid layout of available apps
   - Category-based organization
   - Access control for premium features

## Component Guidelines

### Landing Page Sections
- Hero: Main value proposition
- Features: Key capabilities
- About: Company information
- Testimonials: User feedback
- CTA: Call to action buttons
- Footer: Additional links and info

### Login Modal
- Centered design
- Animated logo
- Secure input field
- Clear error messages
- Lock-out protection

### App Suite Cards
- Consistent sizing
- Clear categorization
- Action buttons
- Feature lists
- Premium indicators

## Styling Reference
- Brand Colors:
  - Primary: #00CED1 (Turquoise)
  - Secondary: #FFD700 (Gold)
- Typography:
  - Headings: font-bold
  - Body: Regular weight
- Components:
  - Cards: White with blur backdrop
  - Buttons: Solid color with hover states
  - Modals: Centered with overlay

## Extension Points

### Adding New Landing Sections
1. Create component in landing/sections
2. Add to EasyGPLanding component
3. Include in navigation if needed

### Modifying Login Process
1. Update LoginModal component
2. Adjust authentication logic
3. Update transition states

### Adding App Categories
1. Create new card component
2. Add to AppSuite grid
3. Configure access control

## Navigation Structure
- Marketing Site (/)
  - About (#about)
  - Features (#features)
  - Testimonials (#testimonials)
  - Contact (#footer)
- App Suite (post-login)
  - Dashboard view
  - Category navigation
  - Settings access

## Best Practices
1. Maintain consistent styling
2. Follow component hierarchy
3. Use proper state management
4. Implement smooth transitions
5. Handle error states gracefully
6. Ensure responsive design
7. Follow accessibility guidelines
