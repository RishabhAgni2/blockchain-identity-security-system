import pkg from "hardhat";

const { ethers } = pkg;

async function main() {
  const Contract = await ethers.getContractFactory("DocumentProof");
  const contract = await Contract.deploy();

  await contract.waitForDeployment();

  console.log("Contract deployed to:", await contract.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});