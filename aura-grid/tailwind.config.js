/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './app/**/*.{js,jsx}',
        './components/**/*.{js,jsx}',
    ],
    theme: {
        extend: {
            colors: {
                'bg-deep': '#030712',
                'bg-surface': '#0d1117',
                'bg-card': '#111827',
                'bg-card-h': '#1a2234',
                'accent-cyan': '#00f5ff',
                'accent-green': '#00ff9d',
                'accent-amber': '#ffb800',
                'accent-red': '#ff3b5c',
                'accent-violet': '#7c3aed',
                'accent-blue': '#3b82f6',
                'text-primary': '#f1f5f9',
                'text-secondary': '#94a3b8',
                'text-muted': '#475569',
            },
            fontFamily: {
                sans: ['Outfit', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace'],
            },
            borderRadius: {
                'sm': '6px',
                'md': '12px',
                'lg': '20px',
                'xl': '32px',
            },
            animation: {
                'float': 'float 4s ease-in-out infinite',
                'spin-slow': 'spin-slow 8s linear infinite',
                'pulse-dot': 'pulse-dot 2s infinite',
                'fade-in-up': 'fadeInUp 0.6s ease both',
                'scan': 'scan 3s linear infinite',
            },
            keyframes: {
                float: {
                    '0%,100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-12px)' },
                },
                'pulse-dot': {
                    '0%,100%': { opacity: '1', transform: 'scale(1)' },
                    '50%': { opacity: '0.6', transform: 'scale(1.3)' },
                },
                fadeInUp: {
                    from: { opacity: '0', transform: 'translateY(30px)' },
                    to: { opacity: '1', transform: 'translateY(0)' },
                },
                scan: {
                    '0%': { top: '0%' },
                    '100%': { top: '100%' },
                },
            },
            backgroundImage: {
                'grid-pattern':
                    'linear-gradient(rgba(0,245,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,245,255,0.04) 1px, transparent 1px)',
            },
            backgroundSize: { 'grid': '60px 60px' },
            boxShadow: {
                'neon-cyan': '0 0 8px #00f5ff88, 0 0 20px #00f5ff44, 0 0 40px #00f5ff22',
                'neon-green': '0 0 8px #00ff9d88, 0 0 20px #00ff9d44, 0 0 40px #00ff9d22',
                'neon-amber': '0 0 8px #ffb80088, 0 0 20px #ffb80044',
                'neon-red': '0 0 8px #ff3b5c88, 0 0 20px #ff3b5c44',
                'neon-violet': '0 0 8px #7c3aed88, 0 0 20px #7c3aed44',
            },
        },
    },
    plugins: [],
};
