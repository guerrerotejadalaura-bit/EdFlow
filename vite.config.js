import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Configuración de Vite: le decimos que use el plugin de React.
// No hace falta tocar nada más acá por ahora.
export default defineConfig({
  plugins: [react()],
})
