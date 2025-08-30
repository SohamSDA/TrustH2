import { useState } from "react";
import {
  useWriteContract,
  useWaitForTransactionReceipt,
  useAccount,
} from "wagmi";
import { ABI, CONTRACT } from "../lib/abi.js";
import { useRole } from "../hooks/useRole.js";

const ROLES = {
  0: "None",
  1: "Producer",
  2: "Certifier",
  3: "Buyer",
};

export function RoleSwitcher() {
  const { address } = useAccount();
  const { role } = useRole();
  const [selectedRole, setSelectedRole] = useState("");

  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming } = useWaitForTransactionReceipt({ hash });

  const handleRoleChange = () => {
    if (!selectedRole || !address) return;

    writeContract({
      address: CONTRACT,
      abi: ABI,
      functionName: "setRole",
      args: [address, selectedRole],
    });
  };

  return (
    <div className="fixed top-4 left-4 bg-blue-900/80 backdrop-blur text-white p-4 rounded-lg max-w-xs">
      <h3 className="font-bold text-blue-300 mb-3">
        🎭 Role Switcher (Testing)
      </h3>

      <div className="space-y-3">
        <div>
          <div className="text-xs text-blue-200">Current Role:</div>
          <div className="font-semibold">{role}</div>
        </div>

        <div>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="w-full bg-blue-800 border border-blue-600 rounded px-2 py-1 text-sm"
          >
            <option value="">Select Role</option>
            <option value="1">🏭 Producer</option>
            <option value="2">✅ Certifier</option>
            <option value="3">💰 Buyer</option>
          </select>
        </div>

        <button
          onClick={handleRoleChange}
          disabled={!selectedRole || isPending || isConfirming}
          className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 px-3 py-2 rounded text-sm font-medium transition-colors"
        >
          {isPending || isConfirming ? "Switching..." : "Switch Role"}
        </button>

        <div className="text-xs text-blue-200 leading-relaxed">
          💡 Switch roles to test different workflows!
        </div>
      </div>
    </div>
  );
}
