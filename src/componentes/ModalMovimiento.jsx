import { useState } from 'react'
import Modal from './Modal'
import { fechaDeHoy } from '../utilidades/fechas'

const ESTILO_INPUT =
  'w-full bg-[#0f1420] border border-[#252b3a] rounded-lg px-3 py-2 text-sm text-white ' +
  'focus:outline-none focus:border-[#4f8ef7]/50'
const ESTILO_LABEL = 'text-xs text-[#94a3b8] block mb-1'

// ═══════════════════════════════════════════════════════════
// MODAL DE MOVIMIENTO
// ═══════════════════════════════════════════════════════════
// Formulario para dar de alta un cobro o un pago. Si se marca
// "movimiento recurrente", además elegimos cada cuánto se repite y
// cuántas veces — App.jsx se encarga de generar todos los
// movimientos futuros de una sola vez.
export default function ModalMovimiento({ categorias, cuentas, guardar, cerrar }) {
  const [form, setForm] = useState({
    fecha: fechaDeHoy(),
    importe: '',
    concepto: '',
    categoria: categorias[0]?.id || '',
    cuenta_id: '',
    recurrente: false,
    frecuencia: 'mensual',
    repeticiones: 3,
    notas: '',
  })

  const cambiarCampo = (campo, valor) => setForm({ ...form, [campo]: valor })

  const alGuardar = () => {
    if (!form.fecha || form.importe === '' || !form.concepto.trim() || !form.cuenta_id) {
      alert('Completá al menos la fecha, el importe, el concepto y la cuenta.')
      return
    }
    guardar({ ...form, importe: Number(form.importe) })
  }

  return (
    <Modal titulo="Nuevo movimiento" cerrar={cerrar}>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={ESTILO_LABEL}>Fecha *</label>
            <input
              type="date"
              value={form.fecha}
              onChange={(e) => cambiarCampo('fecha', e.target.value)}
              className={ESTILO_INPUT}
            />
          </div>
          <div>
            <label className={ESTILO_LABEL}>Importe (€) *</label>
            <input
              type="number"
              value={form.importe}
              onChange={(e) => cambiarCampo('importe', e.target.value)}
              placeholder="1500 (o -1500 si es un pago)"
              className={ESTILO_INPUT}
            />
          </div>
        </div>

        <div>
          <label className={ESTILO_LABEL}>Concepto *</label>
          <input
            type="text"
            value={form.concepto}
            onChange={(e) => cambiarCampo('concepto', e.target.value)}
            placeholder="Descripción del movimiento..."
            className={ESTILO_INPUT}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={ESTILO_LABEL}>Categoría</label>
            <select
              value={form.categoria}
              onChange={(e) => cambiarCampo('categoria', e.target.value)}
              className={ESTILO_INPUT}
            >
              {categorias.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={ESTILO_LABEL}>Cuenta *</label>
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
        </div>

        {/* ── Recurrencia ── */}
        <div>
          <label className="flex items-start gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.recurrente}
              onChange={(e) => cambiarCampo('recurrente', e.target.checked)}
              className="mt-0.5"
            />
            <span>
              <span className="text-sm text-[#cbd5e1] block">¿Es un movimiento recurrente?</span>
              <span className="text-xs text-[#64748b]">Se repetirá automáticamente según la frecuencia que elijas</span>
            </span>
          </label>

          {form.recurrente && (
            <div className="grid grid-cols-2 gap-3 mt-3 pl-6">
              <div>
                <label className={ESTILO_LABEL}>Frecuencia</label>
                <select
                  value={form.frecuencia}
                  onChange={(e) => cambiarCampo('frecuencia', e.target.value)}
                  className={ESTILO_INPUT}
                >
                  <option value="mensual">Mensual</option>
                  <option value="trimestral">Trimestral</option>
                  <option value="semestral">Semestral</option>
                  <option value="anual">Anual</option>
                </select>
              </div>
              <div>
                <label className={ESTILO_LABEL}>Cantidad de repeticiones</label>
                <input
                  type="number"
                  min="1"
                  value={form.repeticiones}
                  onChange={(e) => cambiarCampo('repeticiones', e.target.value)}
                  className={ESTILO_INPUT}
                />
              </div>
            </div>
          )}
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
            Guardar
          </button>
        </div>
      </div>
    </Modal>
  )
}
