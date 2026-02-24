import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

// Provide Supabase env vars for tests so the client doesn't throw
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test.signature'

// Mock auth provider so components using useAuth don't throw
vi.mock('@/lib/providers/auth-provider', () => ({
  useAuth: () => ({
    user: { id: 'test-user-id', email: 'test@example.com' },
    session: null,
    isLoading: false,
    signOut: vi.fn(),
  }),
  AuthProvider: ({ children }: { children: React.ReactNode }) => children,
}))
