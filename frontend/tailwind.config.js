/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primaryColor: "#F5F5F5",
        darkPrimaryColor: "#1A1D1F",
        grayColor: "#272B30",
        blackColor: "#090909",
        whiteGray: "#ebecf1"
      },
      fontFamily: {
        fontPrimary: ['Poppins', 'sans-serif']
      },
      screens: {
        xs: '375px'
      }, 
      container: {
        center: true
      },
      height: {
        mdhv: '80vh',
        lghv: '90vh'
      },
      aspectRatio: {
        post: '9/16'
      }
    },
  },
  darkMode: 'class',
  plugins: [],
}