import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

function createMockQueryBuilder() {
  const chain: {
    select: (...args: unknown[]) => typeof chain
    insert: (...args: unknown[]) => typeof chain
    update: (...args: unknown[]) => typeof chain
    upsert: (...args: unknown[]) => typeof chain
    delete: (...args: unknown[]) => typeof chain
    eq: (...args: unknown[]) => typeof chain
    is: (...args: unknown[]) => typeof chain
    like: (...args: unknown[]) => typeof chain
    in: (...args: unknown[]) => typeof chain
    gte: (...args: unknown[]) => typeof chain
    lte: (...args: unknown[]) => typeof chain
    not: (...args: unknown[]) => typeof chain
    order: (...args: unknown[]) => typeof chain
    limit: (...args: unknown[]) => typeof chain
    single: () => Promise<{ data: null; error: null }>
    maybeSingle: () => Promise<{ data: null; error: null }>
    then: (resolve: (value: { data: unknown[]; error: null }) => unknown) => Promise<unknown>
  } = {
    select: () => chain,
    insert: () => chain,
    update: () => chain,
    upsert: () => chain,
    delete: () => chain,
    eq: () => chain,
    is: () => chain,
    like: () => chain,
    in: () => chain,
    gte: () => chain,
    lte: () => chain,
    not: () => chain,
    order: () => chain,
    limit: () => chain,
    single: async () => ({ data: null, error: null }),
    maybeSingle: async () => ({ data: null, error: null }),
    then: (resolve) => Promise.resolve({ data: [], error: null }).then(resolve),
  }

  return chain
}

/**
 * Create a Supabase client for server-side operations
 * Important: Always create a new client within each function when using it
 */
export async function createClient() {
  const cookieStore = await cookies()

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    // Build-safe fallback so static prerender doesn't crash when env is unavailable.
    return {
      auth: {
        getUser: async () => ({ data: { user: null }, error: null }),
      },
      from: () => createMockQueryBuilder(),
      rpc: async () => ({ data: null, error: null }),
    } as unknown as ReturnType<typeof createServerClient>
  }

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        } catch {
          // The "setAll" method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
  })
}
