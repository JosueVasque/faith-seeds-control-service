const catalogService = require('../services/catalog.service')

// ─── Escuelas ─────────────────────────────────────────────────────────────────

const getSchools = async (req, res) => {
  try {
    const schools = await catalogService.getAllSchools()
    res.json(schools)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const getSchool = async (req, res) => {
  try {
    const school = await catalogService.getSchoolById(req.params.id)
    if (!school) return res.status(404).json({ error: 'Colegio no encontrado.' })
    res.json(school)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const createSchool = async (req, res) => {
  try {
    const school = await catalogService.createSchool(req.body)
    res.status(201).json(school)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const updateSchool = async (req, res) => {
  try {
    const school = await catalogService.updateSchool(req.params.id, req.body)
    if (!school) return res.status(404).json({ error: 'Colegio no encontrado.' })
    res.json(school)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const deleteSchool = async (req, res) => {
  try {
    const result = await catalogService.deleteSchool(req.params.id)
    if (!result) return res.status(404).json({ error: 'Colegio no encontrado.' })
    res.json({ message: 'Colegio eliminado correctamente.' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// ─── Grados ───────────────────────────────────────────────────────────────────

const getGrades = async (req, res) => {
  try {
    const grades = await catalogService.getAllGrades()
    res.json(grades)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const getGrade = async (req, res) => {
  try {
    const grade = await catalogService.getGradeById(req.params.id)
    if (!grade) return res.status(404).json({ error: 'Grado no encontrado.' })
    res.json(grade)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const createGrade = async (req, res) => {
  try {
    const grade = await catalogService.createGrade(req.body)
    res.status(201).json(grade)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const updateGrade = async (req, res) => {
  try {
    const grade = await catalogService.updateGrade(req.params.id, req.body)
    if (!grade) return res.status(404).json({ error: 'Grado no encontrado.' })
    res.json(grade)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const deleteGrade = async (req, res) => {
  try {
    const result = await catalogService.deleteGrade(req.params.id)
    if (!result) return res.status(404).json({ error: 'Grado no encontrado.' })
    res.json({ message: 'Grado eliminado correctamente.' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// ─── Horarios ─────────────────────────────────────────────────────────────────

const getSchedules = async (req, res) => {
  try {
    const schedules = await catalogService.getAllSchedules()
    res.json(schedules)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const getSchedule = async (req, res) => {
  try {
    const schedule = await catalogService.getScheduleById(req.params.id)
    if (!schedule) return res.status(404).json({ error: 'Horario no encontrado.' })
    res.json(schedule)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const createSchedule = async (req, res) => {
  try {
    const schedule = await catalogService.createSchedule(req.body)
    res.status(201).json(schedule)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const updateSchedule = async (req, res) => {
  try {
    const schedule = await catalogService.updateSchedule(req.params.id, req.body)
    if (!schedule) return res.status(404).json({ error: 'Horario no encontrado.' })
    res.json(schedule)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const deleteSchedule = async (req, res) => {
  try {
    const result = await catalogService.deleteSchedule(req.params.id)
    if (!result) return res.status(404).json({ error: 'Horario no encontrado.' })
    res.json({ message: 'Horario eliminado correctamente.' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

module.exports = {
  getSchools,
  getSchool,
  createSchool,
  updateSchool,
  deleteSchool,
  getGrades,
  getGrade,
  createGrade,
  updateGrade,
  deleteGrade,
  getSchedules,
  getSchedule,
  createSchedule,
  updateSchedule,
  deleteSchedule,
}
