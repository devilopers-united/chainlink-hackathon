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
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        <p className="text-white mb-6 text-center">
          Connected Account: {account || "Not connected"}
        </p>
        <button
          onClick={refreshConnection}
          className="block mx-auto mb-6 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300"
        >
          Refresh Connection
        </button>
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold text-white mb-6 text-center">
            Mint New Ad Space
          </h3>
          {error && <p className="text-red-400 text-center mb-4">{error}</p>}
          {txStatus && (
            <p className="text-green-400 text-center mb-4">{txStatus}</p>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              type="text"
              value={websiteURL}
              onChange={(e) => setWebsiteURL(e.target.value)}
              placeholder="Website URL"
              className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 hover:bg-gray-600"
            />
            <input
              type="text"
              value={spaceType}
              onChange={(e) => setSpaceType(e.target.value)}
              placeholder="Space Type"
              className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 hover:bg-gray-600"
            />
            <input
              type="text"
              value={spaceId}
              onChange={(e) => setSpaceId(e.target.value)}
              placeholder="Space ID"
              className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 hover:bg-gray-600"
            />
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Category"
              className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 hover:bg-gray-600"
            />
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder="Height (px)"
              className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 hover:bg-gray-600"
            />
            <input
              type="number"
              value={width}
              onChange={(e) => setWidth(e.target.value)}
              placeholder="Width (px)"
              className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 hover:bg-gray-600"
            />
            <input
              type="number"
              value={hourlyRentalRate}
              onChange={(e) => setHourlyRentalRate(e.target.value)}
              placeholder="Hourly Rental Rate (USD)"
              className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 hover:bg-gray-600"
            />
            <input
              type="text"
              value={tags.join(",")}
              onChange={(e) => setTags(e.target.value.split(","))}
              placeholder="Tags (comma-separated)"
              className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 hover:bg-gray-600"
            />
            <div
              {...getRootProps()}
              className="w-full p-6 border-2 border-dashed bg-gray-700 text-white rounded-lg text-center cursor-pointer transition-all duration-300 hover:border-blue-500 hover:bg-gray-600"
            >
              <input {...getInputProps()} />
              {isDragActive ? (
                <p className="text-blue-300">Drop the logo here...</p>
              ) : imageIpfsHash ? (
                <p className="text-green-400">Logo uploaded</p>
              ) : (
                <p className="text-gray-400">
                  Drag 'n' drop logo or click to select (JPG, PNG, GIF)
                </p>
              )}
            </div>
          </div>
          <button
            onClick={handleMint}
            className="w-full mt-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300"
          >
            Mint Ad Space
          </button>
        </div>
      </div>
    </div>
  );
};

export default MintAdSpace;
