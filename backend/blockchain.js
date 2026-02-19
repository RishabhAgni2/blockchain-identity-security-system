const { ethers } = require("ethers");
require("dotenv").config();

const proofArtifact = require("../blockchain/artifacts/contracts/DocumentProof.sol/DocumentProof.json");

const provider = new ethers.providers.JsonRpcProvider(
  process.env.RPC_URL
  
);

const signer = new ethers.Wallet(
  process.env.BLOCKCHAIN_PRIVATE_KEY,
  provider
);

const documentProofContract = new ethers.Contract(
  process.env.CONTRACT_ADDRESS,
  proofArtifact.abi,
  signer
);

module.exports = documentProofContract;