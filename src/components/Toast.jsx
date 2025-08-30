import { useState, useEffect } from "react";
import { useWaitForTransactionReceipt } from "wagmi";

export function useToast() {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 5000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return { toasts, addToast, removeToast };
}

export function ToastContainer({ toasts, onRemove }) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`px-4 py-3 rounded-lg shadow-lg backdrop-blur border max-w-sm ${
            toast.type === "success"
              ? "bg-green-600/90 border-green-500"
              : toast.type === "error"
              ? "bg-red-600/90 border-red-500"
              : "bg-blue-600/90 border-blue-500"
          }`}
        >
          <div className="flex items-center justify-between">
            <p className="text-white text-sm font-medium">{toast.message}</p>
            <button
              onClick={() => onRemove(toast.id)}
              className="ml-3 text-white/80 hover:text-white"
            >
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
