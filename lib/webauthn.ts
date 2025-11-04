import { bufferToBase64url } from "./base64"

export interface RegistrationOptions {
  challenge: string
  rp: {
    name: string
    id: string
  }
  user: {
    id: string
    name: string
    displayName: string
  }
  pubKeyCredParams: Array<{
    type: "public-key"
    alg: number
  }>
  timeout: number
  attestation: "none" | "direct" | "indirect"
  authenticatorSelection: {
    authenticatorAttachment: "platform" | "cross-platform"
    residentKey: "preferred" | "required" | "discouraged"
    userVerification: "preferred" | "required" | "discouraged"
  }
}

export interface AuthenticationOptions {
  challenge: string
  timeout: number
  rpId: string
  userVerification: "preferred" | "required" | "discouraged"
  allowCredentials: Array<{
    type: "public-key"
    id: string
    transports?: Array<"usb" | "nfc" | "ble" | "internal">
  }>
}

export function generateChallenge(): string {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return bufferToBase64url(array)
}

export function getRegistrationOptions(
  userId: string,
  userName: string,
  displayName: string,
  rpId: string,
): RegistrationOptions {
  return {
    challenge: generateChallenge(),
    rp: {
      name: "Fingerprint Auth System",
      id: rpId,
    },
    user: {
      id: bufferToBase64url(new TextEncoder().encode(userId)),
      name: userName,
      displayName: displayName,
    },
    pubKeyCredParams: [
      { type: "public-key", alg: -7 }, // ES256
      { type: "public-key", alg: -257 }, // RS256
    ],
    timeout: 60000,
    attestation: "none",
    authenticatorSelection: {
      authenticatorAttachment: "platform",
      residentKey: "preferred",
      userVerification: "required",
    },
  }
}

export function getAuthenticationOptions(rpId: string, allowedCredentialIds: string[]): AuthenticationOptions {
  return {
    challenge: generateChallenge(),
    timeout: 60000,
    rpId: rpId,
    userVerification: "required",
    allowCredentials: allowedCredentialIds.map((id) => ({
      type: "public-key",
      id: id,
      transports: ["internal"],
    })),
  }
}
