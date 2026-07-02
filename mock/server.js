const jsonServer = require('json-server')

const server = jsonServer.create()
const middlewares = jsonServer.defaults({ noCors: false })

server.use(middlewares)
server.use(jsonServer.bodyParser)

// Estado mutable en memoria para que el POST se refleje en el siguiente GET
let productos = JSON.parse(JSON.stringify(require('./productos.json')))
const DETALLE_DOCUMENTOS = [
  {
    id: 22,
    tipo_archivo: 5280,
    nombre_archivo: '43_20260624233802_ACTA MESA TÉCNICA (PDF).pdf',
    descripcion: 'Documento de jornada vigente',
    usuario_creador: 'edward.oviedo+implementacion@renovacionterritorio.gov.co',
    fecha_creacion: '2026-06-24T23:38:03.177000+00:00',
    activo: true,
    ruta_archivo: 'productos_alertados/jornadas/43_20260624233802_ACTA%20MESA%20T%C3%89CNICA%20%28PDF%29.pdf',
    acciones_disponibles: ['ver', 'descargar'],
  },
  {
    id: 21,
    tipo_archivo: 5281,
    nombre_archivo: '43_20260624233802_GESTIONAR PRODUCTOS (EXCEL).xlsx',
    descripcion: 'Documento de jornada vigente',
    usuario_creador: 'edward.oviedo+implementacion@renovacionterritorio.gov.co',
    fecha_creacion: '2026-06-24T23:38:03.163000+00:00',
    activo: true,
    ruta_archivo: 'productos_alertados/jornadas/43_20260624233802_GESTIONAR%20PRODUCTOS%20%28EXCEL%29.xlsx',
    acciones_disponibles: ['descargar'],
  },
]

const solicitudesBase = [
  {
    id: 1,
    jornada_id: 43,
    jornada_codigo: 43,
    orden_detalle_id: [],
    jornada: 'Feria PNIS Antioquia 2026',
    tipo_gestion: { codigo: 5275, nombre: 'ACTA COMPLEMENTARIA' },
    categoria_alerta: { codigo: 5254, nombre: 'SIN ALERTA' },
    fecha_registro: '2026-06-24T09:15:00-05:00',
    observacion_justificativa: 'Se adjunta soporte para revisar la novedad detectada en el producto.',
    observacion_revisor: 'Pendiente validacion documental por parte del equipo tecnico.',
    rol_revisor: 'Profesional tecnico',
    gestion_alerta: { codigo: 5259, nombre: 'EN PROCESO' },
  },
  {
    id: 2,
    jornada_id: 43,
    jornada_codigo: 43,
    orden_detalle_id: [],
    jornada: 'Feria PNIS Antioquia 2026',
    tipo_gestion: { codigo: 5271, nombre: 'REVISION' },
    categoria_alerta: { codigo: 5255, nombre: 'ALERTA MEDIA' },
    fecha_registro: '2026-06-23T15:42:00-05:00',
    observacion_justificativa: 'El proveedor reporta diferencia en el valor de referencia de catalogo.',
    observacion_revisor: 'Solicitud recibida. Se requiere verificacion con el acta original.',
    rol_revisor: 'Revisor financiero',
    gestion_alerta: { codigo: 5260, nombre: 'EN SUBSANACION' },
  },
  {
    id: 3,
    jornada_id: 43,
    jornada_codigo: 43,
    orden_detalle_id: [],
    jornada: 'Feria PNIS Antioquia 2026',
    tipo_gestion: { codigo: 5273, nombre: 'SUBSANACION' },
    categoria_alerta: { codigo: 5256, nombre: 'ALERTA ALTA' },
    fecha_registro: '2026-06-20T11:05:00-05:00',
    observacion_justificativa: 'Se solicita subsanar inconsistencia en la evidencia PDF cargada.',
    observacion_revisor: 'Documento revisado y marcado para ajuste.',
    rol_revisor: 'Analista documental',
    gestion_alerta: { codigo: 5261, nombre: 'RESUELTA' },
  },
  {
    id: 4,
    jornada_id: 44,
    jornada_codigo: 44,
    orden_detalle_id: [],
    jornada: 'Feria PNIS Meta 2026',
    tipo_gestion: { codigo: 5272, nombre: 'JUSTIFICACION TECNICA' },
    categoria_alerta: { codigo: 5255, nombre: 'ALERTA MEDIA' },
    fecha_registro: '2026-06-18T08:30:00-05:00',
    observacion_justificativa: 'Se remite justificacion tecnica asociada al cambio de proveedor.',
    observacion_revisor: '',
    rol_revisor: '',
    gestion_alerta: { codigo: 5272, nombre: 'SIN GESTIÓN' },
  },
]

