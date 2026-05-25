import { useState, useEffect } from 'react'
import Layout from '../../components/Layout'
import { getBeneficiaries } from '../../services/beneficiary.service'
import { Save } from 'lucide-react'
import api from '../../services/api'

const GradesPage = () => {
  const [beneficiaries, setBeneficiaries] = useState([])
  const [changes, setChanges] = useState({})
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      const res = await getBeneficiaries()
      setBeneficiaries(res.data)
    }
    fetchData()
  }, [])

  const handleChange = (code, field, value) => {
    setChanges(prev => ({
      ...prev,
      [code]: { ...prev[code], [field]: value },
    }))
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

  const inputClass =
    'w-20 border border-slate-200 rounded px-2 py-1 text-xs text-center focus:outline-none focus:ring-2 focus:ring-blue-400'

  return (
    <Layout title="Calificaciones">
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-slate-500">{beneficiaries.length} beneficiario(s)</p>
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

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-500 border-b border-slate-100 bg-slate-50">
              <th className="px-4 py-3 font-medium">Código</th>
              <th className="px-4 py-3 font-medium">Nombre</th>
              <th className="px-4 py-3 font-medium text-center">Promedio</th>
              <th className="px-4 py-3 font-medium text-center">Curso 1</th>
              <th className="px-4 py-3 font-medium text-center">Nota 1</th>
              <th className="px-4 py-3 font-medium text-center">Curso 2</th>
              <th className="px-4 py-3 font-medium text-center">Nota 2</th>
              <th className="px-4 py-3 font-medium text-center">Curso 3</th>
              <th className="px-4 py-3 font-medium text-center">Nota 3</th>
              <th className="px-4 py-3 font-medium text-center">Curso 4</th>
              <th className="px-4 py-3 font-medium text-center">Nota 4</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {beneficiaries.map(b => {
              const avg = getValue(b, 'average')
              const avgNum = parseFloat(avg)
              return (
                <tr
                  key={b.code}
                  className={`hover:bg-slate-50 transition ${changes[b.code] ? 'bg-blue-50' : ''}`}
                >
                  <td className="px-4 py-2 font-mono text-slate-500 text-xs">{b.code}</td>
                  <td className="px-4 py-2 text-slate-700">
                    {b.last_name}, {b.first_name}
                  </td>
                  <td className="px-4 py-2 text-center">
                    <input
                      value={avg}
                      onChange={e => handleChange(b.code, 'average', e.target.value)}
                      className={`${inputClass} font-semibold ${
                        avgNum >= 60
                          ? 'text-emerald-600'
                          : avgNum > 0
                            ? 'text-red-500'
                            : 'text-slate-400'
                      }`}
                      placeholder="—"
                    />
                  </td>
                  {[1, 2, 3, 4].map(n => (
                    <>
                      <td key={`c${n}`} className="px-4 py-2 text-center">
                        <input
                          value={getValue(b, `course_${n}`)}
                          onChange={e => handleChange(b.code, `course_${n}`, e.target.value)}
                          className="w-28 border border-slate-200 rounded px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-blue-400"
                          placeholder="Curso"
                        />
                      </td>
                      <td key={`g${n}`} className="px-4 py-2 text-center">
                        <input
                          value={getValue(b, `grade_${n}`)}
                          onChange={e => handleChange(b.code, `grade_${n}`, e.target.value)}
                          className={inputClass}
                          placeholder="—"
                        />
                      </td>
                    </>
                  ))}
                </tr>
              )
            })}
            {beneficiaries.length === 0 && (
              <tr>
                <td colSpan={11} className="px-6 py-8 text-center text-slate-400">
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

export default GradesPage
