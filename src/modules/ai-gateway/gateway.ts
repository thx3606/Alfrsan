import { evaluateAiRequest, type AiRequest } from "./policy";
import type { AiProvider } from "./provider";

export class AiRequestBlockedError extends Error {
  readonly reason: string;
  constructor(reason: string) {
    super(`AI request blocked: ${reason}`);
    this.reason = reason;
  }
}

export class AiProviderNotConfiguredError extends Error {
  constructor() {
    super(
      "No AI provider is configured. This is intentional — wiring an " +
        "external/self-hosted model is a product decision with data-" +
        "residency and cost implications (see AI_SECURITY.md). The " +
        "privacy pipeline itself is fully enforced and will run " +
        "regardless of which provider is chosen later.",
    );
  }
}

// The ONLY function in the codebase permitted to hand text to an AI
// provider. Every call runs the full deny-by-default pipeline first.
export async function send(request: AiRequest, provider?: AiProvider): Promise<never> {
  const decision = evaluateAiRequest(request);

  if (!decision.allowed) {
    throw new AiRequestBlockedError(decision.reason);
  }

  // No provider is wired up in this phase — kept out deliberately (see
  // AI_SECURITY.md). When one is, this becomes a real call using
  // `decision.sanitizedText`, never `request.text`.
  void provider;
  throw new AiProviderNotConfiguredError();
}
