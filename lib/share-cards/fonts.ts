let geistSansData: ArrayBuffer | null = null
let geistMonoData: ArrayBuffer | null = null

export async function getGeistSans(): Promise<ArrayBuffer> {
  if (geistSansData) return geistSansData
  const res = await fetch(
    "https://cdn.jsdelivr.net/npm/geist@1.0.0/dist/fonts/geist-sans/Geist-SemiBold.woff2"
  )
  geistSansData = await res.arrayBuffer()
  return geistSansData
}

export async function getGeistMono(): Promise<ArrayBuffer> {
  if (geistMonoData) return geistMonoData
  const res = await fetch(
    "https://cdn.jsdelivr.net/npm/geist@1.0.0/dist/fonts/geist-mono/GeistMono-Regular.woff2"
  )
  geistMonoData = await res.arrayBuffer()
  return geistMonoData
}
