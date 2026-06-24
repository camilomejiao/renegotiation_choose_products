const jsonServer = require('json-server')

const server = jsonServer.create()
const middlewares = jsonServer.defaults({ noCors: false })

server.use(middlewares)
server.use(jsonServer.bodyParser)

// Estado mutable en memoria para que el POST se refleje en el siguiente GET
let productos = JSON.parse(JSON.stringify(require('./productos.json')))

const MANAGEMENT_TYPE_NAMES = {
  1: 'Revisión',
  2: 'Justificación técnica',
  3: 'Subsanación',
  4: 'Acta complementaria',
  5: 'Ajuste de precio',
}

const normalize = (v) => String(v ?? '').trim().toLowerCase()

const matchSingle = (rowVal, filterVal) =>
  !filterVal || normalize(rowVal) === normalize(filterVal)

const matchAny = (rowVal, filterVals) =>
  !filterVals.length || filterVals.some((v) => normalize(v) === normalize(rowVal))

// GET /api/alertas/productos/
server.get(['/api/alertas/productos', '/api/alertas/productos/'], (req, res) => {
  const q = req.query

  const proveedores = [].concat(q.proveedor ?? []).filter(Boolean)
  const productosFilter = [].concat(q.producto ?? []).filter(Boolean)

  // jornada se ignora: el ID llega del backend real y no es predecible en dev.
  let result = productos.filter((p) =>
    matchSingle(p.documento_titular, q.documento_titular) &&
    matchSingle(p.cub, q.cub) &&
    matchSingle(p.numero_orden, q.numero_orden) &&
    matchSingle(p.id_producto, q.id_producto) &&
    (q.categoria_alerta == null || q.categoria_alerta === ''
      ? true
      : String(p.categoria_alerta?.codigo) === String(q.categoria_alerta)) &&
    (q.tipo_gestion == null || q.tipo_gestion === ''
      ? true
      : String(p.tipo_gestion?.codigo) === String(q.tipo_gestion)) &&
    matchSingle(p.gestion_alerta?.codigo, q.gestion_alerta) &&
    matchAny(p.proveedor, proveedores) &&
    matchAny(p.nombre_producto, productosFilter)
  )

  const page = Math.max(1, parseInt(q.page ?? q.pagina ?? '1', 10) || 1)
  const size = Math.min(100, Math.max(1, parseInt(q.size ?? q.tamano_pagina ?? '10', 10) || 10))
  const total = result.length
  const total_pages = Math.ceil(total / size) || 0
  const paged = result.slice((page - 1) * size, page * size)

  res.json({
    meta: { page, size, total_registros: total, total_pages },
    productos: paged,
  })
})

// POST /api/alertas/productos/gestion/
server.post(['/api/alertas/productos/gestion/', '/api/alertas/productos/gestion/'], (req, res) => {
  const { tipo_gestion_id, productos: productosPayload } = req.body ?? {}

  if (!tipo_gestion_id || !Array.isArray(productosPayload) || productosPayload.length === 0) {
    return res.status(400).json({
      codigo: 'SOLICITUD_INVALIDA',
      mensaje: 'Se requieren tipo_gestion_id y al menos un producto.',
    })
  }

  const gestionNombre = MANAGEMENT_TYPE_NAMES[tipo_gestion_id]

  if (!gestionNombre) {
    return res.status(400).json({
      codigo: 'TIPO_GESTION_INVALIDO',
      mensaje: `tipo_gestion_id ${tipo_gestion_id} no existe.`,
    })
  }

  const idsPayload = productosPayload.map((p) => Number(p.id_producto))

  let actualizados = 0
  productos = productos.map((p) => {
    if (!idsPayload.includes(Number(p.id_producto))) return p
    actualizados++
    return {
      ...p,
      tipo_gestion: { codigo: Number(tipo_gestion_id), nombre: gestionNombre },
    }
  })

  res.json({
    tipo_gestion_id: Number(tipo_gestion_id),
    total_productos_recibidos: productosPayload.length,
    total_productos_actualizados: actualizados,
    mensaje: 'Tipo de gestión actualizado correctamente.',
  })
})

const PORT = process.env.MOCK_PORT || 3001
server.listen(PORT, () => {
  console.log(`Mock corriendo en http://localhost:${PORT}`)
  console.log(`  GET  /api/alertas/productos/          → ${productos.length} productos`)
  console.log(`  POST /api/alertas/productos/gestion/  → actualiza tipo_gestion en memoria`)
})