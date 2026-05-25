const axios = require('axios')

/**
 * Envía los datos de un beneficiario al sistema externo de útiles.
 * Se llama cada vez que se crea o actualiza un beneficiario.
 */
const sendBeneficiaryToWebhook = async beneficiary => {
  const webhookUrl = process.env.WEBHOOK_URL

  if (!webhookUrl) {
    console.warn('⚠️ WEBHOOK_URL no definida en .env, se omite integración.')
    return
  }

  try {
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

    await axios.post(webhookUrl, payload)
    console.log(`📤 Webhook enviado para beneficiario: ${beneficiary.code}`)
  } catch (error) {
    // No lanzamos el error para no interrumpir el flujo principal
    console.error(`❌ Error al enviar webhook para ${beneficiary.code}:`, error.message)
  }
}

module.exports = { sendBeneficiaryToWebhook }
