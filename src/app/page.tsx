"use client";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchCharacters } from "@/lib/utils";
import SafeImage from "@/components/SafeImage";

export default function Home() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  const { data } = useQuery({
    queryKey: ["characters"],
    queryFn: () => fetchCharacters(Math.floor(Math.random() * 100), ""),
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/character?name=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <div className="relative min-h-screen bg-black text-white font-[family-name:var(--font-geist-sans)]">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black z-10"></div>
      {/* Character image grid background */}
      <div className="absolute inset-0 grid grid-cols-6 gap-1 opacity-60 overflow-hidden">
        {data?.characters?.slice(0, 20).map((character, index) => (
          <div
            key={index}
            className="relative aspect-square bg-gray-800 overflow-hidden"
          >
            {character.imageUrl && (
              <SafeImage
                fallbackSrc="/fallback-image.PNG"
                src={character.imageUrl}
                alt={character.name}
                fill
                className="object-cover"
                priority={index < 12}
              />
            )}
          </div>
        ))}
      </div>

      {/* Hero content */}
      <div className="relative z-20 pt-32 pb-20 px-8 flex flex-col items-center justify-center text-center max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent animate-pulse">
          Mirror Mirror
        </h1>
        <h2 className="text-3xl md:text-5xl font-bold mb-6">
          Explore all your favorite Disney characters in one place.
        </h2>

        {/* Search form */}
        <form onSubmit={handleSearch} className="w-full max-w-md mb-8">
          <div className="flex">
            <input
              type="text"
              placeholder="Search for a character..."
              className="flex-grow px-5 py-3 bg-black/50 border border-gray-600 rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              type="submit"
              className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-r-md transition-colors"
            >
              Search
            </button>
          </div>
        </form>

        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <Button
            asChild
            size="lg"
            className="bg-primary hover:bg-primary/90 text-xl px-8 py-6"
          >
            <Link href="/character">Browse Characters</Link>
          </Button>

          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-gray-400 text-xl px-8 py-6 bg-black"
          >
            <Link href="/compare?characters=Mickey%20Mouse,Donald%20Duck">
              Try a Comparison
            </Link>
          </Button>
        </div>

        <p className="mt-12 text-sm text-gray-400">
          Enter a character name to search or browse our collection.
        </p>
      </div>
    </div>
  );
}
