import { useState, useEffect } from 'react'
import Layout from '../../components/Layout'
import { getBeneficiaries } from '../../services/beneficiary.service'
import { getTutors } from '../../services/tutor.service'
import { Users, UserCheck, Home, BookOpen } from 'lucide-react'

const StatCard = ({ title, value, subtitle, icon: Icon, color }) => (
  <div
    className={`bg-white rounded-xl border border-slate-200 p-6 flex items-start justify-between shadow-sm border-t-4 ${color}`}
  >
    <div>
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <p className="text-3xl font-bold text-slate-800 mt-1">{value}</p>
      {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
    </div>
    <div className="bg-slate-100 p-3 rounded-lg">
      <Icon size={22} className="text-slate-600" />
    </div>
  </div>
)

const DashboardPage = () => {
  const [beneficiaries, setBeneficiaries] = useState([])
  const [tutors, setTutors] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const [b, t] = await Promise.all([getBeneficiaries(), getTutors()])
      setBeneficiaries(b.data)
      setTutors(t.data)
      setLoading(false)
    }
    fetchData()
  }, [])

  const total = beneficiaries.length
  const comunidad = beneficiaries.filter(b => !b.is_botadero).length
  const botadero = beneficiaries.filter(b => b.is_botadero).length
  const becados = beneficiaries.filter(b => b.status === 'Becado').length
  const conColegio = beneficiaries.filter(b => b.school_id).length
  const sinColegio = total - conColegio

  // Distribución por grado
  const gradeMap = {}
  beneficiaries.forEach(b => {
    const name = b.grade?.name || 'Sin grado'
    gradeMap[name] = (gradeMap[name] || 0) + 1
  })
  const gradeDistribution = Object.entries(gradeMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)

  // Últimos 5 beneficiarios
  const recent = [...beneficiaries].reverse().slice(0, 5)

  if (loading)
    return (
      <Layout title="Dashboard">
        <p className="text-slate-400 text-sm">Cargando datos...</p>
      </Layout>
    )

  return (
    <Layout title="Dashboard">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatCard
          title="Total Beneficiarios"
          value={total}
          subtitle="Registrados en el sistema"
          icon={Users}
          color="border-blue-500"
        />
        <StatCard
          title="Comunidad"
          value={comunidad}
          subtitle={`${total ? ((comunidad / total) * 100).toFixed(0) : 0}% del total`}
          icon={Home}
          color="border-emerald-500"
        />
        <StatCard
          title="Botadero"
          value={botadero}
          subtitle={`${total ? ((botadero / total) * 100).toFixed(0) : 0}% del total`}
          icon={UserCheck}
          color="border-orange-500"
        />
        <StatCard
          title="Becados"
          value={becados}
          subtitle={`${total ? ((becados / total) * 100).toFixed(0) : 0}% del total`}
          icon={BookOpen}
          color="border-purple-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Distribución por grado */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-base font-semibold text-slate-700 mb-4">Distribución por Grado</h2>
          {gradeDistribution.length === 0 ? (
            <p className="text-slate-400 text-sm">Sin datos aún.</p>
          ) : (
            <div className="space-y-3">
              {gradeDistribution.map(([grade, count]) => (
                <div key={grade}>
                  <div className="flex justify-between text-sm text-slate-600 mb-1">
                    <span>{grade}</span>
                    <span className="font-semibold">{count}</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${total ? (count / total) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Resumen general */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-base font-semibold text-slate-700 mb-4">Resumen General</h2>
          <div className="divide-y divide-slate-100">
            {[
              { label: 'Total de tutores', value: tutors.length },
              { label: 'Beneficiarios con colegio asignado', value: conColegio },
              { label: 'Beneficiarios sin colegio', value: sinColegio },
              { label: 'Sector Comunidad', value: comunidad },
              { label: 'Sector Botadero', value: botadero },
              { label: 'Con condición Becado', value: becados },
            ].map(item => (
              <div key={item.label} className="flex justify-between py-3 text-sm">
                <span className="text-slate-500">{item.label}</span>
                <span className="font-semibold text-slate-700">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Últimos registros */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <h2 className="text-base font-semibold text-slate-700 mb-4">
          Últimos Beneficiarios Registrados
        </h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-500 border-b border-slate-100">
              <th className="pb-3 font-medium">Código</th>
              <th className="pb-3 font-medium">Nombre</th>
              <th className="pb-3 font-medium">Sector</th>
              <th className="pb-3 font-medium">Tutor</th>
              <th className="pb-3 font-medium">Colegio</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {recent.map(b => (
              <tr key={b.code} className="hover:bg-slate-50">
                <td className="py-3 font-mono text-slate-500">{b.code}</td>
                <td className="py-3 text-slate-700">
                  {b.first_name} {b.last_name}
                </td>
                <td className="py-3">
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                      b.is_botadero ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {b.is_botadero ? 'Botadero' : 'Comunidad'}
                  </span>
                </td>
                <td className="py-3 text-slate-500">{b.tutor?.full_name || '—'}</td>
                <td className="py-3 text-slate-500">{b.school?.name || '—'}</td>
              </tr>
            ))}
            {recent.length === 0 && (
              <tr>
                <td colSpan={5} className="py-6 text-center text-slate-400">
                  Sin registros aún.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Layout>
  )
}

export default DashboardPage
