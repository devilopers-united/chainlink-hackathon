import Header from "@/components/sections/header";
import Hero from "@/components/sections/hero";

export default function Home() {

  return (
    <>
      <Header className="sticky top-6 justify-center" />
      <main className="flex flex-col">
        <Hero />

        
      </main>
    </>
  );
}
