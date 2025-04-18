/**
 * TrendyMirror Theme Configuration
 * 
 * This file serves as the single source of truth for the TrendyMirror design system.
 * All components and pages should reference this file for styling to ensure consistency.
 */

export const theme = {
  // Color Palette
  colors: {
    // Primary Colors
    blue: {
      primary: '#3B82F6',
      secondary: '#60A5FA',
      tertiary: '#93C5FD',
    },
    purple: {
      accent: '#8B5CF6',
    },
    
    // Neutral Colors
    white: '#FFFFFF',
    gray: {
      50: '#F9FAFB',
      100: '#F3F4F6',
      200: '#E5E7EB',
      500: '#6B7280',
      700: '#4B5563',
      900: '#1A2138',
    },
    
    // Functional Colors
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
  },
  
  // Typography
  typography: {
    // Font Families
    fontFamily: {
      primary: 'Inter, sans-serif',
      logo: 'Heebo, sans-serif',
    },
    
    // Font Weights
    fontWeight: {
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    
    // Font Sizes
    fontSize: {
      xs: '12px',
      sm: '14px',
      base: '16px',
      lg: '18px',
      xl: '20px',
      '2xl': '24px',
    },
    
    // Line Heights
    lineHeight: {
      tight: '20px',
      normal: '24px',
      relaxed: '28px',
      loose: '30px',
    },
    
    // Heading Styles
    headings: {
      h1: {
        fontSize: '24px',
        lineHeight: '30px',
        fontWeight: 700,
      },
      h2: {
        fontSize: '20px',
        lineHeight: '28px',
        fontWeight: 700,
      },
      h3: {
        fontSize: '18px',
        lineHeight: '24px',
        fontWeight: 600,
      },
      h4: {
        fontSize: '16px',
        lineHeight: '22px',
        fontWeight: 600,
      },
    },
  },
  
  // Spacing
  spacing: {
    0: '0px',
    1: '4px',
    2: '8px',
    3: '12px',
    4: '16px',
    5: '20px',
    6: '24px',
    8: '32px',
    10: '40px',
    12: '48px',
    16: '64px',
  },
  
  // Borders
  borders: {
    radius: {
      sm: '4px',
      md: '8px',
      lg: '12px',
      round: '9999px',
    },
    width: {
      thin: '1px',
      medium: '2px',
      thick: '4px',
    },
  },
  
  // Shadows
  shadows: {
    level1: '0px 1px 2px rgba(0, 0, 0, 0.05)',
    level2: '0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -1px rgba(0, 0, 0, 0.06)',
    level3: '0px 10px 15px -3px rgba(0, 0, 0, 0.1), 0px 4px 6px -2px rgba(0, 0, 0, 0.05)',
    focus: '0px 0px 0px 3px rgba(59, 130, 246, 0.3)',
  },
  
  // Transitions
  transitions: {
    fast: '150ms ease-in-out',
    normal: '300ms ease-in-out',
    slow: '500ms ease-in-out',
  },
  
  // Z-index
  zIndex: {
    base: 0,
    dropdown: 10,
    sticky: 20,
    fixed: 30,
    modal: 40,
    popover: 50,
    tooltip: 60,
  },
  
  // Logo
  logo: {
    text: {
      fontFamily: 'Heebo, sans-serif',
      fontWeight: 700,
      letterSpacing: '0.02em',
      gradient: 'linear-gradient(to right, #3B82F6, #8B5CF6)',
    },
  },
  
  // Buttons
  buttons: {
    primary: {
      background: '#3B82F6',
      hoverBackground: '#2563EB',
      color: '#FFFFFF',
      padding: '8px 16px',
      height: '40px',
      borderRadius: '8px',
    },
    secondary: {
      background: '#FFFFFF',
      hoverBackground: '#F3F4F6',
      color: '#4B5563',
      borderColor: '#E5E7EB',
      padding: '8px 16px',
      height: '40px',
      borderRadius: '8px',
    },
    tertiary: {
      background: 'transparent',
      hoverBackground: '#EFF6FF',
      color: '#3B82F6',
      padding: '8px 16px',
      borderRadius: '8px',
    },
    gradient: {
      background: 'linear-gradient(to right, #3B82F6, #8B5CF6)',
      color: '#FFFFFF',
      padding: '8px 16px',
      height: '40px',
      borderRadius: '8px',
    },
  },
  
  // Cards
  cards: {
    default: {
      background: '#FFFFFF',
      borderRadius: '12px',
      boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.05)',
      padding: '16px',
    },
    feature: {
      background: '#FFFFFF',
      borderRadius: '12px',
      boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.05)',
      padding: '24px',
    },
  },
  
  // Badges
  badges: {
    default: {
      background: '#F3F4F6',
      color: '#4B5563',
    },
    primary: {
      background: '#EFF6FF',
      color: '#3B82F6',
    },
    success: {
      background: '#ECFDF5',
      color: '#10B981',
    },
    warning: {
      background: '#FFFBEB',
      color: '#F59E0B',
    },
    error: {
      background: '#FEF2F2',
      color: '#EF4444',
    },
    new: {
      background: '#F5F3FF',
      color: '#8B5CF6',
    },
  },
  
  // Media Queries
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
};

export default theme; 