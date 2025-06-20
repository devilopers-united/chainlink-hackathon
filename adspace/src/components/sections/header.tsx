'use client'
import { ShoppingCart } from 'lucide-react';
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { motion } from 'framer-motion';
import { Button } from '../ui/button';
import Image from 'next/image';


const Header: React.FC<{ className?: string }> = ({ className }) => {
  const [navStyles, setNavStyles] = useState('')

  const handleScroll = () => {
    if (window.scrollY > 100) {
      setNavStyles("shadow-lg shadow-[#dddddd22] w-[44vw]");
    } else {
      setNavStyles("w-[64vw]");
    }
  }

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: -200 }}
      animate={{ opacity: 1, y: 0 }}
      // style={{ y: y1 }}
      transition={{ duration: 1.75, dealy: 2 }}
      className={cn('justify-between flex items-center z-50 top-10', className)}>
      <div className={cn('justify-between flex w-[64vw] md:px-1 px-4 rounded-full bg-[#dddddd77] z-50 transition-all backdrop-blur-xl duration-500 ease-in-out h-[52px]', navStyles)}>
        <div className='justify-between flex w-full items-center'>

          <div className='w-44 text-xl flex gap-2 items-center justify-start tracking-tight font-semibold cursor-pointer pl-4 text-zinc-900'>
            {/* <div className='rounded-xl border-zinc-200 border items-center p-[2px] font-sans'>
              <Image src="/SecretEyeLogo.svg" width={30} height={30} alt="" className='rounded-xl' loading='lazy' />
            </div> */}
            Secreteye
            {typeof window !== 'undefined' && window.scrollY > 100 && (
              <div className='bg-zinc-300 w-[1px] h-[20px] rounded-full transition-all duration-500'></div>
            )}
          </div>
          <div className=' gap-5 text-base text-zinc-900 *:opacity-65 hover:*:opacity-100 duration-200 transition-all ease-in-out font-normal tracking-tight *:cursor-pointer hidden md:flex px-4 self-center'>
            <div className="group flex items-center relative cursor-pointer">
              <div className="">About</div>
            </div>
            <div>Company</div>
            <div>Features</div>
            <div>Store</div>
          </div>

          <Button effect="gooeyLeft" icon={ShoppingCart} iconPlacement="right" className='bg-zinc-900 hover:bg-zinc-900 rounded-3xl w-44 h-[44px] items-center text-base tracking-tight font-normal font-sans gap-1 justify-center cursor-pointer hidden md:flex text-white overflow-hidden'>
            Get your tracker
          </Button>
        </div>
      </div>
    </motion.div>
  )
}

export default Header