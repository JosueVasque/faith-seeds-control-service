const xlsx = require('xlsx')
const { sequelize, Tutor, Beneficiary, Grade, Attendance, Paperwork } = require('../models')
const { sendBeneficiaryToWebhook } = require('./integration.service')

// ─── Helpers ─────────────────────────────────────────────────────────────────

const parseExcelFile = fileBuffer => {
  const workbook = xlsx.read(fileBuffer, { type: 'buffer' })
  return workbook
}

const isEmptyRow = row => Object.values(row).every(v => v === null || v === undefined || v === '')

const initializeBeneficiaryRecords = async (beneficiaryCode, transaction) => {
  await Grade.create({ beneficiary_code: beneficiaryCode }, { transaction })
  await Attendance.create(
    { beneficiary_code: beneficiaryCode, session_date: '2026-01-01' },
    { transaction }
  )
  await Paperwork.create({ beneficiary_code: beneficiaryCode }, { transaction })
}

// ─── Fase 1: Familias Faith Seeds ────────────────────────────────────────────
// Estructura real de la hoja:
// Col 0: No. | Col 1: Encargado | Col 2: Codigo | Col 3: Nombre | Col 4: Apellido | Col 5: Cel

const processFamiliesSheet = async fileBuffer => {
  const workbook = parseExcelFile(fileBuffer)

  // Buscar la hoja correcta
  const sheetName =
    workbook.SheetNames.find(n => n.toLowerCase().includes('familias')) || workbook.SheetNames[0]
  const sheet = workbook.Sheets[sheetName]
  const rows = xlsx.utils.sheet_to_json(sheet, { header: 1, defval: null })

  const transaction = await sequelize.transaction()

  try {
    let created = 0
    let skipped = 0
    let lastTutorName = null
    let lastTutorPhone = null

    for (const row of rows) {
      // Saltar filas de encabezado o vacías
      if (!row[2] || typeof row[2] !== 'string' || !row[2].startsWith('FSF')) {
        continue
      }

      const code = row[2].trim()
      const firstName = row[3] ? String(row[3]).trim() : null
      const lastName = row[4] ? String(row[4]).trim() : null

      if (!firstName || !lastName) {
        skipped++
        continue
      }

      // Si hay tutor en esta fila, actualizamos el tutor activo
      if (row[1]) {
        lastTutorName = String(row[1]).trim()
        lastTutorPhone = row[5] ? String(row[5]).trim().substring(0, 50) : null
      }

      // Verificar si ya existe
      const existing = await Beneficiary.findOne({ where: { code }, transaction })
      if (existing) {
        skipped++
        continue
      }

      // Buscar o crear tutor
      let tutor = null
      if (lastTutorName) {
        tutor = await Tutor.findOne({ where: { full_name: lastTutorName }, transaction })
        if (!tutor) {
          tutor = await Tutor.create(
            {
              full_name: lastTutorName,
              phone: lastTutorPhone || null,
            },
            { transaction }
          )
        }
      }

      // Determinar sector por prefijo del código
      let sector = 'Comunidad'
      if (code.includes('-B')) sector = 'Botadero'
      else if (code.includes('-F')) sector = 'Flotante'

      const beneficiary = await Beneficiary.create(
        {
          code,
          first_name: firstName,
          last_name: lastName,
          sector,
          tutor_id: tutor ? tutor.id : null,
          phone: lastTutorPhone || null,
        },
        { transaction }
      )

      await initializeBeneficiaryRecords(beneficiary.code, transaction)
      await sendBeneficiaryToWebhook(beneficiary)

      created++
    }

    await transaction.commit()
    return { message: 'Fase 1 completada correctamente.', created, skipped }
  } catch (error) {
    await transaction.rollback()
    throw new Error(`Error en Fase 1, rollback aplicado: ${error.message}`)
  }
}

// ─── Fase 2: General Data ─────────────────────────────────────────────────────
// Estructura real de la hoja:
// Col 2: Código | Col 3: Apellido | Col 4: Nombre | Col 5: Centro Educativo
// Col 6: Cód. Escuela | Col 7: Grado | Col 8: Sección | Col 9: Género
// Col 10: Nacimiento | Col 12: Encargado | Col 13: DPI
// Col 14: Día Tutorías | Col 15: Hora | Col 16: Beca

const processGeneralDataSheet = async fileBuffer => {
  const workbook = parseExcelFile(fileBuffer)

  const sheetName =
    workbook.SheetNames.find(n => n.toLowerCase().includes('general')) || workbook.SheetNames[0]
  const sheet = workbook.Sheets[sheetName]
  const rows = xlsx.utils.sheet_to_json(sheet, { header: 1, defval: null })

  const transaction = await sequelize.transaction()

  try {
    let updated = 0
    let notFound = 0

    for (const row of rows) {
      // El código está en col 2 (índice 2) para archivo 1, o col 1 para archivo 2
      const code =
        row[2] && typeof row[2] === 'string' && row[2].startsWith('FSF')
          ? row[2].trim()
          : row[1] && typeof row[1] === 'string' && row[1].startsWith('FSF')
            ? row[1].trim()
            : null

      if (!code) continue

      const beneficiary = await Beneficiary.findOne({ where: { code }, transaction })
      if (!beneficiary) {
        notFound++
        continue
      }

      // Detectar columnas según estructura del archivo
      const isFile1 = row[2] && typeof row[2] === 'string' && row[2].startsWith('FSF')
      const offset = isFile1 ? 0 : -1 // ajuste de índice entre archivo 1 y archivo 2

      const gender = row[9 + offset] || beneficiary.gender
      const birthDate =
        row[10 + offset] instanceof Date
          ? row[10 + offset].toISOString().split('T')[0]
          : beneficiary.birth_date
      const tutoringDay = row[14 + offset]
        ? String(row[14 + offset]).trim()
        : beneficiary.tutoring_day
      const tutoringHour = row[15 + offset]
        ? String(row[15 + offset]).trim()
        : beneficiary.tutoring_hour
      const scholarship = row[16 + offset]
      const isBotadero = row[16] === 'Sí' || String(code).includes('-B')

      await beneficiary.update(
        {
          gender: gender || beneficiary.gender,
          birth_date: birthDate,
          tutoring_day: tutoringDay,
          tutoring_hour: tutoringHour,
          status: scholarship === 'Sí' ? 'Becado' : beneficiary.status,
          is_botadero: isBotadero,
        },
        { transaction }
      )

      await sendBeneficiaryToWebhook(beneficiary)
      updated++
    }

    await transaction.commit()
    return { message: 'Fase 2 completada correctamente.', updated, not_found: notFound }
  } catch (error) {
    await transaction.rollback()
    throw new Error(`Error en Fase 2, rollback aplicado: ${error.message}`)
  }
}

module.exports = { processFamiliesSheet, processGeneralDataSheet }
