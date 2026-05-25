const {
  Beneficiary,
  Tutor,
  CatalogSchool,
  CatalogGrade,
  Grade,
  Attendance,
  Paperwork,
  CodeSequence,
  sequelize,
} = require('../models')
const { sendBeneficiaryToWebhook } = require('./integration.service')

// ─── Helper: generar código automático ───────────────────────────────────────

const generateCode = async (category, transaction) => {
  // Bloquear la fila para evitar condiciones de carrera
  const sequence = await CodeSequence.findOne({
    where: { category },
    lock: transaction.LOCK.UPDATE,
    transaction,
  })

  if (!sequence) throw new Error(`Categoría de código no válida: ${category}`)

  const nextNumber = sequence.last_number + 1
  await sequence.update({ last_number: nextNumber }, { transaction })

  // Formato: FSF-C001, FSF-B053, etc.
  const padded = String(nextNumber).padStart(3, '0')
  return `FSF-${category}${padded}`
}

// ─── CRUD ─────────────────────────────────────────────────────────────────────

const getAllBeneficiaries = async () => {
  return await Beneficiary.findAll({
    include: [
      { model: Tutor, as: 'tutor' },
      { model: CatalogSchool, as: 'school' },
      { model: CatalogGrade, as: 'grade' },
      { model: Grade, as: 'grades' },
      { model: Paperwork, as: 'paperwork' },
    ],
    order: [['code', 'ASC']],
  })
}

const getBeneficiaryByCode = async code => {
  return await Beneficiary.findByPk(code, {
    include: [
      { model: Tutor, as: 'tutor' },
      { model: CatalogSchool, as: 'school' },
      { model: CatalogGrade, as: 'grade' },
      { model: Grade, as: 'grades' },
      { model: Attendance, as: 'attendance' },
      { model: Paperwork, as: 'paperwork' },
    ],
  })
}

const createBeneficiary = async data => {
  const transaction = await sequelize.transaction()

  try {
    let code = data.code ? data.code.trim() : null
    const category = data.category // 'C' o 'B'

    // Si no se provee código manual, autogenerarlo
    if (!code) {
      if (!category || !['C', 'B'].includes(category)) {
        throw new Error('Debes seleccionar una categoría (C = Comunidad, B = Botadero).')
      }
      code = await generateCode(category, transaction)
    } else {
      // Si se provee código manual, verificar que no exista
      const existing = await Beneficiary.findByPk(code, { transaction })
      if (existing) throw new Error(`El código ${code} ya está registrado.`)
    }

    const beneficiary = await Beneficiary.create(
      {
        ...data,
        code,
        is_botadero: category === 'B' || code.includes('-B'),
      },
      { transaction }
    )

    // Autoinicializar registros 1:1
    await Grade.create({ beneficiary_code: code }, { transaction })
    await Attendance.create({ beneficiary_code: code, session_date: '2026-01-01' }, { transaction })
    await Paperwork.create({ beneficiary_code: code }, { transaction })

    await transaction.commit()

    await sendBeneficiaryToWebhook(beneficiary)
    return beneficiary
  } catch (error) {
    await transaction.rollback()
    throw error
  }
}

const updateBeneficiary = async (code, data) => {
  const beneficiary = await Beneficiary.findByPk(code)
  if (!beneficiary) return null

  await beneficiary.update(data)
  await sendBeneficiaryToWebhook(beneficiary)
  return beneficiary
}

const deleteBeneficiary = async code => {
  const beneficiary = await Beneficiary.findByPk(code)
  if (!beneficiary) return null
  await beneficiary.destroy()
  return true
}

// ─── Preview del siguiente código ────────────────────────────────────────────

const previewNextCode = async category => {
  const sequence = await CodeSequence.findOne({ where: { category } })
  if (!sequence) throw new Error('Categoría no válida.')
  const next = sequence.last_number + 1
  return `FSF-${category}${String(next).padStart(3, '0')}`
}

module.exports = {
  getAllBeneficiaries,
  getBeneficiaryByCode,
  createBeneficiary,
  updateBeneficiary,
  deleteBeneficiary,
  previewNextCode,
}
