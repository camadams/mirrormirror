"use client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Suspense, useEffect, useState } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { useDebouncedValue } from "@tanstack/react-pacer";
import Link from "next/link";
import { fetchCharacters } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Search, Eye, GitCompare, X } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import DisneyMusicPlayer from "@/components/DisneyMusicPlayer";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import type { Character } from "@/lib/types";

export default function Character() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Main />
    </Suspense>
  );
}

function Main() {
  const [page, setPage] = useState(1);
  const [name, setName] = useState("");

  const router = useRouter();

  const searchParams = useSearchParams();
  const currentQuery = Object.fromEntries(searchParams.entries());

  const [debouncedName] = useDebouncedValue(name, {
    wait: 500,
    onExecute: () => setPage(1),
  });

  const { status, data, error, isFetching, isPlaceholderData } = useQuery({
    queryKey: ["characters", page, debouncedName],
    queryFn: () => fetchCharacters(page, debouncedName),
    staleTime: Infinity,
    gcTime: Infinity,
  });

  const queryClient = useQueryClient();
  useEffect(() => {
    if (!isPlaceholderData && data?.hasMore) {
      queryClient.prefetchQuery({
        queryKey: ["characters", page + 1, debouncedName],
        queryFn: () => fetchCharacters(page + 1, debouncedName),
      });
    }
  }, [data, isPlaceholderData, page, debouncedName, queryClient]);

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    setName(e.target.value);
  }

  function handleRemoveCharacter(characterName: string) {
    const newQuery = new URLSearchParams(currentQuery);
    const characters = newQuery.get("characters");
    const charactersArr = characters?.split(",") || [];
    if (charactersArr.length > 1) {
      const charactersList = charactersArr.filter(
        (name) => name !== characterName
      );
      newQuery.set("characters", charactersList[0]);
    } else {
      newQuery.delete("characters");
    }
    router.push(`${window.location.pathname}?${newQuery.toString()}`);
  }

  return (
    <div className="w-full px-6 pb-20 sm:px-12 font-[family-name:var(--font-geist-sans)]">
      {/* Fixed Header with Pagination */}
      <div className="sticky top-2 z-30 bg-background/80 backdrop-blur-sm rounded-lg mb-6 p-1">
        <h1 className="text-3xl font-bold text-primary mb-1">
          Disney Characters
        </h1>

        {/* Search and Pagination Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative w-full max-w-sm">
            <Input
              type="search"
              placeholder="Search characters..."
              value={name}
              onChange={(e) => handleNameChange(e)}
              className="pr-10 border-primary/20 focus-visible:ring-primary"
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          </div>

          {/* Selected Characters */}
          <div className="flex items-center gap-2">
            {currentQuery.characters?.split(",").map((characterName) => (
              <Button
                key={characterName}
                variant="outline"
                size="sm"
                onClick={() => handleRemoveCharacter(characterName)}
              >
                {characterName}
                <X className="ml-2 h-4 w-4" />
              </Button>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center gap-2 bg-card rounded-lg p-2 shadow-sm">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((old) => Math.max(old - 1, 1))}
              disabled={page === 1 || isFetching}
            >
              Previous
            </Button>

            <span className="px-4 text-sm font-medium">
              {" "}
              {1 + (page - 1) * 50} to {50 + (page - 1) * 50}
            </span>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((old) => (data?.hasMore ? old + 1 : old))}
              disabled={isPlaceholderData || !data?.hasMore || isFetching}
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {status === "pending" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {Array(10)
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                className="bg-card rounded-xl shadow-md overflow-hidden h-64"
              >
                <Skeleton className="h-40 w-full" />
                <div className="p-4">
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
        </div>
      ) : status === "error" ? (
        <div className="bg-destructive/10 text-destructive p-6 rounded-lg text-center">
          <p className="font-semibold">Error loading characters</p>
          <p className="text-sm mt-2">{(error as Error).message}</p>
        </div>
      ) : (
        <>
          {/* Loading indicator */}
          {isFetching && (
            <div className="absolute top-4 right-4 bg-primary/10 text-primary rounded-full px-3 py-1 text-xs font-medium animate-pulse">
              Loading...
            </div>
          )}

          {/* Character Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
            {data?.characters.map((character, i) => (
              <CharacterCard key={i} character={character} />
            ))}
          </div>

          {/* Empty state */}
          {data?.characters.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="bg-muted/30 rounded-full p-8 mb-4">
                <Search className="h-12 w-12 text-muted-foreground/50" />
              </div>
              <h3 className="text-xl font-medium mb-2">No characters found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or browse all characters
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );

  function CharacterCard({ character }: { character: Character }) {
    return (
      <div className="bg-card rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg h-64 flex flex-col group relative">
        {character.imageUrl ? (
          <div className="relative w-full h-40 bg-muted/30">
            <Image
              src={character.imageUrl}
              alt={character.name}
              fill
              className="object-contain"
            />
          </div>
        ) : (
          <div className="w-full h-40 bg-muted/50 flex items-center justify-center">
            <span className="text-muted-foreground">No image</span>
          </div>
        )}
        <div className="p-4 flex-grow flex flex-col justify-center">
          <h3 className="text-center font-medium text-primary transition-colors">
            {character.name}
          </h3>
        </div>

        {/* Hover Overlay with Buttons */}
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4 gap-3">
          <h3 className="text-lg font-semibold text-primary mb-2">
            {character.name}
          </h3>
          <div className="flex flex-col gap-2">
            <CharacterActionButton
              character={character}
              type="view"
              currentQuery={currentQuery}
            />
            <CharacterActionButton
              character={character}
              type="compare"
              currentQuery={currentQuery}
            />
          </div>
        </div>
      </div>
    );
  }
}

// Component for View and Compare buttons
function CharacterActionButton({
  character,
  type,
  currentQuery,
}: {
  character: Character;
  type: "view" | "compare";
  currentQuery: Record<string, string>;
}) {
  const router = useRouter();

  // Handle click based on button type
  const handleClick = () => {
    const query = new URLSearchParams(currentQuery);
    if (type === "view") {
      router.push(
        `/character/${encodeURIComponent(character.name)}?${query.toString()}`
      );
    } else if (type === "compare") {
      const charactersList = query.get("characters")?.split(",") || [];

      if (charactersList.length >= 2) {
        query.delete("characters");
      }

      if (!query.get("characters")) {
        const newQuery = new URLSearchParams(currentQuery);
        newQuery.set("characters", character.name);
        router.replace(`${window.location.pathname}?${newQuery.toString()}`);
      } else {
        if (charactersList.includes(character.name)) {
          return;
        }
        charactersList.push(character.name);
        const limitedList = charactersList.slice(0, 2);
        const newQuery = new URLSearchParams(currentQuery);
        newQuery.set("characters", limitedList.join(","));
        router.replace(`/compare?${newQuery.toString()}`);
      }
    }
  };

  // Determine if this character is already selected for comparison
  const isSelected = () => {
    if (!currentQuery.characters) return false;
    return currentQuery.characters.split(",").includes(character.name);
  };

  // Style and content based on button type
  const buttonConfig = {
    view: {
      icon: <Eye className="h-4 w-4 mr-1" />,
      text: "View",
      variant: "default" as const,
    },
    compare: {
      icon: <GitCompare className="h-4 w-4 mr-1" />,
      text: isSelected() ? "Selected" : "Compare",
      variant: isSelected() ? ("outline" as const) : ("secondary" as const),
    },
  };

  const config = buttonConfig[type];

  return (
    <Button
      size="sm"
      variant={config.variant}
      onClick={handleClick}
      className={`flex items-center ${
        type === "compare" && isSelected() ? "border-primary text-primary" : ""
      }`}
      disabled={type === "compare" && isSelected()}
    >
      {config.icon}
      {config.text}
    </Button>
  );
}
