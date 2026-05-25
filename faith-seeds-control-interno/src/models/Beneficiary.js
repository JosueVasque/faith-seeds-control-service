const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const Beneficiary = sequelize.define(
  'Beneficiary',
  {
    code: { type: DataTypes.STRING(20), primaryKey: true },
    sector: { type: DataTypes.STRING(100) },
    status: { type: DataTypes.STRING(100) },
    first_name: { type: DataTypes.STRING(150), allowNull: false },
    last_name: { type: DataTypes.STRING(150), allowNull: false },
    tutor_id: { type: DataTypes.INTEGER },
    school_id: { type: DataTypes.INTEGER },
    grade_id: { type: DataTypes.INTEGER },
    gender: { type: DataTypes.CHAR(1) },
    age: { type: DataTypes.TINYINT },
    birth_date: { type: DataTypes.DATEONLY },
    is_botadero: { type: DataTypes.BOOLEAN, defaultValue: false },
    tutoring_day: { type: DataTypes.STRING(50) },
    tutoring_hour: { type: DataTypes.STRING(50) },
    phone: { type: DataTypes.STRING(20) },
  },
  { tableName: 'beneficiaries', timestamps: false }
)

module.exports = Beneficiary
