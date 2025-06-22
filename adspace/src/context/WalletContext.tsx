"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { ethers } from "ethers";

const WalletContext = createContext<
  | {
      provider: ethers.BrowserProvider | null;
      account: string | null;
      setProvider: (provider: ethers.BrowserProvider | null) => void;
      setAccount: (account: string | null) => void;
    }
  | undefined
>(undefined);

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [account, setAccount] = useState<string | null>(null);

  useEffect(() => {
    const checkConnection = async () => {
      if (typeof window.ethereum !== "undefined") {
        const newProvider = new ethers.BrowserProvider(window.ethereum);
        try {
          const accounts = await newProvider.send("eth_requestAccounts", []);
          if (accounts.length > 0) {
            setProvider(newProvider);
            setAccount(accounts[0]);
          }
        } catch (err) {
          console.error("Auto-connect failed:", err);
        }
      }
    };
    checkConnection();

    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts: string[]) => {
        setAccount(accounts[0] || null);
        if (!accounts[0]) setProvider(null);
      });
    }
  }, []);

  return (
    <WalletContext.Provider
      value={{ provider, account, setProvider, setAccount }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context)
    throw new Error("useWallet must be used within a WalletProvider");
  return context;
};
