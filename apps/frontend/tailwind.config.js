const { Radius } = require('lucide-react');

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: ['./src/**/*.{ts,tsx}'],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        bgColor: {
          DEFAULT: 'hsl(var(--bgColor))',
          foreground: 'hsl(var(--bgColor-foreground))',
        },
        blue: {
          DEFAULT: 'hsl(var(--blue))',
          foreground: 'hsl(var(--blue-foreground))',
        },
        menu: {
          DEFAULT: 'hsl(var(--menu))',
          foreground: 'hsl(var(--menu-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      fontFamily: {
        poppins: ['Poppins , sans-serif'],
        playWrite: ['Playwrite VN"', 'serif'],
      },
      borderRadius: {
        20: '20px',
        24: '24px',
        32: '32px',
        40: '40px',
        80: '80px',
        default: '8px',
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
      },
      fontSize: {
        12: [
          '1.2rem',
          {
            lineHeight: '2.4rem',
          },
        ],
        14: [
          '1.4rem',
          {
            lineHeight: '2.4rem',
          },
        ],
        15: [
          '1.5rem',
          {
            lineHeight: '2.4rem',
          },
        ],
        16: [
          '1.6rem',
          {
            lineHeight: '2.8rem',
          },
        ],
        17: [
          '1.7rem',
          {
            lineHeight: '2.4rem',
          },
        ],
        19: [
          '1.9rem',
          {
            lineHeight: '2.4rem',
          },
        ],
        24: [
          '2.4rem',
          {
            lineHeight: '3.8rem',
          },
        ],
        30: [
          '3.0rem',
          {
            lineHeight: '4.5rem',
          },
        ],
        48: [
          '4.8rem',
          {
            lineHeight: '4.5rem',
          },
        ],
        DEFAULT: '1.4rem',
        xs: [
          '1.6rem',
          {
            lineHeight: '2.4rem',
          },
        ],
        sm: [
          '1.8rem',
          {
            lineHeight: '2.4rem',
          },
        ],
        md: [
          '2.0rem',
          {
            lineHeight: '2.4rem',
          },
        ],
        base: [
          '1.4rem',
          {
            lineHeight: '1.5rem',
          },
        ],
        lg: [
          '2.125rem',
          {
            lineHeight: '1.75rem',
          },
        ],
        xl: [
          '3.2rem',
          {
            lineHeight: '4.4rem',
          },
        ],
        '1xl': [
          '3.6rem',
          {
            lineHeight: '4.2rem',
          },
        ],
        '2xl': [
          '3.6rem',
          {
            lineHeight: '5.0rem',
          },
        ],
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
