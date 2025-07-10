import { describe, it, expect } from "vitest";
import { userStore } from "@/src/stores/userStore";
import { sampleUser } from "@/src/_const/testConst";

describe("userStore", () => {
  it("initialises with null user / not bootstrapped", () => {
    const { user, bootstrapped } = userStore.getState();
    expect(user).toBeNull();
    expect(bootstrapped).toBe(false);
  });

  it("setUser() writes user and flips bootstrapped", () => {

    userStore.getState().setUser(sampleUser);

    const { user, bootstrapped } = userStore.getState();
    expect(user).toEqual(sampleUser);
    expect(bootstrapped).toBe(true);
  });
});
