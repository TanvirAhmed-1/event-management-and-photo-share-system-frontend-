"use client";

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "@/redux/store";
import { Toaster } from "react-hot-toast";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate loading={
        <div className="min-h-screen bg-[#060608] flex items-center justify-center">
          <div className="relative flex flex-col items-center">
            <div className="w-16 h-16 rounded-full border-2 border-[#d4af37]/20 border-t-[#d4af37] animate-spin"></div>
            <p className="mt-4 font-heading text-xs uppercase tracking-widest text-[#d4af37]/60">Initializing Finder...</p>
          </div>
        </div>
      } persistor={persistor}>
        {children}
        <Toaster
          position="top-center"
          containerStyle={{ top: 20 }}
          toastOptions={{
            duration: 3500,
            style: {
              background: "#17123B",
              color: "#ffffff",
              border: "1px solid rgba(124, 58, 237, 0.35)",
              borderRadius: "14px",
              fontSize: "13px",
              fontWeight: 600,
              boxShadow: "0 12px 30px -8px rgba(23, 18, 59, 0.35)",
            },
            success: {
              iconTheme: {
                primary: "#A78BFA",
                secondary: "#17123B",
              },
            },
          }}
        />
      </PersistGate>
    </Provider>
  );
}
