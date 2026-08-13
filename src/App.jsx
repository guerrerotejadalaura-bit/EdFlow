import { useState, useEffect } from 'react'
import { leerDatos, guardarDatos, borrarDatos } from './datos/almacenamiento'
import { ESTADO_INICIAL } from './datos/modelo'
import { calcularAlertas } from './datos/calculos'
import { fechaDeHoy, sumarMeses, generarId } from './utilidades/fechas'

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
  const [estado, setEstado] = useState(leerDatos)
  const [pestanaActiva, setPestanaActiva] = useState('dashboard')

  useEffect(() => {
    guardarDatos(estado)
  }, [estado])

  const irAConfiguracion = () => setPestanaActiva('configuracion')

  // ── Config de empresa ──────────────────────────────────────
  const guardarConfigEmpresa = (datosEmpresa) => {
    setEstado({ ...estado, config: datosEmpresa })
  }

  // ── Cuentas: crear, editar, eliminar, activar/desactivar ────
  const agregarCuenta = (datosCuenta) => {
    const cuentaNueva = { ...datosCuenta, id: generarId(), activa: true }
    setEstado({ ...estado, cuentas: [...estado.cuentas, cuentaNueva] })
  }

  const editarCuenta = (id, cambios) => {
    setEstado({
      ...estado,
      cuentas: estado.cuentas.map((c) => (c.id === id ? { ...c, ...cambios } : c)),
    })
  }

  const eliminarCuenta = (id) => {
    setEstado({ ...estado, cuentas: estado.cuentas.filter((c) => c.id !== id) })
  }

  const toggleActivaCuenta = (id) => {
    setEstado({
      ...estado,
      cuentas: estado.cuentas.map((c) => (c.id === id ? { ...c, activa: !c.activa } : c)),
    })
  }

  // ── Categorías: crear y eliminar ─────────────────────────────
  const agregarCategoria = ({ nombre, signo, color }) => {
    const categoriaNueva = { id: 'cat_' + generarId(), label: nombre, signo, color }
    setEstado({ ...estado, categorias: [...estado.categorias, categoriaNueva] })
  }

  const eliminarCategoria = (id) => {
    setEstado({ ...estado, categorias: estado.categorias.filter((c) => c.id !== id) })
  }

  // ── Borrar todo ───────────────────────────────────────────────
  const borrarTodo = () => {
    borrarDatos()
    setEstado(ESTADO_INICIAL)
  }

  // Alertas calculadas en base a los datos reales.
  const fechaObjetivo = sumarMeses(fechaDeHoy(), 1)
  const alertas = calcularAlertas(estado.cuentas, estado.financiaciones, estado.movimientos, fechaObjetivo)

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
            guardarConfigEmpresa={guardarConfigEmpresa}
            cuentas={estado.cuentas}
            agregarCuenta={agregarCuenta}
            editarCuenta={editarCuenta}
            eliminarCuenta={eliminarCuenta}
            toggleActivaCuenta={toggleActivaCuenta}
            categorias={estado.categorias}
            agregarCategoria={agregarCategoria}
            eliminarCategoria={eliminarCategoria}
            borrarTodo={borrarTodo}
          />
        )
      default:
        return null
    }
  }

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
