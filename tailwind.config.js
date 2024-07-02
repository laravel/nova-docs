import defaultTheme from 'tailwindcss/defaultTheme'
import tailwindConfig from '@hempworks/pilgrim/tailwind.config'

const primary = {
    500: '#0ea5e9',
}

/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',

    presets: [
        tailwindConfig,
    ],

    content: [
        ...tailwindConfig.content,
        './.vitepress/theme/**/*.{vue,js,ts,jsx,tsx}',
        './src/**/*.{md,svg}',
    ],

    theme: {
        extend: {
            colors: { primary },
            fontFamily: {
                sans: ['Nunito Sans', ...defaultTheme.fontFamily.sans],
            },
        },
    },
}
