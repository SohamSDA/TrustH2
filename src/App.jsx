import { useState } from "react";
import { Providers } from "./wagmi.jsx";
import { Header } from "./components/Header.jsx";
import { NetworkBanner } from "./components/NetworkBanner.jsx";
import { BalanceCard } from "./components/BalanceCard.jsx";
import { ProducerRequestMint } from "./components/cards/ProducerRequestMint.jsx";
import { CertifierApprove } from "./components/cards/CertifierApprove.jsx";
import { TransferCredits } from "./components/cards/TransferCredits.jsx";
import { RetireCredits } from "./components/cards/RetireCredits.jsx";
import { useToast, ToastContainer } from "./components/Toast.jsx";

function AppContent() {
  const [lastTx, setLastTx] = useState(null);
  const { toasts, addToast, removeToast } = useToast();

  const handleTx = (hash) => {
    setLastTx(hash);
    addToast("Transaction submitted!", "info");
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <NetworkBanner />
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <BalanceCard />
          <ProducerRequestMint onTx={handleTx} />
          <CertifierApprove onTx={handleTx} />
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
    </div>
  );
}

function App() {
  return (
    <Providers>
      <AppContent />
    </Providers>
  );
}

export default App;
