function arrayBufferToBase64(buffer) {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)));
}

export async function encryptMessage(message, aesKey) {
  const iv = crypto.getRandomValues(new Uint8Array(12));

  const encodedMessage = new TextEncoder().encode(message);

  const encrypted = await crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv,
    },
    aesKey,
    encodedMessage,
  );

  return {
    cipherText: arrayBufferToBase64(encrypted),
    iv: arrayBufferToBase64(iv),
  };
}
