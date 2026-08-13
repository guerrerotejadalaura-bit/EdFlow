import { Undo2 } from 'lucide-react'

// ═══════════════════════════════════════════════════════════
// AVISO DESHACER
// ═══════════════════════════════════════════════════════════
// Un cartelito que aparece abajo de la pantalla después de borrar
// algo, con un botón "Deshacer". Vive unos segundos y después
// desaparece solo (el temporizador lo maneja App.jsx).
export default function AvisoDeshacer({ mensaje, onDeshacer }) {
  return (
    <div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50
                 bg-[#171b2a] border border-[#2d3553] rounded-xl
                 px-4 py-3 shadow-lg flex items-center gap-4"
    >
      <span className="text-sm text-[#cbd5e1]">{mensaje}</span>
      <button
        onClick={onDeshacer}
        className="flex items-center gap-1.5 text-sm text-[#4f8ef7] font-medium hover:underline"
      >
        <Undo2 size={14} />
        Deshacer
      </button>
    </div>
  )
}
