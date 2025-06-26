"use client";
import { Button } from "./ui/button";
import { Bookmark, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ProgressiveBlur } from "./ui/progressive-blur";
import {
  MorphingDialog,
  MorphingDialogTrigger,
  MorphingDialogContent,
  MorphingDialogTitle,
  MorphingDialogImage,
  MorphingDialogSubtitle,
  MorphingDialogClose,
  MorphingDialogDescription,
  MorphingDialogContainer,
} from '@/components/ui/morphing-dialog';

interface AdSpace {
  tokenId: number;
  owner: string;
  websiteURL: string;
  spaceType: string;
  spaceId: string;
  category: string;
  height: number;
  width: number;
  tags: string[];
  hourlyRentalRate: string;
  status: string;
  name?: string;
  description?: string;
  image?: string;
}

const AdCard: React.FC<{ space: AdSpace | undefined }> = ({ space }) => {
  const router = useRouter();

  const [isHover, setIsHover] = useState(false);

  if (!space) {
    return null;
  }

  const handleViewDetails = () => {
    router.push(`/adSpace/details/${space.tokenId}`);
  };

  return (
    <MorphingDialog
      transition={{
        type: 'spring',
        bounce: 0.05,
        duration: 0.2,
      }}
    >
      <MorphingDialogTrigger
        style={{
          borderRadius: '12px',
        }}
        className='flex  flex-col overflow-hidden '
      >
        <div className="group relative w-[300px] h-[430px] rounded-3xl overflow-hidden shadow-lg 
      mb-4 transition-all duration-300 border-2 border-zinc-700 cursor-pointer"
          onMouseEnter={() => setIsHover(true)}
          onMouseLeave={() => setIsHover(false)}>
          {space.image ? (
            <img
              src={space.image}
              alt={`Ad Space ${space.tokenId}`}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-700" />
          )}

          <ProgressiveBlur
            className='pointer-events-none absolute bottom-0 left-0 h-[75%] w-full'
            blurIntensity={2}
            animate={isHover ? 'visible' : 'hidden'}
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1 },
            }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

          <div className="relative h-full flex flex-col justify-end p-6">
            <h3 className="text-xl font-bold text-white mb-1 line-clamp-1">
              {space.name || `Ad Space #${space.tokenId}`}
            </h3>

            {space.description && (
              <p className="text-gray-300 text-sm mb-3 line-clamp-2">
                {space.description}
              </p>
            )}

            <div className="flex flex-wrap gap-2 mb-4">
              {space.tags.length > 0 ? (
                space.tags.slice(0, 3).map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 rounded-full bg-gray-800/80 text-gray-300 text-xs font-medium"
                  >
                    {tag.length > 12 ? `${tag.substring(0, 10)}...` : tag}
                  </span>
                ))
              ) : (
                <span className="px-2 py-1 rounded-full bg-gray-800/80 text-gray-400 text-xs">
                  No tags
                </span>
              )}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-gray-700/50">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium text-white">
                  ${parseFloat(space.hourlyRentalRate).toFixed(2)}
                  <span className="text-gray-400 text-xs font-normal ml-1">
                    /hour
                  </span>
                </span>
              </div>

              <Button
                onClick={handleViewDetails}
                className="bg-white/20 hover:bg-white hover:text-black text-white rounded-xl px-6 font-semibold transition-all hover:cursor-pointer"
              >
                View
              </Button>
            </div>
          </div>
        </div>
      </MorphingDialogTrigger>
      <MorphingDialogContainer>
        <MorphingDialogContent
          style={{
            borderRadius: '36px',
          }}
          className='pointer-events-auto relative flex h-[95vh] min-w-[75vw] flex-col overflow-hidden border border-zinc-950/10 bg-white dark:border-zinc-50/10 dark:bg-zinc-900 sm:w-[500px]'
        >
          <MorphingDialogImage
            src='/eb-27-lamp-edouard-wilfrid-buquet.jpg'
            alt='A desk lamp designed by Edouard Wilfrid Buquet in 1925. It features a double-arm design and is made from nickel-plated brass, aluminium and varnished wood.'
            className='h-full w-full'
          />
          <div className='p-6'>
            <MorphingDialogTitle className='text-2xl text-zinc-950 dark:text-zinc-50'>
              EB27
            </MorphingDialogTitle>
            <MorphingDialogSubtitle className='text-zinc-700 dark:text-zinc-400'>
              Edouard Wilfrid Buquet
            </MorphingDialogSubtitle>
            <MorphingDialogDescription
              disableLayoutAnimation
              variants={{
                initial: { opacity: 0, scale: 0.8, y: 100 },
                animate: { opacity: 1, scale: 1, y: 0 },
                exit: { opacity: 0, scale: 0.8, y: 100 },
              }}
            >
              <p className='mt-2 text-zinc-500 dark:text-zinc-500'>
                Little is known about the life of Édouard-Wilfrid Buquet. He was
                born in France in 1866, but the time and place of his death is
                unfortunately a mystery.
              </p>
              <p className='text-zinc-500'>
                Research conducted in the 1970s revealed that he’d designed the
                “EB 27” double-arm desk lamp in 1925, handcrafting it from
                nickel-plated brass, aluminium and varnished wood.
              </p>
              <a
                className='mt-2 inline-flex text-zinc-500 underline'
                href='https://www.are.na/block/12759029'
                target='_blank'
                rel='noopener noreferrer'
              >
                Are.na block
              </a>
            </MorphingDialogDescription>
          </div>
          <MorphingDialogClose className='text-zinc-50' />
        </MorphingDialogContent>
      </MorphingDialogContainer>
    </MorphingDialog>
  );
};

export default AdCard;
