import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { apiFetch } from "@/utils/apiFetch";

vi.mock("@/utils/supabase/client", () => {
  return {
    supabase: {
      auth: {
        getSession: vi.fn().mockResolvedValue({
          data: { session: { access_token: "abc123" } },
          error: null,
        }),
      },
    },
  };
});

describe("apiFetch()", () => {
  const fetchSpy = vi.fn();

  beforeEach(() => {
    global.fetch = fetchSpy;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("attaches the bearer token and passes options through", async () => {
    fetchSpy.mockResolvedValueOnce(
      new Response(null, { status: 200, statusText: "OK" }),
    );

    await apiFetch("https://example.com/endpoint", { method: "POST" });

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(fetchSpy).toHaveBeenCalledWith(
      "https://example.com/endpoint",
      expect.objectContaining({
        method: "POST",
        credentials: "include",
        headers: expect.objectContaining({
          Authorization: "Bearer abc123",
        }),
      }),
    );
  });

  it("bubbles up a Supabase error immediately", async () => {
    const { supabase } = await import("@/utils/supabase/client");
    // force an error path
    // @ts-expect-error  we just replaced the mock
    supabase.auth.getSession.mockResolvedValueOnce({
      data: null,
      error: new Error("boom"),
    });

    await expect(apiFetch("https://x", {})).rejects.toThrow("boom");
  });

  it("retries exactly once on 401", async () => {
    fetchSpy
      .mockResolvedValueOnce(new Response(null, { status: 401 }))
      .mockResolvedValueOnce(new Response(null, { status: 200 }));

    await apiFetch("https://retry.me", {});

    expect(fetchSpy).toHaveBeenCalledTimes(2);
  });
});
