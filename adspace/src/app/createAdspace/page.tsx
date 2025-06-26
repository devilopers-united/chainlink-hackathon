"use client";
import MintAdSpace from "@/components/MintAdSpace";
import { useWallet } from "@/context/WalletContext";

const MintPage = () => {
  const { provider, account, error, connectWallet, refreshConnection } =
    useWallet();

  return (
    <div className="min-h-screen ">
      <div className="container mx-auto p-6">
        <h1 className="text-4xl font-bold mt-10 text-white text-center mb-10">
          Mint Ad Space
        </h1>
        {error && <p className="text-red-400 text-center mb-6">{error}</p>}
        {!account && (
          <button
            onClick={connectWallet}
            className="block mx-auto mb-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300"
          >
            Connect Wallet
          </button>
        )}
       
        <MintAdSpace provider={provider} />
      </div>
    </div>
  );
};

export default MintPage;
