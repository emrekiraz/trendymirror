# TrendyMirror Theme System

This document provides guidelines for using the TrendyMirror theme system to ensure consistent styling across the application.

## Theme Structure

The theme is defined in `theme.ts` and includes:

- **Colors**: Primary, neutral, and functional colors
- **Typography**: Font families, weights, sizes, and line heights
- **Spacing**: Consistent spacing values
- **Borders**: Border radius and width values
- **Shadows**: Box shadow definitions
- **Transitions**: Animation timing
- **Z-index**: Layer management
- **Component Styles**: Predefined styles for buttons, cards, badges, etc.

## How to Use the Theme

### 1. Using Theme Provider

The theme is available throughout the application via the `ThemeProvider`. You can access it using the `useTheme` hook:

```tsx
import { useTheme } from '@/app/providers/ThemeProvider'

function MyComponent() {
  const theme = useTheme()
  
  // Now you can access theme values
  console.log(theme.colors.blue.primary)
  
  return <div>My Component</div>
}
```

### 2. Using Theme Utilities

For convenience, we provide utility functions in `utils/themeUtils.ts`:

```tsx
import { getColor, getFontFamily, getShadow } from '@/app/utils/themeUtils'

function MyComponent() {
  // Get a color value
  const primaryColor = getColor('blue.primary')
  
  // Get a font family
  const primaryFont = getFontFamily('primary')
  
  // Get a shadow value
  const shadowLevel1 = getShadow('level1')
  
  return <div>My Component</div>
}
```

### 3. Using UI Components

We provide pre-styled UI components that follow the theme:

```tsx
import Button from '@/app/components/ui/Button'
import Card from '@/app/components/ui/Card'
import Badge from '@/app/components/ui/Badge'
import { Heading, Text } from '@/app/components/ui/Typography'
import Logo from '@/app/components/ui/Logo'

function MyComponent() {
  return (
    <Card>
      <Heading level={2}>Card Title</Heading>
      <Text>Card content goes here</Text>
      <Badge variant="primary">New</Badge>
      <Button variant="primary">Click Me</Button>
    </Card>
  )
}
```

## UI Components

### Button

```tsx
<Button 
  variant="primary" // 'primary', 'secondary', 'tertiary', 'gradient'
  size="md" // 'sm', 'md', 'lg'
  fullWidth={false} // true, false
  href="/some-path" // Optional - renders as Link if provided
  isExternal={false} // true, false - for external links
  className="mt-4" // Additional classes
  disabled={false} // true, false
  onClick={() => {}} // Click handler
>
  Button Text
</Button>
```

### Card

```tsx
<Card 
  variant="default" // 'default', 'feature'
  className="p-4" // Additional classes
  hover={true} // true, false - enables hover effect
  onClick={() => {}} // Optional click handler
>
  Card Content
</Card>
```

### Badge

```tsx
<Badge 
  variant="primary" // 'default', 'primary', 'success', 'warning', 'error', 'new'
  className="ml-2" // Additional classes
>
  Badge Text
</Badge>
```

### Typography

```tsx
<Heading 
  level={1} // 1-6
  className="mb-4" // Additional classes
>
  Heading Text
</Heading>

<Text 
  variant="body" // 'body', 'body-sm', 'body-xs', 'caption'
  color="default" // 'default', 'light', 'dark', 'primary', 'success', 'warning', 'error'
  className="mt-2" // Additional classes
>
  Paragraph text
</Text>
```

### Logo

```tsx
<Logo 
  showText={true} // true, false - show/hide text
  size="md" // 'sm', 'md', 'lg'
  className="mb-4" // Additional classes
  href="/dashboard" // Optional custom link
/>
```

## Tailwind Classes

When using Tailwind classes directly, follow these guidelines:

### Colors

- Primary Blue: `bg-blue-primary`, `text-blue-primary`, `border-blue-primary`
- Secondary Blue: `bg-blue-secondary`, `text-blue-secondary`, `border-blue-secondary`
- Tertiary Blue: `bg-blue-tertiary`, `text-blue-tertiary`, `border-blue-tertiary`
- Purple Accent: `bg-purple-accent`, `text-purple-accent`, `border-purple-accent`
- Grays: `bg-gray-50`, `bg-gray-100`, `bg-gray-200`, `bg-gray-500`, `bg-gray-700`, `bg-gray-900`
- Functional: `bg-success`, `bg-warning`, `bg-error`, `bg-info`

### Typography

- Font Family: `font-inter`, `font-heebo`
- Font Weight: `font-normal`, `font-medium`, `font-semibold`, `font-bold`
- Font Size: `text-xs`, `text-sm`, `text-base`, `text-lg`, `text-xl`, `text-2xl`

### Shadows

- `shadow-level-1`, `shadow-level-2`, `shadow-level-3`, `shadow-focus`

### Border Radius

- `rounded-sm`, `rounded-md`, `rounded-lg`, `rounded-round`

## Adding New Components

When adding new components:

1. Follow the existing patterns for component structure
2. Use the theme values for styling
3. Provide appropriate props for customization
4. Document the component in this README

## Updating the Theme

When updating the theme:

1. Make changes to `theme.ts`
2. Update the Tailwind configuration if necessary
3. Update this documentation
4. Test the changes across the application 