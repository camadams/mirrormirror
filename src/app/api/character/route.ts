import { Character } from "@/lib/types";

export type CharacterRouteResponse = {
  characters: Array<Character>;
  error?: string;
  hasMore: boolean;
};

const parseDisneyResponse = (data: any): Array<Character> => {
  if (!Array.isArray(data)) {
    data = [data];
  }

  return data.map((item: any) => ({
    name: item.name,
    imageUrl: item.imageUrl,
    // Add more fields as needed
    id: item._id,
    films: item.films,
    shortFilms: item.shortFilms,
    tvShows: item.tvShows,
    videoGames: item.videoGames,
    parkAttractions: item.parkAttractions,
    allies: item.allies,
    enemies: item.enemies,
  }));
};

export async function GET(req: Request) {
  const url = new URL(req.url);
  const page = Number(url.searchParams.get("page")) || 1;
  const name = url.searchParams.get("name") || "";
  console.log({ name });
  try {
    // Construct the API URL based on parameters
    const apiUrl = `https://api.disneyapi.dev/character?page=${page}&name=${name}`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    const result = parseDisneyResponse(data.data);

    return Response.json({
      characters: result,
      hasMore: !!data.info?.nextPage,
    });
  } catch (error) {
    console.error("Error fetching character data:", error);
    return Response.json({
      error: "Error fetching character data",
      characters: [],
      hasMore: false,
    });
  }
}
