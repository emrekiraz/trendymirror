/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary Colors
        blue: {
          primary: '#3B82F6',
          secondary: '#60A5FA',
          tertiary: '#93C5FD',
          DEFAULT: '#3B82F6',
        },
        purple: {
          accent: '#8B5CF6',
          DEFAULT: '#8B5CF6',
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
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        heebo: ['Heebo', 'sans-serif'],
      },
      boxShadow: {
        'level-1': '0px 1px 2px rgba(0, 0, 0, 0.05)',
        'level-2': '0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'level-3': '0px 10px 15px -3px rgba(0, 0, 0, 0.1), 0px 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'focus': '0px 0px 0px 3px rgba(59, 130, 246, 0.3)',
      },
      borderRadius: {
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'round': '9999px',
      },
      spacing: {
        '72': '18rem',
        '80': '20rem',
        '96': '24rem',
      },
    },
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
  ],
} 