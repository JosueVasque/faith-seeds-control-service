import { useState, useEffect } from 'react'
import Layout from '../../components/Layout'
import {
  getSchools,
  createSchool,
  updateSchool,
  deleteSchool,
  getGrades,
  createGrade,
  updateGrade,
  deleteGrade,
  getSchedules,
  createSchedule,
  updateSchedule,
  deleteSchedule,
} from '../../services/catalog.service'
import { Pencil, Trash2 } from 'lucide-react'

const CatalogSection = ({ title, items, onCreate, onUpdate, onDelete }) => {
  const [name, setName] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editName, setEditName] = useState('')

  const handleCreate = async () => {
    if (!name.trim()) return
    await onCreate({ name })
    setName('')
  }

  const handleUpdate = async id => {
    if (!editName.trim()) return
    await onUpdate(id, { name: editName })
    setEditingId(null)
    setEditName('')
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
      <h2 className="text-base font-semibold text-slate-700 mb-4">{title}</h2>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder={`Nuevo ${title.toLowerCase()}...`}
          className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 text-slate-700"
        />
        <button
          onClick={handleCreate}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition font-medium"
        >
          Agregar
        </button>
      </div>

      <ul className="divide-y divide-slate-100">
        {items.map(item => (
          <li key={item.id} className="py-2 flex items-center justify-between gap-2">
            {editingId === item.id ? (
              <>
                <input
                  type="text"
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  className="flex-1 border border-slate-200 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <button
                  onClick={() => handleUpdate(item.id)}
                  className="bg-emerald-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-emerald-600 transition"
                >
                  Guardar
                </button>
                <button
                  onClick={() => setEditingId(null)}
                  className="bg-slate-100 text-slate-600 px-3 py-1 rounded-lg text-sm hover:bg-slate-200 transition"
                >
                  Cancelar
                </button>
              </>
            ) : (
              <>
                <span className="text-sm text-slate-700">{item.name}</span>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setEditingId(item.id)
                      setEditName(item.name)
                    }}
                    className="text-slate-400 hover:text-blue-600 transition"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => onDelete(item.id)}
                    className="text-slate-400 hover:text-red-500 transition"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
        {items.length === 0 && <li className="text-sm text-slate-400 py-3">Sin registros aún.</li>}
      </ul>
    </div>
  )
}

const CatalogsPage = () => {
  const [schools, setSchools] = useState([])
  const [grades, setGrades] = useState([])
  const [schedules, setSchedules] = useState([])

  const fetchAll = async () => {
    const [s, g, sc] = await Promise.all([getSchools(), getGrades(), getSchedules()])
    setSchools(s.data)
    setGrades(g.data)
    setSchedules(sc.data)
  }

  useEffect(() => {
    fetchAll()
  }, [])

  return (
    <Layout title="Catálogos">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <CatalogSection
          title="Colegios"
          items={schools}
          onCreate={async data => {
            await createSchool(data)
            fetchAll()
          }}
          onUpdate={async (id, data) => {
            await updateSchool(id, data)
            fetchAll()
          }}
          onDelete={async id => {
            await deleteSchool(id)
            fetchAll()
          }}
        />
        <CatalogSection
          title="Grados"
          items={grades}
          onCreate={async data => {
            await createGrade(data)
            fetchAll()
          }}
          onUpdate={async (id, data) => {
            await updateGrade(id, data)
            fetchAll()
          }}
          onDelete={async id => {
            await deleteGrade(id)
            fetchAll()
          }}
        />
        <CatalogSection
          title="Horarios"
          items={schedules}
          onCreate={async data => {
            await createSchedule(data)
            fetchAll()
          }}
          onUpdate={async (id, data) => {
            await updateSchedule(id, data)
            fetchAll()
          }}
          onDelete={async id => {
            await deleteSchedule(id)
            fetchAll()
          }}
        />
      </div>
    </Layout>
  )
}

export default CatalogsPage
