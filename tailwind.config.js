/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: '#FDFBF7',
          50: '#FAF7F0',
          100: '#F4ECE1',
          200: '#E8DBC5',
          300: '#DAC5A4',
        },
        earth: {
          DEFAULT: '#2C1A11',
          50: '#F9F5F3',
          100: '#EDE4DE',
          200: '#DCC8BC',
          300: '#BFA18F',
          600: '#754731',
          700: '#5A3423',
          800: '#412418',
          900: '#2C1A11',
          950: '#1A0E08',
        },
        terracotta: {
          DEFAULT: '#C85A32',
          light: '#F5DDD4',
          hover: '#B54924',
          dark: '#8C3415',
        },
        gold: {
          DEFAULT: '#C59B27',
          light: '#F8F1DC',
          hover: '#B0881E',
          accent: '#D4AF37',
        },
        sage: {
          DEFAULT: '#72836F',
          light: '#EAF0E9',
        }
      },
      fontFamily: {
        serif: ['var(--font-playfair)', 'Georgia', 'serif'],
        sans: ['var(--font-outfit)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(44, 26, 17, 0.06)',
        'premium': '0 12px 32px -4px rgba(44, 26, 17, 0.12)',
        'card': '0 2px 10px rgba(44, 26, 17, 0.04), 0 10px 24px -4px rgba(44, 26, 17, 0.08)',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out forwards',
        'slide-up': 'slideUp 0.4s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(12px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      }
    },
  },
  plugins: [],
};
