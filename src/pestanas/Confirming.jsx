import { useState } from 'react'
import { RefreshCw } from 'lucide-react'
import EstadoVacio from '../componentes/EstadoVacio'
import ConfirmacionInline from '../componentes/ConfirmacionInline'
import { formatearEuros } from '../utilidades/formato'

export default function Confirming({
  confirming,
  cuentas,
  abrirNuevaLineaConfirming,
  abrirEdicionLineaConfirming,
  eliminarLineaConfirming,
  aviso,
  alDeshacer,
}) {
  const [confirmarEliminarId, setConfirmarEliminarId] = useState(null)

  const buscarCuenta = (id) => cuentas.find((c) => c.id === id)

  return (
    <div className="space-y-6">
      <p className="text-xs text-[#94a3b8] -mt-2">Líneas de pago a proveedores con financiación diferida</p>

      <div className="flex justify-end gap-2">
        {aviso?.tipo === 'confirming' && (
          <button
            onClick={alDeshacer}
            className="text-xs text-[#4f8ef7] font-medium bg-[#4f8ef7]/10 border border-[#4f8ef7]/30 rounded-lg px-3 py-2"
          >
            ↺ {aviso.mensaje}
          </button>
        )}
        <button
          onClick={abrirNuevaLineaConfirming}
          className="bg-[#4f8ef7] hover:bg-[#4f8ef7]/90 text-white text-xs font-medium rounded-lg px-4 py-2"
        >
          + Nueva línea
        </button>
      </div>

      {confirming.length === 0 ? (
        <EstadoVacio
          Icono={RefreshCw}
          titulo="Sin líneas de confirming"
          subtitulo="Creá tu primera línea para gestionar pagos diferidos a proveedores."
          textoBoton="+ Nueva línea"
          alHacerClicBoton={abrirNuevaLineaConfirming}
        />
      ) : (
        <div className="space-y-3">
          {confirming.map((linea) => {
            const cuenta = buscarCuenta(linea.cuenta_id)
            return (
              <div key={linea.id} className="bg-[#171b2a] border border-[#2d3553] rounded-xl p-6">
                <div className="flex items-start justify-between mb-1">
                  <div>
                    <p className="text-sm font-semibold text-white">{linea.nombre}</p>
                    <p className="text-xs text-[#64748b]">
                      {linea.entidad}{cuenta ? ` · Cargo en ${cuenta.nombre}` : ''}
                    </p>
                  </div>
                  <p className="text-lg font-semibold text-[#06b6d4]">{formatearEuros(linea.limite)}</p>
                </div>
                {linea.notas && <p className="text-xs text-[#64748b] mt-2">{linea.notas}</p>}
                <div className="flex justify-end gap-2 mt-3">
                  <button
                    onClick={() => abrirEdicionLineaConfirming(linea)}
                    className="text-xs text-[#94a3b8] hover:text-white border border-[#252b3a] rounded-lg px-3 py-1"
                  >
                    Editar
                  </button>
                  {confirmarEliminarId === linea.id ? (
                    <ConfirmacionInline
                      onConfirmar={() => {
                        eliminarLineaConfirming(linea.id)
                        setConfirmarEliminarId(null)
                      }}
                      onCancelar={() => setConfirmarEliminarId(null)}
                    />
                  ) : (
                    <button
                      onClick={() => setConfirmarEliminarId(linea.id)}
                      className="text-[#64748b] hover:text-[#f87171]"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
