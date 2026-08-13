// ═══════════════════════════════════════════════════════════
// BARRA LATERAL
// ═══════════════════════════════════════════════════════════
// El menú de navegación entre las 8 pestañas de EdFlow, más los
// 4 botones de acceso rápido de abajo (Movimiento, Traspaso,
// Financiación, Cuenta).

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

export default function BarraLateral({
  pestanaActiva,
  cambiarPestana,
  cantidadAlertas,
  abrirNuevaCuenta,
}) {
  return (
    <nav className="w-56 shrink-0 bg-[#0d0f14] border-r border-[#2d3553] p-3 flex flex-col justify-between">

      {/* ── Lista de pestañas ── */}
      <div className="space-y-1">
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
              {id === 'alertas' && cantidadAlertas > 0 && (
                <span className="text-[10px] bg-[#f87171]/20 text-[#f87171] rounded-full px-1.5 py-0.5">
                  {cantidadAlertas}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* ── Botones de acceso rápido ── */}
      {/* "+ Cuenta" ya abre el formulario real. Los otros 3 todavía
          no tienen su formulario (los vamos a construir en los
          próximos pasos), así que por ahora solo te llevan a la
          pestaña relacionada. */}
      <div className="space-y-2 pt-3 border-t border-[#2d3553]">
        <button
          onClick={() => cambiarPestana('movimientos')}
          className="w-full bg-[#34d399] hover:bg-[#34d399]/90 text-[#0d0f14] text-sm font-medium rounded-lg py-2"
        >
          + Movimiento
        </button>
        <button
          onClick={() => cambiarPestana('pool')}
          className="w-full border border-[#2d3553] text-[#cbd5e1] hover:bg-[#171b2a] text-sm rounded-lg py-2"
        >
          ⇄ Traspaso
        </button>
        <button
          onClick={() => cambiarPestana('pool')}
          className="w-full border border-[#2d3553] text-[#cbd5e1] hover:bg-[#171b2a] text-sm rounded-lg py-2"
        >
          + Financiación
        </button>
        <button
          onClick={abrirNuevaCuenta}
          className="w-full border border-[#2d3553] text-[#cbd5e1] hover:bg-[#171b2a] text-sm rounded-lg py-2"
        >
          + Cuenta
        </button>
      </div>
    </nav>
  )
}
