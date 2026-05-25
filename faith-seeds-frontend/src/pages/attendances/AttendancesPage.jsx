import { useState, useEffect } from 'react'
import Layout from '../../components/Layout'
import { getBeneficiaries } from '../../services/beneficiary.service'
import { Save, Plus, Trash2, Search, ChevronLeft, ChevronRight } from 'lucide-react'
import api from '../../services/api'

const today = new Date()
const todayStr = today.toISOString().split('T')[0]

const getWeekNumber = dateStr => {
  const date = new Date(dateStr)
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1)
  return Math.ceil((date.getDate() + firstDay.getDay()) / 7)
}

const getMonthLabel = (year, month) => {
  const date = new Date(year, month, 1)
  return date.toLocaleString('es-GT', { month: 'long', year: 'numeric' })
}

const AttendancesPage = () => {
  const [beneficiaries, setBeneficiaries] = useState([])
  const [sessions, setSessions] = useState([])
  const [changes, setChanges] = useState({})
  const [newDate, setNewDate] = useState(todayStr)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [search, setSearch] = useState('')
  const [currentYear, setCurrentYear] = useState(today.getFullYear())
  const [currentMonth, setCurrentMonth] = useState(today.getMonth())

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const res = await getBeneficiaries()
    const data = res.data
    setBeneficiaries(data)
    const dateSet = new Set()
    data.forEach(b => {
      b.attendance?.forEach(a => dateSet.add(a.session_date))
    })
    setSessions([...dateSet].sort())
  }

  // Sesiones del mes actual
  const monthSessions = sessions.filter(date => {
    const d = new Date(date)
    return d.getFullYear() === currentYear && d.getMonth() === currentMonth
  })

  // Agrupar por semana
  const sessionsByWeek = monthSessions.reduce((acc, date) => {
    const week = getWeekNumber(date)
    if (!acc[week]) acc[week] = []
    acc[week].push(date)
    return acc
  }, {})
  const weeks = Object.keys(sessionsByWeek).sort((a, b) => a - b)

  const getAttended = (b, date) => {
    if (changes[b.code]?.[date] !== undefined) return changes[b.code][date]
    return b.attendance?.find(a => a.session_date === date)?.attended || false
  }

  const handleToggle = (code, date) => {
    const current = getAttended(
      beneficiaries.find(b => b.code === code),
      date
    )
    setChanges(prev => ({ ...prev, [code]: { ...prev[code], [date]: !current } }))
  }

  const handleAddSession = () => {
    if (!newDate || sessions.includes(newDate)) return
    setSessions(prev => [...prev, newDate].sort())
    // Navegar al mes de la sesión agregada
    const d = new Date(newDate)
    setCurrentYear(d.getFullYear())
    setCurrentMonth(d.getMonth())
    setNewDate(todayStr)
  }

  const handleRemoveSession = date => {
    if (!confirm(`Eliminar la sesion del ${date}?`)) return
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

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear(y => y - 1)
    } else setCurrentMonth(m => m - 1)
  }

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear(y => y + 1)
    } else setCurrentMonth(m => m + 1)
  }

  const getTotalAttended = b => sessions.filter(date => getAttended(b, date)).length
  const getMonthAttended = b => monthSessions.filter(date => getAttended(b, date)).length

  const filtered = beneficiaries.filter(b =>
    `${b.first_name} ${b.last_name} ${b.code}`.toLowerCase().includes(search.toLowerCase())
  )

  const formatDate = dateStr => {
    const d = new Date(dateStr + 'T00:00:00')
    return d.toLocaleDateString('es-GT', { day: '2-digit', month: '2-digit' })
  }

  return (
    <Layout title="Asistencias">
      {/* Controles superiores */}
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
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
            Agregar Sesion
          </button>
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
                : `Guardar (${Object.keys(changes).length})`}
          </button>
        </div>
      </div>

      {/* Navegador de mes */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 mb-4 flex items-center justify-between">
        <button onClick={prevMonth} className="p-2 hover:bg-slate-100 rounded-lg transition">
          <ChevronLeft size={18} className="text-slate-600" />
        </button>
        <div className="text-center">
          <p className="text-base font-semibold text-slate-700 capitalize">
            {getMonthLabel(currentYear, currentMonth)}
          </p>
          <p className="text-xs text-slate-400">{monthSessions.length} sesion(es) este mes</p>
        </div>
        <button onClick={nextMonth} className="p-2 hover:bg-slate-100 rounded-lg transition">
          <ChevronRight size={18} className="text-slate-600" />
        </button>
      </div>

      {/* Tabla */}
      {monthSessions.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-400">
          Sin sesiones registradas para este mes. Agrega una sesion arriba.
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-x-auto">
          <table className="text-sm">
            <thead>
              {/* Fila de semanas */}
              <tr className="text-left border-b border-slate-100 bg-slate-50">
                <th className="px-4 py-2 font-medium text-slate-500 whitespace-nowrap" rowSpan={2}>
                  Codigo
                </th>
                <th className="px-4 py-2 font-medium text-slate-500 whitespace-nowrap" rowSpan={2}>
                  Nombre
                </th>
                {weeks.map(week => (
                  <th
                    key={week}
                    colSpan={sessionsByWeek[week].length}
                    className="px-2 py-2 text-center text-xs font-semibold text-slate-400 border-l border-slate-200"
                  >
                    Semana {week}
                  </th>
                ))}
                <th
                  className="px-4 py-2 text-center text-slate-500 font-medium whitespace-nowrap"
                  rowSpan={2}
                >
                  Mes
                </th>
                <th
                  className="px-4 py-2 text-center text-slate-500 font-medium whitespace-nowrap"
                  rowSpan={2}
                >
                  Total
                </th>
              </tr>
              {/* Fila de fechas */}
              <tr className="border-b border-slate-100 bg-slate-50">
                {weeks.map(week =>
                  sessionsByWeek[week].map((date, i) => (
                    <th
                      key={date}
                      className={`px-2 py-2 font-medium text-center whitespace-nowrap ${i === 0 ? 'border-l border-slate-200' : ''}`}
                    >
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-xs text-slate-500">{formatDate(date)}</span>
                        <button
                          onClick={() => handleRemoveSession(date)}
                          className="text-slate-300 hover:text-red-400 transition"
                        >
                          <Trash2 size={10} />
                        </button>
                      </div>
                    </th>
                  ))
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(b => (
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
                  {weeks.map(week =>
                    sessionsByWeek[week].map((date, i) => (
                      <td
                        key={date}
                        className={`px-2 py-2 text-center ${i === 0 ? 'border-l border-slate-100' : ''}`}
                      >
                        <input
                          type="checkbox"
                          checked={getAttended(b, date)}
                          onChange={() => handleToggle(b.code, date)}
                          className="w-4 h-4 accent-blue-600 cursor-pointer"
                        />
                      </td>
                    ))
                  )}
                  <td className="px-4 py-2 text-center">
                    <span className="font-semibold text-slate-700">{getMonthAttended(b)}</span>
                    <span className="text-slate-400 text-xs">/{monthSessions.length}</span>
                  </td>
                  <td className="px-4 py-2 text-center">
                    <span className="font-semibold text-slate-700">{getTotalAttended(b)}</span>
                    <span className="text-slate-400 text-xs">/{sessions.length}</span>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={monthSessions.length + 4}
                    className="px-6 py-8 text-center text-slate-400"
                  >
                    Sin resultados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </Layout>
  )
}

export default AttendancesPage
