"use client";
import AdCard from "@/components/AdCard";
import Marketplace from "@/components/Marketplace";
import { Button } from "@/components/ui/button";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";
import { useWallet } from "@/context/WalletContext";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const MarketplacePage = () => {
  const { provider, account } = useWallet();

  return (
    <div className="min-h-screen">
      <div className="px-20 py-12">
        <div>
          <div className="px-8 flex w-full justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white">Marketplace</h1>
              <p className="text-gray-300 pb-4 mt-2">
                Discover and rent premium advertising spaces.
              </p>
            </div>
            <div className=" mr-1 mb-2 place-content-center">
              <Link href="/createAdspace">
                <InteractiveHoverButton className="rounded-xl">
                  Create New AD
                </InteractiveHoverButton>
              </Link>
            </div>
          </div>
        </div>

        <Marketplace provider={provider} />
      </div>
    </div>
  );
};

export default MarketplacePage;
