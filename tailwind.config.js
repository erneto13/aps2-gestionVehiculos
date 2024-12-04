module.exports = {
  content: [
    "./src/**/*.{html,js,ts}",
    "./node_modules/flowbite/**/*.js",
  ],
  theme: {
    extend: {
      colors: {
        sidebargray: '#151921',
        divider: '#272A32',
        customgreen: '#DDFFBE',
        customgray: '#7A7B83',
        anothercg: '#9A9998',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeOut: {
          '0%': { opacity: '1', transform: 'translateY(0)' },
          '100%': { opacity: '0', transform: 'translateY(10px)' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.5s ease-in-out',
        fadeOut: 'fadeOut 0.5s ease-in-out',
      },
    },
  },
  plugins: [
    require('flowbite/plugin'),
  ],
};
