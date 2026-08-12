/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          900: '#1d1d1f',
          700: '#424245',
          500: '#6e6e73',
          400: '#86868b',
          300: '#a1a1a6',
          200: '#d2d2d7',
          100: '#e5e5e7',
          50: '#f5f5f7',
        },
        accent: {
          DEFAULT: '#FF6B35',
          dark: '#e85a2b',
          light: '#ff8a5b',
          bg: '#fff5f0',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      maxWidth: {
        'content': '680px',
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease-out',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  safelist: [
    // Dynamic category accent colors
    'text-orange-600',
    'text-purple-600',
    'text-cyan-600',
    'text-rose-600',
    'text-blue-600',
    'text-green-600',
    'bg-orange-50',
    'bg-purple-50',
    'bg-cyan-50',
    'bg-rose-50',
    'bg-blue-50',
    'bg-green-50',
    'border-orange-200',
    'border-purple-200',
    'border-cyan-200',
    'border-rose-200',
    'border-blue-200',
    'border-green-200',
  ],
  plugins: [],
};
