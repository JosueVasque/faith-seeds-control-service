const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const CatalogSchool = sequelize.define(
  'CatalogSchool',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(150), allowNull: false },
  },
  { tableName: 'catalog_schools', timestamps: false }
)

module.exports = CatalogSchool
