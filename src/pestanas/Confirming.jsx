import { RefreshCw } from 'lucide-react'
import EstadoVacio from '../componentes/EstadoVacio'

export default function Confirming({ confirming }) {
  if (confirming.length === 0) {
    return (
      <EstadoVacio
        Icono={RefreshCw}
        titulo="Sin líneas de confirming"
        subtitulo="Creá tu primera línea para gestionar pagos diferidos a proveedores."
        textoBoton="+ Nueva línea"
      />
    )
  }
  return <p className="text-sm text-[#94a3b8]">Acá va la lista de líneas de confirming.</p>
}
