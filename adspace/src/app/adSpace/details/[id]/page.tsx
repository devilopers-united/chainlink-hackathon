"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ethers } from "ethers";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import AdSpaceNFT from "../../../../contract/abi/AdSpaceNFT.json";

interface AdSpace {
  tokenId: number;
  owner: string;
  websiteURL: string;
  pageURL: string;
  spaceType: string;
  spaceId: string;
  category: string;
  height: number;
  width: number;
  tags: string[];
  hourlyRentalRate: string; // No 18 decimals, raw USD integer
  status: string;
  name?: string;
  description?: string;
  image?: string;
}

const AdSpaceDetails = ({
  space,
  id,
}: {
  space: AdSpace | null;
  id: string;
}) => {
  if (!space) return null;

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 shadow-2xl border border-gray-700">
      {space.image && (
        <div className="relative h-80 w-full overflow-hidden rounded-xl mb-6 group">
          <img
            src={space.image}
            alt={space.name || `Ad Space ${space.tokenId}`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
            <span className="text-white font-medium text-lg">
              {space.name || `Ad Space #${space.tokenId}`}
            </span>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">
            {space.name || `Ad Space #${space.tokenId}`}
          </h2>
          {/* <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              space.status === "Available"
                ? "bg-green-900/50 text-green-400"
                : space.status === "Rented"
                ? "bg-yellow-900/50 text-yellow-400"
                : "bg-gray-700 text-gray-300" // Paused status
            }`}
          >
            {space.status}
          </span> */}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-800/50 p-3 rounded-lg">
            <p className="text-gray-400 text-sm">Owner</p>
            <p className="text-white font-medium">
              {space.owner.slice(0, 6)}...{space.owner.slice(-4)}
            </p>
          </div>
          <div className="bg-gray-800/50 p-3 rounded-lg">
            <p className="text-gray-400 text-sm">Website</p>
            <p className="text-white font-medium truncate">
              {space.websiteURL}
            </p>
          </div>
          <div className="bg-gray-800/50 p-3 rounded-lg">
            <p className="text-gray-400 text-sm">Page URL</p>
            <p className="text-white font-medium truncate">{space.pageURL}</p>
          </div>
          <div className="bg-gray-800/50 p-3 rounded-lg">
            <p className="text-gray-400 text-sm">Category</p>
            <p className="text-white font-medium">{space.category}</p>
          </div>
          <div className="bg-gray-800/50 p-3 rounded-lg">
            <p className="text-gray-400 text-sm">Dimensions</p>
            <p className="text-white font-medium">
              {space.width}x{space.height}px
            </p>
          </div>
          <div className="bg-gray-800/50 p-3 rounded-lg">
            <p className="text-gray-400 text-sm">Space Token ID</p>
            <p className="text-white font-medium">{id}</p>
          </div>
        </div>

        <div className="bg-gray-800/50 p-4 rounded-lg">
          <p className="text-orange-400 text-xl font-bold mb-2">
            ${space.hourlyRentalRate}{" "}
            <span className="text-gray-400 text-sm font-normal">/ hour</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {space.tags.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-700 rounded-full text-xs text-gray-300"
              >
                {tag.trim()}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const RentForm = ({
  rentForm,
  setRentForm,
  file,
  onDrop,
  getRootProps,
  getInputProps,
  isDragActive,
  handleRent,
  rentLoading,
  rentError,
  rentSuccess,
  router,
}: {
  rentForm: {
    startTime: string;
    endTime: string;
    websiteURL: string;
    adMetadataURI: string;
  };
  setRentForm: (form: any) => void;
  file: File | null;
  onDrop: (acceptedFiles: File[]) => void;
  getRootProps: any;
  getInputProps: any;
  isDragActive: boolean;
  handleRent: (e: React.FormEvent) => void;
  rentLoading: boolean;
  rentError: string;
  rentSuccess: string;
  router: ReturnType<typeof useRouter>;
}) => {
  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 shadow-2xl border border-gray-700">
      <h3 className="text-2xl font-bold text-white mb-6">Rent This Ad Space</h3>

      <form onSubmit={handleRent} className="space-y-5">
        <div className="space-y-1">
          <label className="text-gray-300 text-sm">Start Time</label>
          <input
            type="datetime-local"
            value={rentForm.startTime}
            onChange={(e) =>
              setRentForm({ ...rentForm, startTime: e.target.value })
            }
            className="w-full p-3 bg-gray-700/80 text-white border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
            required
          />
        </div>

        <div className="space-y-1">
          <label className="text-gray-300 text-sm">End Time</label>
          <input
            type="datetime-local"
            value={rentForm.endTime}
            onChange={(e) =>
              setRentForm({ ...rentForm, endTime: e.target.value })
            }
            className="w-full p-3 bg-gray-700/80 text-white border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
            required
          />
        </div>

        <div className="space-y-1">
          <label className="text-gray-300 text-sm">Your Website URL</label>
          <input
            type="text"
            value={rentForm.websiteURL}
            onChange={(e) =>
              setRentForm({ ...rentForm, websiteURL: e.target.value })
            }
            placeholder="https://yourwebsite.com"
            className="w-full p-3 bg-gray-700/80 text-white border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
            required
          />
        </div>

        <div className="space-y-1">
          <label className="text-gray-300 text-sm">Ad Creative</label>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
              isDragActive
                ? "border-orange-500 bg-gray-700/30"
                : file
                ? "border-green-500 bg-gray-700/30"
                : "border-gray-600 bg-gray-700/50 hover:border-orange-400"
            }`}
          >
            <input {...getInputProps()} />
            {isDragActive ? (
              <div className="space-y-2">
                <p className="text-orange-400">Drop your ad creative here</p>
                <p className="text-gray-500 text-sm">We accept JPG, PNG, GIF</p>
              </div>
            ) : file ? (
              <div className="space-y-2">
                <p className="text-green-400 font-medium">✓ {file.name}</p>
                <p className="text-gray-400 text-sm">Click to change</p>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-gray-300">Drag & drop your ad creative</p>
                <p className="text-gray-500 text-sm">
                  or click to browse files
                </p>
              </div>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={rentLoading || !file}
          className={`w-full py-3 rounded-xl font-medium transition-all ${
            rentLoading
              ? "bg-gray-600 cursor-wait"
              : !file
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
          }`}
        >
          {rentLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Processing...
            </span>
          ) : (
            "Rent This Space"
          )}
        </button>

        {rentError && (
          <div className="p-3 bg-red-900/30 border border-red-700 rounded-lg text-red-300 text-center">
            {rentError}
          </div>
        )}

        {rentSuccess && (
          <div className="p-3 bg-green-900/30 border border-green-700 rounded-lg text-green-300 text-center">
            {rentSuccess}
          </div>
        )}
      </form>

      <button
        onClick={() => router.back()}
        className="w-full mt-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
        Back to Marketplace
      </button>
    </div>
  );
};

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
  const [file, setFile] = useState<File | null>(null);
  const [imageIpfsHash, setImageIpfsHash] = useState<string>("");

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
        const contractAddress = "0x1C1B73B1D9b4eF7775b30C0301fdE00615C17682";
        const contract = new ethers.Contract(
          contractAddress,
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
        const status = await contract.getAdSpaceStatus(Number(id));
        setSpace({
          tokenId: Number(id),
          owner: spaceData.owner,
          websiteURL: spaceData.websiteURL,
          pageURL: spaceData.pageURL,
          spaceType: spaceData.spaceType,
          spaceId: spaceData.spaceId,
          category: spaceData.category,
          height: Number(spaceData.height.toString()),
          width: Number(spaceData.width.toString()),
          tags: spaceData.tags,
          hourlyRentalRate: spaceData.hourlyRentalRate.toString(), // Raw USD integer
          status:
            status === 0 ? "Available" : status === 1 ? "Rented" : "Paused",
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
    const durationInSeconds = Math.max(3600, endTime - startTime); // Minimum 1 hour
    const hourlyRate = BigInt(space.hourlyRentalRate); // Raw USD integer
    const totalUsdAmount =
      ((hourlyRate * BigInt(1e18)) / BigInt(3600)) * BigInt(durationInSeconds); // Scale to 18 decimals
    console.log("Total USD Amount (18 decimals):", totalUsdAmount.toString());
    const provider = new ethers.BrowserProvider(window.ethereum);
    const contract = new ethers.Contract(
      "0x1C1B73B1D9b4eF7775b30C0301fdE00615C17682",
      AdSpaceNFT,
      provider
    );
    const usdFee = (totalUsdAmount * BigInt(5)) / BigInt(100); // 5% platform fee
    const usdToPublisher = totalUsdAmount - usdFee;
    console.log(
      "USD to Publisher:",
      usdToPublisher.toString(),
      "USD Fee:",
      usdFee.toString()
    );
    const ethFee = await contract.getETHAmountForUSD(usdFee);
    const ethToPublisher = await contract.getETHAmountForUSD(usdToPublisher);
    const totalEthRequired = ethFee + ethToPublisher;
    console.log(
      "ETH to Publisher:",
      ethers.formatEther(ethToPublisher),
      "ETH Fee:",
      ethers.formatEther(ethFee),
      "Total ETH Required:",
      ethers.formatEther(totalEthRequired)
    );
    return totalEthRequired > 0 ? totalEthRequired : ethers.parseEther("0.01");
  };

  function getEpochTime(date: Date): number {
    return Math.floor(date.getTime() / 1000);
  }

  const uploadToIPFS = async (file: File): Promise<string | null> => {
    try {
      const apiKey = process.env.NEXT_PUBLIC_PINATA_API_KEY;
      const apiSecret = process.env.NEXT_PUBLIC_PINATA_API_SECRET;
      if (!apiKey || !apiSecret) {
        console.error("Pinata API Key or Secret is not set");
        alert("Pinata configuration error. Please contact support.");
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
      return `https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`;
    } catch (error: any) {
      console.error("Error uploading to IPFS:", error);
      alert("Failed to upload file to IPFS. Check console for details.");
      return null;
    }
  };

  const createMetadataJson = async (
    websiteURL: string,
    imageUrl: string
  ): Promise<string | null> => {
    if (!websiteURL || !imageUrl) return null;
    const metadata = JSON.stringify({ websiteURL, image: imageUrl });
    try {
      const apiKey = process.env.NEXT_PUBLIC_PINATA_API_KEY;
      const apiSecret = process.env.NEXT_PUBLIC_PINATA_API_SECRET;
      if (!apiKey || !apiSecret) {
        console.error("Pinata API Key or Secret is not set");
        alert("Pinata configuration error. Please contact support.");
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
      return `https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`;
    } catch (error: any) {
      console.error("Error uploading metadata JSON to IPFS:", error);
      alert("Failed to upload metadata to IPFS. Check console for details.");
      return null;
    }
  };

  const onDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      const imageUrl = await uploadToIPFS(acceptedFiles[0]);
      if (imageUrl) {
        setImageIpfsHash(imageUrl);
      }
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpg", ".jpeg", ".png", ".gif"] },
    multiple: false,
  });

  const handleRent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!space) return;

    setRentLoading(true);
    setRentError("");
    setRentSuccess("");

    try {
      if (
        !rentForm.startTime ||
        !rentForm.endTime ||
        !rentForm.websiteURL ||
        !file
      ) {
        throw new Error("All form fields and an image are required.");
      }

      const startDate = new Date(rentForm.startTime);
      const endDate = new Date(rentForm.endTime);

      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        throw new Error("Invalid date format.");
      }
      if (endDate <= startDate) {
        throw new Error("End time must be after start time.");
      }
      if (getEpochTime(startDate) < Math.floor(Date.now() / 1000)) {
        throw new Error("Start time must be in the future.");
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const startTime = getEpochTime(startDate);
      const endTime = getEpochTime(endDate);

      const ethRequired = await calculateEthRequired(startTime, endTime);
      if (ethRequired <= 0) throw new Error("Invalid ETH amount calculated.");

      const adMetadataURI = await createMetadataJson(
        rentForm.websiteURL,
        imageIpfsHash
      );
      if (!adMetadataURI) throw new Error("Metadata upload failed.");

      const contract = new ethers.Contract(
        "0x1C1B73B1D9b4eF7775b30C0301fdE00615C17682",
        AdSpaceNFT,
        signer
      );

      const tx = await contract.rentAdSpace(
        space.tokenId,
        startTime,
        endTime,
        rentForm.websiteURL,
        adMetadataURI,
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
      setFile(null);
      setImageIpfsHash("");
    } catch (err: any) {
      setRentError(
        `Rent failed: ${err.message || err.reason || "Unknown error"}`
      );
    } finally {
      setRentLoading(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-400">Loading ad space details...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-gray-800/70 p-8 rounded-2xl max-w-md text-center">
          <div className="text-red-400 mb-4">
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
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">
            Error Loading Ad Space
          </h3>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    );

  if (!space)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="p-8 rounded-2xl max-w-md text-center">
          <div className="text-gray-400 mb-4">
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
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line>
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">
            Ad Space Not Found
          </h3>
          <p className="text-gray-400 mb-6">
            The requested ad space doesn't exist or may have been removed.
          </p>
          <button
            onClick={() => router.push("/marketplace")}
            className="px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-all"
          >
            Browse Marketplace
          </button>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Back to Marketplace
          </button>
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            Ad Space Details
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <AdSpaceDetails space={space} id={id} />
          <RentForm
            rentForm={rentForm}
            setRentForm={setRentForm}
            file={file}
            onDrop={onDrop}
            getRootProps={getRootProps}
            getInputProps={getInputProps}
            isDragActive={isDragActive}
            handleRent={handleRent}
            rentLoading={rentLoading}
            rentError={rentError}
            rentSuccess={rentSuccess}
            router={router}
          />
        </div>
      </div>
    </div>
  );
};

export default AdSpaceDetailsPage;
