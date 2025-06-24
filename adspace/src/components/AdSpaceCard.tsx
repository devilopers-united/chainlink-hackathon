"use client";
import { useRouter } from "next/navigation";

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

const AdSpaceCard: React.FC<{ space: AdSpace }> = ({ space }) => {
  const router = useRouter();

  const handleViewDetails = () => {
    router.push(`/adSpace/details/${space.tokenId}`);
  };

  return (
    <div className="border border-gray-700 rounded-lg p-4 hover:shadow-xl transition transform hover:-translate-y-1">
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
        ${Number(space.hourlyRentalRate.toString())} USD/hour
      </p>
      <button
        onClick={handleViewDetails}
        className="bg-blue-600 text-white px-4 py-2 rounded mt-4 w-full hover:bg-blue-700 transition"
      >
        View Details
      </button>
    </div>
  );
};

export default AdSpaceCard;
