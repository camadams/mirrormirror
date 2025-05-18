"use client";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { fetchCharacters } from "@/lib/utils";
import {
  ArrowLeft,
  Award,
  Film,
  Heart,
  Shield,
  Tv,
  Gamepad2,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";
import SafeImage from "@/components/SafeImage";

export default function CharacterDetail() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CharacterContent />
    </Suspense>
  );
}

function CharacterContent() {
  const params = useParams();
  const characterName = decodeURIComponent(params.name as string);

  const { status, data, error, isLoading } = useQuery({
    queryKey: ["character", characterName],
    queryFn: () => fetchCharacters(1, characterName),
    staleTime: Infinity,
  });

  const character = data?.characters[0];

  // Define sections using an array for better maintainability
  const characterSections = [
    {
      title: "Films",
      icon: <Film className="h-5 w-5 mr-2" />,
      data: character?.films || [],
      colorClass: "bg-primary/10 text-primary",
    },
    {
      title: "Short Films",
      icon: <Film className="h-5 w-5 mr-2" />,
      data: character?.shortFilms || [],
      colorClass: "bg-cyan-100 text-cyan-800",
    },
    {
      title: "TV Shows",
      icon: <Tv className="h-5 w-5 mr-2" />,
      data: character?.tvShows || [],
      colorClass: "bg-purple-100 text-purple-800",
    },
    {
      title: "Video Games",
      icon: <Gamepad2 className="h-5 w-5 mr-2" />,
      data: character?.videoGames || [],
      colorClass: "bg-emerald-100 text-emerald-800",
    },
    {
      title: "Park Attractions",
      icon: <MapPin className="h-5 w-5 mr-2" />,
      data: character?.parkAttractions || [],
      colorClass: "bg-amber-100 text-amber-800",
    },
    {
      title: "Allies",
      icon: <Heart className="h-5 w-5 mr-2" />,
      data: character?.allies || [],
      colorClass: "bg-rose-100 text-rose-800",
    },
    {
      title: "Enemies",
      icon: <Shield className="h-5 w-5 mr-2" />,
      data: character?.enemies || [],
      colorClass: "bg-red-100 text-red-800",
    },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto p-6 pb-20 sm:p-8 font-[family-name:var(--font-geist-sans)]">
      <Button
        variant="ghost"
        size="sm"
        asChild
        className="mb-6 hover:bg-primary/10 text-primary"
      >
        <Suspense>
          <GoBack />
        </Suspense>
      </Button>

      {isLoading ? (
        <CharacterDetailSkeleton />
      ) : status === "error" ? (
        <div className="bg-destructive/10 text-destructive p-6 rounded-lg text-center">
          <p className="font-semibold">Error loading character</p>
          <p className="text-sm mt-2">{(error as Error).message}</p>
        </div>
      ) : !character ? (
        <div className="bg-muted p-6 rounded-lg text-center">
          <p className="font-semibold">No character data found</p>
        </div>
      ) : (
        <div className="bg-card rounded-xl shadow-lg overflow-hidden">
          {/* Character Header */}
          <div className="bg-primary/5 p-6 sm:p-8 flex flex-col md:flex-row gap-6 items-center md:items-start">
            <div className="relative w-48 h-48 md:w-64 md:h-64 overflow-hidden border-4 border-primary/20 shadow-lg">
              <SafeImage
                src={character.imageUrl}
                fallbackSrc="/fallback-image.PNG"
                alt={character.name}
                fill
                className="object-cover bg-white"
                priority
              />
            </div>

            <div className="text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-bold text-primary animate-float">
                {character.name}
              </h1>
              <div className="mt-4 flex flex-wrap gap-2 justify-center md:justify-start">
                {characterSections
                  .filter((section) => section.data.length > 0)
                  .map((section) => (
                    <div
                      key={section.title}
                      className={`${section.colorClass} px-3 py-1 rounded-full text-xs font-medium flex items-center`}
                    >
                      {section.icon}
                      <span>
                        {section.data.length} {section.title}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Character Content */}
          <div className="p-6 sm:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {characterSections.map(
                (section) =>
                  section.data.length > 0 && (
                    <div
                      key={section.title}
                      className="bg-muted/30 rounded-lg p-5 border border-muted/30"
                    >
                      <h3 className="text-xl font-semibold mb-3 flex items-center text-primary">
                        {section.icon}
                        {section.title}
                      </h3>
                      <ul className="space-y-2">
                        {section.data.map((item, index) => (
                          <li
                            key={index}
                            className="pl-4 border-l-2 border-primary/20 hover:border-primary/80 transition-colors"
                          >
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function GoBack() {
  const searchParams = useSearchParams();
  const currentQuery = Object.fromEntries(searchParams.entries());
  return (
    <Link href={{ pathname: "/character", query: currentQuery }}>
      <ArrowLeft className="mr-2 h-4 w-4" />
      Back to all characters
    </Link>
  );
}

function CharacterDetailSkeleton() {
  return (
    <div className="bg-card rounded-xl shadow-lg overflow-hidden animate-pulse">
      <div className="bg-primary/5 p-6 sm:p-8 flex flex-col md:flex-row gap-6 items-center md:items-start">
        <Skeleton className="w-48 h-48 md:w-64 md:h-64 rounded-full" />
        <div className="text-center md:text-left w-full">
          <Skeleton className="h-12 w-48 md:w-64 mb-4" />
          <div className="flex flex-wrap gap-2 justify-center md:justify-start">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-24 rounded-full" />
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
        </div>
      </div>
      <div className="p-6 sm:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-muted/30 rounded-lg p-5">
              <Skeleton className="h-8 w-32 mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-4 w-5/6 mb-2" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
