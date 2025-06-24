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

const AdSpaceDetails = ({ space }: { space: AdSpace | null }) => {
  if (!space) return null;

  return (
    <div className="p-6 bg-gray-800 rounded-lg shadow-lg">
      {space.image && (
        <img
          src={space.image}
          alt={space.name || `Ad Space ${space.tokenId}`}
          className="w-full h-64 object-cover rounded-lg mb-4 transition-transform duration-300 hover:scale-105"
        />
      )}
      <h2 className="text-2xl font-bold text-white mb-2">
        {space.name || `Ad Space #${space.tokenId}`}
      </h2>
      <p className="text-gray-300 mb-2">
        <strong>Owner:</strong> {space.owner.slice(0, 6)}...
        {space.owner.slice(-4)}
      </p>
      <p className="text-gray-300 mb-2">
        <strong>Website:</strong> {space.websiteURL}
      </p>
      <p className="text-gray-300 mb-2">
        <strong>Space Type:</strong> {space.spaceType}
      </p>
      <p className="text-gray-300 mb-2">
        <strong>Space ID:</strong> {space.spaceId}
      </p>
      <p className="text-gray-300 mb-2">
        <strong>Category:</strong> {space.category}
      </p>
      <p className="text-gray-300 mb-2">
        <strong>Dimensions:</strong> {space.width}x{space.height}px
      </p>
      <p className="text-gray-300 mb-2">
        <strong>Tags:</strong> {space.tags.join(", ")}
      </p>
      <p className="text-gray-300 mb-2">
        <strong>Status:</strong> {space.status}
      </p>
      <p className="text-green-400 font-bold mb-2">
        <strong>Rental Rate:</strong> ${space.hourlyRentalRate} USD/hour
      </p>
      <p className="text-gray-400 mb-4">
        <strong>Description:</strong>{" "}
        {space.description || "No description available"}
      </p>
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
    <div className="p-6 bg-gray-800 rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold text-white mb-4">
        Rent this Ad Space
      </h3>
      <form onSubmit={handleRent} className="space-y-4">
        <input
          type="datetime-local"
          value={rentForm.startTime}
          onChange={(e) =>
            setRentForm({ ...rentForm, startTime: e.target.value })
          }
          className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          type="datetime-local"
          value={rentForm.endTime}
          onChange={(e) =>
            setRentForm({ ...rentForm, endTime: e.target.value })
          }
          className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          type="text"
          value={rentForm.websiteURL}
          onChange={(e) =>
            setRentForm({ ...rentForm, websiteURL: e.target.value })
          }
          placeholder="Website URL for Ad"
          className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <div
          {...getRootProps()}
          className="border-2 border-dashed p-6 text-center cursor-pointer bg-gray-700 rounded-lg transition-all duration-300 hover:border-blue-500 hover:bg-gray-600"
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <p className="text-blue-300">Drop the image here...</p>
          ) : file ? (
            <p className="text-green-400">{file.name} (uploaded)</p>
          ) : (
            <p className="text-gray-400">
              Drag 'n' drop an image or click to select (JPG, PNG, GIF)
            </p>
          )}
        </div>
        <button
          type="submit"
          disabled={rentLoading || !file}
          className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300 disabled:bg-gray-500 disabled:cursor-not-allowed"
        >
          {rentLoading ? "Renting..." : "Rent Ad Space"}
        </button>
        {rentError && <p className="text-red-400 text-center">{rentError}</p>}
        {rentSuccess && (
          <p className="text-green-400 text-center">{rentSuccess}</p>
        )}
      </form>
      <button
        onClick={() => router.back()}
        className="w-full mt-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300"
      >
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
        const contractAddress = "0x44db140EB12D0d9545CE7BfCcc5daAf328C81A02";
        console.log("Using contract address:", contractAddress);
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
        const statusValue = spaceData.status.toString();
        const status =
          Object.keys({ 0: "Available", 1: "Rented", 2: "Paused" })[
            Number(statusValue)
          ] || "Unknown";
        console.log("Fetched status:", status);
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
    const durationInHours = Math.max(
      1,
      Math.floor((endTime - startTime) / 3600)
    );
    console.log("Duration in hours:", durationInHours);
    const hourlyRateInWei = ethers.parseUnits(space.hourlyRentalRate, 18);
    const totalUsdAmount =
      BigInt(hourlyRateInWei.toString()) * BigInt(durationInHours);
    console.log("Total USD amount (wei):", totalUsdAmount.toString());
    const provider = new ethers.BrowserProvider(window.ethereum);
    const contract = new ethers.Contract(
      "0x44db140EB12D0d9545CE7BfCcc5daAf328C81A02",
      AdSpaceNFT,
      provider
    );
    const ethRequired = await contract.getETHAmountForUSD(totalUsdAmount);
    console.log("Raw ETH required:", ethers.formatEther(ethRequired));
    const ethWithFee = ethRequired + (ethRequired * BigInt(3)) / BigInt(100);
    console.log("ETH with fee:", ethers.formatEther(ethWithFee));
    return ethWithFee > 0 ? ethWithFee : ethers.parseEther("0.01");
  };

  function getEpochTime(date: Date): number {
    const myEpoch = Math.floor(date.getTime() / 1000);
    console.log("Epoch time:", myEpoch);
    return myEpoch;
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
      console.log("Pinata upload response:", res.data);
      return `https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`;
    } catch (error: any) {
      console.error("Error uploading to IPFS:", error);
      if (error.response) {
        console.error("Pinata API response:", error.response.data);
        console.error("Status code:", error.response.status);
      }
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
      console.log("Pinata JSON upload response:", res.data);
      return `https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`;
    } catch (error: any) {
      console.error("Error uploading metadata JSON to IPFS:", error);
      if (error.response) {
        console.error("Pinata API response:", error.response.data);
        console.error("Status code:", error.response.status);
      }
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
        console.log("Image uploaded to IPFS, URL:", imageUrl);
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
      if (
        Math.floor(startDate.getTime() / 1000) < Math.floor(Date.now() / 1000)
      ) {
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
        "0x44db140EB12D0d9545CE7BfCcc5daAf328C81A02",
        AdSpaceNFT,
        signer
      );

      console.log(
        "Sending transaction with ETH:",
        ethers.formatEther(ethRequired)
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

  if (loading) return <p className="text-gray-400 text-center">Loading...</p>;
  if (error) return <p className="text-red-400 text-center">{error}</p>;
  if (!space)
    return <p className="text-gray-400 text-center">Ad space not found.</p>;

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <h1 className="text-4xl font-bold text-white text-center mb-6">
        Ad Space Details
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AdSpaceDetails space={space} />
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
  );
};

export default AdSpaceDetailsPage;
