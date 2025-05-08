"use client";
import Comparison from "@/components/Comparison";
import { Suspense } from "react";

// Simple loading component
function ComparisonLoading() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="text-lg text-primary animate-pulse">
        Loading comparison...
      </div>
    </div>
  );
}

export default function Compare() {
  return (
    <div className="items-center w-full p-8 pb-20 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <Suspense fallback={<ComparisonLoading />}>
        <Comparison />
      </Suspense>
    </div>
  );
}
