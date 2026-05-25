import { useState, useEffect } from 'react'
import Layout from '../../components/Layout'
import {
  getBeneficiaries,
  createBeneficiary,
  updateBeneficiary,
  deleteBeneficiary,
} from '../../services/beneficiary.service'
import { getTutors } from '../../services/tutor.service'
import { getSchools, getGrades } from '../../services/catalog.service'
import { Pencil, Trash2 } from 'lucide-react'
import api from '../../services/api'

const emptyForm = {
  code: '',
  category: 'C',
  first_name: '',
  last_name: '',
  sector: '',
  status: '',
  gender: '',
  age: '',
  birth_date: '',
  tutor_id: '',
  school_id: '',
  grade_id: '',
  tutoring_day: '',
  tutoring_hour: '',
  phone: '',
}

const CATEGORIES = [
  { value: 'C', label: 'Comunidad (FSF-C)' },
  { value: 'B', label: 'Botadero (FSF-B)' },
]

const BeneficiariesPage = () => {
  const [beneficiaries, setBeneficiaries] = useState([])
  const [tutors, setTutors] = useState([])
  const [schools, setSchools] = useState([])
  const [grades, setGrades] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editingCode, setEditingCode] = useState(null)
  const [previewCode, setPreviewCode] = useState('')
  const [manualCode, setManualCode] = useState(false)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)

  const fetchAll = async () => {
    const [b, t, s, g] = await Promise.all([
      getBeneficiaries(),
      getTutors(),
      getSchools(),
      getGrades(),
    ])
    setBeneficiaries(b.data)
    setTutors(t.data)
    setSchools(s.data)
    setGrades(g.data)
  }

  const fetchPreview = async category => {
    try {
      const res = await api.get(`/beneficiaries/preview-code/${category}`)
      setPreviewCode(res.data.code)
    } catch {
      setPreviewCode('')
    }
  }

  useEffect(() => {
    fetchAll()
  }, [])

  useEffect(() => {
    if (!editingCode && !manualCode) fetchPreview(form.category)
  }, [form.category, editingCode, manualCode])

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async () => {
    if (!form.first_name.trim() || !form.last_name.trim())
      return setError('Nombres y apellidos son requeridos.')
    if (!editingCode && !manualCode && !form.category) return setError('Seleccioná una categoría.')
    setError('')
    try {
      const payload = { ...form }
      if (!manualCode) delete payload.code
      if (editingCode) {
        await updateBeneficiary(editingCode, payload)
      } else {
        await createBeneficiary(payload)
      }
      setForm(emptyForm)
      setEditingCode(null)
      setManualCode(false)
      setShowForm(false)
      fetchAll()
      fetchPreview('C')
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Error al guardar.')
    }
  }

  const handleEdit = b => {
    setEditingCode(b.code)
    setManualCode(true)
    setShowForm(true)
    setForm({
      code: b.code,
      category: b.code.includes('-B') ? 'B' : 'C',
      first_name: b.first_name,
      last_name: b.last_name,
      sector: b.sector || '',
      status: b.status || '',
      gender: b.gender || '',
      age: b.age || '',
      birth_date: b.birth_date || '',
      tutor_id: b.tutor_id || '',
      school_id: b.school_id || '',
      grade_id: b.grade_id || '',
      tutoring_day: b.tutoring_day || '',
      tutoring_hour: b.tutoring_hour || '',
      phone: b.phone || '',
    })
  }

  const handleDelete = async code => {
    if (!confirm(`¿Eliminar beneficiario ${code}?`)) return
    await deleteBeneficiary(code)
    fetchAll()
  }

  const handleCancel = () => {
    setForm(emptyForm)
    setEditingCode(null)
    setManualCode(false)
    setShowForm(false)
    setError('')
    fetchPreview('C')
  }

  const inputClass =
    'border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 text-slate-700 w-full'

  return (
    <Layout title="Beneficiarios">
      {/* Header con botón */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-slate-500">
          {beneficiaries.length} beneficiario(s) registrado(s)
        </p>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm hover:bg-blue-700 transition font-medium"
          >
            + Nuevo Beneficiario
          </button>
        )}
      </div>

      {/* Formulario */}
      {showForm && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-6">
          <h2 className="text-base font-semibold text-slate-700 mb-4">
            {editingCode ? `Editando: ${editingCode}` : 'Nuevo Beneficiario'}
          </h2>
          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {!editingCode && (
              <div>
                <label className="text-xs font-medium text-slate-500 mb-1 block">Categoría</label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  disabled={manualCode}
                  className={inputClass}
                >
                  {CATEGORIES.map(c => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">
                Código{' '}
                {!editingCode && !manualCode && (
                  <span className="text-blue-500 font-semibold ml-1">→ {previewCode}</span>
                )}
              </label>
              <div className="flex gap-2 items-center">
                <input
                  name="code"
                  value={manualCode ? form.code : previewCode}
                  onChange={handleChange}
                  disabled={!manualCode}
                  placeholder="FSF-C001"
                  className={`${inputClass} font-mono disabled:bg-slate-50`}
                />
                {!editingCode && (
                  <button
                    onClick={() => {
                      setManualCode(!manualCode)
                      if (!manualCode) setForm({ ...form, code: previewCode })
                    }}
                    className="text-xs text-blue-500 hover:underline whitespace-nowrap"
                  >
                    {manualCode ? 'Auto' : 'Editar'}
                  </button>
                )}
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">Nombres *</label>
              <input
                name="first_name"
                value={form.first_name}
                onChange={handleChange}
                placeholder="Nombres"
                className={inputClass}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">Apellidos *</label>
              <input
                name="last_name"
                value={form.last_name}
                onChange={handleChange}
                placeholder="Apellidos"
                className={inputClass}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">Teléfono</label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Teléfono"
                className={inputClass}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">Condición</label>
              <input
                name="status"
                value={form.status}
                onChange={handleChange}
                placeholder="ej. Becado"
                className={inputClass}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">Género</label>
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="">Seleccionar</option>
                <option value="M">Masculino</option>
                <option value="F">Femenino</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">Edad</label>
              <input
                name="age"
                type="number"
                value={form.age}
                onChange={handleChange}
                placeholder="Edad"
                className={inputClass}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">
                Fecha de Nacimiento
              </label>
              <input
                name="birth_date"
                type="date"
                value={form.birth_date}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">Tutor</label>
              <select
                name="tutor_id"
                value={form.tutor_id}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="">Seleccionar Tutor</option>
                {tutors.map(t => (
                  <option key={t.id} value={t.id}>
                    {t.full_name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">Colegio</label>
              <select
                name="school_id"
                value={form.school_id}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="">Seleccionar Colegio</option>
                {schools.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">Grado</label>
              <select
                name="grade_id"
                value={form.grade_id}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="">Seleccionar Grado</option>
                {grades.map(g => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">
                Día de Tutorías
              </label>
              <input
                name="tutoring_day"
                value={form.tutoring_day}
                onChange={handleChange}
                placeholder="ej. Martes"
                className={inputClass}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">
                Hora de Tutorías
              </label>
              <input
                name="tutoring_hour"
                value={form.tutoring_hour}
                onChange={handleChange}
                placeholder="ej. 2pm a 4pm"
                className={inputClass}
              />
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleSubmit}
              className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm hover:bg-blue-700 transition font-medium"
            >
              {editingCode ? 'Actualizar' : 'Guardar'}
            </button>
            <button
              onClick={handleCancel}
              className="bg-slate-100 text-slate-600 px-5 py-2 rounded-lg text-sm hover:bg-slate-200 transition font-medium"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Tabla */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-500 border-b border-slate-100 bg-slate-50">
              <th className="px-6 py-3 font-medium">Código</th>
              <th className="px-6 py-3 font-medium">Nombres</th>
              <th className="px-6 py-3 font-medium">Apellidos</th>
              <th className="px-6 py-3 font-medium">Sector</th>
              <th className="px-6 py-3 font-medium">Condición</th>
              <th className="px-6 py-3 font-medium">Tutor</th>
              <th className="px-6 py-3 font-medium">Colegio</th>
              <th className="px-6 py-3 font-medium">Grado</th>
              <th className="px-6 py-3 font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {beneficiaries.map(b => (
              <tr key={b.code} className="hover:bg-slate-50 transition">
                <td className="px-6 py-3 font-mono text-slate-500">{b.code}</td>
                <td className="px-6 py-3 text-slate-700">{b.first_name}</td>
                <td className="px-6 py-3 text-slate-700">{b.last_name}</td>
                <td className="px-6 py-3">
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                      b.is_botadero ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {b.is_botadero ? 'Botadero' : 'Comunidad'}
                  </span>
                </td>
                <td className="px-6 py-3 text-slate-500">{b.status || '—'}</td>
                <td className="px-6 py-3 text-slate-500">{b.tutor?.full_name || '—'}</td>
                <td className="px-6 py-3 text-slate-500">{b.school?.name || '—'}</td>
                <td className="px-6 py-3 text-slate-500">{b.grade?.name || '—'}</td>
                <td className="px-6 py-3">
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleEdit(b)}
                      className="text-slate-400 hover:text-blue-600 transition"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => handleDelete(b.code)}
                      className="text-slate-400 hover:text-red-500 transition"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {beneficiaries.length === 0 && (
              <tr>
                <td colSpan={9} className="px-6 py-8 text-center text-slate-400">
                  Sin beneficiarios registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Layout>
  )
}

export default BeneficiariesPage
