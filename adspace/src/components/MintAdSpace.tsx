"use client";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import AdSpaceNFT from "../contract/abi/AdSpaceNFT.json";
import { useWallet } from "@/context/WalletContext";

const MintAdSpace: React.FC<{ provider: ethers.BrowserProvider | null }> = ({
  provider,
}) => {
  const { account, refreshConnection } = useWallet();
  const [websiteURL, setWebsiteURL] = useState("");
  const [spaceType, setSpaceType] = useState("");
  const [spaceId, setSpaceId] = useState("");
  const [category, setCategory] = useState("");
  const [height, setHeight] = useState("");
  const [width, setWidth] = useState("");
  const [hourlyRentalRate, setHourlyRentalRate] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [imageIpfsHash, setImageIpfsHash] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [txStatus, setTxStatus] = useState<string>("");

  useEffect(() => {
    if (account && account !== "Not connected") {
      console.log("Account updated in MintAdSpace:", account);
    }
  }, [account]);

  const uploadToIPFS = async (file: File): Promise<string | null> => {
    try {
      const apiKey = process.env.NEXT_PUBLIC_PINATA_API_KEY;
      const apiSecret = process.env.NEXT_PUBLIC_PINATA_API_SECRET;
      if (!apiKey || !apiSecret) {
        console.error("Pinata API Key or Secret is not set");
        return null;
      }
      const formData = new FormData();
      formData.append("file", file);
      const pinataMetadata = JSON.stringify({ name: file.name });
      formData.append("pinataMetadata", pinataMetadata);
      const pinataOptions = JSON.stringify({ cidVersion: 0 });
      formData.append("pinataOptions", pinataOptions);
      const res = await axios.post(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        formData,
        {
          headers: {
            pinata_api_key: apiKey,
            pinata_secret_api_key: apiSecret,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Pinata upload response:", res.data);
      return `https://lime-acceptable-dog-270.mypinata.cloud/ipfs/${res.data.IpfsHash}`;
    } catch (error: any) {
      console.error("Error uploading to IPFS:", error);
      return null;
    }
  };

  const createMetadataJson = async (): Promise<string | null> => {
    if (!imageIpfsHash) return null;
    const metadata = {
      name: `AdSpace #${Math.floor(Math.random() * 1000)} - ${
        websiteURL.split("/")[2] || "Unknown"
      }`,
      description: `This NFT represents a rentable banner space on ${websiteURL}, a platform for running ads.`,
      image: imageIpfsHash,
      external_url: `https://ads-protocol.io/adspace/${Math.floor(
        Math.random() * 1000
      )}`,
      attributes: [
        { trait_type: "Website", value: websiteURL },
        { trait_type: "Space Type", value: spaceType },
        { trait_type: "Category", value: category },
        { trait_type: "Ad Space ID", value: spaceId },
        { trait_type: "Height", value: parseInt(height) || 0 },
        { trait_type: "Width", value: parseInt(width) || 0 },
        {
          trait_type: "Hourly Rate (USD)",
          value: parseFloat(hourlyRentalRate) || 0,
        },
        { trait_type: "Tags", value: tags.join(", ") },
      ],
    };
    try {
      const apiKey = process.env.NEXT_PUBLIC_PINATA_API_KEY;
      const apiSecret = process.env.NEXT_PUBLIC_PINATA_API_SECRET;
      if (!apiKey || !apiSecret) {
        console.error("Pinata API Key or Secret is not set");
        return null;
      }
      const res = await axios.post(
        "https://api.pinata.cloud/pinning/pinJSONToIPFS",
        metadata,
        {
          headers: {
            pinata_api_key: apiKey,
            pinata_secret_api_key: apiSecret,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Pinata JSON upload response:", res.data);
      return `https://lime-acceptable-dog-270.mypinata.cloud/ipfs/${res.data.IpfsHash}`;
    } catch (error: any) {
      console.error("Error uploading metadata JSON to IPFS:", error);
      return null;
    }
  };

  const onDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const imageUrl = await uploadToIPFS(acceptedFiles[0]);
      if (imageUrl) {
        setImageIpfsHash(imageUrl);
        console.log("Image uploaded to IPFS, URL:", imageUrl);
      }
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpg", ".jpeg", ".png", ".gif"] },
    multiple: false,
  });

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
      const tokenURI = await createMetadataJson();
      if (!tokenURI) throw new Error("Failed to generate token URI");
      const tx = await contract.mintAdSpace(
        websiteURL,
        spaceType,
        spaceId,
        category,
        tokenURI,
        BigInt(height || 0),
        BigInt(width || 0),
        ethers.parseUnits(hourlyRentalRate || "0", 18),
        tags
      );
      setTxStatus("Transaction sent, waiting for confirmation...");
      await tx.wait();
      setTxStatus("Ad space minted successfully!");
      setError("");
      setWebsiteURL("");
      setSpaceType("");
      setSpaceId("");
      setCategory("");
      setHeight("");
      setWidth("");
      setHourlyRentalRate("");
      setTags([]);
      setImageIpfsHash("");
    } catch (err: any) {
      setError(`Minting failed: ${err.message}`);
      setTxStatus("");
    }
  };

  return (
    <div className="min-h-screen  p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8 bg-gray-800/50 backdrop-blur-sm p-4 rounded-xl">
          <div className="flex items-center space-x-2">
            <div className="w-[120px] text-xl flex gap-1 items-center justify-start tracking-tight font-semibold cursor-pointer text-white">
              <div className="w-8 h-8 bg-[#f26522] rounded-sm">
                <p className="text-white text-sm pl-[4px] pt-[1px]">AD</p>
              </div>

              {typeof window !== "undefined" && window.scrollY > 100 && (
                <div className="bg-zinc-400 ml-1 w-[2px] h-[24px] rounded-full transition-all ease-in-out duration-700"></div>
              )}
            </div>
            <span className="text-white font-medium">
              Connected:{" "}
              {account
                ? `${account.substring(0, 6)}...${account.substring(
                    account.length - 4
                  )}`
                : "Not connected"}
            </span>
          </div>
          <button
            onClick={refreshConnection}
            className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-lg"
          >
            Refresh
          </button>
        </div>

        <div className="bg-gray-800/70 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-gray-700">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">
              Create New Ad Space
            </h2>
            <p className="text-gray-400">
              Mint your advertising space as an NFT
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-900/50 border border-red-700 rounded-lg text-red-300 text-center">
              {error}
            </div>
          )}
          {txStatus && (
            <div className="mb-6 p-4 bg-green-900/50 border border-green-700 rounded-lg text-green-300 text-center">
              {txStatus}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-gray-300 text-sm">Website URL</label>
              <input
                type="text"
                value={websiteURL}
                onChange={(e) => setWebsiteURL(e.target.value)}
                className="w-full p-3 bg-gray-700/80 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-300 hover:bg-gray-700"
              />
            </div>

            <div className="space-y-1">
              <label className="text-gray-300 text-sm">Space Type</label>
              <input
                type="text"
                value={spaceType}
                onChange={(e) => setSpaceType(e.target.value)}
                className="w-full p-3 bg-gray-700/80 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-300 hover:bg-gray-700"
              />
            </div>

            <div className="space-y-1">
              <label className="text-gray-300 text-sm">Space ID</label>
              <input
                type="text"
                value={spaceId}
                onChange={(e) => setSpaceId(e.target.value)}
                className="w-full p-3 bg-gray-700/80 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-300 hover:bg-gray-700"
              />
            </div>

            <div className="space-y-1">
              <label className="text-gray-300 text-sm">Category</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-3 bg-gray-700/80 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-300 hover:bg-gray-700"
              />
            </div>

            <div className="space-y-1">
              <label className="text-gray-300 text-sm">Height (px)</label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="w-full p-3 bg-gray-700/80 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-300 hover:bg-gray-700"
              />
            </div>

            <div className="space-y-1">
              <label className="text-gray-300 text-sm">Width (px)</label>
              <input
                type="number"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                className="w-full p-3 bg-gray-700/80 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-300 hover:bg-gray-700"
              />
            </div>

            <div className="space-y-1">
              <label className="text-gray-300 text-sm">Hourly Rate (USD)</label>
              <input
                type="number"
                value={hourlyRentalRate}
                onChange={(e) => setHourlyRentalRate(e.target.value)}
                className="w-full p-3 bg-gray-700/80 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-300 hover:bg-gray-700"
              />
            </div>

            <div className="space-y-1">
              <label className="text-gray-300 text-sm">
                Tags (comma separated)
              </label>
              <input
                type="text"
                value={tags.join(",")}
                onChange={(e) => setTags(e.target.value.split(","))}
                className="w-full p-3 bg-gray-700/80 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-300 hover:bg-gray-700"
              />
            </div>

            <div className="md:col-span-2 space-y-1">
              <label className="text-gray-300 text-sm">Ad Space Logo</label>
              <div
                {...getRootProps()}
                className={`w-full p-8 border-2 border-dashed rounded-xl text-center cursor-pointer transition-all duration-300 ${
                  isDragActive
                    ? "border-orange-500 bg-gray-700/50"
                    : imageIpfsHash
                    ? "border-green-500 bg-gray-700/30"
                    : "border-gray-600 bg-gray-700/50 hover:border-orange-400"
                }`}
              >
                <input {...getInputProps()} />
                {isDragActive ? (
                  <p className="text-orange-400">Drop the file here...</p>
                ) : imageIpfsHash ? (
                  <div className="space-y-2">
                    <p className="text-green-400 font-medium">
                      ✓ Logo Uploaded
                    </p>
                    <p className="text-gray-400 text-sm">Click to change</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-gray-300">Drag & drop your logo here</p>
                    <p className="text-gray-500 text-sm">
                      or click to browse (JPG, PNG, GIF)
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={handleMint}
            disabled={!account}
            className={`w-full mt-8 py-4 rounded-xl font-medium text-lg transition-all duration-300 ${
              account
                ? "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-lg hover:shadow-orange-500/30"
                : "bg-gray-600 cursor-not-allowed"
            }`}
          >
            {account ? "Mint Ad Space" : "Connect Wallet to Mint"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MintAdSpace;
