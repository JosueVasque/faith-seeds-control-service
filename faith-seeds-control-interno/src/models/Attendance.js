const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const Attendance = sequelize.define(
  'Attendance',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    beneficiary_code: { type: DataTypes.STRING(20), allowNull: false },
    session_date: { type: DataTypes.DATEONLY, allowNull: false },
    attended: { type: DataTypes.BOOLEAN, defaultValue: false },
  },
  { tableName: 'attendances', timestamps: false }
)

module.exports = Attendance
