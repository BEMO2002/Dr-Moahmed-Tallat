"use client";
import React, { createContext, useState, useEffect } from "react";

export const ApiAuthContext = createContext(0);

export default function ApiAuthContextProvider({ children }) {
  const [baseUrl, setBaseUrl] = useState(
    "https://phplaravel-1599200-6319906.cloudwaysapps.com/api",
  );
  const [token, setToken] = useState(null);

  useEffect(() => {
    const savedToken =
      localStorage.getItem("userToken") || sessionStorage.getItem("userToken");
    if (savedToken) setToken(savedToken);
  }, []);

  return (
    <ApiAuthContext.Provider
      value={{
        baseUrl,
        setBaseUrl,
        token,
        setToken,
      }}
    >
      {children}
    </ApiAuthContext.Provider>
  );
}
