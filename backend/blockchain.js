const { ethers } = require("ethers");
const path = require("path");

const proofArtifact = require(path.join(
  __dirname,
  "../blockchain/artifacts/contracts/DocumentProof.sol/DocumentProof.json"
));

const { DOCUMENT_PROOF_ADDRESS } = require("../blockchain/contractAddress.cjs");

const provider = new ethers.providers.JsonRpcProvider(
  "http://127.0.0.1:8545"
);

const signer = new ethers.Wallet(
  process.env.BLOCKCHAIN_PRIVATE_KEY,
  provider
);

const documentProofContract = new ethers.Contract(
  DOCUMENT_PROOF_ADDRESS,
  proofArtifact.abi,
  signer
);

module.exports = documentProofContract;
