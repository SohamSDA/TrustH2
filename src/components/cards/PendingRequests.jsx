import { useState, useEffect } from "react";
import { useReadContract, useBlockNumber } from "wagmi";
import { ABI, CONTRACT } from "../../lib/abi.js";
import { useRole } from "../../hooks/useRole.js";
import { formatUnits } from "viem";
import { usePublicClient } from "wagmi";

export function PendingRequests({ onSelectRequest }) {
  const { role } = useRole();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const publicClient = usePublicClient();

  // Get total number of requests
  const {
    data: requestCount,
    isLoading: countLoading,
    refetch,
  } = useReadContract({
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

  // Fetch all requests when count changes
  useEffect(() => {
    if (requestCount && CONTRACT && Number(requestCount) > 0) {
      fetchAllRequests();
    } else if (requestCount && Number(requestCount) === 0) {
      setRequests([]);
    }
  }, [requestCount, publicClient]);

  const fetchAllRequests = async () => {
    if (!publicClient || !requestCount) return;

    setLoading(true);
    try {
      const count = Number(requestCount);
      const allRequests = [];

      // Fetch each request individually
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
            allRequests.push({
              id: i,
              producer,
              certHash,
              amount: formatUnits(amount, 18),
              approved,
            });
          }
        } catch (error) {
          console.error(`Error fetching request ${i}:`, error);
        }
      }

      setRequests(allRequests);
    } catch (error) {
      console.error("Error fetching requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveClick = (requestId) => {
    if (onSelectRequest) {
      onSelectRequest(requestId);
    }
  };

  const pendingRequests = requests.filter((req) => !req.approved);

  if (role !== "Certifier") {
    return null;
  }

  return (
    <div className="rounded-2xl p-5 bg-white/5 backdrop-blur shadow-lg border border-white/10">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Pending Requests</h3>
        <span className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full font-medium">
          {pendingRequests.length} pending
        </span>
      </div>

      {countLoading || loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white/60"></div>
          <span className="ml-3 text-neutral-300 text-sm">
            Loading requests...
          </span>
        </div>
      ) : pendingRequests.length > 0 ? (
        <div className="space-y-3 max-h-80 overflow-y-auto">
          {pendingRequests.map((request) => (
            <div
              key={request.id}
              className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-white">
                  Request #{request.id}
                </span>
                <span className="px-2 py-1 bg-yellow-500/20 text-yellow-300 text-xs rounded-full font-medium">
                  Awaiting Approval
                </span>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-neutral-400">Producer:</span>
                  <span className="text-white font-mono text-xs tracking-tight">
                    {request.producer.slice(0, 6)}...
                    {request.producer.slice(-4)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-neutral-400">Credits:</span>
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
              </div>

              <button
                onClick={() => handleApproveClick(request.id)}
                className="w-full mt-4 bg-white text-black px-4 py-2 rounded-lg text-sm font-medium hover:bg-neutral-200 transition-colors duration-200 shadow-sm"
              >
                Select for Approval
              </button>
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
            No pending requests
          </p>
          <p className="text-neutral-500 text-xs mt-2 leading-relaxed">
            New mint requests from producers will appear here for your review
          </p>
        </div>
      )}
    </div>
  );
}
