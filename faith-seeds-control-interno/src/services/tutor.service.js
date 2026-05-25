const { Tutor, Beneficiary } = require('../models')

const getAllTutors = async () => {
  return await Tutor.findAll({
    include: [{ model: Beneficiary, as: 'beneficiaries' }],
  })
}

const getTutorById = async id => {
  return await Tutor.findByPk(id, {
    include: [{ model: Beneficiary, as: 'beneficiaries' }],
  })
}

const createTutor = async data => await Tutor.create(data)

const updateTutor = async (id, data) => {
  const tutor = await Tutor.findByPk(id)
  if (!tutor) return null
  return await tutor.update(data)
}

const deleteTutor = async id => {
  const tutor = await Tutor.findByPk(id)
  if (!tutor) return null
  await tutor.destroy()
  return true
}

module.exports = { getAllTutors, getTutorById, createTutor, updateTutor, deleteTutor }
