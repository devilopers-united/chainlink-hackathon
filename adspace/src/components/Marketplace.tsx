"use client";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import axios from "axios";
import AdSpaceNFT from "../contract/abi/AdSpaceNFT.json";
import AdCard from "./AdCard";
import { SkeletonCard } from "./ui/skeleton";

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
        setError(
          "If not connected !!! Please connect your wallet to view ad spaces"
        );
        return;
      }
      setLoading(true);
      try {
        const contract = new ethers.Contract(
          "0xd07cE5C636D1095e2753525D1620Df6cB55C951D",
          AdSpaceNFT,
          provider
        );
        let nextTokenId;
        try {
          nextTokenId = await contract.nextTokenId(); // Attempt to call the getter
          nextTokenId = Number(nextTokenId.toString());
        } catch (nextTokenIdError) {
          console.error("nextTokenId failed:", nextTokenIdError);
          // Fallback: Use a reasonable limit or totalSupply if available
          nextTokenId = 10; // Adjust based on expected max tokens
          setError(
            "Falling back to default token count due to nextTokenId error."
          );
        }
        const spaces: AdSpace[] = [];

        for (let i = 0; i < nextTokenId; i++) {
          try {
            const space = await contract.getAdSpace(i);
            let metadata = { name: "", description: "", image: "" };
            const tokenUri = await contract.tokenURI(i);

            if (tokenUri && tokenUri !== "") {
              try {
                const response = await axios.get(tokenUri);
                metadata = response.data || {
                  name: "",
                  description: "",
                  image: "",
                };
              } catch (uriError) {
                console.warn(
                  `Failed to fetch metadata for token ${i}:`,
                  uriError
                );
              }
            }

            if (space && space.owner) {
              spaces.push({
                tokenId: i,
                owner: space.owner || "0x0",
                websiteURL: space.websiteURL || "",
                spaceType: space.spaceType || "",
                spaceId: space.spaceId || "",
                category: space.category || "",
                height: Number(space.height.toString()) || 0,
                width: Number(space.width.toString()) || 0,
                tags: space.tags || [],
                hourlyRentalRate: ethers.formatUnits(
                  space.hourlyRentalRate.toString() || "0",
                  18
                ),
                status:
                  Object.keys({ 0: "Available", 1: "Rented", 2: "Paused" })[
                  Number(space.status.toString()) || 0
                  ] || "Unknown",
                name: metadata.name,
                description: metadata.description,
                image: metadata.image,
              });
            }
          } catch (err) {
            console.error(`Failed to fetch ad space ${i}:`, err);
          }
        }

        setAdSpaces(spaces.filter((space) => space !== undefined));
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
    <div className="">
      {error && (
        <div className="bg-red-900/30 border border-red-700 rounded-lg p-4 text-center max-w-2xl mx-auto mb-8">
          <p className="text-red-300">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 justify-center items-center place-items-center mx-4">
            {[...Array(4)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 justify-center items-center place-items-center mx-4">
          {adSpaces.map((space) => (
            <AdCard key={space.tokenId} space={space} />
          ))}
        </div>
      )}

      {!loading && adSpaces.length === 0 && (
        <div className="text-center">
          <div className="bg-gray-800/50 p-8 rounded-2xl inline-block">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-gray-500 mx-auto mb-4"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line>
            </svg>
            <h3 className="text-xl font-medium text-white mb-2">
              No Ad Spaces Found
            </h3>
            <p className="text-gray-400">
              There are currently no ad spaces available for rent
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Marketplace;
