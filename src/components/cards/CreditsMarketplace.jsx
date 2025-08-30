import { useState, useEffect } from "react";
import { useReadContract } from "wagmi";
import { ABI, CONTRACT } from "../../lib/abi.js";
import { useRole } from "../../hooks/useRole.js";
import { formatUnits } from "viem";
import { usePublicClient } from "wagmi";

export function CreditsMarketplace() {
  const { role } = useRole();
  const [holders, setHolders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const publicClient = usePublicClient();

  // Real addresses to check for credits - using your wallet address
  const sampleAddresses = [
    "0x930b177D5cBfE4C8575485570164D880B739DEf8", // Your wallet address
    "0x1234567890123456789012345678901234567890", // Mock address 1
    "0x2345678901234567890123456789012345678901", // Mock address 2
  ];

  useEffect(() => {
    // Only load data once when component mounts and has required dependencies
    if (CONTRACT && publicClient && !dataLoaded) {
      fetchHolders();
    }
  }, [publicClient, dataLoaded]);

  const fetchHolders = async () => {
    if (!publicClient) return;

    setLoading(true);
    try {
      const holdersData = [];

      // In a real implementation, you'd get this from Transfer events
      for (const address of sampleAddresses) {
        try {
          console.log(`Checking balance for address: ${address}`);
          const balance = await publicClient.readContract({
            address: CONTRACT,
            abi: ABI,
            functionName: "balance",
            args: [address],
          });

          console.log(`Balance for ${address}:`, balance?.toString());

          if (balance && balance > 0n) {
            holdersData.push({
              address,
              balance: formatUnits(balance, 18),
              price:
                address === "0x930b177D5cBfE4C8575485570164D880B739DEf8"
                  ? (25 + Math.random() * 10).toFixed(2) // Your credits at market rate
                  : (Math.random() * 50 + 10).toFixed(2), // Mock price for others
            });
          } else if (address === "0x930b177D5cBfE4C8575485570164D880B739DEf8") {
            // Always show your address even with 0 balance for debugging
            holdersData.push({
              address,
              balance: "0",
              price: "25.00",
            });
          }
        } catch (error) {
          console.error(`Error checking balance for ${address}:`, error);
          // For your address, show it even if there's an error
          if (address === "0x930b177D5cBfE4C8575485570164D880B739DEf8") {
            holdersData.push({
              address,
              balance: "Error loading",
              price: "25.00",
            });
          }
        }
      }

      setHolders(holdersData);

      // Add some mock sellers for demonstration if no real holders found
      if (holdersData.length === 0) {
        const mockHolders = [
          {
            address: "0xABC1234567890123456789012345678901234567",
            balance: "1,250",
            price: "28.50",
            mockSeller: true,
          },
          {
            address: "0xDEF7890123456789012345678901234567890123",
            balance: "750",
            price: "31.75",
            mockSeller: true,
          },
          {
            address: "0x930b177D5cBfE4C8575485570164D880B739DEf8",
            balance: "Pending approval...",
            price: "25.00",
            isPending: true,
          },
        ];
        setHolders(mockHolders);
      }

      setDataLoaded(true); // Mark data as loaded to prevent further fetches
    } catch (error) {
      console.error("Error fetching holders:", error);
    } finally {
      setLoading(false);
    }
  };

  if (role === "None" || role === "Producer") {
    return null; // Only show to Certifiers and Buyers
  }

  return (
    <div className="rounded-2xl p-5 bg-white/5 backdrop-blur shadow-lg border border-white/10">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">
          Credits Marketplace
        </h3>
        <div className="flex items-center gap-2">
          <span className="px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded-full font-medium">
            {holders.length} holders
          </span>
          <button
            onClick={() => {
              setDataLoaded(false);
              setHolders([]);
            }}
            className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full font-medium hover:bg-blue-500/30 transition-colors duration-200 cursor-pointer"
            title="Refresh marketplace data"
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white/60"></div>
          <span className="ml-3 text-neutral-300 text-sm">
            Loading marketplace...
          </span>
        </div>
      ) : holders.length > 0 ? (
        <div className="space-y-3 max-h-80 overflow-y-auto">
          {holders.map((holder, index) => (
            <div
              key={holder.address}
              className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-white">
                  {holder.mockSeller
                    ? `Seller #${index + 1}`
                    : holder.isPending
                    ? "Your Credits"
                    : `Holder #${index + 1}`}
                </span>
                <span
                  className={`px-2 py-1 text-xs rounded-full font-medium ${
                    holder.isPending
                      ? "bg-yellow-500/20 text-yellow-300"
                      : holder.mockSeller
                      ? "bg-blue-500/20 text-blue-300"
                      : "bg-green-500/20 text-green-300"
                  }`}
                >
                  {holder.isPending
                    ? "Pending"
                    : holder.mockSeller
                    ? "Demo"
                    : "Available"}
                </span>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-neutral-400">Address:</span>
                  <span className="text-white font-mono text-xs tracking-tight">
                    {holder.address.slice(0, 6)}...{holder.address.slice(-4)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-neutral-400">Available:</span>
                  <span
                    className={`font-semibold ${
                      holder.isPending ? "text-yellow-300" : "text-white"
                    }`}
                  >
                    {holder.balance === "0"
                      ? "0 credits"
                      : typeof holder.balance === "string" &&
                        !holder.balance.includes(",") &&
                        !isNaN(parseFloat(holder.balance))
                      ? `${parseFloat(holder.balance).toLocaleString()} credits`
                      : `${holder.balance} credits`}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-neutral-400">Est. Price:</span>
                  <span className="text-green-300 font-semibold">
                    ${holder.price}/credit
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-4">
                {holder.isPending ? (
                  <>
                    <div className="col-span-2 text-center text-xs text-yellow-300 bg-yellow-500/10 border border-yellow-500/20 rounded-lg px-3 py-2">
                      💡 Once approved, your credits will be available for
                      trading
                    </div>
                  </>
                ) : (
                  <>
                    <button
                      className="bg-white text-black px-3 py-2 rounded-lg text-sm font-medium hover:bg-neutral-200 transition-colors duration-200 cursor-pointer"
                      onClick={() =>
                        alert(`Contact seller at ${holder.address}`)
                      }
                    >
                      Contact Seller
                    </button>
                    <button
                      className="bg-green-500/20 text-green-300 border border-green-500/30 px-3 py-2 rounded-lg text-sm font-medium hover:bg-green-500/30 transition-colors duration-200 cursor-pointer"
                      onClick={() =>
                        alert(
                          `Quick buy from ${holder.address}: ${holder.balance} credits at $${holder.price}/credit`
                        )
                      }
                    >
                      Quick Buy
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-neutral-400 mb-4">
            <svg
              className="w-16 h-16 mx-auto mb-4 opacity-40"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
          </div>
          <p className="text-neutral-400 text-sm font-medium">
            No credits for sale
          </p>
          <p className="text-neutral-500 text-xs mt-2 leading-relaxed">
            Credit holders will appear here when they're ready to trade
          </p>
        </div>
      )}

      <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
        <p className="text-blue-300 text-xs">
          💡 <strong>Coming Soon:</strong> Direct trading, price discovery, and
          automated marketplace features
        </p>
      </div>
    </div>
  );
}
