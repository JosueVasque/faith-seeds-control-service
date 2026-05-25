const express = require('express')
const router = express.Router()
const c = require('../controllers/catalog.controller')

// Escuelas
router.get('/schools', c.getSchools)
router.get('/schools/:id', c.getSchool)
router.post('/schools', c.createSchool)
router.put('/schools/:id', c.updateSchool)
router.delete('/schools/:id', c.deleteSchool)

// Grados
router.get('/grades', c.getGrades)
router.get('/grades/:id', c.getGrade)
router.post('/grades', c.createGrade)
router.put('/grades/:id', c.updateGrade)
router.delete('/grades/:id', c.deleteGrade)

// Horarios
router.get('/schedules', c.getSchedules)
router.get('/schedules/:id', c.getSchedule)
router.post('/schedules', c.createSchedule)
router.put('/schedules/:id', c.updateSchedule)
router.delete('/schedules/:id', c.deleteSchedule)

module.exports = router
