"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ethers } from "ethers";
import axios from "axios";
import AdSpaceNFT from "../../../../contract/abi/AdSpaceNFT.json";

interface AdSpace {
  tokenId: number;
  owner: string;
  websiteURL: string;
  spaceType: string;
  spaceId: string;
  category: string;
  height: number;
  width: number;
  tags: string[];
  hourlyRentalRate: string;
  status: string;
  name?: string;
  description?: string;
  image?: string;
}

const AdSpaceDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [space, setSpace] = useState<AdSpace | null>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [rentLoading, setRentLoading] = useState<boolean>(false);
  const [rentError, setRentError] = useState<string>("");
  const [rentSuccess, setRentSuccess] = useState<string>("");
  const [rentForm, setRentForm] = useState({
    startTime: "",
    endTime: "",
    websiteURL: "",
    adMetadataURI: "",
  });

  useEffect(() => {
    const fetchAdSpaceDetails = async () => {
      if (!id) {
        setError("No ad space ID provided.");
        setLoading(false);
        return;
      }
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const contract = new ethers.Contract(
          "0x44db140EB12D0d9545CE7BfCcc5daAf328C81A02", // Verify this address
          AdSpaceNFT,
          provider
        );
        const spaceData = await contract.getAdSpace(Number(id));
        let metadata = { name: "", description: "", image: "" };
        const tokenUri = await contract.tokenURI(Number(id));
        if (tokenUri && tokenUri !== "") {
          try {
            const response = await axios.get(tokenUri);
            metadata = response.data;
          } catch (uriError) {
            console.warn(`Failed to fetch metadata for token ${id}:`, uriError);
          }
        }
        const statusValue = spaceData.status.toString();
        const status =
          Object.keys({ 0: "Available", 1: "Rented", 2: "Paused" })[
            Number(statusValue)
          ] || "Unknown";
        console.log("Fetched status:", status); // Debug log
        setSpace({
          tokenId: Number(id),
          owner: spaceData.owner,
          websiteURL: spaceData.websiteURL,
          spaceType: spaceData.spaceType,
          spaceId: spaceData.spaceId,
          category: spaceData.category,
          height: Number(spaceData.height.toString()),
          width: Number(spaceData.width.toString()),
          tags: spaceData.tags,
          hourlyRentalRate: ethers.formatUnits(
            spaceData.hourlyRentalRate.toString(),
            18
          ),
          status: status,
          name: metadata.name,
          description: metadata.description,
          image: metadata.image,
        });
        setError("");
      } catch (err: any) {
        setError(`Failed to fetch ad space details: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchAdSpaceDetails();
  }, [id]);

  const calculateEthRequired = async (startTime: number, endTime: number) => {
    if (!space) return ethers.parseEther("0.01");
    const durationInHours = (endTime - startTime) / 3600;
    const totalUsdAmount =
      BigInt(space.hourlyRentalRate) * BigInt(durationInHours) * BigInt(1e18);
    const provider = new ethers.BrowserProvider(window.ethereum);
    const contract = new ethers.Contract(
      "0x44db140EB12D0d9545CE7BfCcc5daAf328C81A02",
      AdSpaceNFT,
      provider
    );
    const ethRequired = await contract.getETHAmountForUSD(totalUsdAmount);
    return ethRequired + (ethRequired * BigInt(3)) / BigInt(100); // Add 3% platform fee
  };

  const handleRent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!space) return;
    setRentLoading(true);
    setRentError("");
    setRentSuccess("");
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const startTime = Math.floor(
        new Date(rentForm.startTime).getTime() / 1000
      );
      const endTime = Math.floor(new Date(rentForm.endTime).getTime() / 1000);
      const ethRequired = await calculateEthRequired(startTime, endTime);
      const contract = new ethers.Contract(
        "0x44db140EB12D0d9545CE7BfCcc5daAf328C81A02",
        AdSpaceNFT,
        signer
      );
      const tx = await contract.rentAdSpace(
        space.tokenId,
        startTime,
        endTime,
        rentForm.websiteURL,
        rentForm.adMetadataURI,
        { value: ethRequired }
      );
      await tx.wait();
      setRentSuccess("Ad space rented successfully!");
      setRentForm({
        startTime: "",
        endTime: "",
        websiteURL: "",
        adMetadataURI: "",
      });
    } catch (err: any) {
      setRentError(`Rent failed: ${err.message}`);
    } finally {
      setRentLoading(false);
    }
  };

  if (loading) return <p className="text-gray-400 text-center">Loading...</p>;
  if (error) return <p className="text-red-400 text-center">{error}</p>;
  if (!space)
    return <p className="text-gray-400 text-center">Ad space not found.</p>;

  return (
    <div className="border border-black p-6 min-h-screen bg-gray-900">
      <h1 className="text-4xl font-bold text-white text-center mb-6">
        Ad Space Details
      </h1>
      <div className="max-w-2xl mx-auto bg-white p-4 rounded-lg shadow-lg">
        {space.image && (
          <img
            src={space.image}
            alt={space.name || `Ad Space ${space.tokenId}`}
            className="w-full h-64 object-cover rounded-t-lg mb-4"
          />
        )}
        <h2 className="text-2xl font-semibold text-black mb-2">
          {space.name || `Ad Space #${space.tokenId}`}
        </h2>
        <p className="text-black mb-2">
          <strong>Owner:</strong> {space.owner.slice(0, 6)}...
          {space.owner.slice(-4)}
        </p>
        <p className="text-black mb-2">
          <strong>Website:</strong> {space.websiteURL}
        </p>
        <p className="text-black mb-2">
          <strong>Space Type:</strong> {space.spaceType}
        </p>
        <p className="text-black mb-2">
          <strong>Space ID:</strong> {space.spaceId}
        </p>
        <p className="text-black mb-2">
          <strong>Category:</strong> {space.category}
        </p>
        <p className="text-black mb-2">
          <strong>Dimensions:</strong> {space.width}x{space.height}px
        </p>
        <p className="text-black mb-2">
          <strong>Tags:</strong> {space.tags.join(", ")}
        </p>
        <p className="text-black mb-2">
          <strong>Status:</strong> {space.status}
        </p>
        <p className="text-green-400 font-bold mb-2">
          <strong>Rental Rate:</strong> ${space.hourlyRentalRate} USD/hour
        </p>
        <p className="text-black mb-4">
          <strong>Description:</strong>{" "}
          {space.description || "No description available"}
        </p>

        {/* Temporarily bypass status condition for testing */}
        <div className="mt-4">
          <h3 className="text-lg font-semibold text-black mb-2">
            Rent this Ad Space
          </h3>
          <form onSubmit={handleRent} className="space-y-4">
            <input
              type="datetime-local"
              value={rentForm.startTime}
              onChange={(e) =>
                setRentForm({ ...rentForm, startTime: e.target.value })
              }
              className="w-full p-2 border rounded text-black"
              required
            />
            <input
              type="datetime-local"
              value={rentForm.endTime}
              onChange={(e) =>
                setRentForm({ ...rentForm, endTime: e.target.value })
              }
              className="w-full p-2 border rounded text-black"
              required
            />
            <input
              type="text"
              value={rentForm.websiteURL}
              onChange={(e) =>
                setRentForm({ ...rentForm, websiteURL: e.target.value })
              }
              placeholder="Website URL for Ad"
              className="w-full p-2 border rounded text-black"
              required
            />
            <input
              type="text"
              value={rentForm.adMetadataURI}
              onChange={(e) =>
                setRentForm({ ...rentForm, adMetadataURI: e.target.value })
              }
              placeholder="Ad Metadata URI"
              className="w-full p-2 border rounded text-black"
              required
            />
            <button
              type="submit"
              disabled={rentLoading}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition w-full"
            >
              {rentLoading ? "Renting..." : "Rent Ad Space"}
            </button>
            {rentError && <p className="text-red-400">{rentError}</p>}
            {rentSuccess && <p className="text-green-400">{rentSuccess}</p>}
          </form>
        </div>
        <button
          onClick={() => router.back()}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition mt-4"
        >
          Back to Marketplace
        </button>
      </div>
    </div>
  );
};

export default AdSpaceDetailsPage;
