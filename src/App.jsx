import { useState, useEffect } from 'react'
import { leerDatos, guardarDatos } from './datos/almacenamiento'
import {
  calcularSaldoTotal,
  calcularSaldoDisponible,
  calcularFlujoMensual,
  calcularAlertas,
} from './datos/calculos'
import { formatearEuros } from './utilidades/formato'
import { fechaDeHoy, sumarMeses } from './utilidades/fechas'

// ── Datos de ejemplo (TEMPORAL) ─────────────────────────────────
// Esto es solo para comprobar que el motor de cálculo funciona.
// En el próximo paso vamos a reemplazar esto por un formulario real
// donde vos vas a poder cargar tus propias cuentas y movimientos.
const cuentasDeEjemplo = [
  { id: 1, nombre: 'Cuenta corriente principal', tipo: 'corriente', saldo: 15000, activa: true },
  { id: 2, nombre: 'Cuenta ahorro', tipo: 'corriente', saldo: 500, activa: true },
]
const movimientosDeEjemplo = [
  { id: 1, fecha: sumarMeses(fechaDeHoy(), 1), concepto: 'Cobro cliente', categoria: 'cobros_clientes', importe: 8000, cuenta_id: 1 },
  { id: 2, fecha: sumarMeses(fechaDeHoy(), 1), concepto: 'Pago proveedor', categoria: 'pagos_prov', importe: -3000, cuenta_id: 1 },
]

export default function App() {
  const [estado, setEstado] = useState(leerDatos)

  useEffect(() => {
    guardarDatos(estado)
  }, [estado])

  const cambiarNombreEmpresa = (nuevoNombre) => {
    setEstado({
      ...estado,
      config: { ...estado.config, empresa: nuevoNombre },
    })
  }

  // Usamos el motor de cálculo con los datos de ejemplo de arriba.
  const saldoTotal = calcularSaldoTotal(cuentasDeEjemplo)
  const saldoDisponible = calcularSaldoDisponible(cuentasDeEjemplo)
  const flujoMensual = calcularFlujoMensual(movimientosDeEjemplo)
  const alertas = calcularAlertas(cuentasDeEjemplo, [], movimientosDeEjemplo, sumarMeses(fechaDeHoy(), 1))

  return (
    <div className="min-h-screen bg-[#0d0f14] p-6 space-y-4 max-w-md mx-auto">

      <div className="bg-[#171b2a] border border-[#2d3553] rounded-xl p-6 space-y-3">
        <h1 className="text-sm font-semibold text-white">🎉 Hola, EdFlow</h1>
        <div>
          <label className="text-xs text-[#94a3b8] block mb-1">Nombre de tu empresa</label>
          <input
            type="text"
            value={estado.config.empresa}
            onChange={(e) => cambiarNombreEmpresa(e.target.value)}
            placeholder="Escribí algo acá..."
            className="w-full bg-[#0f1420] border border-[#252b3a] rounded-lg px-3 py-2
                       text-sm text-white
                       focus:outline-none focus:border-[#4f8ef7]/50"
          />
        </div>
      </div>

      <div className="bg-[#171b2a] border border-[#2d3553] rounded-xl p-6">
        <h3 className="text-sm font-semibold text-white mb-3">
          Prueba del motor de cálculo (con datos de ejemplo)
        </h3>
        <div className="space-y-2 text-xs">
          <p className="text-[#cbd5e1]">
            Saldo total: <span className="text-white font-medium">{formatearEuros(saldoTotal)}</span>
          </p>
          <p className="text-[#cbd5e1]">
            Saldo disponible: <span className="text-white font-medium">{formatearEuros(saldoDisponible)}</span>
          </p>
          <p className="text-[#cbd5e1]">
            Próximo mes — ingresos: <span className="text-[#34d399] font-medium">{formatearEuros(flujoMensual[1].ingresos)}</span>
          </p>
          <p className="text-[#cbd5e1]">
            Próximo mes — gastos: <span className="text-[#f87171] font-medium">{formatearEuros(flujoMensual[1].gastos)}</span>
          </p>
          <p className="text-[#cbd5e1]">
            Alertas detectadas: <span className="text-[#fbbf24] font-medium">{alertas.length}</span>
          </p>
          {alertas.map((a, i) => (
            <p key={i} className="text-[#64748b] pl-2">→ {a.mensaje}</p>
          ))}
        </div>
      </div>

    </div>
  )
}
