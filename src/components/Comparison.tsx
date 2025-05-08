"use client";
import { Character } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { fetchCharacters } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { Skeleton } from "./ui/skeleton";

export default function Comparison() {
  const searchParams = useSearchParams();

  const character1Name = searchParams.get("character1") || "";
  const character2Name = searchParams.get("character2") || "";

  const {
    status,
    data,
    isLoading: character1IsLoading,
    error,
  } = useQuery({
    queryKey: ["character1", character1Name],
    queryFn: () => fetchCharacters(1, character1Name),
    enabled: !!character1Name,
  });

  const character1 = data?.characters[0];

  const {
    data: data2,
    error: error2,
    isLoading: character2IsLoading,
  } = useQuery({
    queryKey: ["character2", character2Name],
    queryFn: () => fetchCharacters(1, character2Name),
    enabled: !!character2Name,
  });

  const character2 = data2?.characters[0];

  if (error || error2) {
    return (
      <div className="text-center p-8 text-destructive">
        Error loading character data
      </div>
    );
  }

  return (
    <div className="p-4">
      <ComparisonColumn />
    </div>
  );

  function ComparisonColumn() {
    // Create arrays of comparison attributes
    const attributes = [
      {
        label: "Allies",
        value1: character1?.allies?.length,
        value2: character2?.allies?.length,
      },
      {
        label: "Enemies",
        value1: character1?.enemies?.length,
        value2: character2?.enemies?.length,
      },
      {
        label: "Films",
        value1: character1?.films?.length,
        value2: character2?.films?.length,
      },
      {
        label: "Short Films",
        value1: character1?.shortFilms?.length,
        value2: character2?.shortFilms?.length,
      },
      {
        label: "TV Shows",
        value1: character1?.tvShows?.length,
        value2: character2?.tvShows?.length,
      },
      {
        label: "Video Games",
        value1: character1?.videoGames?.length,
        value2: character2?.videoGames?.length,
      },
      {
        label: "Park Attractions",
        value1: character1?.parkAttractions?.length,
        value2: character2?.parkAttractions?.length,
      },
    ];

    return (
      <div className="bg-card rounded-lg shadow-lg p-6">
        {/* Character Names and Images Header */}
        <div className="grid grid-cols-3 gap-4 items-center">
          <CharacterHeader
            character={character1}
            isLoading={character1IsLoading}
          />

          <div className="text-center w-16 h-16 mx-auto rounded-full bg-accent flex items-center justify-center mb-4">
            <span className="text-2xl font-bold text-accent-foreground">
              VS
            </span>
          </div>
          <CharacterHeader
            character={character2}
            isLoading={character2IsLoading}
          />
        </div>

        {/* Attributes Comparison */}
        <div className="bg-muted/30 rounded-lg py-2 space-y-2">
          {attributes.map((attr, index) => (
            <ComparisonRow key={attr.label} attribute={attr} index={index} />
          ))}
        </div>
      </div>
    );

    function CharacterHeader({
      character,
      isLoading,
    }: {
      character?: Character | undefined;
      isLoading?: boolean;
    }) {
      return isLoading ? (
        <Skeleton className="w-32 h-32 mx-auto rounded-full overflow-hidden mb-4 bg-muted" />
      ) : (
        <div>
          <div className="w-32 h-32 mx-auto rounded-full overflow-hidden mb-4 bg-muted">
            {character?.imageUrl && (
              <Image
                src={character.imageUrl}
                alt={character.name || ""}
                width={128}
                height={128}
                className="object-cover w-full h-full"
              />
            )}
          </div>
          <h2 className="text-xl font-bold text-primary text-center">
            {character?.name || ""}
          </h2>
        </div>
      );
    }

    function ComparisonRow({
      attribute,
      index,
    }: {
      attribute: {
        label: string;
        value1?: number;
        value2?: number;
      };
      index: number;
    }) {
      // Determine which value is greater (if both exist)
      const value1 = attribute.value1 || 0;
      const value2 = attribute.value2 || 0;
      const isValue1Greater = value1 > value2;
      const isValue2Greater = value2 > value1;

      const getValueClass = (isGreater: boolean) => {
        if (isGreater) {
          return "text-primary font-bold";
        }
      };

      return (
        <div
          key={attribute.label}
          className={`grid grid-cols-3 gap-4 items-center p-3 ${
            index % 2 === 1 ? "bg-background/60" : "bg-muted"
          } rounded-md`}
        >
          <div
            className={`text-center text-2xl  ${getValueClass(
              isValue1Greater
            )}`}
          >
            {attribute.value1 || 0}
          </div>
          <div className="text-center text-lg font-semibold text-secondary-foreground">
            {attribute.label}
          </div>
          <div
            className={`text-center text-2xl  ${getValueClass(
              isValue2Greater
            )}`}
          >
            {attribute.value2 || 0}
          </div>
        </div>
      );
    }
  }
}
