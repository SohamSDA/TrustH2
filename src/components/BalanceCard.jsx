import { useAccount, useReadContract } from "wagmi";
import { ABI, CONTRACT } from "../lib/abi.js";

export function BalanceCard() {
  const { address } = useAccount();

  const { data: balance, isLoading } = useReadContract({
    address: CONTRACT,
    abi: ABI,
    functionName: "balance",
    args: address ? [address] : undefined,
    enabled: !!address,
  });

  const copyToClipboard = () => {
    navigator.clipboard.writeText(CONTRACT);
  };

  return (
    <div className="rounded-2xl p-5 bg-white/5 backdrop-blur shadow-lg border border-white/10">
      <h3 className="text-lg font-semibold text-white mb-4">Your Balance</h3>

      <div className="text-3xl font-bold text-white mb-4">
        {isLoading ? (
          <div className="animate-pulse bg-white/10 rounded h-10 w-32"></div>
        ) : (
          <span>{balance ? balance.toString() : "0"} H2 Credits</span>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <button
          onClick={copyToClipboard}
          className="bg-white text-black px-4 py-2 rounded-full shadow hover:bg-neutral-200 disabled:opacity-60 text-sm transition-colors"
        >
          Copy Contract
        </button>
        <a
          href={`https://amoy.polygonscan.com/address/${CONTRACT}`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white/10 text-white px-4 py-2 rounded-full border border-white/20 hover:bg-white/20 text-sm transition-colors text-center"
        >
          View on Polygonscan
        </a>
      </div>
    </div>
  );
}
