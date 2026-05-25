const { Attendance } = require('../models')

const upsertAttendance = async (beneficiaryCode, sessionDate, attended) => {
  const existing = await Attendance.findOne({
    where: { beneficiary_code: beneficiaryCode, session_date: sessionDate },
  })
  if (existing) {
    return await existing.update({ attended })
  }
  return await Attendance.create({
    beneficiary_code: beneficiaryCode,
    session_date: sessionDate,
    attended,
  })
}

const getAttendances = async beneficiaryCode => {
  return await Attendance.findAll({ where: { beneficiary_code: beneficiaryCode } })
}

module.exports = { upsertAttendance, getAttendances }
