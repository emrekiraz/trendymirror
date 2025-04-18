# TrendyMirror Brand & Web Design Theme Guide

## Brand Identity

### Logo & Icon
- **Primary Logo**: `trendymirror-logo.svg` - To be used across all primary brand touchpoints
- **Icon**: `trendymirror-icon.svg` - Square format with the stylized T/M monogram for favicons and app icons
- **Logo Spacing**: Maintain clear space around logo equal to the height of the "T" in all applications
- **Minimum Size**: Do not display the primary logo smaller than 100px wide to maintain legibility

### Typography

#### Headings
- **Primary Font**: Montserrat
- **Weights**: 600 (Semi-Bold) for primary headings, 500 (Medium) for secondary headings
- **Sizes**:
  - H1: 42px/48px (desktop), 32px/38px (mobile)
  - H2: 32px/40px (desktop), 26px/32px (mobile)
  - H3: 24px/32px (desktop), 20px/28px (mobile)
  - H4: 20px/28px (desktop), 18px/24px (mobile)
  - H5: 18px/24px (desktop), 16px/22px (mobile)
- **Letter Spacing**: -0.2px for all headings

#### Body Text
- **Primary Font**: Inter
- **Weights**: 400 (Regular) for body text, 500 (Medium) for emphasis
- **Sizes**:
  - Body Large: 18px/28px (desktop), 16px/26px (mobile)
  - Body Regular: 16px/24px (desktop), 15px/22px (mobile)
  - Body Small: 14px/20px (desktop), 13px/18px (mobile)
- **Letter Spacing**: 0px (normal)

#### UI Elements
- **Button Text**: Inter, 500 (Medium), 15px/18px, uppercase with 1px letter spacing
- **Navigation**: Inter, 500 (Medium), 15px/18px
- **Labels & Tags**: Inter, 600 (Semi-Bold), 13px/16px, uppercase with 0.5px letter spacing

### Color Palette

#### Primary Colors
- **Navy Blue**: #1A2138 (Text, headers, primary UI elements)
- **Soft White**: #F8F9FA (Backgrounds, light areas)
- **Light Gray**: #E2E2E2 (Subtle UI elements, dividers)
- **Medium Gray**: #B8B8B8 (Secondary text, disabled states)

#### Accent Colors
- **Coral**: #FF6B6B (Primary actions, highlights, important buttons)
- **Aqua Blue**: #64D2FF (Secondary actions, selections, interactive elements)
- **Gold**: #FFCB69 (Premium features, VIP elements, special highlights)

#### Functional Colors
- **Success Green**: #4CAF50 (Confirmations, successful actions)
- **Warning Orange**: #FF9800 (Notifications, cautionary messages)
- **Error Red**: #F44336 (Error states, important alerts)

