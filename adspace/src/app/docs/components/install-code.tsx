"use client";

import React from "react";

import { CodeBlock } from "@/components/ui/code-block";

export function InstallationCode() {
    const code = `npm install adspace-provider`;

    return (
        <div className="max-w-3xl mx-auto w-full mt-16">
            <CodeBlock
                language="jsx"
                filename="NPM Installation"
                highlightLines={[9, 13, 14, 18]}
                code={code}
            />
        </div>
    );
}
