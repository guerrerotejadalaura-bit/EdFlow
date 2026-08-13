import { useState } from 'react'
import { Landmark, ArrowUp, ArrowDown, ArrowLeftRight } from 'lucide-react'
import EstadoVacio from '../componentes/EstadoVacio'
import ModalCuenta from '../componentes/ModalCuenta'
import ModalCategoria from '../componentes/ModalCategoria'
import { formatearEuros } from '../utilidades/formato'

const ESTILO_INPUT =
  'w-full bg-[#0f1420] border border-[#252b3a] rounded-lg px-3 py-2 text-sm text-white ' +
  'focus:outline-none focus:border-[#4f8ef7]/50'
const ESTILO_LABEL = 'text-xs text-[#94a3b8] block mb-1'

// Un pequeño ícono según el signo de la categoría (ingreso/gasto/neutro).
function IconoSigno({ signo }) {
  if (signo === 'ingreso') return <ArrowUp size={11} className="text-[#34d399]" />
  if (signo === 'gasto') return <ArrowDown size={11} className="text-[#f87171]" />
  return <ArrowLeftRight size={11} className="text-[#94a3b8]" />
}

export default function Configuracion({
  config,
  guardarConfigEmpresa,
  cuentas,
  agregarCuenta,
  editarCuenta,
  eliminarCuenta,
  toggleActivaCuenta,
  categorias,
  agregarCategoria,
  eliminarCategoria,
  borrarTodo,
}) {
  // ── Datos de empresa: usamos un "borrador" local, y recién lo
  // guardamos de verdad cuando el usuario toca "Guardar datos". ──
  const [borrador, setBorrador] = useState(config)
  const cambiarBorrador = (campo, valor) => setBorrador({ ...borrador, [campo]: valor })

  // ── Modales: cuál está abierto ahora mismo (o ninguno) ──
  const [modalCuentaAbierto, setModalCuentaAbierto] = useState(false)
  const [cuentaEnEdicion, setCuentaEnEdicion] = useState(null)
  const [modalCategoriaAbierto, setModalCategoriaAbierto] = useState(false)

  const abrirNuevaCuenta = () => {
    setCuentaEnEdicion(null)
    setModalCuentaAbierto(true)
  }
  const abrirEdicionCuenta = (cuenta) => {
    setCuentaEnEdicion(cuenta)
    setModalCuentaAbierto(true)
  }
  const alGuardarCuenta = (datosCuenta) => {
    if (cuentaEnEdicion) {
      editarCuenta(cuentaEnEdicion.id, datosCuenta)
    } else {
      agregarCuenta(datosCuenta)
    }
    setModalCuentaAbierto(false)
  }

  const alEliminarCuenta = (cuenta) => {
    if (confirm(`¿Eliminar la cuenta "${cuenta.nombre}"? Esta acción no se puede deshacer.`)) {
      eliminarCuenta(cuenta.id)
    }
  }

  const alGuardarCategoria = (datosCategoria) => {
    agregarCategoria(datosCategoria)
    setModalCategoriaAbierto(false)
  }

  const alEliminarCategoria = (categoria) => {
    if (confirm(`¿Eliminar la categoría "${categoria.label}"?`)) {
      eliminarCategoria(categoria.id)
    }
  }

  const alBorrarTodo = () => {
    if (confirm('¿Borrar TODOS los datos (cuentas, movimientos, categorías)? Esta acción no se puede deshacer.')) {
      borrarTodo()
    }
  }

  return (
    <div className="space-y-6">

      {/* ── Datos de la empresa ── */}
      <div className="bg-[#171b2a] border border-[#2d3553] rounded-xl p-6">
        <h3 className="text-xs font-semibold text-[#94a3b8] mb-4 tracking-wide">DATOS DE LA EMPRESA</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className={ESTILO_LABEL}>Nombre de la empresa *</label>
            <input
              type="text"
              value={borrador.empresa}
              onChange={(e) => cambiarBorrador('empresa', e.target.value)}
              placeholder="Ej: Wekolf Junior SL"
              className={ESTILO_INPUT}
            />
          </div>
          <div>
            <label className={ESTILO_LABEL}>Sector</label>
            <input
              type="text"
              value={borrador.sector}
              onChange={(e) => cambiarBorrador('sector', e.target.value)}
              placeholder="Golf, Moda, Retail..."
              className={ESTILO_INPUT}
            />
          </div>
        </div>
        <div className="mb-4">
          <label className={ESTILO_LABEL}>Notas internas</label>
          <textarea
            value={borrador.notas}
            onChange={(e) => cambiarBorrador('notas', e.target.value)}
            placeholder="Observaciones..."
            rows={3}
            className={ESTILO_INPUT}
          />
        </div>
        <div className="flex justify-end">
          <button
            onClick={() => guardarConfigEmpresa(borrador)}
            className="bg-[#4f8ef7] hover:bg-[#4f8ef7]/90 text-white text-xs font-medium rounded-lg px-4 py-2"
          >
            Guardar datos
          </button>
        </div>
      </div>

      {/* ── Cuentas bancarias ── */}
      <div className="bg-[#171b2a] border border-[#2d3553] rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-semibold text-[#94a3b8] tracking-wide">CUENTAS BANCARIAS</h3>
          <button
            onClick={abrirNuevaCuenta}
            className="bg-[#4f8ef7] hover:bg-[#4f8ef7]/90 text-white text-xs font-medium rounded-lg px-4 py-2"
          >
            + Añadir cuenta
          </button>
        </div>

        {cuentas.length === 0 ? (
          <EstadoVacio Icono={Landmark} titulo="Sin cuentas" subtitulo="Añadí la primera." />
        ) : (
          <div className="space-y-2">
            {cuentas.map((cuenta) => (
              <div
                key={cuenta.id}
                className="flex items-center justify-between bg-[#0f1420] border border-[#252b3a] rounded-lg px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cuenta.color }} />
                  <div>
                    <p className="text-sm text-white">{cuenta.nombre}</p>
                    <p className="text-xs text-[#64748b]">
                      {cuenta.entidad} · {cuenta.tipo === 'poliza' ? 'Póliza de crédito' : 'Corriente'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-white">{formatearEuros(cuenta.saldo)}</span>
                  <span
                    className={`text-[10px] rounded-full px-2 py-0.5 ${
                      cuenta.activa ? 'bg-[#34d399]/15 text-[#34d399]' : 'bg-[#64748b]/15 text-[#64748b]'
                    }`}
                  >
                    {cuenta.activa ? 'Activa' : 'Inactiva'}
                  </span>
                  <button
                    onClick={() => toggleActivaCuenta(cuenta.id)}
                    className="text-xs text-[#94a3b8] hover:text-white"
                  >
                    {cuenta.activa ? 'Desactivar' : 'Activar'}
                  </button>
                  <button
                    onClick={() => abrirEdicionCuenta(cuenta)}
                    className="text-xs text-[#94a3b8] hover:text-white border border-[#252b3a] rounded-lg px-3 py-1"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => alEliminarCuenta(cuenta)}
                    className="text-[#64748b] hover:text-[#f87171]"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Categorías ── */}
      <div className="bg-[#171b2a] border border-[#2d3553] rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-semibold text-[#94a3b8] tracking-wide">CATEGORÍAS DE MOVIMIENTOS</h3>
          <button
            onClick={() => setModalCategoriaAbierto(true)}
            className="bg-[#4f8ef7] hover:bg-[#4f8ef7]/90 text-white text-xs font-medium rounded-lg px-4 py-2"
          >
            + Nueva categoría
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {categorias.map((cat) => (
            <span
              key={cat.id}
              className="text-xs text-[#cbd5e1] bg-[#0f1420] border border-[#252b3a] rounded-full pl-3 pr-2 py-1 flex items-center gap-2"
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
              {cat.label}
              <span className="w-4 h-4 rounded-full bg-[#171b2a] flex items-center justify-center">
                <IconoSigno signo={cat.signo} />
              </span>
              <button onClick={() => alEliminarCategoria(cat)} className="text-[#64748b] hover:text-[#f87171] ml-1">
                ✕
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* ── Zona de datos ── */}
      <div className="bg-[#171b2a] border border-[#2d3553] rounded-xl p-6 flex items-center justify-between">
        <div>
          <h3 className="text-xs font-semibold text-[#94a3b8] tracking-wide mb-1">ZONA DE DATOS</h3>
          <p className="text-xs text-[#64748b]">
            Los datos se guardan automáticamente en este navegador. Exportá un JSON de respaldo periódicamente.
          </p>
        </div>
        <button
          onClick={alBorrarTodo}
          className="text-xs text-[#f87171] border border-[#f87171]/40 hover:bg-[#f87171]/10 rounded-lg px-4 py-2 shrink-0"
        >
          Borrar todos los datos
        </button>
      </div>

      {/* ── Modales (solo se muestran si están "abiertos") ── */}
      {modalCuentaAbierto && (
        <ModalCuenta
          cuentaExistente={cuentaEnEdicion}
          guardar={alGuardarCuenta}
          cerrar={() => setModalCuentaAbierto(false)}
        />
      )}
      {modalCategoriaAbierto && (
        <ModalCategoria guardar={alGuardarCategoria} cerrar={() => setModalCategoriaAbierto(false)} />
      )}
    </div>
  )
}
