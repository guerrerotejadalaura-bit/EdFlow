import { Landmark } from 'lucide-react'
import EstadoVacio from '../componentes/EstadoVacio'

// Por ahora, si no hay cuentas cargadas, mostramos el estado vacío
// invitando a ir a Configuración. Cuando exista el CRUD de cuentas
// (próximo paso), acá vamos a mostrar los KPIs reales con calculos.js.
export default function Dashboard({ cuentas, irAConfiguracion }) {
  if (cuentas.length === 0) {
    return (
      <div className="space-y-4">
        <div className="bg-[#171b2a] border border-[#2d3553] rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-white">Bienvenido a EdFlow</p>
            <p className="text-xs text-[#94a3b8]">Empezá configurando tu empresa y dando de alta tus cuentas.</p>
          </div>
          <button
            onClick={irAConfiguracion}
            className="bg-[#4f8ef7] hover:bg-[#4f8ef7]/90 text-white text-xs font-medium rounded-lg px-4 py-2"
          >
            Ir a Configuración
          </button>
        </div>

        <EstadoVacio
          Icono={Landmark}
          titulo="Sin cuentas configuradas"
          subtitulo="Añadí tus cuentas bancarias para empezar."
          textoBoton="Configurar cuentas"
          alHacerClicBoton={irAConfiguracion}
        />
      </div>
    )
  }

  // Placeholder: en el próximo paso acá van los KPIs reales.
  return <p className="text-sm text-[#94a3b8]">Ya tenés cuentas cargadas — los KPIs van en el próximo paso.</p>
}
