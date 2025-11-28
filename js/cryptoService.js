// Helper for convert buffer to hex string
export const bufferToHex = (buffer) => {
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
};

// HASHING
export const generateHash = async (data, algorithm) => {
  const encoder = new TextEncoder();
  const buffer = typeof data === 'string' ? encoder.encode(data) : data;
  const hashBuffer = await window.crypto.subtle.digest(algorithm, buffer);
  return bufferToHex(hashBuffer);
};

// CAESAR CIPHER
export const caesarCipher = (text, shift) => {
  return text.split('').map(char => {
    if (char.match(/[a-z]/i)) {
      const code = char.charCodeAt(0);
      const isUpperCase = code >= 65 && code <= 90;
      const base = isUpperCase ? 65 : 97;
      return String.fromCharCode(((code - base + shift) % 26 + 26) % 26 + base);
    }
    return char;
  }).join('');
};

// --- AES-GCM FILE ENCRYPTION ---
// Structure: [Salt (16B)] [IV (12B)] [Ciphertext]

export const encryptFileAES = async (file, password) => {
  const encoder = new TextEncoder();
  const salt = window.crypto.getRandomValues(new Uint8Array(16));
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const keyMaterial = await window.crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );

  const key = await window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt,
      iterations: 100000,
      hash: "SHA-256"
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt"]
  );

  // Read file
  const fileBuffer = await file.arrayBuffer();
  // Encrypt
  const encryptedContent = await window.crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: iv
    },
    key,
    fileBuffer
  );

  // Combine Salt + IV + Encrypted Data
  return new Blob([salt, iv, encryptedContent], { type: 'application/octet-stream' });
};

export const decryptFileAES = async (encryptedBlob, password) => {
  const encoder = new TextEncoder();
  const buffer = await encryptedBlob.arrayBuffer();

  // Extract parts
  const salt = buffer.slice(0, 16);
  const iv = buffer.slice(16, 28);
  const data = buffer.slice(28);

  // Import password
  const keyMaterial = await window.crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );

  // Derive key
  const key = await window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt,
      iterations: 100000,
      hash: "SHA-256"
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["decrypt"]
  );

  // Decrypt
  try {
    return await window.crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: iv
      },
      key,
      data
    );
  } catch (e) {
    throw new Error("Decryption failed. Wrong password or corrupted file.");
  }
};
