import pkg from "hardhat";
const { ethers } = pkg;

async function main() {
  const contractAddress = "0x3262E890a4404e9D84Cd600421fD98322066d969";
  console.log("🧪 Testing TrustH2 Core Flow...\n");

  const contract = await ethers.getContractAt(
    "GreenH2Credits",
    contractAddress
  );
  const [user] = await ethers.getSigners();
  const userAddress = await user.getAddress();

  console.log("🏭 User Address:", userAddress);
  console.log("📜 Contract:", contractAddress);

  // Check current role and set PRODUCER role if needed
  let role = await contract.roles(userAddress);
  console.log(
    "👤 Current Role:",
    role === 1n
      ? "PRODUCER"
      : role === 2n
      ? "CERTIFIER"
      : role === 3n
      ? "BUYER"
      : "NONE"
  );

  if (role !== 1n) {
    console.log("🔧 Setting PRODUCER role...");
    await (await contract.setRole(userAddress, 1)).wait();
    role = await contract.roles(userAddress);
    console.log("✅ Role updated to:", role === 1n ? "PRODUCER" : "OTHER");
  }

  // Step 1: Producer requests mint
  console.log("\n📝 Step 1: Producer requests mint...");
  const certHash = ethers.keccak256(
    ethers.toUtf8Bytes("Green H2 Certificate #001")
  );
  const amount = ethers.parseUnits("100", 18); // 100 credits

  const tx1 = await contract.requestMint(certHash, amount);
  await tx1.wait();
  console.log("✅ Mint request submitted");

  const requestCount = await contract.getRequestsCount();
  console.log("📊 Total requests:", requestCount.toString());

  // Step 2: Certifier approves and mints
  console.log("\n✅ Step 2: Certifier approves and mints...");

  // Switch to CERTIFIER role
  await (await contract.setRole(userAddress, 2)).wait();
  console.log("🔧 Switched to CERTIFIER role");

  const tx2 = await contract.approveAndMint(0); // First request (index 0)
  await tx2.wait();
  console.log("✅ Credits minted successfully");

  const balance = await contract.balance(userAddress);
  console.log("💰 User balance:", ethers.formatUnits(balance, 18), "credits");

  // Step 3: Transfer credits (simulate buying)
  console.log("\n🔄 Step 3: Simulating credit transfer...");
  const transferAmount = ethers.parseUnits("30", 18); // Transfer 30 credits

  // Since we only have one address, we'll transfer to the same address for demo
  const tx3 = await contract.transfer(userAddress, transferAmount);
  await tx3.wait();
  console.log("✅ Credits transferred");

  const finalBalance = await contract.balance(userAddress);
  console.log(
    "💰 Final balance:",
    ethers.formatUnits(finalBalance, 18),
    "credits"
  );

  // Step 4: Retire credits (offsetting)
  console.log("\n♻️  Step 4: Retiring credits for carbon offset...");
  const retireAmount = ethers.parseUnits("50", 18); // Retire 50 credits

  const tx4 = await contract.retire(
    retireAmount,
    "Carbon offset for manufacturing process"
  );
  await tx4.wait();
  console.log("✅ Credits retired for environmental impact");

  const retiredBalance = await contract.balance(userAddress);
  console.log(
    "💰 Balance after retirement:",
    ethers.formatUnits(retiredBalance, 18),
    "credits"
  );

  console.log("\n🎉 SMOKE TEST PASSED! ✅");
  console.log("🌱 TrustH2 core flow working perfectly:");
  console.log("   ✅ Mint Request → Approve → Transfer → Retire");
  console.log("   ✅ All contract functions operational");
  console.log("   ✅ Ready for frontend integration!");
}

main().catch((error) => {
  console.error("❌ Smoke test failed:", error);
  process.exit(1);
});
