const { processFamiliesSheet, processGeneralDataSheet } = require('../services/bulk-upload.service')

/**
 * POST /api/bulk-upload/families
 * Recibe el archivo Excel de "Familias Faith Seeds" y lo procesa.
 */
const uploadFamilies = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se recibió ningún archivo.' })
    }

    const result = await processFamiliesSheet(req.file.buffer)
    return res.status(200).json(result)
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}

/**
 * POST /api/bulk-upload/general-data
 * Recibe el archivo Excel de "General Data" y lo procesa.
 */
const uploadGeneralData = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se recibió ningún archivo.' })
    }

    const result = await processGeneralDataSheet(req.file.buffer)
    return res.status(200).json(result)
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}

module.exports = { uploadFamilies, uploadGeneralData }
