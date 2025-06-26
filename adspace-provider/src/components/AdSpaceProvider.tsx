import { useEffect, useState } from "react";
import { Contract, ethers } from "ethers";

const ABI = [
    "function getCurrentAd(uint256 tokenId) view returns (string)"
];
const PROVIDER_URL = "https://sepolia.infura.io/v3/c542488da7c04aef9a134949bfc1879f";

type Ad = {
    image: string;
    websiteURL: string;
    name?: string;
};

type AdSpaceProviderProps = {
    tokenId: number;
    contractAddress: string;
};

const AdSpaceProvider = ({ tokenId, contractAddress }: AdSpaceProviderProps) => {
    const [loading, setLoading] = useState<boolean>(true);
    const [ad, setAd] = useState<Ad | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let mounted = true; // Flag to prevent state updates after unmount

        async function loadAd() {
            if (!mounted) return;
            
            setLoading(true);
            setError(null);
            
            try {
                // For ethers v6, use JsonRpcProvider directly
                const provider = new ethers.providers.JsonRpcProvider(PROVIDER_URL);
                const contract = new Contract(contractAddress, ABI, provider);

                // Call the contract function
                const adURI = await contract.getCurrentAd(tokenId);
                
                if (!mounted) return;
                
                if (adURI === "No Active Ad") {
                    setAd(null);
                    return;
                }

                // Fetch metadata
                const response = await fetch(adURI);
                if (!response.ok) {
                    throw new Error(`Failed to fetch metadata: ${response.status}`);
                }
                const metadata = await response.json();

                if (!mounted) return;
                
                setAd({
                    image: metadata.image,
                    websiteURL: metadata.websiteURL,
                    name: metadata.name,
                });
            } catch (err) {
                if (!mounted) return;
                console.error("Error loading ad:", err);
                setError(err instanceof Error ? err.message : "Failed to load ad");
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        }

        loadAd();

        return () => {
            mounted = false; // Cleanup function
        };
    }, [tokenId, contractAddress]);

    return (
        <div className="adspace-provider-container">
            <h2>🔗 AdSpaceNFT Live Ad</h2>
            <div id="ad-slot">
                {loading && "Loading Ad..."}
                {error && <p className="adspace-provider-error">{error}</p>}
                {!loading && !error && !ad && <p>No active ad at the moment.</p>}
                {!loading && !error && ad && (
                    <a href={ad.websiteURL} target="_blank" rel="noopener noreferrer">
                        <img
                            src={ad.image}
                            alt={ad.name || "Sponsored"}
                            className="adspace-provider-image"
                        />
                    </a>
                )}
            </div>
        </div>
    );
};

export default AdSpaceProvider;