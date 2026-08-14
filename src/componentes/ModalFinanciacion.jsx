import { useState } from 'react'
import { Landmark, CreditCard, Truck, FileText, Package } from 'lucide-react'
import Modal from './Modal'

const ESTILO_INPUT =
  'w-full bg-[#0f1420] border border-[#252b3a] rounded-lg px-3 py-2 text-sm text-white ' +
  'focus:outline-none focus:border-[#4f8ef7]/50'
const ESTILO_LABEL = 'text-xs text-[#94a3b8] block mb-1'

const TIPOS = [
  { id: 'prestamo', etiqueta: 'Préstamo', Icono: Landmark },
  { id: 'poliza', etiqueta: 'Póliza crédito', Icono: CreditCard },
  { id: 'leasing', etiqueta: 'Leasing', Icono: Truck },
  { id: 'anticipo', etiqueta: 'Anticipo facturas', Icono: FileText },
  { id: 'otro', etiqueta: 'Otro', Icono: Package },
]

// ═══════════════════════════════════════════════════════════
// MODAL DE FINANCIACIÓN
// ═══════════════════════════════════════════════════════════
// Formulario para dar de alta un préstamo, póliza de crédito,
// leasing, etc. "Conozco fecha inicio y fin" vs "Solo sé la cuota
// mensual" son dos formas distintas de cargar el mismo dato: la
// primera es más precisa, la segunda más rápida si no tenés todos
// los datos del contrato a mano.
export default function ModalFinanciacion({ cuentas, guardar, cerrar }) {
  const [form, setForm] = useState({
    tipo: 'prestamo',
    modoFecha: 'fechas', // "fechas" o "cuota"
    nombre: '',
    entidad: '',
    cuenta_id: '',
    capital_inicial: '',
    capital_pendiente: '',
    tipo_interes: '',
    cuota_mensual: '',
    fecha_inicio: '',
    fecha_fin: '',
    comision_apertura: '',
  })

  const cambiarCampo = (campo, valor) => setForm({ ...form, [campo]: valor })

  const alGuardar = () => {
    if (!form.nombre.trim() || !form.entidad.trim() || form.capital_inicial === '') {
      alert('Completá al menos el nombre, la entidad y el capital inicial.')
      return
    }
    guardar({
      ...form,
      capital_inicial: Number(form.capital_inicial),
      // Si no cargaron "capital pendiente", asumimos que es igual al inicial (préstamo nuevo).
      capital_pendiente: form.capital_pendiente === '' ? Number(form.capital_inicial) : Number(form.capital_pendiente),
      tipo_interes: Number(form.tipo_interes) || 0,
      cuota_mensual: Number(form.cuota_mensual) || 0,
      comision_apertura: Number(form.comision_apertura) || 0,
    })
  }

  return (
    <Modal titulo="Nueva financiación" cerrar={cerrar}>
      <div className="space-y-4">
        <div>
          <label className={ESTILO_LABEL}>Tipo de financiación *</label>
          <div className="grid grid-cols-3 gap-2">
            {TIPOS.map(({ id, etiqueta, Icono }) => (
              <button
                key={id}
                type="button"
                onClick={() => cambiarCampo('tipo', id)}
                className={`flex flex-col items-center gap-1 rounded-lg border p-3 text-xs
                  ${form.tipo === id
                    ? 'border-[#4f8ef7] bg-[#4f8ef7]/10 text-[#4f8ef7]'
                    : 'border-[#252b3a] text-[#94a3b8] hover:bg-[#0f1420]'
                  }`}
              >
                <Icono size={16} />
                {etiqueta}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => cambiarCampo('modoFecha', 'fechas')}
            className={`text-xs rounded-lg border py-2 ${
              form.modoFecha === 'fechas'
                ? 'border-[#4f8ef7] bg-[#4f8ef7]/10 text-[#4f8ef7]'
                : 'border-[#252b3a] text-[#94a3b8]'
            }`}
          >
            📅 Conozco fecha inicio y fin
          </button>
          <button
            type="button"
            onClick={() => cambiarCampo('modoFecha', 'cuota')}
            className={`text-xs rounded-lg border py-2 ${
              form.modoFecha === 'cuota'
                ? 'border-[#4f8ef7] bg-[#4f8ef7]/10 text-[#4f8ef7]'
                : 'border-[#252b3a] text-[#94a3b8]'
            }`}
          >
            💡 Solo sé la cuota mensual
          </button>
        </div>

        <div>
          <label className={ESTILO_LABEL}>Nombre / Descripción *</label>
          <input
            type="text"
            value={form.nombre}
            onChange={(e) => cambiarCampo('nombre', e.target.value)}
            placeholder="Préstamo ICO BBVA 25K..."
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
              placeholder="BBVA, Caixabank..."
              className={ESTILO_INPUT}
            />
          </div>
          <div>
            <label className={ESTILO_LABEL}>Cuenta asociada</label>
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

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={ESTILO_LABEL}>Capital inicial (€) *</label>
            <input
              type="number"
              value={form.capital_inicial}
              onChange={(e) => cambiarCampo('capital_inicial', e.target.value)}
              placeholder="25000"
              className={ESTILO_INPUT}
            />
          </div>
          <div>
            <label className={ESTILO_LABEL}>Capital pendiente (€)</label>
            <input
              type="number"
              value={form.capital_pendiente}
              onChange={(e) => cambiarCampo('capital_pendiente', e.target.value)}
              placeholder="Igual al inicial si es nuevo"
              className={ESTILO_INPUT}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={ESTILO_LABEL}>Tipo de interés (%)</label>
            <input
              type="number"
              step="0.01"
              value={form.tipo_interes}
              onChange={(e) => cambiarCampo('tipo_interes', e.target.value)}
              placeholder="3.5"
              className={ESTILO_INPUT}
            />
          </div>
          <div>
            <label className={ESTILO_LABEL}>Cuota mensual (€)</label>
            <input
              type="number"
              value={form.cuota_mensual}
              onChange={(e) => cambiarCampo('cuota_mensual', e.target.value)}
              placeholder="750"
              className={ESTILO_INPUT}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={ESTILO_LABEL}>Fecha inicio</label>
            <input
              type="date"
              value={form.fecha_inicio}
              onChange={(e) => cambiarCampo('fecha_inicio', e.target.value)}
              className={ESTILO_INPUT}
            />
          </div>
          <div>
            <label className={ESTILO_LABEL}>Fecha fin / renovación</label>
            <input
              type="date"
              value={form.fecha_fin}
              onChange={(e) => cambiarCampo('fecha_fin', e.target.value)}
              className={ESTILO_INPUT}
            />
          </div>
        </div>

        <div>
          <label className={ESTILO_LABEL}>Com. apertura (%)</label>
          <input
            type="number"
            step="0.01"
            value={form.comision_apertura}
            onChange={(e) => cambiarCampo('comision_apertura', e.target.value)}
            placeholder="0.50"
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
