const { Grade } = require('../models')

const updateGrades = async (beneficiaryCode, data) => {
  const grade = await Grade.findOne({ where: { beneficiary_code: beneficiaryCode } })
  if (!grade) throw new Error('Registro de calificaciones no encontrado.')
  return await grade.update(data)
}

const getGrades = async beneficiaryCode => {
  return await Grade.findOne({ where: { beneficiary_code: beneficiaryCode } })
}

module.exports = { updateGrades, getGrades }
