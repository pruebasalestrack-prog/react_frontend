/**
 * 🎯 Service 100% dinámico para generar sidebar desde el backend
 * Se adapta automáticamente a cualquier estructura que venga en el JSON
 *
 * NOTAS DE CAMBIO (mínimas, seguras):
 * - hasReadPermission ahora valida est_read (compatibilidad string/number).
 * - groupOptionsByPrefix ahora recibe companyAccess y respeta company.acceso === "1"
 * - transformToSidebarConfig pasa company.acceso a groupOptionsByPrefix.
 *
 * Con esto se mostrarán todas las opciones cuya compañía tenga acceso = "1"
 * y cuya opción tenga permisos.est_read = "1". Las que tengan 0 en cualquiera
 * de esos campos no se mostrarán.
 */

/* =========================
   MAPEOS Y HELPERS
   ========================= */

// Mapeo de códigos a iconos (puedes expandirlo según necesites)
const ICON_MAPPING = {
  // Seguridad
  SECM: "Shield",

  // Reportes
  RTKR: "BarChart3",

  // Procesos
  RTKP: "Settings",

  // Maestros
  RTKM: "Database",

  // CXC
  CXCM: "DollarSign",

  // Facturación
  FACM: "FileText",
  FACT: "ShoppingBag",

  // General
  GENM: "Sliders",

  // WMS
  WMSM: "Package",
  WMSR: "Warehouse",

  // Merchandising
  MCHM: "Store",

  // Vigilancia
  VIGR: "Eye",

  // RRHH
  HRRP: "Users",

  // Transacciones
  RTKT: "CheckSquare",

  // SCA
  SCAM: "Smartphone",
}

// Mapeo de prefijos a nombres de grupos
const GROUP_NAMES = {
  SECM: "SEGURIDAD",
  RTKR: "REPORTES",
  RTKP: "PROCESOS",
  RTKM: "MAESTROS",
  CXCM: "CUENTAS POR COBRAR",
  FACM: "FACTURACIÓN",
  FACT: "FACTURACIÓN",
  GENM: "CONFIGURACIÓN GENERAL",
  WMSM: "ALMACÉN",
  WMSR: "ALMACÉN",
  MCHM: "MERCHANDISING",
  VIGR: "VIGILANCIA",
  HRRP: "RECURSOS HUMANOS",
  RTKT: "TRANSACCIONES",
  SCAM: "CONTROL DE ACCESO",
}

/**
 * 🔍 Extrae el prefijo del código (ej: "RTKR_0003" -> "RTKR")
 */
const extractPrefix = (code) => {
  const match = code && code.match ? code.match(/^([A-Z]+)/) : null
  return match ? match[1] : "OTHER"
}

/**
 * 🎨 Obtiene el icono según el código
 */
const getIconForCode = (code) => {
  const prefix = extractPrefix(code)
  return ICON_MAPPING[prefix] || "Circle"
}

/**
 * 📝 Obtiene el nombre del grupo según el prefijo
 */
const getGroupName = (prefix) => {
  return GROUP_NAMES[prefix] || prefix
}

/* =========================
   PERMISOS: Validación central
   ========================= */

/**
 * ✅ Verifica si la opción tiene permiso de lectura (est_read).
 * - Acepta "1" o 1 como verdadero.
 * - No asume otros campos; es la condición para mostrar la opción.
 */
const hasReadPermission = (permisos) => {
  if (!permisos) {
    console.warn("⚠️ Permisos undefined")
    return false
  }

  // Verificar est_read (compatibilidad string/number)
  const estRead = permisos.est_read === "1" || permisos.est_read === 1

  if (!estRead) {
    console.log(`🚫 Permiso denegado - est_read: ${permisos.est_read}`)
  }

  return estRead
}

/* =========================
   AGRUPACIÓN DE OPCIONES
   ========================= */

/**
 * 🔄 Agrupa opciones por prefijo automáticamente
 * - Solo incluye opciones si la compañía tiene acceso = "1"
 * - Solo incluye opciones con permisos.est_read = "1"
 *
 * @param {Array} options - profiles_user_comp
 * @param {String|Number} companyAccess - company.acceso
 * @returns {Object} groups por prefijo
 */
