const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const Grade = sequelize.define(
  'Grade',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    beneficiary_code: { type: DataTypes.STRING(20), allowNull: false, unique: true },
    average: { type: DataTypes.STRING(50) },
    course_1: { type: DataTypes.STRING(100) },
    grade_1: { type: DataTypes.STRING(50) },
    course_2: { type: DataTypes.STRING(100) },
    grade_2: { type: DataTypes.STRING(50) },
    course_3: { type: DataTypes.STRING(100) },
    grade_3: { type: DataTypes.STRING(50) },
    course_4: { type: DataTypes.STRING(100) },
    grade_4: { type: DataTypes.STRING(50) },
    course_5: { type: DataTypes.STRING(100) },
    grade_5: { type: DataTypes.STRING(50) },
    course_6: { type: DataTypes.STRING(100) },
    grade_6: { type: DataTypes.STRING(50) },
    course_7: { type: DataTypes.STRING(100) },
    grade_7: { type: DataTypes.STRING(50) },
    course_8: { type: DataTypes.STRING(100) },
    grade_8: { type: DataTypes.STRING(50) },
    course_9: { type: DataTypes.STRING(100) },
    grade_9: { type: DataTypes.STRING(50) },
  },
  { tableName: 'grades', timestamps: false }
)

module.exports = Grade
