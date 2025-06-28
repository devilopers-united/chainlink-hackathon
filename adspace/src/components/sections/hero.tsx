"use client";

import Image from 'next/image';
import { easeInOutCubic } from '@/lib/animation';
import { motion, useScroll, useTransform } from "framer-motion";
import { Schibsted_Grotesk } from 'next/font/google';
import { useRef, useEffect } from 'react';
import { InteractiveHoverButton } from '../ui/interactive-hover-button';
import ImageSwap from '../ui/image-swap';

const schibstedGrotesk = Schibsted_Grotesk({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
});

export function Hero() {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["end end", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  useEffect(() => {
    const updateMousePosition = (ev: MouseEvent) => {
      if (!targetRef.current) return;
      const { clientX, clientY } = ev;
      targetRef.current.style.setProperty("--x", `${clientX}px`);
      targetRef.current.style.setProperty("--y", `${clientY}px`);
    };

    window.addEventListener("mousemove", updateMousePosition);
    return () => window.removeEventListener("mousemove", updateMousePosition);
  }, []);

  return (
    <motion.section
      style={{ opacity }}
      ref={targetRef}
      id="hero"
      className="min-h-screen pt-24 w-full overflow-hidden bg-[#121212] text-[#fdf9f0]"
    >
      <main className="mx-auto text-center relative px-4 max-w-7xl flex flex-col items-center justify-center">
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5, ease: easeInOutCubic }}
          className={` tracking-tighter font-black text-4xl sm:text-5xl md:text-7xl lg:text-8xl ${schibstedGrotesk.className} max-w-3xl mx-auto`}
        >
          Your data runs the world
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.7, ease: easeInOutCubic }}
          className="max-w-2xl mx-auto text-sm sm:text-lg md:text-xl text-center text-zinc-400 tracking-tight font-medium mb-4"
        >
          Unlock the value of your audience. Effortlessly connect your platform to premium advertisers and start earning in minutes.
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.9, ease: easeInOutCubic }}
        >
          <InteractiveHoverButton className='text-base sm:text-lg px-6 py-3'>
            Explore Marketplace
          </InteractiveHoverButton>
        </motion.div>

        <motion.div
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            scale: { delay: 0.2, duration: 1.2, ease: easeInOutCubic },
            opacity: { delay: 0.2, duration: 1.2, ease: easeInOutCubic },
          }}
          className="flex flex-wrap items-center justify-center mt-16 w-full"
        >

          <ImageSwap images={[
            { src: "/images/blog.svg", alt: "Blog" },
            { src: "/images/brand.svg", alt: "Brand" },
            { src: "/images/movies.svg", alt: "Movies" },
            { src: "/images/service.svg", alt: "Services" },
            { src: "/images/store.svg", alt: "Store" },
          ]} />
        
        </motion.div>
      </main>
    </motion.section>
  );
}
