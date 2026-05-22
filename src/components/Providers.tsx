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
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#131315",
              color: "#f4f4f7",
              border: "1px solid rgba(212, 175, 55, 0.15)",
              fontFamily: "var(--font-inter)",
              fontSize: "14px",
            },
            success: {
              iconTheme: {
                primary: "#d4af37",
                secondary: "#131315",
              },
            },
          }}
        />
      </PersistGate>
    </Provider>
  );
}
