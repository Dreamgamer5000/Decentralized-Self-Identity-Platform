// Importing IPFS HTTP client
import { create } from 'ipfs-http-client';

// Create an IPFS client instance
const ipfs = create({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });

// AES Encryption & Decryption Functions
const crypto = window.crypto.subtle;

// Generate a random AES-256 key
async function generateKey() {
  return crypto.generateKey(
    { name: "AES-CBC", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );
}

// Encrypt a message using AES-256
async function encryptData(key, message) {
  const iv = window.crypto.getRandomValues(new Uint8Array(16)); // Initialization Vector
  const encodedMessage = new TextEncoder().encode(message);
  const encrypted = await crypto.encrypt(
    { name: "AES-CBC", iv },
    key,
    encodedMessage
  );
  return { encryptedData: encrypted, iv };
}

// Decrypt data using AES-256
async function decryptData(key, encryptedData, iv) {
  const decrypted = await crypto.decrypt(
    { name: "AES-CBC", iv },
    key,
    encryptedData
  );
  return new TextDecoder().decode(decrypted);
}

// Encrypt and Store Data in IPFS
document.getElementById('encryptAndStore').addEventListener('click', async () => {
  const userInput = document.getElementById('userInput').value;

  if (!userInput) {
    alert("Please enter a message to encrypt.");
    return;
  }

  const key = await generateKey();
  const { encryptedData, iv } = await encryptData(key, userInput);

  // Convert encrypted data to a Uint8Array for IPFS
  const buffer = new Uint8Array(encryptedData);
  const ipfsResult = await ipfs.add(buffer);

  // Display IPFS hash
  document.getElementById('ipfsHash').textContent = ipfsResult.path;

  // Store the key and IV securely (for demo purposes, we log them here)
  console.log("Encryption Key (for demo only):", key);
  console.log("Initialization Vector (IV):", iv);
});

// Retrieve and Decrypt Data from IPFS
document.getElementById('retrieveAndDecrypt').addEventListener('click', async () => {
  const hash = document.getElementById('retrieveHash').value;

  if (!hash) {
    alert("Please enter an IPFS hash to retrieve data.");
    return;
  }

  try {
    const encryptedFile = [];
    for await (const chunk of ipfs.cat(hash)) {
      encryptedFile.push(chunk);
    }
    const encryptedData = new Uint8Array(encryptedFile).buffer;

    // Key and IV retrieval (for demo purposes, replace with actual key storage mechanism)
    const key = await generateKey(); // Replace with stored key
    const iv = window.crypto.getRandomValues(new Uint8Array(16)); // Replace with stored IV

    const decryptedMessage = await decryptData(key, encryptedData, iv);
    document.getElementById('decryptedMessage').textContent = decryptedMessage;
  } catch (error) {
    console.error(error);
    alert("Failed to retrieve or decrypt data.");
  }
});
