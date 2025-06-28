import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import React from "react";
import Link from "next/link";

const Page = () => {
  const frameworks = [
    {
      name: "Next.js",
      href: "/docs/nextjs",
      description:
        "For production-ready React applications with server-side rendering",
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 128 128">
          <path
            d="M64 0C28.7 0 0 28.7 0 64s28.7 64 64 64c11.2 0 21.7-2.9 30.8-7.9L48.4 55.3v36.6h-6.8V41.8h6.8l50.5 75.8C116.4 106.2 128 86.5 128 64c0-35.3-28.7-64-64-64zm22.1 84.6l-7.5-11.3V41.8h7.5v42.8z"
            fill="currentColor"
          ></path>
        </svg>
      ),
    },
    {
      name: "Vite",
      href: "/docs/vite",
      description: "For lightning-fast development with instant server start",
      icon: (
        <svg
          width="24px"
          height="24px"
          viewBox="0 0 32 32"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
        >
          <title>file_type_vite</title>
          <path
            d="M29.8836 6.146L16.7418 29.6457c-.2714.4851-.9684.488-1.2439.0052L2.0956 6.1482c-.3-.5262.1498-1.1635.746-1.057l13.156 2.3516a.7144.7144 0 00.2537-.0004l12.8808-2.3478c.5942-.1083 1.0463.5241.7515 1.0513z"
            fill="url(#paint0_linear)"
          />
          <path
            d="M22.2644 2.0069l-9.7253 1.9056a.3571.3571 0 00-.2879.3294l-.5982 10.1038c-.014.238.2045.4227.4367.3691l2.7077-.6248c.2534-.0585.4823.1647.4302.4194l-.8044 3.9393c-.0542.265.1947.4918.4536.4132l1.6724-.5082c.2593-.0787.5084.1487.4536.414l-1.2784 6.1877c-.08.387.4348.598.6495.2662L16.5173 25 24.442 9.1848c.1327-.2648-.096-.5667-.387-.5106l-2.787.5379c-.262.0505-.4848-.1934-.4109-.4497l1.8191-6.306c.074-.2568-.1496-.5009-.4118-.4495z"
            fill="url(#paint1_linear)"
          />
          <defs>
            <linearGradient
              id="paint0_linear"
              x1="6.0002"
              y1="32.9999"
              x2="235"
              y2="344"
              gradientUnits="userSpaceOnUse"
              gradientTransform="matrix(.07142 0 0 .07142 1.3398 1.8944)"
            >
              <stop stopColor="#41D1FF" />
              <stop offset="1" stopColor="#BD34FE" />
            </linearGradient>
            <linearGradient
              id="paint1_linear"
              x1="194.651"
              y1="8.8182"
              x2="236.076"
              y2="292.989"
              gradientUnits="userSpaceOnUse"
              gradientTransform="matrix(.07142 0 0 .07142 1.3398 1.8944)"
            >
              <stop stopColor="#FFEA83" />
              <stop offset=".0833" stopColor="#FFDD35" />
              <stop offset="1" stopColor="#FFA800" />
            </linearGradient>
          </defs>
        </svg>
      ),
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8 m-8">
      <div className="px-4 md:px-8 flex flex-col md:flex-row w-full justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white">Installation</h1>
            <p className="text-gray-300 pb-4 mt-2 text-base md:text-sm">
            Integrate the Tokenized Adspace component into your application to enable seamless, on-chain management and monetization of advertising space. Follow the steps below to get started with installation and configuration.
            </p>
        </div>
      </div>

      <div className="mb-12 p-8 bg-[#1a1a1a] rounded-2xl">
        <h2 className="text-2xl font-semibold text-white mb-4">
          Pick Your Framework
        </h2>
        <p className="text-lg text-gray-300 mb-6">
          shadcn/ui is built to work with all React frameworks. Start by
          selecting your framework of choice, then follow the instructions to
          install the dependencies and structure your app.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {frameworks.map((framework) => (
            <Link key={framework.name} href={framework.href} passHref>
              <div className="h-full p-6 bg-gray-800 rounded-xl border border-gray-700 transition-all duration-300 flex flex-col hover:cursor-pointer">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-gray-700 rounded-lg mr-4">
                    {framework.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-white">
                    {framework.name}
                  </h3>
                </div>
                <p className="text-gray-400 mb-4 flex-grow">
                  {framework.description}
                </p>
                <div className="flex items-center">
                  <Button variant="link" className="text-blue-400 p-0 h-auto">
                    Get started <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Page;
