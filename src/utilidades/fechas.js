// ═══════════════════════════════════════════════════════════
// FECHAS
// ═══════════════════════════════════════════════════════════

// La fecha de hoy, siempre en formato "AAAA-MM-DD" (así es como
// guardamos TODAS las fechas en la herramienta, para poder
// compararlas fácilmente como si fueran texto).
export function fechaDeHoy() {
  return new Date().toISOString().split('T')[0]
}

// Le suma "n" meses a una fecha y devuelve el resultado en "AAAA-MM-DD".
// Ejemplo: sumarMeses("2026-08-12", 1) → "2026-09-12"
export function sumarMeses(fechaISO, n) {
  const fecha = new Date(fechaISO)
  fecha.setMonth(fecha.getMonth() + n)
  return fecha.toISOString().split('T')[0]
}

// Genera un identificador único simple, para darle "id" a cada
// movimiento, cuenta, etc. que se crea.
export function generarId() {
  return Date.now() + Math.floor(Math.random() * 99999)
}
