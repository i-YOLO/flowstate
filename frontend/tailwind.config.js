/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                display: ['Inter', 'sans-serif'],
            },
            colors: {
                primary: '#00f2ff', // Vibrant Cyan (Luminous)
                'primary-dark': '#0891b2',
                'accent-blue': '#3b82f6',
                'accent-purple': '#bc13fe',
                'accent-orange': '#ff8c00',
                'accent-green': '#4ade80',
                'accent-pink': '#f472b6',
                'accent-cyan': '#22d3ee',
                'background-light': '#f6f6f8',
                'background-dark': '#0a0c10', // Deep Dark
                'card-dark': '#161b22',
                'surface-dark': '#161b22',
                'border-dark': '#324467',
            },
            boxShadow: {
                'glow': '0 0 20px -5px rgba(0, 242, 255, 0.5)',
                'glow-card': '0 4px 24px -1px rgba(0, 0, 0, 0.5)',
            },
            keyframes: {
                orbit: {
                    '0%': { transform: 'rotate(0deg)' },
                    '100%': { transform: 'rotate(360deg)' },
                },
                'orbit-reverse': {
                    '0%': { transform: 'rotate(360deg)' },
                    '100%': { transform: 'rotate(0deg)' },
                },
                'ripple-slow': {
                    '0%': { transform: 'scale(1)', opacity: '0.4' },
                    '100%': { transform: 'scale(1.8)', opacity: '0' },
                },
                'breathe': {
                    '0%, 100%': { transform: 'scale(1)', opacity: '0.9' },
                    '50%': { transform: 'scale(1.05)', opacity: '1' },
                },
                'expand-full': {
                    '0%': { transform: 'scale(0.5)', opacity: '0' },
                    '100%': { transform: 'scale(20)', opacity: '1' },
                }
            },
            animation: {
                'orbit-slow': 'orbit 12s linear infinite',
                'orbit-normal': 'orbit 8s linear infinite',
                'orbit-fast': 'orbit 4s linear infinite',
                'orbit-very-slow': 'orbit 20s linear infinite',
                'orbit-reverse-slow': 'orbit-reverse 15s linear infinite',
                'orbit-reverse-normal': 'orbit-reverse 10s linear infinite',
                'orbit-reverse-fast': 'orbit-reverse 6s linear infinite',
                'ripple-1': 'ripple-slow 4s ease-out infinite',
                'ripple-2': 'ripple-slow 4s ease-out infinite 1.3s',
                'ripple-3': 'ripple-slow 4s ease-out infinite 2.6s',
                'breathe-slow': 'breathe 4s ease-in-out infinite',
            },
            transitionTimingFunction: {
                'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
            },
        },
    },
    plugins: [],
}
