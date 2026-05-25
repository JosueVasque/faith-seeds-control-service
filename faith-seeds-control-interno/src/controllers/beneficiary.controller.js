const beneficiaryService = require('../services/beneficiary.service')

const getBeneficiaries = async (req, res) => {
  try {
    const beneficiaries = await beneficiaryService.getAllBeneficiaries()
    res.json(beneficiaries)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const getBeneficiary = async (req, res) => {
  try {
    const beneficiary = await beneficiaryService.getBeneficiaryByCode(req.params.code)
    if (!beneficiary) return res.status(404).json({ error: 'Beneficiario no encontrado.' })
    res.json(beneficiary)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const createBeneficiary = async (req, res) => {
  try {
    const beneficiary = await beneficiaryService.createBeneficiary(req.body)
    res.status(201).json(beneficiary)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const updateBeneficiary = async (req, res) => {
  try {
    const beneficiary = await beneficiaryService.updateBeneficiary(req.params.code, req.body)
    if (!beneficiary) return res.status(404).json({ error: 'Beneficiario no encontrado.' })
    res.json(beneficiary)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const deleteBeneficiary = async (req, res) => {
  try {
    const result = await beneficiaryService.deleteBeneficiary(req.params.code)
    if (!result) return res.status(404).json({ error: 'Beneficiario no encontrado.' })
    res.json({ message: 'Beneficiario eliminado correctamente.' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

module.exports = {
  getBeneficiaries,
  getBeneficiary,
  createBeneficiary,
  updateBeneficiary,
  deleteBeneficiary,
}
