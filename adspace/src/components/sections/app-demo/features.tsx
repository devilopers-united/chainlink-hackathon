import { stylesWithCssVar } from "@/utils/motion";
import { useScroll, useTransform, motion } from "framer-motion";
import { useRef } from "react";

export const Features = () => {
  const targetRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "end end"],
  });

  const scale = useTransform(scrollYProgress, [0, 0.9, 1], [0.8, 0.8, 1]);
  const x = useTransform(scrollYProgress, [0.3, 1], ["50%", "0%"]);
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.5, 0.6, 0.85, 0.9],
    [1, 1, 0.4, 0.4, 1]
  );

  const text1Opacity = useTransform(
    scrollYProgress,
    [0.3, 0.4, 0.5],
    [0, 1, 0]
  );
  const text1Y = useTransform(
    scrollYProgress,
    [0.3, 0.4, 0.5],
    ["30px", "0px", "-30px"]
  );

  const text2Opacity = useTransform(
    scrollYProgress,
    [0.5, 0.6, 0.7],
    [0, 1, 0]
  );
  const text2Y = useTransform(
    scrollYProgress,
    [0.5, 0.6, 0.7],
    ["30px", "0px", "-30px"]
  );

  const text3Opacity = useTransform(
    scrollYProgress,
    [0.7, 0.8, 0.9],
    [0, 1, 0]
  );
  const text3Y = useTransform(
    scrollYProgress,
    [0.7, 0.8, 0.9],
    ["30px", "0px", "-30px"]
  );

  return (
    <section
      ref={targetRef}
      className="flex h-[500vh] flex-col items-center justify-start"
    >
      <div className="sticky top-[16.7vh] h-[66.8vh] px-16 text-2xl leading-[1] text-white [&_p]:w-[45rem] [&_p]:max-w-[90%]">
        <motion.div style={{ x, scale }} className="relative h-full">
          <motion.figure style={{ opacity }} className="h-full">
            <img alt="" src="/code-use.svg" className="h-full w-auto" />
          </motion.figure>
          <motion.figure style={{ opacity: text2Opacity }}>
            <img
              alt=""
              src="/command-palette.svg"
              className="absolute inset-0 h-full w-auto"
            />
          </motion.figure>
          <motion.figure style={{ opacity: text3Opacity }}>
            <img
              alt=""
              src="/devtools.svg"
              className="absolute inset-0 h-full w-auto"
            />
          </motion.figure>
        </motion.div>
        <motion.p
          style={stylesWithCssVar({
            opacity: text1Opacity,
            "--y": text1Y,
          })}
          className="translate-y-centered-offset absolute text-2xl pr-56 top-1/3 left-0"
        >
          <span className="text-orange-400 text-3xl">
            Effortless Integration for Developers & Publishers
          </span>
          <br />
          Instantly embed AD spaces into your dApp or website - no custom coding required. Focus on building, while we handle the AD tech.
        </motion.p>
        <motion.p
          style={stylesWithCssVar({
            opacity: text2Opacity,
            "--y": text2Y,
          })}
          className="translate-y-centered-offset absolute top-1/3 pr-56 text-2xl left-0"
        >
          <span className="text-orange-400 text-3xl">
            Seamless Wallet Connection, Unmatched Security!
          </span>
          <br />
          Effortlessly connect your wallet and explore a secure, transparent ecosystem - powered by blockchain, protected from risks.
        </motion.p>
        <motion.p
          style={stylesWithCssVar({
            opacity: text3Opacity,
            "--y": text3Y,
          })}
          className="translate-y-centered-offset absolute top-1/3 text-2xl pr-56 left-0"
        >
          <span className="text-orange-400 text-3xl">
            Discover, Connect, and Earn - All Anonymously
          </span>
          <br />
          Unlock a world of engaging content and fair rewards. Every interaction supports creators and enthusiasts, empowering you to earn more while protecting your privacy.
        </motion.p>
      </div>
    </section>
  );
};
