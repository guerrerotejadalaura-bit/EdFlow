import { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import Modal from './Modal'
import { fechaDeHoy } from '../utilidades/fechas'

const ESTILO_INPUT =
  'w-full bg-[#0f1420] border border-[#252b3a] rounded-lg px-3 py-2 text-sm text-white ' +
  'focus:outline-none focus:border-[#4f8ef7]/50'
const ESTILO_LABEL = 'text-xs text-[#94a3b8] block mb-1'

// ═══════════════════════════════════════════════════════════
// MODAL DE TRASPASO
// ═══════════════════════════════════════════════════════════
// Un traspaso es dinero que sale de una cuenta propia y entra en
// otra cuenta propia (por eso no suma ni resta al total: solo mueve
// plata de un lado a otro). Genera DOS movimientos vinculados: una
// salida en la cuenta de origen, y una entrada en la de destino.
export default function ModalTraspaso({ cuentas, guardar, cerrar }) {
  const [form, setForm] = useState({
    origen_id: '',
    destino_id: '',
    importe: '',
    fecha: fechaDeHoy(),
    concepto: 'Traspaso entre cuentas',
    notas: '',
    periodico: false,
    frecuencia: 'mensual',
    repeticiones: 3,
  })

  const cambiarCampo = (campo, valor) => setForm({ ...form, [campo]: valor })

  const alGuardar = () => {
    if (!form.origen_id || !form.destino_id || form.importe === '' || !form.fecha) {
      alert('Completá la cuenta de origen, destino, el importe y la fecha.')
      return
    }
    if (form.origen_id === form.destino_id) {
      alert('El origen y el destino tienen que ser cuentas distintas.')
      return
    }
    guardar({ ...form, importe: Number(form.importe) })
  }

  return (
    <Modal titulo="⇄ Traspaso entre cuentas" cerrar={cerrar}>
      <div className="space-y-4">
        <p className="text-xs text-[#94a3b8]">
          Genera dos apuntes vinculados: una <span className="text-[#f87171]">salida</span> de la cuenta
          origen y una <span className="text-[#34d399]">entrada</span> en la cuenta destino. Ambos aparecen
          en la previsión.
        </p>

        <div className="grid grid-cols-[1fr_auto_1fr] gap-2 items-end">
          <div className="bg-[#f87171]/5 border border-[#f87171]/20 rounded-lg p-3">
            <label className="text-xs text-[#f87171] block mb-1">↑ ORIGEN (sale)</label>
            <select
              value={form.origen_id}
              onChange={(e) => cambiarCampo('origen_id', e.target.value)}
              className={ESTILO_INPUT}
            >
              <option value="">— Selecciona cuenta —</option>
              {cuentas.map((c) => (
                <option key={c.id} value={c.id}>{c.nombre}</option>
              ))}
            </select>
          </div>
          <ArrowRight size={18} className="text-[#64748b] mb-3" />
          <div className="bg-[#34d399]/5 border border-[#34d399]/20 rounded-lg p-3">
            <label className="text-xs text-[#34d399] block mb-1">↓ DESTINO (entra)</label>
            <select
              value={form.destino_id}
              onChange={(e) => cambiarCampo('destino_id', e.target.value)}
              className={ESTILO_INPUT}
            >
              <option value="">— Selecciona cuenta —</option>
              {cuentas.map((c) => (
                <option key={c.id} value={c.id}>{c.nombre}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={ESTILO_LABEL}>Importe (€) *</label>
            <input
              type="number"
              value={form.importe}
              onChange={(e) => cambiarCampo('importe', e.target.value)}
              placeholder="5000"
              className={ESTILO_INPUT}
            />
          </div>
          <div>
            <label className={ESTILO_LABEL}>Fecha *</label>
            <input
              type="date"
              value={form.fecha}
              onChange={(e) => cambiarCampo('fecha', e.target.value)}
              className={ESTILO_INPUT}
            />
          </div>
        </div>

        <div>
          <label className={ESTILO_LABEL}>Concepto</label>
          <input
            type="text"
            value={form.concepto}
            onChange={(e) => cambiarCampo('concepto', e.target.value)}
            className={ESTILO_INPUT}
          />
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

        <div>
          <label className="flex items-start gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.periodico}
              onChange={(e) => cambiarCampo('periodico', e.target.checked)}
              className="mt-0.5"
            />
            <span>
              <span className="text-sm text-[#cbd5e1] block">¿Traspaso periódico?</span>
              <span className="text-xs text-[#64748b]">
                Genera varios traspasos con la misma frecuencia (ej: disposición mensual de póliza)
              </span>
            </span>
          </label>

          {form.periodico && (
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
            Registrar traspaso
          </button>
        </div>
      </div>
    </Modal>
  )
}
