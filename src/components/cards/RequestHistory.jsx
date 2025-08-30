import { useState, useEffect } from "react";
import { useReadContract, useBlockNumber, useAccount } from "wagmi";
import { ABI, CONTRACT } from "../../lib/abi.js";
import { useRole } from "../../hooks/useRole.js";
import { formatUnits } from "viem";
import { usePublicClient } from "wagmi";

export function RequestHistory() {
  const { role } = useRole();
  const { address } = useAccount();
  const [myRequests, setMyRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const publicClient = usePublicClient();

  // Get total number of requests
  const { data: requestCount, refetch } = useReadContract({
    address: CONTRACT,
    abi: ABI,
    functionName: "getRequestsCount",
  });

  // Listen for new blocks to refresh data
  const { data: blockNumber } = useBlockNumber({ watch: true });

  useEffect(() => {
    if (blockNumber) {
      refetch();
    }
  }, [blockNumber, refetch]);

  // Fetch requests when count changes
  useEffect(() => {
    if (requestCount && CONTRACT && address && Number(requestCount) > 0) {
      fetchMyRequests();
    } else {
      setMyRequests([]);
    }
  }, [requestCount, address, publicClient]);

  const fetchMyRequests = async () => {
    if (!publicClient || !address) return;

    setLoading(true);
    try {
      const count = Number(requestCount);
      const myRequestsData = [];

      // Fetch each request and filter by producer address
      for (let i = 0; i < count; i++) {
        try {
          const requestData = await publicClient.readContract({
            address: CONTRACT,
            abi: ABI,
            functionName: "requests",
            args: [i],
          });

          if (requestData) {
            const [producer, certHash, amount, approved] = requestData;

            // Only include requests from the current user
            if (producer.toLowerCase() === address.toLowerCase()) {
              myRequestsData.push({
                id: i,
                producer,
                certHash,
                amount: formatUnits(amount, 18),
                approved,
                status: approved ? "Approved & Minted" : "Pending Review",
              });
            }
          }
        } catch (error) {
          console.error(`Error fetching request ${i}:`, error);
        }
      }

      // Sort by ID (newest first)
      myRequestsData.sort((a, b) => b.id - a.id);
      setMyRequests(myRequestsData);
    } catch (error) {
      console.error("Error fetching my requests:", error);
    } finally {
      setLoading(false);
    }
  };

  if (role !== "Producer" || !address) {
    return null;
  }

  return (
    <div className="rounded-2xl p-5 bg-white/5 backdrop-blur shadow-lg border border-white/10">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">My Requests</h3>
        <span className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full font-medium">
          {myRequests.length} total
        </span>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white/60"></div>
          <span className="ml-3 text-neutral-300 text-sm">
            Loading your requests...
          </span>
        </div>
      ) : myRequests.length > 0 ? (
        <div className="space-y-3 max-h-80 overflow-y-auto">
          {myRequests.map((request) => (
            <div
              key={request.id}
              className="bg-white/5 rounded-xl p-4 border border-white/10"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-white">
                  Request #{request.id}
                </span>
                <span
                  className={`px-2 py-1 text-xs rounded-full font-medium ${
                    request.approved
                      ? "bg-green-500/20 text-green-300"
                      : "bg-yellow-500/20 text-yellow-300"
                  }`}
                >
                  {request.status}
                </span>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-neutral-400">Credits Requested:</span>
                  <span className="text-white font-semibold">
                    {parseFloat(request.amount).toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-neutral-400">Certificate:</span>
                  <span className="text-white font-mono text-xs tracking-tight">
                    {request.certHash.slice(0, 8)}...
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-neutral-400">Status:</span>
                  <span
                    className={`font-medium text-xs ${
                      request.approved ? "text-green-300" : "text-yellow-300"
                    }`}
                  >
                    {request.approved
                      ? "✅ Credits Minted"
                      : "⏳ Awaiting Certifier"}
                  </span>
                </div>
              </div>

              {!request.approved && (
                <div className="mt-3 p-2 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                  <p className="text-yellow-300 text-xs">
                    💡 Your request is being reviewed by a certifier
                  </p>
                </div>
              )}
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
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <p className="text-neutral-400 text-sm font-medium">
            No requests yet
          </p>
          <p className="text-neutral-500 text-xs mt-2 leading-relaxed">
            Submit your first mint request using the card below
          </p>
        </div>
      )}
    </div>
  );
}
