/** @type {import('tailwindcss').Config} */
const withMT = require('@material-tailwind/react/utils/withMT')
module.exports = withMT({
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        '.scrollbar-webkit': {
          '&::-webkit-scrollbar': {
            width: '5px',
            height: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#a1a1a1',
            borderRadius: '20px',
          },

          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#055abc',
            borderRadius: '20px',
          },
        },

        '.scrollbar-webkit-main': {
          '&::-webkit-scrollbar': {
            width: '8px',
            height: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#ffffff',
            borderRadius: '20px',
          },

          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#ffffff',
            borderRadius: '20px',
          },
        },
      }

      addUtilities(newUtilities, ['responsive', 'hover'])
    },
  ],
})
