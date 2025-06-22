"use client";
import { ethers } from "ethers";
import { useState, useEffect } from "react";
import { useWallet } from "@/context/WalletContext";

declare global {
  interface Window {
    ethereum?: any;
  }
}

const ConnectWallet: React.FC = () => {
  const { provider, account, setProvider, setAccount } = useWallet();
  const [error, setError] = useState<string>("");

  const connect = async () => {
    if (typeof window.ethereum === "undefined") {
      setError("Please install MetaMask.");
      return;
    }
    try {
      const newProvider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await newProvider.send("eth_requestAccounts", []);
      setProvider(newProvider);
      setAccount(accounts[0]);
      setError("");
    } catch (err: any) {
      setError(`Connection failed: ${err.message}`);
    }
  };

  useEffect(() => {
    if (!account && typeof window.ethereum !== "undefined" && !provider) {
      connect();
    }
  }, [account, provider]);

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts: string[]) => {
        setAccount(accounts[0] || null);
        if (!accounts[0]) setProvider(null);
      });
    }
  }, []);

  return (
    <div className="mb-0 text-center">
      {account ? (
        <p className="text-green-400">
          Connected: {account.slice(0, 6)}...{account.slice(-4)}
        </p>
      ) : (
        <button
          onClick={connect}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Connect Wallet
        </button>
      )}
      {error && <p className="text-red-400 mt-3">{error}</p>}
    </div>
  );
};

export default ConnectWallet;
