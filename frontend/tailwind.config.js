/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './public/index.html',        // Adjust this path if your HTML files are in a different directory
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        customPurple: '#A585FF'
      },
    },
  },
  plugins: [],
};
