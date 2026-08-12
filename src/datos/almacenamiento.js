// ═══════════════════════════════════════════════════════════
// ALMACENAMIENTO
// ═══════════════════════════════════════════════════════════
// Este archivo es el ÚNICO lugar de todo el proyecto que sabe que
// estamos usando "localStorage" (la memoria del navegador).
//
// ¿Por qué separarlo así? Porque el día de mañana, cuando esto se
// integre a Sentiax, vamos a cambiar localStorage por Supabase (la
// base de datos real). Si el resto del código solo usa las funciones
// "guardarDatos" y "leerDatos" de ACÁ, ese cambio va a ser fácil:
// solo hay que reescribir este archivo, sin tocar nada más.

import { ESTADO_INICIAL } from './modelo'

// Clave con la que guardamos todo en localStorage.
// (Es como el "nombre de la carpeta" donde queda todo guardado)
const CLAVE_ALMACENAMIENTO = 'edflow_datos'

// Lee los datos guardados. Si no hay nada guardado todavía (primera vez
// que se abre la herramienta), devuelve el estado inicial vacío.
export function leerDatos() {
  try {
    const guardado = localStorage.getItem(CLAVE_ALMACENAMIENTO)
    if (!guardado) return ESTADO_INICIAL

    const datos = JSON.parse(guardado)

    // Nos aseguramos de que, aunque falte algún campo en lo guardado
    // (por ejemplo si agregamos una sección nueva más adelante),
    // la herramienta no se rompa: completamos con los valores vacíos.
    return {
      config: datos.config || ESTADO_INICIAL.config,
      cuentas: datos.cuentas || [],
      financiaciones: datos.financiaciones || [],
      movimientos: datos.movimientos || [],
      categorias: datos.categorias || ESTADO_INICIAL.categorias,
      confirming: datos.confirming || [],
    }
  } catch (error) {
    // Si algo sale mal leyendo (datos corruptos, etc.), no rompemos
    // la app: devolvemos el estado inicial vacío.
    console.error('Error al leer los datos guardados:', error)
    return ESTADO_INICIAL
  }
}

// Guarda el estado completo de la herramienta.
export function guardarDatos(estado) {
  try {
    localStorage.setItem(CLAVE_ALMACENAMIENTO, JSON.stringify(estado))
  } catch (error) {
    console.error('Error al guardar los datos:', error)
  }
}

// Borra todos los datos guardados (para el botón "Borrar todo" de Configuración).
export function borrarDatos() {
  try {
    localStorage.removeItem(CLAVE_ALMACENAMIENTO)
  } catch (error) {
    console.error('Error al borrar los datos:', error)
  }
}
