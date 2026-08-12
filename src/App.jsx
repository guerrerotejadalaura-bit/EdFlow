import { useState, useEffect } from 'react'
import { leerDatos, guardarDatos } from './datos/almacenamiento'
import { calcularAlertas } from './datos/calculos'
import { fechaDeHoy, sumarMeses } from './utilidades/fechas'

import BarraLateral from './componentes/BarraLateral'
import Dashboard from './pestanas/Dashboard'
import ResumenMensual from './pestanas/ResumenMensual'
import Prevision from './pestanas/Prevision'
import PoolBancario from './pestanas/PoolBancario'
import Confirming from './pestanas/Confirming'
import Movimientos from './pestanas/Movimientos'
import Alertas from './pestanas/Alertas'
import Configuracion from './pestanas/Configuracion'

export default function App() {
  // Todos los datos de la herramienta, en un solo lugar.
  const [estado, setEstado] = useState(leerDatos)
  // Qué pestaña está activa ahora mismo.
  const [pestanaActiva, setPestanaActiva] = useState('dashboard')

  // Cada vez que "estado" cambia, lo guardamos.
  useEffect(() => {
    guardarDatos(estado)
  }, [estado])

  const cambiarNombreEmpresa = (nuevoNombre) => {
    setEstado({ ...estado, config: { ...estado.config, empresa: nuevoNombre } })
  }

  const irAConfiguracion = () => setPestanaActiva('configuracion')

  // Alertas calculadas en base a los datos reales (por ahora vacíos).
  const fechaObjetivo = sumarMeses(fechaDeHoy(), 1)
  const alertas = calcularAlertas(estado.cuentas, estado.financiaciones, estado.movimientos, fechaObjetivo)

  // Según la pestaña activa, mostramos un componente distinto.
  const renderPestana = () => {
    switch (pestanaActiva) {
      case 'dashboard':
        return <Dashboard cuentas={estado.cuentas} irAConfiguracion={irAConfiguracion} />
      case 'resumen':
        return <ResumenMensual movimientos={estado.movimientos} />
      case 'prevision':
        return <Prevision cuentas={estado.cuentas} irAConfiguracion={irAConfiguracion} />
      case 'pool':
        return <PoolBancario cuentas={estado.cuentas} />
      case 'confirming':
        return <Confirming confirming={estado.confirming} />
      case 'movimientos':
        return <Movimientos movimientos={estado.movimientos} />
      case 'alertas':
        return <Alertas alertas={alertas} />
      case 'configuracion':
        return (
          <Configuracion
            config={estado.config}
            cambiarNombreEmpresa={cambiarNombreEmpresa}
            cuentas={estado.cuentas}
            categorias={estado.categorias}
          />
        )
      default:
        return null
    }
  }

  // Título legible de la pestaña activa, para el encabezado.
  const titulos = {
    dashboard: 'Dashboard',
    resumen: 'Resumen mensual de caja',
    prevision: 'Previsión de Tesorería',
    pool: 'Pool Bancario',
    confirming: 'Confirming',
    movimientos: 'Movimientos',
    alertas: 'Alertas y Control',
    configuracion: 'Configuración',
  }

  return (
    <div className="min-h-screen bg-[#0d0f14] flex">
      <BarraLateral
        pestanaActiva={pestanaActiva}
        cambiarPestana={setPestanaActiva}
        cantidadAlertas={alertas.length}
      />
      <main className="flex-1 p-6">
        <h1 className="text-xl font-semibold text-white mb-4">{titulos[pestanaActiva]}</h1>
        {renderPestana()}
      </main>
    </div>
  )
}
