/**
 * 🎯 Service 100% dinámico para generar sidebar desde el backend
 * Se adapta automáticamente a cualquier estructura que venga en el JSON
 */

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

// 🎨 MAPEO ESPECÍFICO DE ICONOS POR CÓDIGO DE OPCIÓN
// Aquí puedes personalizar el icono de cada opción individual
const SPECIFIC_ICON_MAPPING = {
  // ========== CONEXION 1: Secury PURE ==========
  "SECM_0001": "FileEdit",        // Opciones
  "SECM_0002": "LayoutGrid",      // Grupos o Menues
  "SECM_0003": "UserCog",         // Roles
  "SECM_0004": "Building2",       // Compañías
  "SECM_0005": "Users",           // Usuarios
  "SECM_0006": "UserCheck",       // Usuarios x compañías
  "SECM_0007": "ClipboardList",   // Perfil de Usuario x Cia.
  "SECM_0008": "Settings",        // Parametros

  // ========== CONEXION 2: Módulo Ventas ==========
  "RTKR_0001": "MapPin",          // Ubicación GPS
  "RTKR_0003": "ShoppingCart",    // Gestión de Pedidos
  "RTKR_0004": "DollarSign",      // Gestión de Cobros
  "RTKR_0005": "CheckCircle",     // Gestión Realizada
  "RTKR_0006": "History",         // Historial de Sync
  "RTKR_0008": "Activity",        // Informe de Actividades Realizadas
  "RTKR_0009": "UserPlus",        // Informe de Clientes Nuevos
  "RTKR_0012": "FileText",        // Informe de Datos de Clientes
  
  "RTKP_0001": "CheckSquare",     // Autorizacion de Cobros
  "RTKP_0002": "Truck",           // Planificacion de Cargamento de Camion
  "RTKP_0005": "UserCheck",       // Autorizacion de Clientes Nuevos
  "RTKP_0007": "Monitor",         // Consola de Novedades
  "RTKP_0009": "Edit",            // Autorización de Datos de Clientes
  
  "RTKM_0004": "Smartphone",      // Cambiar equipo móvil
  "RTKM_0007": "Users2",          // Vendedor Secundario
  "RTKM_0010": "MapPinned",       // Cercas de Vendedores
  "RTKM_0012": "UserSquare",      // Usuarios de Novedades
  "RTKM_0013": "Flag",            // Prioridades en Novedades
  "RTKM_0014": "UsersRound",      // Grupo de Usuarios
  "RTKM_0015": "ToggleLeft",      // Estado de Novedades
  "RTKM_0016": "TrendingUp",      // Actividades de Ventas
  
  "GENM_0001": "Building",        // Oficinas
  "GENM_0004": "Sliders",         // Parámetros de compañía
  "GENM_0005": "SlidersHorizontal", // Parámetros de oficina
  "GENM_0006": "BookOpen",        // Referenciales de compañía
  "GENM_0007": "Book",            // Referenciales de oficina
  "GENM_0008": "Info",            // Datos de la compañía
  
  "CXCM_0002": "Route",           // Rutas
  "CXCM_0006": "CreditCard",      // Activación Financiera
  "CXCM_0009": "Navigation",      // Ajusta Ubicación
  
  "FACM_0008": "FileText",        // Centro de Facturación
  "FACT_0001": "ShoppingBag",     // Registro de Pedido
  
  "HRRP_0001": "FileSpreadsheet", // Cargue de Excel
  
  "MCHM_0002": "BookmarkPlus",    // Catalogos
  "MCHM_0003": "ClipboardCheck",  // Encuestas
  
  "WMSR_0004": "Package",         // Control de Activo
  
  "RTKT_0001": "ClipboardEdit",   // Registro Manual de Visita

  // ========== CONEXION 3: Módulo Vigilancia ==========
  "WMSM_0001": "UserCircle",      // Operadores (Guardias)
  "WMSM_0004": "Warehouse",       // Bodegas
  
  "SCAM_0001": "Tablet",          // Equipos Móviles
  
  "VIGR_0001": "Eye",             // Monitoreo
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
  const match = code.match(/^([A-Z]+)/)
  return match ? match[1] : "OTHER"
}

/**
 * 🎨 Obtiene el icono según el código
 * PRIORIDAD: 
 * 1. Icono específico del código completo (SECM_0001)
 * 2. Icono del prefijo (SECM)
 * 3. Icono por defecto (Circle)
 */
const getIconForCode = (code) => {
  // 1. Buscar icono específico para el código completo
  if (SPECIFIC_ICON_MAPPING[code]) {
    console.log(`  🎨 Icono específico encontrado para ${code}: ${SPECIFIC_ICON_MAPPING[code]}`)
    return SPECIFIC_ICON_MAPPING[code]
  }
  
  // 2. Buscar icono por prefijo
  const prefix = extractPrefix(code)
  if (ICON_MAPPING[prefix]) {
    console.log(`  🎨 Icono por prefijo para ${code}: ${ICON_MAPPING[prefix]}`)
    return ICON_MAPPING[prefix]
  }
  
  // 3. Icono por defecto
  console.log(`  🎨 Icono por defecto para ${code}: Circle`)
  return "Circle"
}

/**
 * 📝 Obtiene el nombre del grupo según el prefijo
 */
const getGroupName = (prefix) => {
  return GROUP_NAMES[prefix] || prefix
}

/**
 * 🔄 Agrupa opciones por prefijo automáticamente
 * Incluye TODAS las opciones de la conexión seleccionada
 */
const groupOptionsByPrefix = (options) => {
  console.log("📦 === Iniciando agrupación por prefijo ===")
  const groups = {}
  let totalOptions = 0

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
  console.log(`📦 Grupos creados: ${Object.keys(groups).length}`)
  
  Object.keys(groups).forEach(prefix => {
    console.log(`  └─ ${prefix}: ${groups[prefix].length} items`)
  })

  return groups
}

/**
 * 🏗️ Detecta si un grupo debe tener sub-items
 * Criterio: Si hay más de 3 items con el mismo prefijo y códigos secuenciales
 * ⚠️ EXCEPCIÓN: SECM siempre se muestra sin agrupar (solo items individuales)
 */
const shouldGroupAsSubItems = (items, prefix) => {
  // ✨ EXCEPCIÓN: SECM siempre items individuales (sin sub-items)
  if (prefix === "SECM") {
    console.log(`  🔓 SECM detectado - Forzando items individuales (sin agrupación)`)
    return false
  }

  if (items.length <= 3) return false

  // Verificar si son códigos secuenciales (ej: GENM_0004, GENM_0005, GENM_0006)
  const codes = items.map(item => {
    const match = item.code.match(/_(\d+)$/)
    return match ? parseInt(match[1]) : 0
  }).sort((a, b) => a - b)

  // Si hay al menos 3 códigos consecutivos, agrupar
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
  console.log(`  🔓 Acceso: ${company.acceso}`)
  console.log(`  📋 Opciones totales: ${company.profiles_user_comp?.length || 0}`)

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

  // Agrupar por prefijo (TODAS las opciones)
  const groupedByPrefix = groupOptionsByPrefix(options)

  console.log(`\n📦 Grupos generados por prefijo:`, Object.keys(groupedByPrefix))

  // Construir grupos del menú
  const menuGroups = []

  console.log("\n🏗️ === Construyendo estructura de menú ===")

  Object.keys(groupedByPrefix).sort().forEach(prefix => {
    const items = groupedByPrefix[prefix]
    
    if (items.length === 0) {
      console.log(`⚠️ Grupo ${prefix} vacío, omitiendo...`)
      return
    }

    const groupName = getGroupName(prefix)

    console.log(`\n📁 Procesando grupo: ${groupName} (${prefix})`)
    console.log(`  📊 Items en grupo: ${items.length}`)

    // Decidir si agrupar como sub-items o items individuales
    const shouldGroup = shouldGroupAsSubItems(items, prefix)
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
              icon: getIconForCode(item.code), // 🎨 Icono específico para cada sub-item
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
          icon: getIconForCode(item.code), // 🎨 Icono específico para cada item
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
        console.log(`     └─ ${item.label} [${item.icon}]`)
      }
    })
  })

  console.log("\n🔄 ==========================================")
  console.log("🔄 === FIN transformToSidebarConfig ===")
  console.log("🔄 ==========================================\n")

  return config
}

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
 * 🔒 Valida permisos específicos para acciones
 * Esta función se debe usar en cada componente para validar acciones específicas
 * @param {Object} permissions - Objeto de permisos
 * @param {String} action - Acción a validar (create, read, update, delete, print, export)
 * @returns {Boolean} - true si tiene el permiso
 */
export const hasPermission = (permissions, action) => {
  if (!permissions) {
    console.warn("⚠️ Permisos no definidos")
    return false
  }

  const permissionKey = `est_${action}`
  const value = permissions[permissionKey]
  const hasAccess = value === "1" || value === 1
  
  return hasAccess
}

/**
 * 🔍 Obtener permisos detallados de un item
 * @param {Object} permissions - Objeto de permisos
 * @returns {Object} - Objeto con todos los permisos en formato booleano
 */
export const getPermissionsDetail = (permissions) => {
  if (!permissions) {
    return {
      canCreate: false,
      canRead: false,
      canUpdate: false,
      canDelete: false,
      canPrint: false,
      canExport: false
    }
  }

  return {
    canCreate: permissions.est_create === "1" || permissions.est_create === 1,
    canRead: permissions.est_read === "1" || permissions.est_read === 1,
    canUpdate: permissions.est_update === "1" || permissions.est_update === 1,
    canDelete: permissions.est_delete === "1" || permissions.est_delete === 1,
    canPrint: permissions.est_print === "1" || permissions.est_print === 1,
    canExport: permissions.est_export === "1" || permissions.est_export === 1
  }
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
    companyAcceso: company.acceso,
    byPrefix: {},
    permissionsSummary: {
      est_create: { yes: 0, no: 0 },
      est_read: { yes: 0, no: 0 },
      est_update: { yes: 0, no: 0 },
      est_delete: { yes: 0, no: 0 },
      est_print: { yes: 0, no: 0 },
      est_export: { yes: 0, no: 0 },
    },
    optionsDetail: []
  }

  options.forEach(opt => {
    if (!opt.option) return

    const code = opt.option.url
    const prefix = extractPrefix(code)

    if (!analysis.byPrefix[prefix]) {
      analysis.byPrefix[prefix] = { total: 0 }
    }
    analysis.byPrefix[prefix].total++

    if (opt.permisos) {
      // Analizar todos los permisos
      Object.keys(analysis.permissionsSummary).forEach(perm => {
        if (opt.permisos[perm] === "1" || opt.permisos[perm] === 1) {
          analysis.permissionsSummary[perm].yes++
        } else {
          analysis.permissionsSummary[perm].no++
        }
      })

      // Detalle de cada opción
      const perms = getPermissionsDetail(opt.permisos)
      analysis.optionsDetail.push({
        code: code,
        nombre: opt.option.nombre,
        icon: getIconForCode(code), // 🎨 Incluir el icono en el análisis
        permisos: perms
      })
    }
  })

  return analysis
}

export default {
  transformToSidebarConfig,
  optimizeGroups,
  analyzePermissions,
  hasPermission,
  getPermissionsDetail
}