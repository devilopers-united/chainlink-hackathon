"use client";
import AdCard from "@/components/AdCard";
import Marketplace from "@/components/Marketplace";
import { useWallet } from "@/context/WalletContext";
import { Input } from "@heroui/input";
import Link from "next/link";

const page = () => {
  const { provider } = useWallet();

  return (
    <div className=" min-h-screen">
      <div className=" mx-10 p-4">
        <div className=" bg-black ">
          <div className="max-w-4xl mx-auto p-7 flex justify-around">
            <h2 className="text-3xl font-bold text-white text-center">
              Ad Space Marketplace
            </h2>
            <div className="flex justify-center border border-gray-200 rounded-lg p-4">
              <Link href="/createAdspace">
                <button>Create new AdSpace</button>
              </Link>
            </div>
          </div>
        </div>
        <Marketplace provider={provider} />
              <AdCard />
      </div>
    </div>
  );
};

export default page;
