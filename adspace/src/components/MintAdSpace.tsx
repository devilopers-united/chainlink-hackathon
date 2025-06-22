"use client";
import { useState } from "react";
import { ethers } from "ethers";
import AdSpaceNFT from "../contract/abi/AdSpaceNFT.json";

const MintAdSpace: React.FC<{ provider: ethers.BrowserProvider | null }> = ({
  provider,
}) => {
  const [websiteURL, setWebsiteURL] = useState("");
  const [spaceType, setSpaceType] = useState("");
  const [spaceId, setSpaceId] = useState("");
  const [category, setCategory] = useState("");
  const [height, setHeight] = useState("");
  const [width, setWidth] = useState("");
  const [hourlyRentalRate, setHourlyRentalRate] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tokenURI, setTokenURI] = useState("");
  const [error, setError] = useState<string>("");
  const [txStatus, setTxStatus] = useState<string>("");

  const handleMint = async () => {
    if (!provider) {
      setError("Please connect your wallet.");
      return;
    }
    try {
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        "0x44db140EB12D0d9545CE7BfCcc5daAf328C81A02",
        AdSpaceNFT,
        signer
      );
      const tx = await contract.mintAdSpace(
        websiteURL,
        spaceType,
        spaceId,
        category,
        tokenURI,
        BigInt(height),
        BigInt(width),
        ethers.parseUnits(hourlyRentalRate, 18),
        tags
      );
      setTxStatus("Transaction sent, waiting for confirmation...");
      await tx.wait();
      setTxStatus("Ad space minted successfully!");
      setError("");
      // Reset form
      setWebsiteURL("");
      setSpaceType("");
      setSpaceId("");
      setCategory("");
      setHeight("");
      setWidth("");
      setHourlyRentalRate("");
      setTags([]);
      setTokenURI("");
    } catch (err: any) {
      setError(`Minting failed: ${err.message}`);
      setTxStatus("");
    }
  };

  return (
    <div className="p-4 rounded-lg border border-black bg-white shadow-lg">
      <h3 className="text-black p-4">Mint New Ad Space</h3>
      {error && <p className="text-red-400">{error}</p>}
      {txStatus && <p className="text-green-400">{txStatus}</p>}
      <input
        type="text"
        value={websiteURL}
        onChange={(e) => setWebsiteURL(e.target.value)}
        placeholder="Website URL"
        className="w-full p-2 mb-2 rounded text-black"
      />
      <input
        type="text"
        value={spaceType}
        onChange={(e) => setSpaceType(e.target.value)}
        placeholder="Space Type"
        className="w-full p-2 mb-2 rounded text-black"
      />
      <input
        type="text"
        value={spaceId}
        onChange={(e) => setSpaceId(e.target.value)}
        placeholder="Space ID"
        className="w-full p-2 mb-2 rounded text-black"
      />
      <input
        type="text"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        placeholder="Category"
        className="w-full p-2 mb-2 rounded text-black"
      />
      <input
        type="number"
        value={height}
        onChange={(e) => setHeight(e.target.value)}
        placeholder="Height (px)"
        className="w-full p-2 mb-2 rounded text-black"
      />
      <input
        type="number"
        value={width}
        onChange={(e) => setWidth(e.target.value)}
        placeholder="Width (px)"
        className="w-full p-2 mb-2 rounded text-black"
      />
      <input
        type="number"
        value={hourlyRentalRate}
        onChange={(e) => setHourlyRentalRate(e.target.value)}
        placeholder="Hourly Rental Rate (USD)"
        className="w-full p-2 mb-2 rounded text-black"
      />
      <input
        type="text"
        value={tags.join(",")}
        onChange={(e) => setTags(e.target.value.split(","))}
        placeholder="Tags (comma-separated)"
        className="w-full p-2 mb-2 rounded text-black"
      />
      <input
        type="text"
        value={tokenURI}
        onChange={(e) => setTokenURI(e.target.value)}
        placeholder="Token URI"
        className="w-full p-2 mb-2 rounded text-black"
      />
      <button
        onClick={handleMint}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Mint Ad Space
      </button>
    </div>
  );
};

export default MintAdSpace;
