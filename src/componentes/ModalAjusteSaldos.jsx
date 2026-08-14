import { useState } from 'react'
import Modal from './Modal'
import { calcularSaldosPorCuentaAFecha } from '../datos/calculos'
import { formatearEuros } from '../utilidades/formato'
import { fechaDeHoy } from '../utilidades/fechas'

const ESTILO_INPUT =
  'w-full bg-[#0f1420] border border-[#252b3a] rounded-lg px-3 py-2 text-sm text-white ' +
  'focus:outline-none focus:border-[#4f8ef7]/50'

// ═══════════════════════════════════════════════════════════
// MODAL DE AJUSTE DE SALDOS
// ═══════════════════════════════════════════════════════════
// A veces el saldo que calculamos (saldo inicial + movimientos) no
// coincide con lo que realmente ves en la banca online (por un cobro
// que llegó antes, una comisión que no habías cargado, etc.). Acá el
// usuario escribe el saldo REAL de cada cuenta, y nosotros creamos
// automáticamente un movimiento de "Ajuste de saldo" por la diferencia,
// para que la previsión vuelva a cuadrar.
export default function ModalAjusteSaldos({ cuentas, movimientos, aplicarAjustes, cerrar }) {
  const hoy = fechaDeHoy()

  // Para cada cuenta activa, calculamos cuál es el saldo previsto A HOY
  // (saldo actual + movimientos ya pasados hasta hoy).
  const cuentasConPrevision = calcularSaldosPorCuentaAFecha(cuentas, movimientos, hoy)

  // Un "borrador" por cuenta: el saldo real que escribe el usuario, y
  // la fecha del ajuste (por defecto, hoy).
  const [borradores, setBorradores] = useState(
    Object.fromEntries(cuentasConPrevision.map((c) => [c.id, { saldoReal: '', fecha: hoy }]))
  )

  const cambiarBorrador = (cuentaId, campo, valor) =>
    setBorradores({ ...borradores, [cuentaId]: { ...borradores[cuentaId], [campo]: valor } })

  const alAplicar = () => {
    // Armamos la lista de ajustes: solo para las cuentas donde el
    // usuario escribió un saldo real Y ese saldo es distinto al
    // previsto (si es igual, no hace falta crear ningún movimiento).
    const ajustes = cuentasConPrevision
      .map((cuenta) => {
        const borrador = borradores[cuenta.id]
        if (borrador.saldoReal === '') return null
        const diferencia = Number(borrador.saldoReal) - cuenta.saldoProyectado
        if (diferencia === 0) return null
        return { cuenta_id: cuenta.id, diferencia, fecha: borrador.fecha }
      })
      .filter(Boolean)

    if (ajustes.length === 0) {
      alert('No escribiste ningún saldo real distinto al previsto, así que no hay nada para ajustar.')
      return
    }
    aplicarAjustes(ajustes)
  }

  return (
    <Modal titulo="↺ Ajuste de saldos reales" cerrar={cerrar}>
      <div className="space-y-4">
        <p className="text-xs text-[#94a3b8]">
          Introducí el <span className="text-[#cbd5e1]">saldo real actual</span> de cada cuenta (miralo en tu
          banca online). EdFlow calculará la diferencia con la previsión y la registrará como un ajuste
          automático. Dejá en blanco las cuentas que no quieras ajustar.
        </p>

        <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
          {cuentasConPrevision.map((cuenta) => (
            <div key={cuenta.id} className="bg-[#0f1420] border border-[#252b3a] rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="flex items-center gap-2 text-sm text-white">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cuenta.color }} />
                  {cuenta.nombre}
                </span>
                <span className="text-xs text-[#64748b]">
                  Previsión a hoy: <span className="text-[#cbd5e1]">{formatearEuros(cuenta.saldoProyectado)}</span>
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-[#94a3b8] block mb-1">Saldo real (€)</label>
                  <input
                    type="number"
                    value={borradores[cuenta.id].saldoReal}
                    onChange={(e) => cambiarBorrador(cuenta.id, 'saldoReal', e.target.value)}
                    placeholder="Introduce el saldo real"
                    className={ESTILO_INPUT}
                  />
                </div>
                <div>
                  <label className="text-xs text-[#94a3b8] block mb-1">Fecha del ajuste</label>
                  <input
                    type="date"
                    value={borradores[cuenta.id].fecha}
                    onChange={(e) => cambiarBorrador(cuenta.id, 'fecha', e.target.value)}
                    className={ESTILO_INPUT}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            onClick={cerrar}
            className="text-xs text-[#94a3b8] hover:text-white px-4 py-2 rounded-lg border border-[#252b3a]"
          >
            Cancelar
          </button>
          <button
            onClick={alAplicar}
            className="bg-[#34d399] hover:bg-[#34d399]/90 text-[#0d0f14] text-xs font-medium rounded-lg px-4 py-2"
          >
            Aplicar ajustes
          </button>
        </div>
      </div>
    </Modal>
  )
}