const groupOptionsByPrefix = (options, companyAccess) => {
  console.log("📦 === Iniciando agrupación por prefijo ===")
  const groups = {}
  let totalOptions = 0
  let allowedOptions = 0

  // Si la compañía no tiene acceso, no incluir nada
  if (!(companyAccess === "1" || companyAccess === 1)) {
    console.log("🚫 La compañía no tiene acceso (company.acceso != 1) - No se generan opciones")
    return {}
  }

  if (!Array.isArray(options)) {
    console.warn("⚠️ options no es un array:", options)
    return {}
  }

  options.forEach((opt, index) => {
    totalOptions++
    console.log(`\n🔍 Procesando opción ${index + 1}/${options.length}:`)

    // Validar estructura básica
    if (!opt.option || !opt.permisos) {
      console.warn("⚠️ Opción sin estructura válida:", opt)
      return
    }

    console.log(`  📝 Nombre: ${opt.option.nombre}`)
    console.log(`  🔑 Código: ${opt.option.url}`)
    console.log(`  🔒 Permisos:`, opt.permisos)

    // VALIDACIÓN: incluir solo si est_read = "1"
    if (!hasReadPermission(opt.permisos)) {
      console.log(`  🚫 BLOQUEADA - est_read: ${opt.permisos.est_read}`)
      return
    }

    allowedOptions++
    console.log(`  ✅ PERMITIDA`)

    const code = opt.option.url
    const prefix = extractPrefix(code)
    console.log(`  📂 Prefijo extraído: ${prefix}`)

    if (!groups[prefix]) {
      groups[prefix] = []
      console.log(`  🆕 Nuevo grupo creado: ${prefix}`)
    }

    groups[prefix].push({
      code: code,
      nombre: opt.option.nombre,
      permisos: opt.permisos
    })

    console.log(`  ➕ Agregada al grupo ${prefix} (total: ${groups[prefix].length})`)
  })

  console.log(`\n📊 === Resumen de agrupación ===`)
  console.log(`📊 Total opciones procesadas: ${totalOptions}`)
  console.log(`✅ Opciones permitidas: ${allowedOptions}`)
  console.log(`🚫 Opciones bloqueadas: ${totalOptions - allowedOptions}`)
  console.log(`📦 Grupos creados: ${Object.keys(groups).length}`)

  Object.keys(groups).forEach(prefix => {
    console.log(`  └─ ${prefix}: ${groups[prefix].length} items`)
  })

  return groups
}

/**
 * 🏗️ Detecta si un grupo debe tener sub-items
 * Criterio: Si hay más de 3 items con el mismo prefijo y códigos secuenciales
 */
const shouldGroupAsSubItems = (items) => {
  if (!Array.isArray(items) || items.length <= 3) return false

  const codes = items.map(item => {
    const match = item.code && item.code.match ? item.code.match(/_(\d+)$/) : null
    return match ? parseInt(match[1]) : 0
  }).sort((a, b) => a - b)

  let consecutive = 1
  for (let i = 1; i < codes.length; i++) {
    if (codes[i] === codes[i - 1] + 1) {
      consecutive++
      if (consecutive >= 3) return true
    } else {
      consecutive = 1
    }
  }

  return false
}

/* =========================
   TRANSFORMACIÓN PRINCIPAL
   ========================= */

/**
 * 🔄 Transforma las opciones del backend en estructura de sidebar
 * @param {Array} companies - Array de compañías del usuario
 * @param {String} selectedConnection - Conexión activa actual
 * @returns {Object} Configuración del sidebar
 */
