const axios = require('axios')

let cachedToken = null
let tokenExpiry = null

// ─── Autenticación con el inventory-service ───────────────────────────────────

const getAuthToken = async () => {
  if (cachedToken && tokenExpiry && Date.now() < tokenExpiry) {
    return cachedToken
  }
  try {
    const res = await axios.post(`${process.env.INVENTORY_URL}/auth/login`, {
      email: process.env.INVENTORY_EMAIL,
      password: process.env.INVENTORY_PASSWORD,
    })
    cachedToken = res.data.data.token
    tokenExpiry = Date.now() + 23 * 60 * 60 * 1000
    console.log('✅ Token de inventory-service obtenido.')
    return cachedToken
  } catch (error) {
    console.error('❌ Error al autenticar con inventory-service:', error.message)
    return null
  }
}

// ─── Sincronizar beneficiario con inventory-service ──────────────────────────
// El inventory-service usa external_ref como referencia al código FSF.
// Si ya existe por external_ref, el repository lo actualiza automáticamente.
// Si no existe, lo crea con el external_ref.

const sendBeneficiaryToWebhook = async beneficiary => {
  if (!process.env.INVENTORY_URL) {
    console.warn('⚠️ INVENTORY_URL no definida, se omite integración.')
    return
  }

  try {
    const token = await getAuthToken()
    if (!token) return

    const categoria = beneficiary.is_botadero ? 'botadero' : 'comunidad'

    const payload = {
      nombres: beneficiary.first_name,
      apellidos: beneficiary.last_name,
      externalRef: beneficiary.code,
      categoria,
    }

    // El create del inventory-service ya maneja upsert por external_ref
    await axios.post(`${process.env.INVENTORY_URL}/beneficiaries`, payload, {
      headers: { Authorization: `Bearer ${token}` },
    })

    console.log(`📤 Sincronizado con inventory-service: ${beneficiary.code}`)
  } catch (error) {
    console.error(
      `❌ Error al sincronizar ${beneficiary.code}:`,
      error.response?.data || error.message
    )
  }
}

module.exports = { sendBeneficiaryToWebhook }