let solicitudes = JSON.parse(JSON.stringify(solicitudesBase))

const MANAGEMENT_TYPE_NAMES = {
  1: 'Revisión',
  2: 'Justificación técnica',
  3: 'Subsanación',
  4: 'Acta complementaria',
  5: 'Ajuste de precio',
}

const normalize = (v) => String(v ?? '').trim().toLowerCase()

const parseMultipartFormData = (req) =>
  new Promise((resolve) => {
    const chunks = []

    req.on('data', (chunk) => chunks.push(chunk))
    req.on('end', () => {
      const contentType = req.headers['content-type'] || ''
      const boundaryMatch = contentType.match(/boundary=(?:"([^"]+)"|([^;]+))/i)
      const boundary = boundaryMatch?.[1] || boundaryMatch?.[2]

      if (!boundary) {
        resolve({ fields: {}, files: {} })
        return
      }

      const raw = Buffer.concat(chunks).toString('latin1')
      const parts = raw.split(`--${boundary}`).filter(
        (part) => part && part !== '--\r\n' && part !== '--'
      )

      const fields = {}
      const files = {}

      parts.forEach((part) => {
        const cleaned = part.replace(/^\r\n/, '').replace(/\r\n$/, '')
        const [rawHeaders, ...bodyParts] = cleaned.split('\r\n\r\n')
        const body = bodyParts.join('\r\n\r\n').replace(/\r\n$/, '')
        const nameMatch = rawHeaders.match(/name="([^"]+)"/i)

        if (!nameMatch) {
          return
        }

        const fieldName = nameMatch[1]
        const fileNameMatch = rawHeaders.match(/filename="([^"]*)"/i)

        if (fileNameMatch) {
          files[fieldName] = {
            filename: fileNameMatch[1],
            contentType:
              rawHeaders.match(/Content-Type:\s*([^\r\n]+)/i)?.[1]?.trim() ||
              'application/octet-stream',
            size: Buffer.from(body, 'latin1').length,
          }
          return
        }

        if (fields[fieldName] === undefined) {
          fields[fieldName] = body
          return
        }

        if (Array.isArray(fields[fieldName])) {
          fields[fieldName].push(body)
          return
        }

        fields[fieldName] = [fields[fieldName], body]
      })

      resolve({ fields, files })
    })
  })

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

// PATCH /api/alertas/productos/solicitud/ → agrega un producto (item) a la solicitud
server.patch(['/api/alertas/productos/solicitud', '/api/alertas/productos/solicitud/'], (req, res) => {
  const { id_encabezado, id_orden_detalle } = req.body ?? {}

  if (id_encabezado == null || id_orden_detalle == null) {
    return res.status(400).json({
      codigo: 'SOLICITUD_INVALIDA',
      mensaje: 'Se requieren id_encabezado e id_orden_detalle.',
    })
  }

  return res.status(200).json({
    id_encabezado,
    id_orden_detalle,
    mensaje: 'Producto agregado a la solicitud correctamente.',
  })
})

