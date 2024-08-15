/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      minWidth: {
        'mindmap': '850px',
      },
      minHeight: {
        'mindmap': '500px',
      },flexGrow: {
        '2': '2',
        '3': '3',
        '4': '4',
        '5': '5',
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: { // @/util/colors.jsと同期
        "main-dark-color": "#2C3E50", // blue-gray
        "hovor-dark-color": "#1E2B37", // hovor: blue-gray
        
        "theme-color-0": "#ef6565", // blown
        "theme-color-1": "#ff579d", // red
        "theme-color-2": "#7c66ff", // purple
        "theme-color-3": "#23c9ad", // turquoise
        "theme-color-4": "#ffb703", // yellow
        "theme-color-5": "#ff834d", // orange
        "theme-color-6": "#97d342", // green
        "theme-color-7": "#5cbdf2", // blue
        "done-color-bg": "#e1dfdf", // gray for a back ground of node which is done
        "done-color-text": "#767171", // gray for a text of node which is done
      },
    },
  },
  plugins: [],
};
