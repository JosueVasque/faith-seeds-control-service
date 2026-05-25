const axios = require('axios')

let cachedToken = null
let tokenExpiry = null

// ─── Autenticación con el inventory-service ───────────────────────────────────

const getAuthToken = async () => {
  // Si el token aún es válido lo reutilizamos
  if (cachedToken && tokenExpiry && Date.now() < tokenExpiry) {
    return cachedToken
  }

  try {
    const res = await axios.post(`${process.env.INVENTORY_URL}/auth/login`, {
      email: process.env.INVENTORY_EMAIL,
      password: process.env.INVENTORY_PASSWORD,
    })

    cachedToken = res.data.data.token
    // Expira en 23 horas para renovar antes de que el JWT expire
    tokenExpiry = Date.now() + 23 * 60 * 60 * 1000

    console.log('✅ Token de inventory-service obtenido.')
    return cachedToken
  } catch (error) {
    console.error('❌ Error al autenticar con inventory-service:', error.message)
    return null
  }
}

// ─── Sincronizar beneficiario con inventory-service ──────────────────────────

const sendBeneficiaryToWebhook = async beneficiary => {
  if (!process.env.INVENTORY_URL) {
    console.warn('⚠️ INVENTORY_URL no definida, se omite integración.')
    return
  }

  try {
    const token = await getAuthToken()
    if (!token) return

    const payload = {
      code: beneficiary.code,
      first_name: beneficiary.first_name,
      last_name: beneficiary.last_name,
      sector: beneficiary.sector,
      status: beneficiary.status,
      gender: beneficiary.gender,
      age: beneficiary.age,
      tutor_id: beneficiary.tutor_id,
      school_id: beneficiary.school_id,
      grade_id: beneficiary.grade_id,
    }

    // Primero verificamos si ya existe en el inventory-service
    try {
      await axios.get(`${process.env.INVENTORY_URL}/beneficiaries/${beneficiary.code}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      // Si existe lo actualizamos
      await axios.put(`${process.env.INVENTORY_URL}/beneficiaries/${beneficiary.code}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      })
      console.log(`🔄 Beneficiario actualizado en inventory-service: ${beneficiary.code}`)
    } catch (notFound) {
      // Si no existe lo creamos
      await axios.post(`${process.env.INVENTORY_URL}/beneficiaries`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      })
      console.log(`📤 Beneficiario creado en inventory-service: ${beneficiary.code}`)
    }
  } catch (error) {
    console.error(`❌ Error al sincronizar beneficiario ${beneficiary.code}:`, error.message)
  }
}

module.exports = { sendBeneficiaryToWebhook }
