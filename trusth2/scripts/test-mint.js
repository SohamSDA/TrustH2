import pkg from "hardhat";
const { ethers } = pkg;

async function main() {
  const contractAddress = "0x4A84Be8d54C1fF9abd01B54b2861318c046d93e4";

  console.log("🧪 Testing mint request directly...");

  const contract = await ethers.getContractAt(
    "GreenH2Credits",
    contractAddress
  );
  const [user] = await ethers.getSigners();

  console.log("👤 User:", await user.getAddress());

  // Check role
  const role = await contract.roles(await user.getAddress());
  console.log("🎭 Current role:", role.toString());

  if (role.toString() !== "1") {
    console.log("❌ Not a producer, setting role...");
    await (await contract.setRole(await user.getAddress(), 1)).wait();
    console.log("✅ Role set to Producer");
  }

  // Create test hash
  const testCert = "Test123";
  const certHash = ethers.keccak256(ethers.toUtf8Bytes(testCert));
  console.log("📄 Certificate hash:", certHash);

  // Try mint request
  console.log("📝 Submitting mint request...");
  const tx = await contract.requestMint(certHash, ethers.parseUnits("100", 18));
  console.log("⏳ Transaction hash:", tx.hash);

  await tx.wait();
  console.log("✅ Mint request successful!");

  const requestCount = await contract.getRequestsCount();
  console.log("📊 Total requests:", requestCount.toString());
}

main().catch(console.error);
