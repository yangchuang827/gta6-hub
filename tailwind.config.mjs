/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        vice: {
          pink: '#ff3e8a',
          purple: '#9d4edd',
          orange: '#ff6b35',
          cyan: '#00d9ff',
          dark: '#0a0a1a',
          darker: '#060611',
          card: '#13132a',
          border: '#2a2a4a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Poppins', 'Inter', 'sans-serif'],
      },
      backgroundImage: {
        'vice-gradient': 'linear-gradient(135deg, #ff3e8a 0%, #9d4edd 50%, #00d9ff 100%)',
        'vice-sunset': 'linear-gradient(180deg, #ff6b35 0%, #ff3e8a 40%, #9d4edd 100%)',
        'card-glow': 'linear-gradient(135deg, rgba(255,62,138,0.1) 0%, rgba(157,78,221,0.1) 100%)',
      },
      animation: {
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  safelist: [
    // Dynamic category colors used in ArticleCard, index, category pages
    'text-pink-400',
    'text-purple-400',
    'text-cyan-400',
    'text-orange-400',
    'bg-pink-500/10',
    'bg-purple-500/10',
    'bg-cyan-500/10',
    'bg-orange-500/10',
    // Article card gradients
    'from-orange-500', 'via-pink-500', 'to-purple-600',
    'from-purple-600', 'via-pink-500', 'to-cyan-500',
    'from-cyan-500', 'via-blue-500', 'to-purple-600',
    'from-pink-500', 'via-purple-500', 'to-indigo-600',
    'from-green-500', 'via-cyan-500', 'to-blue-600',
    'from-blue-500', 'via-purple-500', 'to-pink-600',
    'from-pink-500', 'to-purple-600',
  ],
  plugins: [],
};
