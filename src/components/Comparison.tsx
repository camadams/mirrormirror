"use client";
import { Character } from "@/lib/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CharacterRouteResponse } from "@/app/api/character/route";
import { fetchCharacters } from "@/lib/utils";
import { useSearchParams } from "next/navigation";

export default function Comparison() {
  const searchParams = useSearchParams();

  const character1Name = searchParams.get("character1") || "";
  const character2Name = searchParams.get("character2") || "";

  const { status, data, error } = useQuery({
    queryKey: ["character", character1Name],
    queryFn: () => fetchCharacters(1, character1Name),
  });

  const {
    status: status2,
    data: data2,
    error: error2,
  } = useQuery({
    queryKey: ["character", character2Name],
    queryFn: () => fetchCharacters(1, character2Name),
  });

  return (
    <div>
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
  character1: Character | undefined;
  character2?: Character | undefined;
}) {
  return (
    <div className="space-y-4">
      <div className="flex text-2xl">
        <div className="flex-1 text-center">{character1?.name}</div>
        <div className="flex-1 text-center">vs</div>
        <div className="flex-1 text-center">{character2?.name}</div>
      </div>
      <div className="flex text-2xl">
        <div className="flex-1 text-center">
          {character1?.allies?.length ?? 0}
        </div>
        <div className="flex-1 text-center">Allies</div>
        <div className="flex-1 text-center">
          {character2?.allies?.length ?? 0}
        </div>
      </div>
      <div className="flex text-2xl">
        <div className="flex-1 text-center">
          {character1?.films?.length ?? 0}
        </div>
        <div className="flex-1 text-center">Films</div>
        <div className="flex-1 text-center">
          {character2?.films?.length ?? 0}
        </div>
      </div>
      <div className="flex text-2xl">
        <div className="flex-1 text-center">
          {character1?.shortFilms?.length ?? 0}
        </div>
        <div className="flex-1 text-center">Short Films</div>
        <div className="flex-1 text-center">
          {character2?.shortFilms?.length ?? 0}
        </div>
      </div>
      <div className="flex text-2xl">
        <div className="flex-1 text-center">
          {character1?.tvShows?.length ?? 0}
        </div>
        <div className="flex-1 text-center">TV Shows</div>
        <div className="flex-1 text-center">
          {character2?.tvShows?.length ?? 0}
        </div>
      </div>
      <div className="flex text-2xl">
        <div className="flex-1 text-center">
          {character1?.videoGames?.length ?? 0}
        </div>
        <div className="flex-1 text-center">Video Games</div>
        <div className="flex-1 text-center">
          {character2?.videoGames?.length ?? 0}
        </div>
      </div>
      <div className="flex text-2xl">
        <div className="flex-1 text-center">
          {character1?.parkAttractions?.length ?? 0}
        </div>
        <div className="flex-1 text-center">Park Attractions</div>
        <div className="flex-1 text-center">
          {character2?.parkAttractions?.length ?? 0}
        </div>
      </div>
      <div className="flex text-2xl">
        <div className="flex-1 text-center">
          {character1?.enemies?.length ?? 0}
        </div>
        <div className="flex-1 text-center">Enemies</div>
        <div className="flex-1 text-center">
          {character2?.enemies?.length ?? 0}
        </div>
      </div>
    </div>
  );
}
