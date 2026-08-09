import { randomInt } from "crypto";
import { prisma } from "@/lib/prisma";
import { hashPassword, verifyPassword } from "./password";

const CODE_COUNT = 10;
const CODE_LENGTH = 10;
const ALPHABET = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ"; // no 0/O/1/I ambiguity

function generateOneCode(): string {
  let code = "";
  for (let i = 0; i < CODE_LENGTH; i++) {
    code += ALPHABET[randomInt(ALPHABET.length)];
  }
  return `${code.slice(0, 5)}-${code.slice(5)}`;
}

// Generates a fresh batch, persists their hashes, and returns the
// plaintext codes exactly once — the caller must show them to the user
// immediately; they are never retrievable again.
export async function generateRecoveryCodes(userId: string): Promise<string[]> {
  await prisma.recoveryCode.deleteMany({ where: { userId, usedAt: null } });

  const codes = Array.from({ length: CODE_COUNT }, generateOneCode);
  const hashes = await Promise.all(codes.map(hashPassword));

  await prisma.recoveryCode.createMany({
    data: hashes.map((codeHash) => ({ userId, codeHash })),
  });

  return codes;
}

export async function consumeRecoveryCode(
  userId: string,
  suppliedCode: string,
): Promise<boolean> {
  const unused = await prisma.recoveryCode.findMany({
    where: { userId, usedAt: null },
  });

  for (const record of unused) {
    if (await verifyPassword(record.codeHash, suppliedCode)) {
      await prisma.recoveryCode.update({
        where: { id: record.id },
        data: { usedAt: new Date() },
      });
      return true;
    }
  }

  return false;
}
