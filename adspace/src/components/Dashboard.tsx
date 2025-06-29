"use client";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import axios from "axios";
import AdSpaceNFT from "../contract/abi/AdSpaceNFT.json";
import AdCard from "./AdCard";
import { useWallet } from "@/context/WalletContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { InteractiveHoverButton } from "./ui/interactive-hover-button";
import { Button } from "./ui/button";

interface DashboardProps {
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
  renter?: string;
  startTime?: number;
  endTime?: number;
}

const Dashboard: React.FC<DashboardProps> = ({ provider }) => {
  const { account } = useWallet();
  const [createdAdSpaces, setCreatedAdSpaces] = useState<AdSpace[]>([]);
  const [ongoingCampaigns, setOngoingCampaigns] = useState<AdSpace[]>([]);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!provider || !account) {
        setError("Please connect your wallet.");
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const contract = new ethers.Contract(
          "0x1C1B73B1D9b4eF7775b30C0301fdE00615C17682",
          AdSpaceNFT,
          provider
        );

        let nextTokenId;
        try {
          nextTokenId = await contract.nextTokenId();
          nextTokenId = Number(nextTokenId.toString());
        } catch (nextTokenIdError) {
          console.error("nextTokenId failed:", nextTokenIdError);
          nextTokenId = 10;
          setError(
            "Falling back to default token count due to nextTokenId error."
          );
        }

        const allSpaces: AdSpace[] = [];
        const currentTimestamp = Math.floor(Date.now() / 1000);

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

            const rentals = await contract.getAllRentals(i);
            let status = "Available";
            let currentRenter = undefined;
            let startTime = 0;
            let endTime = 0;

            for (const rental of rentals) {
              if (
                currentTimestamp >= rental.startTime &&
                currentTimestamp < rental.endTime
              ) {
                status = "Rented";
                currentRenter = rental.renter;
                startTime = Number(rental.startTime.toString());
                endTime = Number(rental.endTime.toString());
                break;
              }
            }

            if (space && space.owner) {
              allSpaces.push({
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
                status: status,
                name: metadata.name,
                description: metadata.description,
                image: metadata.image,
                renter: currentRenter,
                startTime: startTime,
                endTime: endTime,
              });
            }
          } catch (err) {
            console.error(`Failed to fetch ad space ${i}:`, err);
          }
        }

        const created = allSpaces.filter(
          (space) => space.owner.toLowerCase() === account.toLowerCase()
        );

        const ongoing = allSpaces.filter(
          (space) =>
            space.renter?.toLowerCase() === account.toLowerCase() &&
            space.status === "Rented"
        );

        setCreatedAdSpaces(created);
        setOngoingCampaigns(ongoing);
        setError("");
      } catch (err: any) {
        setError(`Failed to fetch dashboard data: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [provider, account]);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  const formatTimeRemaining = (endTime: number) => {
    const now = Math.floor(Date.now() / 1000);
    const diff = endTime - now;
    const hours = Math.floor(diff / 3600);
    const minutes = Math.floor((diff % 3600) / 60);
    return `${hours}h ${minutes}m remaining`;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-[#121212] px-20 py-12"
    >
      <div className="px-4 md:px-8 flex flex-col md:flex-row w-full justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            Dashboard
          </h1>
          <p className="text-gray-300 pb-4 mt-2 text-base md:text-lg">
            Manage your advertising spaces and campaigns
          </p>
        </div>
      </div>

      {error && (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-red-900/30 border-l-4 border-red-500 p-4 mb-6 rounded-lg backdrop-blur-sm"
        >
          <p className="text-red-200">{error}</p>
        </motion.div>
      )}

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-gray-900/50 rounded-2xl shadow-xl p-6 backdrop-blur-sm border border-gray-800"
      >
        <Tabs defaultValue="created" className="w-full">
          <TabsList className="grid w-full grid-cols-2 gap-2 mb-8 bg-gray-800 p-1 rounded-xl h-12">
            <TabsTrigger
              value="created"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:bg-orange-400 data-[state=active]:to-orange-400 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg transition-all duration-300 h-10 text-white font-semibold text-lg"
            >
              My Ad Spaces
            </TabsTrigger>
            <TabsTrigger
              value="ongoing"
              className=" data-[state=active]:bg-orange-400 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg transition-all duration-300 h-10 font-semibold text-lg text-white"
            >
              Ongoing Campaigns
            </TabsTrigger>
          </TabsList>

          <TabsContent value="created">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Skeleton className="h-[300px] w-full rounded-xl bg-gray-800" />
                  </motion.div>
                ))}
              </div>
            ) : createdAdSpaces.length === 0 ? (
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center py-12"
              >
                <div className="mx-auto h-24 w-24 text-gray-600 mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-full h-full"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-gray-300 mb-2">
                  No ad spaces created
                </h3>
                <p className="text-gray-500">
                  Create your first ad space to get started
                </p>
                <Link href={"/createAdspace"}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className=" mt-4 px-6 py-2 bg-white text-black hover:invert rounded-4xl"
                  >
                    Create New Ad Space
                  </motion.button>
                </Link>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {createdAdSpaces.map((space, i) => (
                  <motion.div
                    key={space.tokenId}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <AdCard space={space} />
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="ongoing">
            {loading ? (
              <div className="space-y-4">
                <div className="grid grid-cols-12 gap-4 px-4 py-2 bg-gray-800 rounded-lg">
                  {[...Array(7)].map((_, i) => (
                    <Skeleton key={i} className="h-6 bg-gray-800 rounded" />
                  ))}
                </div>
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-12 gap-4 px-4 py-3 bg-gray-900 rounded-lg items-center"
                  >
                    {[...Array(7)].map((_, j) => (
                      <Skeleton key={j} className="h-4 bg-gray-800 rounded" />
                    ))}
                  </div>
                ))}
              </div>
            ) : ongoingCampaigns.length === 0 ? (
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center py-12"
              >
                <div className="mx-auto h-24 w-24 text-gray-600 mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-full h-full"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-gray-300 mb-2">
                  No active campaigns
                </h3>
                <p className="text-gray-500">
                  You don't have any ongoing ad campaigns
                </p>
              </motion.div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-gray-800/50 rounded-lg backdrop-blur-sm">
                  <div className="col-span-3 font-medium text-gray-300">
                    Ad Space
                  </div>
                  <div className="col-span-2 font-medium text-gray-300">
                    Token ID
                  </div>
                  <div className="col-span-2 font-medium text-gray-300">
                    Time Remaining
                  </div>
                  <div className="col-span-2 font-medium text-gray-300">
                    Ends At
                  </div>
                  <div className="col-span-1 font-medium text-gray-300">
                    Status
                  </div>
                  <div className="col-span-2 font-medium text-gray-300">
                    Action
                  </div>
                </div>
                {ongoingCampaigns.map((campaign, i) => (
                  <motion.div
                    key={campaign.tokenId}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="grid grid-cols-12 gap-4 px-4 py-3 bg-gray-900/30 hover:bg-gray-800/50 rounded-lg items-center transition-all duration-300 backdrop-blur-sm"
                  >
                    <div className="col-span-3 text-white flex items-center space-x-3">
                      {campaign.image && (
                        <div className="h-10 w-10 rounded-md overflow-hidden">
                          <img
                            src={campaign.image}
                            alt={campaign.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      )}
                      <div>
                        <div className="font-medium">
                          {campaign.name || `Ad Space #${campaign.tokenId}`}
                        </div>
                        <div className="text-xs text-gray-400 truncate">
                          {campaign.websiteURL}
                        </div>
                      </div>
                    </div>
                    <div className="col-span-2 text-blue-400">
                      {campaign.tokenId}
                    </div>
                    <div className="col-span-2 text-blue-400">
                      {campaign.endTime
                        ? formatTimeRemaining(campaign.endTime)
                        : "N/A"}
                    </div>
                    <div className="col-span-2 text-gray-300">
                      {campaign.endTime ? formatDate(campaign.endTime) : "N/A"}
                    </div>
                    <div className="col-span-1">
                      <span className="px-3 py-1 bg-green-900/30 text-green-400 text-xs rounded-full border border-green-800/50">
                        Active
                      </span>
                    </div>
                    <div className="col-span-2">
                      <Link
                        href={`/adSpace/details/${campaign.tokenId}`}
                        className="text-blue-400 hover:text-blue-300 flex items-center justify-end"
                      >
                        <span>View Details</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 ml-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;
