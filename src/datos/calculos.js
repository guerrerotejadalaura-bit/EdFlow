// ═══════════════════════════════════════════════════════════
// MOTOR DE CÁLCULO
// ═══════════════════════════════════════════════════════════
// Acá vive TODA la matemática de la tesorería. Cada función recibe
// los datos que necesita (cuentas, movimientos, etc.) y devuelve un
// resultado. Ninguna función de este archivo dibuja nada en pantalla
// ni sabe que existe React — por eso las llamamos funciones "puras".
//
// Esto tiene una ventaja grande: cualquier pestaña (Dashboard,
// Previsión, Alertas...) puede llamar a estas funciones y mostrar
// el resultado como quiera, sin repetir la lógica de cálculo.

import { fechaDeHoy, sumarMeses } from '../utilidades/fechas'
import { formatearEuros, formatearFecha } from '../utilidades/formato'

// ── Saldo total de todas las cuentas activas ──────────────────
// Suma el saldo actual de cada cuenta marcada como "activa".
export function calcularSaldoTotal(cuentas) {
  return cuentas
    .filter((c) => c.activa)
    .reduce((suma, c) => suma + Number(c.saldo || 0), 0)
}

// ── Saldo disponible ───────────────────────────────────────────
// Es distinto al saldo total: para las cuentas "corriente" es el
// saldo tal cual, pero para las "poliza" (línea de crédito), el
// disponible es el LÍMITE menos lo que ya está usado.
// Ejemplo: límite 25.000€, saldo -8.500€ → disponible 16.500€.
export function calcularSaldoDisponible(cuentas) {
  const activas = cuentas.filter((c) => c.activa)

  const corrientes = activas
    .filter((c) => c.tipo === 'corriente')
    .reduce((suma, c) => suma + Number(c.saldo || 0), 0)

  const polizas = activas
    .filter((c) => c.tipo === 'poliza')
    .reduce((suma, c) => {
      const dispuesto = Math.abs(Math.min(Number(c.saldo || 0), 0))
      return suma + Math.max(0, Number(c.limite || 0) - dispuesto)
    }, 0)

  return corrientes + polizas
}

// ── Deuda total y cuota mensual total ──────────────────────────
export function calcularDeudaTotal(financiaciones) {
  return financiaciones.reduce((suma, f) => suma + Number(f.capital_pendiente || 0), 0)
}

export function calcularCuotaMensualTotal(financiaciones) {
  return financiaciones.reduce((suma, f) => suma + Number(f.cuota_mensual || 0), 0)
}

// ── Saldo proyectado a una fecha futura ────────────────────────
// Toma el saldo actual de todas las cuentas y le suma/resta todos
// los movimientos que van a pasar entre hoy y la fecha elegida.
export function calcularSaldoProyectado(cuentas, movimientos, fechaObjetivo) {
  const hoy = fechaDeHoy()
  const saldoActual = calcularSaldoTotal(cuentas)
  const movimientosFuturos = movimientos.filter(
    (m) => m.fecha > hoy && m.fecha <= fechaObjetivo
  )
  const impactoFuturo = movimientosFuturos.reduce((suma, m) => suma + Number(m.importe || 0), 0)
  return saldoActual + impactoFuturo
}

// ── Lo mismo, pero desglosado cuenta por cuenta ────────────────
// Útil para la pestaña "Pool Bancario": cada cuenta con su saldo
// proyectado individual a la fecha elegida.
export function calcularSaldosPorCuentaAFecha(cuentas, movimientos, fechaObjetivo) {
  const hoy = fechaDeHoy()
  return cuentas
    .filter((c) => c.activa)
    .map((c) => {
      const movimientosFuturos = movimientos.filter(
        (m) => m.cuenta_id === c.id && m.fecha > hoy && m.fecha <= fechaObjetivo
      )
      const impacto = movimientosFuturos.reduce((suma, m) => suma + Number(m.importe || 0), 0)
      return { ...c, saldoProyectado: Number(c.saldo || 0) + impacto }
    })
}

// ── Flujo mensual de los próximos 12 meses ─────────────────────
// Para cada uno de los próximos 12 meses, calcula: cuánto entra
// (ingresos), cuánto sale (gastos) y el neto (ingresos + gastos,
// ya que los gastos se guardan como números negativos).
export function calcularFlujoMensual(movimientos) {
  const hoy = fechaDeHoy()
  const meses = []

  for (let i = 0; i < 12; i++) {
    const fechaMes = sumarMeses(hoy, i)
    const claveAnioMes = fechaMes.slice(0, 7) // "AAAA-MM"

    const movimientosDelMes = movimientos.filter(
      (m) => m.fecha.startsWith(claveAnioMes) && m.categoria !== 'ajuste_saldo'
    )

    const ingresos = movimientosDelMes
      .filter((m) => Number(m.importe) > 0)
      .reduce((suma, m) => suma + Number(m.importe), 0)

    const gastos = movimientosDelMes
      .filter((m) => Number(m.importe) < 0)
      .reduce((suma, m) => suma + Number(m.importe), 0)

    meses.push({
      clave: claveAnioMes,
      ingresos,
      gastos,
      neto: ingresos + gastos,
    })
  }

  return meses
}

// ── Alertas automáticas ─────────────────────────────────────────
// Revisa cuentas, financiaciones y el saldo proyectado, y arma una
// lista de avisos. Cada alerta tiene un "tipo" (warning o danger)
// y un mensaje ya listo para mostrar.
export function calcularAlertas(cuentas, financiaciones, movimientos, fechaObjetivo) {
  const hoy = new Date()
  const alertas = []

  // Cuentas corrientes con saldo bajo (menos de 1.000€)
  cuentas
    .filter((c) => c.activa)
    .forEach((c) => {
      if (c.tipo === 'corriente' && Number(c.saldo) < 1000) {
        alertas.push({
          tipo: 'warning',
          mensaje: `${c.nombre}: saldo bajo (${formatearEuros(Number(c.saldo))})`,
        })
      }
    })

  // Financiaciones que vencen en menos de 90 días
  financiaciones.forEach((f) => {
    if (!f.fecha_fin) return
    const dias = Math.ceil((new Date(f.fecha_fin) - hoy) / 86400000)
    if (dias > 0 && dias < 90) {
      alertas.push({
        tipo: 'warning',
        mensaje: `${f.nombre}: vence en ${dias} días (${formatearFecha(f.fecha_fin)})`,
      })
    }
  })

  // Saldo proyectado peligrosamente bajo a la fecha elegida
  const cuentasActivas = cuentas.filter((c) => c.activa)
  if (cuentasActivas.length > 0) {
    const saldoProyectado = calcularSaldoProyectado(cuentas, movimientos, fechaObjetivo)
    if (saldoProyectado < 2000) {
      alertas.push({
        tipo: 'danger',
        mensaje: `Saldo proyectado a ${formatearFecha(fechaObjetivo)}: ${formatearEuros(saldoProyectado)}`,
      })
    }
  }

  return alertas
}
