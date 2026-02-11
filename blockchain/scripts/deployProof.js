import hre from "hardhat";
const { ethers } = hre;

async function main() {
  const DocumentProof = await ethers.getContractFactory("DocumentProof");
  const contract = await DocumentProof.deploy();
  await contract.deployed();

  console.log("DocumentProof deployed to:", contract.address);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
