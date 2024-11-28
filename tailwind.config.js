/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,js}",
    "./node_modules/flowbite/**/*.js"
  ],
  theme: {
    extend: {
      colors: {
        sidebargray: '#151921',
        divider: '#272A32',
        customgreen: '#DDFFBE',
        customgray: '#7A7B83',
        anothercg: '#9A9998'
      },
      keyfrmes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 1s ease-in-out',
      },
    },
  },
  plugins: [
    require('flowbite/plugin')
  ],
}

