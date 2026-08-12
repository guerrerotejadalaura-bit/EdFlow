// ═══════════════════════════════════════════════════════════
// ESTADO VACÍO
// ═══════════════════════════════════════════════════════════
// Este componente se reutiliza en TODAS las pestañas cuando todavía
// no hay datos cargados (por ejemplo "Sin cuentas configuradas").
// Así evitamos escribir 8 veces el mismo bloque de HTML.
//
// Recibe:
//  - Icono: un ícono de lucide-react (ej. Building2, ListChecks...)
//  - titulo: texto grande, ej. "Sin cuentas configuradas"
//  - subtitulo: texto chico debajo, ej. "Añade tus cuentas bancarias..."
//  - textoBoton: texto del botón (opcional)
//  - alHacerClicBoton: función que se ejecuta al tocar el botón (opcional)
export default function EstadoVacio({ Icono, titulo, subtitulo, textoBoton, alHacerClicBoton }) {
  return (
    <div className="bg-[#171b2a] border border-[#2d3553] rounded-xl p-12 flex flex-col items-center text-center">
      {Icono && (
        <div className="w-12 h-12 rounded-full bg-[#0f1420] border border-[#252b3a] flex items-center justify-center mb-4">
          <Icono size={22} className="text-[#64748b]" />
        </div>
      )}
      <p className="text-sm font-semibold text-[#cbd5e1] mb-1">{titulo}</p>
      {subtitulo && <p className="text-xs text-[#94a3b8] mb-4">{subtitulo}</p>}
      {textoBoton && (
        <button
          onClick={alHacerClicBoton}
          className="bg-[#4f8ef7] hover:bg-[#4f8ef7]/90 text-white text-xs font-medium
                     rounded-lg px-4 py-2 transition-colors"
        >
          {textoBoton}
        </button>
      )}
    </div>
  )
}
