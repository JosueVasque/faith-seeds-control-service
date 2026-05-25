import { useState, useEffect } from 'react'
import Layout from '../../components/Layout'
import { getTutors, createTutor, updateTutor, deleteTutor } from '../../services/tutor.service'
import { Pencil, Trash2 } from 'lucide-react'

const emptyForm = { full_name: '', dpi: '', phone: '' }

const TutorsPage = () => {
  const [tutors, setTutors] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [error, setError] = useState('')

  const fetchTutors = async () => {
    const res = await getTutors()
    setTutors(res.data)
  }

  useEffect(() => {
    fetchTutors()
  }, [])

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async () => {
    if (!form.full_name.trim()) return setError('El nombre completo es requerido.')
    setError('')
    try {
      if (editingId) {
        await updateTutor(editingId, form)
      } else {
        await createTutor(form)
      }
      setForm(emptyForm)
      setEditingId(null)
      fetchTutors()
    } catch (err) {
      setError(err.response?.data?.error || 'Error al guardar.')
    }
  }

  const handleEdit = tutor => {
    setEditingId(tutor.id)
    setForm({ full_name: tutor.full_name, dpi: tutor.dpi || '', phone: tutor.phone || '' })
  }

  const handleDelete = async id => {
    if (!confirm('¿Eliminar este tutor?')) return
    await deleteTutor(id)
    fetchTutors()
  }

  const handleCancel = () => {
    setForm(emptyForm)
    setEditingId(null)
    setError('')
  }

  return (
    <Layout title="Tutores">
      {/* Formulario */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-6">
        <h2 className="text-base font-semibold text-slate-700 mb-4">
          {editingId ? 'Editar Tutor' : 'Nuevo Tutor'}
        </h2>
        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <input
            name="full_name"
            value={form.full_name}
            onChange={handleChange}
            placeholder="Nombre completo *"
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 text-slate-700"
          />
          <input
            name="dpi"
            value={form.dpi}
            onChange={handleChange}
            placeholder="DPI"
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 text-slate-700"
          />
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Teléfono"
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 text-slate-700"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm hover:bg-blue-700 transition font-medium"
          >
            {editingId ? 'Actualizar' : 'Guardar'}
          </button>
          {editingId && (
            <button
              onClick={handleCancel}
              className="bg-slate-100 text-slate-600 px-5 py-2 rounded-lg text-sm hover:bg-slate-200 transition font-medium"
            >
              Cancelar
            </button>
          )}
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-500 border-b border-slate-100 bg-slate-50">
              <th className="px-6 py-3 font-medium">ID</th>
              <th className="px-6 py-3 font-medium">Nombre Completo</th>
              <th className="px-6 py-3 font-medium">DPI</th>
              <th className="px-6 py-3 font-medium">Teléfono</th>
              <th className="px-6 py-3 font-medium">Beneficiarios</th>
              <th className="px-6 py-3 font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {tutors.map(tutor => (
              <tr key={tutor.id} className="hover:bg-slate-50 transition">
                <td className="px-6 py-3 text-slate-400 font-mono">{tutor.id}</td>
                <td className="px-6 py-3 font-medium text-slate-700">{tutor.full_name}</td>
                <td className="px-6 py-3 text-slate-500 font-mono">{tutor.dpi || '—'}</td>
                <td className="px-6 py-3 text-slate-500">{tutor.phone || '—'}</td>
                <td className="px-6 py-3">
                  <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-2 py-1 rounded-full">
                    {tutor.beneficiaries?.length || 0}
                  </span>
                </td>
                <td className="px-6 py-3">
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleEdit(tutor)}
                      className="text-slate-400 hover:text-blue-600 transition"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => handleDelete(tutor.id)}
                      className="text-slate-400 hover:text-red-500 transition"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {tutors.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-slate-400">
                  Sin tutores registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Layout>
  )
}

export default TutorsPage
