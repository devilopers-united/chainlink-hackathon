import React from "react";
import { InstallationCode } from "../components/install-code";
import { FrameworkUseCode } from "../components/framework-use-code";
import { notFound } from "next/navigation";

const page = ({ params }: { params: { slug: string } }) => {
  const validSlugs = ["nextjs", "vite"];

  if (!validSlugs.includes(params.slug)) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-2 pt-12">
      {params.slug === "nextjs" ? (
        <>
          <InstallationCode />
          <FrameworkUseCode />
        </>
      ) : (
        <>
          <InstallationCode />
          <FrameworkUseCode />
        </>
      )}
    </div>
  );
};

export default page;
