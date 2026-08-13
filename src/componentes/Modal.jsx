import { X } from 'lucide-react'

// ═══════════════════════════════════════════════════════════
// MODAL
// ═══════════════════════════════════════════════════════════
// Una ventana flotante que aparece encima de todo, con un fondo oscuro
// semitransparente detrás. La usamos para "Nueva cuenta", "Nueva
// categoría", y cualquier otro formulario chico que necesitemos.
//
// Recibe:
//  - titulo: el texto de arriba de la ventana
//  - cerrar: función que se ejecuta al tocar la X o el fondo
//  - children: el contenido de adentro (el formulario)
export default function Modal({ titulo, cerrar, children }) {
  return (
    // El fondo oscuro semitransparente. Si el usuario hace clic fuera
    // de la tarjeta blanca (justo en el fondo), cerramos el modal.
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50"
      onClick={cerrar}
    >
      {/* stopPropagation evita que un clic DENTRO de la tarjeta la cierre */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-[#171b2a] border border-[#2d3553] rounded-xl p-6 w-full max-w-md"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-white">{titulo}</h3>
          <button onClick={cerrar} className="text-[#64748b] hover:text-white">
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
