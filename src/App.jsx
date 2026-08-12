// Este es el componente principal. Por ahora solo muestra una tarjeta
// de bienvenida con el estilo de Sentiax, para confirmar que el proyecto
// arrancó bien. Después acá vamos a ir armando EdFlow paso a paso.
export default function App() {
  return (
    <div className="min-h-screen bg-[#0d0f14] flex items-center justify-center p-6">
      <div className="bg-[#171b2a] border border-[#2d3553] rounded-xl p-6 max-w-md w-full">
        <h1 className="text-sm font-semibold text-white mb-1">
          🎉 Hola, EdFlow
        </h1>
        <p className="text-xs text-[#94a3b8]">
          Si estás viendo esta tarjeta con fondo oscuro, el proyecto React +
          Vite + Tailwind está funcionando correctamente.
        </p>
      </div>
    </div>
  )
}
