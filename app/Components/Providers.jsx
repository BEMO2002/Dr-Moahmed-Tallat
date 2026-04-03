"use client";

import { Toaster } from "react-hot-toast";
import ApiAuthContextProvider from "../../AuthContext";
import SettingsProvider from "../Context/SettingContext";
import { VaultProvider } from "../Context/VaultContext";

export default function Providers({ children, initialSettings }) {
  return (
    <ApiAuthContextProvider>
      <SettingsProvider initialSettings={initialSettings}>
        <VaultProvider>
          {children}
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
    </ApiAuthContextProvider>
  );
}
