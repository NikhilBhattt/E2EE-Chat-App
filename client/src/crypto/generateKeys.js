const crypto = globalThis.crypto;

export async function generateKeyPair() {
  return await crypto.subtle.generateKey(
    {
      name: "ECDH", // Eleptic-Curve Deffie Hellman
      namedCurve: "P-256",
    },
    true,
    ["deriveKey", "deriveBits"],
  );
}
