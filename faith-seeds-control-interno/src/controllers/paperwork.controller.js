const { updatePaperwork, getPaperwork } = require('../services/paperwork.service')

const update = async (req, res) => {
  try {
    const result = await updatePaperwork(req.params.code, req.body)
    res.json(result)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const get = async (req, res) => {
  try {
    const result = await getPaperwork(req.params.code)
    if (!result) return res.status(404).json({ error: 'No encontrado.' })
    res.json(result)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

module.exports = { update, get }
