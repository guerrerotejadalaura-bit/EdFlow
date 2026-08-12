// ═══════════════════════════════════════════════════════════
// BARRA LATERAL
// ═══════════════════════════════════════════════════════════
// El menú de navegación entre las 8 pestañas de EdFlow. Recibe cuál
// pestaña está activa y una función para cambiarla quien la usa
// (App.jsx) le pasa esos datos por props.

import {
  LayoutDashboard,
  BarChart3,
  Compass,
  Landmark,
  RefreshCw,
  List,
  CircleAlert,
  Settings,
} from 'lucide-react'

// Lista de pestañas: id (interno), etiqueta (lo que ve el usuario) e ícono.
const PESTANAS = [
  { id: 'dashboard', etiqueta: 'Dashboard', Icono: LayoutDashboard },
  { id: 'resumen', etiqueta: 'Resumen mensual', Icono: BarChart3 },
  { id: 'prevision', etiqueta: 'Previsión', Icono: Compass },
  { id: 'pool', etiqueta: 'Pool Bancario', Icono: Landmark },
  { id: 'confirming', etiqueta: 'Confirming', Icono: RefreshCw },
  { id: 'movimientos', etiqueta: 'Movimientos', Icono: List },
  { id: 'alertas', etiqueta: 'Alertas', Icono: CircleAlert },
  { id: 'configuracion', etiqueta: 'Configuración', Icono: Settings },
]

export default function BarraLateral({ pestanaActiva, cambiarPestana, cantidadAlertas }) {
  return (
    <nav className="w-56 shrink-0 bg-[#0d0f14] border-r border-[#2d3553] p-3 space-y-1">
      {PESTANAS.map(({ id, etiqueta, Icono }) => {
        const activa = pestanaActiva === id
        return (
          <button
            key={id}
            onClick={() => cambiarPestana(id)}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors
              ${activa
                ? 'bg-[#171b2a] text-[#4f8ef7] border border-[#2d3553]'
                : 'text-[#94a3b8] hover:bg-[#171b2a] hover:text-[#cbd5e1] border border-transparent'
              }`}
          >
            <Icono size={16} />
            <span className="flex-1 text-left">{etiqueta}</span>
            {/* Mostramos la cantidad de alertas al lado de la pestaña "Alertas" */}
            {id === 'alertas' && cantidadAlertas > 0 && (
              <span className="text-[10px] bg-[#f87171]/20 text-[#f87171] rounded-full px-1.5 py-0.5">
                {cantidadAlertas}
              </span>
            )}
          </button>
        )
      })}
    </nav>
  )
}
