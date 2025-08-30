import { useState } from "react";
import { Providers } from "./wagmi.jsx";
import { Header } from "./components/Header.jsx";
import { NetworkBanner } from "./components/NetworkBanner.jsx";
import { BalanceCard } from "./components/BalanceCard.jsx";
import { ProducerRequestMint } from "./components/cards/ProducerRequestMint.jsx";
import { CertifierApprove } from "./components/cards/CertifierApprove.jsx";
import { PendingRequests } from "./components/cards/PendingRequests.jsx";
import { RequestHistory } from "./components/cards/RequestHistory.jsx";
import { CreditsMarketplace } from "./components/cards/CreditsMarketplace.jsx";
import { TransferCredits } from "./components/cards/TransferCredits.jsx";
import { RetireCredits } from "./components/cards/RetireCredits.jsx";
import { useToast, ToastContainer } from "./components/Toast.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import { DebugInfo } from "./components/DebugInfo.jsx";
import { RoleSwitcher } from "./components/RoleSwitcher.jsx";

function AppContent() {
  const [lastTx, setLastTx] = useState(null);
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const { toasts, addToast, removeToast } = useToast();

  const handleTx = (hash) => {
    setLastTx(hash);
    addToast("Transaction submitted!", "info");
  };

  const handleSelectRequest = (requestId) => {
    setSelectedRequestId(requestId);
  };

  const handleClearSelection = () => {
    setSelectedRequestId(null);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <NetworkBanner />
      <Header />
      <RoleSwitcher />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <BalanceCard />
          <PendingRequests onSelectRequest={handleSelectRequest} />
          <RequestHistory />
          <ProducerRequestMint onTx={handleTx} />
          <CertifierApprove
            onTx={handleTx}
            selectedRequestId={selectedRequestId}
            onClearSelection={handleClearSelection}
          />
          <CreditsMarketplace />
          <TransferCredits onTx={handleTx} />
          <RetireCredits onTx={handleTx} />
        </div>

        {lastTx && (
          <div className="mt-8 p-4 bg-white/5 rounded-lg border border-white/10">
            <p className="text-sm text-neutral-300 mb-2">Last Transaction:</p>
            <a
              href={`https://amoy.polygonscan.com/tx/${lastTx}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 font-mono text-sm break-all"
            >
              {lastTx} →
            </a>
          </div>
        )}
      </main>

      <ToastContainer toasts={toasts} onRemove={removeToast} />
      <DebugInfo />
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <Providers>
        <AppContent />
      </Providers>
    </ErrorBoundary>
  );
}

export default App;
