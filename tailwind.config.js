const defaultTheme = require('tailwindcss/defaultTheme')
const colors = require('tailwindcss/colors')
import config from './node_modules/pilgrim-theme/tailwind.config.js'

/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [
    require('./node_modules/pilgrim-theme/tailwind.config.js')
  ],
  
  content: [
    ...config.content,
    './.vitepress/theme/**/*.{vue,js,ts,jsx,tsx}',
  ]
}
