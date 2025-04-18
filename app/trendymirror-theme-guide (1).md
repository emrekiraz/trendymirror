# TrendyMirror Brand & Web Design Theme Guide

## Core Brand Identity

### Logo & Iconography
- **Primary Logo**: `trendymirror-logo.svg` - For all primary brand applications
- **App Icon**: `trendymirror-icon.svg` - Square format with stylized T/M monogram
- **Favicon**: `trendymirror-favicon.ico` - 16x16, 32x32, and 48x48px versions
- **Clear Space**: Maintain minimum spacing around logo equal to 'M' height
- **Minimum Size**: 80px width minimum for primary logo to ensure legibility

### Typography

#### Font System
- **Primary Font**: Inter (Headers and UI elements)
  - Weights: 700 (Bold), 600 (Semi-Bold), 500 (Medium), 400 (Regular)
- **Secondary Font**: None - maintain consistency with single font family
- **Fallback Stack**: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif

#### Text Hierarchy
- **H1**: 24px/30px, Inter 700, #1A2138
- **H2**: 20px/28px, Inter 700, #1A2138
- **H3**: 18px/24px, Inter 600, #1A2138
- **H4**: 16px/22px, Inter 600, #1A2138
- **Body Text**: 14px/20px, Inter 400, #4B5563
- **Small Text**: 12px/16px, Inter 400, #6B7280
- **Button Text**: 14px/20px, Inter 500, varies by button type
- **Navigation**: 14px/20px, Inter 500, #4B5563 (inactive), #3B82F6 (active)
- **Labels & Tags**: 12px/16px, Inter 500, context-dependent

### Color System

#### Primary Colors
- **Blue Primary**: #3B82F6 (Primary actions, active states, links)
- **Blue Secondary**: #60A5FA (Secondary elements, hover states)
- **Blue Tertiary**: #93C5FD (Backgrounds, non-critical indicators)
- **Purple Accent**: #8B5CF6 (Special features, accent elements)

#### Neutral Colors
- **White**: #FFFFFF (Backgrounds, cards)
- **Gray-50**: #F9FAFB (Page backgrounds, alternate rows)
- **Gray-100**: #F3F4F6 (Dividers, subtle backgrounds)
- **Gray-200**: #E5E7EB (Borders, disabled states)
- **Gray-500**: #6B7280 (Secondary text, icons)
- **Gray-700**: #4B5563 (Body text)
- **Gray-900**: #1A2138 (Headings, important text)

#### Functional Colors
- **Success**: #10B981 (Confirmations, successful actions)
- **Warning**: #F59E0B (Warnings, notifications)
- **Error**: #EF4444 (Errors, destructive actions)
- **Info**: #3B82F6 (Information, neutral notifications)

