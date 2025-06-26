"use client";

import Image from 'next/image';
import { Section } from "@/components/ui/section";
import { easeInOutCubic } from '@/lib/animation';
import { motion, useScroll, useTransform } from "framer-motion";
import { Schibsted_Grotesk } from 'next/font/google';
import AnimatedText from '../ui/animated-text';
import { TextReveal } from '../ui/text-reveal';
import { useRef, useEffect } from 'react';

const schibstedGrotesk = Schibsted_Grotesk({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
});

export function Hero() {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["end end", "end start"]
  })

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const position = useTransform(scrollYProgress, (pos) => {
    pos >= 1 ? "relative" : "fixed"
  })

  useEffect(() => {
    const updateMousePosition = (ev: MouseEvent) => {
      if (!targetRef.current) return;
      const { clientX, clientY } = ev;
      targetRef.current.style.setProperty("--x", `${clientX}px`);
      targetRef.current.style.setProperty("--y", `${clientY}px`);
    };

    window.addEventListener("mousemove", updateMousePosition);

    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
    };
  }, []);

  const { scrollY } = useScroll({
    offset: ["start start", "end start"],
  });
  const y1 = useTransform(scrollY, [0, 300], [100, 0]);
  const y2 = useTransform(scrollY, [0, 300], [50, 0]);
  const y3 = useTransform(scrollY, [0, 300], [0, 0]);
  const y4 = useTransform(scrollY, [0, 300], [50, 0]);
  const y5 = useTransform(scrollY, [0, 300], [100, 0]);

  return (
    <>
      <motion.section
        style={{ opacity }}
        ref={targetRef}
        id="hero" className="min-h-[100vh] pt-28 w-full overflow-hidden bg-[#121212] text-[#fdf9f0]">
        <main className="mx-auto md:pt-0 sm:pt-8 text-center relative px-4">
          <div className="relative">
            <motion.div
              initial={{ scale: 4.5, height: "80vh" }}
              animate={{ scale: 1, height: "10vh" }}
              transition={{
                scale: { delay: 0, duration: 1.8, ease: easeInOutCubic },
                height: { delay: 0, duration: 1.8, ease: easeInOutCubic },
              }}
              className="mb-10 relative z-20"
              style={{ transformOrigin: "top" }}
            >
              <div className="bg-white text-white text-xl font-bold h-20 w-20 flex items-center justify-center rounded-3xl mx-auto shadow-md">
              </div>
            </motion.div>

            {/* <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="absolute inset-0 top-20 z-10"
          >
            Secreteye
          </motion.div> */}
          </div>

          <div className="max-w-5xl mx-auto">
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5, ease: easeInOutCubic }}
              className="text-5xl font-bold mb-4 tracking-tighter"
            >
              <div className={` ${schibstedGrotesk.className} text-8xl px-24 font-sans font-black tracking-tighter text-center pt-0`}>
                Your data runs the world
              </div>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.7, ease: easeInOutCubic }}
              className="max-w-xl mx-auto text-base text-center text-zinc-400 tracking-tight font-medium"
            >
              A powerful, user-friendly tool to quickly montetize your platform.
            </motion.p>


            <div className="flex justify-center">

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1 }}
                className='w-full justify-center items-center flex pt-6 pb-2'
              >
                Get Started
              </motion.div>
            </div>
          </div>


          <motion.div
            initial={{ opacity: 0, x: -200 }}
            animate={{ opacity: 1, x: 0 }}
            // style={{ y: y1 }}
            transition={{ duration: 1, delay: 1 }}
            className='flex flex-nowrap items-center justify-center h-auto sm:h-[500px] select-none mt-20'
          >
          </motion.div>



        </main>

      </motion.section>
      {/* <TextReveal children="I am rahul lorem lorem lorem lorem sahani sleek I am rahul lorem lorem lorem lorem sahani sleek  I am rahul lorem lorem lorem lorem sahani sleek v I am rahul lorem lorem lorem lorem sahani sleek  I am rahul lorem lorem lorem lorem sahani sleek I am rahul lorem lorem lorem lorem sahani sleek  " /> */}
    </>
  );
}
