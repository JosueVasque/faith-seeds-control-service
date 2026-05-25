import { useState, useEffect } from 'react'
import Layout from '../../components/Layout'
import { getTutors } from '../../services/tutor.service'
import { Search } from 'lucide-react'

const FamiliesPage = () => {
  const [tutors, setTutors] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const res = await getTutors()
      setTutors(res.data)
      setLoading(false)
    }
    fetchData()
  }, [])

  const filtered = tutors.filter(
    t =>
      t.full_name.toLowerCase().includes(search.toLowerCase()) || (t.dpi && t.dpi.includes(search))
  )

  return (
    <Layout title="Familias">
      {/* Búsqueda */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 mb-6 flex items-center gap-3">
        <Search size={16} className="text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar por nombre del tutor o DPI..."
          className="flex-1 text-sm outline-none text-slate-700 placeholder-slate-400"
        />
        <span className="text-xs text-slate-400">{filtered.length} familia(s)</span>
      </div>

      {/* Tabla de familias */}
      {loading ? (
        <p className="text-slate-400 text-sm">Cargando familias...</p>
      ) : (
        <div className="space-y-4">
          {filtered.map(tutor => (
            <div
              key={tutor.id}
              className="bg-white rounded-xl border border-slate-200 shadow-sm p-5"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h2 className="text-base font-semibold text-slate-800">{tutor.full_name}</h2>
                  <div className="flex gap-4 mt-1 text-xs text-slate-400">
                    <span>DPI: {tutor.dpi || '—'}</span>
                    <span>Tel: {tutor.phone || '—'}</span>
                  </div>
                </div>
                <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">
                  {tutor.beneficiaries?.length || 0} beneficiario(s)
                </span>
              </div>

              {/* Lista de beneficiarios */}
              {tutor.beneficiaries?.length > 0 ? (
                <table className="w-full text-sm mt-2">
                  <thead>
                    <tr className="text-left text-slate-400 border-b border-slate-100 text-xs">
                      <th className="pb-2 font-medium">Código</th>
                      <th className="pb-2 font-medium">Nombre</th>
                      <th className="pb-2 font-medium">Sector</th>
                      <th className="pb-2 font-medium">Condición</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {tutor.beneficiaries.map(b => (
                      <tr key={b.code} className="hover:bg-slate-50">
                        <td className="py-2 font-mono text-slate-500">{b.code}</td>
                        <td className="py-2 text-slate-700">
                          {b.first_name} {b.last_name}
                        </td>
                        <td className="py-2">
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                              b.is_botadero
                                ? 'bg-orange-100 text-orange-700'
                                : 'bg-blue-100 text-blue-700'
                            }`}
                          >
                            {b.is_botadero ? 'Botadero' : 'Comunidad'}
                          </span>
                        </td>
                        <td className="py-2 text-slate-500">{b.status || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-xs text-slate-400 mt-2">Sin beneficiarios asignados.</p>
              )}
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
              <p className="text-slate-400 text-sm">No se encontraron familias.</p>
            </div>
          )}
        </div>
      )}
    </Layout>
  )
}

export default FamiliesPage
