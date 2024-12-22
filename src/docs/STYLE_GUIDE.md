# Style Guide

## Brand Colors

### Primary Colors
- Turquoise: `#00CED1`
- Gold: `#FFD700`
- Light Turquoise: `#40E0D0`

### Background Colors
- Main Background: `#F0F8FF`
- Card Background: `bg-white/90`
- Modal Overlay: `bg-black/50`

### State Colors
- Success: `#4CAF50`
- Error: `#FF5252`
- Warning: `#FFC107`
- Info: `#2196F3`

## Typography

### Font Families
```css
/* System font stack */
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, 
             "Helvetica Neue", Arial, sans-serif;
```

### Font Sizes
- Headings:
  - h1: `text-4xl` (2.25rem)
  - h2: `text-3xl` (1.875rem)
  - h3: `text-2xl` (1.5rem)
  - h4: `text-xl` (1.25rem)
- Body: `text-base` (1rem)
- Small: `text-sm` (0.875rem)

### Font Weights
- Regular: `font-normal`
- Medium: `font-medium`
- Bold: `font-bold`
- Extra Bold: `font-extrabold`

## Components

### Buttons
```tsx
// Primary Button
<Button 
  className="bg-[#00CED1] hover:bg-[#00CED1]/90 text-white"
>
  Primary Action
</Button>

// Secondary Button
<Button 
  className="bg-[#FFD700] hover:bg-[#FFD700]/90 text-[#00CED1]"
>
  Secondary Action
</Button>
```

### Cards
```tsx
<Card className="bg-white/90 backdrop-blur-sm hover:shadow-lg transition-shadow">
  <CardContent className="p-6">
    {/* Card content */}
  </CardContent>
</Card>
```

### Modals
```tsx
<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.95 }}
    className="w-full max-w-md p-4"
  >
    {/* Modal content */}
  </motion.div>
</div>
```

### Inputs
```tsx
<Input
  className="border-[#00CED1] focus:border-[#FFD700] focus:ring-[#FFD700]"
  placeholder="Enter text"
/>
```

## Animations

### Framer Motion Variants

#### Fade In
```tsx
const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 }
};
```

#### Scale Up
```tsx
const scaleUp = {
  initial: { scale: 0.95, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  exit: { scale: 0.95, opacity: 0 }
};
```

### Particle Animation
```typescript
// Colors
const particleColors = ['#00CED1', '#40E0D0', '#FFD700'];

// Size
const particleRadius = Math.random() * 2 + 1;

// Movement
const velocity = {
  vx: (Math.random() - 0.5) * 3,
  vy: (Math.random() - 0.5) * 3
};
```

## Layout

### Spacing
- Extra Small: `p-2` (0.5rem)
- Small: `p-4` (1rem)
- Medium: `p-6` (1.5rem)
- Large: `p-8` (2rem)
- Extra Large: `p-12` (3rem)

### Grid System
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
  {/* Grid items */}
</div>
```

### Container
```tsx
<div className="container mx-auto px-6">
  {/* Container content */}
</div>
```

## Effects

### Backdrop Blur
```css
backdrop-blur-sm /* Light blur */
backdrop-blur /* Medium blur */
backdrop-blur-lg /* Heavy blur */
```

### Shadows
```css
shadow-sm /* Subtle shadow */
shadow /* Regular shadow */
shadow-lg /* Large shadow */
hover:shadow-lg /* Hover effect */
```

### Transitions
```css
transition-all
transition-opacity
transition-transform
duration-300
ease-in-out
```

## Responsive Design

### Breakpoints
- Mobile: `< 768px`
- Tablet: `md:` (768px)
- Desktop: `lg:` (1024px)
- Wide: `xl:` (1280px)

### Mobile-First Approach
```tsx
<div className="
  text-base 
  md:text-lg 
  lg:text-xl
  p-4
  md:p-6
  lg:p-8
">
  Responsive content
</div>
```

## Best Practices

### CSS Organization
1. Use Tailwind utility classes
2. Group related utilities
3. Extract common patterns
4. Use consistent ordering

### Component Styling
1. Maintain consistent spacing
2. Use design tokens
3. Follow accessibility guidelines
4. Implement responsive design

### Animation Guidelines
1. Keep animations subtle
2. Use consistent timing
3. Provide reduced-motion alternatives
4. Optimize performance

### Accessibility
1. Maintain color contrast
2. Provide focus states
3. Include hover states
4. Support keyboard navigation
