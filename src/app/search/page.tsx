"use client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { CharacterRouteResponse } from "@/app/api/character/route";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { useDebouncedValue } from "@tanstack/react-pacer";

const fetchCharacters = async (
  page = 1,
  name = ""
): Promise<CharacterRouteResponse> => {
  const response = await fetch(`/api/character?page=${page}&name=${name}`);
  return await response.json();
};

export default function Search() {
  const [page, setPage] = useState(1);
  const [name, setName] = useState("");

  const [debouncedName] = useDebouncedValue(name, {
    wait: 500,
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
      <div className="w-1/2">
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
          <div className="grid grid-cols-5 gap-10 ">
            {data?.characters.map((character, i) => (
              <div
                key={i}
                className="flex items-center bg-accent p-4 rounded-lg"
              >
                {character.imageUrl ? (
                  <div className="relative w-40 h-40">
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
                  <div>No image</div>
                )}
                <div className="flex-0">{character.name}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
