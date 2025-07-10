import { describe, it, expect, vi, beforeEach } from "vitest";
import { apiFetch } from "@/utils/apiFetch";
// import { supabase } from "@/utils/supabase/client";
import { supabase } from "@/vitest.setup";

describe("apiFetch()", () => {

  const fetchSpy = vi.fn();

  beforeEach(() => {
    global.fetch = fetchSpy;
    fetchSpy.mockReset();
    vi.clearAllMocks();
  });

  it("attaches the bearer token and passes options through", async () => {

    //@ts-expect-error
    supabase.auth.getSession.mockResolvedValueOnce({
      data: { session: { access_token: 'test_token' } },
      error: null,
    })
    fetchSpy.mockResolvedValueOnce(
      new Response(null, { status: 200, statusText: "OK" }),
    );

    const res = await apiFetch("https://example.com/endpoint", { method: "POST" });

    console.log(res);

    const [, init] = fetchSpy.mock.calls[0];
    expect(init.headers.get("Authorization")).toBe("Bearer test_token");
    expect(fetchSpy).toHaveBeenCalledTimes(1);

  });

  it("bubbles up a Supabase error immediately", async () => {
    // @ts-expect-error 
    supabase.auth.getSession.mockResolvedValueOnce({
      data: { session: null },
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
