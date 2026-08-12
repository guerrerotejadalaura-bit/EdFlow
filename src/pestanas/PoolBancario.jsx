import { Landmark } from 'lucide-react'
import EstadoVacio from '../componentes/EstadoVacio'

export default function PoolBancario({ cuentas }) {
  if (cuentas.length === 0) {
    return (
      <EstadoVacio
        Icono={Landmark}
        titulo="Sin cuentas"
        subtitulo="Añadí tus cuentas bancarias desde Configuración."
      />
    )
  }
  return <p className="text-sm text-[#94a3b8]">Acá va el detalle de cada cuenta con su saldo proyectado.</p>
}
