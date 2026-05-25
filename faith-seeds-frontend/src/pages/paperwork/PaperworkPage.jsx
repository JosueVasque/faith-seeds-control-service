import { useState, useEffect } from 'react'
import Layout from '../../components/Layout'
import { getBeneficiaries } from '../../services/beneficiary.service'
import { Save, Search } from 'lucide-react'
import api from '../../services/api'

const DOCS = [
  { key: 'birth_certificate', label: 'Acta de Nacimiento' },
  { key: 'tutor_dpi', label: 'DPI Tutor' },
  { key: 'study_certificate', label: 'Constancia de Estudio' },
  { key: 'photo', label: 'Fotografia' },
  { key: 'scholarship_agreement', label: 'Convenio de Beca' },
  { key: 'image_authorization', label: 'Autorizacion de Imagen' },
]

const PaperworkPage = () => {
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

  const getValue = (b, key) => {
    if (changes[b.code]?.[key] !== undefined) return changes[b.code][key]
    return b.paperwork?.[key] || false
  }

  const handleToggle = (code, key) => {
    const current = getValue(
      beneficiaries.find(b => b.code === code),
      key
    )
    setChanges(prev => ({ ...prev, [code]: { ...prev[code], [key]: !current } }))
  }

  const handleSaveAll = async () => {
    setSaving(true)
    try {
      for (const [code, data] of Object.entries(changes)) {
        await api.put(`/beneficiaries/${code}/paperwork`, data)
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

  const getTotal = b => DOCS.filter(d => getValue(b, d.key)).length

  const filtered = beneficiaries.filter(b =>
    `${b.first_name} ${b.last_name} ${b.code}`.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <Layout title="Papeleria">
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

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-500 border-b border-slate-100 bg-slate-50">
              <th className="px-4 py-3 font-medium whitespace-nowrap">Codigo</th>
              <th className="px-4 py-3 font-medium whitespace-nowrap">Nombre</th>
              {DOCS.map(d => (
                <th
                  key={d.key}
                  className="px-3 py-3 font-medium text-center whitespace-nowrap text-xs"
                >
                  {d.label}
                </th>
              ))}
              <th className="px-4 py-3 font-medium text-center whitespace-nowrap">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map(b => {
              const total = getTotal(b)
              return (
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
                  {DOCS.map(d => (
                    <td key={d.key} className="px-3 py-2 text-center">
                      <input
                        type="checkbox"
                        checked={getValue(b, d.key)}
                        onChange={() => handleToggle(b.code, d.key)}
                        className="w-4 h-4 accent-blue-600 cursor-pointer"
                      />
                    </td>
                  ))}
                  <td className="px-4 py-2 text-center">
                    <span
                      className={`font-semibold ${total === DOCS.length ? 'text-emerald-600' : 'text-slate-700'}`}
                    >
                      {total}
                    </span>
                    <span className="text-slate-400 text-xs">/{DOCS.length}</span>
                  </td>
                </tr>
              )
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={DOCS.length + 3} className="px-6 py-8 text-center text-slate-400">
                  Sin resultados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Layout>
  )
}

export default PaperworkPage
