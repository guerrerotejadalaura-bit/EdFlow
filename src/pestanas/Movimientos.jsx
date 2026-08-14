import { useState } from 'react'
import { List, Pencil, X } from 'lucide-react'
import EstadoVacio from '../componentes/EstadoVacio'
import ConfirmacionInline from '../componentes/ConfirmacionInline'
import { formatearEuros, formatearFecha, formatearEtiquetaMes } from '../utilidades/formato'

const ESTILO_INPUT =
  'bg-[#0f1420] border border-[#252b3a] rounded-lg px-3 py-2 text-xs text-white ' +
  'focus:outline-none focus:border-[#4f8ef7]/50'

// Un filtro "activo" con su propia crucecita para sacarlo rápido,
// sin tener que borrar el valor a mano.
function CampoFiltro({ activo, alQuitar, children }) {
  return (
    <div className="relative">
      {children}
      {activo && (
        <button
          onClick={alQuitar}
          className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[#f87171] text-white
                     flex items-center justify-center text-[10px] hover:bg-[#f87171]/80"
          title="Quitar este filtro"
        >
          ✕
        </button>
      )}
    </div>
  )
}

export default function Movimientos({
  movimientos,
  cuentas,
  categorias,
  abrirNuevoMovimiento,
  abrirEdicionMovimiento,
  eliminarMovimiento,
  eliminarVariosMovimientos,
  abrirNuevoTraspaso,
  abrirAjusteSaldos,
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
  // "todos" | "entradas" | "salidas" — se activa tocando las cajitas de totales.
  const [signoFiltro, setSignoFiltro] = useState('todos')

  const [confirmarEliminarId, setConfirmarEliminarId] = useState(null)
  const [confirmarEliminarSeleccion, setConfirmarEliminarSeleccion] = useState(false)
  const [seleccionados, setSeleccionados] = useState(new Set())

  const hayFiltrosActivos =
    textoBusqueda || mesFiltro !== 'todos' || cuentaFiltro !== 'todas' || categoriaFiltro !== 'todas' ||
    fechaDesde || fechaHasta || signoFiltro !== 'todos'

  const quitarTodosLosFiltros = () => {
    setTextoBusqueda('')
    setMesFiltro('todos')
    setCuentaFiltro('todas')
    setCategoriaFiltro('todas')
    setFechaDesde('')
    setFechaHasta('')
    setSignoFiltro('todos')
  }

  const mesesDisponibles = [...new Set(movimientos.map((m) => m.fecha.slice(0, 7)))].sort()
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
      if (signoFiltro === 'entradas' && m.importe < 0) return false
      if (signoFiltro === 'salidas' && m.importe >= 0) return false
      return true
    })
    .sort((a, b) => a.fecha.localeCompare(b.fecha))

  // Los totales de entradas/salidas se calculan SIEMPRE sobre todo lo
  // filtrado por los demás campos, sin importar el filtro de signo
  // (así, aunque estés viendo solo "salidas", la cajita de "entradas"
  // te sigue mostrando cuánto sumarían).
  const movimientosParaTotales = movimientos.filter((m) => {
    if (textoBusqueda && !m.concepto.toLowerCase().includes(textoBusqueda.toLowerCase())) return false
    if (mesFiltro !== 'todos' && !m.fecha.startsWith(mesFiltro)) return false
    if (cuentaFiltro !== 'todas' && m.cuenta_id !== cuentaFiltro) return false
    if (categoriaFiltro !== 'todas' && m.categoria !== categoriaFiltro) return false
    if (fechaDesde && m.fecha < fechaDesde) return false
    if (fechaHasta && m.fecha > fechaHasta) return false
    return true
  })
  const entradas = movimientosParaTotales.filter((m) => m.importe > 0).reduce((s, m) => s + m.importe, 0)
  const salidas = movimientosParaTotales.filter((m) => m.importe < 0).reduce((s, m) => s + m.importe, 0)

  // ── Selección múltiple ──────────────────────────────────────
  const todosSeleccionados = movimientosFiltrados.length > 0 && movimientosFiltrados.every((m) => seleccionados.has(m.id))

  const toggleSeleccionarTodos = () => {
    if (todosSeleccionados) {
      setSeleccionados(new Set())
    } else {
      setSeleccionados(new Set(movimientosFiltrados.map((m) => m.id)))
    }
  }

  const toggleSeleccionarUno = (id) => {
    const nuevo = new Set(seleccionados)
    if (nuevo.has(id)) nuevo.delete(id)
    else nuevo.add(id)
    setSeleccionados(nuevo)
  }

  const alEliminarSeleccion = () => {
    eliminarVariosMovimientos([...seleccionados])
    setSeleccionados(new Set())
    setConfirmarEliminarSeleccion(false)
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
          onClick={abrirAjusteSaldos}
          className="border border-[#fbbf24]/40 text-[#fbbf24] hover:bg-[#fbbf24]/10 text-xs rounded-lg px-4 py-2"
        >
          ↺ Ajustar saldos
        </button>
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
          <CampoFiltro activo={!!textoBusqueda} alQuitar={() => setTextoBusqueda('')}>
            <input
              type="text"
              value={textoBusqueda}
              onChange={(e) => setTextoBusqueda(e.target.value)}
              placeholder="🔍 Buscar concepto..."
              className={`${ESTILO_INPUT} w-full`}
            />
          </CampoFiltro>
          <CampoFiltro activo={mesFiltro !== 'todos'} alQuitar={() => setMesFiltro('todos')}>
            <select value={mesFiltro} onChange={(e) => setMesFiltro(e.target.value)} className={`${ESTILO_INPUT} w-full`}>
              <option value="todos">Todos los meses</option>
              {mesesDisponibles.map((m) => (
                <option key={m} value={m}>{formatearEtiquetaMes(m)}</option>
              ))}
            </select>
          </CampoFiltro>
          <CampoFiltro activo={cuentaFiltro !== 'todas'} alQuitar={() => setCuentaFiltro('todas')}>
            <select value={cuentaFiltro} onChange={(e) => setCuentaFiltro(e.target.value)} className={`${ESTILO_INPUT} w-full`}>
              <option value="todas">Todas las cuentas</option>
              {cuentas.map((c) => (
                <option key={c.id} value={c.id}>{c.nombre}</option>
              ))}
            </select>
          </CampoFiltro>
          <CampoFiltro activo={categoriaFiltro !== 'todas'} alQuitar={() => setCategoriaFiltro('todas')}>
            <select value={categoriaFiltro} onChange={(e) => setCategoriaFiltro(e.target.value)} className={`${ESTILO_INPUT} w-full`}>
              <option value="todas">Todas las categorías</option>
              {categorias.map((c) => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </select>
          </CampoFiltro>
        </div>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <span className="text-xs text-[#94a3b8]">Entre fechas:</span>
            <CampoFiltro activo={!!fechaDesde} alQuitar={() => setFechaDesde('')}>
              <input type="date" value={fechaDesde} onChange={(e) => setFechaDesde(e.target.value)} className={ESTILO_INPUT} />
            </CampoFiltro>
            <span className="text-[#64748b]">→</span>
            <CampoFiltro activo={!!fechaHasta} alQuitar={() => setFechaHasta('')}>
              <input type="date" value={fechaHasta} onChange={(e) => setFechaHasta(e.target.value)} className={ESTILO_INPUT} />
            </CampoFiltro>
            <span className="text-xs text-[#64748b] bg-[#0f1420] border border-[#252b3a] rounded-full px-3 py-1">
              {movimientosFiltrados.length} movimiento{movimientosFiltrados.length !== 1 && 's'}
            </span>
          </div>

          {/* ── Quitar TODOS los filtros de una ── */}
          {hayFiltrosActivos && (
            <button
              onClick={quitarTodosLosFiltros}
              className="flex items-center gap-1 text-xs text-[#f87171] hover:underline"
            >
              <X size={13} /> Quitar todos los filtros
            </button>
          )}
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
          {/* ── Totales: ahora son botones que filtran ── */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSignoFiltro(signoFiltro === 'entradas' ? 'todos' : 'entradas')}
              className={`text-xs rounded-lg px-4 py-2 font-medium border transition-colors ${
                signoFiltro === 'entradas'
                  ? 'bg-[#34d399] text-[#0d0f14] border-[#34d399]'
                  : 'bg-[#34d399]/10 text-[#34d399] border-transparent hover:border-[#34d399]/40'
              }`}
            >
              Entradas {formatearEuros(entradas)}
            </button>
            <button
              onClick={() => setSignoFiltro(signoFiltro === 'salidas' ? 'todos' : 'salidas')}
              className={`text-xs rounded-lg px-4 py-2 font-medium border transition-colors ${
                signoFiltro === 'salidas'
                  ? 'bg-[#f87171] text-[#0d0f14] border-[#f87171]'
                  : 'bg-[#f87171]/10 text-[#f87171] border-transparent hover:border-[#f87171]/40'
              }`}
            >
              Salidas {formatearEuros(salidas)}
            </button>

            {/* ── Acción en lote: aparece solo si hay algo seleccionado ── */}
            {seleccionados.size > 0 && (
              <div className="ml-auto flex items-center gap-2">
                <span className="text-xs text-[#94a3b8]">{seleccionados.size} seleccionado(s)</span>
                {confirmarEliminarSeleccion ? (
                  <ConfirmacionInline onConfirmar={alEliminarSeleccion} onCancelar={() => setConfirmarEliminarSeleccion(false)} />
                ) : (
                  <button
                    onClick={() => setConfirmarEliminarSeleccion(true)}
                    className="text-xs text-[#f87171] border border-[#f87171]/40 hover:bg-[#f87171]/10 rounded-lg px-3 py-2"
                  >
                    Eliminar seleccionados
                  </button>
                )}
              </div>
            )}
          </div>

          {/* ── Tabla ── */}
          <div className="bg-[#171b2a] border border-[#2d3553] rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#2d3553] text-left">
                  <th className="px-4 py-3 w-8">
                    <input type="checkbox" checked={todosSeleccionados} onChange={toggleSeleccionarTodos} />
                  </th>
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
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={seleccionados.has(mov.id)}
                          onChange={() => toggleSeleccionarUno(mov.id)}
                        />
                      </td>
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
                      <td className={`px-4 py-3 text-right font-medium ${mov.importe >= 0 ? 'text-[#34d399]' : 'text-[#f87171]'}`}>
                        {formatearEuros(mov.importe)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => abrirEdicionMovimiento(mov)} className="text-[#64748b] hover:text-[#4f8ef7]">
                            <Pencil size={13} />
                          </button>
                          {confirmarEliminarId === mov.id ? (
                            <ConfirmacionInline
                              onConfirmar={() => { eliminarMovimiento(mov.id); setConfirmarEliminarId(null) }}
                              onCancelar={() => setConfirmarEliminarId(null)}
                            />
                          ) : (
                            <button onClick={() => setConfirmarEliminarId(mov.id)} className="text-[#64748b] hover:text-[#f87171]">
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
