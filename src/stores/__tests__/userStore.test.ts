import { describe, it, expect } from "vitest";
import { userStore } from "@/src/stores/userStore";
import { User } from "@/src/stores/userStore";

describe("userStore", () => {
  it("initialises with null user / not bootstrapped", () => {
    const { user, bootstrapped } = userStore.getState();
    expect(user).toBeNull();
    expect(bootstrapped).toBe(false);
  });

  it("setUser() writes user and flips bootstrapped", () => {
    const fakeUser = {
      id: 99,
      uid: "uid-99",
      role: "admin",
      name: "Tester",
      email: "test@example.com",
      instructor_id: 0,
    } as User;

    userStore.getState().setUser(fakeUser);

    const { user, bootstrapped } = userStore.getState();
    expect(user).toEqual(fakeUser);
    expect(bootstrapped).toBe(true);
  });
});
