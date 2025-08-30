import { useState, useEffect } from "react";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { useRole } from "../../hooks/useRole.js";
import { ABI, CONTRACT } from "../../lib/abi.js";

export function RetireCredits({ onTx }) {
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const { role } = useRole();

  const { writeContract, data: hash, isPending, error } = useWriteContract();

  const { isLoading: isConfirming } = useWaitForTransactionReceipt({
    hash,
  });

  useEffect(() => {
    if (hash) {
      onTx?.(hash);
    }
  }, [hash, onTx]);

  const handleRetire = () => {
    if (!amount || isNaN(amount) || Number(amount) <= 0 || !reason.trim())
      return;

    writeContract({
      address: CONTRACT,
      abi: ABI,
      functionName: "retire",
      args: [BigInt(amount), reason.trim()],
    });
  };

  const isDisabled =
    role === "None" ||
    isPending ||
    isConfirming ||
    !amount ||
    isNaN(amount) ||
    Number(amount) <= 0 ||
    !reason.trim();

  return (
    <div className="rounded-2xl p-5 bg-white/5 backdrop-blur shadow-lg border border-white/10">
      <h3 className="text-lg font-semibold text-white mb-4">Retire Credits</h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-2">
            Amount (H2 Credits)
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount to retire"
            className="w-full rounded-lg bg-white/10 border border-white/20 px-3 py-2 text-white placeholder-neutral-400 focus:ring-2 focus:ring-white/30 focus:border-transparent"
            disabled={role === "None"}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-2">
            Reason
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Reason for retiring credits (e.g., carbon offset, production use)"
            rows={3}
            className="w-full rounded-lg bg-white/10 border border-white/20 px-3 py-2 text-white placeholder-neutral-400 focus:ring-2 focus:ring-white/30 focus:border-transparent resize-none"
            disabled={role === "None"}
          />
        </div>

        <button
          onClick={handleRetire}
          disabled={isDisabled}
          className="w-full bg-white text-black px-4 py-2 rounded-full shadow hover:bg-neutral-200 disabled:opacity-60 font-medium transition-colors"
          title={
            role === "None"
              ? "Connect wallet and get a role to retire credits"
              : ""
          }
        >
          {isPending || isConfirming ? "Processing..." : "Retire Credits"}
        </button>

        {role === "None" && (
          <p className="text-neutral-400 text-sm">
            Connect wallet and get a role to retire credits
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
