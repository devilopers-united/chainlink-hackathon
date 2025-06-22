import { useState, useEffect } from "react";
import { ethers } from "ethers";
import axios from "axios";
import AdSpaceNFT from "../contract/abi/AdSpaceNFT.json";

interface MarketplaceProps {
  provider: ethers.BrowserProvider | null;
}

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

const Marketplace: React.FC<MarketplaceProps> = ({ provider }) => {
  const [adSpaces, setAdSpaces] = useState<AdSpace[]>([]);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchAdSpaces = async () => {
      if (!provider) {
        setError("Please connect your wallet or ensure MetaMask is installed.");
        return;
      }
      setLoading(true);
      try {
        const contract = new ethers.Contract(
          "0x44db140EB12D0d9545CE7BfCcc5daAf328C81A02", // Verify this address
          AdSpaceNFT,
          provider
        );
        const nextTokenId = await contract.nextTokenId();
        const spaces: AdSpace[] = [];
        for (let i = 0; i < nextTokenId; i++) {
          try {
            const space = await contract.getAdSpace(i);
            let metadata = { name: "", description: "", image: "" };
            const tokenUri = await contract.tokenURI(i);
            if (tokenUri && tokenUri !== "") {
              try {
                const response = await axios.get(tokenUri);
                metadata = response.data;
              } catch (uriError) {
                console.warn(
                  `Failed to fetch metadata for token ${i}:`,
                  uriError
                );
              }
            }
            spaces.push({
              tokenId: i,
              owner: space.owner,
              websiteURL: space.websiteURL,
              spaceType: space.spaceType,
              spaceId: space.spaceId,
              category: space.category,
              height: Number(space.height.toString()),
              width: Number(space.width.toString()),
              tags: space.tags,
              hourlyRentalRate: ethers.formatUnits(
                space.hourlyRentalRate.toString(),
                18
              ),
              status:
                Object.keys({ 0: "Available", 1: "Rented", 2: "Paused" })[
                  Number(space.status.toString())
                ] || "Unknown",
              name: metadata.name,
              description: metadata.description,
              image: metadata.image,
            });
          } catch (err) {
            console.error(`Failed to fetch ad space ${i}:`, err);
          }
        }
        setAdSpaces(spaces);
        setError("");
      } catch (err: any) {
        setError(`Failed to fetch marketplace: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchAdSpaces();
  }, [provider]);

  return (
    <div className="border border-black p-4 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-white text-center">
        Ad Space Marketplace
      </h2>
      {error && <p className="text-red-400 mb-4 text-center">{error}</p>}
      {loading && (
        <p className="text-gray-400 text-center">Loading ad spaces...</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {adSpaces.map((space) => (
          <div
            key={space.tokenId}
            className="border border-gray-700 rounded-lg p-4 hover:shadow-xl transition transform hover:-translate-y-1"
          >
            {space.image && (
              <img
                src={space.image}
                alt={space.name || `Ad Space ${space.tokenId}`}
                className="w-full h-48 object-cover rounded-t-lg mb-4"
              />
            )}
            <h3 className="text-xl font-semibold text-black mb-2">
              {space.name || `Ad Space #${space.tokenId}`}
            </h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {space.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-gray-700 text-white text-sm px-2 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
            <p className="text-black text-sm mb-2">{space.description}</p>
            <p className="text-gray-800">
              <strong>Dimensions:</strong> {space.width}x{space.height}px
            </p>
            <p className="text-gray-800">
              <strong>Status:</strong> {space.status}
            </p>
            <p className="text-green-400 font-bold mt-2">
              ${space.hourlyRentalRate} USD/hour
            </p>
            <button className="bg-blue-600 text-white px-4 py-2 rounded mt-4 w-full hover:bg-blue-700 transition">
              View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Marketplace;
