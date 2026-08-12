import { List } from 'lucide-react'
import EstadoVacio from '../componentes/EstadoVacio'

export default function Movimientos({ movimientos }) {
  if (movimientos.length === 0) {
    return (
      <EstadoVacio
        Icono={List}
        titulo="Sin movimientos"
        subtitulo="Añadí tu primer movimiento de tesorería."
        textoBoton="+ Nuevo movimiento"
      />
    )
  }
  return <p className="text-sm text-[#94a3b8]">Acá va la tabla de movimientos con filtros.</p>
}
