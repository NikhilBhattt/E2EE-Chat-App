function arrayBufferToBase64(buffer) {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)));
}

function base64ToArrayBuffer(base64) {
  const binary = atob(base64);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));

  return bytes.buffer;
}

export async function exportPublicKey(publicKey) {
  const exported = await crypto.subtle.exportKey("spki", publicKey);

  return arrayBufferToBase64(exported);
}

export async function exportPrivateKey(privateKey) {
  const exported = await crypto.subtle.exportKey("pkcs8", privateKey);

  return arrayBufferToBase64(exported);
}

export async function importPublicKey(base64Key) {
  return crypto.subtle.importKey(
    "spki",
    base64ToArrayBuffer(base64Key),
    {
      name: "ECDH",
      namedCurve: "P-256",
    },
    true,
    [],
  );
}

export async function importPrivateKey(base64Key) {
  return crypto.subtle.importKey(
    "pkcs8",
    base64ToArrayBuffer(base64Key),
    {
      name: "ECDH",
      namedCurve: "P-256",
    },
    true,
    ["deriveKey"],
  );
}

export async function savePrivateKey(userID, privateKey) {
  const exported = await exportPrivateKey(privateKey);

  localStorage.setItem(`privateKey_${userID}`, exported);
}

export function getStoredPrivateKey(userId) {
  return localStorage.getItem(`privateKey_${userId}`);
}
