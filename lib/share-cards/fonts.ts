import { GEIST_SANS_B64 } from "./font-geist-sans"
import { GEIST_MONO_B64 } from "./font-geist-mono"

function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binary = atob(base64)
  const len = binary.length
  const bytes = new Uint8Array(len)
  for (let i = 0; i < len; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  return bytes.buffer as ArrayBuffer
}

let cachedSans: ArrayBuffer | null = null
let cachedMono: ArrayBuffer | null = null

export async function getGeistSans(): Promise<ArrayBuffer> {
  if (!cachedSans) cachedSans = base64ToArrayBuffer(GEIST_SANS_B64)
  return cachedSans
}

export async function getGeistMono(): Promise<ArrayBuffer> {
  if (!cachedMono) cachedMono = base64ToArrayBuffer(GEIST_MONO_B64)
  return cachedMono
}
