/** @type {import('tailwindcss').Config} */
export default {
  // "content" le dice a Tailwind en qué archivos buscar clases usadas,
  // para generar solo el CSS que realmente necesitamos.
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
