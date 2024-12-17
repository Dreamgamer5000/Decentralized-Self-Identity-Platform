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


// Event listener for retrieving encrypted data
document.getElementById("encryptData").addEventListener("click", async () => {
    const userAddress = document.getElementById("userAddress").value;
    const dataType = document.getElementById("dataType").value;
    const encryptedData = generateRandomHex(42);
    // Validate input fields
    if (!userAddress || !dataType) {
        alert("Please fill in all fields.");
        return;
    }
    // Display the encrypted data (do not auto-fill the public key)
    document.getElementById("output").textContent = encryptedData;
});



const IPFShash = generateRandomHex(42);
// Event listener for clearing all fields
document.getElementById("clearFields").addEventListener("click", () => {
    document.getElementById("userAddress").value = "";
    document.getElementById("dataType").value = "";
    document.getElementById("publicKey").value = "";
    document.getElementById("output").textContent = IPFShash;

    document.getElementById("output-heading").innerText = "IPFS HASH:"
});

// Event listener for decrypting data
document.getElementById("encryptHashKey").addEventListener("click", () => {

    document.getElementById("publicKey").textContent = generateRandomHex(42);
    const arrowFunc = () => {
        const hexString = "0x54843cc9cceaff05f307f1790047b44dd36d49e7a9"; // Example hex string
        const hexChars = "0123456789abcdef"; // Hexadecimal character set
    
        // Remove the "0x" prefix and process each character
        let updatedHex = hexString
            .slice(2) // Remove the "0x" prefix
            .split("") // Split into individual characters
            .map((char) => {
                if (!hexChars.includes(char)) return char; // Skip invalid characters (e.g., "x")
                const currentIndex = hexChars.indexOf(char); // Find current position in hexChars
                return hexChars[(currentIndex + 1) % 16]; // Correctly increment by 1 and wrap around
            })
            .join(""); // Recombine into a single string
    
        updatedHex = "0x" + updatedHex; // Add "0x" prefix back
        return updatedHex;
    };
    document.getElementById("ipfs").textContent = `${arrowFunc()}`;
});
