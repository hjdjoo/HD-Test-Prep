import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
} from "vitest";
import { act, renderHook, waitFor } from "@testing-library/react";
import { MemoryRouter, useLocation, } from "react-router-dom";
import { render, fireEvent } from "@testing-library/react";

import NavContainer from "@/src/containers/nav/NavContainer";
import { supabase } from "@/vitest.setup";
// import userEvent from "@testing-library/user-event";

vi.mock("@/src/assets/icons/homeIcon.svg", () => ({
  default: () => <span data-testid="home-icon" />,
}));
vi.mock("@/src/assets/icons/signoutIcon.svg", () => ({
  default: () => <span data-testid="signout-icon" />,
}));

// const router = createMemoryRouter();

const Wrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <MemoryRouter>
      {children}
    </MemoryRouter>
  )
}

const renderUI = () =>
  render(
    <Wrapper>
      <NavContainer />
    </Wrapper>
  );


describe("<NavContainer>", () => {
  beforeEach(() => vi.clearAllMocks());

  it("renders home and sign-out button groups", () => {
    const { getByTestId /* , container */ } = renderUI();

    expect(getByTestId("home-icon")).toBeInTheDocument();
    expect(getByTestId("signout-icon")).toBeInTheDocument();
  });


  it("home button links to '/'", () => {
    const { getByRole } = renderUI();

    const link = getByRole("link");
    expect(link).toHaveAttribute("href", "/");
  });


  it("invokes supabase signOut", async () => {
    supabase.auth.signOut = vi.fn().mockResolvedValue({ error: null });
    supabase.auth.getSession = vi.fn().mockResolvedValue({ error: null });

    const { getByTestId } = renderUI();
    const btn = getByTestId("signout-icon").closest("button")!;

    fireEvent.click(btn);

    await waitFor(() => {
      expect(supabase.auth.signOut).toHaveBeenCalledTimes(1);
    })
  });

  it("shows error screen if signing out throws", async () => {

    supabase.auth.signOut = vi.fn().mockResolvedValue({
      error: {
        message: "whoomp",
        details: "there it is"
      }
    })

    const { result: { current } } = renderHook(useLocation, {
      wrapper: Wrapper
    })

    const { pathname } = current

    const { getByTestId } = renderUI();
    const btn = getByTestId("signout-icon").closest("button")!;

    act(() => {
      fireEvent.click(btn);
    })

    await waitFor(() => {
      expect(pathname).toBe("/error")
    })
  })
});
