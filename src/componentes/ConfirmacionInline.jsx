// ═══════════════════════════════════════════════════════════
// CONFIRMACIÓN INLINE
// ═══════════════════════════════════════════════════════════
// En vez de usar el cartel feo de confirm() del navegador, mostramos
// "Sí" / "No" en el mismo lugar donde estaba el botón de borrar.
// Se usa así: el componente que la usa guarda en su estado CUÁL
// elemento está "pidiendo confirmación" (por ejemplo, el id de una
// cuenta), y mientras ese id esté activo, en vez del botón "✕" se
// muestra este componente.
export default function ConfirmacionInline({ onConfirmar, onCancelar }) {
  return (
    <span className="flex items-center gap-2">
      <button
        onClick={onConfirmar}
        className="text-xs text-[#f87171] font-medium hover:underline"
      >
        Sí
      </button>
      <button
        onClick={onCancelar}
        className="text-xs text-[#94a3b8] hover:underline"
      >
        No
      </button>
    </span>
  )
}
