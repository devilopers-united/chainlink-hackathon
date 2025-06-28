"use client";
import { ArrowRightToLine, LogInIcon, ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import Image from "next/image";
import Link from "next/link";
import { useWallet } from "@/context/WalletContext";

const Header: React.FC<{ className?: string }> = ({ className }) => {
  const { provider, account, error, connectWallet, disconnectWallet } =
    useWallet();
  const [navStyles, setNavStyles] = useState("w-[64vw]");

  const handleScroll = () => {
    if (window.scrollY > 100) {
      setNavStyles("w-[44vw]");
    } else {
      setNavStyles("w-[64vw]");
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: -200 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.75, delay: 0.5 }}
      className={cn("justify-between flex items-center z-50", className)}
    >
      <div
        className={cn(
          "justify-between flex pl-3 pr-1 rounded-xl bg-[#dddddd77] z-50 transition-all backdrop-blur-xl duration-500 ease-in-out h-[52px]",
          navStyles
        )}
      >
        <div className="justify-between flex w-full items-center">
          <Link href="/">
            <div className="w-32 text-xl flex gap-1 items-center justify-start tracking-tight font-semibold cursor-pointer text-white">
              <div className="w-8 h-8 bg-[#f26522] rounded-sm">
                <p className="text-white text-sm pl-1 pt-[1px]">AD</p>
              </div>
              <div className="flex items-center justify-center text-white pb-1">
                Adspace
              </div>
              {typeof window !== "undefined" && window.scrollY > 100 && (
                <div className="bg-zinc-400 mx-1 w-[2px] h-[24px] rounded-full transition-all ease-in-out duration-700"></div>
              )}
            </div>
          </Link>
          <div className="gap-5 text-base text-white duration-200 transition-all ease-in-out font-normal tracking-tight *:cursor-pointer hidden lg:flex px-4 self-center cursor-pointer *:opacity-65 *:hover:opacity-100 mx-auto">
            <Link
              href="/marketplace"
              className="opacity-65 hover:opacity-100"
            >
              Marketplace
            </Link>
            <Link href="/docs" className="opacity-65 hover:opacity-100">
              Docs
            </Link>
          </div>
          <div className="flex items-center gap-2">
            {account && (
              <span className="text-white text-sm bg-black/20 px-2 py-1 rounded">
                {`${account.substring(0, 6)}...${account.substring(
                  account.length - 4
                )}`}
              </span>
            )}
            <Button
              effect="gooeyLeft"
              className="bg-zinc-900 hover:bg-zinc-900 rounded-lg px-4 h-[44px] flex items-center justify-center gap-1 text-white font-normal tracking-tight"
              onClick={account ? disconnectWallet : connectWallet}
            >
              {account ? "Disconnect" : "Connect Wallet"}
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Header;