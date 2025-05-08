"use client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CharacterRouteResponse } from "@/app/api/character/route";
import Image from "next/image";
import { useParams } from "next/navigation";
import Link from "next/link";

const fetchCharacter = async (
  name: string
): Promise<CharacterRouteResponse> => {
  const response = await fetch(
    `/api/character?name=${encodeURIComponent(name)}`
  );
  return await response.json();
};

export default function CharacterDetail() {
  const queryClient = useQueryClient();

  const cachedData = queryClient.getQueryData<CharacterRouteResponse>([
    "character",
    1,
    "Achilles",
  ]);

  console.log(cachedData);

  const params = useParams();
  const characterName = decodeURIComponent(params.name as string);

  const { status, data, error } = useQuery({
    queryKey: ["character", characterName],
    queryFn: () => fetchCharacter(characterName),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return (
    <div className="p-8">
      <Link
        href="/character"
        className="text-blue-500 hover:underline mb-4 inline-block"
      >
        &larr; Back to all characters
      </Link>

      <h1 className="text-3xl font-bold mb-6">{characterName}</h1>

      {status === "pending" ? (
        <div className="text-xl">Loading character information...</div>
      ) : status === "error" ? (
        <div className="text-red-500">Error: {error.message}</div>
      ) : data?.error ? (
        <div className="text-red-500">{data.error}</div>
      ) : data?.characters && data.characters.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-accent p-6 rounded-lg">
            {data.characters[0].imageUrl ? (
              <div className="relative w-full h-96 mb-4">
                <Image
                  src={data.characters[0].imageUrl}
                  alt={data.characters[0].name}
                  fill
                  className="object-contain"
                />
              </div>
            ) : (
              <div className="w-full h-96 bg-gray-200 flex items-center justify-center mb-4">
                <span className="text-gray-500">No image available</span>
              </div>
            )}
            <h2 className="text-2xl font-semibold mb-2">
              {data.characters[0].name}
            </h2>
            {data.characters[0].id && (
              <p className="text-gray-500 mb-4">ID: {data.characters[0].id}</p>
            )}
          </div>

          <div className="space-y-6">
            {data.characters[0].films &&
              data.characters[0].films.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold mb-2">Films</h3>
                  <ul className="list-disc pl-5">
                    {data.characters[0].films.map((film, index) => (
                      <li key={index}>{film}</li>
                    ))}
                  </ul>
                </div>
              )}

            {data.characters[0].tvShows &&
              data.characters[0].tvShows.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold mb-2">TV Shows</h3>
                  <ul className="list-disc pl-5">
                    {data.characters[0].tvShows.map((show, index) => (
                      <li key={index}>{show}</li>
                    ))}
                  </ul>
                </div>
              )}

            {data.characters[0].videoGames &&
              data.characters[0].videoGames.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold mb-2">Video Games</h3>
                  <ul className="list-disc pl-5">
                    {data.characters[0].videoGames.map((game, index) => (
                      <li key={index}>{game}</li>
                    ))}
                  </ul>
                </div>
              )}

            {data.characters[0].parkAttractions &&
              data.characters[0].parkAttractions.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    Park Attractions
                  </h3>
                  <ul className="list-disc pl-5">
                    {data.characters[0].parkAttractions.map(
                      (attraction, index) => (
                        <li key={index}>{attraction}</li>
                      )
                    )}
                  </ul>
                </div>
              )}

            {data.characters[0].allies &&
              data.characters[0].allies.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold mb-2">Allies</h3>
                  <ul className="list-disc pl-5">
                    {data.characters[0].allies.map((ally, index) => (
                      <li key={index}>{ally}</li>
                    ))}
                  </ul>
                </div>
              )}

            {data.characters[0].enemies &&
              data.characters[0].enemies.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold mb-2">Enemies</h3>
                  <ul className="list-disc pl-5">
                    {data.characters[0].enemies.map((enemy, index) => (
                      <li key={index}>{enemy}</li>
                    ))}
                  </ul>
                </div>
              )}
          </div>
        </div>
      ) : (
        <div className="text-xl">Character not found</div>
      )}
    </div>
  );
}
