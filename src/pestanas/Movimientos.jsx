import { useState } from 'react'
import { List, Pencil } from 'lucide-react'
import EstadoVacio from '../componentes/EstadoVacio'
import ConfirmacionInline from '../componentes/ConfirmacionInline'
import { formatearEuros, formatearFecha, formatearEtiquetaMes } from '../utilidades/formato'

const ESTILO_INPUT =
  'bg-[#0f1420] border border-[#252b3a] rounded-lg px-3 py-2 text-xs text-white ' +
  'focus:outline-none focus:border-[#4f8ef7]/50'

export default function Movimientos({
  movimientos,
  cuentas,
  categorias,
  abrirNuevoMovimiento,
  abrirEdicionMovimiento,
  eliminarMovimiento,
  abrirNuevoTraspaso,
  aviso,
  alDeshacer,
}) {
  // ── Filtros ──────────────────────────────────────────────────
  const [textoBusqueda, setTextoBusqueda] = useState('')
  const [mesFiltro, setMesFiltro] = useState('todos')
  const [cuentaFiltro, setCuentaFiltro] = useState('todas')
  const [categoriaFiltro, setCategoriaFiltro] = useState('todas')
  const [fechaDesde, setFechaDesde] = useState('')
  const [fechaHasta, setFechaHasta] = useState('')

  const [confirmarEliminarId, setConfirmarEliminarId] = useState(null)

  // Meses que realmente aparecen en los movimientos, para el desplegable.
  const mesesDisponibles = [...new Set(movimientos.map((m) => m.fecha.slice(0, 7)))].sort()

  // Buscamos el objeto categoría/cuenta completo a partir del id guardado
  // en el movimiento (así sacamos su nombre y color para pintarlo).
  const buscarCategoria = (id) => categorias.find((c) => c.id === id)
  const buscarCuenta = (id) => cuentas.find((c) => c.id === id)

  const movimientosFiltrados = movimientos
    .filter((m) => {
      if (textoBusqueda && !m.concepto.toLowerCase().includes(textoBusqueda.toLowerCase())) return false
      if (mesFiltro !== 'todos' && !m.fecha.startsWith(mesFiltro)) return false
      if (cuentaFiltro !== 'todas' && m.cuenta_id !== cuentaFiltro) return false
      if (categoriaFiltro !== 'todas' && m.categoria !== categoriaFiltro) return false
      if (fechaDesde && m.fecha < fechaDesde) return false
      if (fechaHasta && m.fecha > fechaHasta) return false
      return true
    })
    .sort((a, b) => a.fecha.localeCompare(b.fecha))

  const entradas = movimientosFiltrados.filter((m) => m.importe > 0).reduce((s, m) => s + m.importe, 0)
  const salidas = movimientosFiltrados.filter((m) => m.importe < 0).reduce((s, m) => s + m.importe, 0)

  const alEliminar = (id) => {
    eliminarMovimiento(id)
    setConfirmarEliminarId(null)
  }

  return (
    <div className="space-y-4">

      {/* ── Botones de arriba ── */}
      <div className="flex justify-end gap-2">
        {aviso?.tipo === 'movimiento' && (
          <button
            onClick={alDeshacer}
            className="text-xs text-[#4f8ef7] font-medium bg-[#4f8ef7]/10 border border-[#4f8ef7]/30 rounded-lg px-3 py-2"
          >
            ↺ {aviso.mensaje}
          </button>
        )}
        <button
          onClick={abrirNuevoTraspaso}
          className="border border-[#2d3553] text-[#cbd5e1] hover:bg-[#171b2a] text-xs rounded-lg px-4 py-2"
        >
          ⇄ Traspaso
        </button>
        <button
          onClick={abrirNuevoMovimiento}
          className="bg-[#34d399] hover:bg-[#34d399]/90 text-[#0d0f14] text-xs font-medium rounded-lg px-4 py-2"
        >
          + Nuevo movimiento
        </button>
      </div>

      {/* ── Filtros ── */}
      <div className="bg-[#171b2a] border border-[#2d3553] rounded-xl p-4 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <input
            type="text"
            value={textoBusqueda}
            onChange={(e) => setTextoBusqueda(e.target.value)}
            placeholder="🔍 Buscar concepto..."
            className={ESTILO_INPUT}
          />
          <select value={mesFiltro} onChange={(e) => setMesFiltro(e.target.value)} className={ESTILO_INPUT}>
            <option value="todos">Todos los meses</option>
            {mesesDisponibles.map((m) => (
              <option key={m} value={m}>{formatearEtiquetaMes(m)}</option>
            ))}
          </select>
          <select value={cuentaFiltro} onChange={(e) => setCuentaFiltro(e.target.value)} className={ESTILO_INPUT}>
            <option value="todas">Todas las cuentas</option>
            {cuentas.map((c) => (
              <option key={c.id} value={c.id}>{c.nombre}</option>
            ))}
          </select>
          <select value={categoriaFiltro} onChange={(e) => setCategoriaFiltro(e.target.value)} className={ESTILO_INPUT}>
            <option value="todas">Todas las categorías</option>
            {categorias.map((c) => (
              <option key={c.id} value={c.id}>{c.label}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-[#94a3b8]">Entre fechas:</span>
          <input type="date" value={fechaDesde} onChange={(e) => setFechaDesde(e.target.value)} className={ESTILO_INPUT} />
          <span className="text-[#64748b]">→</span>
          <input type="date" value={fechaHasta} onChange={(e) => setFechaHasta(e.target.value)} className={ESTILO_INPUT} />
          <span className="text-xs text-[#64748b] bg-[#0f1420] border border-[#252b3a] rounded-full px-3 py-1">
            {movimientosFiltrados.length} movimiento{movimientosFiltrados.length !== 1 && 's'}
          </span>
        </div>
      </div>

      {movimientos.length === 0 ? (
        <EstadoVacio
          Icono={List}
          titulo="Sin movimientos"
          subtitulo="Añadí tu primer movimiento de tesorería."
          textoBoton="+ Nuevo movimiento"
          alHacerClicBoton={abrirNuevoMovimiento}
        />
      ) : (
        <>
          {/* ── Totales ── */}
          <div className="flex gap-3">
            <span className="text-xs bg-[#34d399]/10 text-[#34d399] rounded-lg px-4 py-2 font-medium">
              Entradas {formatearEuros(entradas)}
            </span>
            <span className="text-xs bg-[#f87171]/10 text-[#f87171] rounded-lg px-4 py-2 font-medium">
              Salidas {formatearEuros(salidas)}
            </span>
          </div>

          {/* ── Tabla ── */}
          <div className="bg-[#171b2a] border border-[#2d3553] rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#2d3553] text-left">
                  <th className="px-4 py-3 text-xs text-[#94a3b8] font-medium">Fecha</th>
                  <th className="px-4 py-3 text-xs text-[#94a3b8] font-medium">Concepto</th>
                  <th className="px-4 py-3 text-xs text-[#94a3b8] font-medium">Categoría</th>
                  <th className="px-4 py-3 text-xs text-[#94a3b8] font-medium">Cuenta</th>
                  <th className="px-4 py-3 text-xs text-[#94a3b8] font-medium text-right">Importe</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {movimientosFiltrados.map((mov) => {
                  const categoria = buscarCategoria(mov.categoria)
                  const cuenta = buscarCuenta(mov.cuenta_id)
                  return (
                    <tr key={mov.id} className="border-b border-[#252b3a] last:border-0">
                      <td className="px-4 py-3 text-[#cbd5e1]">{formatearFecha(mov.fecha)}</td>
                      <td className="px-4 py-3 text-white">{mov.concepto}</td>
                      <td className="px-4 py-3">
                        {categoria && (
                          <span
                            className="text-xs rounded-full px-2 py-0.5"
                            style={{ backgroundColor: categoria.color + '22', color: categoria.color }}
                          >
                            {categoria.label}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {cuenta && (
                          <span className="flex items-center gap-1.5 text-[#cbd5e1] text-xs">
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cuenta.color }} />
                            {cuenta.nombre}
                          </span>
                        )}
                      </td>
                      <td
                        className={`px-4 py-3 text-right font-medium ${
                          mov.importe >= 0 ? 'text-[#34d399]' : 'text-[#f87171]'
                        }`}
                      >
                        {formatearEuros(mov.importe)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => abrirEdicionMovimiento(mov)}
                            className="text-[#64748b] hover:text-[#4f8ef7]"
                          >
                            <Pencil size={13} />
                          </button>
                          {confirmarEliminarId === mov.id ? (
                            <ConfirmacionInline
                              onConfirmar={() => alEliminar(mov.id)}
                              onCancelar={() => setConfirmarEliminarId(null)}
                            />
                          ) : (
                            <button
                              onClick={() => setConfirmarEliminarId(mov.id)}
                              className="text-[#64748b] hover:text-[#f87171]"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}
