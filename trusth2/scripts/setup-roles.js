import pkg from "hardhat";
const { ethers } = pkg;

async function main() {
  const contractAddress = "0x3262E890a4404e9D84Cd600421fD98322066d969";
  console.log("🔗 Connecting to deployed contract at:", contractAddress);

  const contract = await ethers.getContractAt(
    "GreenH2Credits",
    contractAddress
  );
  const [deployer] = await ethers.getSigners();
  const deployerAddress = await deployer.getAddress();

  console.log("👤 Setting up roles for:", deployerAddress);

  // Set roles: 1=PRODUCER, 2=CERTIFIER, 3=BUYER
  await (await contract.setRole(deployerAddress, 1)).wait();
  console.log("✅ Producer role set");

  await (await contract.setRole(deployerAddress, 2)).wait();
  console.log("✅ Certifier role set");

  await (await contract.setRole(deployerAddress, 3)).wait();
  console.log("✅ Buyer role set");

  console.log("\n🎉 Roles configured successfully!");
  console.log("📋 Contract Address:", contractAddress);
  console.log(
    "🔗 Explorer:",
    `https://amoy.polygonscan.com/address/${contractAddress}`
  );
}

main().catch((error) => {
  console.error("❌ Role setup failed:", error);
  process.exit(1);
});
