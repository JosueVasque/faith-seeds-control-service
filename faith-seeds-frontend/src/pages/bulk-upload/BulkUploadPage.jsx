import { useState } from 'react'
import Layout from '../../components/Layout'
import { uploadFamilies, uploadGeneralData } from '../../services/bulkUpload.service'
import { Upload, CheckCircle, AlertCircle } from 'lucide-react'

const UploadSection = ({ title, description, onUpload }) => {
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const handleUpload = async () => {
    if (!file) return setError('Seleccioná un archivo Excel.')
    setError('')
    setResult(null)
    setLoading(true)
    try {
      const res = await onUpload(file)
      setResult(res.data)
      setFile(null)
    } catch (err) {
      setError(err.response?.data?.error || 'Error al procesar el archivo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
      <h2 className="text-base font-semibold text-slate-700 mb-1">{title}</h2>
      <p className="text-sm text-slate-400 mb-5">{description}</p>

      <div className="flex items-center gap-3 mb-4">
        <label className="flex-1 border border-dashed border-slate-300 rounded-lg px-4 py-3 text-sm text-slate-500 cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition">
          <input
            type="file"
            accept=".xlsx,.xls"
            className="hidden"
            onChange={e => setFile(e.target.files[0])}
          />
          {file ? (
            <span className="text-blue-600 font-medium">{file.name}</span>
          ) : (
            <span>Seleccionar archivo Excel (.xlsx, .xls)</span>
          )}
        </label>
        <button
          onClick={handleUpload}
          disabled={loading || !file}
          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-lg text-sm hover:bg-blue-700 transition disabled:opacity-50 font-medium"
        >
          <Upload size={15} />
          {loading ? 'Procesando...' : 'Cargar'}
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3">
          <AlertCircle size={15} />
          {error}
        </div>
      )}

      {result && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm rounded-lg px-4 py-4">
          <div className="flex items-center gap-2 font-semibold mb-2">
            <CheckCircle size={15} />
            {result.message}
          </div>
          <div className="grid grid-cols-2 gap-1 text-xs text-emerald-600">
            <span>
              Total filas: <strong>{result.total}</strong>
            </span>
            {result.created !== undefined && (
              <span>
                Creados: <strong>{result.created}</strong>
              </span>
            )}
            {result.updated !== undefined && (
              <span>
                Actualizados: <strong>{result.updated}</strong>
              </span>
            )}
            {result.skipped !== undefined && (
              <span>
                Omitidos: <strong>{result.skipped}</strong>
              </span>
            )}
            {result.not_found !== undefined && (
              <span>
                No encontrados: <strong>{result.not_found}</strong>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

const BulkUploadPage = () => {
  return (
    <Layout title="Carga Masiva">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <UploadSection
          title="Fase 1 — Familias Faith Seeds"
          description="Archivo fuente de verdad. Define tutores y beneficiarios con su código real (ej. FSF-C001)."
          onUpload={uploadFamilies}
        />
        <UploadSection
          title="Fase 2 — General Data"
          description="Enriquece los beneficiarios existentes con datos académicos: colegio, grado, género, edad y beca."
          onUpload={uploadGeneralData}
        />
      </div>
    </Layout>
  )
}

export default BulkUploadPage
