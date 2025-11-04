export async function isWebAuthnAvailable(): Promise<boolean> {
  if (typeof window === "undefined") {
    return false
  }

  if (!window.PublicKeyCredential) {
    return false
  }

  try {
    const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()
    return available
  } catch (err) {
    console.error("[v0] WebAuthn availability check failed:", err)
    return false
  }
}

export function isInPreviewEnvironment(): boolean {
  if (typeof window === "undefined") {
    return false
  }

  const isIframe = window.self !== window.top
  const isPreviewDomain = window.location.hostname.includes("preview") || window.location.hostname.includes("v0.app")

  return isIframe || isPreviewDomain
}

export function getWebAuthnStatus(): {
  available: boolean
  inPreview: boolean
  message: string
} {
  const available = typeof window !== "undefined" && !!window.PublicKeyCredential
  const inPreview = typeof window !== "undefined" && isInPreviewEnvironment()

  let message = ""
  if (!available) {
    message = "WebAuthn is not supported in your browser"
  } else if (inPreview) {
    message = "WebAuthn is limited in preview mode. Deploy to production for full Touch ID support."
  } else {
    message = "WebAuthn is available"
  }

  return { available, inPreview, message }
}
