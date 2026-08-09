import { authenticator } from "otplib";
import { randomBytes, createCipheriv, createDecipheriv } from "crypto";

// TOTP (RFC 6238) multi-factor authentication. Secrets are encrypted at
// rest with AES-256-GCM using a key from the secret manager
// (MFA_ENCRYPTION_KEY) — never stored in plaintext. See DATA_CLASSIFICATION.md.

authenticator.options = { window: 1 }; // allow ±1 time-step clock drift

function getEncryptionKey(): Buffer {
  const raw = process.env.MFA_ENCRYPTION_KEY;
  if (!raw) {
    throw new Error("MFA_ENCRYPTION_KEY is not configured");
  }
  const key = Buffer.from(raw, "base64");
  if (key.length !== 32) {
    throw new Error("MFA_ENCRYPTION_KEY must decode to exactly 32 bytes");
  }
  return key;
}

export function generateTotpSecret(): string {
  return authenticator.generateSecret();
}

export function encryptSecret(secret: string): string {
  const key = getEncryptionKey();
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const encrypted = Buffer.concat([cipher.update(secret, "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return [iv, authTag, encrypted].map((b) => b.toString("base64")).join(".");
}

export function decryptSecret(payload: string): string {
  const [ivB64, tagB64, dataB64] = payload.split(".");
  if (!ivB64 || !tagB64 || !dataB64) {
    throw new Error("Malformed encrypted MFA secret");
  }
  const key = getEncryptionKey();
  const iv = Buffer.from(ivB64, "base64");
  const authTag = Buffer.from(tagB64, "base64");
  const data = Buffer.from(dataB64, "base64");
  const decipher = createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(authTag);
  return Buffer.concat([decipher.update(data), decipher.final()]).toString("utf8");
}

export function buildOtpAuthUrl(secret: string, accountEmail: string): string {
  return authenticator.keyuri(accountEmail, "KHIBRA", secret);
}

export function verifyTotp(token: string, secret: string): boolean {
  try {
    return authenticator.verify({ token, secret });
  } catch {
    return false;
  }
}
