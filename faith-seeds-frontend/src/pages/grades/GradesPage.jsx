import { useState, useEffect } from 'react'
import Layout from '../../components/Layout'
import { getBeneficiaries } from '../../services/beneficiary.service'
import { Save, Search } from 'lucide-react'
import api from '../../services/api'

// Detectar cuantos cursos tiene un beneficiario
const getCourseCount = (b, changes) => {
  let max = 0
  for (let n = 1; n <= 9; n++) {
    const course = changes[b.code]?.[`course_${n}`] ?? b.grades?.[`course_${n}`] ?? ''
    const grade = changes[b.code]?.[`grade_${n}`] ?? b.grades?.[`grade_${n}`] ?? ''
    if (course || grade) max = n
  }
  return Math.max(max + 1, 1) // siempre al menos 1 fila extra para agregar
}

const GradesPage = () => {
  const [beneficiaries, setBeneficiaries] = useState([])
  const [changes, setChanges] = useState({})
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      const res = await getBeneficiaries()
      setBeneficiaries(res.data)
    }
    fetchData()
  }, [])

  const handleChange = (code, field, value) => {
    setChanges(prev => ({ ...prev, [code]: { ...prev[code], [field]: value } }))
  }

  const getValue = (b, field) => {
    if (changes[b.code]?.[field] !== undefined) return changes[b.code][field]
    return b.grades?.[field] ?? ''
  }

  const handleSaveAll = async () => {
    setSaving(true)
    try {
      for (const [code, data] of Object.entries(changes)) {
        await api.put(`/beneficiaries/${code}/grades`, data)
      }
      setChanges({})
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
      const res = await getBeneficiaries()
      setBeneficiaries(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  const filtered = beneficiaries.filter(b =>
    `${b.first_name} ${b.last_name} ${b.code}`.toLowerCase().includes(search.toLowerCase())
  )

  const inputClass =
    'w-20 border border-slate-200 rounded px-2 py-1 text-xs text-center focus:outline-none focus:ring-2 focus:ring-blue-400'

  return (
    <Layout title="Calificaciones">
      <div className="flex items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-3 flex-1">
          <p className="text-sm text-slate-500 whitespace-nowrap">
            {filtered.length} beneficiario(s)
          </p>
          <div className="relative flex-1 max-w-sm">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar por nombre o codigo..."
              className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 text-slate-700"
            />
          </div>
        </div>
        <button
          onClick={handleSaveAll}
          disabled={saving || Object.keys(changes).length === 0}
          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg text-sm hover:bg-blue-700 transition font-medium disabled:opacity-50"
        >
          <Save size={15} />
          {saving
            ? 'Guardando...'
            : saved
              ? 'Guardado'
              : `Guardar cambios (${Object.keys(changes).length})`}
        </button>
      </div>

      <div className="space-y-3">
        {filtered.map(b => {
          const avg = getValue(b, 'average')
          const avgNum = parseFloat(avg)
          const courseCount = getCourseCount(b, changes)

          return (
            <div
              key={b.code}
              className={`bg-white rounded-xl border border-slate-200 shadow-sm p-4 ${changes[b.code] ? 'border-blue-300 bg-blue-50' : ''}`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-slate-400">{b.code}</span>
                  <span className="text-sm font-medium text-slate-700">
                    {b.last_name}, {b.first_name}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-xs text-slate-500">Promedio:</label>
                  <input
                    value={avg}
                    onChange={e => handleChange(b.code, 'average', e.target.value)}
                    className={`${inputClass} font-semibold ${avgNum >= 60 ? 'text-emerald-600' : avgNum > 0 ? 'text-red-500' : 'text-slate-400'}`}
                    placeholder="—"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {Array.from({ length: Math.min(courseCount, 9) }, (_, i) => i + 1).map(n => (
                  <div key={n} className="flex items-center gap-1 bg-slate-50 rounded-lg px-2 py-1">
                    <span className="text-xs text-slate-400 w-4">{n}.</span>
                    <input
                      value={getValue(b, `course_${n}`)}
                      onChange={e => handleChange(b.code, `course_${n}`, e.target.value)}
                      className="flex-1 text-xs border-0 bg-transparent focus:outline-none text-slate-700 min-w-0"
                      placeholder="Curso"
                    />
                    <input
                      value={getValue(b, `grade_${n}`)}
                      onChange={e => handleChange(b.code, `grade_${n}`, e.target.value)}
                      className="w-12 text-xs border border-slate-200 rounded px-1 py-0.5 text-center focus:outline-none focus:ring-1 focus:ring-blue-400"
                      placeholder="—"
                    />
                  </div>
                ))}
              </div>
            </div>
          )
        })}
        {filtered.length === 0 && (
          <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-400">
            Sin resultados.
          </div>
        )}
      </div>
    </Layout>
  )
}

export default GradesPage
