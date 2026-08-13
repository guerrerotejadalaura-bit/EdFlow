import { useState, useEffect, useRef } from 'react'
import { leerDatos, guardarDatos, borrarDatos } from './datos/almacenamiento'
import { ESTADO_INICIAL } from './datos/modelo'
import { calcularAlertas } from './datos/calculos'
import { fechaDeHoy, sumarMeses, generarId } from './utilidades/fechas'

import BarraLateral from './componentes/BarraLateral'
import ModalCuenta from './componentes/ModalCuenta'
import AvisoDeshacer from './componentes/AvisoDeshacer'
import Dashboard from './pestanas/Dashboard'
import ResumenMensual from './pestanas/ResumenMensual'
import Prevision from './pestanas/Prevision'
import PoolBancario from './pestanas/PoolBancario'
import Confirming from './pestanas/Confirming'
import Movimientos from './pestanas/Movimientos'
import Alertas from './pestanas/Alertas'
import Configuracion from './pestanas/Configuracion'

// Cuántos milisegundos queda visible el aviso de "Deshacer" (6 segundos).
const DURACION_AVISO_MS = 6000

export default function App() {
  const [estado, setEstado] = useState(leerDatos)
  const [pestanaActiva, setPestanaActiva] = useState('dashboard')

  useEffect(() => {
    guardarDatos(estado)
  }, [estado])

  const irAConfiguracion = () => setPestanaActiva('configuracion')

  // ── Aviso de "Deshacer" ─────────────────────────────────────
  // "aviso" guarda el mensaje a mostrar y la función que hay que
  // ejecutar si el usuario toca "Deshacer". "timeoutRef" guarda el
  // temporizador que hace desaparecer el aviso solo, para poder
  // cancelarlo si aparece un aviso nuevo antes de que termine.
  const [aviso, setAviso] = useState(null)
  const timeoutRef = useRef(null)

  const mostrarAvisoDeshacer = (mensaje, restaurar) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setAviso({ mensaje, restaurar })
    timeoutRef.current = setTimeout(() => setAviso(null), DURACION_AVISO_MS)
  }

  const alDeshacer = () => {
    if (aviso) aviso.restaurar()
    setAviso(null)
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
  }

  // ── Config de empresa ──────────────────────────────────────
  const guardarConfigEmpresa = (datosEmpresa) => {
    setEstado({ ...estado, config: datosEmpresa })
  }

  // ── Modal de cuenta ──────────────────────────────────────────
  const [modalCuentaAbierto, setModalCuentaAbierto] = useState(false)
  const [cuentaEnEdicion, setCuentaEnEdicion] = useState(null)

  const abrirNuevaCuenta = () => {
    setCuentaEnEdicion(null)
    setModalCuentaAbierto(true)
  }
  const abrirEdicionCuenta = (cuenta) => {
    setCuentaEnEdicion(cuenta)
    setModalCuentaAbierto(true)
  }
  const cerrarModalCuenta = () => setModalCuentaAbierto(false)

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

  const alGuardarCuenta = (datosCuenta) => {
    if (cuentaEnEdicion) {
      editarCuenta(cuentaEnEdicion.id, datosCuenta)
    } else {
      agregarCuenta(datosCuenta)
    }
    cerrarModalCuenta()
  }

  // Borrar una cuenta: guardamos una copia ANTES de borrarla, para
  // poder devolverla si el usuario toca "Deshacer".
  const eliminarCuenta = (id) => {
    const cuentaBorrada = estado.cuentas.find((c) => c.id === id)
    setEstado((prev) => ({ ...prev, cuentas: prev.cuentas.filter((c) => c.id !== id) }))
    mostrarAvisoDeshacer(`Cuenta "${cuentaBorrada.nombre}" eliminada`, () => {
      setEstado((prev) => ({ ...prev, cuentas: [...prev.cuentas, cuentaBorrada] }))
    })
  }

  const toggleActivaCuenta = (id) => {
    setEstado({
      ...estado,
      cuentas: estado.cuentas.map((c) => (c.id === id ? { ...c, activa: !c.activa } : c)),
    })
  }

  // ── Categorías ────────────────────────────────────────────────
  const agregarCategoria = ({ nombre, signo, color }) => {
    const categoriaNueva = { id: 'cat_' + generarId(), label: nombre, signo, color }
    setEstado({ ...estado, categorias: [...estado.categorias, categoriaNueva] })
  }

  const eliminarCategoria = (id) => {
    const categoriaBorrada = estado.categorias.find((c) => c.id === id)
    setEstado((prev) => ({ ...prev, categorias: prev.categorias.filter((c) => c.id !== id) }))
    mostrarAvisoDeshacer(`Categoría "${categoriaBorrada.label}" eliminada`, () => {
      setEstado((prev) => ({ ...prev, categorias: [...prev.categorias, categoriaBorrada] }))
    })
  }

  // ── Borrar todo ───────────────────────────────────────────────
  // Guardamos TODO el estado anterior antes de vaciarlo, para poder
  // restaurarlo entero si el usuario se arrepiente.
  const borrarTodo = () => {
    const estadoAnterior = estado
    borrarDatos()
    setEstado(ESTADO_INICIAL)
    mostrarAvisoDeshacer('Todos los datos fueron borrados', () => {
      setEstado(estadoAnterior)
    })
  }

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
            abrirNuevaCuenta={abrirNuevaCuenta}
            abrirEdicionCuenta={abrirEdicionCuenta}
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
        abrirNuevaCuenta={abrirNuevaCuenta}
      />
      <main className="flex-1 p-6">
        <h1 className="text-xl font-semibold text-white mb-4">{titulos[pestanaActiva]}</h1>
        {renderPestana()}
      </main>

      {modalCuentaAbierto && (
        <ModalCuenta
          cuentaExistente={cuentaEnEdicion}
          guardar={alGuardarCuenta}
          cerrar={cerrarModalCuenta}
        />
      )}

      {aviso && <AvisoDeshacer mensaje={aviso.mensaje} onDeshacer={alDeshacer} />}
    </div>
  )
}
