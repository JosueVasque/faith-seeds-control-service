import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  Home,
  BookOpen,
  CalendarCheck,
  FolderOpen,
  Settings,
  Upload,
  Wifi,
  ExternalLink,
} from 'lucide-react'

const navSections = [
  { label: 'Principal', links: [{ path: '/', label: 'Dashboard', icon: LayoutDashboard }] },
  {
    label: 'Gestión',
    links: [
      { path: '/beneficiaries', label: 'Beneficiarios', icon: Users },
      { path: '/tutors', label: 'Tutores', icon: Home },
      { path: '/families', label: 'Familias', icon: Home },
    ],
  },
  {
    label: 'Seguimiento',
    links: [
      { path: '/grades', label: 'Calificaciones', icon: BookOpen },
      { path: '/attendances', label: 'Asistencias', icon: CalendarCheck },
      { path: '/paperwork', label: 'Papelería', icon: FolderOpen },
    ],
  },
  {
    label: 'Configuración',
    links: [
      { path: '/catalogs', label: 'Catálogos', icon: Settings },
      { path: '/bulk-upload', label: 'Carga Masiva', icon: Upload },
    ],
  },
]

const Layout = ({ children, title }) => {
  const { pathname } = useLocation()
  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden">
      <aside className="w-64 bg-slate-900 text-slate-100 flex flex-col shadow-xl shrink-0">
        <div className="px-6 py-6 border-b border-slate-700">
          <h2 className="text-lg font-semibold tracking-wide text-white">Faith Seeds</h2>
          <span className="text-xs text-slate-400 mt-1 block">Sistema de Control Interno</span>
        </div>
        <nav className="flex-1 overflow-y-auto py-4">
          {navSections.map(section => (
            <div key={section.label} className="mb-2">
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 px-6 py-2">
                {section.label}
              </p>
              {section.links.map(link => {
                const Icon = link.icon
                const active = pathname === link.path
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center gap-3 px-6 py-3 text-sm font-medium transition-all border-l-4 ${active ? 'bg-slate-800 text-white border-blue-500' : 'text-slate-400 border-transparent hover:bg-slate-800 hover:text-white'}`}
                  >
                    <Icon size={16} />
                    {link.label}
                  </Link>
                )
              })}
            </div>
          ))}
        </nav>
        <div className="px-4 py-4 border-t border-slate-700 space-y-3">
          <a
            href="http://100.125.146.39:3000"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 w-full bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm font-medium px-4 py-2 rounded-lg transition"
          >
            <ExternalLink size={15} />
            Ir a Inventario
          </a>
          <p className="text-xs text-slate-500 text-center">Faith Seeds © 2026</p>
        </div>
      </aside>
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between shrink-0">
          <h1 className="text-xl font-semibold text-slate-800">{title || 'Dashboard'}</h1>
          <div className="flex items-center gap-2 text-sm font-medium text-emerald-600">
            <Wifi size={15} />
            Sistema en línea
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-8">{children}</main>
      </div>
    </div>
  )
}

export default Layout
