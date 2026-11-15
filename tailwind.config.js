/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        obsidian: {
          DEFAULT: '#0B0E14',
          surface: '#111622',
          card: 'rgba(17, 22, 34, 0.85)',
          glass: 'rgba(21, 28, 44, 0.65)',
          border: 'rgba(255, 255, 255, 0.08)'
        },
        flame: {
          DEFAULT: '#FF5500',
          glow: '#FF6D00',
          accent: '#FF8A00'
        },
        cyan: {
          DEFAULT: '#00E5FF',
          dark: '#0099b8'
        },
        emerald: {
          DEFAULT: '#00E676',
          mint: '#10B981'
        },
        brand: {
          orange: '#FF5500',
          orangeDark: '#E53900',
          orangeLight: 'rgba(255, 85, 0, 0.12)',
          emerald: '#00E676',
          cyan: '#00E5FF'
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        display: ['"Space Grotesk"', 'sans-serif'],
        mono: ['"Space Mono"', 'monospace'],
        condensed: ['"Space Grotesk"', 'sans-serif'],
      },
      boxShadow: {
        'neon-orange': '0 0 25px -4px rgba(255, 85, 0, 0.55), 0 0 10px -2px rgba(255, 85, 0, 0.35)',
        'neon-cyan': '0 0 25px -4px rgba(0, 229, 255, 0.45), 0 0 10px -2px rgba(0, 229, 255, 0.3)',
        'neon-green': '0 0 25px -4px rgba(0, 230, 118, 0.45)',
        'glass-hud': '0 20px 50px -10px rgba(0,0,0,0.8), inset 0 1px 1px 0 rgba(255,255,255,0.12)'
      },
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.8', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.06)', filter: 'drop-shadow(0 0 18px rgba(255,85,0,0.85))' },
        },
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'pulse-glow': 'pulse-glow 2.5s infinite ease-in-out',
      }
    },
  },
  plugins: [],
}
