import { useAccount, useReadContract } from "wagmi";
import { ABI, CONTRACT } from "../lib/abi.js";

const ROLES = {
  0: "None",
  1: "Producer",
  2: "Certifier",
  3: "Buyer",
};

export function useRole() {
  const { address } = useAccount();

  const { data: roleValue, isLoading } = useReadContract({
    address: CONTRACT,
    abi: ABI,
    functionName: "roles",
    args: address ? [address] : undefined,
    enabled: !!address,
  });

  const role = roleValue !== undefined ? ROLES[roleValue] : "None";

  return { role, isLoading };
}
