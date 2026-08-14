import { useState } from 'react'
import { Landmark } from 'lucide-react'
import EstadoVacio from '../componentes/EstadoVacio'
import ConfirmacionInline from '../componentes/ConfirmacionInline'
import { calcularDeudaTotal, calcularCuotaMensualTotal } from '../datos/calculos'
import { formatearEuros } from '../utilidades/formato'

export default function PoolBancario({
  cuentas,
  financiaciones,
  abrirNuevaFinanciacion,
  abrirEdicionFinanciacion,
  eliminarFinanciacion,
  aviso,
  alDeshacer,
}) {
  const [confirmarEliminarId, setConfirmarEliminarId] = useState(null)

  const deudaTotal = calcularDeudaTotal(financiaciones)
  const cuotaMensualTotal = calcularCuotaMensualTotal(financiaciones)

  const buscarCuenta = (id) => cuentas.find((c) => c.id === id)

  return (
    <div className="space-y-6">

      {/* ── Botón de arriba ── */}
      <div className="flex justify-end gap-2">
        {aviso?.tipo === 'financiacion' && (
          <button
            onClick={alDeshacer}
            className="text-xs text-[#4f8ef7] font-medium bg-[#4f8ef7]/10 border border-[#4f8ef7]/30 rounded-lg px-3 py-2"
          >
            ↺ {aviso.mensaje}
          </button>
        )}
        <button
          onClick={abrirNuevaFinanciacion}
          className="bg-[#4f8ef7] hover:bg-[#4f8ef7]/90 text-white text-xs font-medium rounded-lg px-4 py-2"
        >
          + Nueva financiación
        </button>
      </div>

      {/* ── KPIs ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#171b2a] border border-[#2d3553] rounded-xl p-6">
          <p className="text-xs text-[#94a3b8] mb-1">Deuda total</p>
          <p className="text-2xl font-semibold text-[#f87171]">{formatearEuros(deudaTotal)}</p>
        </div>
        <div className="bg-[#171b2a] border border-[#2d3553] rounded-xl p-6">
          <p className="text-xs text-[#94a3b8] mb-1">Cuota mensual total</p>
          <p className="text-2xl font-semibold text-[#fbbf24]">{formatearEuros(cuotaMensualTotal)}</p>
        </div>
        <div className="bg-[#171b2a] border border-[#2d3553] rounded-xl p-6">
          <p className="text-xs text-[#94a3b8] mb-1">Financiaciones activas</p>
          <p className="text-2xl font-semibold text-white">{financiaciones.length}</p>
        </div>
      </div>

      {/* ── Lista de financiaciones ── */}
      {financiaciones.length === 0 ? (
        <EstadoVacio
          Icono={Landmark}
          titulo="Sin financiaciones"
          subtitulo="Añadí tus préstamos y pólizas de crédito."
          textoBoton="+ Nueva financiación"
          alHacerClicBoton={abrirNuevaFinanciacion}
        />
      ) : (
        <div className="space-y-3">
          {financiaciones.map((fin) => {
            const cuenta = buscarCuenta(fin.cuenta_id)
            // Porcentaje del capital inicial que todavía queda pendiente.
            const porcentajePendiente =
              fin.capital_inicial > 0 ? Math.min(100, (fin.capital_pendiente / fin.capital_inicial) * 100) : 0

            return (
              <div key={fin.id} className="bg-[#171b2a] border border-[#2d3553] rounded-xl p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-sm font-semibold text-white">{fin.nombre}</p>
                    <p className="text-xs text-[#64748b]">
                      {fin.entidad}{cuenta ? ` · ${cuenta.nombre}` : ''}
                    </p>
                  </div>
                  <p className="text-lg font-semibold text-[#f87171]">
                    {formatearEuros(fin.capital_pendiente)}
                    <span className="text-xs text-[#64748b] font-normal"> de {formatearEuros(fin.capital_inicial)}</span>
                  </p>
                </div>

                {/* Barra de progreso: cuánto capital queda pendiente */}
                <div className="w-full h-1.5 bg-[#0f1420] rounded-full overflow-hidden mb-4">
                  <div
                    className="h-full bg-gradient-to-r from-[#34d399] to-[#4f8ef7]"
                    style={{ width: `${porcentajePendiente}%` }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex gap-8">
                    <div>
                      <p className="text-[10px] text-[#64748b] uppercase">Tipo interés</p>
                      <p className="text-sm text-[#cbd5e1]">{fin.tipo_interes}%</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-[#64748b] uppercase">Cuota mensual</p>
                      <p className="text-sm text-[#cbd5e1]">{formatearEuros(fin.cuota_mensual)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => abrirEdicionFinanciacion(fin)}
                      className="text-xs text-[#94a3b8] hover:text-white border border-[#252b3a] rounded-lg px-3 py-1"
                    >
                      Editar
                    </button>
                    {confirmarEliminarId === fin.id ? (
                      <ConfirmacionInline
                        onConfirmar={() => {
                          eliminarFinanciacion(fin.id)
                          setConfirmarEliminarId(null)
                        }}
                        onCancelar={() => setConfirmarEliminarId(null)}
                      />
                    ) : (
                      <button
                        onClick={() => setConfirmarEliminarId(fin.id)}
                        className="text-[#64748b] hover:text-[#f87171]"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
