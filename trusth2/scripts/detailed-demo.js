import pkg from "hardhat";
const { ethers } = pkg;

async function main() {
  const contractAddress = "0x3262E890a4404e9D84Cd600421fD98322066d969";
  
  console.log("🌱 TrustH2 Complete Flow Demo");
  console.log("=" * 50);
  console.log(`📜 Contract Address: ${contractAddress}`);
  console.log(`🔗 Explorer: https://amoy.polygonscan.com/address/${contractAddress}`);
  console.log("\n");

  // Connect to the contract
  const contract = await ethers.getContractAt("GreenH2Credits", contractAddress);
  const [user] = await ethers.getSigners();
  const userAddress = await user.getAddress();
  
  console.log("👤 User Address:", userAddress);
  console.log("💰 User's MATIC balance:", ethers.formatEther(await ethers.provider.getBalance(userAddress)), "MATIC");
  
  // ===== STEP 1: CHECK INITIAL STATE =====
  console.log("\n" + "=".repeat(50));
  console.log("📊 STEP 1: CHECKING INITIAL STATE");
  console.log("=".repeat(50));
  
  const initialRole = await contract.roles(userAddress);
  const initialBalance = await contract.balance(userAddress);
  const initialRequests = await contract.getRequestsCount();
  
  console.log(`🎭 Current Role: ${getRoleName(initialRole)}`);
  console.log(`💰 H2 Credits Balance: ${ethers.formatUnits(initialBalance, 18)} credits`);
  console.log(`📝 Total Requests in System: ${initialRequests.toString()}`);
  
  // ===== STEP 2: BECOME A PRODUCER =====
  console.log("\n" + "=".repeat(50));
  console.log("🏭 STEP 2: BECOMING A PRODUCER");
  console.log("=".repeat(50));
  
  console.log("🔧 Setting role to PRODUCER (Role = 1)...");
  const setProducerTx = await contract.setRole(userAddress, 1);
  console.log(`⏳ Transaction sent: ${setProducerTx.hash}`);
  
  const setProducerReceipt = await setProducerTx.wait();
  console.log(`✅ Transaction confirmed in block: ${setProducerReceipt.blockNumber}`);
  console.log(`⛽ Gas used: ${setProducerReceipt.gasUsed.toString()}`);
  
  const newRole = await contract.roles(userAddress);
  console.log(`🎭 New Role: ${getRoleName(newRole)}`);
  
  // ===== STEP 3: REQUEST MINT (AS PRODUCER) =====
  console.log("\n" + "=".repeat(50));
  console.log("📝 STEP 3: REQUESTING CREDITS MINT");
  console.log("=".repeat(50));
  
  const certHash = ethers.keccak256(ethers.toUtf8Bytes(`Green H2 Certificate ${Date.now()}`));
  const mintAmount = ethers.parseUnits("500", 18); // 500 credits
  
  console.log(`📄 Certificate Hash: ${certHash}`);
  console.log(`🔢 Requesting Amount: ${ethers.formatUnits(mintAmount, 18)} credits`);
  console.log("🏭 Producer says: 'I produced 500 units of green hydrogen using solar power!'");
  
  const requestMintTx = await contract.requestMint(certHash, mintAmount);
  console.log(`⏳ Mint request sent: ${requestMintTx.hash}`);
  
  const requestMintReceipt = await requestMintTx.wait();
  console.log(`✅ Mint request confirmed in block: ${requestMintReceipt.blockNumber}`);
  console.log(`⛽ Gas used: ${requestMintReceipt.gasUsed.toString()}`);
  
  const newRequestCount = await contract.getRequestsCount();
  console.log(`📊 Total requests now: ${newRequestCount.toString()}`);
  
  // Check the request details
  const latestRequestId = newRequestCount - 1n;
  const requestDetails = await contract.requests(latestRequestId);
  console.log(`📋 Request #${latestRequestId} Details:`);
  console.log(`   👤 Producer: ${requestDetails[0]}`);
  console.log(`   📄 Certificate: ${requestDetails[1]}`);
  console.log(`   🔢 Amount: ${ethers.formatUnits(requestDetails[2], 18)} credits`);
  console.log(`   ✅ Approved: ${requestDetails[3]}`);
  
  // ===== STEP 4: SWITCH TO CERTIFIER =====
  console.log("\n" + "=".repeat(50));
  console.log("✅ STEP 4: BECOMING A CERTIFIER");
  console.log("=".repeat(50));
  
  console.log("🔧 Switching role to CERTIFIER (Role = 2)...");
  console.log("🔍 Certifier says: 'Let me verify this green hydrogen production claim!'");
  
  const setCertifierTx = await contract.setRole(userAddress, 2);
  console.log(`⏳ Role switch sent: ${setCertifierTx.hash}`);
  
  const setCertifierReceipt = await setCertifierTx.wait();
  console.log(`✅ Role switch confirmed in block: ${setCertifierReceipt.blockNumber}`);
  
  const certifierRole = await contract.roles(userAddress);
  console.log(`🎭 New Role: ${getRoleName(certifierRole)}`);
  
  // ===== STEP 5: APPROVE AND MINT =====
  console.log("\n" + "=".repeat(50));
  console.log("🔓 STEP 5: APPROVING AND MINTING CREDITS");
  console.log("=".repeat(50));
  
  console.log(`🔍 Certifier reviewing request #${latestRequestId}...`);
  console.log("✅ Certifier says: 'I verified the solar panels and hydrogen production. This is legitimate!'");
  
  const balanceBeforeMint = await contract.balance(requestDetails[0]);
  console.log(`💰 Producer's balance before mint: ${ethers.formatUnits(balanceBeforeMint, 18)} credits`);
  
  const approveMintTx = await contract.approveAndMint(latestRequestId);
  console.log(`⏳ Approval sent: ${approveMintTx.hash}`);
  
  const approveMintReceipt = await approveMintTx.wait();
  console.log(`✅ Credits minted in block: ${approveMintReceipt.blockNumber}`);
  console.log(`⛽ Gas used: ${approveMintReceipt.gasUsed.toString()}`);
  
  const balanceAfterMint = await contract.balance(requestDetails[0]);
  console.log(`💰 Producer's balance after mint: ${ethers.formatUnits(balanceAfterMint, 18)} credits`);
  console.log(`🎉 NEW CREDITS CREATED: ${ethers.formatUnits(balanceAfterMint - balanceBeforeMint, 18)} credits`);
  
  // ===== STEP 6: TRANSFER CREDITS =====
  console.log("\n" + "=".repeat(50));
  console.log("🔄 STEP 6: TRANSFERRING CREDITS (TRADING)");
  console.log("=".repeat(50));
  
  // For demo, we'll transfer to the same address, but in real life this would be different addresses
  const transferAmount = ethers.parseUnits("200", 18); // Transfer 200 credits
  const receiverAddress = userAddress; // In real scenario, this would be a buyer's address
  
  console.log(`🏢 Buyer says: 'I want to buy ${ethers.formatUnits(transferAmount, 18)} credits to offset my company's emissions!'`);
  console.log(`🔄 Transferring ${ethers.formatUnits(transferAmount, 18)} credits...`);
  console.log(`📤 From: ${userAddress}`);
  console.log(`📥 To: ${receiverAddress}`);
  
  const balanceBeforeTransfer = await contract.balance(userAddress);
  
  const transferTx = await contract.transfer(receiverAddress, transferAmount);
  console.log(`⏳ Transfer sent: ${transferTx.hash}`);
  
  const transferReceipt = await transferTx.wait();
  console.log(`✅ Transfer confirmed in block: ${transferReceipt.blockNumber}`);
  console.log(`⛽ Gas used: ${transferReceipt.gasUsed.toString()}`);
  
  const balanceAfterTransfer = await contract.balance(userAddress);
  console.log(`💰 Balance after transfer: ${ethers.formatUnits(balanceAfterTransfer, 18)} credits`);
  
  // ===== STEP 7: RETIRE CREDITS (CARBON OFFSET) =====
  console.log("\n" + "=".repeat(50));
  console.log("♻️ STEP 7: RETIRING CREDITS (CARBON OFFSETTING)");
  console.log("=".repeat(50));
  
  const retireAmount = ethers.parseUnits("100", 18); // Retire 100 credits
  const retireReason = "Carbon offset for Q3 2025 manufacturing operations";
  
  console.log(`🌍 Company says: 'We want to offset our carbon footprint by retiring ${ethers.formatUnits(retireAmount, 18)} credits'`);
  console.log(`📝 Reason: "${retireReason}"`);
  console.log("♻️ These credits will be permanently destroyed to represent environmental benefit");
  
  const balanceBeforeRetire = await contract.balance(userAddress);
  console.log(`💰 Balance before retirement: ${ethers.formatUnits(balanceBeforeRetire, 18)} credits`);
  
  const retireTx = await contract.retire(retireAmount, retireReason);
  console.log(`⏳ Retirement sent: ${retireTx.hash}`);
  
  const retireReceipt = await retireTx.wait();
  console.log(`✅ Credits retired in block: ${retireReceipt.blockNumber}`);
  console.log(`⛽ Gas used: ${retireReceipt.gasUsed.toString()}`);
  
  const balanceAfterRetire = await contract.balance(userAddress);
  console.log(`💰 Balance after retirement: ${ethers.formatUnits(balanceAfterRetire, 18)} credits`);
  console.log(`🔥 CREDITS PERMANENTLY DESTROYED: ${ethers.formatUnits(balanceBeforeRetire - balanceAfterRetire, 18)} credits`);
  
  // ===== FINAL SUMMARY =====
  console.log("\n" + "=".repeat(50));
  console.log("📊 FINAL SUMMARY - COMPLETE FLOW");
  console.log("=".repeat(50));
  
  console.log("✅ 1. Producer requested 500 credits for green hydrogen production");
  console.log("✅ 2. Certifier verified and approved the request");
  console.log("✅ 3. 500 new credits were minted to the producer");
  console.log("✅ 4. 200 credits were transferred (simulating a sale)");
  console.log("✅ 5. 100 credits were retired for carbon offsetting");
  console.log(`✅ 6. Final balance: ${ethers.formatUnits(balanceAfterRetire, 18)} credits remaining`);
  
  console.log("\n🌱 ENVIRONMENTAL IMPACT:");
  console.log(`🏭 Green hydrogen produced: 500 units (solar-powered)`);
  console.log(`💼 Credits traded: 200 units (market activity)`);
  console.log(`♻️ Carbon offset: 100 units (environmental benefit)`);
  console.log(`🌍 Net positive impact: Supporting clean energy transition!`);
  
  console.log("\n🔗 All transactions visible on blockchain:");
  console.log(`📋 View your contract: https://amoy.polygonscan.com/address/${contractAddress}`);
  console.log(`👤 View your address: https://amoy.polygonscan.com/address/${userAddress}`);
}

function getRoleName(role) {
  switch (Number(role)) {
    case 0: return "NONE";
    case 1: return "PRODUCER (Makes green hydrogen)";
    case 2: return "CERTIFIER (Verifies production)";
    case 3: return "BUYER (Purchases credits)";
    default: return "UNKNOWN";
  }
}

main().catch((error) => {
  console.error("❌ Demo failed:", error);
  process.exit(1);
});