#### Color Usage Guidelines
- Use Navy Blue as the dominant color for main UI components
- Limit Coral usage to key interaction points and primary CTAs
- Apply Gold sparingly for premium/special features
- Maintain accessibility with sufficient contrast (WCAG AA minimum)
- Use gradients subtly; suggested gradient: Navy Blue (#1A2138) to a 20% darker shade

### Imagery & Iconography

#### Photography Style
- Clean, high-contrast images with natural lighting
- Modern, diverse representation of people
- Neutral to cool color temperature
- Focused on authentic moments rather than overly posed shots
- Minimum resolution: 1500px wide for hero images

#### Iconography
- **Style**: Line icons with 2px stroke weight
- **Corner Radius**: 2px for squared icons
- **Size**: 24x24px standard size (scale proportionally as needed)
- **Format**: SVG for scalability
- **Color**: Primary Navy Blue or Coral for emphasis, Medium Gray for secondary icons

## Web Design Elements

### Layout System
- **Grid**: 12-column responsive grid
- **Gutters**: 24px (desktop), 16px (mobile)
- **Maximum Content Width**: 1280px
- **Container Padding**: 80px (desktop), 24px (mobile)
- **Section Spacing**: 120px between major sections (desktop), 80px (mobile)
- **Component Spacing**: 40px between components (desktop), 32px (mobile)

### UI Components

#### Buttons
- **Primary Button**:
  - Background: Coral (#FF6B6B)
  - Text: White (#FFFFFF)
  - Padding: 14px 32px (desktop), 12px 24px (mobile)
  - Border Radius: 8px
  - Hover State: 10% darker with smooth 0.2s transition
  
- **Secondary Button**:
  - Background: Transparent
  - Border: 2px solid Coral (#FF6B6B)
  - Text: Coral (#FF6B6B)
  - Padding: 14px 32px (desktop), 12px 24px (mobile)
  - Border Radius: 8px
  - Hover State: 10% Coral background with smooth 0.2s transition
  
- **Tertiary Button**:
  - Background: Transparent
  - Text: Navy Blue (#1A2138)
  - Padding: 14px 32px (desktop), 12px 24px (mobile)
  - Underline on hover with smooth 0.2s transition

#### Input Fields
- **Height**: 48px (desktop), 44px (mobile)
- **Border**: 1px solid Light Gray (#E2E2E2)
- **Border Radius**: 8px
- **Padding**: 0 16px
- **Focus State**: 2px border in Aqua Blue (#64D2FF)
- **Error State**: 2px border in Error Red (#F44336)
- **Label Position**: Above input field, Inter 14px Medium
- **Helper Text**: Below input field, Inter 13px Regular, Medium Gray (#B8B8B8)

#### Cards
- **Border Radius**: 12px
- **Shadow**: 0 4px 20px rgba(0, 0, 0, 0.08)
- **Padding**: 24px (desktop), 20px (mobile)
- **Border**: None or optional 1px solid Light Gray (#E2E2E2)
- **Hover State**: Subtle shadow increase to 0 8px 30px rgba(0, 0, 0, 0.12)

#### Navigation
- **Main Navigation**:
  - Height: 80px (desktop), 60px (mobile)
  - Background: White (#FFFFFF)
  - Shadow: 0 2px 10px rgba(0, 0, 0, 0.05)
  - Active Item: Bottom border in Coral (#FF6B6B), 3px thick
  
- **Mobile Navigation**:
  - Hamburger icon in Navy Blue (#1A2138)
  - Slide-in menu from right with 85% width
  - Animation: Smooth 0.3s transition

### Animation & Transitions

#### Micro-interactions
- **Button Hover**: Scale to 1.03x with 0.2s ease transition
- **Card Hover**: Slight elevation increase with 0.3s ease transition
- **Input Focus**: Smooth border color change with 0.2s transition
- **Link Hover**: Subtle underline animation, left to right in 0.2s

#### Page Transitions
- **Page Load**: Fade in with 0.4s ease transition
- **Content Load**: Staggered fade in from bottom, 0.2s delay between elements
- **Modal Entrance**: Scale from 0.95 to 1 with fade, 0.3s timing
- **Modal Exit**: Fade out with slight scale down, 0.25s timing

### Responsive Behavior
- **Breakpoints**:
  - Mobile: 0-767px
  - Tablet: 768px-1023px
  - Desktop: 1024px-1279px
  - Large Desktop: 1280px+

- **Touch Targets**:
  - Minimum size of 44x44px for all interactive elements on mobile
  - Minimum spacing of 8px between touch targets

- **Typography Scaling**:
  - Headers scale down by approximately 20-25% on mobile
  - Body text scales down by approximately 5-10% on mobile

### Accessibility Guidelines
- **Contrast Ratio**: Minimum 4.5:1 for normal text, 3:1 for large text
- **Focus States**: Visible focus indicator for all interactive elements
- **Alt Text**: Descriptive alternative text for all images
- **Aria Labels**: Appropriate ARIA attributes for complex UI components
- **Keyboard Navigation**: Logical tab order for all interactive elements

## Digital Product Principles

### Interface Design Principles
1. **Simplicity**: Eliminate unnecessary elements; make the complex appear simple
2. **Consistency**: Maintain consistent patterns and behaviors throughout
3. **Hierarchy**: Establish clear visual hierarchy to guide attention
4. **Feedback**: Provide immediate and clear feedback for all user actions
5. **Efficiency**: Minimize steps required to complete common tasks

### Brand Voice & Messaging
- **Tone**: Modern, confident, friendly, and expert
- **Headlines**: Direct, benefit-focused, and concise (max 10 words)
- **Body Copy**: Clear, conversational, with fashion-forward vocabulary
- **CTAs**: Action-oriented, clear benefit ("Try Your Look" vs "Submit")
- **Error Messages**: Helpful, non-technical, and solution-oriented
