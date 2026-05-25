const express = require('express')
const router = express.Router()
const c = require('../controllers/beneficiary.controller')
const { previewNextCode } = require('../services/beneficiary.service')

// Preview debe ir antes de /:code
router.get('/preview-code/:category', async (req, res) => {
  try {
    const code = await previewNextCode(req.params.category)
    res.json({ code })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

router.get('/', c.getBeneficiaries)
router.get('/:code', c.getBeneficiary)
router.post('/', c.createBeneficiary)
router.put('/:code', c.updateBeneficiary)
router.delete('/:code', c.deleteBeneficiary)

module.exports = router
