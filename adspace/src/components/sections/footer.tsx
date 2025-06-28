import React from 'react'
import CardSwap, { Card } from "@/components/ui/card-swap"
import { Code, Codesandbox, SlidersHorizontal } from 'lucide-react'

const Footer = () => {
    return (
        <div className='w-[80vw] border-2 border-[#dddddd77] overflow-hidden mx-auto rounded-4xl pb-10 mb-16'>
        <div className='absolute pt-40 pl-20'>
            <div className='text-5xl'>Hello</div>
            <div className='text-lg py-2 pl-0.5'>Hello</div>
        </div>
            <div className='h-[500px] right-4 w-full relative'>
                <CardSwap
                    cardDistance={60}
                    verticalDistance={75}
                    delay={3000}
                    pauseOnHover={false}
                >
                    <Card>
                        <div className='py-4 px-3 flex gap-1 items-center'>
                            <Codesandbox />
                            <div className='text-xl'>Decentralized</div>
                        </div>
                        <div className='w-full h-[1px] bg-white'></div>
                        <video autoPlay loop playsInline className='m-3 rounded-xl'>
                            <source src="https://cdn.dribbble.com/userupload/7053861/file/original-7956be57144058795db6bb24875bdab9.mp4" type="video/mp4" />
                        </video>
                    </Card>
                    <Card>
                        <div className='py-4 px-3 flex gap-1 items-center'>
                            <Code />
                            <div className='text-xl'>Reliable</div>
                        </div>
                        <div className='w-full h-[1px] bg-white'></div>
                        <video autoPlay loop playsInline className='m-3 rounded-xl'>
                            <source src="https://cdn.dribbble.com/userupload/7078020/file/original-b071e9063d9e3ba86a85a61b9d5a7c42.mp4" type="video/mp4" />
                        </video>
                    </Card>
                    <Card>
                        <div className='py-4 px-3 flex gap-1 items-center'>
                            <SlidersHorizontal />
                            <div className='text-xl'>Cutomizable</div>
                        </div>
                        <div className='w-full h-[1px] bg-white'></div>
                        <video autoPlay loop playsInline className='m-3 rounded-xl'>
                            <source src="https://cdn.dribbble.com/userupload/7098541/file/original-0b063b12ca835421580e6034368ad95a.mp4" type="video/mp4" />
                        </video>
                    </Card>
                </CardSwap>
            </div>
        </div>
    )
}

export default Footer


