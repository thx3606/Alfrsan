// Provider abstraction (brief §98). No concrete implementation exists in
// this phase — see AI_SECURITY.md "What's deliberately not decided yet."
// This interface exists so that when a provider is chosen (self-hosted or
// a hosted API), call sites in the rest of the app never change.

export interface AiProvider {
  classify(sanitizedText: string, categories: string[]): Promise<{ category: string; confidence: number }>;
  summarize(sanitizedText: string): Promise<string>;
  embed(sanitizedText: string): Promise<number[]>;
}
