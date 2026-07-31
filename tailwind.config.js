/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#070A12',
          900: '#0B0F1A',
          850: '#0F1424',
          800: '#11172A',
          750: '#161D33',
          700: '#1A2238',
          600: '#232C47',
          500: '#2E3A5C',
          400: '#475073',
          300: '#6B7280',
          200: '#9CA3AF',
          100: '#D1D5DB',
          50: '#F3F4F6',
        },
        gold: {
          50: '#FBF7EA',
          100: '#F8EFCE',
          200: '#F2E29A',
          300: '#EBD266',
          400: '#E2BF3C',
          500: '#D4AF37',  // primary gold
          600: '#B8941F',
          700: '#947516',
          800: '#6E560F',
          900: '#4A3908',
        },
        // keep brand for backward-compat aliases used in some components
        brand: {
          50: '#f0f6ff', 100: '#dbeafe', 200: '#bfdbfe', 300: '#93c5fd',
          400: '#60a5fa', 500: '#3b82f6', 600: '#2563eb', 700: '#1d4ed8',
          800: '#1e40af', 900: '#1e3a8a', 950: '#172554',
        },
        accent: {
          400: '#34d399', 500: '#10b981', 600: '#059669',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-xl': ['clamp(2.75rem, 6vw, 4.75rem)', { lineHeight: '1.02', letterSpacing: '-0.035em', fontWeight: '800' }],
        'display-lg': ['clamp(2.25rem, 5vw, 3.5rem)', { lineHeight: '1.05', letterSpacing: '-0.03em', fontWeight: '800' }],
      },
      boxShadow: {
        'premium': '0 1px 2px rgba(16,24,40,0.04), 0 12px 32px -8px rgba(16,24,40,0.08)',
        'premium-lg': '0 1px 2px rgba(16,24,40,0.04), 0 24px 60px -12px rgba(16,24,40,0.14)',
        'gold': '0 8px 28px -6px rgba(212,175,55,0.35)',
        'gold-glow': '0 0 0 1px rgba(212,175,55,0.25), 0 12px 40px -8px rgba(212,175,55,0.3)',
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #F2E29A 0%, #D4AF37 45%, #B8941F 100%)',
        'gold-sheen': 'linear-gradient(110deg, transparent 30%, rgba(255,255,255,0.5) 50%, transparent 70%)',
        'ink-radial': 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(212,175,55,0.18) 0%, transparent 60%)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'ticker': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'glow-pulse': {
          '0%, 100%': { opacity: '0.5' },
          '50%': { opacity: '1' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.6s cubic-bezier(0.16,1,0.3,1) both',
        'fade-in': 'fade-in 0.5s ease both',
        'shimmer': 'shimmer 2.5s linear infinite',
        'ticker': 'ticker 40s linear infinite',
        'glow-pulse': 'glow-pulse 4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
