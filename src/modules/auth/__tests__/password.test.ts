import { describe, it, expect } from "vitest";
import { hashPassword, verifyPassword, isPasswordPolicyCompliant } from "../password";

describe("password hashing", () => {
  it("hashes and verifies a correct password", async () => {
    const hash = await hashPassword("Correct-Horse-Battery-9");
    expect(hash).toMatch(/^\$argon2id\$/);
    expect(await verifyPassword(hash, "Correct-Horse-Battery-9")).toBe(true);
  });

  it("rejects an incorrect password", async () => {
    const hash = await hashPassword("Correct-Horse-Battery-9");
    expect(await verifyPassword(hash, "wrong-password-entirely")).toBe(false);
  });

  it("never stores the plaintext in the hash output", async () => {
    const plaintext = "Correct-Horse-Battery-9";
    const hash = await hashPassword(plaintext);
    expect(hash).not.toContain(plaintext);
  });

  it("does not throw on a malformed hash, just returns false", async () => {
    await expect(verifyPassword("not-a-real-hash", "anything")).resolves.toBe(false);
  });
});

describe("password policy", () => {
  it("rejects passwords shorter than 12 characters", () => {
    expect(isPasswordPolicyCompliant("Sh0rt!")).toBe(false);
  });

  it("rejects passwords with too little character variety", () => {
    expect(isPasswordPolicyCompliant("aaaaaaaaaaaaaaaaaa")).toBe(false);
  });

  it("accepts a strong password", () => {
    expect(isPasswordPolicyCompliant("Correct-Horse-Battery-9")).toBe(true);
  });
});
