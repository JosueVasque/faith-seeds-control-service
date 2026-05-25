import { useState, useEffect } from 'react'
import Layout from '../../components/Layout'
import { getBeneficiaries } from '../../services/beneficiary.service'
import { Save, Plus, Trash2 } from 'lucide-react'
import api from '../../services/api'

const AttendancesPage = () => {
  const [beneficiaries, setBeneficiaries] = useState([])
  const [sessions, setSessions] = useState([])
  const [changes, setChanges] = useState({})
  const [newDate, setNewDate] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const res = await getBeneficiaries()
    const data = res.data
    setBeneficiaries(data)

    // Extraer todas las fechas únicas de sesión
    const dateSet = new Set()
    data.forEach(b => {
      b.attendance?.forEach(a => dateSet.add(a.session_date))
    })
    setSessions([...dateSet].sort())
  }

  const getAttended = (b, date) => {
    if (changes[b.code]?.[date] !== undefined) return changes[b.code][date]
    return b.attendance?.find(a => a.session_date === date)?.attended || false
  }

  const handleToggle = (code, date) => {
    const current = getAttended(
      beneficiaries.find(b => b.code === code),
      date
    )
    setChanges(prev => ({
      ...prev,
      [code]: { ...prev[code], [date]: !current },
    }))
  }

  const handleAddSession = () => {
    if (!newDate || sessions.includes(newDate)) return
    setSessions(prev => [...prev, newDate].sort())
    setNewDate('')
  }

  const handleRemoveSession = date => {
    if (!confirm(`¿Eliminar la sesión del ${date}?`)) return
    setSessions(prev => prev.filter(d => d !== date))
  }

  const handleSaveAll = async () => {
    setSaving(true)
    try {
      for (const [code, dates] of Object.entries(changes)) {
        for (const [date, attended] of Object.entries(dates)) {
          await api.post(`/beneficiaries/${code}/attendance`, { session_date: date, attended })
        }
      }
      setChanges({})
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
      await fetchData()
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  const getTotalAttended = b => {
    return sessions.filter(date => getAttended(b, date)).length
  }

  return (
    <Layout title="Asistencias">
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        {/* Agregar sesión */}
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={newDate}
            onChange={e => setNewDate(e.target.value)}
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={handleAddSession}
            className="flex items-center gap-2 bg-slate-700 text-white px-4 py-2 rounded-lg text-sm hover:bg-slate-800 transition font-medium"
          >
            <Plus size={15} />
            Agregar Sesión
          </button>
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

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-x-auto">
        <table className="text-sm">
          <thead>
            <tr className="text-left text-slate-500 border-b border-slate-100 bg-slate-50">
              <th className="px-4 py-3 font-medium whitespace-nowrap">Código</th>
              <th className="px-4 py-3 font-medium whitespace-nowrap">Nombre</th>
              {sessions.map(date => (
                <th key={date} className="px-2 py-3 font-medium text-center whitespace-nowrap">
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-xs">{date}</span>
                    <button
                      onClick={() => handleRemoveSession(date)}
                      className="text-slate-300 hover:text-red-400 transition"
                    >
                      <Trash2 size={11} />
                    </button>
                  </div>
                </th>
              ))}
              <th className="px-4 py-3 font-medium text-center whitespace-nowrap">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {beneficiaries.map(b => (
              <tr
                key={b.code}
                className={`hover:bg-slate-50 transition ${changes[b.code] ? 'bg-blue-50' : ''}`}
              >
                <td className="px-4 py-2 font-mono text-slate-500 text-xs whitespace-nowrap">
                  {b.code}
                </td>
                <td className="px-4 py-2 text-slate-700 whitespace-nowrap">
                  {b.last_name}, {b.first_name}
                </td>
                {sessions.map(date => (
                  <td key={date} className="px-2 py-2 text-center">
                    <input
                      type="checkbox"
                      checked={getAttended(b, date)}
                      onChange={() => handleToggle(b.code, date)}
                      className="w-4 h-4 accent-blue-600 cursor-pointer"
                    />
                  </td>
                ))}
                <td className="px-4 py-2 text-center">
                  <span className="font-semibold text-slate-700">{getTotalAttended(b)}</span>
                  <span className="text-slate-400 text-xs">/{sessions.length}</span>
                </td>
              </tr>
            ))}
            {beneficiaries.length === 0 && (
              <tr>
                <td colSpan={sessions.length + 3} className="px-6 py-8 text-center text-slate-400">
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

export default AttendancesPage
