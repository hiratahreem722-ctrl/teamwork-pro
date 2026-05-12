import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.tsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', ...defaultTheme.fontFamily.sans],
                mono: ['JetBrains Mono', ...defaultTheme.fontFamily.mono],
            },
            colors: {
                brand: {
                    900: '#1E3A5F',
                    700: '#1E4D8C',
                    600: '#2563EB',
                    400: '#0EA5E9',
                    100: '#DBEAFE',
                },
                surface: '#F1F5F9',
                card: '#FFFFFF',
                kanban: {
                    backlog:  '#E2E8F0',
                    progress: '#DBEAFE',
                    review:   '#FEF3C7',
                    done:     '#DCFCE7',
                },
            },
            borderRadius: {
                card: '0.75rem',
                btn:  '0.5rem',
            },
        },
    },

    plugins: [forms],
};
