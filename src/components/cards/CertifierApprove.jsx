import { useState, useEffect } from "react";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { useRole } from "../../hooks/useRole.js";
import { ABI, CONTRACT } from "../../lib/abi.js";

export function CertifierApprove({
  onTx,
  selectedRequestId,
  onClearSelection,
}) {
  const [requestId, setRequestId] = useState("");
  const { role } = useRole();

  const { writeContract, data: hash, isPending, error } = useWriteContract();

  const { isLoading: isConfirming } = useWaitForTransactionReceipt({
    hash,
  });

  // Update local state when a request is selected from PendingRequests
  useEffect(() => {
    if (selectedRequestId !== undefined && selectedRequestId !== null) {
      setRequestId(selectedRequestId.toString());
    }
  }, [selectedRequestId]);

  useEffect(() => {
    if (hash) {
      onTx?.(hash);
      // Clear the selection after successful transaction
      if (onClearSelection) {
        onClearSelection();
      }
      setRequestId("");
    }
  }, [hash, onTx, onClearSelection]);

  const handleApprove = () => {
    if (!requestId || isNaN(requestId) || Number(requestId) < 0) return;

    writeContract({
      address: CONTRACT,
      abi: ABI,
      functionName: "approveAndMint",
      args: [BigInt(requestId)],
    });
  };

  const handleClearSelection = () => {
    setRequestId("");
    if (onClearSelection) {
      onClearSelection();
    }
  };

  const isDisabled =
    role !== "Certifier" ||
    isPending ||
    isConfirming ||
    !requestId ||
    isNaN(requestId) ||
    Number(requestId) < 0;

  return (
    <div className="rounded-2xl p-5 bg-white/5 backdrop-blur shadow-lg border border-white/10">
      <h3 className="text-lg font-semibold text-white mb-4">
        Approve & Mint Credits
      </h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-2">
            Request ID
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              value={requestId}
              onChange={(e) => setRequestId(e.target.value)}
              placeholder="Enter request ID or select from above"
              className="flex-1 rounded-lg bg-white/10 border border-white/20 px-3 py-2 text-white placeholder-neutral-400 focus:ring-2 focus:ring-white/30 focus:border-transparent text-sm"
              disabled={role !== "Certifier"}
            />
            {requestId && (
              <button
                onClick={handleClearSelection}
                className="px-3 py-2 bg-neutral-600 hover:bg-neutral-500 text-white rounded-lg transition-colors text-sm"
                title="Clear selection"
              >
                ✕
              </button>
            )}
          </div>
          {selectedRequestId !== undefined && selectedRequestId !== null && (
            <p className="text-xs text-blue-300 mt-1">
              ✓ Selected from pending requests list
            </p>
          )}
        </div>

        <button
          onClick={handleApprove}
          disabled={isDisabled}
          className="w-full bg-white text-black px-4 py-2 rounded-full shadow hover:bg-neutral-200 disabled:opacity-60 font-medium transition-colors"
          title={
            role !== "Certifier" ? "Only Certifiers can approve requests" : ""
          }
        >
          {isPending || isConfirming
            ? "Processing..."
            : "Approve & Mint Credits"}
        </button>

        {role !== "Certifier" && (
          <p className="text-neutral-400 text-sm">
            Only Certifiers can approve mint requests
          </p>
        )}

        {error && (
          <p className="text-red-400 text-sm">
            Error: {error.shortMessage || error.message}
          </p>
        )}
      </div>
    </div>
  );
}
