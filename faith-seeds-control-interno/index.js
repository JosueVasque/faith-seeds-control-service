require('dotenv').config()
const app = require('./src/app')
const { sequelize } = require('./src/models')

const PORT = process.env.PORT || 3000

async function startServer() {
  try {
    // Verificar conexión a la base de datos
    await sequelize.authenticate()
    console.log('✅ Conexión a la base de datos establecida.')

    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`)
    })
  } catch (error) {
    console.error('❌ No se pudo conectar a la base de datos:', error.message)
    process.exit(1)
  }
}

startServer()
