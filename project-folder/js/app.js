import { create } from "ipfs-http-client";
import crypto from "crypto";

// Create an IPFS client instance
const ipfs = create({ host: "ipfs.infura.io", port: 5001, protocol: "https" });

// Generate a random AES-256 key
function generateKey() {
  return crypto.randomBytes(32); // 256-bit key
}

// Encrypt data using AES-256-CBC
function encryptData(key, message) {
  const iv = crypto.randomBytes(16); // 16-byte IV
  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
  const encrypted = Buffer.concat([
    cipher.update(message, "utf8"),
    cipher.final(),
  ]);
  return { encryptedData: encrypted, iv };
}

// Decrypt data using AES-256-CBC
function decryptData(key, encryptedData, iv) {
  const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
  const decrypted = Buffer.concat([
    decipher.update(encryptedData),
    decipher.final(),
  ]);
  return decrypted.toString("utf8");
}

// Encrypt and Store Data in IPFS
async function encryptAndStore() {
  const userInput = "Your secret message here!";

  if (!userInput) {
    console.error("No message provided.");
    return;
  }

  const key = generateKey();
  const { encryptedData, iv } = encryptData(key, userInput);

  // Upload encrypted data to IPFS
  const ipfsResult = await ipfs.add(encryptedData);
  console.log("IPFS Hash:", ipfsResult.path);

  // Log key and IV for demo purposes (not secure for production!)
  console.log("Encryption Key:", key.toString("hex"));
  console.log("Initialization Vector (IV):", iv.toString("hex"));

  return { ipfsHash: ipfsResult.path, key, iv };
}

// Retrieve and Decrypt Data from IPFS
async function retrieveAndDecrypt(ipfsHash, key, iv) {
  if (!ipfsHash) {
    console.error("No IPFS hash provided.");
    return;
  }

  try {
    const chunks = [];
    for await (const chunk of ipfs.cat(ipfsHash)) {
      chunks.push(chunk);
    }
    const encryptedData = Buffer.concat(chunks);

    const decryptedMessage = decryptData(key, encryptedData, iv);
    console.log("Decrypted Message:", decryptedMessage);
    return decryptedMessage;
  } catch (error) {
    console.error("Error retrieving or decrypting data:", error);
  }
}

// Example Usage
(async () => {
  // Encrypt and store data
  const { ipfsHash, key, iv } = await encryptAndStore();

  // Retrieve and decrypt data
  if (ipfsHash) {
    await retrieveAndDecrypt(ipfsHash, key, iv);
  }
})();
