import { useState } from 'react'
import Modal from './Modal'

const ESTILO_INPUT =
  'w-full bg-[#0f1420] border border-[#252b3a] rounded-lg px-3 py-2 text-sm text-white ' +
  'focus:outline-none focus:border-[#4f8ef7]/50'
const ESTILO_LABEL = 'text-xs text-[#94a3b8] block mb-1'

export default function ModalCategoria({ guardar, cerrar }) {
  const [nombre, setNombre] = useState('')
  const [signo, setSigno] = useState('gasto')
  const [color, setColor] = useState('#64748B')

  const alGuardar = () => {
    if (!nombre.trim()) {
      alert('Escribí un nombre para la categoría.')
      return
    }
    guardar({ nombre, signo, color })
  }

  return (
    <Modal titulo="Nueva categoría" cerrar={cerrar}>
      <div className="space-y-4">
        <div>
          <label className={ESTILO_LABEL}>Nombre de la categoría *</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej: Royalties, Dividendos..."
            className={ESTILO_INPUT}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={ESTILO_LABEL}>Signo por defecto</label>
            <select value={signo} onChange={(e) => setSigno(e.target.value)} className={ESTILO_INPUT}>
              <option value="ingreso">↑ Ingreso (suma)</option>
              <option value="gasto">↓ Gasto (resta)</option>
              <option value="neutro">⇄ Neutro</option>
            </select>
          </div>
          <div>
            <label className={ESTILO_LABEL}>Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-9 h-9 rounded-lg border border-[#252b3a] bg-transparent cursor-pointer"
              />
              <span className="text-xs text-[#64748b]">{color}</span>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            onClick={cerrar}
            className="text-xs text-[#94a3b8] hover:text-white px-4 py-2 rounded-lg border border-[#252b3a]"
          >
            Cancelar
          </button>
          <button
            onClick={alGuardar}
            className="bg-[#4f8ef7] hover:bg-[#4f8ef7]/90 text-white text-xs font-medium rounded-lg px-4 py-2"
          >
            Crear categoría
          </button>
        </div>
      </div>
    </Modal>
  )
}
