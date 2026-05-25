const express = require('express')
const cors = require('cors')
const app = express()

// Middlewares globales
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Rutas (se irán agregando por módulo)
app.use('/api/bulk-upload', require('./routes/bulk-upload.routes'))
app.use('/api/catalogs', require('./routes/catalog.routes'))
app.use('/api/tutors', require('./routes/tutor.routes'))
app.use('/api/beneficiaries', require('./routes/beneficiary.routes'))
app.use('/api/beneficiaries/:code/grades', require('./routes/grades.routes'))
app.use('/api/beneficiaries/:code/attendance', require('./routes/attendance.routes'))
app.use('/api/beneficiaries/:code/paperwork', require('./routes/paperwork.routes'))
// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ message: 'Faith Seeds API corriendo OK' })
})

module.exports = app
