"use client";
import { useWallet } from "@/context/WalletContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DocsPage() {
  const { account } = useWallet();
  const router = useRouter();

  useEffect(() => {
    if (!account) {
      router.push("/");
    }
  }, [account, router]);

  if (!account) return null;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-white">Docs</h1>
      <p className="text-gray-300">Documentation content goes here.</p>
    </div>
  );
}
