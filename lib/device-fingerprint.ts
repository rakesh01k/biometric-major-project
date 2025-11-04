/**
 * Generates a real device fingerprint from browser/system capabilities
 * Uses multiple data points to create a unique identifier for the device
 */
export async function generateDeviceFingerprint(): Promise<string> {
  const components: string[] = []

  // 1. Get canvas fingerprint
  const canvasFingerprint = getCanvasFingerprint()
  components.push(canvasFingerprint)

  // 2. Get WebGL fingerprint (GPU info)
  const webglFingerprint = getWebGLFingerprint()
  components.push(webglFingerprint)

  // 3. Get navigator/hardware info
  const hardwareInfo = getHardwareInfo()
  components.push(hardwareInfo)

  // 4. Get timezone and locale
  const localeInfo = getLocaleInfo()
  components.push(localeInfo)

  // 5. Get storage capabilities
  const storageInfo = getStorageInfo()
  components.push(storageInfo)

  // Combine all components and hash them
  const combined = components.join("|")
  return hashString(combined)
}

/**
 * Get canvas fingerprint from graphics rendering
 */
function getCanvasFingerprint(): string {
  try {
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    if (!ctx) return "canvas-unknown"

    ctx.textBaseline = "top"
    ctx.font = '14px "Arial"'
    ctx.textBaseline = "alphabetic"
    ctx.fillStyle = "#f60"
    ctx.fillRect(125, 1, 62, 20)
    ctx.fillStyle = "#069"
    ctx.fillText("BioSecure Device Fingerprint 🔐", 2, 15)

    return canvas.toDataURL().substring(0, 100)
  } catch (e) {
    return "canvas-error"
  }
}

/**
 * Get WebGL fingerprint (GPU/Graphics info)
 */
function getWebGLFingerprint(): string {
  try {
    const canvas = document.createElement("canvas")
    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl")
    if (!gl) return "webgl-unknown"

    const debugInfo = gl.getExtension("WEBGL_debug_renderer_info")
    if (debugInfo) {
      const vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL)
      const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
      return `${vendor}|${renderer}`.substring(0, 100)
    }
    return "webgl-no-debug"
  } catch (e) {
    return "webgl-error"
  }
}

/**
 * Get hardware and system information
 */
function getHardwareInfo(): string {
  const nav = navigator as any
  const parts: string[] = []

  // Device memory (if available)
  if (nav.deviceMemory) {
    parts.push(`memory:${nav.deviceMemory}`)
  }

  // Processor count
  if (nav.hardwareConcurrency) {
    parts.push(`cpu:${nav.hardwareConcurrency}`)
  }

  // User agent (platform info)
  parts.push(`ua:${nav.userAgent.substring(0, 50)}`)

  // Screen dimensions and color depth
  parts.push(`screen:${screen.width}x${screen.height}x${screen.colorDepth}`)

  // Platform
  parts.push(`platform:${nav.platform}`)

  // Touch support
  parts.push(`touch:${nav.maxTouchPoints || 0}`)

  return parts.join("|")
}

/**
 * Get locale and timezone information
 */
function getLocaleInfo(): string {
  const parts: string[] = []

  // Language
  const nav = navigator as any
  parts.push(`lang:${nav.language || "unknown"}`)

  // Languages
  if (nav.languages) {
    parts.push(`langs:${nav.languages.join(",")}`)
  }

  // Timezone
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
  parts.push(`tz:${timezone}`)

  // Date formatting differences
  const formatter = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
  parts.push(`dateFmt:${formatter.format(new Date())}`)

  return parts.join("|")
}

/**
 * Get storage capabilities
 */
function getStorageInfo(): string {
  const parts: string[] = []

  // Local storage available
  try {
    localStorage.setItem("test", "test")
    localStorage.removeItem("test")
    parts.push("storage:local")
  } catch (e) {
    parts.push("storage:local-denied")
  }

  // Session storage available
  try {
    sessionStorage.setItem("test", "test")
    sessionStorage.removeItem("test")
    parts.push("storage:session")
  } catch (e) {
    parts.push("storage:session-denied")
  }

  // IndexedDB available
  if (window.indexedDB) {
    parts.push("storage:indexed")
  }

  return parts.join("|")
}

/**
 * Simple hash function for fingerprint components
 */
function hashString(str: string): string {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32bit integer
  }

  // Convert to hex string
  const absHash = Math.abs(hash)
  return `DEVFP_${absHash.toString(16).toUpperCase()}_${Date.now().toString(16)}`
}

/**
 * Verify if current device matches the stored fingerprint
 * Returns true if fingerprints match closely enough
 */
export async function verifyDeviceFingerprint(storedFingerprint: string): Promise<boolean> {
  if (!storedFingerprint) return false

  const currentFingerprint = await generateDeviceFingerprint()

  // Extract the base hash (without timestamp)
  const storedBase = storedFingerprint.split("_").slice(0, 2).join("_")
  const currentBase = currentFingerprint.split("_").slice(0, 2).join("_")

  // Device fingerprint should match exactly
  return storedBase === currentBase
}
