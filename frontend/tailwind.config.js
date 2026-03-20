/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#1E3A5F',
                    50: '#EBF0F5',
                    100: '#D0DCE8',
                    200: '#A1B9D1',
                    300: '#7296BA',
                    400: '#4373A3',
                    500: '#1E3A5F',
                    600: '#182E4C',
                    700: '#122339',
                    800: '#0C1726',
                    900: '#060C13',
                },
                accent: {
                    DEFAULT: '#F97316',
                    50: '#FFF3E8',
                    100: '#FFE5CC',
                    200: '#FFCB99',
                    300: '#FFB166',
                    400: '#FF9733',
                    500: '#F97316',
                    600: '#E05D05',
                    700: '#A84504',
                    800: '#702E03',
                    900: '#381701',
                },
                success: '#22C55E',
                warning: '#EAB308',
                danger: '#EF4444',
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
            animation: {
                'shimmer': 'shimmer 2s infinite linear',
                'float': 'float 3s ease-in-out infinite',
                'slide-up': 'slideUp 0.5s ease-out',
                'slide-down': 'slideDown 0.3s ease-out',
                'fade-in': 'fadeIn 0.5s ease-out',
                'scale-in': 'scaleIn 0.3s ease-out',
            },
            keyframes: {
                shimmer: {
                    '0%': { backgroundPosition: '-200% 0' },
                    '100%': { backgroundPosition: '200% 0' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                slideDown: {
                    '0%': { transform: 'translateY(-10px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                scaleIn: {
                    '0%': { transform: 'scale(0.95)', opacity: '0' },
                    '100%': { transform: 'scale(1)', opacity: '1' },
                },
            },
        },
    },
    plugins: [],
}
