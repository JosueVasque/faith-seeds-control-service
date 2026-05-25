const sequelize = require('../config/database')

const CatalogSchool = require('./CatalogSchool')
const CatalogGrade = require('./CatalogGrade')
const CatalogSchedule = require('./CatalogSchedule')
const Tutor = require('./Tutor')
const Beneficiary = require('./Beneficiary')
const Grade = require('./Grade')
const Attendance = require('./Attendance')
const Paperwork = require('./Paperwork')
const CodeSequence = require('./CodeSequence')

// Beneficiario pertenece a Tutor, Colegio y Grado
Beneficiary.belongsTo(Tutor, { foreignKey: 'tutor_id', as: 'tutor' })
Beneficiary.belongsTo(CatalogSchool, { foreignKey: 'school_id', as: 'school' })
Beneficiary.belongsTo(CatalogGrade, { foreignKey: 'grade_id', as: 'grade' })

// Tutor tiene muchos Beneficiarios
Tutor.hasMany(Beneficiary, { foreignKey: 'tutor_id', as: 'beneficiaries' })

// Relaciones 1:1 con Beneficiario
Beneficiary.hasOne(Grade, { foreignKey: 'beneficiary_code', sourceKey: 'code', as: 'grades' })
Beneficiary.hasOne(Attendance, {
  foreignKey: 'beneficiary_code',
  sourceKey: 'code',
  as: 'attendance',
})
Beneficiary.hasOne(Paperwork, {
  foreignKey: 'beneficiary_code',
  sourceKey: 'code',
  as: 'paperwork',
})

module.exports = {
  sequelize,
  CatalogSchool,
  CatalogGrade,
  CatalogSchedule,
  Tutor,
  Beneficiary,
  Grade,
  Attendance,
  Paperwork,
  CodeSequence,
}
