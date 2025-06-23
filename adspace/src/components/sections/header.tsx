"use client";
import { ArrowRightToLine, LogInIcon, ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import Image from "next/image";
import AdspaceLogo from "../ui/adspace-logo";
import Link from "next/link";

const Header: React.FC<{ className?: string }> = ({ className }) => {
  const [navStyles, setNavStyles] = useState("");

  const handleScroll = () => {
    if (window.scrollY > 100) {
      setNavStyles(" w-[44vw]");
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
      // style={{ y: y1 }}
      transition={{ duration: 1.75, delay: 0.5 }}
      className={cn('justify-between flex items-center z-50', className)}>
      <div className={cn('justify-between flex w-[64vw]  pl-3 pr-1 rounded-xl bg-[#dddddd77] z-50 transition-all backdrop-blur-xl duration-500 ease-in-out h-[52px]', navStyles)}>
        <div className='justify-between flex w-full items-center'>
          <div className='w-[120px] text-xl flex gap-1 items-center justify-start tracking-tight font-semibold cursor-pointer  text-white'>
            {/* <div className='rounded-xl border-zinc-200 border items-center p-[2px] font-sans'>
              <AdspaceLogo />
            </div> */}
            <div className="w-8 h-8 bg-[#f26522] rounded-sm ">
              <p className="text-white text-sm  pl-[4px] pt-[1px]">AD</p>
            </div>
            <div className="flex items-center justify-center text-white pb-1">
              Adspace
            </div>
            {typeof window !== 'undefined' && window.scrollY > 100 && (
              <div className='bg-zinc-400 ml-1 w-[2px] h-[24px] rounded-full transition-all ease-in-out duration-700'></div>
            )}
          </div>
          <div className=" gap-5 text-base text-zinc-900 duration-200 transition-all ease-in-out font-normal tracking-tight *:cursor-pointer hidden lg:flex px-4 self-center cursor-pointer *:opacity-65    *:hover:opacity-100">
            <Link href="/marketplace/market">
              <div>Marketplace</div>
            </Link>
            <Link href="/docs">
              <div>Docs</div>
            </Link>

            <Link href="/contact">
              <div>Contact</div>
            </Link>
          </div>

          <Button
            effect="gooeyLeft"
            icon={LogInIcon}
            iconPlacement="right"
            className="bg-zinc-900 hover:bg-zinc-900 rounded-lg px-4 h-[44px] items-center text-base tracking-tight font-normal font-sans gap-1 justify-center cursor-pointer hidden sm:flex text-white overflow-hidden"
          >
            Signup/Login
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default Header;