export const transformToSidebarConfig = (companies, selectedConnection) => {
  console.log("\n🔄 ==========================================")
  console.log("🔄 === INICIO transformToSidebarConfig ===")
  console.log("🔄 ==========================================")
  console.log("📥 Companies recibidas:", companies?.length || 0)
  console.log("🔌 Conexión seleccionada:", selectedConnection)

  if (!companies || companies.length === 0) {
    console.warn("⚠️ No hay compañías disponibles")
    return null
  }

  // Buscar la compañía de la conexión seleccionada
  console.log("\n🔍 Buscando compañía para conexión:", selectedConnection)
  console.log("📋 Conexiones disponibles:", companies.map(c => c.conexion))

  const company = companies.find(c => c.conexion === selectedConnection)

  if (!company) {
    console.warn(`❌ No se encontró compañía para conexión: ${selectedConnection}`)
    console.log("📋 Conexiones disponibles:", companies.map(c => `${c.nick} (${c.conexion})`))
    return null
  }

  console.log(`\n✅ Compañía encontrada:`)
  console.log(`  📛 Nick: ${company.nick}`)
  console.log(`  🏢 Razón Social: ${company.razonsocial}`)
  console.log(`  🔌 Conexión: ${company.conexion}`)
  console.log(`  📋 Opciones totales: ${company.profiles_user_comp?.length || 0}`)
  console.log(`  🔐 Acceso compañía (acceso): ${company.acceso}`)

  // Si la compañía no tiene acceso = "1", retornar config vacía (o null según preferencia)
  if (!(company.acceso === "1" || company.acceso === 1)) {
    console.log("🚫 La compañía no tiene acceso (acceso != 1). Sidebar vacío.")
    return {
      name: company.nick,
      razonsocial: company.razonsocial,
      connection: selectedConnection,
      menuGroups: []
    }
  }

  // Obtener todas las opciones con permisos
  const options = company.profiles_user_comp || []

  if (options.length === 0) {
    console.warn("⚠️ No hay opciones disponibles para esta compañía")
    return {
      name: company.nick,
      razonsocial: company.razonsocial,
      connection: selectedConnection,
      menuGroups: []
    }
  }

  console.log(`\n📄 Muestra de opciones (primera opción):`)
  if (options[0]) {
    console.log(JSON.stringify(options[0], null, 2))
  }

  // Agrupar por prefijo (solo opciones con est_read = "1") - respetando acceso de la compañía
  const groupedByPrefix = groupOptionsByPrefix(options, company.acceso)

  console.log(`\n📦 Grupos generados por prefijo:`, Object.keys(groupedByPrefix))

  // Construir grupos del menú
  const menuGroups = []

  console.log("\n🏗️ === Construyendo estructura de menú ===")

  Object.keys(groupedByPrefix).sort().forEach(prefix => {
    const items = groupedByPrefix[prefix]

    if (!items || items.length === 0) {
      console.log(`⚠️ Grupo ${prefix} vacío, omitiendo...`)
      return
    }

    const groupName = getGroupName(prefix)

    console.log(`\n📁 Procesando grupo: ${groupName} (${prefix})`)
    console.log(`  📊 Items en grupo: ${items.length}`)

    // Decidir si agrupar como sub-items o items individuales
    const shouldGroup = shouldGroupAsSubItems(items)
    console.log(`  🤔 ¿Agrupar como sub-items?: ${shouldGroup}`)

    if (shouldGroup) {
      // Crear un item principal con sub-items
      const group = {
        title: groupName,
        items: [
          {
            icon: getIconForCode(items[0].code),
            label: groupName,
            subItems: items.map(item => ({
              icon: getIconForCode(item.code),
              label: item.nombre,
              path: `/dashboard/${item.code.toLowerCase().replace(/_/g, '-')}`,
              permissions: item.permisos
            }))
          }
        ]
      }
      menuGroups.push(group)
      console.log(`  ✅ Grupo con sub-items creado (${items.length} sub-items)`)
    } else {
      // Items individuales
      const group = {
        title: groupName,
        items: items.map(item => ({
          icon: getIconForCode(item.code),
          label: item.nombre,
          path: `/dashboard/${item.code.toLowerCase().replace(/_/g, '-')}`,
          permissions: item.permisos
        }))
      }
      menuGroups.push(group)
      console.log(`  ✅ Grupo con items individuales creado (${items.length} items)`)
    }
  })

  const config = {
    name: company.nick,
    razonsocial: company.razonsocial,
    connection: selectedConnection,
    menuGroups: menuGroups
  }

  console.log(`\n🎉 === Sidebar generado exitosamente ===`)
  console.log(`📊 Total de grupos: ${menuGroups.length}`)
  console.log(`📋 Estructura final:`)
  menuGroups.forEach((group, index) => {
    console.log(`  ${index + 1}. ${group.title} - ${group.items.length} items`)
    group.items.forEach((item, itemIndex) => {
      if (item.subItems) {
        console.log(`     └─ ${item.label} (${item.subItems.length} sub-items)`)
      } else {
        console.log(`     └─ ${item.label}`)
      }
    })
  })

  console.log("\n🔄 ==========================================")
  console.log("🔄 === FIN transformToSidebarConfig ===")
  console.log("🔄 ==========================================\n")

  return config
}

