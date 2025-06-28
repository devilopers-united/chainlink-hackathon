import React from 'react'
import Image from 'next/image';
import { Familjen_Grotesk } from "next/font/google";
import { motion } from "framer-motion";
import { TextReveal } from '../ui/text-reveal';


const Grotesk = Familjen_Grotesk({
    weight: "variable",
    subsets: ["latin"]
});

const About = () => {
    return (
        <div className='w-[90vw] border-2 border-[#dddddd77] bg-white overflow-hidden mx-auto rounded-4xl pb-10 my-28 mb-16'>
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className={
                    `text-9xl text-black tracking-tighter font-[1000] w-full text-justify pt-12 px-16 mx-auto ${Grotesk.className}`
                }
            >
                The Age of
                Decentralized
                <br />
                <div className='flex items-center'>
                    <Image
                        src={"/images/blog.svg"}
                        alt=""
                        width={96}
                        height={96}
                        className="object-contain"
                    />
                    <Image
                        src={"/images/store.svg"}
                        alt=""
                        width={96}
                        height={96}
                        className="object-contain"
                    />
                    <div className='pb-4 pl-4'>
                        ADs
                    </div>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
                className='text-black px-16 flex'
            >
                <div className='text-xl w-sm'>
                    Why is decentralized intelligence important?
                </div>

                <div className='w-1/2 h-auto'>
                    <TextReveal className='text-black h-[50vh]'>Magic UI will change the way you design.</TextReveal>

                </div>
            </motion.div>

        </div>
    )
}

export default About