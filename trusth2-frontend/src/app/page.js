"use client";

import { useState, useEffect } from "react";
import {
  useAccount,
  useConnect,
  useDisconnect,
  useWriteContract,
  useReadContract,
} from "wagmi";
import { parseEther, formatEther } from "viem";

const CONTRACT_ADDRESS = "0x3262E890a4404e9D84Cd600421fD98322066d969";
const CONTRACT_ABI = [
  "function roles(address) external view returns (uint8)",
  "function balance(address) external view returns (uint256)",
  "function setRole(address who, uint8 r) external",
  "function requestMint(bytes32 certHash, uint256 amount) external",
  "function approveAndMint(uint256 id) external",
  "function transfer(address to, uint256 amount) external",
  "function retire(uint256 amount, string calldata reason) external",
  "function getRequestsCount() external view returns (uint256)",
  "function requests(uint256) external view returns (address, bytes32, uint256, bool)",
];

export default function Home() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  const [mintAmount, setMintAmount] = useState("");
  const [transferTo, setTransferTo] = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const [retireAmount, setRetireAmount] = useState("");
  const [retireReason, setRetireReason] = useState("");

  // Read user's role
  const { data: userRole } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "roles",
    args: address ? [address] : undefined,
  });

  // Read user's balance
  const { data: userBalance } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "balance",
    args: address ? [address] : undefined,
  });

  // Read total requests
  const { data: requestCount } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "getRequestsCount",
  });

  // Write contract functions
  const { writeContract } = useWriteContract();

  const getRoleName = (role) => {
    switch (Number(role)) {
      case 1:
        return "Producer";
      case 2:
        return "Certifier";
      case 3:
        return "Buyer";
      default:
        return "None";
    }
  };

  const handleSetRole = (role) => {
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: "setRole",
      args: [address, role],
    });
  };

  const handleRequestMint = () => {
    if (!mintAmount) return;
    const certHash = `0x${Date.now().toString(16).padStart(64, "0")}`;
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: "requestMint",
      args: [certHash, parseEther(mintAmount)],
    });
  };

  const handleApproveRequest = (requestId) => {
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: "approveAndMint",
      args: [requestId],
    });
  };

  const handleTransfer = () => {
    if (!transferTo || !transferAmount) return;
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: "transfer",
      args: [transferTo, parseEther(transferAmount)],
    });
  };

  const handleRetire = () => {
    if (!retireAmount || !retireReason) return;
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: "retire",
      args: [parseEther(retireAmount), retireReason],
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-green-800 mb-4">🌱 TrustH2</h1>
          <p className="text-xl text-gray-600">
            Green Hydrogen Credits Marketplace
          </p>
          <p className="text-sm text-gray-500 mt-2">Polygon Amoy Testnet</p>
        </div>

        {/* Wallet Connection */}
        <div className="max-w-4xl mx-auto">
          {!isConnected ? (
            <div className="bg-white rounded-lg shadow-lg p-8 text-center mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                Connect Your Wallet
              </h2>
              <div className="space-y-4">
                {connectors.map((connector) => (
                  <button
                    key={connector.uid}
                    onClick={() => connect({ connector })}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mx-2"
                  >
                    Connect {connector.name}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {/* User Info */}
              <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-semibold">Account Info</h2>
                  <button
                    onClick={() => disconnect()}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Disconnect
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 p-4 rounded">
                    <p className="text-sm text-gray-600">Address</p>
                    <p className="font-mono text-sm">
                      {address?.slice(0, 10)}...{address?.slice(-8)}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded">
                    <p className="text-sm text-gray-600">Role</p>
                    <p className="font-semibold">{getRoleName(userRole)}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded">
                    <p className="text-sm text-gray-600">H2 Credits Balance</p>
                    <p className="font-semibold">
                      {userBalance ? formatEther(userBalance) : "0"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Role Management */}
              <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                <h3 className="text-xl font-semibold mb-4">
                  🎭 Role Management
                </h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleSetRole(1)}
                    className="bg-green-500 hover:bg-green-700 text-white py-2 px-4 rounded"
                  >
                    Set Producer
                  </button>
                  <button
                    onClick={() => handleSetRole(2)}
                    className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded"
                  >
                    Set Certifier
                  </button>
                  <button
                    onClick={() => handleSetRole(3)}
                    className="bg-purple-500 hover:bg-purple-700 text-white py-2 px-4 rounded"
                  >
                    Set Buyer
                  </button>
                </div>
              </div>

              {/* Producer Actions */}
              {Number(userRole) === 1 && (
                <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                  <h3 className="text-xl font-semibold mb-4">
                    🏭 Producer Actions
                  </h3>
                  <div className="flex space-x-4 items-end">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Request Mint (Credits)
                      </label>
                      <input
                        type="number"
                        value={mintAmount}
                        onChange={(e) => setMintAmount(e.target.value)}
                        className="border border-gray-300 rounded px-3 py-2 w-32"
                        placeholder="100"
                      />
                    </div>
                    <button
                      onClick={handleRequestMint}
                      className="bg-green-500 hover:bg-green-700 text-white py-2 px-4 rounded"
                    >
                      Request Mint
                    </button>
                  </div>
                </div>
              )}

              {/* Certifier Actions */}
              {Number(userRole) === 2 && (
                <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                  <h3 className="text-xl font-semibold mb-4">
                    ✅ Certifier Actions
                  </h3>
                  <p className="mb-4">
                    Total Requests: {requestCount?.toString() || "0"}
                  </p>
                  <button
                    onClick={() => handleApproveRequest(0)}
                    className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded"
                  >
                    Approve Latest Request
                  </button>
                </div>
              )}

              {/* Transfer Credits */}
              <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                <h3 className="text-xl font-semibold mb-4">
                  🔄 Transfer Credits
                </h3>
                <div className="flex space-x-4 items-end">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      To Address
                    </label>
                    <input
                      type="text"
                      value={transferTo}
                      onChange={(e) => setTransferTo(e.target.value)}
                      className="border border-gray-300 rounded px-3 py-2 w-80"
                      placeholder="0x..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Amount
                    </label>
                    <input
                      type="number"
                      value={transferAmount}
                      onChange={(e) => setTransferAmount(e.target.value)}
                      className="border border-gray-300 rounded px-3 py-2 w-32"
                      placeholder="10"
                    />
                  </div>
                  <button
                    onClick={handleTransfer}
                    className="bg-orange-500 hover:bg-orange-700 text-white py-2 px-4 rounded"
                  >
                    Transfer
                  </button>
                </div>
              </div>

              {/* Retire Credits */}
              <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                <h3 className="text-xl font-semibold mb-4">
                  ♻️ Retire Credits
                </h3>
                <div className="flex space-x-4 items-end">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Amount
                    </label>
                    <input
                      type="number"
                      value={retireAmount}
                      onChange={(e) => setRetireAmount(e.target.value)}
                      className="border border-gray-300 rounded px-3 py-2 w-32"
                      placeholder="5"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Reason
                    </label>
                    <input
                      type="text"
                      value={retireReason}
                      onChange={(e) => setRetireReason(e.target.value)}
                      className="border border-gray-300 rounded px-3 py-2 w-80"
                      placeholder="Carbon offset for manufacturing"
                    />
                  </div>
                  <button
                    onClick={handleRetire}
                    className="bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded"
                  >
                    Retire
                  </button>
                </div>
              </div>

              {/* Contract Info */}
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-600">
                  Contract:{" "}
                  <span className="font-mono">{CONTRACT_ADDRESS}</span>
                </p>
                <a
                  href={`https://amoy.polygonscan.com/address/${CONTRACT_ADDRESS}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-700 text-sm"
                >
                  View on Polygonscan ↗
                </a>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
