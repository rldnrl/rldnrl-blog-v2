/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: "class",
  theme: {
    extend: {
      zIndex: {
        'nav': '10'
      },
      colors: {
        "primary": {
          1: '#00e599'
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require("tailwind-scrollbar-hide")
  ],
}
