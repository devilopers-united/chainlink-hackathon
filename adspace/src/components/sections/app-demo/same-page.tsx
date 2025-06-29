// import { BranchIcon } from "@/icons/branch";
import { useScroll, useTransform, motion } from "framer-motion";
import { useRef } from "react";

const animationOrder = {
  initial: 0,
  fadeInEnd: 0.15,
  showParagraphOne: 0.25,
  hideParagraphOne: 0.3,
  showParagraphTwoStart: 0.35,
  showParagraphTwoEnd: 0.4,
  hideParagraphTwo: 0.5,
  showLoadingScreenStart: 0.53,
  showLoadingScreenEnd: 0.58,
  createBranchStart: 0.65,
  createBranchEnd: 0.7,
  createBranchFadeInStart: 0.78,
  createBranchFadeInEnd: 0.85,
  endTextFadeInStart: 0.95,
  endTextFadeInEnd: 1,
};

export const SamePage = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"],
  });

  const opacity = useTransform(
    scrollYProgress,
    [
      animationOrder.initial,
      animationOrder.fadeInEnd,
      animationOrder.createBranchEnd,
      animationOrder.endTextFadeInStart,
    ],
    [0, 1, 1, 0]
  );
  const scale = useTransform(
    scrollYProgress,
    [
      animationOrder.initial,
      animationOrder.fadeInEnd,
      animationOrder.showLoadingScreenEnd,
      animationOrder.createBranchStart,
    ],
    [3, 1, 1, 0.75]
  );
  const x = useTransform(
    scrollYProgress,
    [
      animationOrder.initial,
      animationOrder.showParagraphOne,
      animationOrder.hideParagraphOne,
      animationOrder.showParagraphTwoStart,
      animationOrder.showParagraphTwoEnd,
      animationOrder.hideParagraphTwo,
      animationOrder.showLoadingScreenStart,
      animationOrder.showLoadingScreenEnd,
      animationOrder.createBranchEnd,
    ],
    ["50%", "50%", "55%", "-50%", "-50%", "-55%", "0%", "0%", "-27%"]
  );

  const loadingScreenOpacity = useTransform(
    scrollYProgress,
    [
      animationOrder.showLoadingScreenStart,
      animationOrder.showLoadingScreenEnd,
    ],
    [0, 1]
  );
  const loadingScreenX = useTransform(
    scrollYProgress,
    [animationOrder.createBranchStart, animationOrder.createBranchEnd],
    ["0%", "40%"]
  );
  const loadingScreenscale = useTransform(
    scrollYProgress,
    [animationOrder.createBranchStart, animationOrder.createBranchEnd],
    [1, 0.5]
  );

  const paragraph1Opacity = useTransform(
    scrollYProgress,
    [
      animationOrder.fadeInEnd + 0.02,
      animationOrder.showParagraphOne,
      animationOrder.hideParagraphOne,
    ],
    [0, 1, 0]
  );
  const paragraph1TranslateY = useTransform(
    scrollYProgress,
    [
      animationOrder.fadeInEnd + 0.02,
      animationOrder.showParagraphOne,
      animationOrder.hideParagraphOne,
    ],
    ["4rem", "0rem", "-4rem"]
  );

  const paragraph2Opacity = useTransform(
    scrollYProgress,
    [
      animationOrder.showParagraphTwoStart,
      animationOrder.showParagraphTwoEnd,
      animationOrder.hideParagraphTwo,
    ],
    [0, 1, 0]
  );
  const paragraph2TranslateY = useTransform(
    scrollYProgress,
    [
      animationOrder.showParagraphTwoStart,
      animationOrder.showParagraphTwoEnd,
      animationOrder.hideParagraphTwo,
    ],
    ["4rem", "0rem", "-4rem"]
  );

  const newBranchOpacity = useTransform(
    scrollYProgress,
    [
      animationOrder.createBranchFadeInStart,
      animationOrder.createBranchFadeInEnd,
    ],
    [0, 1]
  );

  const endTextOpacity = useTransform(
    scrollYProgress,
    [animationOrder.endTextFadeInStart, animationOrder.endTextFadeInEnd],
    [0, 1]
  );

  const endTexty = useTransform(
    scrollYProgress,
    [animationOrder.endTextFadeInStart, animationOrder.endTextFadeInEnd],
    ["4rem", "0rem"]
  );

  const position = useTransform(scrollYProgress, (pos) =>
    pos >= 1 ? "relative" : "fixed"
  );

  return (
    <section ref={containerRef}>
      <div className="relative h-[800vh]">
        <div className="sticky top-1/2 flex origin-center -translate-y-1/2 justify-center">
          <motion.div
            style={{ opacity: newBranchOpacity }} className="flex mx-auto justify-center text-white text-6xl w-full text-center -top-72 absolute">
            Amazings
            <div className="pl-3 text-orange-400">
                of Both!
            </div>
          </motion.div>
          <motion.div
            className="absolute left-1/2 top-1/2 h-[75vh] max-h-[48vw] translate-x-[calc(-50%_+_var(--x))] -translate-y-1/2 scale-[var(--scale)] "
            style={{ opacity, "--x": x, "--scale": scale } as any}
          >
            <img
              alt=""
              src="/publisher.svg"
              className="h-[75vh] max-h-[48vw] w-auto"
            />
            <motion.span
              className="mt-3 block text-6xl text-center text-white"
              style={{ opacity: newBranchOpacity }}
            >
              {/* <BranchIcon className="mr-3 inline-block h-12 w-12" /> Feature */}
              Publisher
            </motion.span>
          </motion.div>
          <motion.div
            className="absolute left-1/2 top-1/2 h-[75vh] max-h-[208vw] -translate-y-1/2  translate-x-[calc(-50%_+_var(--x))] scale-[var(--scale)]"
            style={
              {
                opacity: loadingScreenOpacity,
                "--x": loadingScreenX,
                "--scale": loadingScreenscale,
              } as any
            }
          >
            <img
              alt=""
              src="/advertiser.svg"
              className="h-[75vh] max-h-[48vw] w-auto"
            />
            <motion.div
              style={{ opacity: newBranchOpacity }}
              className="absolute inset-0"
            >
              <img
                alt=""
                src="/advertiser.svg"
                className="h-[75vh] max-h-[48vw] w-auto"
              />
            </motion.div>
            <motion.span
              className="mt-3 block text-6xl text-center text-white"
              style={{ opacity: newBranchOpacity }}
            >
              {/* <BranchIcon className="mr-3 inline-block h-12 w-12" /> Frontend */}
              Advertiser
            </motion.span>
          </motion.div>

          <motion.p
            className="absolute top-1/2 left-[calc(50%-32rem)] w-[30rem] translate-y-[calc(-50%_+_var(--y))] leading-tight text-white text-4xl"
            style={{ opacity: endTextOpacity, "--y": endTexty } as any}
          >
            <span className="text-orange-400">Built for flow</span>
            <br />
            Spin up a new branch for any sized project in seconds.
          </motion.p>
        </div>
        <motion.p
          style={
            {
              opacity: paragraph1Opacity,
              "--y": paragraph1TranslateY,
              position,
            } as any
          }
          className="top-1/2 left-[156px] w-[500px] translate-y-[calc(-50%_+_var(--y))] pl-16 text-6xl leading-tight text-white"
        >
          Not only share code,
          <span className="text-orange-400"> share the context.</span>
        </motion.p>
        <motion.p
          style={
            {
              opacity: paragraph2Opacity,
              "--y": paragraph2TranslateY,
              position,
            } as any
          }
          className="top-1/2 right-[156px] w-[500px] translate-y-[calc(-50%_+_var(--y))] pr-16 text-6xl leading-tight text-white"
        >
          Sometimes it's not about code.
          <br />
          <span className="text-orange-400">
            Get everybody on the same page. Literally.
          </span>
        </motion.p>
      </div>
    </section>
  );
};