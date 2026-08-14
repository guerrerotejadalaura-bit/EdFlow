import { useState } from 'react'
import Modal from './Modal'

const ESTILO_INPUT =
  'w-full bg-[#0f1420] border border-[#252b3a] rounded-lg px-3 py-2 text-sm text-white ' +
  'focus:outline-none focus:border-[#4f8ef7]/50'
const ESTILO_LABEL = 'text-xs text-[#94a3b8] block mb-1'

// ═══════════════════════════════════════════════════════════
// MODAL DE LÍNEA DE CONFIRMING
// ═══════════════════════════════════════════════════════════
// Una línea de confirming es como una "línea de crédito" con
// proveedores: tiene un límite, y cada pago que hacés a través de
// ella consume parte de ese límite (eso se registra después, esta
// ventana solo da de alta la línea en sí).
export default function ModalConfirmingLinea({ cuentas, lineaExistente, guardar, cerrar }) {
  const editando = Boolean(lineaExistente)

  const [form, setForm] = useState(
    lineaExistente || {
      nombre: '',
      entidad: '',
      limite: '',
      cuenta_id: '',
      notas: '',
    }
  )

  const cambiarCampo = (campo, valor) => setForm({ ...form, [campo]: valor })

  const alGuardar = () => {
    if (!form.nombre.trim() || !form.entidad.trim() || form.limite === '') {
      alert('Completá al menos el nombre de la línea, la entidad y el límite.')
      return
    }
    guardar({ ...form, limite: Number(form.limite) })
  }

  return (
    <Modal titulo={editando ? 'Editar línea de confirming' : 'Nueva línea de confirming'} cerrar={cerrar}>
      <div className="space-y-4">
        <p className="text-xs text-[#94a3b8]">
          Definí el límite de la línea. Los pagos a proveedores se registran después, descontando del disponible.
        </p>

        <div>
          <label className={ESTILO_LABEL}>Nombre de la línea *</label>
          <input
            type="text"
            value={form.nombre}
            onChange={(e) => cambiarCampo('nombre', e.target.value)}
            placeholder="Confirming BBVA proveedores 2025"
            className={ESTILO_INPUT}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={ESTILO_LABEL}>Entidad financiera *</label>
            <input
              type="text"
              value={form.entidad}
              onChange={(e) => cambiarCampo('entidad', e.target.value)}
              placeholder="BBVA"
              className={ESTILO_INPUT}
            />
          </div>
          <div>
            <label className={ESTILO_LABEL}>Límite (€) *</label>
            <input
              type="number"
              value={form.limite}
              onChange={(e) => cambiarCampo('limite', e.target.value)}
              placeholder="100000"
              className={ESTILO_INPUT}
            />
          </div>
        </div>

        <div>
          <label className={ESTILO_LABEL}>Cuenta de cargo (vencimientos)</label>
          <select
            value={form.cuenta_id}
            onChange={(e) => cambiarCampo('cuenta_id', e.target.value)}
            className={ESTILO_INPUT}
          >
            <option value="">— Selecciona cuenta —</option>
            {cuentas.map((c) => (
              <option key={c.id} value={c.id}>{c.nombre}</option>
            ))}
          </select>
        </div>

        <div>
          <label className={ESTILO_LABEL}>Notas</label>
          <input
            type="text"
            value={form.notas}
            onChange={(e) => cambiarCampo('notas', e.target.value)}
            placeholder="Opcional..."
            className={ESTILO_INPUT}
          />
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
            {editando ? 'Guardar cambios' : 'Crear línea'}
          </button>
        </div>
      </div>
    </Modal>
  )
}
