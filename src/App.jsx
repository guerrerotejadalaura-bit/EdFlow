import { useState, useEffect } from 'react'
import { leerDatos, guardarDatos } from './datos/almacenamiento'

// Este es el componente principal. Por ahora lo usamos para probar que
// leer y guardar datos funciona: escribís el nombre de tu empresa, se
// guarda en localStorage, y si recargás la página sigue estando ahí.
export default function App() {
  // "estado" guarda TODOS los datos de la herramienta (cuentas, movimientos,
  // config, etc.). useState(leerDatos) hace que, apenas arranca la app,
  // lea lo que haya guardado y lo use como valor inicial.
  const [estado, setEstado] = useState(leerDatos)

  // useEffect corre este código cada vez que "estado" cambia.
  // Acá le decimos: "cada vez que cambien los datos, guardalos".
  // Así nunca nos olvidamos de guardar a mano en cada función.
  useEffect(() => {
    guardarDatos(estado)
  }, [estado])

  // Cuando el usuario escribe en el campo, actualizamos solo el nombre
  // de la empresa, manteniendo todo lo demás del estado igual.
  const cambiarNombreEmpresa = (nuevoNombre) => {
    setEstado({
      ...estado,
      config: { ...estado.config, empresa: nuevoNombre },
    })
  }

  return (
    <div className="min-h-screen bg-[#0d0f14] flex items-center justify-center p-6">
      <div className="bg-[#171b2a] border border-[#2d3553] rounded-xl p-6 max-w-md w-full space-y-4">
        <div>
          <h1 className="text-sm font-semibold text-white mb-1">
            🎉 Hola, EdFlow
          </h1>
          <p className="text-xs text-[#94a3b8]">
            Probemos que guardar y leer datos funciona.
          </p>
        </div>

        <div>
          <label className="text-xs text-[#94a3b8] block mb-1">
            Nombre de tu empresa
          </label>
          <input
            type="text"
            value={estado.config.empresa}
            onChange={(e) => cambiarNombreEmpresa(e.target.value)}
            placeholder="Escribí algo acá..."
            className="w-full bg-[#0f1420] border border-[#252b3a] rounded-lg px-3 py-2
                       text-sm text-white
                       focus:outline-none focus:border-[#4f8ef7]/50"
          />
        </div>

        <p className="text-xs text-[#64748b]">
          Escribí un nombre, después recargá la página (F5). Si el nombre
          sigue ahí, significa que guardar y leer datos está funcionando.
        </p>
      </div>
    </div>
  )
}
