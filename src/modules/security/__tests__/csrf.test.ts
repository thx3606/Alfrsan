import { describe, it, expect } from "vitest";
import { isCsrfValid, timingSafeStringEqual, generateCsrfToken, isSafeMethod } from "../csrf";

describe("CSRF double-submit validation", () => {
  it("accepts matching cookie and header tokens", () => {
    const token = generateCsrfToken();
    expect(isCsrfValid(token, token)).toBe(true);
  });

  it("rejects mismatched tokens", () => {
    expect(isCsrfValid(generateCsrfToken(), generateCsrfToken())).toBe(false);
  });

  it("rejects a missing cookie", () => {
    expect(isCsrfValid(undefined, generateCsrfToken())).toBe(false);
  });

  it("rejects a missing header", () => {
    expect(isCsrfValid(generateCsrfToken(), null)).toBe(false);
  });

  it("fails closed on empty strings", () => {
    expect(isCsrfValid("", "")).toBe(false);
  });
});

describe("timingSafeStringEqual", () => {
  it("returns false for different lengths without throwing", () => {
    expect(timingSafeStringEqual("abc", "abcd")).toBe(false);
  });
});

describe("isSafeMethod", () => {
  it("treats GET/HEAD/OPTIONS as safe", () => {
    expect(isSafeMethod("GET")).toBe(true);
    expect(isSafeMethod("head")).toBe(true);
  });

  it("treats POST/PUT/PATCH/DELETE as unsafe", () => {
    expect(isSafeMethod("POST")).toBe(false);
    expect(isSafeMethod("DELETE")).toBe(false);
  });
});
