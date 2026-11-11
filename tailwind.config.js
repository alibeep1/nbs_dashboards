/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Color Palette from Figma Design Tokens
      colors: {
        // Neutral Colors
        neutral: {
          100: '#F0F1F2',
          150: '#E4E5E6', 
          300: '#B5B9BD',
          600: '#7F858A',
          700: '#465057',
          800: '#2C363D',
          900: '#161E24',
          white: '#FFFFFF',
        },
        
        // Primary Colors
        primary: {
          100: '#E5F4FF',
        },
        
        // Secondary Colors - Green
        green: {
          400: '#60F0C9',
          500: '#2DE3B3',
          600: '#00D79E',
          700: '#00A378',
        },
        
        // Secondary Colors - Orange
        orange: {
          500: '#FFA475',
          600: '#FF8343',
        },
        
        // Theme Colors (for shadcn/ui compatibility)
        background: '#ffffff',
        foreground: '#020618',
        muted: {
          DEFAULT: '#f1f5f9',
          foreground: '#62748e',
        },
        accent: {
          DEFAULT: '#f1f5f9',
          foreground: '#0f172b',
        },
        border: '#e2e8f0',
        
        // Semantic Colors
        success: '#00A378',
        warning: '#FF8343',
        error: '#ef4444',
        
        // Black and White
        black: '#000000',
        white: '#FFFFFF',
      },
      
      // Typography - Font Families
      fontFamily: {
        'jakarta': ['"Plus Jakarta Sans"', 'sans-serif'],
        'roboto': ['Roboto', 'sans-serif'],
        'inter': ['Inter', 'sans-serif'],
        'sans': ['Inter', 'ui-sans-serif', 'system-ui'],
      },
      
      // Font Weights
      fontWeight: {
        'regular': '400',
        'medium': '500', 
        'semibold': '600',
        'bold': '700',
      },
      
      // Font Sizes with Line Heights
      fontSize: {
        // Headings
        'h4': ['18px', { lineHeight: '1.25', fontWeight: '600' }],
        
        // Body Text
        'body-16': ['16px', { lineHeight: '1.5' }],
        'body-16-bold': ['16px', { lineHeight: '1.5', fontWeight: '500' }],
        'body-14': ['14px', { lineHeight: '1.5' }],
        'body-14-bold': ['14px', { lineHeight: '1.5', fontWeight: '500' }],
        
        // Labels
        'label-12': ['12px', { lineHeight: '1.25' }],
        'label-12-bold': ['12px', { lineHeight: '1.25', fontWeight: '600' }],
        'label-14': ['14px', { lineHeight: '1.25' }],
        'label-14-bold': ['14px', { lineHeight: '1.25', fontWeight: '600' }],
        
        // Caption (Roboto)
        'caption': ['12px', { lineHeight: '1.0', fontWeight: '400' }],
        
        // Text Small
        'text-sm': ['14px', { lineHeight: '20px', fontWeight: '400' }],
      },
      
      // Line Heights
      lineHeight: {
        '5': '20px',
        'tight': '1.25',
        'normal': '1.5',
        'none': '1.0',
      },
      
      // Letter Spacing
      letterSpacing: {
        'normal': '0',
      },
      
      // Border Radius
      borderRadius: {
        'lg': '8px',
        'xl': '12px',
        '2xl': '16px',
        '3xl': '24px',
      },
      
      // Spacing (extends default Tailwind spacing)
      spacing: {
        '4.5': '18px',
        '18': '72px',
        '88': '352px',
      },
      
      // Grid Template Columns for Dashboard Layout
      gridTemplateColumns: {
        'dashboard': 'repeat(4, minmax(0, 1fr))',
        'cards': 'repeat(auto-fit, minmax(153px, 1fr))',
      },
      
      // Grid Template Rows for Dashboard Layout  
      gridTemplateRows: {
        'dashboard': 'repeat(12, minmax(0, 1fr))',
      },
      
      // Box Shadow
      boxShadow: {
        'card': '0px 1px 2px 0px rgba(0,0,0,0.05)',
        'subtle': '0px 1px 3px 0px rgba(0,0,0,0.1)',
      },
      
      // Animation
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      
      // Keyframes for animations
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      
      // Backdrop Blur
      backdropBlur: {
        'xs': '2px',
      },
      
      // Min/Max Width for responsive design
      maxWidth: {
        'dashboard': '1440px',
        'card': '338px',
      },
      
      minWidth: {
        'card': '153px',
        'dropdown': '161px',
      },
      
      // Height utilities for dashboard components
      height: {
        'card': '195px',
        'chart': '344px',
        'filter': '44px',
      },
      
      // Width utilities
      width: {
        'dropdown-sm': '161px',
        'dropdown-md': '211px', 
        'dropdown-lg': '236px',
        'search': '167px',
        'search-lg': '340px',
      },
    },
  },
  
  // Plugins
  plugins: [
    // Add any plugins you need
    // require('@tailwindcss/forms'),
    // require('@tailwindcss/typography'),
  ],
  
  // Safelist classes that might be dynamically generated
  safelist: [
    // Grid area classes
    {
      pattern: /grid-area-\d+/,
    },
    // Color variations
    {
      pattern: /(bg|text|border)-(neutral|green|orange)-(100|300|400|500|600|700|800|900)/,
    },
    // Font family variations
    {
      pattern: /font-(jakarta|roboto|inter)/,
    },
  ],
}