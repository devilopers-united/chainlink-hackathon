"use client";
import MintAdSpace from "@/components/MintAdSpace";
import { useWallet } from "@/context/WalletContext";

const MintPage = () => {
  const { provider } = useWallet();

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto p-6">
        <h1 className="text-4xl font-bold text-white text-center mb-10">
          Mint Ad Space
        </h1>
        <MintAdSpace provider={provider} />
      </div>
    </div>
  );
};

export default MintPage;
