"use client";
import { Character } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { fetchCharacters } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import Image from "next/image";

export default function Comparison() {
  const searchParams = useSearchParams();

  const character1Name = searchParams.get("character1") || "";
  const character2Name = searchParams.get("character2") || "";

  console.log({ character1Name });
  console.log({ character2Name });

  const { status, data, error } = useQuery({
    queryKey: ["character1", character1Name],
    queryFn: () => fetchCharacters(1, character1Name),
    enabled: !!character1Name,
  });

  const {
    status: status2,
    data: data2,
    error: error2,
  } = useQuery({
    queryKey: ["character2", character2Name],
    queryFn: () => fetchCharacters(1, character2Name),
    enabled: !!character2Name,
  });

  //   if (status === "pending" || status2 === "pending") {
  //     return <div className="text-center p-8">Loading character data...</div>;
  //   }

  if (error || error2) {
    return (
      <div className="text-center p-8 text-destructive">
        Error loading character data
      </div>
    );
  }

  return (
    <div className="p-4">
      <ComparisonColumn
        character1={data?.characters[0]}
        character2={data2?.characters[0]}
      />
    </div>
  );
}

function ComparisonColumn({
  character1,
  character2,
}: {
  character1?: Character | undefined;
  character2?: Character | undefined;
}) {
  // Create arrays of comparison attributes
  const attributes = [
    {
      label: "Allies",
      value1: character1?.allies?.length ?? "",
      value2: character2?.allies?.length ?? "",
    },
    {
      label: "Enemies",
      value1: character1?.enemies?.length ?? "",
      value2: character2?.enemies?.length ?? "",
    },
    {
      label: "Films",
      value1: character1?.films?.length ?? "",
      value2: character2?.films?.length ?? "",
    },
    {
      label: "Short Films",
      value1: character1?.shortFilms?.length ?? "",
      value2: character2?.shortFilms?.length ?? "",
    },
    {
      label: "TV Shows",
      value1: character1?.tvShows?.length ?? "",
      value2: character2?.tvShows?.length ?? "",
    },
    {
      label: "Video Games",
      value1: character1?.videoGames?.length ?? "",
      value2: character2?.videoGames?.length ?? "",
    },
    {
      label: "Park Attractions",
      value1: character1?.parkAttractions?.length ?? "",
      value2: character2?.parkAttractions?.length ?? "",
    },
  ];

  function CharacterHeader({
    character,
  }: {
    character?: Character | undefined;
  }) {
    return (
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

  return (
    <div className="bg-card rounded-lg shadow-lg p-6">
      {/* Character Names and Images Header */}
      <div className="grid grid-cols-3 gap-4 mb-8 items-center">
        <CharacterHeader character={character1} />

        <div className="text-center w-16 h-16 mx-auto rounded-full bg-accent flex items-center justify-center mb-4">
          <span className="text-2xl font-bold text-accent-foreground">VS</span>
        </div>
        <CharacterHeader character={character2} />
      </div>

      {/* Attributes Comparison */}
      <div className="bg-muted/30 rounded-lg py-2 space-y-2">
        {attributes.map((attr, index) => (
          <div
            key={attr.label}
            className={`grid grid-cols-3 gap-4 items-center p-3 ${
              index % 2 === 1 ? "bg-background/60" : "bg-muted"
            } rounded-md `}
          >
            <div className="text-center text-xl font-medium">{attr.value1}</div>
            <div className="text-center text-lg font-semibold text-secondary-foreground">
              {attr.label}
            </div>
            <div className="text-center text-xl font-medium">{attr.value2}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
