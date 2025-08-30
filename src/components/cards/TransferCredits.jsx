import { useState, useEffect } from "react";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { useRole } from "../../hooks/useRole.js";
import { ABI, CONTRACT } from "../../lib/abi.js";
import { isAddress } from "viem";

export function TransferCredits({ onTx }) {
  const [toAddress, setToAddress] = useState("");
  const [amount, setAmount] = useState("");
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

  const handleTransfer = () => {
    if (
      !isAddress(toAddress) ||
      !amount ||
      isNaN(amount) ||
      Number(amount) <= 0
    )
      return;

    writeContract({
      address: CONTRACT,
      abi: ABI,
      functionName: "transfer",
      args: [toAddress, BigInt(amount)],
    });
  };

  const isDisabled =
    role === "None" ||
    isPending ||
    isConfirming ||
    !isAddress(toAddress) ||
    !amount ||
    isNaN(amount) ||
    Number(amount) <= 0;

  return (
    <div className="rounded-2xl p-5 bg-white/5 backdrop-blur shadow-lg border border-white/10">
      <h3 className="text-lg font-semibold text-white mb-4">
        Transfer Credits
      </h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-2">
            To Address
          </label>
          <input
            type="text"
            value={toAddress}
            onChange={(e) => setToAddress(e.target.value)}
            placeholder="0x..."
            className="w-full rounded-lg bg-white/10 border border-white/20 px-3 py-2 text-white placeholder-neutral-400 focus:ring-2 focus:ring-white/30 focus:border-transparent"
            disabled={role === "None"}
          />
          {toAddress && !isAddress(toAddress) && (
            <p className="text-red-400 text-sm mt-1">Invalid address format</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-2">
            Amount (H2 Credits)
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount to transfer"
            className="w-full rounded-lg bg-white/10 border border-white/20 px-3 py-2 text-white placeholder-neutral-400 focus:ring-2 focus:ring-white/30 focus:border-transparent"
            disabled={role === "None"}
          />
        </div>

        <button
          onClick={handleTransfer}
          disabled={isDisabled}
          className="w-full bg-white text-black px-4 py-2 rounded-full shadow hover:bg-neutral-200 disabled:opacity-60 font-medium transition-colors"
          title={
            role === "None"
              ? "Connect wallet and get a role to transfer credits"
              : ""
          }
        >
          {isPending || isConfirming ? "Processing..." : "Transfer Credits"}
        </button>

        {role === "None" && (
          <p className="text-neutral-400 text-sm">
            Connect wallet and get a role to transfer credits
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
