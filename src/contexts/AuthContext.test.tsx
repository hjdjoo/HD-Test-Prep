import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, RenderResult, waitFor, cleanup } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { act } from "@testing-library/react";
import AuthProvider, { AuthContext } from "@/src/contexts/AuthContext";
import { userStore } from "@/src/stores/userStore";
import { supabase } from "@/vitest.setup";
import { apiFetch } from "@/utils/apiFetch";

vi.mock("@/utils/apiFetch", () => ({
  apiFetch: vi.fn(),
}));

function TestApp() {
  return (
    <MemoryRouter>
      <AuthProvider>
        <AuthContext.Consumer>
          {(ctx) => (
            <div data-testid={`user-name`}>
              {ctx.user ? ctx.user.name : "no-user"}
            </div>
          )}
        </AuthContext.Consumer>
      </AuthProvider>
    </MemoryRouter >
  );
}

describe("<AuthProvider>", () => {

  let authListenerCallbacks: any[] = []
  let App: RenderResult
  //@ts-expect-error
  supabase.auth.onAuthStateChange.mockImplementation((cb: any) => {
    authListenerCallbacks.push(cb);
    return {
      data: { subscription: { unsubscribe: vi.fn() } },
    };
  },)

  beforeEach(async () => {
    userStore.setState({ user: null, bootstrapped: false });
    App = render(<TestApp />);
  });

  afterEach(() => {
    cleanup();
    authListenerCallbacks = [];
    vi.clearAllMocks();
  })

  it("sets user state on SIGNED_IN", async () => {
    // @ts-expect-error
    apiFetch.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          id: 1,
          uid: "uid-1",
          role: "student",
          name: "Alice",
          email: "a@example.com",
          instructor_id: 2,
        }),
    })

    const { getByTestId } = App;

    const cb = authListenerCallbacks[0];
    cb("SIGNED_IN", { access_token: "abc" });

    await waitFor(() =>
      expect(getByTestId("user-name").textContent).toBe("Alice"),
    );

    const { user, bootstrapped } = userStore.getState();
    expect(user?.name).toBe("Alice");
    expect(bootstrapped).toBe(true);
  });

  it("sets user to null if response is not okay", async () => {
    //@ts-expect-error
    apiFetch.mockResolvedValueOnce({
      ok: false,
    })

    const { user } = userStore.getState();
    await waitFor(() => {
      expect(user).toBe(null);
    })

  })

  it("signs out & redirects on SIGNED_OUT", async () => {

    await act(async () => authListenerCallbacks[0]("SIGNED_OUT", null));

    await waitFor(() =>
      expect(userStore.getState().user).toBeNull(),
    );
    expect(supabase.auth.signOut).toHaveBeenCalledTimes(0);
  });
});
