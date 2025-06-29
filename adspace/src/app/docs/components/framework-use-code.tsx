"use client";

import React from "react";

import { CodeBlock } from "@/components/ui/code-block";

export function FrameworkUseCode() {
  const code = `import { AdspaceProvider } from "adspace-provider"
 
  export default function RootLayout({children}) {
    return (
      <div>
        // TokenId will be provided to you when you create an AdSpace
        <AdspaceProvider tokenId={1} />
        <body>
          {children}
        </body>
      </div>
    )
  }
`;

  return (
    <div className="max-w-3xl mx-auto w-full">
      <CodeBlock
        language="jsx"
        filename="@app/layout.tsx"
        highlightLines={[1, 6, 7]}
        code={code}
      />
    </div>
  );
}
