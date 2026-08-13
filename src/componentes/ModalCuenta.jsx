import { useState } from 'react'
import Modal from './Modal'

// ═══════════════════════════════════════════════════════════
// MODAL DE CUENTA
// ═══════════════════════════════════════════════════════════
// Formulario para dar de alta (o editar) una cuenta bancaria.
// Sirve para las dos cosas: si le pasamos "cuentaExistente", arranca
// con esos datos cargados (modo edición). Si no, arranca vacío
// (modo alta nueva).

const ESTILO_INPUT =
  'w-full bg-[#0f1420] border border-[#252b3a] rounded-lg px-3 py-2 text-sm text-white ' +
  'focus:outline-none focus:border-[#4f8ef7]/50'
const ESTILO_LABEL = 'text-xs text-[#94a3b8] block mb-1'

export default function ModalCuenta({ cuentaExistente, guardar, cerrar }) {
  // Estado local del formulario: mientras el usuario escribe, los
  // cambios quedan ACÁ. Recién al tocar "Guardar cuenta" se los
  // mandamos al resto de la app.
  const [form, setForm] = useState(
    cuentaExistente || {
      nombre: '',
      entidad: '',
      tipo: 'corriente',
      saldo: '',
      iban: '',
      limite: '',
      color: '#3B82F6',
    }
  )

  // Actualiza un solo campo del formulario, manteniendo el resto igual.
  const cambiarCampo = (campo, valor) => setForm({ ...form, [campo]: valor })

  const alGuardar = () => {
    // Validación simple: nombre, entidad y saldo son obligatorios.
    if (!form.nombre.trim() || !form.entidad.trim() || form.saldo === '') {
      alert('Completá al menos el nombre, la entidad y el saldo actual.')
      return
    }
    guardar({ ...form, saldo: Number(form.saldo), limite: Number(form.limite) || 0 })
  }

  return (
    <Modal titulo={cuentaExistente ? 'Editar cuenta bancaria' : 'Nueva cuenta bancaria'} cerrar={cerrar}>
      <div className="space-y-4">
        <div>
          <label className={ESTILO_LABEL}>Nombre / Alias *</label>
          <input
            type="text"
            value={form.nombre}
            onChange={(e) => cambiarCampo('nombre', e.target.value)}
            placeholder="BBVA 4521 · Operaciones"
            className={ESTILO_INPUT}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={ESTILO_LABEL}>Entidad *</label>
            <input
              type="text"
              value={form.entidad}
              onChange={(e) => cambiarCampo('entidad', e.target.value)}
              placeholder="BBVA"
              className={ESTILO_INPUT}
            />
          </div>
          <div>
            <label className={ESTILO_LABEL}>Tipo</label>
            <select
              value={form.tipo}
              onChange={(e) => cambiarCampo('tipo', e.target.value)}
              className={ESTILO_INPUT}
            >
              <option value="corriente">Cuenta corriente</option>
              <option value="poliza">Póliza de crédito</option>
            </select>
          </div>
        </div>

        <div>
          <label className={ESTILO_LABEL}>Saldo actual (€) *</label>
          <input
            type="number"
            value={form.saldo}
            onChange={(e) => cambiarCampo('saldo', e.target.value)}
            placeholder="0"
            className={ESTILO_INPUT}
          />
        </div>

        {/* El "límite" solo aplica a pólizas de crédito, por eso solo
            lo mostramos cuando el tipo elegido es "poliza". */}
        {form.tipo === 'poliza' && (
          <div>
            <label className={ESTILO_LABEL}>Límite de la póliza (€)</label>
            <input
              type="number"
              value={form.limite}
              onChange={(e) => cambiarCampo('limite', e.target.value)}
              placeholder="25000"
              className={ESTILO_INPUT}
            />
          </div>
        )}

        <div>
          <label className={ESTILO_LABEL}>IBAN (opcional)</label>
          <input
            type="text"
            value={form.iban}
            onChange={(e) => cambiarCampo('iban', e.target.value)}
            placeholder="ES12 0049 1234..."
            className={ESTILO_INPUT}
          />
        </div>

        <div>
          <label className={ESTILO_LABEL}>Color de identificación</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={form.color}
              onChange={(e) => cambiarCampo('color', e.target.value)}
              className="w-9 h-9 rounded-lg border border-[#252b3a] bg-transparent cursor-pointer"
            />
            <span className="text-xs text-[#64748b]">{form.color}</span>
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
            Guardar cuenta
          </button>
        </div>
      </div>
    </Modal>
  )
}
