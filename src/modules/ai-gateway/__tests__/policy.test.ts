import { describe, it, expect } from "vitest";
import { evaluateAiRequest } from "../policy";
import { send, AiRequestBlockedError, AiProviderNotConfiguredError } from "../gateway";

const base = {
  purpose: "classify_question",
  dataClassification: "Public" as const,
  consentGiven: true,
};

describe("AI policy engine — deny by default", () => {
  it("blocks when consent was not given", () => {
    const decision = evaluateAiRequest({ ...base, consentGiven: false, text: "hello" });
    expect(decision.allowed).toBe(false);
  });

  it("blocks Confidential-classified data outright", () => {
    const decision = evaluateAiRequest({
      ...base,
      dataClassification: "Confidential",
      text: "hello",
    });
    expect(decision.allowed).toBe(false);
    if (!decision.allowed) expect(decision.reason).toBe("classification_not_eligible");
  });

  it("blocks Secret-classified data outright", () => {
    const decision = evaluateAiRequest({ ...base, dataClassification: "Secret", text: "hello" });
    expect(decision.allowed).toBe(false);
  });

  it("blocks a request containing a raw national ID", () => {
    const decision = evaluateAiRequest({ ...base, text: "هويتي 1234567890" });
    expect(decision.allowed).toBe(false);
  });

  it("blocks a request containing a JWT — never redacted and sent through", () => {
    const jwt =
      "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.dozjgNryP4J3jVmNHl0w5N_XgL0n3I9PlFUP0THsR8U";
    const decision = evaluateAiRequest({ ...base, text: `here is my token ${jwt}` });
    expect(decision.allowed).toBe(false);
    if (!decision.allowed) expect(decision.reason).toBe("sensitive_data_detected");
  });

  it("blocks a request containing an API key", () => {
    const decision = evaluateAiRequest({
      ...base,
      text: "use sk-abcdefghijklmnopqrstuvwxyz123456 to call it",
    });
    expect(decision.allowed).toBe(false);
  });

  it("approves clean, non-sensitive Public text", () => {
    const decision = evaluateAiRequest({
      ...base,
      text: "ما هي أفضل طريقة لتعلم React؟",
    });
    expect(decision.allowed).toBe(true);
  });

  it("approves Internal-classified clean text", () => {
    const decision = evaluateAiRequest({
      ...base,
      dataClassification: "Internal",
      text: "سؤال عام عن البرمجة",
    });
    expect(decision.allowed).toBe(true);
  });
});

describe("gateway.send — end to end", () => {
  it("throws AiRequestBlockedError for a request carrying PII", async () => {
    await expect(send({ ...base, text: "اتصل بي على 0512345678" })).rejects.toBeInstanceOf(
      AiRequestBlockedError,
    );
  });

  it("throws AiProviderNotConfiguredError for an otherwise-clean approved request", async () => {
    await expect(send({ ...base, text: "سؤال نظيف تماماً" })).rejects.toBeInstanceOf(
      AiProviderNotConfiguredError,
    );
  });
});
