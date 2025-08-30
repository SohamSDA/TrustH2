import { useChainId, useSwitchChain } from "wagmi";
import { polygonAmoy } from "wagmi/chains";

export function NetworkBanner() {
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();

  if (chainId === polygonAmoy.id) {
    return null;
  }

  return (
    <div className="bg-red-600 border-b border-red-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center">
            <span className="text-white font-medium">
              Wrong network - Please switch to Polygon Amoy testnet
            </span>
          </div>
          <button
            onClick={() => switchChain({ chainId: polygonAmoy.id })}
            className="bg-white text-red-600 px-4 py-1 rounded-full text-sm font-medium hover:bg-red-50 transition-colors"
          >
            Switch to Amoy
          </button>
        </div>
      </div>
    </div>
  );
}
