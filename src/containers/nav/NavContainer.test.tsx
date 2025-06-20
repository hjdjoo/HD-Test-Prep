import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
} from "vitest";
import { waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { render, fireEvent } from "@testing-library/react";

import NavContainer from "@/src/containers/nav/NavContainer";
import { supabase } from "@/vitest.setup";

vi.mock("@/src/assets/icons/homeIcon.svg", () => ({
  default: () => <span data-testid="home-icon" />,
}));
vi.mock("@/src/assets/icons/signoutIcon.svg", () => ({
  default: () => <span data-testid="signout-icon" />,
}));

const renderUI = () =>
  render(
    <MemoryRouter>
      <NavContainer />
    </MemoryRouter>,
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
});
