import { useAccount, useReadContract } from "wagmi";
import { ABI, CONTRACT } from "../lib/abi.js";
import { useRole } from "../hooks/useRole.js";

export function DebugInfo() {
  const { address, isConnected, chainId } = useAccount();
  const { role, isLoading } = useRole();

  const { data: roleValue } = useReadContract({
    address: CONTRACT,
    abi: ABI,
    functionName: "roles",
    args: address ? [address] : undefined,
    enabled: !!address,
  });

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg text-xs font-mono max-w-sm">
      <h3 className="font-bold text-green-400 mb-2">Debug Info</h3>
      <div className="space-y-1">
        <div>Connected: {isConnected ? "✅" : "❌"}</div>
        <div>Chain ID: {chainId || "None"}</div>
        <div>
          Address:{" "}
          {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "None"}
        </div>
        <div>
          Contract:{" "}
          {CONTRACT
            ? `${CONTRACT.slice(0, 6)}...${CONTRACT.slice(-4)}`
            : "❌ Missing"}
        </div>
        <div>Role Loading: {isLoading ? "🔄" : "✅"}</div>
        <div>
          Role Value:{" "}
          {roleValue !== undefined ? roleValue.toString() : "undefined"}
        </div>
        <div>Role Name: {role || "None"}</div>
      </div>
    </div>
  );
}
