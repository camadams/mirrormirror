import { CharacterRouteResponse } from "@/app/api/characters/route";
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
  const response = await fetch(`/api/characters?page=${page}&name=${name}`, {
    method: "GET",
  });
  return await response.json();
};

/**
 * Calculate which character has more appearances overall across different media
 * @param char1 First character to compare
 * @param char2 Second character to compare
 * @returns 0 if char1 wins, 1 if char2 wins, or -1 in case of a tie
 */
export const calculateWinner = (char1: Character, char2: Character): number => {
  const attributes = getScoringAttributes(char1, char2);

  let char1Score = 0;
  let char2Score = 0;
  for (const attribute of attributes) {
    if (attribute.value1! > attribute.value2!) {
      char1Score++;
    } else if (attribute.value2! > attribute.value1!) {
      char2Score++;
    }
  }

  if (char1Score > char2Score) return 0;
  if (char2Score > char1Score) return 1;

  return -1;
};

/**
 * Returns an array of objects with `label`, `value1`, and `value2` properties,
 * where `value1` and `value2` are the lengths of the corresponding arrays in
 * `character1` and `character2`, respectively.
 *
 * The returned array is sorted alphabetically by `label`.
 *
 * @param character1 First character to compare
 * @param character2 Second character to compare
 * @returns An array of objects with `label`, `value1`, and `value2` properties
 */
export const getScoringAttributes = (
  character1?: Character,
  character2?: Character
) => {
  return [
    {
      label: "Likeability",
      value1: calculateLikeability(character1),
      value2: calculateLikeability(character2),
    },
    {
      label: "Motion Diversity",
      value1: calculateFormatSpread(character1),
      value2: calculateFormatSpread(character2),
    },
    {
      label: "Motion Appearances",
      value1: calculateMotionPictureAppearances(character1),
      value2: calculateMotionPictureAppearances(character2),
    },
    {
      label: "Park Appearances",
      value1: character1?.parkAttractions?.length,
      value2: character2?.parkAttractions?.length,
    },
  ];
};

function calculateLikeability(character?: Character) {
  const allies = character?.allies || [];
  const enemies = character?.enemies || [];
  const totalRelationships = allies.length + enemies.length;
  if (totalRelationships === 0) {
    return 50;
  }
  const positivePercentage = (allies.length / totalRelationships) * 100;
  return Math.round(positivePercentage);
}

function calculateFormatSpread(character?: Character) {
  const isInFilms = (character?.films?.length ?? 0) > 0;
  const isInShortFilms = (character?.shortFilms?.length ?? 0) > 0;
  const isInTvShows = (character?.tvShows?.length ?? 0) > 0;
  const isInVideoGames = (character?.videoGames?.length ?? 0) > 0;

  const totalFormatCount =
    (isInFilms ? 1 : 0) +
    (isInShortFilms ? 1 : 0) +
    (isInTvShows ? 1 : 0) +
    (isInVideoGames ? 1 : 0);

  return totalFormatCount;
}

function calculateMotionPictureAppearances(character?: Character) {
  const filmsLength = character?.films?.length ?? 0;
  const shortFilmsLength = character?.shortFilms?.length ?? 0;
  const tvShowsLength = character?.tvShows?.length ?? 0;
  const videoGamesLength = character?.videoGames?.length ?? 0;

  return filmsLength + shortFilmsLength + tvShowsLength + videoGamesLength;
}
