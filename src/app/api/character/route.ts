import { Character } from "@/lib/types";

export type CharacterRouteResponse = {
  characters: Array<Character>;
  error?: string;
  hasMore: boolean;
};

const parseDisneyResponse = (data: any): Array<Character> => {
  return data.map((item: any) => ({
    name: item.name,
    imageUrl: item.imageUrl,
  }));
};

export async function GET(req: Request) {
  const url = new URL(req.url);
  const page = Number(url.searchParams.get("page")) || 0;

  console.log({ page });
  try {
    const response = await fetch(
      `https://api.disneyapi.dev/character?page=${page}`
    );
    const data = await response.json();
    const result = parseDisneyResponse(data.data);
    // console.log(data);
    return Response.json({
      characters: result,
      hasMore: true,
    });
  } catch (error) {
    console.error("Error fetching character data:", error);
    return Response.json({
      error: "Error fetching character data",
      hasMore: false,
    });
  }
}
