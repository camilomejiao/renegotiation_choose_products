const { createProxyMiddleware } = require('http-proxy-middleware')

const REAL_BACKEND = 'https://devproveedorespnis.direccionsustitucion-pnis.gov.co'
const MOCK_PORT = process.env.MOCK_PORT || 3001

module.exports = function (app) {
  // Productos alertados → mock (backend aún no existe)
  app.use(
    '/api/alertas/productos',
    createProxyMiddleware({
      target: `http://localhost:${MOCK_PORT}`,
      changeOrigin: true,
    })
  )

  // Todo lo demás (filtros, documentos, jornadas, etc.) → backend real
  app.use(
    '/api',
    createProxyMiddleware({
      target: REAL_BACKEND,
      changeOrigin: true,
      secure: false,
    })
  )
}
