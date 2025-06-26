"use client";

import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  isLoading?: boolean;
  children?: React.ReactNode;
}

export const Skeleton = ({
  className,
  isLoading = true,
  children,
  ...props
}: SkeletonProps) => {
  if (!isLoading) return <>{children}</>;

  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-gradient-to-br from-gray-900 to-gray-800",
        className
      )}
      {...props}
    />
  );
};

export const SkeletonCard = () => {
  return (
    <div className="w-[300px] h-[430px] rounded-3xl overflow-hidden mb-4">
      <Skeleton className="h-full w-full">
        <div className="h-full flex flex-col justify-end p-6 space-y-3">
          <div className="h-6 w-3/4 rounded-full bg-gray-700" />
          <div className="h-4 w-full rounded-full bg-gray-700" />
          <div className="h-4 w-5/6 rounded-full bg-gray-700" />
          <div className="flex gap-2 pt-2">
            <div className="h-6 w-16 rounded-full bg-gray-700" />
            <div className="h-6 w-16 rounded-full bg-gray-700" />
          </div>
          <div className="flex justify-between items-center pt-4">
            <div className="h-5 w-20 rounded-full bg-gray-700" />
            <div className="h-9 w-24 rounded-full bg-gray-700" />
          </div>
        </div>
      </Skeleton>
    </div>
  );
};
