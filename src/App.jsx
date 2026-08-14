import { useState, useEffect, useRef } from 'react'
import { leerDatos, guardarDatos, borrarDatos } from './datos/almacenamiento'
import { ESTADO_INICIAL } from './datos/modelo'
import { calcularAlertas } from './datos/calculos'
import { fechaDeHoy, sumarMeses, generarId } from './utilidades/fechas'

import BarraLateral from './componentes/BarraLateral'
import ModalCuenta from './componentes/ModalCuenta'
import ModalMovimiento from './componentes/ModalMovimiento'
import ModalTraspaso from './componentes/ModalTraspaso'
import ModalFinanciacion from './componentes/ModalFinanciacion'
import Dashboard from './pestanas/Dashboard'
import ResumenMensual from './pestanas/ResumenMensual'
import Prevision from './pestanas/Prevision'
import PoolBancario from './pestanas/PoolBancario'
import Confirming from './pestanas/Confirming'
import Movimientos from './pestanas/Movimientos'
import Alertas from './pestanas/Alertas'
import Configuracion from './pestanas/Configuracion'

const DURACION_AVISO_MS = 6000

// Cuántos meses hay que sumar según la frecuencia elegida, para
// generar movimientos recurrentes o traspasos periódicos.
const MESES_POR_FRECUENCIA = { mensual: 1, trimestral: 3, semestral: 6, anual: 12 }

