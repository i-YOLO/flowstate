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
            }
        },
    },
    plugins: [],
}
