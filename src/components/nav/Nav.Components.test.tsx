import {
  describe, it, expect, vi, beforeEach, afterEach
} from "vitest";
import React from "react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { render, fireEvent, waitFor } from "@testing-library/react";
import ErrorPage from "@/src/ErrorPage";
import NavHome from "components/nav/Nav.home";
import NavAccount from "components/nav/Nav.account";
import NavSignout from "components/nav/Nav.signout";
import { supabase } from "@/utils/supabase/client";
import userEvent from "@testing-library/user-event";


vi.mock("@/src/assets/icons/homeIcon.svg", () => ({ default: () => <span data-testid="home-icon" /> }));
vi.mock("@/src/assets/icons/accountIcon.svg", () => ({ default: () => <span data-testid="account-icon" /> }));
vi.mock("@/src/assets/icons/signoutIcon.svg", () => ({ default: () => <span data-testid="signout-icon" /> }));
vi.mock("@/src/ErrorPage.tsx", () => ({ default: () => <span data-testid="error-page" /> }));

const renderWithRouter = (ui: React.ReactElement) =>
  render(
    <MemoryRouter>
      <Routes>
        <Route path="/" element={ui} />
        <Route path="/error" element={<ErrorPage />} />
      </Routes>
    </MemoryRouter>);

describe("Nav leaf components", () => {
  beforeEach(() => vi.clearAllMocks());
  afterEach(() => vi.restoreAllMocks());
  it("<NavHome> shows icon & links to '/'", () => {
    const { getByTestId, getByRole } = renderWithRouter(<NavHome />);

    expect(getByTestId("home-icon")).toBeInTheDocument();

    const link = getByRole("link");
    expect(link).toHaveAttribute("href", "/");
  });

  it("<NavAccount> shows icon & links to '/account'", () => {
    const { getByTestId, getByRole } = renderWithRouter(<NavAccount />);

    expect(getByTestId("account-icon")).toBeInTheDocument();

    const link = getByRole("link");
    expect(link).toHaveAttribute("href", "/account");
  });

  it("<NavSignout> calls supabase.auth.signOut on click", async () => {

    supabase.auth.signOut = vi.fn().mockResolvedValue({ error: null });

    const { getByTestId } = renderWithRouter(<NavSignout />);
    const btn = getByTestId("signout-icon").closest("button")!;

    fireEvent.click(btn);

    await waitFor(() =>
      expect(supabase.auth.signOut).toHaveBeenCalledTimes(1),
    );
  });

  it("shows error screen if signing out throws", async () => {

    supabase.auth.signOut = vi.fn().mockResolvedValue({
      error: {
        message: "whoomp",
        details: "there it is"
      }
    })


    const { getByTestId, queryByTestId } = renderWithRouter(<NavSignout />);
    const btn = getByTestId("signout-icon").closest("button")!;

    await userEvent.click(btn);

    await waitFor(() => {
      expect(queryByTestId("error-page")).toBeInTheDocument();
    })
  })

});
