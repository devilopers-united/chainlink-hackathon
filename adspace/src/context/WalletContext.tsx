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
      error: string | null;
      connectWallet: () => Promise<void>;
      refreshConnection: () => Promise<void>;
      setProvider: (provider: ethers.BrowserProvider | null) => void;
      setAccount: (account: string | null) => void;
      setError: (error: string | null) => void;
    }
  | undefined
>(undefined);

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkConnection = async () => {
      if (typeof window.ethereum !== "undefined") {
        const newProvider = new ethers.BrowserProvider(window.ethereum);
        try {
          const accounts = await newProvider.send("eth_requestAccounts", []);
          if (accounts.length > 0) {
            setProvider(newProvider);
            const address = accounts[0];
            setAccount(address);
          } else {
            console.log("No accounts found, wallet not connected.");
          }
        } catch (err) {
          console.error("Auto-connect failed:", err);
          setError("Auto-connect failed. Please try connecting manually.");
        }
      } else {
        console.log("No Ethereum wallet detected.");
        setError("No Ethereum wallet detected. Please install MetaMask.");
      }
    };
    checkConnection();
  }, []);

  useEffect(() => {
    if (window.ethereum) {
      const handleAccountsChanged = async (accounts: string[]) => {
        if (accounts.length > 0) {
          if (provider) {
            const address = accounts[0];
            setAccount(address);
          }
        } else {
          setAccount(null);
          setProvider(null);
        }
        console.log("Accounts changed, new account:", accounts[0] || "None");
      };

      window.ethereum.on("accountsChanged", handleAccountsChanged);
      window.ethereum.on("chainChanged", () => {
        setProvider(null);
        setAccount(null);
        console.log("Chain changed, resetting connection.");
      });

      return () => {
        window.ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged
        );
      };
    }
  }, [provider]);

  const connectWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        setError(null);
        const newProvider = new ethers.BrowserProvider(window.ethereum);
        await newProvider.send("eth_requestAccounts", []);
        const accounts = await newProvider.listAccounts();
        if (accounts.length > 0) {
          setProvider(newProvider);
          const address = await accounts[0].getAddress();
          setAccount(address);
          console.log("Wallet connected, account:", accounts[0]);
        } else {
          setError("No accounts found after connection attempt.");
        }
      } catch (err) {
        console.error("Wallet connection failed:", err);
        setError("Failed to connect wallet. Please check MetaMask.");
      }
    } else {
      setError("No Ethereum wallet detected. Please install MetaMask.");
    }
  };

  const refreshConnection = async () => {
    if (provider) {
      try {
        const accounts = await provider.listAccounts();
        if (accounts.length > 0) {
          const address = await accounts[0].getAddress();
          setAccount(address);
          console.log("Connection refreshed, account:", address);
        } else {
          setAccount(null);
          setProvider(null);
          setError("No accounts found on refresh.");
        }
      } catch (err) {
        console.error("Refresh failed:", err);
        setError("Failed to refresh connection.");
      }
    }
  };

  return (
    <WalletContext.Provider
      value={{
        provider,
        account,
        error,
        connectWallet,
        refreshConnection,
        setProvider,
        setAccount,
        setError,
      }}
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
