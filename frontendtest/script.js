// Mock database to store user data
const database = {};

// Function to generate random hex string of a given length
function generateRandomHex(length) {
    let result = '';
    const hexChars = '0123456789abcdef';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * 16); // Generate a random index (0-15)
        result += hexChars[randomIndex]; // Append a random hex character
    }

    return '0x' + result; // Prefix with '0x' for a valid hex format
}


// Function to simulate retrieving encrypted data and generating/storing keys
async function retrieveEncryptedData(userAddress, dataType) {
    console.log("Retrieving encrypted data...");

    // Replace this with actual blockchain interaction logic
    return new Promise((resolve) => {
        setTimeout(() => {
            const keyLength = userAddress.length; // Match key length to user address length
            const publicKey = generateRandomHex(keyLength); // Random public key
            const signedMsg = generateRandomHex(keyLength); // Random Signed Message

            // Store these keys in the database (mock)
            database[userAddress] = {
                publicKey,
                signedMsg,
                dataType
            };

            const encryptedData = ` Encrypted message: ${signedMsg}`;
            resolve({ encryptedData });
        }, 1000);
    });
}

// Function to simulate decrypting data by validating public/Signed Messages
function decryptData(encryptedData, signedMsgInput, publicKeyInput, userAddress) {
    console.log("Decrypting data...");

    // Retrieve stored keys from the mock database
    const storedKeys = database[userAddress];
    if (!storedKeys) {
        return "Error: No data found for the given user address!";
    }

    const { publicKey: storedPublicKey, signedMsg: storedsignedMsg } = storedKeys;

    // Validate public and Signed Messages
    if (publicKeyInput !== storedPublicKey) {
        return "Error: Public key does not match the stored public key!";
    }
    if (signedMsgInput !== storedsignedMsg) {
        return "Error: Signed Message does not match the stored Signed Message!";
    }

    return `Decrypted: Data successfully validated and decrypted for ${userAddress}\n${database[userAddress].dataType}`;
}

// Event listener for retrieving encrypted data
document.getElementById("retrieveHash").addEventListener("click", async () => {
    const userAddress = document.getElementById("userAddress").value;
    const dataType = document.getElementById("dataType").value;

    // Validate input fields
    if (!userAddress || !dataType) {
        alert("Please fill in all fields.");
        return;
    }

    const { encryptedData } = await retrieveEncryptedData(userAddress, dataType);

    // Display the encrypted data (do not auto-fill the public key)
    document.getElementById("output").textContent = encryptedData;
});

// Event listener for decrypting data
document.getElementById("decryptData").addEventListener("click", () => {
    const userAddress = document.getElementById("userAddress").value;
    const signedMsgInput = document.getElementById("signedMsg").value;
    const publicKeyInput = document.getElementById("publicKey").value;
    const encryptedData = document.getElementById("output").textContent;

    if (encryptedData === "No data retrieved yet.") {
        alert("No data to decrypt. Please retrieve data first.");
        return;
    }

    // Decrypt data by validating the keys
    const decryptedData = decryptData(encryptedData, signedMsgInput, publicKeyInput, userAddress);
    document.getElementById("output").textContent = decryptedData;
});

const IPFShash = generateRandomHex(42);
// Event listener for clearing all fields
document.getElementById("clearFields").addEventListener("click", () => {
    document.getElementById("userAddress").value = "";
    document.getElementById("dataType").value = "";
    document.getElementById("publicKey").value = "";
    document.getElementById("signedMsg").value = "";
    document.getElementById("output").textContent = IPFShash;

    document.getElementById("output-heading").innerText = "IPFS HASH:"
});
