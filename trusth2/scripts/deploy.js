import pkg from "hardhat";
const { ethers } = pkg;

async function main() {
  console.log("🚀 Deploying GreenH2Credits contract...");

  const Factory = await ethers.getContractFactory("GreenH2Credits");
  const contract = await Factory.deploy();
  await contract.waitForDeployment();

  const contractAddress = await contract.getAddress();
  console.log("✅ Contract deployed at:", contractAddress);

  // Get signers for role assignment
  const signers = await ethers.getSigners();
  const [deployer] = signers;

  console.log("👤 Setting up roles...");
  console.log("Available signers:", signers.length);

  // Use the deployer as all roles for testing
  // Set roles: 1=PRODUCER, 2=CERTIFIER, 3=BUYER
  const deployerAddress = await deployer.getAddress();

  await (await contract.setRole(deployerAddress, 1)).wait(); // PRODUCER
  console.log("  Producer role set for:", deployerAddress);

  await (await contract.setRole(deployerAddress, 2)).wait(); // CERTIFIER
  console.log("  Certifier role set for:", deployerAddress);

  await (await contract.setRole(deployerAddress, 3)).wait(); // BUYER
  console.log("  Buyer role set for:", deployerAddress);

  console.log("\n🎉 Deployment complete!");
  console.log("📋 Contract Address:", contractAddress);
  console.log(
    "🔗 Explorer:",
    `https://amoy.polygonscan.com/address/${contractAddress}`
  );
}

main().catch((error) => {
  console.error("❌ Deployment failed:", error);
  process.exit(1);
});
