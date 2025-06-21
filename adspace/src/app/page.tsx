import Header from "@/components/sections/header";
import { Hero } from "@/components/sections/hero";

export default function Home() {

  return (
    <div className="bg-[#121212] text-[#fdf9f0]">
      <Header className="sticky top-6 justify-center" />
      <main className="flex flex-col">
        <Hero />

        
      </main>
    </div>
  );
}
