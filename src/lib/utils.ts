import { CharacterRouteResponse } from "@/app/api/character/route";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const fetchCharacters = async (
  page = 1,
  name = ""
): Promise<CharacterRouteResponse> => {
  const response = await fetch(`/api/character?page=${page}&name=${name}`);
  return await response.json();
};
