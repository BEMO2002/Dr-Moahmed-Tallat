"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { accessVault } from "../lib/server-api";

const VaultContext = createContext();

export const VaultProvider = ({ children }) => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [vaultData, setVaultData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);

  // Load from sessionStorage on mount
  useEffect(() => {
    const savedData = sessionStorage.getItem("vault_data");
    const unlocked = sessionStorage.getItem("vault_unlocked");
    if (unlocked === "true" && savedData) {
      setIsUnlocked(true);
      setVaultData(JSON.parse(savedData));
    }
    setIsInitializing(false);
  }, []);

  const unlock = async (password) => {
    setLoading(true);
    setError(null);
    try {
      const result = await accessVault(password);
      if (result.success) {
        setIsUnlocked(true);
        setVaultData(result.data);
        sessionStorage.setItem("vault_unlocked", "true");
        sessionStorage.setItem("vault_data", JSON.stringify(result.data));
        setLoading(false);
        return { success: true, message: result.message };
      } else {
        setError(result.message);
        setLoading(false);
        return { success: false, message: result.message };
      }
    } catch (err) {
      setError("An unexpected error occurred");
      setLoading(false);
      return { success: false, message: "An unexpected error occurred" };
    }
  };

  const lock = () => {
    setIsUnlocked(false);
    setVaultData(null);
    sessionStorage.removeItem("vault_unlocked");
    sessionStorage.removeItem("vault_data");
  };

  return (
    <VaultContext.Provider
      value={{ isUnlocked, vaultData, loading, error, unlock, lock, isInitializing }}
    >
      {children}
    </VaultContext.Provider>
  );
};

export const useVault = () => {
  const context = useContext(VaultContext);
  if (!context) {
    throw new Error("useVault must be used within a VaultProvider");
  }
  return context;
};
