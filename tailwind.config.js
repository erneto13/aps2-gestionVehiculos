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
    },
  },
  plugins: [
    require('flowbite/plugin')
  ],
}