#### Gradient Palette
- **Blue Gradient**: linear-gradient(to right, #3B82F6, #8B5CF6) (CTAs, promotional areas)
- **Light Blue Gradient**: linear-gradient(to right, #60A5FA, #A78BFA) (Secondary elements)
- **Blue Overlay**: rgba(59, 130, 246, 0.1) (Active backgrounds, hover states)

### Design Elements

#### Shadows & Elevation
- **Level 1**: 0px 1px 2px rgba(0, 0, 0, 0.05) (Subtle elevation, cards)
- **Level 2**: 0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -1px rgba(0, 0, 0, 0.06) (Dropdowns, popovers)
- **Level 3**: 0px 10px 15px -3px rgba(0, 0, 0, 0.1), 0px 4px 6px -2px rgba(0, 0, 0, 0.05) (Modals, sticky headers)
- **Focus Shadow**: 0px 0px 0px 3px rgba(59, 130, 246, 0.3) (Focus states)

#### Border Radius
- **Small**: 4px (Tags, chips, badges)
- **Medium**: 8px (Buttons, input fields, cards)
- **Large**: 12px (Modal windows, large cards)
- **Round**: 9999px (Pills, avatars, counters)

#### Iconography
- **System**: Font Awesome (fa-solid) icons
- **Size**: 16px (UI elements), 20px (navigation), 24px (feature icons)
- **Weight**: Solid icons for better visibility at small sizes
- **Color**: Matches text color in context, or #6B7280 when standalone
- **Spacing**: Minimum 8px spacing from adjacent text

## UI Component Library

### Buttons

#### Primary Button
- **Background**: #3B82F6 (default), #2563EB (hover), #1D4ED8 (active)
- **Text**: #FFFFFF
- **Padding**: 8px 16px
- **Border Radius**: 8px
- **Height**: 40px
- **Shadow**: none (default), Level 1 (hover)
- **Transition**: 150ms ease-in-out for all state changes

#### Secondary Button
- **Background**: #FFFFFF (default), #F3F4F6 (hover), #E5E7EB (active)
- **Border**: 1px solid #E5E7EB
- **Text**: #4B5563
- **Padding**: 8px 16px
- **Border Radius**: 8px
- **Height**: 40px
- **Shadow**: Level 1

#### Tertiary/Text Button
- **Background**: transparent
- **Text**: #3B82F6
- **Padding**: 8px 16px
- **Border Radius**: 8px
- **Hover State**: Background #EFF6FF

#### Gradient Button
- **Background**: Blue Gradient
- **Text**: #FFFFFF
- **Padding**: 8px 16px
- **Border Radius**: 8px
- **Height**: 40px
- **Shadow**: Level 1

#### Icon Buttons
- **Size**: 40px x 40px
- **Border Radius**: 8px
- **Icon Size**: 16px
- **States**: Follow primary or secondary button states

#### Button States
- **Disabled**: 40% opacity, no hover effects
- **Loading**: Show spinner icon, maintain width
- **With Icon**: 8px spacing between icon and text

### Form Controls

#### Text Input
- **Height**: 40px
- **Padding**: 8px 12px
- **Border**: 1px solid #E5E7EB
- **Border Radius**: 8px
- **Background**: #FFFFFF
- **Text**: #4B5563
- **Placeholder**: #9CA3AF
- **Focus State**: Border 2px solid #3B82F6, Focus Shadow
- **Error State**: Border 2px solid #EF4444

#### Select Dropdown
- **Height**: 40px
- **Padding**: 8px 12px
- **Border**: 1px solid #E5E7EB
- **Border Radius**: 8px
- **Dropdown Icon**: Chevron down (fa-chevron-down)
- **Focus & Error States**: Match text input

#### Checkbox
- **Size**: 16px x 16px
- **Border Radius**: 4px
- **Border**: 1px solid #E5E7EB
- **Checked State**: #3B82F6 background, white checkmark
- **Focus State**: Focus Shadow

#### Radio Button
- **Size**: 16px x 16px
- **Border**: 1px solid #E5E7EB
- **Checked State**: #3B82F6 border and inner circle
- **Focus State**: Focus Shadow

#### Form Labels
- **Position**: Above input fields
- **Size**: 14px
- **Weight**: Medium (500)
- **Spacing**: 8px below label, 12px between fields
- **Required Indicator**: Red asterisk (*)

#### Input Groups
- **Spacing**: 16px between label and field
- **Helper Text**: 12px, #6B7280, 4px below field
- **Error Text**: 12px, #EF4444, 4px below field
- **Icons**: Left or right aligned within input, 16px size

### Cards & Containers

#### Standard Card
- **Background**: #FFFFFF
- **Border Radius**: 12px
- **Border**: None
- **Padding**: 16px
- **Shadow**: Level 1
- **Hover State**: Level 2 shadow (when interactive)

#### Feature Card
- **Background**: #FFFFFF
- **Border Radius**: 12px
- **Padding**: 24px
- **Shadow**: Level 1
- **Icon Container**: 40px x 40px, #EFF6FF background, #3B82F6 icon

#### Dashboard Tile
- **Background**: #FFFFFF
- **Border Radius**: 12px
- **Padding**: 16px
- **Shadow**: Level 1
- **Header**: 16px bottom padding, optional border-bottom

#### Image Container
- **Border Radius**: Matches parent container
- **Aspect Ratio**: Maintained based on use case
- **Overlay**: For hover state, rgba(0, 0, 0, 0.5)

### Navigation Elements

#### Main Sidebar
- **Width**: 240px (60px collapsed)
- **Background**: #FFFFFF
- **Shadow**: Level 2
- **Selected Item**: #EFF6FF background, #3B82F6 text and icon
- **Hover Item**: #F3F4F6 background
- **Spacing**: 12px between items
- **Icon Alignment**: 16px left margin, text 12px from icon

#### Top Navigation
- **Height**: 64px
- **Background**: #FFFFFF
- **Shadow**: Level 1
- **Border Bottom**: 1px solid #E5E7EB
- **Item Spacing**: 24px between items

#### Tab Navigation
- **Height**: 40px
- **Background**: transparent
- **Active Tab**: Border-bottom 2px solid #3B82F6, #3B82F6 text
- **Inactive Tab**: No border, #4B5563 text
- **Hover State**: #F3F4F6 background

#### Dropdown Menu
- **Background**: #FFFFFF
- **Border Radius**: 8px
- **Shadow**: Level 2
- **Item Height**: 40px
- **Item Padding**: 8px 16px
- **Hover State**: #F3F4F6 background
- **Divider**: 1px solid #E5E7EB

#### Breadcrumbs
- **Font Size**: 14px
- **Color**: #6B7280, last item #4B5563
- **Separator**: Chevron right (fa-chevron-right), 12px size, #9CA3AF

### Feedback Elements

#### Alert/Notification
- **Border Radius**: 8px
- **Padding**: 12px 16px
- **Border Left**: 4px solid context color
- **Background**: Light version of context color
- **Icon**: Left-aligned, matches context color
- **Types**: 
  - Info: #EFF6FF background, #3B82F6 border
  - Success: #ECFDF5 background, #10B981 border
  - Warning: #FFFBEB background, #F59E0B border
  - Error: #FEF2F2 background, #EF4444 border

#### Toast Notification
- **Border Radius**: 8px
- **Padding**: 12px 16px
- **Background**: #FFFFFF
- **Shadow**: Level 3
- **Duration**: 4000ms default
- **Position**: Top-right, 24px from edges
- **Animation**: Slide in from right, fade out

#### Badge
- **Border Radius**: Round (9999px)
- **Padding**: 2px 8px
- **Height**: 20px
- **Font Size**: 12px
- **Font Weight**: 500
- **Types**:
  - Default: #F3F4F6 background, #4B5563 text
  - Primary: #EFF6FF background, #3B82F6 text
  - Success: #ECFDF5 background, #10B981 text
  - Warning: #FFFBEB background, #F59E0B text
  - Error: #FEF2F2 background, #EF4444 text
  - New: #F5F3FF background, #8B5CF6 text

#### Progress Indicator
- **Height**: 4px
- **Border Radius**: 2px
- **Background (Track)**: #E5E7EB
- **Background (Fill)**: #3B82F6 or context color
- **Animation**: Smooth transition on progress change

### Content Display

#### Tables
- **Header Background**: #F9FAFB
- **Header Text**: #4B5563, 14px, 500 weight
- **Row Border**: 1px solid #F3F4F6
- **Row Height**: 48px
- **Cell Padding**: 12px 16px
- **Hover State**: #F9FAFB background
- **Pagination**: 24px top margin

#### Image Gallery
- **Grid Gap**: 16px
- **Border Radius**: 8px for all images
- **Aspect Ratio**: Consistent within same row
- **Hover Effect**: Slight scale (1.02) and shadow increase

#### Stats Display
- **Number**: 24px, 700 weight
- **Label**: 14px, 400 weight, #6B7280
- **Icon**: Optional, 20px, context color
- **Trend Indicator**: Up/down arrow with percentage

#### Empty States
- **Illustration**: Centered, 120px max height
- **Message**: 16px, 500 weight, centered
- **Action Button**: Optional, primary button style

## Layout System

### Grid System
- **Container Width**: Max 1280px
- **Column Count**: 12 columns
- **Gutter Width**: 24px
- **Margin**: Auto horizontal centering

### Spacing Scale
- **4px**: Minimum spacing, tight elements
- **8px**: Default spacing between related elements
- **12px**: Medium spacing
- **16px**: Standard spacing
- **24px**: Large spacing between sections
- **32px**: Extra large spacing
- **48px**: Section padding
- **64px**: Major section divisions

### Responsive Breakpoints
- **xs**: <640px (Mobile)
- **sm**: 640px (Small tablets)
- **md**: 768px (Tablets)
- **lg**: 1024px (Laptops)
- **xl**: 1280px (Desktops)
- **2xl**: 1536px (Large screens)

### Layout Components
- **Container**: Max-width 1280px, centered
- **Section**: 48px vertical padding
- **Grid**: 12-column system, responsive
- **Card Grid**: 3-column default, 1-column on mobile

## Animation & Interaction

### Transitions
- **Default Timing**: 150ms ease-in-out
- **Major Transitions**: 300ms ease-in-out
- **Properties**: transform, opacity, background-color, border-color, box-shadow

### Hover States
- **Scale**: 1.02x for cards and interactive elements
- **Shadow Increase**: One level up on elevation scale
- **Background Change**: 5-10% lightness change

### Loading States
- **Spinner**: Circular, #3B82F6, 24px for inline, 40px for page loads
- **Skeleton**: #F3F4F6 background, pulsing animation
- **Progress Bar**: For longer operations, 4px height

### Feedback Animations
- **Click/Tap**: Subtle scale down (0.98) during active state
- **Success**: Green checkmark with fade-in
- **Error**: Red shake animation (3px, 150ms)
- **Navigation**: Content fade transition between pages

## Image & Media Guidelines

### Image Styles
- **Model Photos**: Clean background, natural lighting, true colors
- **Product Images**: Consistent aspect ratio, white background
- **User Uploads**: Auto-cropped to maintain aspect ratio
- **Placeholders**: Neutral gray (#F3F4F6) with icon

### Aspect Ratios
- **Model Cards**: 3:4 vertical
- **Product Cards**: 1:1 square
- **Gallery Images**: Maintain original ratio
- **Hero Images**: 16:9 for banners

### File Specifications
- **Format**: JPEG for photos, PNG for UI elements, SVG for icons
- **Resolution**: 2x for all screens (min 72dpi)
- **Compression**: Optimize for web loading (WEBP when possible)

## UX Writing & Content

### Button Text
- **Primary Actions**: Start with verb ("Create Model", "Try On")
- **Secondary Actions**: Clear function ("View Gallery", "Cancel")
- **Destructive Actions**: Clear warning ("Delete", "Remove")

### Notifications
- **Success**: Confirm action completed ("Model created successfully")
- **Error**: Clear problem and solution ("Upload failed. Try a smaller image.")
- **Warning**: Alert with guidance ("This will affect all saved models")

### Empty States
- **Friendly**: Conversational but not cute
- **Helpful**: Explain what's missing and how to fix it
- **Action-oriented**: Provide clear next step

### Form Labels & Help Text
- **Concise**: Keep labels under 3 words when possible
- **Specific**: Clearly describe what's needed
- **Helpful**: Provide format examples for complex inputs

## Responsive Behavior

### Mobile Adaptations
- **Sidebar**: Collapses to bottom navigation
- **Tables**: Stack or horizontal scroll with sticky first column
- **Grids**: Single column layouts, full width cards
- **Font Sizes**: Reduce by 1-2px on smallest screens
- **Touch Targets**: Minimum 44px x 44px for all interactive elements

### Tablet Adaptations
- **Grids**: 2-column layouts typical
- **Sidebar**: Collapsible but available
- **Spacing**: Reduced by ~20% from desktop

### Desktop Optimizations
- **Multi-column**: Take advantage of wider screens
- **Hover States**: Add richness unavailable on touch devices
- **Keyboard Shortcuts**: Document and surface in UI

## Accessibility Standards

### Color Contrast
- **Text on Background**: Minimum 4.5:1 ratio for normal text, 3:1 for large text
- **UI Components**: Minimum 3:1 ratio between adjacent colors
- **Focus States**: High visibility for keyboard navigation

### Keyboard Navigation
- **Focus Order**: Logical top-to-bottom, left-to-right flow
- **Focus Styles**: Visible outline for all interactive elements
- **Shortcuts**: Document common actions with keyboard shortcuts

### Screen Readers
- **Alt Text**: Descriptive for all informational images
- **ARIA Labels**: For complex UI components
- **Semantic HTML**: Proper heading structure and landmark regions

### Reduced Motion
- **Respect Preferences**: Honor prefers-reduced-motion media query
- **Essential Animation**: Maintain only functional animations
- **Duration**: Shorten transition times by 50%

## Implementation Guidelines

### CSS Framework
- **Primary**: Tailwind CSS for all styling
- **Custom Properties**: For brand colors and recurring values
- **Naming Convention**: Use Tailwind utility classes

### Icon Implementation
- **System**: Font Awesome 6 (Solid style)
- **Usage**: Via standard class names (fa-solid fa-[icon-name])
- **Sizing**: Through text size classes (text-sm, text-base, etc.)

### Responsive Strategy
- **Approach**: Mobile-first development
- **Media Queries**: Use Tailwind breakpoint system (sm, md, lg, xl)
- **Testing**: Regular validation across device ranges

### Performance Requirements
- **First Contentful Paint**: Under 1.5s
- **Time to Interactive**: Under 3.5s
- **Bundle Size**: Core CSS under 100KB gzipped
- **Image Loading**: Lazy load all below-the-fold images

## Feature-Specific Guidelines

### Virtual Try-On Experience
- **Model Display**: Prominent, center-stage positioning
- **Clothing Selection**: Thumbnail grid, drag-and-drop enabled
- **Controls**: Easily accessible size/fit controls
- **Results**: High-quality output with easy sharing options

### User Gallery
- **Grid View**: Default with filtering options
- **Preview**: Quick view on hover/tap
- **Actions**: Edit, share, delete available per item
- **Sorting**: Multiple options (recent, favorites, etc.)

### Model Management
- **Creation Flow**: Step-by-step guided process
- **Editing**: Inline changes where possible
- **Organization**: Folders or tagging system
- **Sharing**: Privacy controls and link sharing

## Core Principles

### Brand Principles
1. **Modern Simplicity**: Clean interfaces that focus on content
2. **Intuitive Experience**: Reduce cognitive load through intuitive design
3. **Fashion-Forward**: Contemporary aesthetic that appeals to fashion audience
4. **Technological Trust**: Convey advanced AI capabilities through refined design

### User-Centered Guidelines
1. **Reduce Friction**: Minimize steps to complete core actions
2. **Clear Feedback**: Always confirm actions and current system state
3. **Consistent Patterns**: Maintain consistency across all interactions
4. **Delight in Details**: Small animations and micro-interactions that enhance experience
5. **Invite Exploration**: Make advanced features discoverable
