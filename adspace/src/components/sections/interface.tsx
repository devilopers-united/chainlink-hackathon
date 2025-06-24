"use client";
import React from "react";
import { Section } from "../ui/section";
import { motion, useScroll } from "framer-motion";
import { useRef } from "react";
import { Features } from "./app-demo/features";
import { SamePage } from "./app-demo/same-page";
import { StreamlinedExperience } from "./app-demo/streamlined-experience";
import { Collaboration } from "./app-demo/collabration";

const Interface = () => {
  return (
    <Section>
      <div className="relative z-10 w-full overflow-x-clip">
        <Collaboration />
        <SamePage />
        <StreamlinedExperience />
        <Features />
      </div>
    </Section>
  );
};

export default Interface;
