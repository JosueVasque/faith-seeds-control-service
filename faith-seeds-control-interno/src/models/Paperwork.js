const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const Paperwork = sequelize.define(
  'Paperwork',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    beneficiary_code: { type: DataTypes.STRING(20), allowNull: false, unique: true },
    birth_certificate: { type: DataTypes.BOOLEAN, defaultValue: false },
    tutor_dpi: { type: DataTypes.BOOLEAN, defaultValue: false },
    study_certificate: { type: DataTypes.BOOLEAN, defaultValue: false },
    photo: { type: DataTypes.BOOLEAN, defaultValue: false },
    scholarship_agreement: { type: DataTypes.BOOLEAN, defaultValue: false },
    image_authorization: { type: DataTypes.BOOLEAN, defaultValue: false },
  },
  { tableName: 'paperwork', timestamps: false }
)

module.exports = Paperwork
