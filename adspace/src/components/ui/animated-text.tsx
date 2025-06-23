import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface AnimatedTextProps {
    text: string;
    keywords?: { [word: string]: string }; // e.g. { "sleek": "bg-orange-400", "dynamic": "bg-green-400" }
    className?: string;
}

function splitWords(text: string) {
    // Split by spaces, keep punctuation attached to words
    return text.split(/\s+/).map((word, i) => ({
        word,
        key: `${word}-${i}`,
    }));
}

const AnimatedText: React.FC<AnimatedTextProps> = ({
    text,
    keywords = {},
    className = "",
}) => {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"],
    });

    // Animate progress for the whole block
    const blockOpacity = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0]);
    const blockY = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [40, 0, 0, -40]);

    // Split text into words
    const words = splitWords(text);

    return (
        <motion.div
            ref={ref}
            className={`relative w-full max-w-2xl mx-auto text-center py-8 ${className}`}
            style={{ opacity: blockOpacity, y: blockY }}
        >
            <div className="flex flex-wrap justify-center gap-x-2 gap-y-3">
                {words.map(({ word, key }, i) => {
                    // Normalize for keyword matching
                    const clean = word.replace(/[.,!?;:()"'`]/g, "").toLowerCase();
                    const isKeyword = keywords[clean];
                    // Per-word animation
                    const start = i / words.length;
                    const end = (i + 1) / words.length;
                    const wordOpacity = useTransform(scrollYProgress, [start, end], [0, 1]);
                    const highlightOpacity = useTransform(scrollYProgress, [start, end * 0.95], [1, 0]);
                    return (
                        <motion.span
                            key={key}
                            className="relative inline-block"
                            style={{ opacity: wordOpacity }}
                        >
                            {/* Highlight block */}
                            <motion.span
                                className={`absolute inset-0 rounded-full transition-all will-change-transform ${
                                    isKeyword
                                        ? `${isKeyword} opacity-80`
                                        : "bg-gray-700 opacity-60"
                                }`}
                                style={{
                                    zIndex: 0,
                                    opacity: highlightOpacity,
                                }}
                                aria-hidden
                            />
                            {/* Actual word */}
                            <span className="relative z-10 px-2 py-1 font-bold text-white select-none">
                                {word}
                            </span>
                        </motion.span>
                    );
                })}
            </div>
        </motion.div>
    );
};

export default AnimatedText;