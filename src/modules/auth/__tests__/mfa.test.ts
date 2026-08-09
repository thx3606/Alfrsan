import { describe, it, expect } from "vitest";
import { generateTotpSecret, encryptSecret, decryptSecret, verifyTotp } from "../mfa";
import { authenticator } from "otplib";

describe("MFA secret encryption", () => {
  it("round-trips a secret through encryption", () => {
    const secret = generateTotpSecret();
    const encrypted = encryptSecret(secret);
    expect(encrypted).not.toContain(secret);
    expect(decryptSecret(encrypted)).toBe(secret);
  });

  it("produces different ciphertext for the same secret each time (random IV)", () => {
    const secret = generateTotpSecret();
    expect(encryptSecret(secret)).not.toBe(encryptSecret(secret));
  });
});

describe("TOTP verification", () => {
  it("accepts a currently-valid code", () => {
    const secret = generateTotpSecret();
    const code = authenticator.generate(secret);
    expect(verifyTotp(code, secret)).toBe(true);
  });

  it("rejects an incorrect code", () => {
    const secret = generateTotpSecret();
    expect(verifyTotp("000000", secret)).toBe(false);
  });
});
