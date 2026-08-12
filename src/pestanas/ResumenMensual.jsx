import { BarChart3 } from 'lucide-react'
import EstadoVacio from '../componentes/EstadoVacio'

export default function ResumenMensual({ movimientos }) {
  if (movimientos.length === 0) {
    return (
      <EstadoVacio
        Icono={BarChart3}
        titulo="Sin movimientos"
        subtitulo="Añadí movimientos para ver el resumen mensual."
      />
    )
  }
  return <p className="text-sm text-[#94a3b8]">Acá va el gráfico de ingresos/gastos por mes.</p>
}
