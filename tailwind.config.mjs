/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#0A192F',
          50: '#112240',
          100: '#1A2F4D',
          200: '#233554',
          300: '#2D4373',
        },
        slate: {
          DEFAULT: '#8892B0',
          100: '#CCD6F6',
          200: '#A8B2D1',
          300: '#8892B0',
          400: '#5E6B85',
        },
        accent: {
          DEFAULT: '#64FFDA',
          dark: '#52D9B5',
          bg: 'rgba(100, 255, 218, 0.1)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
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
    'text-cyan-400',
    'text-purple-400',
    'text-blue-400',
    'text-rose-400',
    'text-amber-400',
    'text-emerald-400',
    'bg-cyan-500/10',
    'bg-purple-500/10',
    'bg-blue-500/10',
    'bg-rose-500/10',
    'bg-amber-500/10',
    'bg-emerald-500/10',
    'border-cyan-500/30',
    'border-purple-500/30',
    'border-blue-500/30',
    'border-rose-500/30',
    'border-amber-500/30',
    'border-emerald-500/30',
  ],
  plugins: [],
};
