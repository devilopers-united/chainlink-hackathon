"use client";
import AdCard from "@/components/AdCard";
import Marketplace from "@/components/Marketplace";
import { useWallet } from "@/context/WalletContext";
import { Plus } from "lucide-react";
import Link from "next/link";

const MarketplacePage = () => {
  const { provider } = useWallet();

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-bold text-white">
              Ad Space Marketplace
            </h1>
            <p className="text-gray-400 mt-2">
              Discover and rent premium advertising spaces
            </p>
          </div>

          <Link
            href="/createAdspace"
            className="group relative inline-flex items-center justify-center px-6 py-3 overflow-hidden font-medium text-white transition-all duration-300 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-lg hover:shadow-orange-500/30"
          >
            <Plus className="w-5 h-5 mr-2 transition-transform group-hover:rotate-90" />
            <span className="relative">Create New AdSpace</span>
            <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
          </Link>
        </div>

        <Marketplace provider={provider} />
      </div>
    </div>
  );
};

export default MarketplacePage;
