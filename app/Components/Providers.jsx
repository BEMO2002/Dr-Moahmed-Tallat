"use client";

import { Toaster } from "react-hot-toast";
import SettingsProvider from "../Context/SettingContext";
import { VaultProvider } from "../Context/VaultContext";
import { useContentProtection } from "@/hooks/useContentProtection";

export default function Providers({ children, initialSettings }) {
  const { isDevToolsOpen } = useContentProtection();

  return (
    <SettingsProvider initialSettings={initialSettings}>
      <VaultProvider>
        <div
          className={`transition-all duration-300 w-full min-h-screen ${isDevToolsOpen ? "blur-md pointer-events-none select-none" : ""}`}
        >
          {isDevToolsOpen && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/50 backdrop-blur-xl">
              <div className="text-center p-8 bg-white border border-red-100 shadow-2xl rounded-2xl">
                <h2 className="text-2xl text-red-600 font-bold mb-2">
                  Security Alert
                </h2>
                <p className="text-gray-600 font-bold">
                  Please close Developer Tools to continue browsing.
                </p>
              </div>
            </div>
          )}
          {children}
        </div>
      </VaultProvider>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#363636",
            color: "#fff",
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: "#4ade80",
              secondary: "#fff",
            },
          },
          error: {
            duration: 5000,
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
            },
          },
        }}
      />
    </SettingsProvider>
  );
}
