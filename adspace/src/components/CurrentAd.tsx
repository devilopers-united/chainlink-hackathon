// src/components/CurrentAd.tsx
"use client";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import AdSpaceNFT from "../contract/abi/AdSpaceNFT.json";

const CurrentAd: React.FC<{
  provider: ethers.BrowserProvider | null;
  tokenId: number;
}> = ({ provider, tokenId }) => {
  const [adUri, setAdUri] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchAd = async () => {
      if (!provider) {
        setError("Please connect your wallet.");
        return;
      }
      try {
        const contract = new ethers.Contract(
          "0x44db140EB12D0d9545CE7BfCcc5daAf328C81A02",
          AdSpaceNFT,
          provider
        );
        const uri = await contract.getCurrentAd(tokenId);
        setAdUri(uri);
        setError("");
      } catch (err: any) {
        setError(`Failed to fetch current ad: ${err.message}`);
      }
    };
    fetchAd();
  }, [provider, tokenId]);

  if (error) return <p className="text-red-400">{error}</p>;
  if (!adUri || adUri === "No Active Ad")
    return <p className="text-gray-400">No active ad</p>;

  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <h3 className="text-white">Current Ad</h3>
      <p>
        <strong>Metadata URI:</strong> {adUri}
      </p>
    </div>
  );
};

export default CurrentAd;
