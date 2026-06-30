const { createProxyMiddleware } = require('http-proxy-middleware')

const REAL_BACKEND = 'https://devproveedorespnis.direccionsustitucion-pnis.gov.co'

module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: REAL_BACKEND,
      changeOrigin: true,
      secure: false,
    })
  )
}
