import { useState, useEffect } from "react";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { useRole } from "../../hooks/useRole.js";
import { ABI, CONTRACT } from "../../lib/abi.js";

export function ProducerRequestMint({ onTx }) {
  const [amount, setAmount] = useState("");
  const [certificateCID, setCertificateCID] = useState("");
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

  const handleRequestMint = () => {
    if (!amount || isNaN(amount) || Number(amount) <= 0) return;

    // Use placeholder hash for now, will implement CID later
    const certHash = certificateCID || "0x" + "0".repeat(64);

    writeContract({
      address: CONTRACT,
      abi: ABI,
      functionName: "requestMint",
      args: [certHash, BigInt(amount)],
    });
  };

  const isDisabled =
    role !== "Producer" ||
    isPending ||
    isConfirming ||
    !amount ||
    isNaN(amount) ||
    Number(amount) <= 0;

  return (
    <div className="rounded-2xl p-5 bg-white/5 backdrop-blur shadow-lg border border-white/10">
      <h3 className="text-lg font-semibold text-white mb-4">Request Mint</h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-2">
            Amount (H2 Credits)
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount to mint"
            className="w-full rounded-lg bg-white/10 border border-white/20 px-3 py-2 text-white placeholder-neutral-400 focus:ring-2 focus:ring-white/30 focus:border-transparent"
            disabled={role !== "Producer"}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-2">
            Certificate CID (optional)
          </label>
          <input
            type="text"
            value={certificateCID}
            onChange={(e) => setCertificateCID(e.target.value)}
            placeholder="IPFS CID for certificate"
            className="w-full rounded-lg bg-white/10 border border-white/20 px-3 py-2 text-white placeholder-neutral-400 focus:ring-2 focus:ring-white/30 focus:border-transparent"
            disabled={role !== "Producer"}
          />
        </div>

        <button
          onClick={handleRequestMint}
          disabled={isDisabled}
          className="w-full bg-white text-black px-4 py-2 rounded-full shadow hover:bg-neutral-200 disabled:opacity-60 font-medium transition-colors"
          title={role !== "Producer" ? "Only Producers can request mints" : ""}
        >
          {isPending || isConfirming ? "Processing..." : "Request Mint"}
        </button>

        {role !== "Producer" && (
          <p className="text-neutral-400 text-sm">
            Only Producers can request mints
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
