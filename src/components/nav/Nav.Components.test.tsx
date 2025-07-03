import {
  describe, it, expect, vi, beforeEach, afterEach
} from "vitest";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import { render, fireEvent, waitFor } from "@testing-library/react";

import NavHome from "components/nav/Nav.home";
import NavAccount from "components/nav/Nav.account";
import NavSignout from "components/nav/Nav.signout";
import { supabase } from "@/utils/supabase/client";


vi.mock("@/src/assets/icons/homeIcon.svg", () => ({ default: () => <span data-testid="home-icon" /> }));
vi.mock("@/src/assets/icons/accountIcon.svg", () => ({ default: () => <span data-testid="account-icon" /> }));
vi.mock("@/src/assets/icons/signoutIcon.svg", () => ({ default: () => <span data-testid="signout-icon" /> }));
vi.mock("@/src/ErrorPage.tsx", () => ({ default: () => <span data-testid="error-page" /> }));


const renderWithRouter = (ui: React.ReactElement) =>
  render(<MemoryRouter>{ui}</MemoryRouter>);

describe("Nav leaf components", () => {
  beforeEach(() => vi.clearAllMocks());
  afterEach(() => vi.restoreAllMocks());
  it("<NavHome> shows icon & links to '/'", () => {
    const { getByTestId, getByRole } = renderWithRouter(<NavHome />);

    expect(getByTestId("home-icon")).toBeInTheDocument();

    const link = getByRole("link");     // only one link in this component
    expect(link).toHaveAttribute("href", "/");
  });

  it("<NavAccount> shows icon & links to '/account'", () => {
    const { getByTestId, getByRole } = renderWithRouter(<NavAccount />);

    expect(getByTestId("account-icon")).toBeInTheDocument();

    const link = getByRole("link");
    expect(link).toHaveAttribute("href", "/account");
  });

  it("<NavSignout> calls supabase.auth.signOut on click", async () => {
    // patch the auth method for *this* test only
    supabase.auth.signOut = vi.fn().mockResolvedValue({ error: null });

    const { getByTestId } = renderWithRouter(<NavSignout />);
    const btn = getByTestId("signout-icon").closest("button")!;

    fireEvent.click(btn);

    waitFor(() =>
      expect(supabase.auth.signOut).toHaveBeenCalledTimes(1),
    );
  });

});
