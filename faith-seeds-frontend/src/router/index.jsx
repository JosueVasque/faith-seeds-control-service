import { createBrowserRouter } from 'react-router-dom'
import DashboardPage from '../pages/dashboard/DashboardPage'
import CatalogsPage from '../pages/catalogs/CatalogsPage'
import TutorsPage from '../pages/tutors/TutorsPage'
import BeneficiariesPage from '../pages/beneficiaries/BeneficiariesPage'
import BulkUploadPage from '../pages/bulk-upload/BulkUploadPage'
import FamiliesPage from '../pages/families/FamiliesPage'
import GradesPage from '../pages/grades/GradesPage'
import AttendancesPage from '../pages/attendances/AttendancesPage'
import PaperworkPage from '../pages/paperwork/PaperworkPage'

export const router = createBrowserRouter([
  { path: '/', element: <DashboardPage /> },
  { path: '/catalogs', element: <CatalogsPage /> },
  { path: '/tutors', element: <TutorsPage /> },
  { path: '/beneficiaries', element: <BeneficiariesPage /> },
  { path: '/bulk-upload', element: <BulkUploadPage /> },
  { path: '/families', element: <FamiliesPage /> },
  { path: '/grades', element: <GradesPage /> },
  { path: '/attendances', element: <AttendancesPage /> },
  { path: '/paperwork', element: <PaperworkPage /> },
])
