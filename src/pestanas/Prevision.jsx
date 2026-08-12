import { Compass } from 'lucide-react'
import EstadoVacio from '../componentes/EstadoVacio'

export default function Prevision({ cuentas, irAConfiguracion }) {
  if (cuentas.length === 0) {
    return (
      <EstadoVacio
        Icono={Compass}
        titulo="Sin cuentas configuradas"
        subtitulo="Configurá tus cuentas antes de usar la previsión."
        textoBoton="Ir a configuración"
        alHacerClicBoton={irAConfiguracion}
      />
    )
  }
  return <p className="text-sm text-[#94a3b8]">Acá va el saldo proyectado a una fecha.</p>
}
