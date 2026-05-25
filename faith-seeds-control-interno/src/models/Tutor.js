const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const Tutor = sequelize.define(
  'Tutor',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    full_name: { type: DataTypes.STRING(200), allowNull: false },
    dpi: { type: DataTypes.STRING(20), unique: true },
    phone: { type: DataTypes.STRING(50) },
  },
  { tableName: 'tutors', timestamps: false }
)

module.exports = Tutor
