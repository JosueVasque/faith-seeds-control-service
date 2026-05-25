const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const CatalogSchedule = sequelize.define(
  'CatalogSchedule',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(100), allowNull: false },
  },
  { tableName: 'catalog_schedules', timestamps: false }
)

module.exports = CatalogSchedule
