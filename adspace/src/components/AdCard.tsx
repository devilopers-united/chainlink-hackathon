import React from 'react'
import { Button } from './ui/button'
import { ProgressiveBlur } from '@/components/core/progressive-blur';
import { Bookmark, Star } from 'lucide-react';


const AdCard = () => {
    return (
        <div className='w-fit rounded-4xl cursor-pointer bg-[#121212]'>
            <div className='relative h-[400px] w-[280px] overflow-hidden rounded-3xl'>
                <img
                    src='https://cdn.cosmos.so/c4653e73-d082-42e9-87d2-5377d7e6a7f3?format=jpeg'
                    alt='Benjamin Spiers - Moonlight 2023'
                    className='absolute inset-0'
                />
                <ProgressiveBlur
                    className='pointer-events-none absolute bottom-0 left-0 h-[60%] w-full'
                    blurIntensity={8}
                />
                <div className='absolute bottom-0 left-0'>
                    <div className='flex flex-col items-start gap-0 px-5 py-4'>
                        <p className='text-2xl font-medium text-white pb-2'>Cal.com</p>
                        <span className='mb-2 text-base text-zinc-100 tracking-tight leading-none '>A fully customizable scheduling software for individuals, businesses taking calls.</span>

                        <div className='gap-1 flex *:px-2 *:py-0.5 *: *:rounded-sm text-xs '>
                            <div className='bg-[#2b2b2b]'>Tech</div>
                            <div className='bg-white text-black'>Position: Header</div>
                        </div>

                        <div className='w-full flex justify-between items-center px-3'>
                            <div className='flex flex-col items-center pb-3 w-1/3'>
                                <div className='flex items-center gap-[1px] font-semibold'><Star size={16} /> 4.8</div>
                                <div className='text-sm text-zinc-200 text-center'>Rating</div>
                            </div>

                            <div className='h-6 bg-zinc-200 w-0.5 mb-2 mx-4'></div>
                            <div className='flex flex-col items-center pb-3 w-1/3'>
                                <div className='flex items-center gap-[1px] font-semibold'>56K+</div>
                                <div className='text-sm text-zinc-200 text-center'>Reach</div>
                            </div>

                            <div className='h-6 bg-zinc-200 w-0.5 mb-2 mx-4'></div>
                            <div className='flex flex-col items-center pb-3 w-1/3'>
                                <div className='flex items-center gap-[1px] font-semibold'> $50/m</div>
                                <div className='text-sm text-zinc-200 text-center'>Rate</div>
                            </div>
                        </div>

                        <div className='w-full h-full flex items-center justify-stretch'>
                            <Button className='bg-white text-black rounded-full min-w-3/4 hover:bg-[#175dfb] hover:text-white'>Monetize</Button>
                            <div className='py-2 bg-[#2b2b2b] border-1 border-zinc-900 w-full items-center justify-center flex rounded-full ml-1'>
                                <Bookmark size={20} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdCard