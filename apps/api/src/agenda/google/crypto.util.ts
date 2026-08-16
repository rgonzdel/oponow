import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;

// El refresh token de Google, a diferencia de una contraseña, hace falta
// poder leerlo en claro para llamar a la API de Calendar — un hash (como
// usamos para refresh_tokens propios) no sirve aquí. Cifrado simétrico con
// una clave que solo tiene el backend (TOKEN_ENCRYPTION_KEY), nunca en el
// repo. Formato guardado: base64(iv) + ":" + base64(authTag) + ":" + base64(ciphertext).
export function encryptToken(plaintext: string, keyB64: string): string {
  const key = Buffer.from(keyB64, "base64");
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, key, iv);
  const ciphertext = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return `${iv.toString("base64")}:${authTag.toString("base64")}:${ciphertext.toString("base64")}`;
}

export function decryptToken(payload: string, keyB64: string): string {
  const key = Buffer.from(keyB64, "base64");
  const [ivB64, authTagB64, ciphertextB64] = payload.split(":");
  if (!ivB64 || !authTagB64 || !ciphertextB64) {
    throw new Error("Formato de token cifrado inválido");
  }
  const decipher = createDecipheriv(ALGORITHM, key, Buffer.from(ivB64, "base64"));
  decipher.setAuthTag(Buffer.from(authTagB64, "base64"));
  const plaintext = Buffer.concat([
    decipher.update(Buffer.from(ciphertextB64, "base64")),
    decipher.final(),
  ]);
  return plaintext.toString("utf8");
}
