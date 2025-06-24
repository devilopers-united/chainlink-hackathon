"use client"

import { Collaboration } from "@/components/sections/app-demo/collabration";
import { Features } from "@/components/sections/app-demo/features";
import Footer from "@/components/sections/footer";
import Header from "@/components/sections/header";
import { Hero } from "@/components/sections/hero";
import Interface from "@/components/sections/interface";
import { SamePage } from "@/components/sections/app-demo/same-page";
import { StreamlinedExperience } from "@/components/sections/app-demo/streamlined-experience";

export default function Home() {

  return (
    <div className="bg-[#121212] text-[#fdf9f0]">
      <main className="flex flex-col">
        <Hero />
        <Interface />
        <Footer />
      </main>
    </div>
  );
}