// DELETE /api/alertas/productos/solicitud/ → elimina un producto (item) de la solicitud
server.delete(['/api/alertas/productos/solicitud', '/api/alertas/productos/solicitud/'], (req, res) => {
  const { id_encabezado, id_orden_detalle } = req.body ?? {}

  if (id_encabezado == null || id_orden_detalle == null) {
    return res.status(400).json({
      codigo: 'SOLICITUD_INVALIDA',
      mensaje: 'Se requieren id_encabezado e id_orden_detalle.',
    })
  }

  return res.status(200).json({
    id_encabezado,
    id_orden_detalle,
    mensaje: 'Producto eliminado de la solicitud correctamente.',
  })
})

// POST /api/alertas/productos/solicitud/
server.post(['/api/alertas/productos/solicitud', '/api/alertas/productos/solicitud/'], async (req, res) => {
  const { fields, files } = await parseMultipartFormData(req)
  const ordenDetalleIds = []
    .concat(fields.orden_detalle_id ?? [])
    .map((value) => Number(value))
    .filter((value) => Number.isFinite(value))
  const observacion = String(fields.observacion ?? '').trim()
  const pdf = files.pdf

  if (!ordenDetalleIds.length || !observacion || !pdf) {
    return res.status(400).json({
      codigo: 'SOLICITUD_INVALIDA',
      mensaje: 'Se requieren orden_detalle_id, observacion y pdf.',
    })
  }

  const existingRows = productos.filter((p) =>
    ordenDetalleIds.includes(Number(p.id_orden_detalle ?? p.id_producto))
  )

  if (!existingRows.length) {
    return res.status(404).json({
      codigo: 'ORDEN_DETALLE_NO_ENCONTRADO',
      mensaje: 'No existen items alertados asociados a los identificadores enviados.',
    })
  }

  const alreadyRequested = solicitudes.some((solicitud) =>
    Array.isArray(solicitud.orden_detalle_id) &&
    solicitud.orden_detalle_id.some((id) => ordenDetalleIds.includes(id))
  )

  if (alreadyRequested) {
    return res.status(409).json({
      codigo: 'DOCUMENTO_YA_REGISTRADO',
      mensaje: 'Ya existe una solicitud registrada para uno o más items enviados.',
    })
  }

  const firstMatch = existingRows[0]
  const solicitudId = `sol-${Date.now()}`
  const createdAt = new Date().toISOString()
  const solicitud = {
    id: solicitudId,
    jornada_id: firstMatch?.jornada_id ?? 43,
    jornada_codigo: firstMatch?.jornada_id ?? 43,
    orden_detalle_id: ordenDetalleIds,
    observacion,
    estado: 'guardado',
    mensaje: 'Solicitud creada correctamente',
    creado_en: createdAt,
    documento: {
      nombre_original: pdf.filename || 'solicitud-alerta.pdf',
      content_type: pdf.contentType,
      tamano_bytes: pdf.size || 1,
    },
    jornada: firstMatch?.jornada ?? '',
    tipo_gestion: firstMatch?.tipo_gestion ?? null,
    categoria_alerta: firstMatch?.categoria_alerta ?? null,
    fecha_registro: createdAt,
    observacion_justificativa: observacion,
    observacion_revisor: '',
    rol_revisor: '',
    gestion_alerta: firstMatch?.gestion_alerta ?? null,
  }

  solicitudes.unshift(solicitud)

  res.status(201)
    .setHeader('Location', `/api/alertas/productos/solicitud/${solicitudId}`)
    .json({
      id: solicitud.id,
      orden_detalle_id: solicitud.orden_detalle_id,
      observacion: solicitud.observacion,
      estado: solicitud.estado,
      mensaje: solicitud.mensaje,
      creado_en: solicitud.creado_en,
      documento: solicitud.documento,
    })
})

