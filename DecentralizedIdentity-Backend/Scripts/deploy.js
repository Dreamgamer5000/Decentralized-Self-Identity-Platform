const Web3 = require('web3');
const fs = require('fs');
const path = require('path');

// Connect to Ganache (Local Blockchain)
const web3 = new Web3('http://127.0.0.1:7545');

// Read Contract ABI and Bytecode
const contractPath = path.resolve(__dirname, 'build', 'DecentralizedIdentity_sol_DecentralizedIdentity.abi');
const bytecodePath = path.resolve(__dirname, 'build', 'DecentralizedIdentity_sol_DecentralizedIdentity.bin');

const abi = JSON.parse(fs.readFileSync(contractPath, 'utf8'));
const bytecode = fs.readFileSync(bytecodePath, 'utf8');

const deployContract = async () => {
    const accounts = await web3.eth.getAccounts();
    console.log("Deploying from account:", accounts[0]);

    const result = await new web3.eth.Contract(abi)
        .deploy({ data: '0x' + bytecode }) // Bytecode
        .send({ from: accounts[0], gas: '5000000' }); // Deploy Gas Limit

    console.log("Contract deployed to:", result.options.address);
};

deployContract();
