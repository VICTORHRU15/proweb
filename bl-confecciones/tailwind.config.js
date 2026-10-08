/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary": "#001428",
        "primary-container": "#0f2942",
        "on-primary": "#ffffff",
        "secondary": "#3d6375",
        "secondary-container": "#bee5fa",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#f2f4f6",
        "surface": "#f7f9fb",
        "on-surface": "#191c1e",
        "on-surface-variant": "#43474d",
        "background": "#f7f9fb"
      },
      fontFamily: {
        "display-hero": ["Outfit", "sans-serif"],
        "headline-lg": ["Outfit", "sans-serif"],
        "headline-md": ["Outfit", "sans-serif"],
        "headline-sm": ["Outfit", "sans-serif"],
        "body-lg": ["Plus Jakarta Sans", "sans-serif"],
        "body-md": ["Plus Jakarta Sans", "sans-serif"],
        "body-sm": ["Plus Jakarta Sans", "sans-serif"],
        "label-lg": ["Plus Jakarta Sans", "sans-serif"],
        "label-md": ["Plus Jakarta Sans", "sans-serif"],
        "label-caption": ["Plus Jakarta Sans", "sans-serif"]
      }
    },
  },
  plugins: [],
}