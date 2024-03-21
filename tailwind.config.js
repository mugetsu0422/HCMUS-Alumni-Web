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
        '.scrollbar-thin': {
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgb(31 29 29) white ',
        },
        '.scrollbar-webkit': {
          '&::-webkit-scrollbar': {
            width: '8px',
            height: '5px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'white',
          },

          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#000',
            borderRadius: '20px',
            border: '1px solid white',
          },
        },
      }

      addUtilities(newUtilities, ['responsive', 'hover'])
    },
  ],
})
