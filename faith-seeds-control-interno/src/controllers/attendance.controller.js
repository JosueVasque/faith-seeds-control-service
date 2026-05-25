const { upsertAttendance, getAttendances } = require('../services/attendance.service')

const upsert = async (req, res) => {
  try {
    const { session_date, attended } = req.body
    if (!session_date) return res.status(400).json({ error: 'session_date es requerido.' })
    const result = await upsertAttendance(req.params.code, session_date, attended)
    res.json(result)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const get = async (req, res) => {
  try {
    const result = await getAttendances(req.params.code)
    res.json(result)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

module.exports = { upsert, get }
