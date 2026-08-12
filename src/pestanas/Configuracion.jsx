import { Landmark } from 'lucide-react'
import EstadoVacio from '../componentes/EstadoVacio'

// Esta pestaña ya es parcialmente funcional: el nombre de la empresa
// se puede editar y se guarda. Las cuentas todavía no (eso es el
// próximo paso). Las categorías se muestran de solo lectura por ahora.
export default function Configuracion({ config, cambiarNombreEmpresa, cuentas, categorias }) {
  return (
    <div className="space-y-6">

      {/* ── Datos de la empresa ── */}
      <div className="bg-[#171b2a] border border-[#2d3553] rounded-xl p-6">
        <h3 className="text-sm font-semibold text-white mb-4">Datos de la empresa</h3>
        <label className="text-xs text-[#94a3b8] block mb-1">Nombre de la empresa</label>
        <input
          type="text"
          value={config.empresa}
          onChange={(e) => cambiarNombreEmpresa(e.target.value)}
          placeholder="Ej: Wekolf Junior SL"
          className="w-full max-w-md bg-[#0f1420] border border-[#252b3a] rounded-lg px-3 py-2
                     text-sm text-white
                     focus:outline-none focus:border-[#4f8ef7]/50"
        />
      </div>

      {/* ── Cuentas bancarias (placeholder, el CRUD viene en el próximo paso) ── */}
      <div className="bg-[#171b2a] border border-[#2d3553] rounded-xl p-6">
        <h3 className="text-sm font-semibold text-white mb-4">Cuentas bancarias</h3>
        {cuentas.length === 0 ? (
          <EstadoVacio
            Icono={Landmark}
            titulo="Sin cuentas"
            subtitulo="Añadí la primera en el próximo paso."
          />
        ) : (
          <p className="text-sm text-[#94a3b8]">{cuentas.length} cuenta(s) cargada(s).</p>
        )}
      </div>

      {/* ── Categorías (de solo lectura por ahora) ── */}
      <div className="bg-[#171b2a] border border-[#2d3553] rounded-xl p-6">
        <h3 className="text-sm font-semibold text-white mb-4">Categorías de movimientos</h3>
        <div className="flex flex-wrap gap-2">
          {categorias.map((cat) => (
            <span
              key={cat.id}
              className="text-xs text-[#cbd5e1] bg-[#0f1420] border border-[#252b3a] rounded-full px-3 py-1 flex items-center gap-2"
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
              {cat.label}
            </span>
          ))}
        </div>
      </div>

    </div>
  )
}