// GET /api/alertas/productos/solicitud/
server.get(
  ['/api/alertas/productos/solicitud', '/api/alertas/productos/solicitud/'],
  (req, res) => {
    const q = req.query

    const result = solicitudes.filter((item) => {
      const jornadaOk =
        !q.jornada ||
        String(item.jornada_id ?? '') === String(q.jornada) ||
        String(item.jornada_codigo ?? '') === String(q.jornada)
      const categoriaOk =
        q.categoria_alerta == null ||
        q.categoria_alerta === '' ||
        String(item.categoria_alerta?.codigo ?? '') === String(q.categoria_alerta)
      const gestionOk =
        q.gestion_alerta == null ||
        q.gestion_alerta === '' ||
        String(item.gestion_alerta?.codigo ?? '') === String(q.gestion_alerta)

      return jornadaOk && categoriaOk && gestionOk
    })

    const page = Math.max(1, parseInt(q.page ?? q.pagina ?? '1', 10) || 1)
    const size = Math.min(100, Math.max(1, parseInt(q.size ?? q.tamano_pagina ?? '10', 10) || 10))
    const total = result.length
    const total_pages = Math.ceil(total / size) || 0
    const paged = result.slice((page - 1) * size, page * size)

    res.json({
      meta: { page, size, total_registros: total, total_pages },
      solicitudes: paged.map((solicitud) => ({
        id: solicitud.id,
        jornada_id: solicitud.jornada_id,
        jornada: solicitud.jornada,
        tipo_gestion: solicitud.tipo_gestion,
        categoria_alerta: solicitud.categoria_alerta,
        fecha_registro: solicitud.fecha_registro,
        observacion_justificativa: solicitud.observacion_justificativa,
        observacion_revisor: solicitud.observacion_revisor,
        rol_revisor: solicitud.rol_revisor,
        gestion_alerta: solicitud.gestion_alerta,
      })),
    })
  }
)

// GET /api/alertas/productos/solicitud/detalle/
// Retorna siempre el mismo mock fijo hasta que el backend real exponga un id por solicitud.
server.get(
  ['/api/alertas/productos/solicitud/detalle', '/api/alertas/productos/solicitud/detalle/'],
  (req, res) => {
    const MOCK_SOLICITUD = solicitudesBase[0]

    res.json({
      id_solicitud: req.query.id_solicitud || MOCK_SOLICITUD.id,
      resumen: `Solicitud documental asociada a la jornada ${MOCK_SOLICITUD.jornada} para validación de alerta de productos.`,
      estado_solicitud: { codigo: MOCK_SOLICITUD.gestion_alerta.codigo, nombre: MOCK_SOLICITUD.gestion_alerta.nombre },
      usuario_origen: MOCK_SOLICITUD.rol_revisor || 'Implementación',
      fecha_implementacion: MOCK_SOLICITUD.fecha_registro,
      jornada: { id: MOCK_SOLICITUD.jornada_id, nombre: MOCK_SOLICITUD.jornada },
      observacion_justificativa: MOCK_SOLICITUD.observacion_justificativa,
      documentos: DETALLE_DOCUMENTOS,
      traza_eventos: [
        {
          titulo: 'Documentos de jornada asociados',
          fecha_evento: MOCK_SOLICITUD.fecha_registro,
          usuario: 'Sistema',
          variante: 'informacion',
        },
        {
          titulo: 'Solicitud enviada por Implementación',
          fecha_evento: MOCK_SOLICITUD.fecha_registro,
          usuario: MOCK_SOLICITUD.rol_revisor || 'Implementación',
          variante: 'alerta',
        },
      ],
      productos_asociados: [],
    })
  }
)

const PORT = process.env.MOCK_PORT || 3001
server.listen(PORT, () => {
  console.log(`Mock corriendo en http://localhost:${PORT}`)
  console.log(`  GET  /api/alertas/productos/                    → ${productos.length} productos`)
  console.log(`  POST /api/alertas/productos/solicitud/          → crea solicitudes en memoria`)
  console.log(`  POST /api/alertas/productos/gestion/            → actualiza tipo_gestion en memoria`)
  console.log(`  GET  /api/alertas/productos/solicitud/          → ${solicitudes.length} solicitudes fake`)
  console.log(`  GET  /api/alertas/productos/solicitud/detalle/  → detalle de solicitud por id_solicitud`)
})
