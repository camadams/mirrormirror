"use client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { CharacterRouteResponse } from "@/app/api/character/route";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { useDebouncedValue } from "@tanstack/react-pacer";
import Link from "next/link";

const fetchCharacters = async (
  page = 1,
  name = ""
): Promise<CharacterRouteResponse> => {
  const response = await fetch(`/api/character?page=${page}&name=${name}`);
  return await response.json();
};

export default function Character() {
  const [page, setPage] = useState(1);
  const [name, setName] = useState("");

  const [debouncedName] = useDebouncedValue(name, {
    wait: 500,
    onExecute: () => setPage(1),
  });

  const queryClient = useQueryClient();
  const { status, data, error, isFetching, isPlaceholderData } = useQuery({
    queryKey: ["characters", page, debouncedName],
    queryFn: () => fetchCharacters(page, debouncedName),
    staleTime: 5000,
  });

  useEffect(() => {
    if (!isPlaceholderData && data?.hasMore) {
      queryClient.prefetchQuery({
        queryKey: ["characters", page + 1, debouncedName],
        queryFn: () => fetchCharacters(page + 1, debouncedName),
      });
    }
  }, [data, isPlaceholderData, page, debouncedName, queryClient]);

  function Page() {
    return (
      <>
        <div>Current Page: {page}</div>
        <button
          onClick={() => setPage((old) => Math.max(old - 1, 1))}
          disabled={page === 1}
        >
          Previous Page
        </button>{" "}
        <button
          onClick={() => {
            setPage((old) => (data?.hasMore ? old + 1 : old));
          }}
          disabled={isPlaceholderData || !data?.hasMore}
        >
          Next Page
        </button>
      </>
    );
  }

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    setName(e.target.value);
  }
  return (
    <div>
      <div className="max-w-sm">
        <Input
          type="search"
          placeholder="Search..."
          value={name}
          onChange={(e) => handleNameChange(e)}
        />
      </div>
      {status === "pending" ? (
        <div>Loading...</div>
      ) : status === "error" ? (
        <div>Error: {error.message}</div>
      ) : (
        // `data` will either resolve to the latest page's data
        // or if fetching a new page, the last successful page's data
        <div>
          <Page />
          {/* {
            // Since the last page's data potentially sticks around between page requests,
            // we can use `isFetching` to show a background loading
            // indicator since our `status === 'pending'` state won't be triggered
            isFetching ? <span> Loading...</span> : null
          } */}
          <div className="flex justify-center ">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8 gap-4 w-full h-[calc(100vh-20rem)]">
              {data?.characters.map((character, i) => (
                <div key={i}>
                  <Link
                    href={`/character/${encodeURIComponent(character.name)}`}
                    className="block bg-accent rounded-lg hover:bg-accent/80 transition-colors"
                  >
                    <div className="flex flex-col items-center">
                      {character.imageUrl ? (
                        <div className="relative w-full h-40">
                          <Image
                            src={character.imageUrl}
                            alt={character.name}
                            fill
                            className="object-contain"
                            placeholder="blur"
                            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
                          />
                        </div>
                      ) : (
                        <div className="w-full h-40 bg-gray-200 flex items-center justify-center ">
                          <span className="text-gray-500">No image</span>
                        </div>
                      )}
                      <div className="text-center font-medium hover:underline text-sm text-nowrap text-overflow">
                        {character.name}
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
