const tutorService = require('../services/tutor.service')

const getTutors = async (req, res) => {
  try {
    const tutors = await tutorService.getAllTutors()
    res.json(tutors)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const getTutor = async (req, res) => {
  try {
    const tutor = await tutorService.getTutorById(req.params.id)
    if (!tutor) return res.status(404).json({ error: 'Tutor no encontrado.' })
    res.json(tutor)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const createTutor = async (req, res) => {
  try {
    const tutor = await tutorService.createTutor(req.body)
    res.status(201).json(tutor)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const updateTutor = async (req, res) => {
  try {
    const tutor = await tutorService.updateTutor(req.params.id, req.body)
    if (!tutor) return res.status(404).json({ error: 'Tutor no encontrado.' })
    res.json(tutor)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const deleteTutor = async (req, res) => {
  try {
    const result = await tutorService.deleteTutor(req.params.id)
    if (!result) return res.status(404).json({ error: 'Tutor no encontrado.' })
    res.json({ message: 'Tutor eliminado correctamente.' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

module.exports = { getTutors, getTutor, createTutor, updateTutor, deleteTutor }
