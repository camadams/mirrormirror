import { CharacterRouteResponse } from "@/app/api/character/route";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Character } from "./types";

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

/**
 * Calculate which character has more appearances overall across different media
 * @param char1 First character to compare
 * @param char2 Second character to compare
 * @returns 0 if char1 wins, 1 if char2 wins, or -1 in case of a tie
 */
export const calculateWinner = (char1: Character, char2: Character): number => {
  // Define the categories to compare
  const categories = [
    'films',
    'shortFilms',
    'tvShows',
    'videoGames',
    'parkAttractions',
    'allies',
    'enemies'
  ];
  
  // Calculate total scores
  let char1Score = 0;
  let char2Score = 0;
  
  // Count all appearances across categories
  categories.forEach(category => {
    const char1Count = char1[category as keyof Character]?.length || 0;
    const char2Count = char2[category as keyof Character]?.length || 0;
    
    char1Score += char1Count;
    char2Score += char2Count;
  });
  
  // Return winner index (0 for char1, 1 for char2, -1 for tie)
  if (char1Score > char2Score) return 0;
  if (char2Score > char1Score) return 1;
  
  // In case of a tie, return -1 (no winner)
  return -1;
};
