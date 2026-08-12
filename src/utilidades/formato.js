// ═══════════════════════════════════════════════════════════
// FORMATO
// ═══════════════════════════════════════════════════════════
// Funciones chiquitas para mostrar números y fechas de forma
// legible. No calculan nada de tesorería, solo dan "formato".

// Convierte 1234.5 en "1.234,50 €" (formato español)
export function formatearEuros(valor) {
  if (valor === undefined || valor === null || isNaN(valor)) return '— €'
  const esNegativo = valor < 0
  const absoluto = Math.abs(valor)
  const numeroFormateado = absoluto.toLocaleString('es-ES', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
  return (esNegativo ? '-' : '') + numeroFormateado + ' €'
}

// Convierte "2026-08-12" en "12/08/2026"
export function formatearFecha(fechaISO) {
  if (!fechaISO) return '—'
  const [anio, mes, dia] = fechaISO.split('-')
  return `${dia}/${mes}/${anio}`
}

// Convierte "2026-08" en "ago 2026" (para etiquetas de meses en gráficos)
export function formatearEtiquetaMes(claveAnioMes) {
  if (!claveAnioMes) return ''
  const fecha = new Date(claveAnioMes + '-01')
  return fecha.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' })
}
