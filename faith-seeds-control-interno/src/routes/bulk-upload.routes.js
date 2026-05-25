const express = require('express')
const multer = require('multer')
const { uploadFamilies, uploadGeneralData } = require('../controllers/bulk-upload.controller')

const router = express.Router()

// Multer en memoria, solo acepta archivos Excel
const storage = multer.memoryStorage()
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowed = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
    ]
    if (allowed.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('Solo se permiten archivos Excel (.xlsx, .xls)'))
    }
  },
})

// POST /api/bulk-upload/families
router.post('/families', upload.single('file'), uploadFamilies)

// POST /api/bulk-upload/general-data
router.post('/general-data', upload.single('file'), uploadGeneralData)

module.exports = router
