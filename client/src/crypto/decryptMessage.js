function base64ToArrayBuffer(base64) {
  const binary = atob(base64);

  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));

  return bytes.buffer;
}

export async function decryptMessage(ciphertext, iv, aesKey) {
  const decrypted = await crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: new Uint8Array(base64ToArrayBuffer(iv)),
    },
    aesKey,
    base64ToArrayBuffer(ciphertext),
  );

  return new TextDecoder().decode(decrypted);
}
