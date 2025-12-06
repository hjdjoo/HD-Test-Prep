import { describe, it, expect, vi, beforeEach } from "vitest";
import startPracticeSession from "@/src/queries/POST/startPracticeSession";
import { apiFetch } from "@/utils/apiFetch";

// ---- mock the fetch wrapper -----------------------------------------------
vi.mock("@/utils/apiFetch", () => ({
  apiFetch: vi.fn(),
}));

// ---------------------------------------------------------------------------

describe("startPracticeSession()", () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("POSTs to the correct endpoint and returns the ID", async () => {
    // @ts-expect-error
    apiFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ id: 321 }),
    });

    const res = await startPracticeSession(7, "random");

    expect(apiFetch).toHaveBeenCalledWith(
      expect.stringMatching(/\/db\/practice_session\/new$/),
      expect.objectContaining({
        method: "POST",
      }),
    );
    expect(res).toEqual({ id: 321 });
  });

  it("throws when the server responds with !ok", async () => {
    // @ts-expect-error
    apiFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: "Internal Error",
    });

    await expect(
      startPracticeSession(7, "structured"),
    ).rejects.toThrow(/500/);
  });
});
