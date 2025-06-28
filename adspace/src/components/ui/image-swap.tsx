import React, { useRef, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

type ImageType = {
    src: string;
    alt: string;
};

interface ImageSwapProps {
    images: ImageType[];
}

const spring = {
    type: "spring" as const,
    stiffness: 500,
    damping: 30,
    bounce: 0.5,
};

const ImageSwap: React.FC<ImageSwapProps> = ({ images }) => {
    const swapCountRef = useRef(0);
    const [displayImages, setDisplayImages] = React.useState(images);

    useEffect(() => {
        const interval = setInterval(() => {
            // Pick 3 unique indices
            const indices = new Set<number>();
            while (indices.size < 3 && images.length >= 3) {
                indices.add(Math.floor(Math.random() * images.length));
            }
            if (indices.size === 3) {
                const [i1, i2, i3] = Array.from(indices);
                setDisplayImages((prevImages) => {
                    const newImages = [...prevImages];
                    // Rotate the 3 images: i1 -> i2, i2 -> i3, i3 -> i1
                    const temp = newImages[i1];
                    newImages[i1] = newImages[i3];
                    newImages[i3] = newImages[i2];
                    newImages[i2] = temp;
                    return newImages;
                });
            }
        }, 3500); // Increase interval for smoother transitions
        return () => clearInterval(interval);
    }, [images.length]);

    return (
        <div className="flex w-full">
            {displayImages.map((img, i) => (
                <motion.div
                    key={img.alt}
                    layout
                    transition={spring}
                    className="flex-1 min-w-[120px] max-w-[160px] sm:max-w-[400px] md:max-w-[256px] flex justify-center"
                >
                    <Image
                        src={img.src}
                        alt={img.alt}
                        width={256}
                        height={256}
                        className="w-full h-auto object-contain"
                        priority={i === 0}
                    />
                </motion.div>
            ))}
        </div>
    );
};

export default ImageSwap;