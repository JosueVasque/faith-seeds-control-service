const { Paperwork } = require('../models')

const updatePaperwork = async (beneficiaryCode, data) => {
  const paperwork = await Paperwork.findOne({ where: { beneficiary_code: beneficiaryCode } })
  if (!paperwork) throw new Error('Registro de papelería no encontrado.')
  return await paperwork.update(data)
}

const getPaperwork = async beneficiaryCode => {
  return await Paperwork.findOne({ where: { beneficiary_code: beneficiaryCode } })
}

module.exports = { updatePaperwork, getPaperwork }
