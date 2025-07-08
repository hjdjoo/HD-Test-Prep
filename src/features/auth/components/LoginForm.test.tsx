import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, fireEvent, waitFor } from "@testing-library/react";

import userEvent from "@testing-library/user-event";
import LoginForm from "./LoginForm";
import { supabase } from "@/vitest.setup";

const typeInto = async (
  node: HTMLElement,
  value: string,
): Promise<void> => {
  await userEvent.clear(node);
  await userEvent.type(node, value);
};

describe("<LoginForm>", () => {

  beforeEach(() => {
    supabase.auth.signInWithPassword = vi
      .fn()
      .mockResolvedValue({ data: { session: {} }, error: null });

    supabase.auth.signInWithOAuth = vi
      .fn()
      .mockResolvedValue({ data: { provider: "google" }, error: null });

    supabase.auth.signUp = vi
      .fn()
      .mockResolvedValue({ data: { user: {} }, error: null });
  });

  it("submits valid email / password via Supabase", async () => {
    const { getByLabelText, getByRole } = render(<LoginForm />);

    await typeInto(getByLabelText(/email/i), "a@example.com");
    await typeInto(getByLabelText(/^password:/i), "secret123");

    fireEvent.click(getByRole("button", { name: /login/i }));

    await waitFor(() =>
      expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: "a@example.com",
        password: "secret123",
      }),
    );
  });

  it("shows verify-password field when toggled to Sign-Up", async () => {
    const { getByLabelText, queryByLabelText, getByRole } = render(<LoginForm />);

    fireEvent.click(getByRole("button", { name: /sign up with email/i }))

    expect(
      queryByLabelText(/verify password/i),
    ).toBeInTheDocument();

    await typeInto(getByLabelText(/email/i), "new@example.com");
    await typeInto(getByLabelText(/^password:/i), "pw123");
    await typeInto(getByLabelText(/verify password/i), "pw123");

    fireEvent.click(getByRole("button", { name: /create new account/i }))

    await waitFor(() => {
      expect(supabase.auth.signUp)
        .toHaveBeenCalledWith(
          expect.objectContaining({
            email: "new@example.com",
            password: "pw123",
          })
        )
    });

  });

  it("validates mismatching passwords and surfaces Alert", async () => {
    const { getByLabelText, getByRole, findByRole } = render(
      <LoginForm />,
    );

    // enter sign-up mode
    fireEvent.click(getByRole("button", { name: /sign up with email/i }));

    await typeInto(getByLabelText(/email/i), "a@example.com");
    await typeInto(getByLabelText(/^password:/i), "one");
    await typeInto(getByLabelText(/verify password/i), "two");

    fireEvent.click(getByRole("button", { name: /create new account/i }));

    expect(await findByRole("alert")).toBeInTheDocument();
    // Supabase signUp not called due to validation failure
    expect(supabase.auth.signUp).not.toHaveBeenCalled();

  });
  it("validates malformed emails and surfaces Alert", async () => {
    const { getByLabelText, getByRole, findByRole } = render(
      <LoginForm />,
    );

    // enter sign-up mode
    fireEvent.click(getByRole("button", { name: /sign up with email/i }));

    await typeInto(getByLabelText(/email/i), "a@example");
    await typeInto(getByLabelText(/^password:/i), "one");
    await typeInto(getByLabelText(/verify password/i), "one");

    fireEvent.click(getByRole("button", { name: /create new account/i }));

    expect(await findByRole("alert")).toBeInTheDocument();
    // Supabase signUp not called due to validation failure
    expect(supabase.auth.signUp).not.toHaveBeenCalled();

  });

  it("responds to email sign up errors", async () => {

    const { getByLabelText, getByRole, findByRole } = render(
      <LoginForm />,
    );

    (supabase as any).auth.signUp
      .mockResolvedValueOnce({
        data: null,
        error: {
          message: "whoomp",
          details: "there it is"
        }
      });

    // enter sign-up mode
    fireEvent.click(getByRole("button", { name: /sign up with email/i }));

    await typeInto(getByLabelText(/email/i), "a@example.com");
    await typeInto(getByLabelText(/^password:/i), "one");
    await typeInto(getByLabelText(/verify password/i), "one");

    fireEvent.click(getByRole("button", { name: /create new account/i }));

    await waitFor(async () =>
      expect(await findByRole("alert")).toBeInTheDocument()
    );
  });

  it("invokes Google OAuth on click", async () => {
    const { getByRole } = render(<LoginForm />);

    fireEvent.click(getByRole("button", { name: /sign in with google/i }));

    await waitFor(() =>
      expect(supabase.auth.signInWithOAuth).toHaveBeenCalledWith({
        provider: "google",
        options: expect.any(Object),
      }),
    );
  });

  it("responds to supabase errors", async () => {

    const { findByRole, getByRole } = render(<LoginForm />);

    (supabase as any).auth.signInWithOAuth
      .mockResolvedValueOnce({
        data: null,
        error: {
          message: "whoomp",
          details: "there it is"
        }
      });

    fireEvent.click(getByRole("button", { name: /sign in with google/i }));

    await waitFor(async () =>
      expect(await findByRole("alert")).toBeInTheDocument()
    );

  })
});
