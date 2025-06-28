"use client"
import Footer from "@/components/sections/footer";
import { Hero } from "@/components/sections/hero";
import Interface from "@/components/sections/interface";
import About from "@/components/sections/about";

export default function Home() {
  return (
    <div className="bg-[#121212] ">
      <main className="flex flex-col">
        <Hero />
        <About />
        <Interface />
        <Footer />
      </main>
    </div>
  );
}