/* =========================
   OPTIMIZACIÓN Y ANÁLISIS (sin cambios lógicos)
   ========================= */

/**
 * 🎨 Optimiza los grupos combinando similares
 * Si hay grupos con solo 1 item, intentar combinarlos
 */
export const optimizeGroups = (menuGroups) => {
  console.log("\n🔧 === Optimizando grupos ===")

  if (!menuGroups || menuGroups.length === 0) {
    console.log("⚠️ No hay grupos para optimizar")
    return []
  }

  console.log(`📊 Grupos antes de optimizar: ${menuGroups.length}`)

  const optimized = []
  const singleItemGroups = []

  menuGroups.forEach(group => {
    if (group.items.length === 1 && !group.items[0].subItems) {
      singleItemGroups.push(group)
      console.log(`  📌 Grupo con 1 item: ${group.title}`)
    } else {
      optimized.push(group)
      console.log(`  ✅ Grupo mantenido: ${group.title} (${group.items.length} items)`)
    }
  })

  // Si hay grupos de un solo item, combinarlos en "OTROS"
  if (singleItemGroups.length > 2) { // Solo si hay más de 2 grupos solitarios
    optimized.push({
      title: "OTROS",
      items: singleItemGroups.flatMap(g => g.items)
    })
    console.log(`🔧 Optimización: ${singleItemGroups.length} grupos combinados en "OTROS"`)
  } else {
    // Si son pocos, dejarlos separados
    optimized.push(...singleItemGroups)
    console.log(`🔧 Manteniendo ${singleItemGroups.length} grupos individuales (menos de 3)`)
  }

  console.log(`📊 Grupos después de optimizar: ${optimized.length}`)
  console.log("🔧 === Fin de optimización ===\n")

  return optimized
}

/**
 * 🔍 Analiza la estructura de permisos para debug
 */
export const analyzePermissions = (companies, selectedConnection) => {
  const company = companies.find(c => c.conexion === selectedConnection)
  if (!company) return null

  const options = company.profiles_user_comp || []

  const analysis = {
    total: options.length,
    withReadAccess: 0,
    withoutReadAccess: 0,
    byPrefix: {},
    permissionsSummary: {
      est_create: { yes: 0, no: 0 },
      est_read: { yes: 0, no: 0 },
      est_update: { yes: 0, no: 0 },
      est_delete: { yes: 0, no: 0 },
      est_print: { yes: 0, no: 0 },
      est_export: { yes: 0, no: 0 },
    },
    optionsWithoutRead: []
  }

  options.forEach(opt => {
    if (!opt.option) return

    const code = opt.option.url
    const prefix = extractPrefix(code)

    if (!analysis.byPrefix[prefix]) {
      analysis.byPrefix[prefix] = { total: 0, readable: 0 }
    }
    analysis.byPrefix[prefix].total++

    if (opt.permisos) {
      // Verificar est_read
      if (hasReadPermission(opt.permisos)) {
        analysis.withReadAccess++
        analysis.byPrefix[prefix].readable++
      } else {
        analysis.withoutReadAccess++
        analysis.optionsWithoutRead.push({
          code: code,
          nombre: opt.option.nombre,
          est_read: opt.permisos.est_read
        })
      }

      // Analizar todos los permisos
      Object.keys(analysis.permissionsSummary).forEach(perm => {
        if (opt.permisos[perm] === "1" || opt.permisos[perm] === 1) {
          analysis.permissionsSummary[perm].yes++
        } else {
          analysis.permissionsSummary[perm].no++
        }
      })
    }
  })

  return analysis
}

export default {
  transformToSidebarConfig,
  optimizeGroups,
  analyzePermissions
}