const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const CatalogGrade = sequelize.define(
  'CatalogGrade',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(100), allowNull: false },
  },
  { tableName: 'catalog_grades', timestamps: false }
)

module.exports = CatalogGrade
