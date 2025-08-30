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

  // Set roles for the specified wallet address
  // Set roles: 1=PRODUCER, 2=CERTIFIER, 3=BUYER
  const targetAddress = "0x930b177D5cBfE4C8575485570164D880B739DEf8";
  const deployerAddress = await deployer.getAddress();

  // Set roles for the target wallet
  await (await contract.setRole(targetAddress, 1)).wait(); // PRODUCER
  console.log("  Producer role set for:", targetAddress);

  await (await contract.setRole(targetAddress, 2)).wait(); // CERTIFIER
  console.log("  Certifier role set for:", targetAddress);

  await (await contract.setRole(targetAddress, 3)).wait(); // BUYER
  console.log("  Buyer role set for:", targetAddress);

  // Also set roles for deployer for testing
  await (await contract.setRole(deployerAddress, 1)).wait(); // PRODUCER
  await (await contract.setRole(deployerAddress, 2)).wait(); // CERTIFIER
  await (await contract.setRole(deployerAddress, 3)).wait(); // BUYER
  console.log("  All roles also set for deployer:", deployerAddress);

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
