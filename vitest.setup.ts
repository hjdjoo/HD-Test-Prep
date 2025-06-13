import { vi } from 'vitest';

/**
 * A mocked Supabase client.
 * You can override any method per-test with
 *   supabase.auth.getSession.mockResolvedValueOnce(...)
 */
const mockSupabase = {

  auth: {
    /**
     * Default: returns { data: { session }, error: null }
     * The test can .mockResolvedValueOnce(...) for other paths.
     */
    getSession: vi.fn().mockResolvedValue({
      data: { session: { access_token: 'test_token' } },
      error: null,
    }),
    onAuthStateChange: vi.fn().mockReturnValue({
      data: { subscription: { unsubscribe: vi.fn() } },
    }),
    refreshSession: vi.fn(),
    signOut: vi.fn(),
  },

  from: vi.fn().mockReturnThis(),
  select: vi.fn().mockReturnThis(),
  eq: vi.fn().mockReturnThis(),
  single: vi.fn().mockResolvedValue({ data: {}, error: null }),
} as unknown as ReturnType<typeof import('@supabase/supabase-js').createClient>;

vi.mock('@supabase/supabase-js', () => {
  return {
    ...(vi.importActual('@supabase/supabase-js') as object),
    createClient: vi.fn(() => mockSupabase),
  };
});

vi.mock('@/utils/supabase/client', () => {
  return {
    supabase: mockSupabase,
  };
});

export { mockSupabase as supabase };
