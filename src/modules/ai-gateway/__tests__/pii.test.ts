import { describe, it, expect } from "vitest";
import { detectPii } from "../pii";

describe("PII detection", () => {
  it("detects a Saudi national ID", () => {
    const findings = detectPii("رقم هويتي هو 1234567890 شكرا");
    expect(findings.some((f) => f.type === "NATIONAL_ID")).toBe(true);
  });

  it("detects a Saudi phone number in multiple formats", () => {
    expect(detectPii("call me at 0512345678").some((f) => f.type === "PHONE")).toBe(true);
    expect(detectPii("call me at +966512345678").some((f) => f.type === "PHONE")).toBe(true);
  });

  it("detects an email address", () => {
    expect(detectPii("reach me at user@example.com").some((f) => f.type === "EMAIL")).toBe(true);
  });

  it("detects a Saudi IBAN", () => {
    expect(
      detectPii("IBAN: SA0380000000608010167519").some((f) => f.type === "IBAN"),
    ).toBe(true);
  });

  it("detects a JWT-shaped string", () => {
    const jwt =
      "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.dozjgNryP4J3jVmNHl0w5N_XgL0n3I9PlFUP0THsR8U";
    expect(detectPii(`token: ${jwt}`).some((f) => f.type === "JWT")).toBe(true);
  });

  it("detects an OpenAI-shaped API key", () => {
    expect(
      detectPii("sk-abcdefghijklmnopqrstuvwxyz123456").some((f) => f.type === "API_KEY"),
    ).toBe(true);
  });

  it("detects a GitHub-shaped API key", () => {
    expect(
      detectPii("ghp_" + "a".repeat(36)).some((f) => f.type === "API_KEY"),
    ).toBe(true);
  });

  it("detects a generic secret assignment", () => {
    expect(detectPii("password: hunter2trustno1").some((f) => f.type === "GENERIC_SECRET")).toBe(
      true,
    );
  });

  it("returns no findings for clean, non-sensitive text", () => {
    expect(detectPii("أفضل طريقة لتعلم React هي بناء مشاريع صغيرة")).toHaveLength(0);
  });

  it("does not false-positive a valid credit card check on random 16-digit non-Luhn numbers", () => {
    // 1111111111111111 fails Luhn, so should not be flagged as a card
    const findings = detectPii("random number 1111111111111111 here");
    expect(findings.some((f) => f.type === "CREDIT_CARD")).toBe(false);
  });
});