export default function App() {
  const [estado, setEstado] = useState(leerDatos)
  const [pestanaActiva, setPestanaActiva] = useState('dashboard')

  useEffect(() => {
    guardarDatos(estado)
  }, [estado])

  const irAConfiguracion = () => setPestanaActiva('configuracion')

  // ── Aviso de "Deshacer" ─────────────────────────────────────
  const [aviso, setAviso] = useState(null)
  const timeoutRef = useRef(null)

  const mostrarAvisoDeshacer = (tipo, mensaje, restaurar) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setAviso({ tipo, mensaje, restaurar })
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
    setModalCuentaAbierto(false)
  }

  const eliminarCuenta = (id) => {
    const cuentaBorrada = estado.cuentas.find((c) => c.id === id)
    setEstado((prev) => ({ ...prev, cuentas: prev.cuentas.filter((c) => c.id !== id) }))
    mostrarAvisoDeshacer('cuenta', `Cuenta "${cuentaBorrada.nombre}" eliminada`, () => {
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
    mostrarAvisoDeshacer('categoria', `Categoría "${categoriaBorrada.label}" eliminada`, () => {
      setEstado((prev) => ({ ...prev, categorias: [...prev.categorias, categoriaBorrada] }))
    })
  }

  // ── Borrar todo ───────────────────────────────────────────────
  const borrarTodo = () => {
    const estadoAnterior = estado
    borrarDatos()
    setEstado(ESTADO_INICIAL)
    mostrarAvisoDeshacer('todo', 'Todos los datos fueron borrados', () => {
      setEstado(estadoAnterior)
    })
  }

  // ── Modal de movimiento ─────────────────────────────────────
  const [modalMovimientoAbierto, setModalMovimientoAbierto] = useState(false)

  // Si el movimiento es recurrente, generamos UN movimiento por cada
  // repetición, separados por la frecuencia elegida (ej. 3 movimientos
  // mensuales seguidos).
  const agregarMovimiento = (datos) => {
    const { recurrente, frecuencia, repeticiones, ...base } = datos
    const cantidadVeces = recurrente ? Number(repeticiones) : 1
    const mesesEntreCadaUno = MESES_POR_FRECUENCIA[frecuencia] || 1

    const nuevosMovimientos = []
    for (let i = 0; i < cantidadVeces; i++) {
      nuevosMovimientos.push({
        ...base,
        id: generarId(),
        fecha: sumarMeses(base.fecha, mesesEntreCadaUno * i),
      })
    }
    setEstado((prev) => ({ ...prev, movimientos: [...prev.movimientos, ...nuevosMovimientos] }))
  }

  const alGuardarMovimiento = (datos) => {
    agregarMovimiento(datos)
    setModalMovimientoAbierto(false)
  }

  // ── Modal de traspaso ────────────────────────────────────────
  const [modalTraspasoAbierto, setModalTraspasoAbierto] = useState(false)

  // Un traspaso genera DOS movimientos vinculados por cada repetición:
  // una salida (negativa) en la cuenta origen, y una entrada (positiva)
  // en la cuenta destino. Los dos usan la categoría "traspasos", que
  // es "neutra" (no cuenta como ingreso ni gasto real).
  const agregarTraspaso = (datos) => {
    const { origen_id, destino_id, importe, fecha, concepto, notas, periodico, frecuencia, repeticiones } = datos
    const cantidadVeces = periodico ? Number(repeticiones) : 1
    const mesesEntreCadaUno = MESES_POR_FRECUENCIA[frecuencia] || 1

    const nuevosMovimientos = []
    for (let i = 0; i < cantidadVeces; i++) {
      const fechaMovimiento = sumarMeses(fecha, mesesEntreCadaUno * i)
      nuevosMovimientos.push(
        { id: generarId(), fecha: fechaMovimiento, importe: -Math.abs(importe), concepto, categoria: 'traspasos', cuenta_id: origen_id, notas },
        { id: generarId(), fecha: fechaMovimiento, importe: Math.abs(importe), concepto, categoria: 'traspasos', cuenta_id: destino_id, notas }
      )
    }
    setEstado((prev) => ({ ...prev, movimientos: [...prev.movimientos, ...nuevosMovimientos] }))
  }

  const alGuardarTraspaso = (datos) => {
    agregarTraspaso(datos)
    setModalTraspasoAbierto(false)
  }

  // ── Modal de financiación ────────────────────────────────────
  const [modalFinanciacionAbierto, setModalFinanciacionAbierto] = useState(false)

  const agregarFinanciacion = (datos) => {
    const financiacionNueva = { ...datos, id: generarId() }
    setEstado((prev) => ({ ...prev, financiaciones: [...prev.financiaciones, financiacionNueva] }))
  }

  const alGuardarFinanciacion = (datos) => {
    agregarFinanciacion(datos)
    setModalFinanciacionAbierto(false)
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
            aviso={aviso}
            alDeshacer={alDeshacer}
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
        abrirNuevoMovimiento={() => setModalMovimientoAbierto(true)}
        abrirNuevoTraspaso={() => setModalTraspasoAbierto(true)}
        abrirNuevaFinanciacion={() => setModalFinanciacionAbierto(true)}
      />
      <main className="flex-1 p-6">
        <h1 className="text-xl font-semibold text-white mb-4">{titulos[pestanaActiva]}</h1>
        {renderPestana()}
      </main>

      {modalCuentaAbierto && (
        <ModalCuenta
          cuentaExistente={cuentaEnEdicion}
          guardar={alGuardarCuenta}
          cerrar={() => setModalCuentaAbierto(false)}
        />
      )}
      {modalMovimientoAbierto && (
        <ModalMovimiento
          categorias={estado.categorias}
          cuentas={estado.cuentas}
          guardar={alGuardarMovimiento}
          cerrar={() => setModalMovimientoAbierto(false)}
        />
      )}
      {modalTraspasoAbierto && (
        <ModalTraspaso
          cuentas={estado.cuentas}
          guardar={alGuardarTraspaso}
          cerrar={() => setModalTraspasoAbierto(false)}
        />
      )}
      {modalFinanciacionAbierto && (
        <ModalFinanciacion
          cuentas={estado.cuentas}
          guardar={alGuardarFinanciacion}
          cerrar={() => setModalFinanciacionAbierto(false)}
        />
      )}
    </div>
  )
}
