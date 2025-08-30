import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useRole } from "../hooks/useRole.js";
import { CONTRACT } from "../lib/abi.js";

const roleColors = {
  None: "bg-gray-600",
  Producer: "bg-green-600",
  Certifier: "bg-blue-600",
  Buyer: "bg-purple-600",
};

export function Header() {
  const { role } = useRole();

  return (
    <header className="border-b border-white/10 bg-neutral-950/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left - App Title */}
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-white tracking-tight">
              TrustH2
            </h1>
          </div>

          {/* Center - Role Badge */}
          <div className="flex items-center">
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium text-white ${
                roleColors[role] || roleColors.None
              }`}
            >
              {role}
            </span>
          </div>

          {/* Right - Connect Button & Contract Link */}
          <div className="flex items-center space-x-4">
            <a
              href={`https://amoy.polygonscan.com/address/${CONTRACT}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-400 hover:text-white text-sm transition-colors"
            >
              View Contract
            </a>
            <ConnectButton />
          </div>
        </div>
      </div>
    </header>
  );
}
