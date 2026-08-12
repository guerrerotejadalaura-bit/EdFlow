import { CircleCheck } from 'lucide-react'

export default function Alertas({ alertas }) {
  if (alertas.length === 0) {
    return (
      <div className="bg-[#171b2a] border border-[#2d3553] rounded-xl p-12 flex flex-col items-center text-center">
        <CircleCheck size={28} className="text-[#34d399] mb-3" />
        <p className="text-sm font-semibold text-[#34d399] mb-1">Sin alertas activas</p>
        <p className="text-xs text-[#94a3b8]">La tesorería está bajo control.</p>
      </div>
    )
  }

  return (
    <div className="bg-[#171b2a] border border-[#2d3553] rounded-xl p-6 space-y-2">
      {alertas.map((alerta, i) => (
        <p
          key={i}
          className={`text-sm ${alerta.tipo === 'danger' ? 'text-[#f87171]' : 'text-[#fbbf24]'}`}
        >
          ⚠ {alerta.mensaje}
        </p>
      ))}
    </div>
  )
}
