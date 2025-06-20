import { describe, it, expect, vi } from "vitest";
vi.unmock('@/utils/supabase/client');

import { createClient } from "@supabase/supabase-js";
import { supabase } from "@/utils/supabase/client";

describe("cached supabase client", () => {
  it("reuses the same supabase instance everywhere", () => {
    // unmock supabase client from vitest.setup.ts, allow it to run once;
    expect((createClient as any).mock.calls).toHaveLength(1);

    const createdInstance = (createClient as any).mock.results[0].value;
    expect(supabase).toBe(createdInstance);

    expect((globalThis as any).__SUPABASE__).toBe(createdInstance);

  });
});
