const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const CodeSequence = sequelize.define(
  'CodeSequence',
  {
    category: { type: DataTypes.STRING(10), primaryKey: true },
    last_number: { type: DataTypes.INTEGER, defaultValue: 0 },
  },
  { tableName: 'code_sequences', timestamps: false }
)

module.exports = CodeSequence
