import { describe, it, expect } from "vitest";
import { redactText } from "../redact";

describe("redactText", () => {
  it("replaces a phone number with a typed placeholder", () => {
    const { redacted } = redactText("اتصل بي على 0512345678 من فضلك");
    expect(redacted).toContain("[REDACTED:PHONE]");
    expect(redacted).not.toContain("0512345678");
  });

  it("replaces multiple distinct findings", () => {
    const { redacted, findings } = redactText(
      "بريدي user@example.com وجوالي 0512345678",
    );
    expect(findings.length).toBeGreaterThanOrEqual(2);
    expect(redacted).not.toContain("user@example.com");
    expect(redacted).not.toContain("0512345678");
  });

  it("leaves clean text untouched", () => {
    const { redacted, findings } = redactText("كيف أتعلم Python؟");
    expect(redacted).toBe("كيف أتعلم Python؟");
    expect(findings).toHaveLength(0);
  });
});
