const { CatalogSchool, CatalogGrade, CatalogSchedule } = require('../models')

// ─── Escuelas ─────────────────────────────────────────────────────────────────

const getAllSchools = async () => await CatalogSchool.findAll()
const getSchoolById = async id => await CatalogSchool.findByPk(id)
const createSchool = async data => await CatalogSchool.create(data)
const updateSchool = async (id, data) => {
  const school = await CatalogSchool.findByPk(id)
  if (!school) return null
  return await school.update(data)
}
const deleteSchool = async id => {
  const school = await CatalogSchool.findByPk(id)
  if (!school) return null
  await school.destroy()
  return true
}

// ─── Grados ───────────────────────────────────────────────────────────────────

const getAllGrades = async () => await CatalogGrade.findAll()
const getGradeById = async id => await CatalogGrade.findByPk(id)
const createGrade = async data => await CatalogGrade.create(data)
const updateGrade = async (id, data) => {
  const grade = await CatalogGrade.findByPk(id)
  if (!grade) return null
  return await grade.update(data)
}
const deleteGrade = async id => {
  const grade = await CatalogGrade.findByPk(id)
  if (!grade) return null
  await grade.destroy()
  return true
}

// ─── Horarios ─────────────────────────────────────────────────────────────────

const getAllSchedules = async () => await CatalogSchedule.findAll()
const getScheduleById = async id => await CatalogSchedule.findByPk(id)
const createSchedule = async data => await CatalogSchedule.create(data)
const updateSchedule = async (id, data) => {
  const schedule = await CatalogSchedule.findByPk(id)
  if (!schedule) return null
  return await schedule.update(data)
}
const deleteSchedule = async id => {
  const schedule = await CatalogSchedule.findByPk(id)
  if (!schedule) return null
  await schedule.destroy()
  return true
}

module.exports = {
  getAllSchools,
  getSchoolById,
  createSchool,
  updateSchool,
  deleteSchool,
  getAllGrades,
  getGradeById,
  createGrade,
  updateGrade,
  deleteGrade,
  getAllSchedules,
  getScheduleById,
  createSchedule,
  updateSchedule,
  deleteSchedule,
}
