// ═══════════════════════════════════════════════════════════
// MODELO DE DATOS
// ═══════════════════════════════════════════════════════════
// Este archivo NO calcula nada ni guarda nada — solo define QUÉ FORMA
// tienen nuestros datos. Es como el "diccionario" de la herramienta:
// categorías por defecto y cómo se ve el estado vacío al arrancar.

// Categorías de cobros y pagos que vienen ya cargadas de fábrica.
// Cada categoría tiene:
//  - id: identificador único (lo usamos internamente, no se traduce)
//  - label: el texto que ve el usuario
//  - signo: "ingreso" (suma), "gasto" (resta) o "neutro" (no afecta el total,
//           por ejemplo un traspaso entre dos cuentas propias)
//  - color: color de acento para gráficos y etiquetas
export const CATEGORIAS_POR_DEFECTO = [
  { id: 'cobros_clientes', label: 'Cobros clientes', signo: 'ingreso', color: '#34d399' },
  { id: 'cobros_otros', label: 'Otros ingresos', signo: 'ingreso', color: '#34d399' },
  { id: 'pagos_prov', label: 'Pago proveedores', signo: 'gasto', color: '#f87171' },
  { id: 'costes_gen', label: 'Costes generales', signo: 'gasto', color: '#f87171' },
  { id: 'sueldos', label: 'Sueldos y nóminas', signo: 'gasto', color: '#fbbf24' },
  { id: 'cuotas_prestamos', label: 'Cuotas préstamos', signo: 'gasto', color: '#8b5cf6' },
  { id: 'impuestos', label: 'Impuestos', signo: 'gasto', color: '#6366f1' },
  { id: 'seguros', label: 'Seguros', signo: 'gasto', color: '#ec4899' },
  { id: 'comisiones', label: 'Comisiones bancarias', signo: 'gasto', color: '#94a3b8' },
  { id: 'traspasos', label: 'Traspasos', signo: 'neutro', color: '#64748b' },
  { id: 'inversiones_pago', label: 'Inversiones (pago)', signo: 'gasto', color: '#7c3aed' },
  { id: 'inversiones_cob', label: 'Inversiones (cobro)', signo: 'ingreso', color: '#5b21b6' },
  { id: 'tarjeta', label: 'Pagos tarjeta', signo: 'gasto', color: '#0ea5e9' },
  { id: 'ajuste_saldo', label: 'Ajuste de saldo', signo: 'neutro', color: '#fbbf24' },
  { id: 'confirming_pago', label: 'Confirming (pago)', signo: 'neutro', color: '#06b6d4' },
  { id: 'confirming_vto', label: 'Confirming (vencimiento)', signo: 'gasto', color: '#0891b2' },
  { id: 'otros', label: 'Otros', signo: 'gasto', color: '#9ca3af' },
]

// Así se ve el estado de la herramienta cuando todavía no hay nada cargado.
// "Estado" = todos los datos que la herramienta necesita para funcionar,
// juntos en un solo objeto.
export const ESTADO_INICIAL = {
  config: { empresa: '', sector: '', moneda: '€', notas: '' },
  cuentas: [],
  financiaciones: [],
  movimientos: [],
  categorias: CATEGORIAS_POR_DEFECTO,
  confirming: [],
}
